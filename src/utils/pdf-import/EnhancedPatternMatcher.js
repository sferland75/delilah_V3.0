// EnhancedPatternMatcher.js
// Improved pattern matcher with learning capabilities
// Part of Delilah V3.0 PDF Import Pattern Recognition Enhancement

const PatternMatcher = require('./PatternMatcher');

/**
 * Enhanced pattern matcher with fuzzy matching and learning capabilities
 */
class EnhancedPatternMatcher {
  /**
   * Create a new enhanced pattern matcher
   * @param {Object} basePatterns - Original patterns to use
   * @param {Object} trainingData - Optional training data to apply
   */
  constructor(basePatterns, trainingData = null) {
    this.basePatterns = basePatterns;
    this.patternTrainingService = null;
    this.confidenceAdjustments = new Map();
    this.documentClassifier = null;
    this.documentType = null;
    this.cacheEnabled = true;
    this.cachedResults = new Map();
    
    // Apply training data if provided
    if (trainingData) {
      try {
        const PatternTrainingService = require('./PatternTrainingService');
        this.patternTrainingService = new PatternTrainingService();
        this.activePatterns = this.patternTrainingService.applyTrainingToPatterns(basePatterns, trainingData);
      } catch (error) {
        console.error('[EnhancedPatternMatcher] Failed to apply training data:', error);
        this.activePatterns = basePatterns;
      }
    } else {
      this.activePatterns = basePatterns;
    }
  }
  
  /**
   * Set the document classifier to use for adaptive pattern selection
   * @param {Object} classifier - The document classifier to use
   */
  setDocumentClassifier(classifier) {
    this.documentClassifier = classifier;
  }
  
  /**
   * Enable or disable result caching
   * @param {Boolean} enabled - Whether caching should be enabled
   */
  setCacheEnabled(enabled) {
    this.cacheEnabled = enabled;
    if (!enabled) {
      this.cachedResults.clear();
    }
  }
  
  /**
   * Classify a document to determine its type and structure
   * @param {String} text - The document text to classify
   * @returns {Object} - Classification result with type and confidence
   */
  classifyDocument(text) {
    if (!this.documentClassifier) {
      return { type: 'unknown', confidence: 0 };
    }
    
    const result = this.documentClassifier.identifyDocumentType(text);
    this.documentType = result.type;
    return result;
  }
  
  /**
   * Match text with a pattern with tolerance for minor differences
   * @param {String} text - Text to match
   * @param {RegExp|String} pattern - Pattern to match against
   * @param {Number} tolerance - Tolerance level (0-1, where 0 is exact match, 1 is very loose)
   * @returns {Object|null} - Match result or null if no match
   */
  matchWithTolerance(text, pattern, tolerance = 0.2) {
    if (!text) return null;
    
    // For exact matching, use standard RegExp
    if (tolerance === 0) {
      const regexPattern = pattern instanceof RegExp ? pattern : new RegExp(pattern, 'i');
      const match = text.match(regexPattern);
      return match;
    }
    
    // For fuzzy matching, we need to implement a more complex algorithm
    const regexPattern = pattern instanceof RegExp ? pattern : new RegExp(pattern, 'i');
    
    // Try exact match first
    const exactMatch = text.match(regexPattern);
    if (exactMatch) return exactMatch;
    
    // If tolerance is low, skip fuzzy matching
    if (tolerance < 0.1) return null;
    
    // Simplified fuzzy matching - check for substring matches
    // For a real implementation, you'd use a proper fuzzy matching algorithm
    const patternStr = pattern instanceof RegExp ? 
      pattern.toString().slice(1, -1) : pattern;
    
    // Remove special regex characters for substring matching
    const cleanPatternStr = patternStr
      .replace(/\(\?:[^)]+\)/g, '') // Remove non-capturing groups
      .replace(/[\^\$\[\]\(\)\{\}\.\+\*\?\|\\]/g, '') // Remove special regex chars
      .trim();
    
    if (cleanPatternStr.length < 3) return null; // Too short for fuzzy matching
    
    // Check if at least 70% of the clean pattern is in the text
    const words = cleanPatternStr.split(/\s+/);
    let matchedWords = 0;
    
