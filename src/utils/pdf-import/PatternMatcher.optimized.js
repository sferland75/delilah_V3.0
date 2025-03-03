// Optimized PatternMatcher.js for Delilah V3.0
// Enhanced version with improved section detection

class PatternMatcher {
  constructor(options = {}) {
    this.options = {
      confidenceThreshold: 0.4,  // Increased from 0.3 to reduce false positives
      patternPriority: 'balanced',
      contextWeight: 0.3,  // Reduced from 0.5 to minimize over-reliance on context
      fallbackEnabled: true,
      requireMultiplePatterns: true,  // New option to require multiple patterns for section detection
      strongSectionHeaderPattern: true,  // New option to enforce stronger section header patterns
      ...options
    };
    
    // Section patterns from analysis data - reusing the existing patterns
    this.sectionPatterns = {};
    
    // Statistical data for confidence normalization - reusing the existing stats
    this.sectionStats = {};
    
    // Initialize contextual patterns - reusing the existing patterns
    this.contextualPatterns = {};
    
    // Load patterns from the original PatternMatcher
    this.loadPatternsFromOriginal();
    
    // Add explicit section headers for more reliable detection
    this.sectionHeaders = {
      "DEMOGRAPHICS": [
        /\b(?:demographics|client information|client profile|personal information)\b/i,
        /\bclient\s+name\b/i,
        /\bpersonal\s+data\b/i
      ],
      "SYMPTOMS": [
        /\b(?:symptoms|symptomatology|presenting concerns|clinical presentation)\b/i,
        /\bchief\s+complaints?\b/i,
        /\breported\s+symptoms\b/i
      ],
      "ENVIRONMENTAL": [
        /\b(?:environmental assessment|home assessment|living situation|housing)\b/i,
        /\bhome\s+environment\b/i,
        /\benvironmental\s+factors\b/i
      ],
      "MEDICAL_HISTORY": [
        /\b(?:medical history|medical background|health history|past medical history)\b/i,
        /\bmedical\s+conditions\b/i,
        /\bhealth\s+conditions\b/i
      ],
      "ATTENDANT_CARE": [
        /\b(?:attendant care|personal care|care needs|caregiver support)\b/i,
        /\bcare\s+requirements\b/i,
        /\bcaregiver\s+assessment\b/i
      ],
      "FUNCTIONAL_STATUS": [
        /\b(?:functional status|functional assessment|physical functioning|mobility status)\b/i,
        /\bphysical\s+capabilities\b/i,
        /\bfunctional\s+abilities\b/i
      ],
      "TYPICAL_DAY": [
        /\b(?:typical day|daily routine|daily schedule|daily activities)\b/i,
        /\bday-to-day\s+activities\b/i,
        /\btypical\s+routine\b/i
      ],
      "ADLS": [
        /\b(?:activities of daily living|ADLs|self-care activities|personal ADLs)\b/i,
        /\bself-care\s+assessment\b/i,
        /\bactivities\s+of\s+daily\s+living\b/i
      ]
    };
    
    // Add section proximity patterns to help with disambiguation
    this.sectionProximity = {
      "DEMOGRAPHICS": ["PURPOSE", "MEDICAL_HISTORY"],
      "MEDICAL_HISTORY": ["DEMOGRAPHICS", "SYMPTOMS"],
      "SYMPTOMS": ["MEDICAL_HISTORY", "FUNCTIONAL_STATUS"],
      "FUNCTIONAL_STATUS": ["SYMPTOMS", "ADLS"],
      "ADLS": ["FUNCTIONAL_STATUS", "TYPICAL_DAY"],
      "TYPICAL_DAY": ["ADLS", "ENVIRONMENTAL"],
      "ENVIRONMENTAL": ["TYPICAL_DAY", "ATTENDANT_CARE"],
      "ATTENDANT_CARE": ["ENVIRONMENTAL"]
    };
  }
  
