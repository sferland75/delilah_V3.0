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
    this.sectionPatterns = {
  "DEMOGRAPHICS": [
    {
      "text": "occupational",
      "confidence": 0.3855421686746988,
      "frequency": 21
    },
    {
      "text": "therapy",
      "confidence": 0.3855421686746988,
      "frequency": 21
    },
    {
      "text": "occupational therapy",
      "confidence": 0.3855421686746988,
      "frequency": 21
    },
    {
      "text": "client",
      "confidence": 0.3855421686746988,
      "frequency": 9
    },
    {
      "text": "name:",
      "confidence": 0.3855421686746988,
      "frequency": 9
    },
    {
      "text": "client name:",
      "confidence": 0.3855421686746988,
      "frequency": 9
    },
    {
      "text": "treatment",
      "confidence": 0.3855421686746988,
      "frequency": 5
    },
    {
      "text": "therapy treatment",
      "confidence": 0.3855421686746988,
      "frequency": 5
    },
    {
      "text": "occupational therapy treatment",
      "confidence": 0.3855421686746988,
      "frequency": 5
    },
    {
      "text": "date",
      "confidence": 0.3855421686746988,
      "frequency": 3
    },
    {
      "text": "loss:",
      "confidence": 0.3855421686746988,
      "frequency": 3
    },
    {
      "text": "date loss:",
      "confidence": 0.3855421686746988,
      "frequency": 3
    },
    {
      "text": "address:",
      "confidence": 0.3855421686746988,
      "frequency": 3
    }
  ],
  "SYMPTOMS": [
    {
      "text": "minutes",
      "confidence": 0.3389284020862901,
      "frequency": 12
    },
    {
      "text": "week",
      "confidence": 0.3389284020862901,
      "frequency": 10
    },
    {
      "text": "minutes week",
      "confidence": 0.3389284020862901,
      "frequency": 10
    },
    {
      "text": "activities:",
      "confidence": 0.3389284020862901,
      "frequency": 8
    },
    {
      "text": "medication",
      "confidence": 0.3389284020862901,
      "frequency": 6
    },
    {
      "text": "care",
      "confidence": 0.3389284020862901,
      "frequency": 4
    },
    {
      "text": "skin",
      "confidence": 0.3389284020862901,
      "frequency": 4
    },
    {
      "text": "issues",
      "confidence": 0.3389284020862901,
      "frequency": 4
    },
    {
      "text": "contact:",
      "confidence": 0.3389284020862901,
      "frequency": 3
    },
    {
      "text": "leisure",
      "confidence": 0.3389284020862901,
      "frequency": 3
    },
    {
      "text": "leisure activities:",
      "confidence": 0.3389284020862901,
      "frequency": 3
    },
    {
      "text": "this",
      "confidence": 0.3389284020862901,
      "frequency": 3
    },
    {
      "text": "skin care",
      "confidence": 0.3389284020862901,
      "frequency": 3
    },
    {
      "text": "tidying",
      "confidence": 0.3389284020862901,
      "frequency": 3
    },
    {
      "text": "volunteer",
      "confidence": 0.3389284020862901,
      "frequency": 3
    },
    {
      "text": "volunteer activities:",
      "confidence": 0.3389284020862901,
      "frequency": 3
    }
  ],
  "ENVIRONMENTAL": [
    {
      "text": "environmental",
      "confidence": 0.3531680440771352,
      "frequency": 32
    },
    {
      "text": "assessment:",
      "confidence": 0.3531680440771352,
      "frequency": 32
    },
    {
      "text": "environmental assessment:",
      "confidence": 0.3531680440771352,
      "frequency": 32
    },
    {
      "text": "type",
      "confidence": 0.3531680440771352,
      "frequency": 29
    },
    {
      "text": "dwelling",
      "confidence": 0.3531680440771352,
      "frequency": 29
    },
    {
      "text": "type dwelling",
      "confidence": 0.3531680440771352,
      "frequency": 26
    },
    {
      "text": "single",
      "confidence": 0.3531680440771352,
      "frequency": 11
    },
    {
      "text": "detached",
      "confidence": 0.3531680440771352,
      "frequency": 6
    },
    {
      "text": "bungalow",
      "confidence": 0.3531680440771352,
      "frequency": 5
    },
    {
      "text": "family",
      "confidence": 0.3531680440771352,
      "frequency": 5
    },
    {
      "text": "single family",
      "confidence": 0.3531680440771352,
      "frequency": 5
    },
    {
      "text": "in-home",
      "confidence": 0.3531680440771352,
      "frequency": 5
    },
    {
      "text": "assessment",
      "confidence": 0.3531680440771352,
      "frequency": 5
    },
    {
      "text": "in-home assessment",
      "confidence": 0.3531680440771352,
      "frequency": 5
    },
    {
      "text": "home",
      "confidence": 0.3531680440771352,
      "frequency": 4
    },
    {
      "text": "rooms",
      "confidence": 0.3531680440771352,
      "frequency": 4
    },
    {
      "text": "client",
      "confidence": 0.3531680440771352,
      "frequency": 4
    },
    {
      "text": "name:",
      "confidence": 0.3531680440771352,
      "frequency": 4
    },
    {
      "text": "client name:",
      "confidence": 0.3531680440771352,
      "frequency": 4
    },
    {
      "text": "occupational",
      "confidence": 0.3531680440771352,
      "frequency": 4
    }
  ],
  "MEDICAL_HISTORY": [
    {
      "text": "pre-accident",
      "confidence": 0.34828282828282914,
      "frequency": 18
    },
    {
      "text": "medical",
      "confidence": 0.34828282828282914,
      "frequency": 18
    },
    {
      "text": "history:",
      "confidence": 0.34828282828282914,
      "frequency": 18
    },
    {
      "text": "pre-accident medical",
      "confidence": 0.34828282828282914,
      "frequency": 18
    },
    {
      "text": "medical history:",
      "confidence": 0.34828282828282914,
      "frequency": 18
    },
    {
      "text": "pre-accident medical history:",
      "confidence": 0.34828282828282914,
      "frequency": 18
    },
    {
      "text": "injury:",
      "confidence": 0.34828282828282914,
      "frequency": 8
    },
    {
      "text": "mechanism",
      "confidence": 0.34828282828282914,
      "frequency": 7
    },
    {
      "text": "mechanism injury:",
      "confidence": 0.34828282828282914,
      "frequency": 7
    },
    {
      "text": "hypothyroidism",
      "confidence": 0.34828282828282914,
      "frequency": 3
    },
    {
      "text": "isolation",
      "confidence": 0.34828282828282914,
      "frequency": 3
    },
    {
      "text": "(social)",
      "confidence": 0.34828282828282914,
      "frequency": 3
    },
    {
      "text": "isolation (social)",
      "confidence": 0.34828282828282914,
      "frequency": 3
    },
    {
      "text": "with",
      "confidence": 0.34828282828282914,
      "frequency": 3
    }
  ],
  "ATTENDANT_CARE": [
    {
      "text": "closing",
      "confidence": 0.34077448747152594,
      "frequency": 17
    },
    {
      "text": "comments:",
      "confidence": 0.34077448747152594,
      "frequency": 17
    },
    {
      "text": "closing comments:",
      "confidence": 0.34077448747152594,
      "frequency": 17
    },
    {
      "text": "contact:",
      "confidence": 0.34077448747152594,
      "frequency": 8
    },
    {
      "text": "attendant",
      "confidence": 0.34077448747152594,
      "frequency": 7
    },
    {
      "text": "care",
      "confidence": 0.34077448747152594,
      "frequency": 7
    },
    {
      "text": "attendant care",
      "confidence": 0.34077448747152594,
      "frequency": 7
    },
    {
      "text": "occupational",
      "confidence": 0.34077448747152594,
      "frequency": 4
    },
    {
      "text": "therapy",
      "confidence": 0.34077448747152594,
      "frequency": 4
    },
    {
      "text": "occupational therapy",
      "confidence": 0.34077448747152594,
      "frequency": 4
    },
    {
      "text": "total",
      "confidence": 0.34077448747152594,
      "frequency": 3
    },
    {
      "text": "monthly",
      "confidence": 0.34077448747152594,
      "frequency": 3
    },
    {
      "text": "assessed",
      "confidence": 0.34077448747152594,
      "frequency": 3
    },
    {
      "text": "benefit:",
      "confidence": 0.34077448747152594,
      "frequency": 3
    },
    {
      "text": "total monthly",
      "confidence": 0.34077448747152594,
      "frequency": 3
    },
    {
      "text": "monthly assessed",
      "confidence": 0.34077448747152594,
      "frequency": 3
    },
    {
      "text": "assessed attendant",
      "confidence": 0.34077448747152594,
      "frequency": 3
    },
    {
      "text": "care benefit:",
      "confidence": 0.34077448747152594,
      "frequency": 3
    },
    {
      "text": "total monthly assessed",
      "confidence": 0.34077448747152594,
      "frequency": 3
    },
    {
      "text": "monthly assessed attendant",
      "confidence": 0.34077448747152594,
      "frequency": 3
    }
  ],
  "FUNCTIONAL_STATUS": [
    {
      "text": "therapy",
      "confidence": 0.37537537537537546,
      "frequency": 4
    },
    {
      "text": "dated",
      "confidence": 0.37537537537537546,
      "frequency": 4
    },
    {
      "text": "2018",
      "confidence": 0.37537537537537546,
      "frequency": 3
    },
    {
      "text": "stairs",
      "confidence": 0.37537537537537546,
      "frequency": 3
    },
    {
      "text": "functional status",
      "confidence": 0.9,
      "frequency": 5
    },
    {
      "text": "functional abilities",
      "confidence": 0.8,
      "frequency": 5
    },
    {
      "text": "mobility",
      "confidence": 0.7,
      "frequency": 5
    },
    {
      "text": "transfers",
      "confidence": 0.7,
      "frequency": 5
    }
  ],
  "TYPICAL_DAY": [
    {
      "text": "typical",
      "confidence": 0.36809523809523864,
      "frequency": 19
    },
    {
      "text": "day:",
      "confidence": 0.36809523809523864,
      "frequency": 11
    },
    {
      "text": "typical day:",
      "confidence": 0.36809523809523864,
      "frequency": 11
    },
    {
      "text": "following",
      "confidence": 0.36809523809523864,
      "frequency": 6
    },
    {
      "text": "following typical",
      "confidence": 0.36809523809523864,
      "frequency": 6
    },
    {
      "text": "reported",
      "confidence": 0.36809523809523864,
      "frequency": 4
    },
    {
      "text": "time",
      "confidence": 0.36809523809523864,
      "frequency": 4
    },
    {
      "text": "this",
      "confidence": 0.36809523809523864,
      "frequency": 4
    },
    {
      "text": "reported following",
      "confidence": 0.36809523809523864,
      "frequency": 4
    },
    {
      "text": "time this",
      "confidence": 0.36809523809523864,
      "frequency": 4
    },
    {
      "text": "reported following typical",
      "confidence": 0.36809523809523864,
      "frequency": 4
    },
    {
      "text": "takes",
      "confidence": 0.36809523809523864,
      "frequency": 4
    },
    {
      "text": "medication",
      "confidence": 0.36809523809523864,
      "frequency": 4
    },
    {
      "text": "takes medication",
      "confidence": 0.36809523809523864,
      "frequency": 4
    },
    {
      "text": "post-accident:",
      "confidence": 0.36809523809523864,
      "frequency": 4
    },
    {
      "text": "typical post-accident:",
      "confidence": 0.36809523809523864,
      "frequency": 4
    },
    {
      "text": "assessment:",
      "confidence": 0.36809523809523864,
      "frequency": 3
    },
    {
      "text": "typical time",
      "confidence": 0.36809523809523864,
      "frequency": 3
    },
    {
      "text": "this assessment:",
      "confidence": 0.36809523809523864,
      "frequency": 3
    },
    {
      "text": "following typical time",
      "confidence": 0.36809523809523864,
      "frequency": 3
    }
  ],
  "ADLS": [
    {
      "text": "activities:",
      "confidence": 0.3658206429780038,
      "frequency": 17
    },
    {
      "text": "post",
      "confidence": 0.3658206429780038,
      "frequency": 14
    },
    {
      "text": "accident",
      "confidence": 0.3658206429780038,
      "frequency": 13
    },
    {
      "text": "self-care",
      "confidence": 0.3658206429780038,
      "frequency": 13
    },
    {
      "text": "post accident",
      "confidence": 0.3658206429780038,
      "frequency": 13
    },
    {
      "text": "self-care activities:",
      "confidence": 0.3658206429780038,
      "frequency": 12
    },
    {
      "text": "accident self-care",
      "confidence": 0.3658206429780038,
      "frequency": 11
    },
    {
      "text": "post accident self-care",
      "confidence": 0.3658206429780038,
      "frequency": 11
    },
    {
      "text": "accident self-care activities:",
      "confidence": 0.3658206429780038,
      "frequency": 11
    },
    {
      "text": "home",
      "confidence": 0.3658206429780038,
      "frequency": 5
    },
    {
      "text": "management",
      "confidence": 0.3658206429780038,
      "frequency": 5
    },
    {
      "text": "home management",
      "confidence": 0.3658206429780038,
      "frequency": 5
    },
    {
      "text": "management activities:",
      "confidence": 0.3658206429780038,
      "frequency": 5
    },
    {
      "text": "home management activities:",
      "confidence": 0.3658206429780038,
      "frequency": 5
    }
  ]
};
    
    // Statistical data for confidence normalization
    this.sectionStats = {
  "DEMOGRAPHICS": {
    "sum": 32,
    "count": 83,
    "min": 0.3333333333333333,
    "max": 0.5,
    "average": 0.3855421686746988
  },
  "SYMPTOMS": {
    "sum": 476.53333333332387,
    "count": 1406,
    "min": 0.3333333333333333,
    "max": 0.8666666666666667,
    "average": 0.3389284020862901
  },
  "ENVIRONMENTAL": {
    "sum": 42.73333333333336,
    "count": 121,
    "min": 0.3333333333333333,
    "max": 0.5333333333333333,
    "average": 0.3531680440771352
  },
  "MEDICAL_HISTORY": {
    "sum": 57.46666666666681,
    "count": 165,
    "min": 0.3333333333333333,
    "max": 0.6666666666666666,
    "average": 0.34828282828282914
  },
  "ATTENDANT_CARE": {
    "sum": 149.59999999999988,
    "count": 439,
    "min": 0.3333333333333333,
    "max": 0.6666666666666666,
    "average": 0.34077448747152594
  },
  "FUNCTIONAL_STATUS": {
    "sum": 41.66666666666668,
    "count": 111,
    "min": 0.3333333333333333,
    "max": 0.8666666666666667,
    "average": 0.37537537537537546
  },
  "TYPICAL_DAY": {
    "sum": 51.53333333333341,
    "count": 140,
    "min": 0.3333333333333333,
    "max": 0.6666666666666666,
    "average": 0.36809523809523864
  },
  "ADLS": {
    "sum": 72.06666666666675,
    "count": 197,
    "min": 0.3333333333333333,
    "max": 0.8666666666666667,
    "average": 0.3658206429780038
  }
};
    
    // Initialize contextual patterns
    this.contextualPatterns = {
  "DEMOGRAPHICS": {
    "before": [
      {
        "text": "assessment information",
        "confidence": 0.7,
        "frequency": 2
      },
      {
        "text": "client profile",
        "confidence": 0.7,
        "frequency": 2
      }
    ],
    "after": [
      {
        "text": "date",
        "confidence": 0.34698795180722897,
        "frequency": 8
      },
      {
        "text": "loss:",
        "confidence": 0.34698795180722897,
        "frequency": 6
      },
      {
        "text": "address:",
        "confidence": 0.34698795180722897,
        "frequency": 6
      },
      {
        "text": "telephone",
        "confidence": 0.34698795180722897,
        "frequency": 5
      },
      {
        "text": "ottawa",
        "confidence": 0.34698795180722897,
        "frequency": 4
      }
    ]
  },
  "MEDICAL_HISTORY": {
    "before": [
      {
        "text": "demographics",
        "confidence": 0.7,
        "frequency": 2
      },
      {
        "text": "client information",
        "confidence": 0.7,
        "frequency": 2
      }
    ],
    "after": [
      {
        "text": "disorder",
        "confidence": 0.3134545454545462,
        "frequency": 9
      },
      {
        "text": "sleep",
        "confidence": 0.3134545454545462,
        "frequency": 6
      },
      {
        "text": "pain",
        "confidence": 0.3134545454545462,
        "frequency": 5
      },
      {
        "text": "injury:",
        "confidence": 0.3134545454545462,
        "frequency": 4
      },
      {
        "text": "apnea",
        "confidence": 0.3134545454545462,
        "frequency": 4
      }
    ]
  },
  "SYMPTOMS": {
    "before": [],
    "after": [
      {
        "text": "minutes",
        "confidence": 0.3050355618776611,
        "frequency": 16
      },
      {
        "text": "week",
        "confidence": 0.3050355618776611,
        "frequency": 12
      },
      {
        "text": "sincerely,",
        "confidence": 0.3050355618776611,
        "frequency": 7
      },
      {
        "text": "activities:",
        "confidence": 0.3050355618776611,
        "frequency": 7
      },
      {
        "text": "bathing",
        "confidence": 0.3050355618776611,
        "frequency": 6
      }
    ]
  },
  "FUNCTIONAL_STATUS": {
    "before": [],
    "after": [
      {
        "text": "range",
        "confidence": 0.33783783783783794,
        "frequency": 6
      },
      {
        "text": "functional",
        "confidence": 0.33783783783783794,
        "frequency": 3
      },
      {
        "text": "lifting/carrying",
        "confidence": 0.33783783783783794,
        "frequency": 3
      },
      {
        "text": "kneeling",
        "confidence": 0.33783783783783794,
        "frequency": 3
      },
      {
        "text": "active",
        "confidence": 0.33783783783783794,
        "frequency": 2
      }
    ]
  },
  "ENVIRONMENTAL": {
    "before": [],
    "after": [
      {
        "text": "location/description",
        "confidence": 0.3178512396694217,
        "frequency": 29
      },
      {
        "text": "floor",
        "confidence": 0.3178512396694217,
        "frequency": 29
      },
      {
        "text": "covering",
        "confidence": 0.3178512396694217,
        "frequency": 29
      },
      {
        "text": "bedrooms",
        "confidence": 0.3178512396694217,
        "frequency": 26
      },
      {
        "text": "rooms",
        "confidence": 0.3178512396694217,
        "frequency": 25
      }
    ]
  },
  "TYPICAL_DAY": {
    "before": [],
    "after": [
      {
        "text": "will",
        "confidence": 0.3312857142857148,
        "frequency": 10
      },
      {
        "text": "some",
        "confidence": 0.3312857142857148,
        "frequency": 6
      },
      {
        "text": "with",
        "confidence": 0.3312857142857148,
        "frequency": 6
      },
      {
        "text": "dishes",
        "confidence": 0.3312857142857148,
        "frequency": 4
      },
      {
        "text": "makes",
        "confidence": 0.3312857142857148,
        "frequency": 4
      }
    ]
  },
  "ADLS": {
    "before": [],
    "after": [
      {
        "text": "activities:",
        "confidence": 0.32923857868020345,
        "frequency": 8
      },
      {
        "text": "engagement",
        "confidence": 0.32923857868020345,
        "frequency": 7
      },
      {
        "text": "bathroom",
        "confidence": 0.32923857868020345,
        "frequency": 4
      },
      {
        "text": "home",
        "confidence": 0.32923857868020345,
        "frequency": 4
      },
      {
        "text": "management",
        "confidence": 0.32923857868020345,
        "frequency": 4
      }
    ]
  },
  "ATTENDANT_CARE": {
    "before": [],
    "after": [
      {
        "text": "sincerely,",
        "confidence": 0.30669703872437337,
        "frequency": 25
      },
      {
        "text": "_______________________",
        "confidence": 0.30669703872437337,
        "frequency": 25
      },
      {
        "text": "sebastien",
        "confidence": 0.30669703872437337,
        "frequency": 25
      },
      {
        "text": "ferland",
        "confidence": 0.30669703872437337,
        "frequency": 25
      },
      {
        "text": "reg.(ont)",
        "confidence": 0.30669703872437337,
        "frequency": 25
      }
    ]
  }
};
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