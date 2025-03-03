// OT_ASSESSMENTExtractor.js
// Specific patterns for Occupational Therapy Assessment documents
// Part of Delilah V3.0 PDF Import Pattern Recognition Enhancement

/**
 * Extract demographic information from OT assessments
 */
class OT_ASSESSMENTExtractor {
  /**
   * Extract data from an OT assessment document
   * @param {String} text - Document text
   * @returns {Object} - Extracted data
   */
  static extract(text) {
    // Extract each section
    const demographics = this.extractDemographics(text);
    const medicalHistory = this.extractMedicalHistory(text);
    const recommendations = this.extractRecommendations(text);
    const attendantCare = this.extractAttendantCare(text);
    const functionalStatus = this.extractFunctionalStatus(text);
    
    // Calculate overall confidence
    const confidence = this.calculateOverallConfidence({
      demographics,
      medicalHistory,
      recommendations,
      attendantCare,
      functionalStatus
    });
    
    return {
      _documentType: 'OT_ASSESSMENT',
      _documentConfidence: confidence,
      DEMOGRAPHICS: demographics,
      MEDICAL_HISTORY: medicalHistory,
      RECOMMENDATIONS: recommendations,
      ATTENDANT_CARE: attendantCare,
      FUNCTIONAL_STATUS: functionalStatus
    };
  }
  
  /**
   * Extract demographic information
   * @param {String} text - Document text
   * @returns {Object} - Extracted demographics
   */
  static extractDemographics(text) {
    const result = {
      confidence: {}
    };
    
    // Client name patterns
    const namePatterns = [
      /(?:client|patient)\s+name\s*[:=]\s*([^,\n]+)/i,
      /name\s*[:=]\s*([^,\n]+)/i,
      /(?:mr\.|mrs\.|ms\.|miss|dr\.)\s+([^,\n]+)/i
    ];
    
    // Try each pattern until one works
    for (const pattern of namePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        result.name = match[1].trim();
        result.confidence.name = 0.9; // High confidence
        break;
      }
    }
    