  /**
   * Load patterns from the original PatternMatcher implementation
   * This ensures we maintain compatibility with the existing pattern repository
   */
  loadPatternsFromOriginal() {
    try {
      // Use require to load the original PatternMatcher
      const OriginalPatternMatcher = require('./PatternMatcher');
      const original = new OriginalPatternMatcher();
      
      // Copy patterns and stats
      this.sectionPatterns = JSON.parse(JSON.stringify(original.sectionPatterns));
      this.sectionStats = JSON.parse(JSON.stringify(original.sectionStats));
      this.contextualPatterns = JSON.parse(JSON.stringify(original.contextualPatterns));
    } catch (error) {
      console.error('Failed to load patterns from original PatternMatcher:', error);
      
      // Initialize with empty objects if original can't be loaded
      this.sectionPatterns = {};
      this.sectionStats = {};
      this.contextualPatterns = {};
    }
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
      
      // Skip empty lines and page numbers
      if (lowerLine === '' || lowerLine.match(/^page \d+$/i) || lowerLine.match(/^\d+$/)) {
        lineIndex++;
        continue;
      }
      
      // Check if this line starts a new section
      const detectedSection = this.detectSectionStart(lowerLine, lineIndex, lines);
      
      if (detectedSection && detectedSection.confidence >= this.options.confidenceThreshold) {
        // If we were building a section, save it
        if (currentSection && currentSectionText.trim().length > 0) {
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
    if (currentSection && currentSectionText.trim().length > 0) {
      sections.push({
        section: currentSection.type,
        title: currentSection.title,
        content: currentSectionText.trim(),
        confidence: currentSection.confidence,
        pattern: currentSection.pattern
      });
    }
    
    // Post-process sections to resolve ambiguities and improve accuracy
    return this.postProcessSections(sections);
  }
  
  /**
   * Detect if a line starts a new section
   * @param {string} line - The line (lowercase and trimmed)
   * @param {number} lineIndex - Current line index
   * @param {Array} allLines - All lines in the document
   * @returns {Object|null} - Detected section or null
   */
  detectSectionStart(line, lineIndex, allLines) {
    // Check if line matches explicit section headers first (highest confidence)
    const headerMatch = this.checkExplicitSectionHeaders(line);
    if (headerMatch) {
      return headerMatch;
    }
    
    // Track all possible section matches
    const possibleSections = [];
    
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
      
      // Check for direct pattern matches (highest priority)
      const patternMatches = this.checkDirectPatterns(line, sectionType, patterns, sectionStats);
      if (patternMatches) {
        possibleSections.push(patternMatches);
        continue; // If we found direct matches, skip contextual patterns for this section
      }
      
      // Check contextual patterns if enabled and available (lower priority)
      if (this.options.contextWeight > 0 && this.contextualPatterns[sectionType]) {
        const contextualMatch = this.checkContextualPatterns(line, lineIndex, allLines, sectionType);
        if (contextualMatch) {
          possibleSections.push(contextualMatch);
        }
      }
    }
    
    // If no sections found, return null
    if (possibleSections.length === 0) {
      return null;
    }
    
    // If multiple possible sections found, select the one with highest confidence
    if (possibleSections.length > 1) {
      possibleSections.sort((a, b) => b.confidence - a.confidence);
      
      // If the top two have very close confidence, choose based on pattern quality
      if (possibleSections[0].confidence - possibleSections[1].confidence < 0.05) {
        // Prefer direct pattern matches over contextual matches
        const directMatch = possibleSections.find(s => !s.pattern.startsWith('context'));
        if (directMatch) {
          return directMatch;
        }
      }
    }
    
    // Return the most confident match
    return possibleSections[0];
  }
  
  /**
   * Check if a line matches explicit section headers
   * @param {string} line - The line (lowercase and trimmed)
   * @returns {Object|null} - Detected section or null
   */
  checkExplicitSectionHeaders(line) {
    for (const [sectionType, patterns] of Object.entries(this.sectionHeaders)) {
      for (const pattern of patterns) {
        if (pattern.test(line)) {
          return {
            type: sectionType,
            title: line,
            confidence: 0.9, // Very high confidence for explicit headers
            pattern: 'explicitHeader',
            frequency: 999 // High frequency to indicate importance
          };
        }
      }
    }
    return null;
  }
  
  /**
   * Check for direct pattern matches
   * @param {string} line - The line (lowercase and trimmed)
   * @param {string} sectionType - Type of section
   * @param {Array} patterns - Section patterns
   * @param {Object} sectionStats - Statistical data for the section
   * @returns {Object|null} - Detected section or null
   */
  checkDirectPatterns(line, sectionType, patterns, sectionStats) {
    // Count matching patterns to increase confidence with multiple matches
    let matchCount = 0;
    let bestMatch = null;
    
    for (const pattern of patterns) {
      // Direct match with pattern
      if (
        line === pattern.text ||
        line.startsWith(pattern.text + ':') ||
        line.startsWith(pattern.text + ' -') ||
        line.startsWith(pattern.text + '-') ||
        line.match(new RegExp(`^\\d+\\.?\\s*${pattern.text}`, 'i'))
      ) {
        matchCount++;
        
        // Calculate adjusted confidence
        const matchConfidence = this.normalizeConfidence(
          pattern.confidence,
          sectionStats.min,
          sectionStats.max,
          sectionStats.avg
        );
        
        // Adjust confidence based on pattern frequency
        const frequencyFactor = Math.min(1, (pattern.frequency || 1) / 50); // Cap at 1
        let adjustedConfidence = matchConfidence * (0.7 + (0.3 * frequencyFactor));
        
        // If this is the first match or has higher confidence than previous best match
        if (!bestMatch || adjustedConfidence > bestMatch.confidence) {
          bestMatch = {
            type: sectionType,
            title: line,
            confidence: adjustedConfidence,
            pattern: pattern.text,
            frequency: pattern.frequency || 1
          };
        }
      }
    }
    
    // If multiple pattern matches found, increase confidence
    if (matchCount > 1) {
      bestMatch.confidence = Math.min(0.95, bestMatch.confidence * (1 + (matchCount * 0.1)));
      bestMatch.matchCount = matchCount;
    }
    
    return bestMatch;
  }
  
  /**
   * Check for contextual pattern matches
   * @param {string} line - The line (lowercase and trimmed)
   * @param {number} lineIndex - Current line index
   * @param {Array} allLines - All lines in the document
   * @param {string} sectionType - Type of section
   * @returns {Object|null} - Detected section or null
   */
  checkContextualPatterns(line, lineIndex, allLines, sectionType) {
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
          
          // Reduce confidence for very generic lines
          const genericPenalty = this.calculateGenericPenalty(line);
          
          return {
            type: sectionType,
            title: line,
            confidence: contextConfidence * (1 - genericPenalty),
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
          
          // Reduce confidence for very generic lines
          const genericPenalty = this.calculateGenericPenalty(line);
          
          return {
            type: sectionType,
            title: line,
            confidence: contextConfidence * (1 - genericPenalty),
            pattern: 'contextAfter:' + afterPattern.text,
            frequency: afterPattern.frequency || 1
          };
        }
      }
    }
    
