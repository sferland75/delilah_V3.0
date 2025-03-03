// DocumentClassifier.js
// Classifies document types to optimize pattern recognition
// Part of Delilah V3.0 PDF Import Pattern Recognition Enhancement

/**
 * Service for classifying documents to optimize pattern recognition
 */
class DocumentClassifier {
  constructor() {
    // Initialize classification models
    this.classifiers = [
      { 
        type: 'OT_ASSESSMENT',
        patterns: [
          /occupational therapy/i, 
          /in-home assessment/i, 
          /activities of daily living/i,
          /functional assessment/i,
          /attendant care/i
        ],
        sections: [
          'DEMOGRAPHICS',
          'MEDICAL_HISTORY',
          'SYMPTOMS',
          'FUNCTIONAL_STATUS',
          'ENVIRONMENTAL',
          'ADLS',
          'ATTENDANT_CARE',
          'TYPICAL_DAY'
        ],
        weight: 1.0 // Base weight for this document type
      },
      {
        type: 'MEDICAL_REPORT',
        patterns: [
          /medical (examination|report|assessment)/i, 
          /diagnosis/i, 
          /clinical findings/i,
          /treatment plan/i,
          /physical examination/i
        ],
        sections: [
          'DEMOGRAPHICS',
          'MEDICAL_HISTORY',
          'SYMPTOMS',
          'DIAGNOSIS',
          'TREATMENT_PLAN'
        ],
        weight: 1.0
      },
      {
        type: 'PSYCHOLOGY_REPORT',
        patterns: [
          /psychological (assessment|evaluation|report)/i,
          /mental status/i,
          /cognitive assessment/i,
          /behavioral observations/i,
          /psychological test/i
        ],
        sections: [
          'DEMOGRAPHICS',
          'HISTORY',
          'MENTAL_STATUS',
          'ASSESSMENT',
          'RECOMMENDATIONS'
        ],
        weight: 1.0
      },
      {
        type: 'REHABILITATION_PLAN',
        patterns: [
          /rehabilitation plan/i,
          /therapy goals/i,
          /functional goals/i,
          /discharge plan/i,
          /therapeutic interventions/i
        ],
        sections: [
          'DEMOGRAPHICS',
          'EVALUATION_SUMMARY',
          'GOALS',
          'INTERVENTIONS',
          'TIMELINE'
        ],
        weight: 1.0
      }
    ];
  }

  /**
   * Identify the document type based on content
   * @param {String} text - Document text content
   * @returns {Object} - Document type classification with confidence
   */
  identifyDocumentType(text) {
    if (!text) {
      return { type: 'unknown', confidence: 0 };
    }

    // Calculate scores for each document type
    const scores = this.classifiers.map(classifier => {
      // Score based on matching patterns
      let patternScore = 0;
      classifier.patterns.forEach(pattern => {
        if (pattern.test(text)) {
          patternScore += 1;
        }
      });
      
      // Normalize pattern score (0-1)
      patternScore = classifier.patterns.length > 0 ? 
        patternScore / classifier.patterns.length : 0;
      
      // Score based on section headers 
      let sectionScore = 0;
      classifier.sections.forEach(section => {
        const sectionPattern = new RegExp(
          `(${section.replace(/_/g, '[ _]')}|${this.formatSectionName(section)})`, 'i'
        );
        if (sectionPattern.test(text)) {
          sectionScore += 1;
        }
      });
      
      // Normalize section score (0-1)
      sectionScore = classifier.sections.length > 0 ?
        sectionScore / classifier.sections.length : 0;
      
      // Content-based heuristics
      const contentScore = this.calculateContentScore(text, classifier.type);
      
      // Weighted combination of scores
      const combinedScore = (
        (patternScore * 0.4) + 
        (sectionScore * 0.4) + 
        (contentScore * 0.2)
      ) * classifier.weight;
      
      return {
        type: classifier.type,
        confidence: combinedScore,
        details: {
          patternScore,
          sectionScore,
          contentScore
        }
      };
    });
    
    // Find the highest scoring type
    let bestMatch = { type: 'unknown', confidence: 0 };
    scores.forEach(score => {
      if (score.confidence > bestMatch.confidence) {
        bestMatch = score;
      }
    });
    
    // If confidence is too low, mark as unknown
    if (bestMatch.confidence < 0.3) {
      return { 
        type: 'unknown', 
        confidence: bestMatch.confidence,
        possibleTypes: scores
          .filter(s => s.confidence > 0.2)
          .map(s => s.type)
      };
    }
    
    return bestMatch;
  }
  