    // Date of loss patterns
    const dateOfLossPatterns = [
      /date\s+of\s+(?:loss|accident|injury|incident)\s*[:=]\s*(\d{4}-\d{1,2}-\d{1,2}|\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4})/i,
      /(?:loss|accident|injury|incident)\s+date\s*[:=]\s*(\d{4}-\d{1,2}-\d{1,2}|\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4})/i
    ];
    
    for (const pattern of dateOfLossPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        result.dateOfLoss = match[1].trim();
        result.confidence.dateOfLoss = 0.85;
        break;
      }
    }
    
    // Address patterns
    const addressPatterns = [
      /address\s*[:=]\s*([^,\n]+(?:,\s*[^,\n]+)*)/i,
      /(?:home|residential)\s+address\s*[:=]\s*([^,\n]+(?:,\s*[^,\n]+)*)/i
    ];
    
    for (const pattern of addressPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        result.address = match[1].trim();
        result.confidence.address = 0.85;
        break;
      }
    }
    
    // Telephone patterns
    const telephonePatterns = [
      /(?:telephone|phone|tel|contact)\s*(?:\#|number|no\.?)?\s*[:=]\s*((?:\+\d{1,2}\s*)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4})/i,
      /(?:telephone|phone)\s*[:=]\s*((?:\+\d{1,2}\s*)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4})/i
    ];
    
    for (const pattern of telephonePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        result.telephone = match[1].trim();
        result.confidence.telephone = 0.9;
        break;
      }
    }
    
    // Claim number patterns
    const claimNumberPatterns = [
      /(?:claim|file)\s*(?:no\.?|number)\s*[:=]\s*([a-z0-9\-\.]+)/i,
      /(?:claim|file)\s*[:=]\s*([a-z0-9\-\.]+)/i
    ];
    
    for (const pattern of claimNumberPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        result.claimNumber = match[1].trim();
        result.confidence.claimNumber = 0.85;
        break;
      }
    }
    
    // Date of assessment patterns
    const assessmentDatePatterns = [
      /date\s+of\s+assessment\s*[:=]\s*(\d{4}-\d{1,2}-\d{1,2}|\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4})/i,
      /assessment\s+date\s*[:=]\s*(\d{4}-\d{1,2}-\d{1,2}|\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4})/i
    ];
    
    for (const pattern of assessmentDatePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        result.dateOfAssessment = match[1].trim();
        result.confidence.dateOfAssessment = 0.9;
        break;
      }
    }
    
    return result;
  }
  
  /**
   * Extract medical history information
   * @param {String} text - Document text
   * @returns {Object} - Extracted medical history
   */
  static extractMedicalHistory(text) {
    const result = {
      confidence: {}
    };
    
    // Find the medical history section
    const medicalHistorySectionPatterns = [
      /(?:medical|health)\s+history/i,
      /past\s+medical\s+history/i,
      /pre-accident\s+medical\s+history/i
    ];
    
    let medicalHistoryText = '';
    for (const pattern of medicalHistorySectionPatterns) {
      const match = text.match(pattern);
      if (match) {
        // Get text from the match to the next section header
        const startPos = match.index;
        const endMatch = text.slice(startPos).match(/\n\s*[A-Z][A-Z\s]+:/);
        const endPos = endMatch ? startPos + endMatch.index : text.length;
        medicalHistoryText = text.slice(startPos, endPos);
        break;
      }
    }
    
    if (medicalHistoryText) {
      // Extract pre-accident conditions
      const preAccidentPatterns = [
        /pre-accident\s+(?:conditions|health|history|status)\s*[:=]\s*([^.]+)/i,
        /prior\s+to\s+(?:the|this)\s+accident\s*[:=,]\s*([^.]+)/i
      ];
      
      for (const pattern of preAccidentPatterns) {
        const match = medicalHistoryText.match(pattern);
        if (match && match[1]) {
          result.preAccidentConditions = match[1].trim();
          result.confidence.preAccidentConditions = 0.8;
          break;
        }
      }
      
      // Extract injuries/diagnoses
      const injuryPatterns = [
        /(?:sustained|suffered|diagnosed with|developed)\s+(?:the\s+following|these)?\s+(?:injuries|conditions|diagnoses):\s*([^.]+(?:\n[^.\n]+)*)/i,
        /(?:injuries|conditions|diagnoses)\s+(?:sustained|suffered):\s*([^.]+(?:\n[^.\n]+)*)/i
      ];
      
      for (const pattern of injuryPatterns) {
        const match = medicalHistoryText.match(pattern);
        if (match && match[1]) {
          // Process bullet points or comma-separated list
          const injuriesText = match[1].trim();
          
          if (injuriesText.includes('\n')) {
            // Handle bullet points
            result.injuries = injuriesText
              .split('\n')
              .map(line => line.replace(/^[-•*]\s*/, '').trim())
              .filter(line => line.length > 0);
          } else if (injuriesText.includes(',')) {
            // Handle comma-separated list
            result.injuries = injuriesText
              .split(',')
              .map(item => item.trim())
              .filter(item => item.length > 0);
          } else {
            // Single injury
            result.injuries = [injuriesText];
          }
          
          result.confidence.injuries = 0.85;
          break;
        }
      }
    }
    
    return result;
  }
  
  /**
   * Extract recommendations
   * @param {String} text - Document text
   * @returns {Object} - Extracted recommendations
   */
  static extractRecommendations(text) {
    const result = {
      confidence: {}
    };
    
    // Find the recommendations section
    const recommendationSectionPatterns = [
      /recommendations:/i,
      /recommended\s+(?:interventions|services|treatment)/i,
      /treatment\s+recommendations/i
    ];
    
    let recommendationsText = '';
    for (const pattern of recommendationSectionPatterns) {
      const match = text.match(pattern);
      if (match) {
        // Get text from the match to the next section header
        const startPos = match.index;
        const endMatch = text.slice(startPos).match(/\n\s*[A-Z][A-Z\s]+:/);
        const endPos = endMatch ? startPos + endMatch.index : text.length;
        recommendationsText = text.slice(startPos, endPos);
        break;
      }
    }
    
    if (recommendationsText) {
      // Extract recommendation items (often bullet points)
      const recommendationItems = recommendationsText.match(/[•*-]\s*([^\n]+)/g);
      
      if (recommendationItems && recommendationItems.length > 0) {
        result.recommendationItems = recommendationItems
          .map(item => item.replace(/^[•*-]\s*/, '').trim())
          .filter(item => item.length > 0);
        
        result.confidence.recommendationItems = 0.9;
      }
      
      // Extract therapy recommendations
      const therapyPatterns = [
        /(?:psychology|occupational therapy|physical therapy|speech therapy|kinesiology)(?:.+?)(?:sessions|treatment|therapy|intervention)/gi
      ];
      
      result.therapyRecommendations = [];
      
      for (const pattern of therapyPatterns) {
        const matches = [...recommendationsText.matchAll(pattern)];
        if (matches.length > 0) {
          matches.forEach(match => {
            result.therapyRecommendations.push(match[0].trim());
          });
          result.confidence.therapyRecommendations = 0.85;
        }
      }
    }
    
    return result;
  }
  
  /**
   * Extract attendant care information
   * @param {String} text - Document text
   * @returns {Object} - Extracted attendant care details
   */
  static extractAttendantCare(text) {
    const result = {
      confidence: {}
    };
    
    // Find the attendant care section
    const attendantCareSectionPatterns = [
      /attendant\s+care:/i,
      /attendant\s+care\s+(?:needs|requirements|services)/i
    ];
    
    let attendantCareText = '';
    for (const pattern of attendantCareSectionPatterns) {
      const match = text.match(pattern);
      if (match) {
        // Get text from the match to the next section header
        const startPos = match.index;
        const endMatch = text.slice(startPos).match(/\n\s*[A-Z][A-Z\s]+:/);
        const endPos = endMatch ? startPos + endMatch.index : text.length;
        attendantCareText = text.slice(startPos, endPos);
        break;
      }
    }
    
    if (attendantCareText) {
      // Extract hours per week
      const hoursPatterns = [
        /(\d+(?:\.\d+)?)\s+hours?\s+per\s+week/i,
        /hours?\s+per\s+week\s*[:=]\s*(\d+(?:\.\d+)?)/i
      ];
      
      for (const pattern of hoursPatterns) {
        const match = attendantCareText.match(pattern);
        if (match && match[1]) {
          result.hoursPerWeek = parseFloat(match[1]);
          result.confidence.hoursPerWeek = 0.95;
          break;
        }
      }
      
      // Extract monthly cost
      const costPatterns = [
        /\$(\d+(?:\.\d+)?)\s+per\s+month/i,
        /monthly\s+(?:cost|amount|total)\s*[:=]\s*\$(\d+(?:\.\d+)?)/i
      ];
      
      for (const pattern of costPatterns) {
        const match = attendantCareText.match(pattern);
        if (match && match[1]) {
          result.monthlyCost = parseFloat(match[1]);
          result.confidence.monthlyCost = 0.9;
          break;
        }
      }
      
      // Extract care type
      const careTypePatterns = [
        /(?:benefit|care)\s+from\s+([^.]+)/i,
        /requires\s+([^.]+?)\s+(?:care|assistance)/i
      ];
      
      for (const pattern of careTypePatterns) {
        const match = attendantCareText.match(pattern);
        if (match && match[1]) {
          result.careType = match[1].trim();
          result.confidence.careType = 0.8;
          break;
        }
      }
    }
    
    return result;
  }
  
  /**
   * Extract functional status information
   * @param {String} text - Document text
   * @returns {Object} - Extracted functional status
   */
  static extractFunctionalStatus(text) {
    const result = {
      confidence: {}
    };
    
    // Find the functional status section
    const functionalStatusSectionPatterns = [
      /functional\s+status/i,
      /activities\s+of\s+daily\s+living/i,
      /daily\s+function/i
    ];
    
    let functionalStatusText = '';
    for (const pattern of functionalStatusSectionPatterns) {
      const match = text.match(pattern);
      if (match) {
        // Get text from the match to the next section header
        const startPos = match.index;
        const endMatch = text.slice(startPos).match(/\n\s*[A-Z][A-Z\s]+:/);
        const endPos = endMatch ? startPos + endMatch.index : text.length;
        functionalStatusText = text.slice(startPos, endPos);
        break;
      }
    }
    
    if (functionalStatusText) {
      // Extract mobility status
      const mobilityPatterns = [
        /mobility\s*[:=]\s*([^.]+)/i,
        /(?:can|able to)\s+(?:walk|move|ambulate)\s+([^.]+)/i
      ];
      
      for (const pattern of mobilityPatterns) {
        const match = functionalStatusText.match(pattern);
        if (match && match[1]) {
          result.mobilityStatus = match[1].trim();
          result.confidence.mobilityStatus = 0.85;
          break;
        }
      }
      
      // Extract self-care limitations
      const selfCarePatterns = [
        /self.?care\s*[:=]\s*([^.]+)/i,
        /(?:difficulty|limitations|impairments)\s+(?:with|in)\s+self.?care\s*[:=]\s*([^.]+)/i
      ];
      
      for (const pattern of selfCarePatterns) {
        const match = functionalStatusText.match(pattern);
        if (match && match[1]) {
          result.selfCareLimitations = match[1].trim();
          result.confidence.selfCareLimitations = 0.8;
          break;
        }
      }
      
      // Extract ADL limitations
      const adlPatterns = [
        /ADLs\s*[:=]\s*([^.]+)/i,
        /activities\s+of\s+daily\s+living\s*[:=]\s*([^.]+)/i
      ];
      
      for (const pattern of adlPatterns) {
        const match = functionalStatusText.match(pattern);
        if (match && match[1]) {
          result.adlLimitations = match[1].trim();
          result.confidence.adlLimitations = 0.85;
          break;
        }
      }
    }
    
    return result;
  }
  
  /**
   * Calculate overall confidence score
   * @param {Object} extractedData - All extracted data
   * @returns {Number} - Overall confidence score
   */
  static calculateOverallConfidence(extractedData) {
    let totalConfidence = 0;
    let totalFields = 0;
    
    // Process each section's confidence scores
    Object.keys(extractedData).forEach(section => {
      const sectionData = extractedData[section];
      if (!sectionData || !sectionData.confidence) return;
      
      Object.values(sectionData.confidence).forEach(confidenceScore => {
        totalConfidence += confidenceScore;
        totalFields++;
      });
    });
    
    // Calculate average confidence
    return totalFields > 0 ? totalConfidence / totalFields : 0;
  }
}

module.exports = OT_ASSESSMENTExtractor;
