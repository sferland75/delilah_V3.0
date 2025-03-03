/**
 * ReferralDetector.js
 * Specialized detector for referral documents in Delilah V3.0
 * 
 * This component identifies referral documents and extracts their sections
 * to prepare for detailed extraction.
 */

const CONFIDENCE = {
  VERY_HIGH: 0.95,
  HIGH: 0.85,
  MEDIUM: 0.7,
  LOW: 0.5,
  VERY_LOW: 0.3,
  NONE: 0
};

/**
 * Detect if a document is a referral document
 * @param {string} text - The text content of the document
 * @returns {Object} Detection result with confidence score
 */
function detectReferralDocument(text) {
  if (!text || typeof text !== 'string') {
    return {
      isReferral: false,
      confidence: CONFIDENCE.NONE,
      documentType: 'UNKNOWN'
    };
  }
  
  // Keywords that strongly indicate a referral document
  const strongIndicators = [
    /referral/i,
    /assessor instructions/i,
    /assessment services coordinator/i,
    /please conduct.*?assessment/i,
    /appointment information/i,
    /the following assessment/i,
    /on behalf of/i
  ];
  
  // Keywords that are moderately suggestive of a referral document
  const moderateIndicators = [
    /please address the following/i,
    /date of loss/i,
    /file no/i,
    /assessment.*?due/i,
    /report due/i,
    /client:\s*\w+/i
  ];
  
  // Count strong and moderate indicators
  let strongMatches = 0;
  let moderateMatches = 0;
  
  for (const pattern of strongIndicators) {
    if (pattern.test(text)) strongMatches++;
  }
  
  for (const pattern of moderateIndicators) {
    if (pattern.test(text)) moderateMatches++;
  }
  
  // Calculate confidence score
  const strongWeight = 0.7;
  const moderateWeight = 0.3;
  
  const maxStrongScore = strongIndicators.length * strongWeight;
  const maxModerateScore = moderateIndicators.length * moderateWeight;
  const maxTotalScore = maxStrongScore + maxModerateScore;
  
  const strongScore = strongMatches * strongWeight;
  const moderateScore = moderateMatches * moderateWeight;
  const totalScore = strongScore + moderateScore;
  
  // Normalize to 0-1 range
  const normalizedScore = maxTotalScore > 0 ? totalScore / maxTotalScore : 0;
  
  // Map to confidence levels
  let confidence;
  if (normalizedScore >= 0.8) {
    confidence = CONFIDENCE.VERY_HIGH;
  } else if (normalizedScore >= 0.6) {
    confidence = CONFIDENCE.HIGH;
  } else if (normalizedScore >= 0.4) {
    confidence = CONFIDENCE.MEDIUM;
  } else if (normalizedScore >= 0.2) {
    confidence = CONFIDENCE.LOW;
  } else {
    confidence = CONFIDENCE.VERY_LOW;
  }
  
  // Determine if this is a referral document
  const isReferral = normalizedScore >= 0.4; // At least MEDIUM confidence
  
  return {
    isReferral,
    confidence,
    documentType: isReferral ? 'REFERRAL' : 'UNKNOWN'
  };
}

/**
 * Detect sections in a referral document
 * @param {string} text - The text content of the document
 * @returns {Object} Detected sections with confidence scores
 */
