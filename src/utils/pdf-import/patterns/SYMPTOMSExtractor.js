/**
 * SYMPTOMSExtractor.js
 * 
 * Specialized extractor for the SYMPTOMS section with enhanced pattern recognition
 * based on statistical analysis of successful extractions.
 */

const BaseExtractor = require('./BaseExtractor');

class SYMPTOMSExtractor extends BaseExtractor {
  constructor() {
    super('SYMPTOMS');
    
    // Additional patterns specific to SYMPTOMS section
    this.symptomPatterns = {
      reportedSymptoms: [
        { regex: /(?:complains of|reports|reported|presenting with) (.*?)(?:\.|\n)/i, confidence: 0.8 },
        { regex: /(?:main|chief|principal) (?:complaint|symptom)s?(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.85 },
        { regex: /(?:symptoms|complaints)(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.75 }
      ],
      painLocation: [
        { regex: /pain (?:in|at|around|to) (?:the )?([a-z ]+)(?: region| area)?/i, confidence: 0.8 },
        { regex: /([a-z ]+) pain/i, confidence: 0.7 },
        { regex: /experiencing pain (?:in|at|around) (?:the )?([a-z ]+)/i, confidence: 0.75 }
      ],
      painIntensity: [
        { regex: /pain (?:rated|scale|score|intensity|level)(?:\s*:|:?\s+)(?:\s*)([0-9]+(?:\/[0-9]+)?)/i, confidence: 0.8 },
        { regex: /([0-9]+)(?:\/[0-9]+)? out of (?:[0-9]+) pain/i, confidence: 0.75 },
        { regex: /pain (?:was|is) ([0-9]+)(?:\/[0-9]+)?/i, confidence: 0.7 }
      ],
      functionalImpact: [
        { regex: /(?:impact|affects|interferes with|limiting) (?:the patient'?s|client'?s|their)? (?:ability to|capacity to|function in) ([^.]+)/i, confidence: 0.8 },
        { regex: /(?:functional limitations|functional impact|functional implications)(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.85 },
        { regex: /(?:unable|difficulty|struggles) to ([^.]+) due to (?:pain|symptoms)/i, confidence: 0.75 }
      ],
      symptomOnset: [
        { regex: /(?:symptoms|condition|problems|issues|pain) (?:began|started|commenced|initiated|onset) (?:on|in|at) ([^.]+)/i, confidence: 0.8 },
        { regex: /(?:onset|start) of (?:symptoms|pain)(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.85 },
        { regex: /(?:symptoms|pain) (?:have|has) been present (?:for|since) ([^.]+)/i, confidence: 0.75 }
      ]
    };
    
    // Symptom keywords for pattern matching
    this.symptomKeywords = [
      'pain', 'ache', 'sore', 'discomfort', 'stiffness', 'swelling', 'numbness', 'tingling',
      'weakness', 'fatigue', 'dizziness', 'headache', 'nausea', 'vomiting', 'fever', 'cough',
      'shortness of breath', 'difficulty breathing', 'chest pain', 'palpitations', 'rash',
      'itching', 'burning', 'discharge', 'bleeding', 'bruising', 'lump', 'mass', 'swollen',
      'limitation', 'reduced', 'restricted', 'impaired', 'constipation', 'diarrhea',
      'incontinence', 'retention', 'difficult', 'painful', 'sleeping', 'insomnia', 'anxiety',
      'depression', 'mood', 'memory', 'concentration', 'confusion', 'balance', 'coordination',
      'tremor', 'seizure', 'spasm', 'cramp', 'disturbance', 'loss', 'excessive', 'decreased'
    ];
    
    // Body part keywords for pain location
    this.bodyPartKeywords = [
      'head', 'skull', 'forehead', 'temple', 'scalp', 'brain', 'eye', 'eyes', 'ear', 'ears',
      'face', 'cheek', 'jaw', 'nose', 'mouth', 'lip', 'lips', 'tongue', 'tooth', 'teeth', 'gums',
      'throat', 'neck', 'shoulder', 'shoulders', 'arm', 'arms', 'elbow', 'elbows', 'forearm',
      'wrist', 'wrists', 'hand', 'hands', 'finger', 'fingers', 'thumb', 'thumbs', 'chest',
      'breast', 'breasts', 'ribs', 'sternum', 'heart', 'lung', 'lungs', 'abdomen', 'stomach',
      'belly', 'navel', 'back', 'spine', 'vertebra', 'vertebrae', 'lumbar', 'thoracic', 'cervical',
      'pelvis', 'hip', 'hips', 'groin', 'buttock', 'buttocks', 'leg', 'legs', 'thigh', 'thighs',
      'knee', 'knees', 'shin', 'calf', 'calves', 'ankle', 'ankles', 'foot', 'feet', 'toe', 'toes',
      'joint', 'joints', 'muscle', 'muscles', 'tendon', 'tendons', 'ligament', 'ligaments',
      'nerve', 'nerves'
    ];
  }
  
  /**
   * Extract data from SYMPTOMS section text using enhanced pattern recognition
   * @param {string} text - SYMPTOMS section text
   * @param {Object} allSections - All sections in the document
   * @returns {Object} Extracted data with confidence scores
   */
  extract(text, allSections = {}) {
    // Use base extractor first
    const result = super.extract(text, allSections);
    
    // Additional extraction techniques specific to SYMPTOMS
    this.extractSymptomNotes(text, result);
    this.extractReportedSymptoms(text, result);
    this.extractFunctionalImpact(text, result);
    this.extractPainData(text, result);
    
    // Apply SYMPTOMS-specific validations
    this.validateSymptomsData(result);
    
    return result;
  }
  
  /**
   * Extract symptom notes (general information about symptoms)
   * @param {string} text - SYMPTOMS section text
   * @param {Object} result - Result object to populate
   */
  extractSymptomNotes(text, result) {
    // If not already extracted, use entire text as symptom notes
    if (!result.symptomNotes) {
      result.symptomNotes = text.trim();
      result.confidence.symptomNotes = 0.9;
      result.symptomNotes_method = 'fullText';
    }
  }
  
  /**
   * Extract reported symptoms using enhanced pattern matching
   * @param {string} text - SYMPTOMS section text
   * @param {Object} result - Result object to populate
   */
  extractReportedSymptoms(text, result) {
    // Skip if already extracted with high confidence
    if (result.reportedSymptoms && result.confidence.reportedSymptoms > 0.7) {
      return;
    }
    
    // Try patterns from symptomPatterns
    for (const pattern of this.symptomPatterns.reportedSymptoms) {
      const match = text.match(pattern.regex);
      if (match && match[1]) {
        result.reportedSymptoms = match[1].trim();
        result.confidence.reportedSymptoms = pattern.confidence;
        result.reportedSymptoms_method = 'symptomPattern';
        return;
      }
    }
    
    // If no match from patterns, extract sentences containing symptom keywords
    const sentences = text.split(/[.!?]\\s+|(?=[.!?])/);
    const symptomSentences = sentences.filter(sentence => 
      this.symptomKeywords.some(keyword => 
        sentence.toLowerCase().includes(keyword)
      )
    );
    
    if (symptomSentences.length > 0) {
      result.reportedSymptoms = symptomSentences.join('. ').trim();
      result.confidence.reportedSymptoms = 0.6;
      result.reportedSymptoms_method = 'keywordSearch';
    }
  }
  
  /**
   * Extract functional impact information
   * @param {string} text - SYMPTOMS section text
   * @param {Object} result - Result object to populate
   */
  extractFunctionalImpact(text, result) {
    // Skip if already extracted with high confidence
    if (result.functionalImpact && result.confidence.functionalImpact > 0.7) {
      return;
    }
    
    // Try patterns from symptomPatterns
    for (const pattern of this.symptomPatterns.functionalImpact) {
      const match = text.match(pattern.regex);
      if (match && match[1]) {
        result.functionalImpact = match[1].trim();
        result.confidence.functionalImpact = pattern.confidence;
        result.functionalImpact_method = 'impactPattern';
        return;
      }
    }
    
    // Look for sentences containing impact keywords
    const impactKeywords = ['limit', 'restrict', 'prevent', 'unable', 'difficult', 'struggle', 
                           'interfere', 'impact', 'affect', 'hinder', 'impair', 'constrain',
                           'challenge', 'obstacle', 'barrier', 'impediment', 'cannot'];
    
    const sentences = text.split(/[.!?]\\s+|(?=[.!?])/);
    const impactSentences = sentences.filter(sentence => {
      const lowerSentence = sentence.toLowerCase();
      return impactKeywords.some(keyword => lowerSentence.includes(keyword));
    });
    
    if (impactSentences.length > 0) {
      result.functionalImpact = impactSentences.join('. ').trim();
      result.confidence.functionalImpact = 0.55;
      result.functionalImpact_method = 'impactKeywords';
    }
  }
  
  /**
   * Extract pain-related data (location, intensity, etc.)
   * @param {string} text - SYMPTOMS section text
   * @param {Object} result - Result object to populate
   */
  extractPainData(text, result) {
    // Extract pain location if not already extracted with high confidence
    if (!result.painLocation || result.confidence.painLocation < 0.7) {
      // Try patterns from symptomPatterns
      for (const pattern of this.symptomPatterns.painLocation) {
        const match = text.match(pattern.regex);
        if (match && match[1]) {
          const location = match[1].trim();
          // Verify it's a body part
          if (this.bodyPartKeywords.some(part => location.includes(part))) {
            result.painLocation = location;
            result.confidence.painLocation = pattern.confidence;
            result.painLocation_method = 'locationPattern';
            break;
          }
        }
      }
      
      // If no match, look for body parts near the word "pain"
      if (!result.painLocation) {
        const textLower = text.toLowerCase();
        for (const bodyPart of this.bodyPartKeywords) {
          // Check for bodily location within 20 characters of the word "pain"
          const painIndex = textLower.indexOf("pain");
          if (painIndex !== -1) {
            const contextStart = Math.max(0, painIndex - 30);
            const contextEnd = Math.min(textLower.length, painIndex + 30);
            const context = textLower.substring(contextStart, contextEnd);
            
            if (context.includes(bodyPart)) {
              result.painLocation = bodyPart;
              result.confidence.painLocation = 0.5;
              result.painLocation_method = 'proximitySearch';
              break;
            }
          }
        }
      }
    }
    
    // Extract pain intensity if not already extracted with high confidence
    if (!result.painIntensity || result.confidence.painIntensity < 0.7) {
      // Try patterns from symptomPatterns
      for (const pattern of this.symptomPatterns.painIntensity) {
        const match = text.match(pattern.regex);
        if (match && match[1]) {
          result.painIntensity = match[1].trim();
          result.confidence.painIntensity = pattern.confidence;
          result.painIntensity_method = 'intensityPattern';
          break;
        }
      }
      
      // If no match, look for numeric values near pain indicators
      if (!result.painIntensity) {
        const painIntensityRegex = /(?:pain|discomfort|ache).{1,20}?(\d+\s*(?:\/\s*\d+)?)/i;
        const match = text.match(painIntensityRegex);
        if (match && match[1]) {
          result.painIntensity = match[1].trim();
          result.confidence.painIntensity = 0.5;
          result.painIntensity_method = 'numericSearch';
        }
      }
    }
    
    // Extract symptom onset if not already extracted with high confidence
    if (!result.symptomOnset || result.confidence.symptomOnset < 0.7) {
      // Try patterns from symptomPatterns
      for (const pattern of this.symptomPatterns.symptomOnset) {
        const match = text.match(pattern.regex);
        if (match && match[1]) {
          result.symptomOnset = match[1].trim();
          result.confidence.symptomOnset = pattern.confidence;
          result.symptomOnset_method = 'onsetPattern';
          break;
        }
      }
      
      // If no match, look for temporal indicators
      if (!result.symptomOnset) {
        const timePatterns = [
          /(?:since|for) (\d+\s+(?:day|week|month|year)s?)/i,
          /(?:began|started|commenced) (?:on|in) ([a-zA-Z]+ \d{1,4}(?:,? \d{2,4})?)/i,
          /(?:approximately|about|around) (\d+\s+(?:day|week|month|year)s? ago)/i
        ];
        
        for (const pattern of timePatterns) {
          const match = text.match(pattern);
          if (match && match[1]) {
            result.symptomOnset = match[1].trim();
            result.confidence.symptomOnset = 0.6;
            result.symptomOnset_method = 'temporalSearch';
            break;
          }
        }
      }
    }
  }
  
  /**
   * Validate and refine symptoms data
   * @param {Object} result - Result object to validate
   */
  validateSymptomsData(result) {
    // Ensure reportedSymptoms is an array for consistency
    if (result.reportedSymptoms && typeof result.reportedSymptoms === 'string') {
      const symptoms = [];
      
      // Split by commas, semicolons, or "and"
      const parts = result.reportedSymptoms.split(/[,.;]|\sand\s/);
      
      parts.forEach(part => {
        part = part.trim();
        if (part) {
          symptoms.push(part);
        }
      });
      
      // If we have properly split symptoms, convert to array
      if (symptoms.length > 1) {
        result.reportedSymptoms = symptoms;
      }
      // Otherwise keep as string
    }
    
    // Validate pain intensity format
    if (result.painIntensity) {
      // If it's a numeric value followed by /10, standardize format
      const intensityMatch = result.painIntensity.match(/^(\d+)(?:\/(\d+))?$/);
      if (intensityMatch) {
        const value = intensityMatch[1];
        const scale = intensityMatch[2] || 10;
        result.painIntensity = `${value}/${scale}`;
      }
    }
    
    // Cross-reference between pain location and reported symptoms
    if (result.painLocation && result.reportedSymptoms) {
      // If pain location doesn't appear in reported symptoms, ensure it's mentioned
      if (Array.isArray(result.reportedSymptoms)) {
        let locationMentioned = false;
        for (const symptom of result.reportedSymptoms) {
          if (symptom.toLowerCase().includes(result.painLocation.toLowerCase())) {
            locationMentioned = true;
            break;
          }
        }
        
        if (!locationMentioned) {
          result.reportedSymptoms.push(`Pain in ${result.painLocation}`);
        }
      } else if (typeof result.reportedSymptoms === 'string') {
        if (!result.reportedSymptoms.toLowerCase().includes(result.painLocation.toLowerCase())) {
          result.reportedSymptoms += `. Pain in ${result.painLocation}`;
        }
      }
    }
  }
  
  /**
   * Check if text appears to be a SYMPTOMS section
   * @param {string} text - Text to check
   * @returns {boolean} True if likely a SYMPTOMS section
   */
  isCorrectSectionType(result) {
    // SYMPTOMS sections should have high confidence in symptomNotes
    if (result.symptomNotes && result.confidence.symptomNotes > 0.7) {
      return true;
    }
    
    // SYMPTOMS sections should have reported symptoms with decent confidence
    if (result.reportedSymptoms && result.confidence.reportedSymptoms > 0.6) {
      return true;
    }
    
    // Require a minimum overall confidence
    return result.overallConfidence > 0.4;
  }
}

module.exports = SYMPTOMSExtractor;
