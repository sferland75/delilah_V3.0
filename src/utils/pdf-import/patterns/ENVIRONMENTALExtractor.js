/**
 * ENVIRONMENTALExtractor.js
 * 
 * Specialized extractor for the ENVIRONMENTAL section with enhanced pattern recognition
 * based on statistical analysis of successful extractions.
 */

const BaseExtractor = require('./BaseExtractor');

class ENVIRONMENTALExtractor extends BaseExtractor {
  constructor() {
    super('ENVIRONMENTAL');
    
    // Additional patterns specific to ENVIRONMENTAL section
    this.environmentalPatterns = {
      homeType: [
        { regex: /(?:home type|residence type|dwelling type|housing type|type of (?:home|residence|dwelling))(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.8 },
        { regex: /(?:lives in|resides in|dwelling is|home is) (?:a|an) ([a-z\s-]+(?:house|apartment|condo|townhouse|bungalow))/i, confidence: 0.75 },
        { regex: /(?:residence|dwelling|housing) (?:is|consists of|described as) ([a-z\s-]+(?:house|apartment|condo|townhouse|bungalow))/i, confidence: 0.7 }
      ],
      livingArrangement: [
        { regex: /(?:living arrangement|household composition|living situation)(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.8 },
        { regex: /(?:lives|resides) with(.*?)(?:\.|\n|$)/i, confidence: 0.75 },
        { regex: /(?:shares|sharing) (?:home|residence|dwelling|house|apartment) with(.*?)(?:\.|\n|$)/i, confidence: 0.7 }
      ],
      homeLayout: [
        { regex: /(?:home layout|house layout|residence layout|floor plan|layout of (?:home|house|residence))(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.8 },
        { regex: /(?:the (?:home|house|residence|apartment) (?:consists of|has|includes|features|contains))(.*?)(?:\.|\n|$)/i, confidence: 0.75 },
        { regex: /(?:home|house|residence|apartment) (?:consists of|has|includes|features|contains) ([^.]+(?:bedroom|bathroom|level|floor|story|storey))/i, confidence: 0.7 }
      ],
      access: [
        { regex: /(?:home access|house access|residence access|accessibility|access to (?:home|house|residence))(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.8 },
        { regex: /(?:access to the (?:home|house|residence|apartment|building) is (?:via|through|by|using))(.*?)(?:\.|\n|$)/i, confidence: 0.75 },
        { regex: /(?:entrance|entry|entryway|doorway|access) (?:has|with|includes|requires|involves)(.*?)(?:\.|\n|$)/i, confidence: 0.7 }
      ],
      barriers: [
        { regex: /(?:barriers|obstacles|impediments|challenges|difficulties|accessibility barriers)(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.8 },
        { regex: /(?:barriers|obstacles|impediments|challenges|difficulties) (?:include|are|consist of|identified as)(.*?)(?:\.|\n|$)/i, confidence: 0.75 },
        { regex: /(?:identified|noted|observed|discovered|found) (?:barriers|obstacles|impediments|challenges|difficulties)(.*?)(?:\.|\n|$)/i, confidence: 0.7 }
      ],
      recommendations: [
        { regex: /(?:environmental recommendations|home modification recommendations|recommendations for home|suggestions for home|recommended modifications|recommended adaptations|recommended changes)(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.8 },
        { regex: /(?:recommended|suggested|proposed|advised) (?:modifications|adaptations|changes|adjustments|alterations)(.*?)(?:\.|\n|$)/i, confidence: 0.75 },
        { regex: /(?:recommendations|suggestions|modifications|adaptations) (?:include|are|consist of)(.*?)(?:\.|\n|$)/i, confidence: 0.7 }
      ],
      safetyRisks: [
        { regex: /(?:safety risks|safety hazards|safety concerns|home safety risks|potential hazards|identified risks|environmental risks|fall risks|fall hazards)(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.8 },
        { regex: /(?:safety risks|safety hazards|safety concerns|identified risks) (?:include|are|consist of)(.*?)(?:\.|\n|$)/i, confidence: 0.75 },
        { regex: /(?:risk|risks|hazard|hazards|danger|dangers) (?:of|for|include|involve)(.*?)(?:\.|\n|$)/i, confidence: 0.7 }
      ]
    };
    
    // Keywords for pattern matching
    this.homeTypeKeywords = ['house', 'apartment', 'condo', 'condominium', 'townhouse', 'duplex', 'bungalow'];
    this.livingArrangementKeywords = ['alone', 'spouse', 'partner', 'wife', 'husband', 'children'];
    this.homeLayoutKeywords = ['bedroom', 'bathroom', 'kitchen', 'living room', 'dining room', 'stairs'];
    this.accessKeywords = ['stairs', 'steps', 'ramp', 'elevator', 'lift', 'handrail', 'grab bar', 'doorway'];
    this.safetyRiskKeywords = ['fall', 'slip', 'trip', 'hazard', 'risk', 'danger', 'unsafe', 'unstable'];
  }
  
  /**
   * Extract data from ENVIRONMENTAL section text using enhanced pattern recognition
   * @param {string} text - ENVIRONMENTAL section text
   * @param {Object} allSections - All sections in the document
   * @returns {Object} Extracted data with confidence scores
   */
  extract(text, allSections = {}) {
    // Use base extractor first
    const result = super.extract(text, allSections);
    
    // Apply enhanced extraction techniques specific to ENVIRONMENTAL
    this.extractEnvironmentalNotes(text, result);
    this.extractHomeType(text, result);
    this.extractLivingArrangement(text, result);
    this.extractHomeLayout(text, result);
    this.extractAccess(text, result);
    this.extractBarriers(text, result);
    this.extractRecommendations(text, result);
    this.extractSafetyRisks(text, result);
    
    // Apply section-specific validations
    this.validateEnvironmentalData(result);
    
    return result;
  }
  
  /**
   * Extract environmental notes (general information about environment)
   * @param {string} text - Section text
   * @param {Object} result - Result object to update
   */
  extractEnvironmentalNotes(text, result) {
    if (!result.environmentalNotes) {
      result.environmentalNotes = text.trim();
      result.confidence.environmentalNotes = 0.9;
      result.environmentalNotes_method = 'fullText';
    }
  }
  
  /**
   * Extract home type information
   * @param {string} text - Section text
   * @param {Object} result - Result object to update
   */
  extractHomeType(text, result) {
    // Skip if already extracted with high confidence
    if (result.homeType && result.confidence.homeType > 0.7) {
      return;
    }
    
    // Try patterns from environmentalPatterns
    for (const pattern of this.environmentalPatterns.homeType) {
      const match = text.match(pattern.regex);
      if (match && match[1]) {
        result.homeType = match[1].trim();
        result.confidence.homeType = pattern.confidence;
        result.homeType_method = 'homeTypePattern';
        return;
      }
    }
    
    // Look for home type keywords in the text
    const sentences = text.split(/[.;]\s+/);
    const homeSentences = [];
    
    for (const sentence of sentences) {
      const lowerSentence = sentence.toLowerCase();
      
      // Check for sentences describing home type
      if (lowerSentence.includes('home type') || 
          lowerSentence.includes('residence type') ||
          lowerSentence.includes('dwelling type')) {
        homeSentences.push(sentence.trim());
      } else {
        // Check for home type keywords
        for (const keyword of this.homeTypeKeywords) {
          if (lowerSentence.includes(keyword)) {
            homeSentences.push(sentence.trim());
            break;
          }
        }
      }
    }
    
    if (homeSentences.length > 0) {
      // Use the first sentence that contains a home type keyword
      result.homeType = homeSentences[0];
      result.confidence.homeType = 0.6;
      result.homeType_method = 'homeTypeKeywords';
    }
  }
  
  /**
   * Extract barriers information
   * @param {string} text - Section text
   * @param {Object} result - Result object to update
   */
  extractBarriers(text, result) {
    // Skip if already extracted with high confidence
    if (result.barriers && result.confidence.barriers > 0.7) {
      return;
    }
    
    // Try patterns from environmentalPatterns
    for (const pattern of this.environmentalPatterns.barriers) {
      const match = text.match(pattern.regex);
      if (match && match[1]) {
        result.barriers = match[1].trim();
        result.confidence.barriers = pattern.confidence;
        result.barriers_method = 'barriersPattern';
        return;
      }
    }
    
    // Look for barrier keywords in the text
    const sentences = text.split(/[.;]\s+/);
    const barrierSentences = [];
    
    for (const sentence of sentences) {
      const lowerSentence = sentence.toLowerCase();
      
      // Check for sentences describing barriers
      if (lowerSentence.includes('barrier') || 
          lowerSentence.includes('obstacle') ||
          lowerSentence.includes('impediment') ||
          lowerSentence.includes('challenge') ||
          lowerSentence.includes('difficulty')) {
        barrierSentences.push(sentence.trim());
      }
    }
    
    if (barrierSentences.length > 0) {
      result.barriers = barrierSentences.join('. ');
      result.confidence.barriers = 0.6;
      result.barriers_method = 'barrierKeywords';
    } else {
      // Default to "None identified" with low confidence
      result.barriers = "None identified";
      result.confidence.barriers = 0.2;
      result.barriers_method = 'defaultValue';
    }
  }
  
  /**
   * Extract recommendations information
   * @param {string} text - Section text
   * @param {Object} result - Result object to update
   */
  extractRecommendations(text, result) {
    // Skip if already extracted with high confidence
    if (result.recommendations && result.confidence.recommendations > 0.7) {
      return;
    }
    
    // Try patterns from environmentalPatterns
    for (const pattern of this.environmentalPatterns.recommendations) {
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
      const lowerSentence = sentence.toLowerCase();
      
      // Check for sentences containing recommendation language
      if (lowerSentence.includes('recommend') || 
          lowerSentence.includes('suggest') ||
          lowerSentence.includes('advise') ||
          lowerSentence.includes('propose')) {
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
   * Extract safety risks information
   * @param {string} text - Section text
   * @param {Object} result - Result object to update
   */
  extractSafetyRisks(text, result) {
    // Skip if already extracted with high confidence
    if (result.safetyRisks && result.confidence.safetyRisks > 0.7) {
      return;
    }
    
    // Try patterns from environmentalPatterns
    for (const pattern of this.environmentalPatterns.safetyRisks) {
      const match = text.match(pattern.regex);
      if (match && match[1]) {
        result.safetyRisks = match[1].trim();
        result.confidence.safetyRisks = pattern.confidence;
        result.safetyRisks_method = 'safetyRisksPattern';
        return;
      }
    }
    
    // Look for safety risk keywords in the text
    const sentences = text.split(/[.;]\s+/);
    const riskSentences = [];
    
    for (const sentence of sentences) {
      const lowerSentence = sentence.toLowerCase();
      
      // Check for sentences containing safety risk language
      if (lowerSentence.includes('safety') || 
          lowerSentence.includes('hazard') ||
          lowerSentence.includes('risk') ||
          lowerSentence.includes('danger')) {
          
        // Check if sentence contains specific safety risk keywords
        for (const keyword of this.safetyRiskKeywords) {
          if (lowerSentence.includes(keyword)) {
            riskSentences.push(sentence.trim());
            break;
          }
        }
      }
    }
    
    if (riskSentences.length > 0) {
      result.safetyRisks = riskSentences.join('. ');
      result.confidence.safetyRisks = 0.6;
      result.safetyRisks_method = 'safetyRiskKeywords';
    } else {
      // Default to "None identified" with low confidence
      result.safetyRisks = "None identified";
      result.confidence.safetyRisks = 0.2;
      result.safetyRisks_method = 'defaultValue';
    }
  }
  
  /**
   * Extract living arrangement information
   * @param {string} text - Section text
   * @param {Object} result - Result object to update
   */
  extractLivingArrangement(text, result) {
    // Skip if already extracted with high confidence
    if (result.livingArrangement && result.confidence.livingArrangement > 0.7) {
      return;
    }
    
    // Try patterns from environmentalPatterns
    for (const pattern of this.environmentalPatterns.livingArrangement) {
      const match = text.match(pattern.regex);
      if (match && match[1]) {
        result.livingArrangement = match[1].trim();
        result.confidence.livingArrangement = pattern.confidence;
        result.livingArrangement_method = 'livingArrangementPattern';
        return;
      }
    }
    
    // Look for living arrangement keywords in the text
    const sentences = text.split(/[.;]\s+/);
    const arrangementSentences = [];
    
    for (const sentence of sentences) {
      const lowerSentence = sentence.toLowerCase();
      
      // Check for sentences describing living arrangements
      if (lowerSentence.includes('living arrangement') || 
          lowerSentence.includes('living situation') ||
          lowerSentence.includes('lives with') ||
          lowerSentence.includes('resides with')) {
        arrangementSentences.push(sentence.trim());
      } else {
        // Check for living arrangement keywords
        for (const keyword of this.livingArrangementKeywords) {
          if (lowerSentence.includes(keyword)) {
            arrangementSentences.push(sentence.trim());
            break;
          }
        }
      }
    }
    
    if (arrangementSentences.length > 0) {
      // Use the first sentence that contains a living arrangement keyword
      result.livingArrangement = arrangementSentences[0];
      result.confidence.livingArrangement = 0.6;
      result.livingArrangement_method = 'livingArrangementKeywords';
    }
  }
  
  /**
   * Extract home layout information
   * @param {string} text - Section text
   * @param {Object} result - Result object to update
   */
  extractHomeLayout(text, result) {
    // Skip if already extracted with high confidence
    if (result.homeLayout && result.confidence.homeLayout > 0.7) {
      return;
    }
    
    // Try patterns from environmentalPatterns
    for (const pattern of this.environmentalPatterns.homeLayout) {
      const match = text.match(pattern.regex);
      if (match && match[1]) {
        result.homeLayout = match[1].trim();
        result.confidence.homeLayout = pattern.confidence;
        result.homeLayout_method = 'homeLayoutPattern';
        return;
      }
    }
    
    // Look for home layout keywords in the text
    const sentences = text.split(/[.;]\s+/);
    const layoutSentences = [];
    
    for (const sentence of sentences) {
      const lowerSentence = sentence.toLowerCase();
      
      // Check for sentences describing home layout
      if (lowerSentence.includes('layout') || 
          lowerSentence.includes('floor plan') ||
          lowerSentence.includes('consists of')) {
        layoutSentences.push(sentence.trim());
      } else {
        // Check for home layout keywords
        for (const keyword of this.homeLayoutKeywords) {
          if (lowerSentence.includes(keyword)) {
            layoutSentences.push(sentence.trim());
            break;
          }
        }
      }
    }
    
    if (layoutSentences.length > 0) {
      // If we have layout sentences, join them
      if (layoutSentences.length <= 3) {
        result.homeLayout = layoutSentences.join('. ');
      } else {
        // If too many sentences, use only the most relevant ones
        const sortedSentences = layoutSentences.slice(0, 3);
        result.homeLayout = sortedSentences.join('. ');
      }
      result.confidence.homeLayout = 0.5;
      result.homeLayout_method = 'homeLayoutKeywords';
    }
  }
  
  /**
   * Extract access information
   * @param {string} text - Section text
   * @param {Object} result - Result object to update
   */
  extractAccess(text, result) {
    // Skip if already extracted with high confidence
    if (result.access && result.confidence.access > 0.7) {
      return;
    }
    
    // Initialize access object if not already present
    if (!result.access) {
      result.access = {
        entrance: '',
        bathroom: '',
        bedroom: '',
        kitchen: ''
      };
      if (!result.confidence.access) {
        result.confidence.access = 0;
      }
    }
    
    // Try patterns from environmentalPatterns
    for (const pattern of this.environmentalPatterns.access) {
      const match = text.match(pattern.regex);
      if (match && match[1]) {
        const accessInfo = match[1].trim();
        
        // Check if this pertains to a specific area
        if (accessInfo.toLowerCase().includes('entrance') || 
            accessInfo.toLowerCase().includes('entry')) {
          result.access.entrance = accessInfo;
        } else if (accessInfo.toLowerCase().includes('bathroom')) {
          result.access.bathroom = accessInfo;
        } else if (accessInfo.toLowerCase().includes('bedroom')) {
          result.access.bedroom = accessInfo;
        } else if (accessInfo.toLowerCase().includes('kitchen')) {
          result.access.kitchen = accessInfo;
        } else {
          // General access information
          result.access.general = accessInfo;
        }
        
        result.confidence.access = pattern.confidence;
        result.access_method = 'accessPattern';
        return;
      }
    }
    
    // Look for access keywords in the text
    const sentences = text.split(/[.;]\s+/);
    const accessSentences = [];
    
    for (const sentence of sentences) {
      const lowerSentence = sentence.toLowerCase();
      
      // Check if sentence contains access-related keywords
      for (const keyword of this.accessKeywords) {
        if (lowerSentence.includes(keyword)) {
          accessSentences.push(sentence.trim());
          break;
        }
      }
    }
    
    if (accessSentences.length > 0) {
      // Use the first few sentences that contain access keywords
      result.access.general = accessSentences.slice(0, 3).join('. ');
      result.confidence.access = 0.5;
      result.access_method = 'accessKeywords';
    }
  }
  
  /**
   * Validate and refine environmental data
   * @param {Object} result - Result object to validate
   */
  validateEnvironmentalData(result) {
    // Convert list-like strings to arrays for consistency
    if (result.recommendations && typeof result.recommendations === 'string' && 
        (result.recommendations.includes(',') || result.recommendations.toLowerCase().includes(' and '))) {
      const recommendations = result.recommendations.split(/,|and/).map(item => item.trim()).filter(item => item.length > 0);
      if (recommendations.length > 1) {
        result.recommendations = recommendations;
      }
    }
    
    if (result.barriers && typeof result.barriers === 'string' && 
        (result.barriers.includes(',') || result.barriers.toLowerCase().includes(' and '))) {
      const barriers = result.barriers.split(/,|and/).map(item => item.trim()).filter(item => item.length > 0);
      if (barriers.length > 1) {
        result.barriers = barriers;
      }
    }
    
    // Ensure access is an object with appropriate structure
    if (result.access && typeof result.access === 'string') {
      const generalAccess = result.access;
      result.access = {
        entrance: '',
        bathroom: '',
        bedroom: '',
        kitchen: '',
        general: generalAccess
      };
    }
  }
  
  /**
   * Check if the section appears to be an ENVIRONMENTAL section
   * @param {Object} result - Extraction result
   * @returns {boolean} True if likely an ENVIRONMENTAL section
   */
  isCorrectSectionType(result) {
    // ENVIRONMENTAL sections typically discuss home environment, layout, etc.
    
    // Check for high-priority environmental fields
    if ((result.homeType && result.confidence.homeType > 0.6) ||
        (result.access && result.confidence.access > 0.6) ||
        (result.homeLayout && result.confidence.homeLayout > 0.6)) {
      return true;
    }
    
    // Count environmental fields present with decent confidence
    let envFieldsPresent = 0;
    
    if (result.homeType && result.confidence.homeType > 0.4) envFieldsPresent++;
    if (result.livingArrangement && result.confidence.livingArrangement > 0.4) envFieldsPresent++;
    if (result.homeLayout && result.confidence.homeLayout > 0.4) envFieldsPresent++;
    if (result.access && result.confidence.access > 0.4) envFieldsPresent++;
    if (result.barriers && result.confidence.barriers > 0.4) envFieldsPresent++;
    if (result.recommendations && result.confidence.recommendations > 0.4) envFieldsPresent++;
    if (result.safetyRisks && result.confidence.safetyRisks > 0.4) envFieldsPresent++;
    
    // If we have at least 2 environmental fields, it's likely an ENVIRONMENTAL section
    return envFieldsPresent >= 2 || result.overallConfidence > 0.4;
  }
}

module.exports = ENVIRONMENTALExtractor;