function detectReferralSections(text) {
  if (!text || typeof text !== 'string') {
    return {
      sections: {},
      confidence: CONFIDENCE.NONE
    };
  }
  
  const sections = {};
  
  // Define section patterns
  const sectionPatterns = [
    {
      name: 'CLIENT_INFO',
      pattern: /(?:CLIENT|DOB|DATE OF LOSS|FILE NO)[\s\S]{0,500}(?=(?:Assessment Requirements|Fee:|Services Requested|Assessor Instructions|\n\n\n)|\Z)/i,
      confidence: CONFIDENCE.HIGH
    },
    {
      name: 'ASSESSMENT_REQUIREMENTS',
      pattern: /(?:Assessment Requirements|Services Requested|You will be conducting|[\n\r].*?address(?:ing)? all impairments)[\s\S]{0,1000}(?=(?:Fee:|appointment information|Report Due|Below is your|Fees:)|\Z)/i,
      confidence: CONFIDENCE.MEDIUM
    },
    {
      name: 'SCHEDULING_INFO',
      pattern: /(?:appointment information|Below is your appointment|Assessor\s+Type\s+Location)[\s\S]{0,1000}(?=(?:Please submit|Report & Invoice|Upon completion|Should you have)|\Z)/i,
      confidence: CONFIDENCE.HIGH
    },
    {
      name: 'REPORTING_REQUIREMENTS',
      pattern: /(?:Report & Invoice Guidelines|Report Due:|Reports are due)[\s\S]{0,500}(?=(?:contact|sincerely|Yours truly)|\Z)/i,
      confidence: CONFIDENCE.MEDIUM
    },
    {
      name: 'REFERRAL_SOURCE',
      pattern: /(?:Yours sincerely|Yours truly|Sincerely)[,\s]+([\s\S]{0,100})/i,
      confidence: CONFIDENCE.MEDIUM
    }
  ];
  
  // Detect sections
  let totalConfidence = 0;
  let sectionCount = 0;
  
  for (const { name, pattern, confidence } of sectionPatterns) {
    const match = text.match(pattern);
    if (match) {
      sections[name] = {
        text: match[0],
        confidence
      };
      totalConfidence += confidence;
      sectionCount++;
    }
  }
  
  // Calculate average confidence
  const averageConfidence = sectionCount > 0 ? totalConfidence / sectionCount : 0;
  
  return {
    sections,
    confidence: averageConfidence
  };
}

/**
 * Process referral document and extract structured data
 * @param {string} text - The text content of the document
 * @returns {Object} Processed referral data
 */
function processReferralDocument(text) {
  // First check if this is a referral document
  const detection = detectReferralDocument(text);
  
  if (!detection.isReferral) {
    return {
      documentType: 'UNKNOWN',
      confidence: detection.confidence,
      data: {},
      rawText: text
    };
  }
  
  // Detect sections
  const sectionDetection = detectReferralSections(text);
  
  // Import the REFERRALExtractor
  const { extractReferralData } = require('./REFERRALExtractor');
  
  // Extract data from the document
  const extractedData = extractReferralData(text);
  
  return {
    documentType: 'REFERRAL',
    confidence: detection.confidence,
    sections: sectionDetection.sections,
    data: {
      REFERRAL: extractedData
    },
    rawText: text
  };
}

/**
 * Map extracted referral data to application model
 * @param {Object} processedData - The processed document data
 * @returns {Object} Data in application model format
 */
function mapReferralToApplicationModel(processedData) {
  if (!processedData || !processedData.data || !processedData.data.REFERRAL) {
    return { referral: {} };
  }
  
  const referralData = processedData.data.REFERRAL;
  
  // Map to application model format
  return {
    referral: {
      client: {
        name: referralData.clientInfo.name.value || '',
        dateOfBirth: referralData.clientInfo.dateOfBirth.value || '',
        dateOfLoss: referralData.clientInfo.dateOfLoss.value || '',
        fileNumber: referralData.clientInfo.fileNumber.value || '',
        language: referralData.clientInfo.language.value || '',
        phoneNumbers: referralData.clientInfo.phoneNumbers.value || [],
        address: referralData.clientInfo.address.value || '',
        email: referralData.clientInfo.email.value || ''
      },
      assessmentTypes: referralData.assessmentRequirements.assessmentTypes.value || [],
      reportTypes: referralData.assessmentRequirements.reportTypes.value || [],
      specificRequirements: referralData.assessmentRequirements.specificRequirements.value || [],
      criteria: referralData.assessmentRequirements.criteria.value || [],
      domains: referralData.assessmentRequirements.domains.value || [],
      appointments: referralData.schedulingInfo.appointments.value || [],
      reportDueDate: referralData.reportingRequirements.dueDate.value || '',
      reportGuidelines: referralData.reportingRequirements.guidelines.value || [],
      referralSource: {
        organization: referralData.referralSource.organization.value || '',
        contactPerson: referralData.referralSource.contactPerson.value || '',
        contactInfo: referralData.referralSource.contactInfo.value || ''
      },
      _metadata: {
        confidence: referralData.metadata.confidence,
        processingDate: new Date().toISOString(),
        version: referralData.metadata.extractorVersion
      }
    }
  };
}

module.exports = {
  detectReferralDocument,
  detectReferralSections,
  processReferralDocument,
  mapReferralToApplicationModel,
  CONFIDENCE
};
