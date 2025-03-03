/**
 * ReferralConfidenceScorer.js
 * Enhanced confidence scoring for referral data extraction
 */

// Confidence score levels
const CONFIDENCE = {
  VERY_HIGH: 0.95,
  HIGH: 0.85,
  MEDIUM: 0.7,
  LOW: 0.5,
  VERY_LOW: 0.3,
  NONE: 0
};

// Weights for different extraction methods
const METHOD_WEIGHTS = {
  EXACT_MATCH: 1.0,
  PATTERN_MATCH: 0.9,
  CONTEXT_MATCH: 0.8,
  PROXIMITY_MATCH: 0.7,
  FUZZY_MATCH: 0.6,
  INFERRED: 0.5
};

// Weights for different sections
const SECTION_WEIGHTS = {
  CLIENT_INFO: 1.0,    // Very important - most reliable data
  ASSESSMENT_REQUIREMENTS: 0.9,
  SCHEDULING_INFO: 0.8,
  REPORTING_REQUIREMENTS: 0.7,
  REFERRAL_SOURCE: 0.8
};

// Weights for different fields within sections
const FIELD_WEIGHTS = {
  CLIENT_INFO: {
    name: 1.0,
    dateOfBirth: 0.9,
    dateOfLoss: 0.9,
    fileNumber: 0.9,
    language: 0.8,
    phoneNumbers: 0.8,
    address: 0.7,
    email: 0.7
  },
  ASSESSMENT_REQUIREMENTS: {
    assessmentTypes: 1.0,
    reportTypes: 0.9,
    specificRequirements: 0.8,
    criteria: 0.8,
    domains: 0.7
  },
  SCHEDULING_INFO: {
    assessors: 0.9,
    appointments: 1.0,
    location: 0.8,
    interpreterNeeded: 0.7
  },
  REPORTING_REQUIREMENTS: {
    dueDate: 0.9,
    templates: 0.7,
    guidelines: 0.8
  },
  REFERRAL_SOURCE: {
    organization: 0.9,
    contactPerson: 0.8,
    contactInfo: 0.7
  }
};

/**
 * Calculate adjusted confidence score based on extraction method
 * @param {number} rawConfidence - Raw confidence score (0-1)
 * @param {string} method - Extraction method used
 * @returns {number} - Adjusted confidence score
 */
function adjustConfidenceByMethod(rawConfidence, method) {
  const methodWeight = METHOD_WEIGHTS[method] || METHOD_WEIGHTS.INFERRED;
  return rawConfidence * methodWeight;
}

/**
 * Calculate weight-adjusted field confidence
 * @param {string} section - Section name
 * @param {string} field - Field name
 * @param {number} confidence - Raw confidence score
 * @param {string} method - Extraction method
 * @returns {number} - Weighted confidence score
 */
function calculateFieldConfidence(section, field, confidence, method = 'PATTERN_MATCH') {
  // Get section weight
  const sectionWeight = SECTION_WEIGHTS[section] || 0.7;
  
  // Get field weight within section
  const fieldWeight = FIELD_WEIGHTS[section]?.[field] || 0.7;
  
  // Adjust by method
  const methodAdjusted = adjustConfidenceByMethod(confidence, method);
  
  // Apply section and field weights
  return methodAdjusted * sectionWeight * fieldWeight;
}

/**
 * Calculate overall confidence for a section
 * @param {Object} sectionData - Section data with field confidence scores
 * @param {string} sectionName - Name of the section
 * @returns {number} - Overall confidence score for the section
 */
function calculateSectionConfidence(sectionData, sectionName) {
  if (!sectionData || typeof sectionData !== 'object') {
    return CONFIDENCE.NONE;
  }
  
  // Get all fields with confidence values
  const fieldConfidences = Object.entries(sectionData)
    .filter(([key, value]) => value && typeof value === 'object' && typeof value.confidence === 'number')
    .map(([field, data]) => {
      // Get extraction method if available
      const method = data.extractionMethod || 'PATTERN_MATCH';
      
      // Calculate weighted confidence
      return {
        field,
        confidence: calculateFieldConfidence(sectionName, field, data.confidence, method),
        weight: FIELD_WEIGHTS[sectionName]?.[field] || 0.7
      };
    });
  
  if (fieldConfidences.length === 0) {
    return CONFIDENCE.NONE;
  }
  
  // Calculate weighted average
  const totalWeight = fieldConfidences.reduce((sum, fc) => sum + fc.weight, 0);
  const weightedSum = fieldConfidences.reduce((sum, fc) => sum + (fc.confidence * fc.weight), 0);
  
  return totalWeight === 0 ? CONFIDENCE.NONE : weightedSum / totalWeight;
}