  /**
   * Calculate content-based score for document classification
   * @param {String} text - Document text
   * @param {String} type - Document type to check
   * @returns {Number} - Content-based score (0-1)
   */
  calculateContentScore(text, type) {
    // Content-specific keywords for each document type
    const keywords = {
      'OT_ASSESSMENT': [
        'occupational', 'therapy', 'function', 'assessment', 
        'daily living', 'mobility', 'ADL', 'self-care', 
        'independence', 'adaptive', 'environment', 'home',
        'assistance', 'occupational therapist', 'intervention',
        'evaluation', 'equipment', 'assistive', 'bathing', 
        'dressing', 'grooming', 'feeding', 'toileting'
      ],
      
      'MEDICAL_REPORT': [
        'diagnosis', 'prognosis', 'treatment', 'medication', 
        'prescription', 'clinical', 'physician', 'doctor',
        'patient', 'symptoms', 'examination', 'vital signs',
        'medical history', 'chief complaint', 'differential',
        'laboratory', 'imaging', 'referral', 'follow-up'
      ],
      
      'PSYCHOLOGY_REPORT': [
        'psychological', 'cognitive', 'emotional', 'behavioral',
        'mental health', 'therapy', 'counseling', 'psychotherapy',
        'assessment', 'evaluation', 'diagnosis', 'DSM', 'mood',
        'affect', 'attention', 'memory', 'intelligence', 'WAIS',
        'depression', 'anxiety', 'psychologist', 'mental status'
      ],
      
      'REHABILITATION_PLAN': [
        'rehabilitation', 'therapy', 'goals', 'interventions',
        'recovery', 'progress', 'discharge', 'treatment plan',
        'functional outcomes', 'therapeutic', 'exercise', 
        'modalities', 'strengthening', 'range of motion', 'mobility',
        'physical therapy', 'occupational therapy', 'speech therapy'
      ]
    };
    
    // Check how many keywords are present
    const typeKeywords = keywords[type] || [];
    let matchCount = 0;
    
    typeKeywords.forEach(keyword => {
      if (text.toLowerCase().includes(keyword.toLowerCase())) {
        matchCount++;
      }
    });
    
    // Normalize score (0-1)
    return typeKeywords.length > 0 ? matchCount / typeKeywords.length : 0;
  }
  
  /**
   * Format section name for human-readable display
   * @param {String} section - Section name in constant format
   * @returns {String} - Human-readable section name
   */
  formatSectionName(section) {
    return section
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  /**
   * Learn from a document to improve classification
   * @param {String} text - Document text
   * @param {String} correctType - Correct document type
   */
  learnFromDocument(text, correctType) {
    // Find the correct classifier
    const classifier = this.classifiers.find(c => c.type === correctType);
    if (!classifier) {
      console.warn(`[DocumentClassifier] Unknown document type for learning: ${correctType}`);
      return;
    }
    
    // Increase the weight of this classifier slightly
    classifier.weight = Math.min(1.5, classifier.weight + 0.05);
    
    // Decrease weights of other incorrectly matched classifiers
    const identifiedType = this.identifyDocumentType(text).type;
    if (identifiedType !== correctType && identifiedType !== 'unknown') {
      const incorrectClassifier = this.classifiers.find(c => c.type === identifiedType);
      if (incorrectClassifier) {
        incorrectClassifier.weight = Math.max(0.5, incorrectClassifier.weight - 0.05);
      }
    }
  }
}

module.exports = DocumentClassifier;
