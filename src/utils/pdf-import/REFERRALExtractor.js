/**
 * REFERRALExtractor.js
 * Specialized extractor for referral documents in Delilah V3.0
 * 
 * This extractor identifies and extracts key information from referral documents
 * to provide context for assessments.
 */

const { enhanceConfidenceScoring, CONFIDENCE } = require('./ReferralConfidenceScorer');

/**
 * Extract data from a referral document
 * @param {string} text - The text content of the referral document
 * @returns {Object} Extracted data with confidence scores
 */
function extractReferralData(text) {
  try {
    // Initialize extracted data structure
    const extractedData = {
      metadata: {
        documentType: 'REFERRAL',
        confidence: CONFIDENCE.MEDIUM,
        extractorVersion: '2.0.0'
      },
      clientInfo: {
        name: { value: '', confidence: 0 },
        dateOfBirth: { value: '', confidence: 0 },
        dateOfLoss: { value: '', confidence: 0 },
        fileNumber: { value: '', confidence: 0 },
        language: { value: '', confidence: 0 },
        phoneNumbers: { value: [], confidence: 0 },
        address: { value: '', confidence: 0 },
        email: { value: '', confidence: 0 }
      },
      assessmentRequirements: {
        assessmentTypes: { value: [], confidence: 0 },
        reportTypes: { value: [], confidence: 0 },
        specificRequirements: { value: [], confidence: 0 },
        criteria: { value: [], confidence: 0 },
        domains: { value: [], confidence: 0 }
      },
      schedulingInfo: {
        assessors: { value: [], confidence: 0 },
        appointments: { value: [], confidence: 0 },
        location: { value: '', confidence: 0 },
        interpreterNeeded: { value: false, confidence: 0 }
      },
      reportingRequirements: {
        dueDate: { value: '', confidence: 0 },
        templates: { value: [], confidence: 0 },
        guidelines: { value: [], confidence: 0 }
      },
      referralSource: {
        organization: { value: '', confidence: 0 },
        contactPerson: { value: '', confidence: 0 },
        contactInfo: { value: '', confidence: 0 }
      },
      rawText: text
    };

    // Extract client information
    extractClientInfo(text, extractedData);
    
    // Extract assessment requirements
    extractAssessmentRequirements(text, extractedData);
    
    // Extract scheduling information
    extractSchedulingInfo(text, extractedData);
    
    // Extract reporting requirements
    extractReportingRequirements(text, extractedData);
    
    // Extract referral source
    extractReferralSource(text, extractedData);
    
    // Apply enhanced confidence scoring
    const scoredData = enhanceConfidenceScoring(extractedData);

    return scoredData;
  } catch (error) {
    console.error('Error in ReferralExtractor:', error);
    return {
      metadata: {
        documentType: 'REFERRAL',
        confidence: CONFIDENCE.VERY_LOW,
        extractorVersion: '2.0.0',
        error: error.message
      },
      rawText: text
    };
  }
}

/**
 * Extract client information from referral text
 * @param {string} text - The document text
 * @param {Object} extractedData - The data object to populate
 */
