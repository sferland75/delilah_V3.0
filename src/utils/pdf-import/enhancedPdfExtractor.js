// Enhanced PDF Extractor
// This file provides improved logging and pattern recognition capabilities

/**
 * Enhanced extractor function that adds more robust extraction and logging
 * for debugging pattern recognition issues.
 */
class EnhancedExtractor {
  /**
   * Wraps an existing extractor with enhanced logging and fallback mechanisms
   * @param {Object} baseExtractor - The original extractor to enhance
   * @param {string} sectionName - Name of the section being extracted
   * @returns {Object} Enhanced extractor with the same API
   */
  static enhance(baseExtractor, sectionName) {
    return {
      extract: (text) => {
        console.log(`[EnhancedExtractor] Begin extracting ${sectionName} data`);
        console.log(`[EnhancedExtractor] Text length: ${text?.length || 0} characters`);
        
        if (!text || text.length < 10) {
          console.warn(`[EnhancedExtractor] Warning: Text for ${sectionName} is too short or empty`);
          return {
            _extractionFailed: true,
            _reason: "Insufficient text content",
            confidence: {}
          };
        }
        
        try {
          // Log first 200 characters to help debugging
          console.log(`[EnhancedExtractor] Text sample: "${text.substring(0, 200).replace(/\n/g, ' ')}..."`);
          
          // Call the original extractor
          const extractedData = baseExtractor.extract(text);
          
          // Log extraction results
          console.log(`[EnhancedExtractor] ${sectionName} extraction results:`, 
            Object.keys(extractedData).filter(key => key !== 'confidence').length, 
            'fields extracted');
          
          // Check if we got meaningful results by looking at confidence scores and field values
          const hasConfidenceScores = Object.keys(extractedData.confidence || {}).length > 0;
          const hasNonEmptyFields = Object.entries(extractedData)
            .filter(([key]) => key !== 'confidence' && key !== '_extractionFailed' && key !== '_reason')
            .some(([_, value]) => {
              if (Array.isArray(value)) return value.length > 0;
              if (typeof value === 'object') return Object.keys(value).length > 0;
              return !!value;
            });
          
          if (!hasConfidenceScores || !hasNonEmptyFields) {
            console.warn(`[EnhancedExtractor] Warning: ${sectionName} extraction produced empty or low confidence results`);
            extractedData._partialExtraction = true;
            extractedData._extractionQuality = "low";
          } else {
            console.log(`[EnhancedExtractor] ${sectionName} extraction successful`);
          }
          
          return extractedData;
        } catch (error) {
          console.error(`[EnhancedExtractor] Error in ${sectionName} extraction:`, error);
          return {
            _extractionFailed: true,
            _reason: error.message,
            confidence: {}
          };
        }
      }
    };
  }
  
  /**
   * Gets a set of enhanced extractors for all section types
   * @param {Object} originalExtractors - Object mapping section names to their extractors
   * @returns {Object} Enhanced extractors with the same structure
   */
  static enhanceAll(originalExtractors) {
    const enhanced = {};
    
    Object.entries(originalExtractors).forEach(([sectionName, extractor]) => {
      enhanced[sectionName] = this.enhance(extractor, sectionName);
    });
    
    return enhanced;
  }
}

module.exports = EnhancedExtractor;
