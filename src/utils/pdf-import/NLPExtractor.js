// NLPExtractor.js
// Advanced text extraction using natural language processing techniques
// Part of Delilah V3.0 PDF Import Pattern Recognition Enhancement

/**
 * Service for advanced text extraction using natural language processing
 */
class NLPExtractor {
  constructor() {
    this.entityTypes = {
      PERSON: ['name', 'client', 'patient', 'individual', 'subject'],
      LOCATION: ['address', 'location', 'residence', 'city', 'state', 'province'],
      ORGANIZATION: ['hospital', 'clinic', 'facility', 'institution', 'provider'],
      DATE: ['date', 'dob', 'birth', 'admission', 'discharge', 'assessment'],
      CONDITION: ['diagnosis', 'condition', 'disorder', 'disease', 'impairment'],
      TREATMENT: ['treatment', 'therapy', 'intervention', 'procedure', 'medication'],
      MEASUREMENT: ['score', 'level', 'degree', 'rating', 'measurement']
    };
    
    this.severityLevels = {
      'none': 0,
      'minimal': 1,
      'mild': 2, 
      'moderate': 3,
      'moderately severe': 4,
      'severe': 5,
      'profound': 5,
      'extreme': 5
    };
    
    this.frequencyTerms = {
      'never': 0,
      'rarely': 1,
      'occasionally': 2,
      'sometimes': 2,
      'often': 3,
      'frequently': 4,
      'constantly': 5,
      'always': 5
    };
  }
  
  /**
   * Extract entity relationships using NLP techniques
   * @param {String} text - Text to analyze
   * @returns {Object} - Extracted entity relationships
   */
  extractEntityRelationships(text) {
    if (!text) return { entities: [], relationships: [] };
    
    // Extract entities from text
    const entities = this.extractEntities(text);
    
    // Extract relationships between entities
    const relationships = this.extractRelationships(text, entities);
    
    return {
      entities,
      relationships
    };
  }
  
  /**
   * Extract entities from text
   * @param {String} text - Text to analyze
   * @returns {Array} - Extracted entities
   */
  extractEntities(text) {
    const entities = [];
    
    // Simple entity extraction based on patterns
    Object.entries(this.entityTypes).forEach(([type, keywords]) => {
      keywords.forEach(keyword => {
        // Look for patterns like "keyword: value" or "keyword - value"
        const patterns = [
          new RegExp(`${keyword}\\s*[:;]\\s*([^\\n.]+)`, 'gi'),
          new RegExp(`${keyword}\\s+(?:is|was)\\s+([^\\n.]+)`, 'gi'),
          new RegExp(`${keyword}\\s*[-–]\\s*([^\\n.]+)`, 'gi')
        ];
        
        patterns.forEach(pattern => {
          const matches = [...text.matchAll(pattern)];
          matches.forEach(match => {
            if (match[1] && match[1].trim().length > 0) {
              entities.push({
                type,
                keyword,
                value: match[1].trim(),
                context: this.getTextContext(text, match.index, 100),
                confidence: 0.8
              });
            }
          });
        });
      });
    });
    
    // Extract specific entity types based on more complex patterns
    this.extractSpecializedEntities(text, entities);
    
    return entities;
  }
  