    words.forEach(word => {
      if (word.length < 3) {
        matchedWords += 0.5; // Short words match by default (partial credit)
      } else if (text.toLowerCase().includes(word.toLowerCase())) {
        matchedWords += 1;
      }
    });
    
    const matchRatio = matchedWords / words.length;
    if (matchRatio >= (1 - tolerance)) {
      // Create a mock match result
      return [
        cleanPatternStr,
        cleanPatternStr,
        index: text.toLowerCase().indexOf(words[0].toLowerCase()), 
        fuzzyMatchQuality: matchRatio
      ];
    }
    
    return null;
  }
  
  /**
   * Extract data with context awareness
   * @param {String} text - Text to extract from
   * @param {Array|Object} patterns - Patterns to use for extraction
   * @param {Number} surroundingLines - Number of surrounding lines to include for context
   * @returns {Object} - Extracted data with context
   */
  extractWithContext(text, patterns, surroundingLines = 3) {
    if (!text) return { success: false, reason: "No text provided" };
    
    // Use the basic PatternMatcher for initial extraction
    const basicResult = this.extractBasic(text, patterns);
    
    // If no successful extraction, return the basic result
    if (!basicResult || !basicResult.success || !basicResult.data) {
      return basicResult;
    }
    
    // Enhance extracted data with context
    const enhancedData = { ...basicResult.data };
    
    // Get line-by-line context for each matched field
    Object.keys(enhancedData).forEach(field => {
      if (field === 'confidence' || field.startsWith('_')) return;
      
      const value = enhancedData[field];
      if (!value || typeof value !== 'string') return;
      
      // Find the value in the text
      const escapedValue = value.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const valueRegex = new RegExp(`((?:.*\\n){0,${surroundingLines}})(.*${escapedValue}.*)((?:\\n.*){0,${surroundingLines}})`, 'i');
      const match = text.match(valueRegex);
      
      if (match) {
        // Store context
        enhancedData[`${field}_context`] = {
          before: match[1] ? match[1].trim() : '',
          line: match[2] ? match[2].trim() : '',
          after: match[3] ? match[3].trim() : ''
        };
      }
    });
    
    return {
      ...basicResult,
      data: enhancedData
    };
  }
  
  /**
   * Basic extraction method using PatternMatcher
   * @param {String} text - Text to extract from
   * @param {Array|Object} patterns - Patterns to use for extraction
   * @returns {Object} - Basic extraction result
   */
  extractBasic(text, patterns) {
    // Use PatternMatcher for basic extraction
    return PatternMatcher.extract(text, patterns);
  }
  
  /**
   * Detect sections in text with improved confidence calculation
   * @param {String} text - Document text
   * @returns {Object} - Detected sections with confidence scores
   */
  detectSections(text) {
    // Check cache first if enabled
    const cacheKey = this.cacheEnabled ? `detectSections_${text.length}_${text.substring(0, 100)}` : null;
    if (this.cacheEnabled && this.cachedResults.has(cacheKey)) {
      return this.cachedResults.get(cacheKey);
    }
    
    // Classify document if classifier is available
    if (this.documentClassifier && !this.documentType) {
      this.classifyDocument(text);
    }
    
    // Use the appropriate patterns based on document type
    let patterns = this.activePatterns;
    if (this.documentType && this.activePatterns[this.documentType]) {
      patterns = this.activePatterns[this.documentType];
    }
    
    // Use base PatternMatcher to detect sections
    const baseDetection = PatternMatcher.detectSections(text, patterns);
    
    // Enhance detection with improved confidence calculation
    const enhancedDetection = this.enhanceConfidenceScores(baseDetection);
    
    // Cache the result if enabled
    if (this.cacheEnabled && cacheKey) {
      this.cachedResults.set(cacheKey, enhancedDetection);
    }
    
    return enhancedDetection;
  }
  
  /**
   * Enhance confidence scores with training data and document type
   * @param {Object} detection - Base detection result
   * @returns {Object} - Enhanced detection with improved confidence
   */
  enhanceConfidenceScores(detection) {
    // Clone the detection to avoid modifying the original
    const enhanced = JSON.parse(JSON.stringify(detection));
    
    // Apply confidence adjustments from successful matches
    Object.keys(enhanced).forEach(section => {
      if (this.confidenceAdjustments.has(section)) {
        const adjustment = this.confidenceAdjustments.get(section);
        enhanced[section].confidence = Math.min(1, enhanced[section].confidence + adjustment);
      }
      
      // Apply document type specific adjustments
      if (this.documentType) {
        // Increase confidence for expected sections in this document type
        const expectedSections = this.getExpectedSections(this.documentType);
        if (expectedSections.includes(section)) {
          enhanced[section].confidence = Math.min(1, enhanced[section].confidence + 0.1);
        }
      }
    });
    
    return enhanced;
  }
  
  /**
   * Get expected sections for a document type
   * @param {String} documentType - Type of document
   * @returns {Array} - Expected section names
   */
  getExpectedSections(documentType) {
    // Map document types to their expected sections
    const documentTypeSections = {
      'OT_ASSESSMENT': [
        'DEMOGRAPHICS', 
        'MEDICAL_HISTORY', 
        'SYMPTOMS', 
        'FUNCTIONAL_STATUS',
        'ENVIRONMENTAL',
        'ADLS',
        'ATTENDANT_CARE'
      ],
      'MEDICAL_REPORT': [
        'DEMOGRAPHICS',
        'MEDICAL_HISTORY',
        'SYMPTOMS',
        'DIAGNOSIS',
        'TREATMENT_PLAN'
      ],
      'PSYCHOLOGY_REPORT': [
        'DEMOGRAPHICS',
        'HISTORY',
        'MENTAL_STATUS',
        'ASSESSMENT',
        'RECOMMENDATIONS'
      ]
    };
    
    return documentTypeSections[documentType] || [];
  }
  
  /**
   * Extract data from a section with improved accuracy
   * @param {String} text - Section text
   * @param {String} section - Section name
   * @returns {Object} - Extracted data with confidence scores
   */
  extractSectionData(text, section) {
    // Check cache first if enabled
    const cacheKey = this.cacheEnabled ? 
      `extractSection_${section}_${text.length}_${text.substring(0, 50)}` : null;
    
    if (this.cacheEnabled && this.cachedResults.has(cacheKey)) {
      return this.cachedResults.get(cacheKey);
    }
    
    // Get the appropriate extractor for this section
    let extractor = null;
    try {
      // Try to dynamically load the section extractor
      extractor = require(`./${section}Extractor`);
    } catch (error) {
      console.warn(`[EnhancedPatternMatcher] No extractor found for section: ${section}`);
      return { 
        confidence: {},
        _extractionFailed: true,
        _reason: `No extractor available for ${section}`
      };
    }
    
    // Extract data using the specialized extractor
    let result = extractor.extract(text);
    
    // Record successful extraction to improve future confidence
    if (result && !result._extractionFailed) {
      this.recordSuccessfulMatch(section, result.confidence || {});
    }
    
    // Cache the result if enabled
    if (this.cacheEnabled && cacheKey) {
      this.cachedResults.set(cacheKey, result);
    }
    
    return result;
  }
  
  /**
   * Record a successful pattern match to improve future confidence
   * @param {String} sectionId - Section identifier
   * @param {Object} confidence - Confidence scores
   */
  recordSuccessfulMatch(sectionId, confidence) {
    // Calculate average confidence
    let totalConfidence = 0;
    let count = 0;
    
    Object.values(confidence).forEach(value => {
      if (typeof value === 'number') {
        totalConfidence += value;
        count++;
      }
    });
    
    if (count === 0) return;
    
    const avgConfidence = totalConfidence / count;
    
    // Record success with appropriate weight
    // More confident matches get more weight
    const adjustment = avgConfidence > 0.8 ? 0.05 : 0.02;
    
    this.confidenceAdjustments.set(
      sectionId, 
      (this.confidenceAdjustments.get(sectionId) || 0) + adjustment
    );
  }
  
  /**
   * Process a complete document with enhanced pattern recognition
   * @param {String} text - Complete document text
   * @returns {Object} - Complete extraction results with all sections
   */
  processDocument(text) {
    console.log('[EnhancedPatternMatcher] Processing document...');
    
    // Classify document
    const classification = this.classifyDocument(text);
    console.log(`[EnhancedPatternMatcher] Document classified as: ${classification.type} (${classification.confidence.toFixed(2)})`);
    
    // Detect sections
    const sections = this.detectSections(text);
    console.log(`[EnhancedPatternMatcher] Detected ${Object.keys(sections).length} sections`);
    
    // Process each section
    const results = {
      _documentType: classification.type,
      _documentConfidence: classification.confidence,
      _sections: {}
    };
    
    Object.keys(sections).forEach(section => {
      console.log(`[EnhancedPatternMatcher] Processing section: ${section} (${sections[section].confidence.toFixed(2)})`);
      
      const sectionText = sections[section].text;
      
      // Skip sections with very low confidence
      if (sections[section].confidence < 0.3) {
        console.log(`[EnhancedPatternMatcher] Skipping section with low confidence: ${section}`);
        results._sections[section] = {
          confidence: sections[section].confidence,
          _skipped: true,
          _reason: 'Low confidence'
        };
        return;
      }
      
      // Extract data from this section
      const sectionData = this.extractSectionData(sectionText, section);
      
      // Store results
      results[section] = sectionData;
      results._sections[section] = {
        confidence: sections[section].confidence,
        extracted: !sectionData._extractionFailed
      };
      
      // Store original text for context
      if (!results._originalText) {
        results._originalText = {};
      }
      results._originalText[section] = sectionText;
    });
    
    // Post-processing step: cross-validate between sections
    this.crossValidateSections(results);
    
    return results;
  }
  
  /**
   * Cross-validate data between sections for consistency
   * @param {Object} results - Complete extraction results
   */
  crossValidateSections(results) {
    console.log('[EnhancedPatternMatcher] Performing cross-validation between sections');
    
    // Example: validate name consistency across sections
    const names = new Map();
    
    // Collect names from different sections
    Object.keys(results).forEach(section => {
      if (section.startsWith('_')) return;
      
      const sectionData = results[section];
      if (!sectionData || typeof sectionData !== 'object') return;
      
      // Look for name fields
      const nameFields = ['name', 'clientName', 'patientName', 'patient', 'client'];
      
      nameFields.forEach(field => {
        if (sectionData[field] && typeof sectionData[field] === 'string') {
          const name = sectionData[field].trim();
          if (name.length > 0) {
            if (!names.has(name)) {
              names.set(name, { count: 0, sections: [] });
            }
            
            const record = names.get(name);
            record.count++;
            record.sections.push(section);
          }
        }
      });
    });
    
    // Find most frequent name
    let mostFrequentName = null;
    let maxCount = 0;
    
    names.forEach((record, name) => {
      if (record.count > maxCount) {
        mostFrequentName = name;
        maxCount = record.count;
      }
    });
    
    // If we found a consistent name, use it to improve results
    if (mostFrequentName && maxCount > 1) {
      console.log(`[EnhancedPatternMatcher] Found consistent name "${mostFrequentName}" across ${maxCount} sections`);
      
      // Store the consistent name
      results._consistentName = mostFrequentName;
      
      // Add name to sections that don't have it
      Object.keys(results).forEach(section => {
        if (section.startsWith('_')) return;
        
        const sectionData = results[section];
        if (!sectionData || typeof sectionData !== 'object') return;
        
        // Check if this section already has the name
        const hasName = Object.values(sectionData).some(value => 
          typeof value === 'string' && value.includes(mostFrequentName));
        
        if (!hasName) {
          // Add a note about the consistent name
          sectionData._notes = sectionData._notes || [];
          sectionData._notes.push({
            type: 'cross_validation',
            field: 'name',
            value: mostFrequentName,
            confidence: 0.7,
            message: `Name "${mostFrequentName}" derived from cross-section validation`
          });
        }
      });
    }
    
    // Store cross-validation results
    results._crossValidation = {
      performed: true,
      timestamp: new Date().toISOString(),
      consistentName: mostFrequentName
    };
  }
}

module.exports = EnhancedPatternMatcher;
