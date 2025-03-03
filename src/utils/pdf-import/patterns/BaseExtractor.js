/**
 * BaseExtractor.js
 * 
 * Base class for section-specific extractors with prioritized field extraction
 * based on statistical analysis.
 */

const ExtractorUtils = require('./ExtractorUtils');

class BaseExtractor {
  /**
   * Create a new BaseExtractor
   * @param {string} sectionType - The section type (e.g., 'DEMOGRAPHICS')
   */
  constructor(sectionType) {
    this.sectionType = sectionType;
    
    // Load priorities based on statistical analysis
    const allFieldPriorities = ExtractorUtils.getFieldPriorities();
    this.fieldPriorities = allFieldPriorities[sectionType] || {
      high: [],
      medium: [],
      low: [],
      veryLow: []
    };
    
    // Load extraction strategies
    this.extractionStrategies = ExtractorUtils.getExtractionStrategies();
    
    // Load extraction methods
    this.extractionMethods = ExtractorUtils.getExtractionMethods();
  }
  
  /**
   * Initialize the result object with empty values for all fields
   * @returns {Object} Initial result object
   */
  initializeResult() {
    const result = {
      confidence: {}
    };
    
    // Initialize all fields based on priorities
    Object.values(this.fieldPriorities).flat().forEach(field => {
      result[field] = null;
      result.confidence[field] = 0;
    });
    
    return result;
  }
  
  /**
   * Extract data from the section text using prioritized field extraction
   * @param {string} text - The section text to extract from
   * @param {Object} allSections - All sections in the document (for cross-referencing)
   * @returns {Object} Extraction result with confidence scores
   */
  extract(text, allSections = {}) {
    if (!text || typeof text !== 'string') {
      console.error(`Invalid text provided to ${this.sectionType} extractor`);
      return this.initializeResult();
    }
    
    const result = this.initializeResult();
    
    // Extract in priority order with appropriate strategies
    this.extractPriorityFields(text, result, 'high', allSections);
    this.extractPriorityFields(text, result, 'medium', allSections);
    this.extractPriorityFields(text, result, 'low', allSections);
    this.extractPriorityFields(text, result, 'veryLow', allSections);
    
    // Post-process to ensure consistency
    this.validateExtractions(result);
    this.computeConfidenceScores(result);
    
    return result;
  }
  
  /**
   * Extract fields with the given priority
   * @param {string} text - Section text
   * @param {Object} result - Result object to populate
   * @param {string} priority - Priority level ('high', 'medium', 'low', 'veryLow')
   * @param {Object} allSections - All sections in the document (for cross-referencing)
   */
  extractPriorityFields(text, result, priority, allSections) {
    const fields = this.fieldPriorities[priority] || [];
    const strategies = this.extractionStrategies[priority] || [];
    
    fields.forEach(field => {
      // Skip if already extracted with higher confidence
      if (result[field] && result.confidence[field] > 0.5) return;
      
      // Try each strategy until one succeeds
      for (const strategy of strategies) {
        const method = this.extractionMethods[strategy];
        if (!method) continue;
        
        const extracted = method(text, field, this.sectionType, result, allSections);
        if (extracted) {
          result[field] = extracted.value;
          result.confidence[field] = extracted.confidence;
          result[`${field}_method`] = extracted.method;
          break;
        }
      }
    });
  }
  
  /**
   * Validate and clean up extracted data
   * @param {Object} result - Extraction result to validate
   */
  validateExtractions(result) {
    // Override this method in subclasses for section-specific validation
  }
  
  /**
   * Compute overall confidence scores
   * @param {Object} result - Extraction result to compute confidence for
   */
  computeConfidenceScores(result) {
    if (!result || !result.confidence) return;
    
    // Calculate overall confidence as weighted average of field confidences
    let totalConfidence = 0;
    let totalWeight = 0;
    
    // Calculate weighted average based on field priorities
    Object.keys(result.confidence).forEach(field => {
      let weight = 1;
      
      // High priority fields get higher weights
      if (this.fieldPriorities.high.includes(field)) {
        weight = 3;
      } else if (this.fieldPriorities.medium.includes(field)) {
        weight = 2;
      } else if (this.fieldPriorities.low.includes(field)) {
        weight = 1;
      } else {
        weight = 0.5;
      }
      
      // Apply statistical weight from analysis
      const statisticalWeight = ExtractorUtils.getFieldConfidenceWeight(this.sectionType, field);
      weight *= statisticalWeight;
      
      // Add to totals
      totalConfidence += result.confidence[field] * weight;
      totalWeight += weight;
    });
    
    // Calculate overall confidence
    result.overallConfidence = totalWeight > 0 ? totalConfidence / totalWeight : 0;
  }
  
  /**
   * Check if the extracted data seems to be correctly categorized as this section
   * @param {Object} result - Extraction result to validate
   * @returns {boolean} True if correctly categorized, false otherwise
   */
  isCorrectSectionType(result) {
    // Override in subclasses for section-specific validation
    return result.overallConfidence > 0.3;
  }
}

module.exports = BaseExtractor;
