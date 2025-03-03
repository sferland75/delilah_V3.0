/**
 * ExtractorFactory.js
 * 
 * Factory for creating section-specific extractors based on document classification
 * and section type. Uses the adaptive pattern selection approach to optimize extraction.
 */

const BaseExtractor = require('./BaseExtractor');
const SYMPTOMSExtractor = require('./SYMPTOMSExtractor');
const DEMOGRAPHICSExtractor = require('./DEMOGRAPHICSExtractor');
const MEDICAL_HISTORYExtractor = require('./MEDICAL_HISTORYExtractor');
const ENVIRONMENTALExtractor = require('./ENVIRONMENTALExtractor');
const ATTENDANT_CAREExtractor = require('./ATTENDANT_CAREExtractor');
const FUNCTIONAL_STATUSExtractor = require('./FUNCTIONAL_STATUSExtractor');
const TYPICAL_DAYExtractor = require('./TYPICAL_DAYExtractor');
const ADLSExtractor = require('./ADLSExtractor');

/**
 * Factory for creating section-specific extractors
 */
class ExtractorFactory {
  /**
   * Get the appropriate extractor for a section
   * @param {string} sectionType - The section type (e.g., 'DEMOGRAPHICS')
   * @param {Object} options - Options for extractor customization
   * @returns {BaseExtractor} The appropriate extractor instance
   */
  static getExtractor(sectionType, options = {}) {
    // Apply document classification to extractor selection
    const docType = options.documentType || 'unknown';
    const docStructure = options.documentStructure || 'unknown';
    
    // Select extractor based on section type and document characteristics
    switch (sectionType) {
      case 'SYMPTOMS':
        return new SYMPTOMSExtractor();
      
      case 'DEMOGRAPHICS':
        return new DEMOGRAPHICSExtractor();
      
      case 'MEDICAL_HISTORY':
        return new MEDICAL_HISTORYExtractor();
      
      case 'ENVIRONMENTAL':
        return new ENVIRONMENTALExtractor();
      
      case 'ATTENDANT_CARE':
        return new ATTENDANT_CAREExtractor();
      
      case 'FUNCTIONAL_STATUS':
        return new FUNCTIONAL_STATUSExtractor();
      
      case 'TYPICAL_DAY':
        return new TYPICAL_DAYExtractor();
      
      case 'ADLS':
        return new ADLSExtractor();
      
      // Default to base extractor for any unimplemented sections
      default:
        return new BaseExtractor(sectionType);
    }
  }
  
  /**
   * Extract data from a section using the appropriate extractor
   * @param {string} sectionType - The section type (e.g., 'DEMOGRAPHICS')
   * @param {string} text - The section text to extract from
   * @param {Object} options - Options for extractor customization
   * @param {Object} allSections - All sections in the document (for cross-referencing)
   * @returns {Object} Extraction result with confidence scores
   */
  static extractSection(sectionType, text, options = {}, allSections = {}) {
    const extractor = this.getExtractor(sectionType, options);
    return extractor.extract(text, allSections);
  }
  
  /**
   * Extract data from all sections in a document
   * @param {Array} sections - Array of section objects with { section, content } properties
   * @param {Object} options - Options for extractor customization
   * @returns {Object} Extraction results by section type
   */
  static extractAllSections(sections, options = {}) {
    if (!sections || !Array.isArray(sections)) {
      console.error('Invalid sections provided to extractAllSections');
      return {};
    }
    
    // First, collect all section content for cross-referencing
    const allSectionContent = {};
    sections.forEach(section => {
      allSectionContent[section.section] = section.content;
    });
    
    // Then extract data from each section
    const results = {};
    sections.forEach(section => {
      results[section.section] = this.extractSection(
        section.section,
        section.content,
        options,
        allSectionContent
      );
    });
    
    return results;
  }
  
  /**
   * Classify document to determine optimal extraction strategy
   * @param {string} fullText - Full document text
   * @returns {Object} Document classification
   */
  static classifyDocument(fullText) {
    const classification = {
      type: 'unknown',
      confidence: 0,
      structure: 'unknown',
      length: fullText.length,
      complexity: 0
    };
    
    // Check for document type indicators
    if (fullText.includes('IN-HOME ASSESSMENT') || fullText.includes('IHA')) {
      classification.type = 'in-home-assessment';
      classification.confidence = 0.9;
    } else if (fullText.includes('REFERRAL') || fullText.includes('REFERRER')) {
      classification.type = 'referral';
      classification.confidence = 0.9;
    }
    
    // Determine structure
    const lines = fullText.split('\n');
    const shortLineRatio = lines.filter(l => l.length < 50).length / lines.length;
    
    if (shortLineRatio > 0.7) {
      classification.structure = 'form';
    } else {
      classification.structure = 'narrative';
    }
    
    // Calculate complexity (simple implementation)
    const uniqueWords = new Set(fullText.toLowerCase().split(/\s+/));
    classification.complexity = Math.min(1, uniqueWords.size / 5000);
    
    return classification;
  }
  
  /**
   * Select optimal pattern matching strategy based on document type
   * @param {Object} classification - Document classification
   * @returns {Object} Pattern matching strategy
   */
  static selectPatternStrategy(classification) {
    const strategy = {
      confidenceThreshold: 0.3, // Default
      patternPriority: 'balanced', // Default
      contextWeight: 0.5, // Default
      fallbackEnabled: true // Default
    };
    
    // Adjust based on document type
    if (classification.type === 'in-home-assessment') {
      strategy.confidenceThreshold = 0.25; // Lower threshold for IHAs
      strategy.patternPriority = 'section-first'; // Prioritize section headers
    } else if (classification.type === 'referral') {
      strategy.confidenceThreshold = 0.35; // Higher threshold for referrals
      strategy.patternPriority = 'content-first'; // Prioritize content patterns
    }
    
    // Adjust based on structure
    if (classification.structure === 'form') {
      strategy.contextWeight = 0.7; // Higher context weight for forms
    } else {
      strategy.contextWeight = 0.3; // Lower context weight for narratives
    }
    
    // Adjust based on complexity
    if (classification.complexity > 0.7) {
      strategy.fallbackEnabled = true; // Enable fallbacks for complex docs
    }
    
    return strategy;
  }
}

module.exports = ExtractorFactory;
