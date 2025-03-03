/**
 * ATTENDANT_CAREExtractor.js
 * 
 * Specialized extractor for the ATTENDANT_CARE section with enhanced pattern recognition
 * based on statistical analysis of successful extractions.
 */

const BaseExtractor = require('./BaseExtractor');

class ATTENDANT_CAREExtractor extends BaseExtractor {
  constructor() {
    super('ATTENDANT_CARE');
    
    // Additional patterns specific to ATTENDANT_CARE section
    this.attendantCarePatterns = {
      caregiverInfo: [
        { regex: /(?:caregiver|care provider|attendant|care worker)(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.8 },
        { regex: /(?:care is provided by|is cared for by)(.*?)(?:\.|\n|$)/i, confidence: 0.75 }
      ],
      careNeeds: [
        { regex: /(?:care needs|assistance needs)(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.8 },
        { regex: /(?:requires assistance with|needs help with)(.*?)(?:\.|\n|$)/i, confidence: 0.75 }
      ],
      careHours: [
        { regex: /(?:care hours|hours of care)(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.8 },
        { regex: /(?:receives|requires) (?:care|assistance) (?:for|of) ([^.]*?hours[^.]*)/i, confidence: 0.75 }
      ],
      recommendations: [
        { regex: /(?:care recommendations|recommended care)(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.8 }
      ],
      currentServices: [
        { regex: /(?:current services|services in place)(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.8 }
      ]
    };
    
    // Keywords for pattern matching
    this.caregiverTypeKeywords = ['spouse', 'family', 'PSW', 'nurse', 'agency'];
    this.careNeedsKeywords = ['bathing', 'dressing', 'grooming', 'medication', 'mobility'];
    
    // Hour patterns
    this.hourPatterns = [
      { regex: /(\d+)\s*hours?\s*per\s*day/i, scale: 'daily' },
      { regex: /(\d+)\s*hours?\s*per\s*week/i, scale: 'weekly' }
    ];
  }
  
  /**
   * Extract data from ATTENDANT_CARE section text
   * @param {string} text - ATTENDANT_CARE section text
   * @param {Object} allSections - All sections in the document
   * @returns {Object} Extracted data with confidence scores
   */
  extract(text, allSections = {}) {
    // Use base extractor first
    const result = super.extract(text, allSections);
    
    // Apply enhanced extraction techniques
    this.extractNotes(text, result);
    this.extractCaregiverInfo(text, result);
    this.extractCareNeeds(text, result);
    this.extractCareHours(text, result);
    this.extractRecommendations(text, result);
    this.extractCurrentServices(text, result);
    
    // Apply section-specific validations
    this.validateAttendantCareData(result);
    
    return result;
  }
  
  /**
   * Extract general attendant care notes
   * @param {string} text - Section text
   * @param {Object} result - Result object to update
   */
  extractNotes(text, result) {
    if (!result.notes) {
      result.notes = text.trim();
      result.confidence.notes = 0.9;
      result.notes_method = 'fullText';
    }
  }
  
  /**
   * Extract caregiver information
   * @param {string} text - Section text
   * @param {Object} result - Result object to update
   */
  extractCaregiverInfo(text, result) {
    // Skip if already extracted with high confidence
    if (result.caregiverInfo && result.confidence.caregiverInfo > 0.7) {
      return;
    }
    
    // Initialize caregiverInfo if not already present
    if (!result.caregiverInfo) {
      result.caregiverInfo = {
        type: '',
        name: '',
        relationship: '',
        availability: ''
      };
    }
    
    // Try patterns from attendantCarePatterns
    for (const pattern of this.attendantCarePatterns.caregiverInfo) {
      const match = text.match(pattern.regex);
      if (match && match[1]) {
        const caregiverText = match[1].trim();
        
        // Attempt to parse caregiver type and relationship
        const relationshipMatch = caregiverText.match(/\b(?:spouse|partner|wife|husband|family|relative)\b/i);
        if (relationshipMatch) {
          result.caregiverInfo.relationship = relationshipMatch[0];
          result.caregiverInfo.type = 'family';
        }
        
        const professionalMatch = caregiverText.match(/\b(?:PSW|care worker|nurse|aide|professional|agency)\b/i);
        if (professionalMatch) {
          result.caregiverInfo.type = 'professional';
        }
        
        // Store the full text
        result.caregiverInfo.text = caregiverText;
        result.confidence.caregiverInfo = pattern.confidence;
        result.caregiverInfo_method = 'caregiverPattern';
        return;
      }
    }
    
    // Fallback to keyword searching
    const sentences = text.split(/[.;]\s+/);
    for (const sentence of sentences) {
      if (sentence.toLowerCase().includes('caregiver') || 
          sentence.toLowerCase().includes('care provider')) {
        result.caregiverInfo.text = sentence.trim();
        result.confidence.caregiverInfo = 0.6;
        result.caregiverInfo_method = 'caregiverKeywords';
        break;
      }
    }
  }
  
  /**
   * Extract care needs information
   * @param {string} text - Section text
   * @param {Object} result - Result object to update
   */
  extractCareNeeds(text, result) {
    // Skip if already extracted with high confidence
    if (result.careNeeds && result.confidence.careNeeds > 0.7) {
      return;
    }
    
    // Initialize careNeeds if not already present
    if (!result.careNeeds) {
      result.careNeeds = {
        personalCare: [],
        housekeeping: [],
        mealPrep: [],
        medication: [],
        mobility: [],
        supervision: []
      };
    }
    
    // Try patterns from attendantCarePatterns
    for (const pattern of this.attendantCarePatterns.careNeeds) {
      const match = text.match(pattern.regex);
      if (match && match[1]) {
        const careNeedsText = match[1].trim();
        
        // Categorize needs by type
        const lowerText = careNeedsText.toLowerCase();
        
        // Personal care
        if (lowerText.includes('bath') || lowerText.includes('dress') || 
            lowerText.includes('groom')) {
          result.careNeeds.personalCare.push(careNeedsText);
        }
        
        // Medication
        if (lowerText.includes('med') || lowerText.includes('prescription')) {
          result.careNeeds.medication.push(careNeedsText);
        }
        
        // Mobility
        if (lowerText.includes('walk') || lowerText.includes('mobility')) {
          result.careNeeds.mobility.push(careNeedsText);
        }
        
        result.confidence.careNeeds = pattern.confidence;
        result.careNeeds_method = 'careNeedsPattern';
        return;
      }
    }
    
    // Fallback to simple keyword searching
    const sentences = text.split(/[.;]\s+/);
    for (const sentence of sentences) {
      const lowerSentence = sentence.toLowerCase();
      
      if (lowerSentence.includes('bath') || lowerSentence.includes('dress')) {
        result.careNeeds.personalCare.push(sentence.trim());
      }
      if (lowerSentence.includes('meal') || lowerSentence.includes('food')) {
        result.careNeeds.mealPrep.push(sentence.trim());
      }
    }
    
    // Set confidence if we found any care needs
    const hasAnyNeeds = Object.values(result.careNeeds).some(arr => arr.length > 0);
    if (hasAnyNeeds) {
      result.confidence.careNeeds = 0.6;
      result.careNeeds_method = 'careNeedsKeywords';
    }
  }
  
  /**
   * Extract care hours information
   * @param {string} text - Section text
   * @param {Object} result - Result object to update
   */
  extractCareHours(text, result) {
    // Skip if already extracted with high confidence
    if (result.careHours && result.confidence.careHours > 0.7) {
      return;
    }
    
    // Initialize careHours if not already present
    if (!result.careHours) {
      result.careHours = {
        daily: '',
        weekly: '',
        breakdown: {}
      };
    }
    
    // Try patterns from attendantCarePatterns
    for (const pattern of this.attendantCarePatterns.careHours) {
      const match = text.match(pattern.regex);
      if (match && match[1]) {
        const hoursText = match[1].trim();
        
        // Try to extract numeric values
        for (const hourPattern of this.hourPatterns) {
          const hourMatch = hoursText.match(hourPattern.regex);
          if (hourMatch && hourMatch[1]) {
            const hours = parseInt(hourMatch[1], 10);
            
            if (hourPattern.scale === 'daily') {
              result.careHours.daily = `${hours} hours per day`;
              result.careHours.weekly = `${hours * 7} hours per week`;
            } else if (hourPattern.scale === 'weekly') {
              result.careHours.weekly = `${hours} hours per week`;
              result.careHours.daily = `${(hours / 7).toFixed(1)} hours per day`;
            }
            
            result.confidence.careHours = pattern.confidence;
            result.careHours_method = 'careHoursPattern';
            return;
          }
        }
        
        // If no specific hour pattern, just store the text
        result.careHours.description = hoursText;
        result.confidence.careHours = pattern.confidence * 0.8; // Lower confidence since no specific hours extracted
        result.careHours_method = 'careHoursText';
        return;
      }
    }
    
    // Look for hour patterns directly in the text
    const sentences = text.split(/[.;]\s+/);
    for (const sentence of sentences) {
      for (const hourPattern of this.hourPatterns) {
        const hourMatch = sentence.match(hourPattern.regex);
        if (hourMatch && hourMatch[1]) {
          const hours = parseInt(hourMatch[1], 10);
          
          if (hourPattern.scale === 'daily') {
            result.careHours.daily = `${hours} hours per day`;
            result.careHours.weekly = `${hours * 7} hours per week`;
          } else if (hourPattern.scale === 'weekly') {
            result.careHours.weekly = `${hours} hours per week`;
            result.careHours.daily = `${(hours / 7).toFixed(1)} hours per day`;
          }
          
          result.confidence.careHours = 0.6;
          result.careHours_method = 'hourPatternDirect';
          return;
        }
      }
    }
  }
  
  /**
   * Extract recommendations
   * @param {string} text - Section text
   * @param {Object} result - Result object to update
   */
  extractRecommendations(text, result) {
    // Skip if already extracted with high confidence
    if (result.recommendations && result.confidence.recommendations > 0.7) {
      return;
    }
    
    // Try patterns from attendantCarePatterns
    for (const pattern of this.attendantCarePatterns.recommendations) {
      const match = text.match(pattern.regex);
      if (match && match[1]) {
        result.recommendations = match[1].trim();
        result.confidence.recommendations = pattern.confidence;
        result.recommendations_method = 'recommendationsPattern';
        return;
      }
    }
    
    // Look for recommendation keywords in the text
    const sentences = text.split(/[.;]\s+/);
    const recommendationSentences = [];
    
    for (const sentence of sentences) {
      if (sentence.toLowerCase().includes('recommend') || 
          sentence.toLowerCase().includes('suggest')) {
        recommendationSentences.push(sentence.trim());
      }
    }
    
    if (recommendationSentences.length > 0) {
      result.recommendations = recommendationSentences.join('. ');
      result.confidence.recommendations = 0.6;
      result.recommendations_method = 'recommendationKeywords';
    } else {
      // Default to "None provided" with low confidence
      result.recommendations = "None provided";
      result.confidence.recommendations = 0.2;
      result.recommendations_method = 'defaultValue';
    }
  }
  
  /**
   * Extract current services information
   * @param {string} text - Section text
   * @param {Object} result - Result object to update
   */
  extractCurrentServices(text, result) {
    // Skip if already extracted with high confidence
    if (result.currentServices && result.confidence.currentServices > 0.7) {
      return;
    }
    
    // Try patterns from attendantCarePatterns
    for (const pattern of this.attendantCarePatterns.currentServices) {
      const match = text.match(pattern.regex);
      if (match && match[1]) {
        result.currentServices = match[1].trim();
        result.confidence.currentServices = pattern.confidence;
        result.currentServices_method = 'currentServicesPattern';
        return;
      }
    }
    
    // Look for current services keywords in the text
    const sentences = text.split(/[.;]\s+/);
    const servicesSentences = [];
    
    for (const sentence of sentences) {
      if (sentence.toLowerCase().includes('current') && 
          (sentence.toLowerCase().includes('service') || 
           sentence.toLowerCase().includes('care') || 
           sentence.toLowerCase().includes('support'))) {
        servicesSentences.push(sentence.trim());
      }
    }
    
    if (servicesSentences.length > 0) {
      result.currentServices = servicesSentences.join('. ');
      result.confidence.currentServices = 0.6;
      result.currentServices_method = 'servicesKeywords';
    } else {
      // Default to "None identified" with low confidence
      result.currentServices = "None identified";
      result.confidence.currentServices = 0.2;
      result.currentServices_method = 'defaultValue';
    }
  }
  
  /**
   * Validate and refine attendant care data
   * @param {Object} result - Result object to validate
   */
  validateAttendantCareData(result) {
    // Convert recommendations to array if it contains list-like items
    if (result.recommendations && typeof result.recommendations === 'string' && 
        (result.recommendations.includes(',') || result.recommendations.toLowerCase().includes(' and '))) {
      const recommendations = result.recommendations.split(/,|and/).map(item => item.trim()).filter(item => item.length > 0);
      if (recommendations.length > 1) {
        result.recommendations = recommendations;
      }
    }
    
    // Ensure care hours has consistent format
    if (result.careHours && result.careHours.weekly && !result.careHours.daily) {
      // Try to calculate daily from weekly
      const weeklyMatch = result.careHours.weekly.match(/(\d+)/);
      if (weeklyMatch && weeklyMatch[1]) {
        const weeklyHours = parseInt(weeklyMatch[1], 10);
        result.careHours.daily = `${(weeklyHours / 7).toFixed(1)} hours per day`;
      }
    } else if (result.careHours && result.careHours.daily && !result.careHours.weekly) {
      // Try to calculate weekly from daily
      const dailyMatch = result.careHours.daily.match(/(\d+)/);
      if (dailyMatch && dailyMatch[1]) {
        const dailyHours = parseInt(dailyMatch[1], 10);
        result.careHours.weekly = `${dailyHours * 7} hours per week`;
      }
    }
  }
  
  /**
   * Check if the section appears to be an ATTENDANT_CARE section
   * @param {Object} result - Extraction result
   * @returns {boolean} True if likely an ATTENDANT_CARE section
   */
  isCorrectSectionType(result) {
    // ATTENDANT_CARE sections typically discuss caregivers, care needs, etc.
    
    // Check for high-priority fields
    if ((result.caregiverInfo && result.confidence.caregiverInfo > 0.6) ||
        (result.careNeeds && result.confidence.careNeeds > 0.6) ||
        (result.careHours && result.confidence.careHours > 0.6)) {
      return true;
    }
    
    // Count attendant care fields present with decent confidence
    let careFieldsPresent = 0;
    
    if (result.caregiverInfo && result.confidence.caregiverInfo > 0.4) careFieldsPresent++;
    if (result.careNeeds && result.confidence.careNeeds > 0.4) careFieldsPresent++;
    if (result.careHours && result.confidence.careHours > 0.4) careFieldsPresent++;
    if (result.recommendations && result.confidence.recommendations > 0.4) careFieldsPresent++;
    if (result.currentServices && result.confidence.currentServices > 0.4) careFieldsPresent++;
    
    // If we have at least 2 care fields, it's likely an ATTENDANT_CARE section
    return careFieldsPresent >= 2 || result.overallConfidence > 0.4;
  }
}

module.exports = ATTENDANT_CAREExtractor;