/**
 * Calculate overall document confidence from all sections
 * @param {Object} extractedData - Complete extracted data
 * @returns {number} - Overall confidence score
 */
function calculateOverallConfidence(extractedData) {
  if (!extractedData || typeof extractedData !== 'object') {
    return CONFIDENCE.NONE;
  }
  
  const sectionConfidences = {
    CLIENT_INFO: calculateSectionConfidence(extractedData.clientInfo, 'CLIENT_INFO'),
    ASSESSMENT_REQUIREMENTS: calculateSectionConfidence(extractedData.assessmentRequirements, 'ASSESSMENT_REQUIREMENTS'),
    SCHEDULING_INFO: calculateSectionConfidence(extractedData.schedulingInfo, 'SCHEDULING_INFO'),
    REPORTING_REQUIREMENTS: calculateSectionConfidence(extractedData.reportingRequirements, 'REPORTING_REQUIREMENTS'),
    REFERRAL_SOURCE: calculateSectionConfidence(extractedData.referralSource, 'REFERRAL_SOURCE')
  };
  
  // Calculate weighted confidence
  const weightedConfidences = Object.entries(sectionConfidences).map(([section, confidence]) => ({
    section,
    confidence,
    weight: SECTION_WEIGHTS[section] || 0.7
  }));
  
  const totalWeight = weightedConfidences.reduce((sum, wc) => sum + wc.weight, 0);
  const weightedSum = weightedConfidences.reduce((sum, wc) => sum + (wc.confidence * wc.weight), 0);
  
  return totalWeight === 0 ? CONFIDENCE.NONE : weightedSum / totalWeight;
}

/**
 * Calculate cross-validation confidence adjustment
 * Increases confidence when data is validated across sections
 * @param {Object} extractedData - Complete extracted data
 * @returns {Object} - Adjusted data with updated confidence scores
 */