  /**
   * Extract specialized entity types with more complex patterns
   * @param {String} text - Text to analyze
   * @param {Array} entities - Entity array to add to
   */
  extractSpecializedEntities(text, entities) {
    // Extract dates with format MM/DD/YYYY or similar
    const datePatterns = [
      /(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})/g,
      /(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})/g,
      /([A-Za-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?,\s+(\d{4})/g
    ];
    
    datePatterns.forEach(pattern => {
      const matches = [...text.matchAll(pattern)];
      matches.forEach(match => {
        // Look for keywords near the date
        const context = this.getTextContext(text, match.index, 50);
        let keyword = null;
        
        this.entityTypes.DATE.forEach(dateKeyword => {
          if (context.toLowerCase().includes(dateKeyword.toLowerCase())) {
            keyword = dateKeyword;
          }
        });
        
        entities.push({
          type: 'DATE',
          keyword: keyword || 'date',
          value: match[0],
          context,
          confidence: keyword ? 0.9 : 0.7
        });
      });
    });
    
    // Extract severity levels
    Object.keys(this.severityLevels).forEach(term => {
      const pattern = new RegExp(`(${term})\\s+(?:pain|difficulty|impairment|limitation|impact|symptoms|issues|problems)`, 'gi');
      const matches = [...text.matchAll(pattern)];
      
      matches.forEach(match => {
        const context = this.getTextContext(text, match.index, 100);
        
        entities.push({
          type: 'SEVERITY',
          keyword: 'severity',
          value: term,
          numericValue: this.severityLevels[term.toLowerCase()],
          context,
          confidence: 0.85
        });
      });
    });
    
    // Extract frequency terms
    Object.keys(this.frequencyTerms).forEach(term => {
      const pattern = new RegExp(`(${term})\\s+(?:experiences|reports|complains|describes|exhibits|demonstrates|shows)`, 'gi');
      const matches = [...text.matchAll(pattern)];
      
      matches.forEach(match => {
        const context = this.getTextContext(text, match.index, 100);
        
        entities.push({
          type: 'FREQUENCY',
          keyword: 'frequency',
          value: term,
          numericValue: this.frequencyTerms[term.toLowerCase()],
          context,
          confidence: 0.85
        });
      });
    });
  }
  
  /**
   * Extract relationships between entities
   * @param {String} text - Text to analyze
   * @param {Array} entities - Entities to find relationships between
   * @returns {Array} - Extracted relationships
   */
  extractRelationships(text, entities) {
    const relationships = [];
    
    // Look for sentences containing multiple entities
    const sentences = this.splitIntoSentences(text);
    
    sentences.forEach(sentence => {
      // Find entities mentioned in this sentence
      const sentenceEntities = entities.filter(entity => 
        sentence.toLowerCase().includes(entity.value.toLowerCase())
      );
      
      // Need at least 2 entities to form a relationship
      if (sentenceEntities.length < 2) return;
      
      // Look for relationship patterns
      this.extractRelationshipPatterns(sentence, sentenceEntities, relationships);
    });
    
    return relationships;
  }
  
  /**
   * Extract relationships based on patterns in text
   * @param {String} sentence - Sentence to analyze
   * @param {Array} entities - Entities in this sentence
   * @param {Array} relationships - Relationship array to add to
   */
  extractRelationshipPatterns(sentence, entities, relationships) {
    // Common relationship patterns
    const relationshipPatterns = [
      {
        name: 'has_diagnosis',
        pattern: /(?:diagnosed with|suffers from|presents with|has|exhibits|demonstrates|shows|displays)/i,
        sourceTypes: ['PERSON'],
        targetTypes: ['CONDITION']
      },
      {
        name: 'receives_treatment',
        pattern: /(?:receives|undergoing|prescribed|taking|using|participating in|engaged in)/i,
        sourceTypes: ['PERSON'],
        targetTypes: ['TREATMENT']
      },
      {
        name: 'located_at',
        pattern: /(?:residing at|living at|resides at|lives at|located at|situated at)/i,
        sourceTypes: ['PERSON'],
        targetTypes: ['LOCATION']
      },
      {
        name: 'assessed_by',
        pattern: /(?:assessed by|evaluated by|examined by|treated by|seen by)/i,
        sourceTypes: ['PERSON'],
        targetTypes: ['PERSON', 'ORGANIZATION']
      },
      {
        name: 'measured_as',
        pattern: /(?:measured as|rated as|scored as|assessed as|evaluated as)/i,
        sourceTypes: ['CONDITION', 'PERSON'],
        targetTypes: ['MEASUREMENT']
      }
    ];
    
    // Check each relationship pattern
    relationshipPatterns.forEach(relPattern => {
      if (relPattern.pattern.test(sentence)) {
        // Find potential source entities
        const sourceEntities = entities.filter(entity => 
          relPattern.sourceTypes.includes(entity.type)
        );
        
        // Find potential target entities
        const targetEntities = entities.filter(entity => 
          relPattern.targetTypes.includes(entity.type)
        );
        
        // Create relationships between sources and targets
        sourceEntities.forEach(source => {
          targetEntities.forEach(target => {
            if (source !== target) {
              relationships.push({
                type: relPattern.name,
                source: source.value,
                sourceType: source.type,
                target: target.value,
                targetType: target.type,
                context: sentence,
                confidence: 0.75
              });
            }
          });
        });
      }
    });
  }
  
