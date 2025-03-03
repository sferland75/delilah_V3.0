// Generated PatternMatcher.js for Delilah V3.0
// This file was automatically generated from pattern analysis data

class PatternMatcher {
  constructor(options = {}) {
    this.options = {
      confidenceThreshold: 0.3,
      patternPriority: 'balanced',
      contextWeight: 0.5,
      fallbackEnabled: true,
      ...options
    };
    
    // Section patterns from analysis data
    this.sectionPatterns = PATTERNS_PLACEHOLDER;
    
    // Statistical data for confidence normalization
    this.sectionStats = STATS_PLACEHOLDER;
    
    // Initialize contextual patterns
    this.contextualPatterns = CONTEXTUAL_PATTERNS_PLACEHOLDER;
  }
  
  /**
   * Normalize confidence score based on statistical data
   * @param {number} rawConfidence - The raw confidence from pattern match
   * @param {number} min - Minimum confidence from analysis
   * @param {number} max - Maximum confidence from analysis
   * @param {number} avg - Average confidence from analysis
   * @returns {number} - Normalized confidence score
   */
  normalizeConfidence(rawConfidence, min, max, avg) {
    // Scale raw confidence to the observed range
    const range = max - min;
    if (range === 0) return avg; // Avoid division by zero
    
    // Scale within observed range, centered around average
    const scaledConfidence = min + (rawConfidence * range);
    
    // Apply weighting toward average for stability
    const weight = 0.7; // 70% weight to scaled, 30% to average
    return (scaledConfidence * weight) + (avg * (1 - weight));
  }
  
  /**
   * Detect sections in the PDF text
   * @param {string} text - Text content from PDF
   * @returns {Array} - Detected sections with content and confidence
   */
  detectSections(text) {
    if (!text || typeof text !== 'string') {
      console.error('Invalid text provided to detectSections');
      return [];
    }
  
    const lines = text.split('\n');
    const sections = [];
    
    // Track the current section being built
    let currentSection = null;
    let currentSectionText = '';
    let lineIndex = 0;
    
    // Process each line
    while (lineIndex < lines.length) {
      const line = lines[lineIndex];
      const lowerLine = line.toLowerCase().trim();
      
      // Check if this line starts a new section
      const detectedSection = this.detectSectionStart(lowerLine, lineIndex, lines);
      
      if (detectedSection) {
        // If we were building a section, save it
        if (currentSection) {
          sections.push({
            section: currentSection.type,
            title: currentSection.title,
            content: currentSectionText.trim(),
            confidence: currentSection.confidence,
            pattern: currentSection.pattern
          });
        }
        
        // Start a new section
        currentSection = detectedSection;
        currentSectionText = '';
      } else if (currentSection) {
        // Add line to current section
        currentSectionText += line + '\n';
      }
      
      lineIndex++;
    }
    
    // Add the last section if there is one
    if (currentSection) {
      sections.push({
        section: currentSection.type,
        title: currentSection.title,
        content: currentSectionText.trim(),
        confidence: currentSection.confidence,
        pattern: currentSection.pattern
      });
    }
    
    return sections;
  }
  