function calculateCrossValidation(extractedData) {
  if (!extractedData || typeof extractedData !== 'object') {
    return extractedData;
  }
  
  const adjustedData = JSON.parse(JSON.stringify(extractedData));
  
  // Cross-validate client name
  if (adjustedData.clientInfo && adjustedData.clientInfo.name) {
    // Look for client name in other sections
    const nameValue = adjustedData.clientInfo.name.value;
    if (nameValue) {
      let nameConfirmations = 0;
      
      // Check if name appears in scheduling info
      if (adjustedData.schedulingInfo && 
          adjustedData.schedulingInfo.appointments && 
          adjustedData.schedulingInfo.appointments.value) {
        
        // Check appointments for client name
        for (const appointment of adjustedData.schedulingInfo.appointments.value) {
          if (appointment.location && appointment.location.includes(nameValue)) {
            nameConfirmations++;
            break;
          }
        }
      }
      
      // Check if name appears in raw text
      if (adjustedData.rawText && adjustedData.rawText.includes(nameValue)) {
        nameConfirmations++;
      }
      
      // Increase confidence if found in multiple places
      if (nameConfirmations > 0) {
        const currentConfidence = adjustedData.clientInfo.name.confidence;
        const boostFactor = 1 + (0.05 * nameConfirmations); // 5% boost per confirmation
        adjustedData.clientInfo.name.confidence = Math.min(CONFIDENCE.VERY_HIGH, currentConfidence * boostFactor);
        adjustedData.clientInfo.name.crossValidated = true;
      }
    }
  }
  
  // Cross-validate dates
  if (adjustedData.clientInfo && adjustedData.clientInfo.dateOfLoss && 
      adjustedData.schedulingInfo && adjustedData.schedulingInfo.appointments) {
    
    const lossDate = new Date(adjustedData.clientInfo.dateOfLoss.value);
    
    // Check if appointment dates are after the loss date
    if (!isNaN(lossDate.getTime()) && adjustedData.schedulingInfo.appointments.value) {
      let datesValid = true;
      
      for (const appointment of adjustedData.schedulingInfo.appointments.value) {
        if (appointment.dateTime) {
          const appointmentDate = new Date(appointment.dateTime.split(' ')[0]);
          if (!isNaN(appointmentDate.getTime()) && appointmentDate < lossDate) {
            datesValid = false;
            break;
          }
        }
      }
      
      // Adjust confidence based on date validation
      if (datesValid) {
        const currentConfidence = adjustedData.clientInfo.dateOfLoss.confidence;
        adjustedData.clientInfo.dateOfLoss.confidence = Math.min(CONFIDENCE.VERY_HIGH, currentConfidence * 1.1);
        adjustedData.clientInfo.dateOfLoss.crossValidated = true;
      } else {
        // Lower confidence if dates are inconsistent
        const currentConfidence = adjustedData.clientInfo.dateOfLoss.confidence;
        adjustedData.clientInfo.dateOfLoss.confidence = Math.max(CONFIDENCE.LOW, currentConfidence * 0.8);
        adjustedData.clientInfo.dateOfLoss.crossValidated = false;
      }
    }
  }
  
  // Cross-validate assessor across sections
  if (adjustedData.schedulingInfo && adjustedData.schedulingInfo.assessors && 
      adjustedData.assessmentRequirements && adjustedData.assessmentRequirements.assessmentTypes) {
    
    const assessors = adjustedData.schedulingInfo.assessors.value;
    const assessmentTypes = adjustedData.assessmentRequirements.assessmentTypes.value;
    
    if (assessors && assessmentTypes) {
      // Check if assessor specialization matches assessment types
      for (const assessor of assessors) {
        for (const assessmentType of assessmentTypes) {
          if (assessor.specialization && 
              assessmentType.toLowerCase().includes(assessor.specialization.toLowerCase())) {
            // Increase confidence in both
            const currentAssessorConfidence = adjustedData.schedulingInfo.assessors.confidence;
            const currentTypeConfidence = adjustedData.assessmentRequirements.assessmentTypes.confidence;
            
            adjustedData.schedulingInfo.assessors.confidence = 
              Math.min(CONFIDENCE.VERY_HIGH, currentAssessorConfidence * 1.1);
            adjustedData.assessmentRequirements.assessmentTypes.confidence = 
              Math.min(CONFIDENCE.VERY_HIGH, currentTypeConfidence * 1.1);
            
            adjustedData.schedulingInfo.assessors.crossValidated = true;
            adjustedData.assessmentRequirements.assessmentTypes.crossValidated = true;
            break;
          }
        }
      }
    }
  }
  
  return adjustedData;
}

/**
 * Apply comprehensive confidence scoring to extracted data
 * @param {Object} extractedData - Raw extracted data
 * @returns {Object} - Data with enhanced confidence scores
 */
function enhanceConfidenceScoring(extractedData) {
  if (!extractedData) {
    return extractedData;
  }
  
  try {
    // First apply cross-validation
    const validatedData = calculateCrossValidation(extractedData);
    
    // Calculate section confidences
    const sectionConfidences = {
      clientInfo: calculateSectionConfidence(validatedData.clientInfo, 'CLIENT_INFO'),
      assessmentRequirements: calculateSectionConfidence(validatedData.assessmentRequirements, 'ASSESSMENT_REQUIREMENTS'),
      schedulingInfo: calculateSectionConfidence(validatedData.schedulingInfo, 'SCHEDULING_INFO'),
      reportingRequirements: calculateSectionConfidence(validatedData.reportingRequirements, 'REPORTING_REQUIREMENTS'),
      referralSource: calculateSectionConfidence(validatedData.referralSource, 'REFERRAL_SOURCE')
    };
    
    // Calculate overall confidence
    const overallConfidence = calculateOverallConfidence(validatedData);
    
    // Return enhanced data with updated confidence metadata
    return {
      ...validatedData,
      metadata: {
        ...(validatedData.metadata || {}),
        confidence: overallConfidence,
        sectionConfidence: sectionConfidences,
        confidenceScoringVersion: '2.0.0'
      }
    };
  } catch (error) {
    console.error('Error enhancing confidence scoring:', error);
    return extractedData;
  }
}

module.exports = {
  enhanceConfidenceScoring,
  calculateFieldConfidence,
  calculateSectionConfidence,
  calculateOverallConfidence,
  CONFIDENCE
};