function extractClientInfo(text, extractedData) {
  const clientInfo = extractedData.clientInfo;
  
  // Extract client name
  const namePattern = /CLIENT:?\s*([A-Za-z\s\-']+)/i;
  const nameMatch = text.match(namePattern);
  if (nameMatch && nameMatch[1]) {
    clientInfo.name.value = nameMatch[1].trim();
    clientInfo.name.confidence = CONFIDENCE.HIGH;
    clientInfo.name.extractionMethod = 'PATTERN_MATCH';
  }
  
  // Extract date of birth
  const dobPattern = /DOB:?\s*((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}|\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2})/i;
  const dobMatch = text.match(dobPattern);
  if (dobMatch && dobMatch[1]) {
    clientInfo.dateOfBirth.value = dobMatch[1].trim();
    clientInfo.dateOfBirth.confidence = CONFIDENCE.HIGH;
    clientInfo.dateOfBirth.extractionMethod = 'PATTERN_MATCH';
  }
  
  // Extract date of loss
  const dolPattern = /DATE OF LOSS:?\s*((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}|\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2})/i;
  const dolMatch = text.match(dolPattern);
  if (dolMatch && dolMatch[1]) {
    clientInfo.dateOfLoss.value = dolMatch[1].trim();
    clientInfo.dateOfLoss.confidence = CONFIDENCE.HIGH;
    clientInfo.dateOfLoss.extractionMethod = 'PATTERN_MATCH';
  }
  
  // Extract file number
  const fileNumberPattern = /FILE NO\.?:?\s*(\d+)/i;
  const fileNumberMatch = text.match(fileNumberPattern);
  if (fileNumberMatch && fileNumberMatch[1]) {
    clientInfo.fileNumber.value = fileNumberMatch[1].trim();
    clientInfo.fileNumber.confidence = CONFIDENCE.HIGH;
    clientInfo.fileNumber.extractionMethod = 'PATTERN_MATCH';
  }
  
  // Extract language requirements
  const languagePattern = /(?:INTERP(?:\/LANGUAGE)?|LANGUAGE|Interp):?\s*(Yes|No)?,?\s*([A-Za-z]+)?/i;
  const languageMatch = text.match(languagePattern);
  if (languageMatch) {
    if (languageMatch[1] && languageMatch[1].toLowerCase() === 'yes') {
      clientInfo.language.value = languageMatch[2] ? languageMatch[2].trim() : 'Required';
      clientInfo.language.confidence = languageMatch[2] ? CONFIDENCE.HIGH : CONFIDENCE.MEDIUM;
      clientInfo.language.extractionMethod = languageMatch[2] ? 'PATTERN_MATCH' : 'INFERRED';
    } else if (languageMatch[2]) {
      clientInfo.language.value = languageMatch[2].trim();
      clientInfo.language.confidence = CONFIDENCE.HIGH;
      clientInfo.language.extractionMethod = 'PATTERN_MATCH';
    }
  }
  
  // Extract phone numbers with more detailed pattern recognition
  const phonePatterns = [
    /(?:Phone|Client's Phone|Mobile|Tel):?\s*((?:\d{3}[-.\s]?\d{3}[-.\s]?\d{4}(?:\/\d{3}[-.\s]?\d{3}[-.\s]?\d{4})?)+)/i,
    /Phone:[\s\S]{0,50}?(\d{3}[-.\s]?\d{3}[-.\s]?\d{4})/i
  ];
  
  let phoneFound = false;
  for (const pattern of phonePatterns) {
    const phoneMatch = text.match(pattern);
    if (phoneMatch && phoneMatch[1]) {
      // Clean up and normalize phone numbers
      let phones = phoneMatch[1].split(/\/|\n/).map(p => {
        // Remove non-digit characters except for dashes and clean up
        let cleaned = p.trim().replace(/[^\d\-]/g, '');
        // Normalize format if needed
        if (cleaned.length === 10) {
          cleaned = `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
        }
        return cleaned;
      }).filter(p => p.length >= 10);
      
      if (phones.length > 0) {
        clientInfo.phoneNumbers.value = phones;
        clientInfo.phoneNumbers.confidence = CONFIDENCE.HIGH;
        clientInfo.phoneNumbers.extractionMethod = 'PATTERN_MATCH';
        phoneFound = true;
        break;
      }
    }
  }
  
  // Extract address with enhanced pattern recognition
  const addressPatterns = [
    /(?:Client's Home|address|location):?\s*([^,]+,\s*[A-Za-z\s]+,\s*[A-Z]{2}\s*[A-Z0-9]{1,3}\s*[A-Z0-9]{1,3})/i,
    /Location\s+(?:Client's Home:)?\s*([^,]+,\s*[A-Za-z\s]+,\s*[A-Z]{2}\s*[A-Z0-9]{1,3}\s*[A-Z0-9]{1,3})/i,
    /address:[\s\S]{0,20}?([^,\n]+,\s*[A-Za-z\s]+,\s*[A-Z]{2})/i
  ];
  
  for (const pattern of addressPatterns) {
    const addressMatch = text.match(pattern);
    if (addressMatch && addressMatch[1]) {
      clientInfo.address.value = addressMatch[1].trim();
      clientInfo.address.confidence = CONFIDENCE.MEDIUM;
      clientInfo.address.extractionMethod = 'PATTERN_MATCH';
      break;
    }
  }
  
  // Extract email with enhanced pattern
  const emailPatterns = [
    /Email:?\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i,
    /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i
  ];
  
  for (const pattern of emailPatterns) {
    const emailMatch = text.match(pattern);
    if (emailMatch && emailMatch[1]) {
      // Check if this looks like a client email address
      const emailContext = text.substring(Math.max(0, text.indexOf(emailMatch[1]) - 50), 
                                      Math.min(text.length, text.indexOf(emailMatch[1]) + 50));
      
      if (emailContext.toLowerCase().includes('client') || 
          !emailContext.toLowerCase().includes('assessor')) {
        clientInfo.email.value = emailMatch[1].trim();
        clientInfo.email.confidence = CONFIDENCE.HIGH;
        clientInfo.email.extractionMethod = 'PATTERN_MATCH';
        break;
      }
    }
  }
}

/**
 * Extract scheduling information from referral text
 * @param {string} text - The document text
 * @param {Object} extractedData - The data object to populate
 */
function extractSchedulingInfo(text, extractedData) {
  const scheduling = extractedData.schedulingInfo;
  
  // Extract appointments from table format
  const tablePattern = /Assessor\s+Type\s+Location\s+Date\/Time\/Duration\s+((?:[^\n]+\n){1,20})/gi;
  const tableMatch = text.match(tablePattern);
  
  if (tableMatch) {
    const appointments = [];
    const assessors = [];
    
    // Split by rows (assuming multi-line rows)
    const rows = tableMatch[0].split(/\n(?=[A-Za-z])/);
    
    rows.forEach(row => {
      if (!/^Assessor|^Type|^Location|^Date/.test(row)) {
        // Try to separate the row into column data
        const rowParts = row.split(/(?<=\w)\s{2,}(?=\w)/);
        
        if (rowParts.length >= 3) {
          const assessorInfo = rowParts[0].trim();
          const assessorMatch = assessorInfo.match(/([^,]+),\s*([^,]+)(?:,\s*([^,]+))?/);
          
          if (assessorMatch) {
            const assessor = {
              name: assessorMatch[1].trim(),
              title: assessorMatch[2].trim(),
              specialization: assessorMatch[3] ? assessorMatch[3].trim() : '',
              email: assessorInfo.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/) ? 
                     assessorInfo.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/)[1] : ''
            };
            
            assessors.push(assessor);
            
            // Extract appointment details
            const appointmentType = rowParts.length > 1 ? rowParts[1].trim() : '';
            const location = rowParts.length > 2 ? rowParts[2].trim() : '';
            
            let dateTime = '';
            let duration = '';
            
            if (rowParts.length > 3) {
              const dateTimePart = rowParts[3].trim();
              const dateMatch = dateTimePart.match(/([A-Za-z]+ \d+, \d{4})/);
              const timeMatch = dateTimePart.match(/(\d{1,2}:\d{2} [AP]M) to (\d{1,2}:\d{2} [AP]M)/);
              
              if (dateMatch) dateTime = dateMatch[1];
              if (timeMatch) {
                dateTime += ' ' + timeMatch[1];
                duration = timeMatch[2];
              }
            }
            
            appointments.push({
              assessor: assessor.name,
              type: appointmentType,
              location: location,
              dateTime: dateTime,
              duration: duration
            });
          }
        }
      }
    });
    
    if (assessors.length > 0) {
      scheduling.assessors.value = assessors;
      scheduling.assessors.confidence = CONFIDENCE.MEDIUM;
      scheduling.assessors.extractionMethod = 'PATTERN_MATCH';
    }
    
    if (appointments.length > 0) {
      scheduling.appointments.value = appointments;
      scheduling.appointments.confidence = CONFIDENCE.MEDIUM;
      scheduling.appointments.extractionMethod = 'PATTERN_MATCH';
    }
  }
  
  // Extract interpreter needed
  const interpreterPattern = /(?:INTERP(?:\/LANGUAGE)?|LANGUAGE|Interp):?\s*(Yes|No)?/i;
  const interpreterMatch = text.match(interpreterPattern);
  
  if (interpreterMatch && interpreterMatch[1]) {
    const response = interpreterMatch[1].toLowerCase();
    
    if (response === 'yes' || response === 'required') {
      scheduling.interpreterNeeded.value = true;
      scheduling.interpreterNeeded.confidence = CONFIDENCE.HIGH;
      scheduling.interpreterNeeded.extractionMethod = 'PATTERN_MATCH';
    } else if (response === 'no') {
      scheduling.interpreterNeeded.value = false;
      scheduling.interpreterNeeded.confidence = CONFIDENCE.HIGH;
      scheduling.interpreterNeeded.extractionMethod = 'PATTERN_MATCH';
    }
  }
  
  // Extract location
  const locationPattern = /Location\s+(?:Client's Home:)?\s*([^,]+,\s*[A-Za-z\s]+,\s*[A-Z]{2}\s*[A-Z0-9]{1,3}\s*[A-Z0-9]{1,3})/i;
  const locationMatch = text.match(locationPattern);
  
  if (locationMatch && locationMatch[1]) {
    scheduling.location.value = locationMatch[1].trim();
    scheduling.location.confidence = CONFIDENCE.HIGH;
    scheduling.location.extractionMethod = 'PATTERN_MATCH';
  }
}

/**
 * Extract reporting requirements from referral text
 * @param {string} text - The document text
 * @param {Object} extractedData - The data object to populate
 */
function extractReportingRequirements(text, extractedData) {
  const reporting = extractedData.reportingRequirements;
  
  // Extract due date
  const dueDatePattern = /Report Due:?\s*((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}|\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2})/i;
  const dueDateMatch = text.match(dueDatePattern);
  
  if (dueDateMatch && dueDateMatch[1]) {
    reporting.dueDate.value = dueDateMatch[1].trim();
    reporting.dueDate.confidence = CONFIDENCE.HIGH;
    reporting.dueDate.extractionMethod = 'PATTERN_MATCH';
  }
  
  // Extract guidelines
  const guidelinesPattern = /Report & Invoice Guidelines:\s*((?:\n\s*•\s*[^\n]+)+)/i;
  const guidelinesMatch = text.match(guidelinesPattern);
  
  if (guidelinesMatch && guidelinesMatch[1]) {
    const guidelineLines = guidelinesMatch[1].match(/•\s*([^\n]+)/g);
    if (guidelineLines) {
      reporting.guidelines.value = guidelineLines.map(line => 
        line.replace(/•\s*/, '').trim()
      );
      reporting.guidelines.confidence = CONFIDENCE.HIGH;
      reporting.guidelines.extractionMethod = 'PATTERN_MATCH';
    }
  }
  
  // Extract templates
  const templatesPattern = /Please use the attached report templates/i;
  if (templatesPattern.test(text)) {
    reporting.templates.value.push('Attached template required');
    reporting.templates.confidence = CONFIDENCE.MEDIUM;
    reporting.templates.extractionMethod = 'PATTERN_MATCH';
  }
}

/**
 * Extract referral source information
 * @param {string} text - The document text
 * @param {Object} extractedData - The data object to populate
 */
function extractReferralSource(text, extractedData) {
  const source = extractedData.referralSource;
  
  // Extract organization
  const orgPattern = /on behalf of ([A-Za-z\s]+)\./i;
  const orgMatch = text.match(orgPattern);
  
  if (orgMatch && orgMatch[1]) {
    source.organization.value = orgMatch[1].trim();
    source.organization.confidence = CONFIDENCE.HIGH;
    source.organization.extractionMethod = 'PATTERN_MATCH';
  } else if (text.includes('Omega Medical Associates')) {
    source.organization.value = 'Omega Medical Associates';
    source.organization.confidence = CONFIDENCE.HIGH;
    source.organization.extractionMethod = 'PATTERN_MATCH';
  }
  
  // Extract contact person
  const contactPersonPattern = /Yours sincerely,\s*([A-Za-z\s]+)\s*(?:Assessment Services Coordinator)/i;
  const contactPersonMatch = text.match(contactPersonPattern);
  
  if (contactPersonMatch && contactPersonMatch[1]) {
    source.contactPerson.value = contactPersonMatch[1].trim();
    source.contactPerson.confidence = CONFIDENCE.HIGH;
    source.contactPerson.extractionMethod = 'PATTERN_MATCH';
  }
  
  // Extract contact information
  const contactInfoPattern = /please contact ([A-Za-z\s]+) \(([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\)/i;
  const contactInfoMatch = text.match(contactInfoPattern);
  
  if (contactInfoMatch) {
    source.contactInfo.value = `${contactInfoMatch[1]} (${contactInfoMatch[2]})`;
    source.contactInfo.confidence = CONFIDENCE.HIGH;
    source.contactInfo.extractionMethod = 'PATTERN_MATCH';
  }
}

/**
 * Extract assessment requirements from referral text
 * @param {string} text - The document text
 * @param {Object} extractedData - The data object to populate
 */
function extractAssessmentRequirements(text, extractedData) {
  const requirements = extractedData.assessmentRequirements;
  
  // Extract assessment types with enhanced pattern recognition
  const assessmentTypePatterns = [
    {pattern: /In-home assessment/i, confidence: CONFIDENCE.HIGH},
    {pattern: /situational assessment/i, confidence: CONFIDENCE.HIGH},
    {pattern: /Attendant Care Needs/i, confidence: CONFIDENCE.HIGH},
    {pattern: /ADL\/Community/i, confidence: CONFIDENCE.HIGH},
    {pattern: /Functional assessment/i, confidence: CONFIDENCE.HIGH},
    {pattern: /Neurolog(?:y|ical) Assessment/i, confidence: CONFIDENCE.HIGH},
    {pattern: /Psychiatry Assessment/i, confidence: CONFIDENCE.HIGH},
    {pattern: /Orthopaedic Assessment/i, confidence: CONFIDENCE.HIGH}
  ];
  
  const assessmentTypes = [];
  for (const {pattern, confidence} of assessmentTypePatterns) {
    if (pattern.test(text)) {
      const match = text.match(pattern);
      if (match && !assessmentTypes.includes(match[0])) {
        assessmentTypes.push(match[0]);
      }
    }
  }
  
  if (assessmentTypes.length > 0) {
    requirements.assessmentTypes.value = assessmentTypes;
    requirements.assessmentTypes.confidence = CONFIDENCE.HIGH;
    requirements.assessmentTypes.extractionMethod = 'PATTERN_MATCH';
  }
  
  // Extract report types
  const reportPatterns = [
    /Report (\d+):([^\n]+)/gi,
    /CAT - Criterion (\d+):([^\n]+)/i,
    /Attendant Care Needs:([^\n]+)/i
  ];
  
  const reportTypes = [];
  for (const pattern of reportPatterns) {
    const patternCopy = new RegExp(pattern.source, pattern.flags);
    let reportMatch;
    
    while ((reportMatch = patternCopy.exec(text)) !== null) {
      const reportType = {
        number: reportMatch[1] || '',
        description: reportMatch[2] ? reportMatch[2].trim() : ''
      };
      
      // Check if this is a duplicate
      const isDuplicate = reportTypes.some(rt => 
        rt.number === reportType.number && rt.description === reportType.description);
      
      if (!isDuplicate) {
        reportTypes.push(reportType);
      }
    }
  }
  
  if (reportTypes.length > 0) {
    requirements.reportTypes.value = reportTypes;
    requirements.reportTypes.confidence = CONFIDENCE.HIGH;
  }
  
  // Extract specific criteria
  const criteriaPattern = /CAT - Criterion (\d+):/i;
  const criteriaMatch = text.match(criteriaPattern);
  if (criteriaMatch && criteriaMatch[1]) {
    requirements.criteria.value.push(criteriaMatch[1]);
    requirements.criteria.confidence = CONFIDENCE.HIGH;
  }
  
  // Extract domains
  const domainsSection = text.match(/domains:[^\n]*((?:\n\s*o\s*[^\n]+)+)/i);
  
  if (domainsSection && domainsSection[1]) {
    const domainLines = domainsSection[1].match(/o\s*([^\n]+)/g);
    if (domainLines) {
      requirements.domains.value = domainLines.map(line => 
        line.replace(/o\s*/, '').trim()
      );
      requirements.domains.confidence = CONFIDENCE.HIGH;
    }
  }
  
  // Extract specific requirements list items
  const specificRequirementsPattern = /Please address the following:[^\n]*((?:\n\s*•\s*[^\n]+)+)/i;
  const specificMatch = text.match(specificRequirementsPattern);
  
  if (specificMatch && specificMatch[1]) {
    const requirementLines = specificMatch[1].match(/•\s*([^\n]+)/g);
    if (requirementLines) {
      requirements.specificRequirements.value = requirementLines.map(line => 
        line.replace(/•\s*/, '').trim()
      );
      requirements.specificRequirements.confidence = CONFIDENCE.HIGH;
    }
  }
}

module.exports = {
  extractReferralData
};