  /**
   * Classify severity of textual descriptions
   * @param {String} text - Text to analyze
   * @returns {Object} - Severity classifications
   */
  classifyTextualSeverity(text) {
    const severityResults = {
      overall: null,
      specific: {}
    };
    
    // Check for overall severity terms
    let highestSeverity = -1;
    let highestTerm = null;
    
    Object.entries(this.severityLevels).forEach(([term, level]) => {
      const pattern = new RegExp(`\\b${term}\\b`, 'gi');
      const matches = [...text.matchAll(pattern)];
      
      if (matches.length > 0 && level > highestSeverity) {
        highestSeverity = level;
        highestTerm = term;
      }
    });
    
    if (highestTerm) {
      severityResults.overall = {
        term: highestTerm,
        level: highestSeverity,
        confidence: 0.8
      };
    }
    
    // Check for specific symptom/condition severity
    const specificPatterns = [
      // Pain severity
      /(\w+)\s+pain\s+(?:described|rated|reported)\s+as\s+(\w+)/gi,
      /pain\s+(?:in|of)\s+(?:the)?\s+(\w+)\s+(?:is|was)\s+(\w+)/gi,
      
      // Limitation severity
      /(\w+)\s+limitations?\s+(?:are|is|was|were)\s+(\w+)/gi,
      
      // Symptom severity
      /(\w+)\s+symptoms?\s+(?:are|is|was|were)\s+(\w+)/gi,
      
      // Impairment severity
      /(\w+)\s+impairment\s+(?:is|was)\s+(\w+)/gi
    ];
    
    specificPatterns.forEach(pattern => {
      const matches = [...text.matchAll(pattern)];
      
      matches.forEach(match => {
        const condition = match[1].toLowerCase();
        const severityTerm = match[2].toLowerCase();
        
        if (this.severityLevels[severityTerm] !== undefined) {
          severityResults.specific[condition] = {
            term: severityTerm,
            level: this.severityLevels[severityTerm],
            confidence: 0.85
          };
        }
      });
    });
    
    return severityResults;
  }
  
