/**
 * ADLSExtractor.js
 * 
 * Specialized extractor for the ADLS (Activities of Daily Living) section with enhanced pattern recognition
 * based on statistical analysis of successful extractions.
 */

const BaseExtractor = require('./BaseExtractor');

class ADLSExtractor extends BaseExtractor {
  constructor() {
    super('ADLS');
    
    // Additional patterns specific to ADLS section
    this.adlPatterns = {
      selfCare: [
        { regex: /(?:self-care|self care|personal care|personal hygiene)(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.85 },
        { regex: /(?:activities of daily living|ADLs|basic ADLs|BADLs)(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.8 },
        { regex: /(?:bathing|dressing|grooming|toileting|feeding|eating)(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.75 }
      ],
      mobility: [
        { regex: /(?:mobility|ambulation|locomotion|walking|transfers)(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.85 },
        { regex: /(?:functional mobility|physical mobility|movement)(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.8 },
        { regex: /(?:ability to|can|cannot|able to|unable to) (?:walk|ambulate|move|transfer) (.*?)(?:\.|\n|$)/i, confidence: 0.75 }
      ],
      instrumental: [
        { regex: /(?:instrumental activities of daily living|IADLs)(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.85 },
        { regex: /(?:household|home management|community living skills)(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.8 },
        { regex: /(?:cooking|cleaning|laundry|shopping|transportation|medication management|financial management)(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.75 }
      ],
      summary: [
        { regex: /(?:summary|overview|assessment|conclusion)(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.85 },
        { regex: /(?:overall|in summary|to summarize)(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.8 },
        { regex: /(?:the client|the patient) (?:is|can|requires|needs) (.*?) (?:assistance|help|support) (?:with|for) (?:ADLs|activities of daily living|self-care)/i, confidence: 0.75 }
      ],
      recommendations: [
        { regex: /(?:recommendations|suggested interventions|suggested modifications|suggested adaptations)(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.85 },
        { regex: /(?:recommend|suggest|advise)(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.8 },
        { regex: /(?:would benefit from|needs|requires) (.*?) (?:to improve|to enhance|to increase|to maintain) (?:ADLs|activities of daily living|self-care)/i, confidence: 0.75 }
      ]
    };
    
    // Self-care activities for pattern matching
    this.selfCareActivities = [
      'bathing', 'shower', 'bath', 'washing', 'hygiene', 'dressing', 'undressing', 'clothes',
      'grooming', 'hair', 'shaving', 'makeup', 'toileting', 'toilet', 'bathroom', 'continence',
      'feeding', 'eating', 'drinking', 'meal', 'food', 'swallowing', 'oral', 'brushing', 'teeth',
      'dental', 'medication', 'medications', 'pills', 'sleeping', 'functional communication'
    ];
    
    // Mobility activities
    this.mobilityActivities = [
      'walking', 'walk', 'ambulation', 'ambulate', 'transfers', 'transfer', 'bed mobility',
      'wheelchair', 'mobility', 'movement', 'stairs', 'steps', 'standing', 'sit-to-stand',
      'balance', 'coordination', 'gait', 'fall', 'falls', 'assistive device', 'walker',
      'cane', 'crutches', 'mobility aid', 'wheelchair', 'scooter'
    ];
    
    // Instrumental ADL activities
    this.instrumentalActivities = [
      'cooking', 'meal preparation', 'cleaning', 'housekeeping', 'laundry', 'shopping',
      'finances', 'financial management', 'money management', 'budgeting', 'bills',
      'transportation', 'driving', 'public transit', 'communication', 'phone', 'computer',
      'internet', 'medication management', 'taking medication', 'home maintenance',
      'yard work', 'shopping', 'community mobility', 'appointments'
    ];
  }
  
  /**
   * Extract data from ADLS section text using enhanced pattern recognition
   * @param {string} text - ADLS section text
   * @param {Object} allSections - All sections in the document
   * @returns {Object} Extracted data with confidence scores
   */
  extract(text, allSections = {}) {
    // Use base extractor first
    const result = super.extract(text, allSections);
    
    // Additional extraction techniques specific to ADLS
    this.extractAdlNotes(text, result);
    this.extractSelfCare(text, result);
    this.extractMobility(text, result);
    this.extractInstrumental(text, result);
    this.extractAdlSummary(text, result);
    
    // Apply ADLS-specific validations
    this.validateAdlData(result);
    
    return result;
  }
  
  /**
   * Extract ADL notes (general information about ADLs)
   * @param {string} text - ADLS section text
   * @param {Object} result - Result object to populate
   */
  extractAdlNotes(text, result) {
    // If not already extracted, use entire text as ADL notes
    if (!result.adlNotes) {
      result.adlNotes = text.trim();
      result.confidence.adlNotes = 0.9;
      result.adlNotes_method = 'fullText';
    }
  }
  
  /**
   * Extract self-care information using enhanced pattern matching
   * @param {string} text - ADLS section text
   * @param {Object} result - Result object to populate
   */
  extractSelfCare(text, result) {
    // Skip if already extracted with high confidence
    if (result.selfCare && result.confidence.selfCare > 0.7) {
      return;
    }
    
    // Try patterns from adlPatterns
    for (const pattern of this.adlPatterns.selfCare) {
      const match = text.match(pattern.regex);
      if (match && match[1]) {
        result.selfCare = match[1].trim();
        result.confidence.selfCare = pattern.confidence;
        result.selfCare_method = 'selfCarePattern';
        return;
      }
    }
    
    // If no match from patterns, extract sentences containing self-care keywords
    const sentences = text.split(/[.!?]\s+|(?=[.!?])/);
    const selfCareSentences = sentences.filter(sentence => 
      this.selfCareActivities.some(keyword => 
        sentence.toLowerCase().includes(keyword)
      )
    );
    
    if (selfCareSentences.length > 0) {
      result.selfCare = selfCareSentences.join('. ').trim();
      result.confidence.selfCare = 0.6;
      result.selfCare_method = 'keywordSearch';
    }
  }
  
  /**
   * Extract mobility information
   * @param {string} text - ADLS section text
   * @param {Object} result - Result object to populate
   */
  extractMobility(text, result) {
    // Skip if already extracted with high confidence
    if (result.mobility && result.confidence.mobility > 0.7) {
      return;
    }
    
    // Try patterns from adlPatterns
    for (const pattern of this.adlPatterns.mobility) {
      const match = text.match(pattern.regex);
      if (match && match[1]) {
        result.mobility = match[1].trim();
        result.confidence.mobility = pattern.confidence;
        result.mobility_method = 'mobilityPattern';
        return;
      }
    }
    
    // If no match from patterns, extract sentences containing mobility keywords
    const sentences = text.split(/[.!?]\s+|(?=[.!?])/);
    const mobilitySentences = sentences.filter(sentence => 
      this.mobilityActivities.some(keyword => 
        sentence.toLowerCase().includes(keyword)
      )
    );
    
    if (mobilitySentences.length > 0) {
      result.mobility = mobilitySentences.join('. ').trim();
      result.confidence.mobility = 0.6;
      result.mobility_method = 'keywordSearch';
    }
  }
  
  /**
   * Extract instrumental ADL information
   * @param {string} text - ADLS section text
   * @param {Object} result - Result object to populate
   */
  extractInstrumental(text, result) {
    // Skip if already extracted with high confidence
    if (result.instrumental && result.confidence.instrumental > 0.7) {
      return;
    }
    
    // Try patterns from adlPatterns
    for (const pattern of this.adlPatterns.instrumental) {
      const match = text.match(pattern.regex);
      if (match && match[1]) {
        result.instrumental = match[1].trim();
        result.confidence.instrumental = pattern.confidence;
        result.instrumental_method = 'instrumentalPattern';
        return;
      }
    }
    
    // If no match from patterns, extract sentences containing instrumental ADL keywords
    const sentences = text.split(/[.!?]\s+|(?=[.!?])/);
    const instrumentalSentences = sentences.filter(sentence => 
      this.instrumentalActivities.some(keyword => 
        sentence.toLowerCase().includes(keyword)
      )
    );
    
    if (instrumentalSentences.length > 0) {
      result.instrumental = instrumentalSentences.join('. ').trim();
      result.confidence.instrumental = 0.6;
      result.instrumental_method = 'keywordSearch';
    }
  }
  
  /**
   * Extract ADL summary information
   * @param {string} text - ADLS section text
   * @param {Object} result - Result object to populate
   */
  extractAdlSummary(text, result) {
    // Skip if already extracted with high confidence
    if (result.summary && result.confidence.summary > 0.7) {
      return;
    }
    
    // Try patterns from adlPatterns
    for (const pattern of this.adlPatterns.summary) {
      const match = text.match(pattern.regex);
      if (match && match[1]) {
        result.summary = match[1].trim();
        result.confidence.summary = pattern.confidence;
        result.summary_method = 'summaryPattern';
        return;
      }
    }
    
    // If no explicit summary, try to generate one from the last sentence or paragraph
    const paragraphs = text.split(/\n\s*\n/);
    const lastParagraph = paragraphs[paragraphs.length - 1];
    
    if (lastParagraph && lastParagraph.includes('summary') || lastParagraph.includes('conclusion')) {
      result.summary = lastParagraph.trim();
      result.confidence.summary = 0.5;
      result.summary_method = 'lastParagraph';
    } else {
      const sentences = text.split(/[.!?]\s+|(?=[.!?])/);
      const lastSentence = sentences[sentences.length - 1];
      
      if (lastSentence && lastSentence.length > 15) {  // Ensure it's a substantial sentence
        result.summary = lastSentence.trim();
        result.confidence.summary = 0.3;
        result.summary_method = 'lastSentence';
      }
    }
  }
  
  /**
   * Validate and refine ADL data
   * @param {Object} result - Result object to validate
   */
  validateAdlData(result) {
    // Ensure consistency across ADL categories
    // For example, if mobility mentions independence but self-care mentions dependence,
    // there might be a need to clarify

    // Cross-reference self-care and mobility
    if (result.selfCare && result.mobility) {
      const selfCareLower = result.selfCare.toLowerCase();
      const mobilityLower = result.mobility.toLowerCase();
      
      // Check for independence/dependence consistency
      const selfCareIndependent = selfCareLower.includes('independent') || 
                               selfCareLower.includes('independence');
      const mobilityIndependent = mobilityLower.includes('independent') || 
                               mobilityLower.includes('independence');
      
      const selfCareDependent = selfCareLower.includes('dependent') || 
                             selfCareLower.includes('dependence') ||
                             selfCareLower.includes('assistance') ||
                             selfCareLower.includes('help');
      const mobilityDependent = mobilityLower.includes('dependent') || 
                             mobilityLower.includes('dependence') ||
                             mobilityLower.includes('assistance') ||
                             mobilityLower.includes('help');
      
      // If there's an inconsistency (e.g., independent in one but dependent in another),
      // we could flag it or adjust confidence
      if ((selfCareIndependent && mobilityDependent) || (selfCareDependent && mobilityIndependent)) {
        console.log('Potential inconsistency between self-care and mobility independence levels');
        // Adjust confidence if there's an inconsistency
        result.confidence.selfCare *= 0.9;
        result.confidence.mobility *= 0.9;
      }
    }
  }
  
  /**
   * Check if text appears to be an ADLS section
   * @param {Object} result - Extraction result to validate
   * @returns {boolean} True if likely an ADLS section
   */
  isCorrectSectionType(result) {
    // ADLS sections should have notes with high confidence
    if (result.adlNotes && result.confidence.adlNotes > 0.7) {
      return true;
    }
    
    // ADLS sections should have at least one ADL category with decent confidence
    if ((result.selfCare && result.confidence.selfCare > 0.6) ||
        (result.mobility && result.confidence.mobility > 0.6) ||
        (result.instrumental && result.confidence.instrumental > 0.6)) {
      return true;
    }
    
    // Require a minimum overall confidence
    return result.overallConfidence > 0.4;
  }
}

module.exports = ADLSExtractor;