  /**
   * Detect if a line starts a new section
   * @param {string} line - The line (lowercase and trimmed)
   * @param {number} lineIndex - Current line index
   * @param {Array} allLines - All lines in the document
   * @returns {Object|null} - Detected section or null
   */
  detectSectionStart(line, lineIndex, allLines) {
    // Check each section pattern
    for (const [sectionType, patterns] of Object.entries(this.sectionPatterns)) {
      // Skip if no patterns for this section
      if (!patterns || !Array.isArray(patterns)) continue;
      
      // Get section stats for confidence calculation
      const sectionStats = this.sectionStats[sectionType] || {
        min: 0.3,
        max: 0.9,
        avg: 0.5
      };
      
      // Check each pattern
      for (const pattern of patterns) {
        // Direct match with pattern
        if (
          line === pattern.text ||
          line.startsWith(pattern.text + ':') ||
          line.startsWith(pattern.text + ' -') ||
          line.startsWith(pattern.text + '-') ||
          line.match(new RegExp(`^\\d+\\.?\\s*${pattern.text}`, 'i'))
        ) {
          // Calculate adjusted confidence
          const matchConfidence = this.normalizeConfidence(
            pattern.confidence,
            sectionStats.min,
            sectionStats.max,
            sectionStats.avg
          );
          
          // Adjust confidence based on pattern frequency
          const frequencyFactor = Math.min(1, (pattern.frequency || 1) / 50); // Cap at 1
          const adjustedConfidence = matchConfidence * (0.7 + (0.3 * frequencyFactor));
          
          return {
            type: sectionType,
            title: line,
            confidence: adjustedConfidence,
            pattern: pattern.text,
            frequency: pattern.frequency || 1
          };
        }
      }
      
      // Check contextual patterns if enabled and available
      if (this.options.contextWeight > 0 && this.contextualPatterns[sectionType]) {
        // Look at context before and after this line
        const contextBefore = lineIndex > 0 ? allLines[lineIndex - 1].toLowerCase().trim() : '';
        const contextAfter = lineIndex < allLines.length - 1 ? allLines[lineIndex + 1].toLowerCase().trim() : '';
        
        // Check before context
        if (this.contextualPatterns[sectionType].before) {
          for (const beforePattern of this.contextualPatterns[sectionType].before) {
            if (contextBefore.includes(beforePattern.text) && 
                (line.length < 100) && // Only consider reasonably short lines
                !line.match(/^\d+$/) && // Not just a number
                !line.match(/^page \d+$/i) // Not a page indicator
            ) {
              // Apply context weight to confidence
              const contextConfidence = beforePattern.confidence * this.options.contextWeight;
              
              return {
                type: sectionType,
                title: line,
                confidence: contextConfidence,
                pattern: 'contextBefore:' + beforePattern.text,
                frequency: beforePattern.frequency || 1
              };
            }
          }
        }
        
        // Check after context
        if (this.contextualPatterns[sectionType].after) {
          for (const afterPattern of this.contextualPatterns[sectionType].after) {
            if (contextAfter.includes(afterPattern.text) && 
                (line.length < 100) && // Only consider reasonably short lines
                !line.match(/^\d+$/) && // Not just a number
                !line.match(/^page \d+$/i) // Not a page indicator
            ) {
              // Apply context weight to confidence
              const contextConfidence = afterPattern.confidence * this.options.contextWeight;
              
              return {
                type: sectionType,
                title: line,
                confidence: contextConfidence,
                pattern: 'contextAfter:' + afterPattern.text,
                frequency: afterPattern.frequency || 1
              };
            }
          }
        }
      }
    }
    
    // Use fallback patterns if enabled and no match found
    if (this.options.fallbackEnabled) {
      // Implement fallback pattern matching here
    }
    
    return null;
  }
  
  /**
   * Classify document to determine optimal pattern matching strategy
   * @param {string} text - Document text
   * @returns {Object} Document classification
   */
  classifyDocument(text) {
    const classification = {
      type: 'unknown',
      confidence: 0,
      structure: 'unknown',
      length: text.length,
      complexity: 0
    };
    
    // Check for document type indicators
    if (text.includes('IN-HOME ASSESSMENT') || text.includes('IHA')) {
      classification.type = 'in-home-assessment';
      classification.confidence = 0.9;
    } else if (text.includes('REFERRAL') || text.includes('REFERRER')) {
      classification.type = 'referral';
      classification.confidence = 0.9;
    }
    
    // Determine structure
    const lines = text.split('\n');
    const shortLineRatio = lines.filter(l => l.length < 50).length / lines.length;
    
    if (shortLineRatio > 0.7) {
      classification.structure = 'form';
    } else {
      classification.structure = 'narrative';
    }
    
    // Calculate complexity (simple implementation)
    const uniqueWords = new Set(text.toLowerCase().split(/\s+/));
    classification.complexity = Math.min(1, uniqueWords.size / 5000);
    
    return classification;
  }
  
  /**
   * Select optimal pattern matching strategy based on document type
   * @param {Object} classification - Document classification
   * @returns {Object} Pattern matching strategy
   */
  selectPatternStrategy(classification) {
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

module.exports = PatternMatcher;