  /**
   * Extract temporal information from text
   * @param {String} text - Text to analyze
   * @returns {Object} - Extracted temporal information
   */
  extractTemporalInformation(text) {
    const temporal = {
      dates: [],
      durations: [],
      frequencies: []
    };
    
    // Extract specific dates
    const datePatterns = [
      // MM/DD/YYYY
      { 
        pattern: /(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})/g,
        format: 'MM/DD/YYYY'
      },
      // YYYY/MM/DD
      {
        pattern: /(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})/g,
        format: 'YYYY/MM/DD'
      },
      // Month DD, YYYY
      {
        pattern: /([A-Za-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?,\s+(\d{4})/g,
        format: 'Month DD, YYYY'
      }
    ];
    
    datePatterns.forEach(({ pattern, format }) => {
      const matches = [...text.matchAll(pattern)];
      
      matches.forEach(match => {
        // Look for keywords near the date to determine type
        const context = this.getTextContext(text, match.index, 30);
        let dateType = 'unknown';
        
        if (/birth|born|dob/i.test(context)) {
          dateType = 'birth';
        } else if (/assessment|evaluation|exam/i.test(context)) {
          dateType = 'assessment';
        } else if (/accident|incident|injury|onset/i.test(context)) {
          dateType = 'onset';
        } else if (/admission|admitted/i.test(context)) {
          dateType = 'admission';
        } else if (/discharge|discharged/i.test(context)) {
          dateType = 'discharge';
        }
        
        temporal.dates.push({
          value: match[0],
          format,
          type: dateType,
          context,
          confidence: 0.9
        });
      });
    });
    
    // Extract durations
    const durationPatterns = [
      // N days/weeks/months/years
      {
        pattern: /(\d+)\s+(days?|weeks?|months?|years?)/gi,
        unit: match => match[2].toLowerCase().replace(/s$/, '')
      },
      // several/few/many days/weeks/months/years
      {
        pattern: /(several|few|many)\s+(days?|weeks?|months?|years?)/gi,
        unit: match => match[2].toLowerCase().replace(/s$/, ''),
        normalize: term => {
          const map = { 'several': 3, 'few': 2, 'many': 5 };
          return map[term.toLowerCase()] || 0;
        }
      }
    ];
    
    durationPatterns.forEach(({ pattern, unit, normalize }) => {
      const matches = [...text.matchAll(pattern)];
      
      matches.forEach(match => {
        const context = this.getTextContext(text, match.index, 50);
        let value = parseInt(match[1]);
        
        // Handle non-numeric quantifiers
        if (isNaN(value) && normalize) {
          value = normalize(match[1]);
        }
        
        temporal.durations.push({
          value,
          unit: unit(match),
          raw: match[0],
          context,
          confidence: 0.85
        });
      });
    });
    
    // Extract frequencies
    const frequencyPatterns = [
      // N times per day/week/month
      {
        pattern: /(\d+)\s+times?\s+(?:per|a|each)\s+(day|week|month|year)/gi,
        unit: match => match[2].toLowerCase()
      },
      // daily/weekly/monthly/yearly
      {
        pattern: /(daily|weekly|monthly|yearly|annually)/gi,
        unit: match => {
          const map = {
            'daily': 'day',
            'weekly': 'week',
            'monthly': 'month',
            'yearly': 'year',
            'annually': 'year'
          };
          return map[match[1].toLowerCase()];
        },
        value: match => 1
      },
      // every N days/weeks/months/years
      {
        pattern: /every\s+(\d+)\s+(days?|weeks?|months?|years?)/gi,
        unit: match => match[2].toLowerCase().replace(/s$/, ''),
        interval: true
      }
    ];
    
    frequencyPatterns.forEach(({ pattern, unit, value, interval }) => {
      const matches = [...text.matchAll(pattern)];
      
      matches.forEach(match => {
        const context = this.getTextContext(text, match.index, 50);
        
        temporal.frequencies.push({
          value: value ? value(match) : parseInt(match[1]),
          unit: unit(match),
          isInterval: !!interval,
          raw: match[0],
          context,
          confidence: 0.85
        });
      });
    });
    
    return temporal;
  }
  
  /**
   * Get text context around a position
   * @param {String} text - Full text
   * @param {Number} position - Position to get context around
   * @param {Number} radius - Character radius to include
   * @returns {String} - Context text
   */
  getTextContext(text, position, radius) {
    const start = Math.max(0, position - radius);
    const end = Math.min(text.length, position + radius);
    return text.substring(start, end);
  }
  
  /**
   * Split text into sentences
   * @param {String} text - Text to split
   * @returns {Array} - Array of sentences
   */
  splitIntoSentences(text) {
    // Simple sentence splitting - in a real implementation, you'd use a more sophisticated approach
    return text.split(/(?<=[.!?])\s+/);
  }
}

module.exports = NLPExtractor;