    return null;
  }
  
  /**
   * Calculate penalty for generic lines to reduce false positives
   * @param {string} line - The line to check
   * @returns {number} - Penalty factor (0-1)
   */
  calculateGenericPenalty(line) {
    // Common words that might appear in many places
    const genericWords = ['the', 'and', 'to', 'a', 'of', 'in', 'for', 'is', 'on', 'that', 'with'];
    const words = line.split(/\s+/);
    
    // Calculate percentage of generic words
    const genericWordCount = words.filter(word => genericWords.includes(word)).length;
    const genericPercentage = genericWordCount / words.length;
    
    // Short lines with mostly generic words get higher penalty
    if (words.length < 3) {
      return 0.5 + (genericPercentage * 0.5);
    }
    
    return genericPercentage * 0.7;
  }
  
  /**
   * Post-process detected sections to improve accuracy
   * @param {Array} sections - Detected sections
   * @returns {Array} - Processed sections
   */
  postProcessSections(sections) {
    // Skip if no sections
    if (!sections || sections.length === 0) {
      return sections;
    }
    
    // If only one section detected and it's the entire document, it might be incorrect
    if (sections.length === 1 && sections[0].confidence < 0.7) {
      // Try to re-detect sections with lower threshold
      const lowerThreshold = this.options.confidenceThreshold;
      this.options.confidenceThreshold = 0.25;
      const newSections = this.detectSections(sections[0].content);
      this.options.confidenceThreshold = lowerThreshold;
      
      // If we found more sections with the lower threshold, use those
      if (newSections.length > 1) {
        return newSections;
      }
    }
    
    // Check for sequential sections of the same type (likely incorrect)
    let i = 0;
    while (i < sections.length - 1) {
      if (sections[i].section === sections[i + 1].section) {
        // Merge sections of the same type
        sections[i].content += '\n' + sections[i + 1].content;
        sections[i].confidence = Math.max(sections[i].confidence, sections[i + 1].confidence);
        sections.splice(i + 1, 1);
      } else {
        i++;
      }
    }
    
    // Check expected section order based on proximity
    for (let i = 0; i < sections.length; i++) {
      const currentType = sections[i].section;
      
      // Skip if high confidence
      if (sections[i].confidence > 0.7) {
        continue;
      }
      
      // Check if this section makes sense in sequence
      if (i > 0 && i < sections.length - 1) {
        const prevType = sections[i - 1].section;
        const nextType = sections[i + 1].section;
        
        // If previous and next sections are expected to be adjacent but current section doesn't fit in between
        if (this.sectionProximity[prevType] && 
            this.sectionProximity[prevType].includes(nextType) &&
            (!this.sectionProximity[prevType].includes(currentType) && 
             !this.sectionProximity[currentType]?.includes(nextType))) {
          
          // Reduce confidence of the out-of-sequence section
          sections[i].confidence *= 0.8;
          sections[i].outOfSequence = true;
        }
      }
    }
    
    return sections;
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
      confidenceThreshold: 0.4, // Default increased from 0.3
      patternPriority: 'balanced',
      contextWeight: 0.3, // Default decreased from 0.5
      fallbackEnabled: true,
      requireMultiplePatterns: true,
      strongSectionHeaderPattern: true
    };
    
    // Adjust based on document type
    if (classification.type === 'in-home-assessment') {
      strategy.confidenceThreshold = 0.35; // Higher than original but lower than default
      strategy.patternPriority = 'section-first';
    } else if (classification.type === 'referral') {
      strategy.confidenceThreshold = 0.45; // Higher than default
      strategy.patternPriority = 'content-first';
    }
    
    // Adjust based on structure
    if (classification.structure === 'form') {
      strategy.contextWeight = 0.4; // Higher than default but lower than original
    } else {
      strategy.contextWeight = 0.2; // Lower than default
    }
    
    // Adjust based on complexity
    if (classification.complexity > 0.7) {
      strategy.fallbackEnabled = true;
      strategy.requireMultiplePatterns = false; // Disable for complex docs
    }
    
    return strategy;
  }
}

module.exports = PatternMatcher;
