/**
 * ExtractorUtils.js
 * 
 * Utility functions for field extraction based on statistical analysis
 * of successful extraction patterns.
 */

const metaAnalysis = require('../../../../pattern_repository/expanded_dataset/meta_analysis.json');

/**
 * Get field priority tiers based on statistical success rates
 * @returns {Object} Field priorities by section with high, medium, low, and veryLow tiers
 */
function getFieldPriorities() {
  const fieldExtraction = metaAnalysis.fieldExtraction;
  const tiers = {};
  
  // Extract sections from field names (e.g., DEMOGRAPHICS.name -> DEMOGRAPHICS)
  const sections = [...new Set(Object.keys(fieldExtraction).map(field => field.split('.')[0]))];
  
  // For each section, categorize fields into priority tiers
  sections.forEach(section => {
    // Get fields for this section
    const sectionFields = Object.keys(fieldExtraction)
      .filter(field => field.startsWith(section + '.'))
      .map(field => ({
        name: field.split('.')[1],
        fullName: field,
        successRate: fieldExtraction[field] / metaAnalysis.sectionOccurrences[section] * 100 || 0
      }))
      .sort((a, b) => b.successRate - a.successRate);
    
    // Categorize fields into tiers
    const high = [];
    const medium = [];
    const low = [];
    const veryLow = [];
    
    sectionFields.forEach(field => {
      if (field.successRate >= 80) {
        high.push(field.name);
      } else if (field.successRate >= 30) {
        medium.push(field.name);
      } else if (field.successRate > 0) {
        low.push(field.name);
      } else {
        veryLow.push(field.name);
      }
    });
    
    // Store in tiers object
    tiers[section] = {
      high,
      medium,
      low,
      veryLow
    };
  });
  
  return tiers;
}

/**
 * Get extraction strategies for different priority levels
 * @returns {Object} Extraction strategies by priority tier
 */
function getExtractionStrategies() {
  return {
    high: ['exact', 'pattern', 'context'],
    medium: ['exact', 'pattern', 'context', 'inference'],
    low: ['exact', 'pattern', 'inference', 'crossReference'],
    veryLow: ['exact', 'inference', 'crossReference', 'default']
  };
}

/**
 * Get statistical weight for confidence calculation based on field success rates
 * @param {string} section - Section name
 * @param {string} field - Field name
 * @returns {number} Statistical weight (0-1)
 */
function getFieldConfidenceWeight(section, field) {
  const fieldName = `${section}.${field}`;
  const successRate = metaAnalysis.fieldExtraction[fieldName] || 0;
  const sectionOccurrences = metaAnalysis.sectionOccurrences[section] || 1;
  
  // Calculate success percentage
  const successPercentage = successRate / sectionOccurrences;
  
  // Map to weight range (0.2-1.0)
  // Higher success rates get higher weights
  return Math.min(1.0, Math.max(0.2, 0.2 + (successPercentage * 0.8)));
}

/**
 * Create regular expressions for field extraction based on successful patterns
 * @param {string} section - Section name
 * @param {string} field - Field name 
 * @returns {Array} Array of regex patterns with confidence scores
 */
function getFieldExtractionPatterns(section, field) {
  // Default patterns mapping
  const defaultPatterns = {
    // DEMOGRAPHICS patterns
    'DEMOGRAPHICS.name': [
      { regex: /(?:client|patient|name)(?:\s*:|:?\s+)(.*?)(?:\s{2,}|\n|$)/i, confidence: 0.8 },
      { regex: /(?:name|client):\s*(.*?)(?:\s{2,}|\n|$)/i, confidence: 0.7 }
    ],
    'DEMOGRAPHICS.dob': [
      { regex: /(?:date of birth|dob|birth date)(?:\s*:|:?\s+)(?:\s*)([0-9]{1,4}[-./][0-9]{1,2}[-./][0-9]{1,4})/i, confidence: 0.8 },
      { regex: /(?:date of birth|dob|birth date):?\s*([a-z]+ [0-9]{1,2},? [0-9]{4})/i, confidence: 0.7 }
    ],
    'DEMOGRAPHICS.address': [
      { regex: /(?:address|residence)(?:\s*:|:?\s+)(.*?)(?:\s{2,}|\n|$)/i, confidence: 0.8 },
      { regex: /(?:address|residence):\s*(.*?)(?:\s{2,}|\n|$)/i, confidence: 0.7 }
    ],
    'DEMOGRAPHICS.phone': [
      { regex: /(?:phone|telephone|tel|cell)(?:\s*:|:?\s+)(?:\s*)([0-9]{3}[-. ][0-9]{3}[-. ][0-9]{4})/i, confidence: 0.8 },
      { regex: /(?:phone|telephone|tel|cell):\s*([0-9()\-. +]{7,})/i, confidence: 0.7 }
    ],
    
    // SYMPTOMS patterns
    'SYMPTOMS.reportedSymptoms': [
      { regex: /(?:complains of|reports|reported|presenting with) (.*?)(?:\.|\n)/i, confidence: 0.8 },
      { regex: /symptoms(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.7 }
    ],
    'SYMPTOMS.painLocation': [
      { regex: /pain (?:in|at|around) (?:the )?([a-z ]+)(?: region| area)?/i, confidence: 0.8 },
      { regex: /([a-z ]+) pain/i, confidence: 0.7 }
    ],
    'SYMPTOMS.painIntensity': [
      { regex: /pain (?:rated|scale|score|intensity|level)(?:\s*:|:?\s+)(?:\s*)([0-9]+(?:\/[0-9]+)?)/i, confidence: 0.8 },
      { regex: /([0-9]+)(?:\/[0-9]+)? out of (?:[0-9]+) pain/i, confidence: 0.7 }
    ],
    
    // Add more patterns for other sections/fields
  };
  
  // Return patterns for the requested field, or empty array if not found
  const fieldKey = `${section}.${field}`;
  return defaultPatterns[fieldKey] || [];
}

/**
 * Get extraction methods for different strategies
 * @returns {Object} Methods for extraction strategies
 */
function getExtractionMethods() {
  return {
    // Exact matching using regex patterns
    exact: (text, field, section) => {
      const patterns = getFieldExtractionPatterns(section, field);
      for (const pattern of patterns) {
        const match = text.match(pattern.regex);
        if (match && match[1]) {
          return {
            value: match[1].trim(),
            confidence: pattern.confidence,
            method: 'exact'
          };
        }
      }
      return null;
    },
    
    // Pattern-based extraction
    pattern: (text, field, section) => {
      // Simplified implementation for common patterns
      const fieldLower = field.toLowerCase();
      const textLower = text.toLowerCase();
      
      // Look for field name followed by colon or similar
      const fieldRegex = new RegExp(`${fieldLower}(?:\\s*:|\\s+)\\s*([^\\n]+)`, 'i');
      const match = textLower.match(fieldRegex);
      if (match && match[1]) {
        return {
          value: match[1].trim(),
          confidence: 0.6,
          method: 'pattern'
        };
      }
      
      return null;
    },
    
    // Contextual extraction based on surrounding text
    context: (text, field, section, existingValues) => {
      // Look for context clues based on section and field
      // This is a simplified implementation
      
      if (section === 'DEMOGRAPHICS' && field === 'address') {
        // Look for text that looks like an address
        const addressRegex = /\d+\s+[A-Za-z\s]+(?:Road|Street|Avenue|Lane|Drive|Way|Blvd|Boulevard|Ave|Dr|St|Rd|Ln)/i;
        const match = text.match(addressRegex);
        if (match) {
          return {
            value: match[0].trim(),
            confidence: 0.5,
            method: 'context'
          };
        }
      }
      
      if (section === 'SYMPTOMS' && field === 'painLocation') {
        // Look for body parts mentioned near the word "pain"
        const bodyParts = ['head', 'neck', 'shoulder', 'arm', 'elbow', 'wrist', 'hand', 'finger', 
                           'back', 'chest', 'abdomen', 'hip', 'knee', 'leg', 'ankle', 'foot', 'toe'];
        
        for (const part of bodyParts) {
          if (textLower.includes(part) && (
              textLower.includes(`${part} pain`) || 
              textLower.includes(`pain in ${part}`) ||
              textLower.includes(`pain at ${part}`)
          )) {
            return {
              value: part,
              confidence: 0.5,
              method: 'context'
            };
          }
        }
      }
      
      return null;
    },
    
    // Inference based on other extracted values
    inference: (text, field, section, existingValues) => {
      // Infer values based on other extracted data
      // This is a simplified implementation
      
      if (section === 'FUNCTIONAL_STATUS' && field === 'mobilityStatus') {
        // Infer mobility status from text about walking, mobility aids, etc.
        if (textLower.includes('wheelchair') || textLower.includes('immobile')) {
          return {
            value: 'Severely limited',
            confidence: 0.4,
            method: 'inference'
          };
        } else if (textLower.includes('walker') || textLower.includes('cane')) {
          return {
            value: 'Requires assistive device',
            confidence: 0.4,
            method: 'inference'
          };
        } else if (textLower.includes('independently')) {
          return {
            value: 'Independent',
            confidence: 0.4,
            method: 'inference'
          };
        }
      }
      
      return null;
    },
    
    // Cross-reference with other sections
    crossReference: (text, field, section, existingValues, allSections) => {
      // Extract information by cross-referencing between sections
      // This is a simplified implementation
      
      if (section === 'MEDICAL_HISTORY' && field === 'diagnoses') {
        // Try to find diagnoses mentioned in other sections
        const symptomsSection = allSections['SYMPTOMS'] || '';
        const functionalSection = allSections['FUNCTIONAL_STATUS'] || '';
        
        const diagnosisTerms = ['diagnosed with', 'diagnosis of', 'suffers from', 'condition of'];
        
        for (const term of diagnosisTerms) {
          const regex = new RegExp(`${term} ([^.\\n]+)`, 'i');
          
          // Check in symptoms section
          const symptomsMatch = symptomsSection.match(regex);
          if (symptomsMatch && symptomsMatch[1]) {
            return {
              value: symptomsMatch[1].trim(),
              confidence: 0.3,
              method: 'crossReference'
            };
          }
          
          // Check in functional section
          const functionalMatch = functionalSection.match(regex);
          if (functionalMatch && functionalMatch[1]) {
            return {
              value: functionalMatch[1].trim(),
              confidence: 0.3,
              method: 'crossReference'
            };
          }
        }
      }
      
      return null;
    },
    
    // Default values as a last resort
    default: (text, field, section) => {
      // Provide default values for certain fields
      // This is a simplified implementation
      
      const defaults = {
        'DEMOGRAPHICS.age': 'Unknown',
        'ENVIRONMENTAL.barriers': 'None reported',
        'ENVIRONMENTAL.safetyRisks': 'None identified',
        'MEDICAL_HISTORY.allergies': 'None reported',
        'FUNCTIONAL_STATUS.functionalGoals': 'Not specified'
      };
      
      const fieldKey = `${section}.${field}`;
      if (defaults[fieldKey]) {
        return {
          value: defaults[fieldKey],
          confidence: 0.1,
          method: 'default'
        };
      }
      
      return null;
    }
  };
}

module.exports = {
  getFieldPriorities,
  getExtractionStrategies,
  getFieldConfidenceWeight,
  getFieldExtractionPatterns,
  getExtractionMethods
};
