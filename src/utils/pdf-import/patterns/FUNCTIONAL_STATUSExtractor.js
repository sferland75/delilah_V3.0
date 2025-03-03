/**
 * FUNCTIONAL_STATUSExtractor.js
 * 
 * Specialized extractor for the FUNCTIONAL_STATUS section with enhanced pattern recognition
 * based on statistical analysis of successful extractions.
 */

const BaseExtractor = require('./BaseExtractor');

class FUNCTIONAL_STATUSExtractor extends BaseExtractor {
  constructor() {
    super('FUNCTIONAL_STATUS');
    
    // Additional patterns specific to FUNCTIONAL_STATUS section
    this.functionalPatterns = {
      mobilityStatus: [
        { regex: /(?:mobility|ambulation)(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.85 },
        { regex: /(?:patient|client) (?:is|can) ((?:independently|partially|unable to) (?:ambulate|walk|move).*?)(?:\.|\n|$)/i, confidence: 0.8 },
        { regex: /((?:uses|requires|needs) (?:a |an )?(?:wheelchair|walker|cane|mobility aid|assistive device).*?)(?:\.|\n|$)/i, confidence: 0.85 }
      ],
      assistiveDevices: [
        { regex: /(?:assistive devices?|mobility aids?|equipment)(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.85 },
        { regex: /((?:uses|requires|needs) (?:a |an )?(?:wheelchair|walker|cane|crutches|brace|orthotic|prosthetic).*?)(?:\.|\n|$)/i, confidence: 0.8 },
        { regex: /(?:prescribed|provided with|equipped with) (?:a |an )?(.*?) (?:to assist with|for|to help)/i, confidence: 0.75 }
      ],
      transferStatus: [
        { regex: /(?:transfers?|bed mobility)(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.85 },
        { regex: /(?:patient|client) (?:requires|needs) (.*?) (?:assistance|help) (?:for|with) transfers/i, confidence: 0.8 },
        { regex: /(?:transfers|moves) ((?:independently|with assistance|with help|with difficulty).*?)(?:\.|\n|$)/i, confidence: 0.75 }
      ],
      balanceStatus: [
        { regex: /(?:balance|stability)(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.85 },
        { regex: /(?:balance is|balance was) (.*?)(?:\.|\n|$)/i, confidence: 0.8 },
        { regex: /(?:demonstrates|exhibited|presents with|shows) (.*?) balance/i, confidence: 0.75 }
      ],
      functionalLimitations: [
        { regex: /(?:functional limitations?|limitations?|restrictions?)(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.85 },
        { regex: /(?:limited|restricted|impaired) (?:in|with) (.*?)(?:\.|\n|$)/i, confidence: 0.8 },
        { regex: /(?:difficulties?|challenges?) (?:with|in) (.*?)(?:\.|\n|$)/i, confidence: 0.75 }
      ],
      endurance: [
        { regex: /(?:endurance|stamina|fatigue)(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.85 },
        { regex: /(?:becomes|gets) (?:fatigued|tired|exhausted) (.*?)(?:\.|\n|$)/i, confidence: 0.8 },
        { regex: /(?:able to|can) (?:tolerate|sustain|maintain) (.*?) (?:before|until)/i, confidence: 0.75 }
      ],
      functionalGoals: [
        { regex: /(?:functional goals?|goals?|objectives?)(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.85 },
        { regex: /(?:aims?|plans?) to (.*?)(?:\.|\n|$)/i, confidence: 0.7 },
        { regex: /(?:working towards?|striving for) (.*?)(?:\.|\n|$)/i, confidence: 0.7 }
      ],
      safety: [
        { regex: /(?:safety concerns?|safety issues?|safety risks?)(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.85 },
        { regex: /(?:at risk for|risks?|fall risks?) (.*?)(?:\.|\n|$)/i, confidence: 0.8 },
        { regex: /(?:safety measures?|precautions?) (.*?)(?:\.|\n|$)/i, confidence: 0.75 }
      ]
    };
    
    // Mobility-related keywords for pattern matching
    this.mobilityKeywords = [
      'walk', 'walking', 'ambulate', 'ambulation', 'mobility', 'gait', 'transfers', 'transferring',
      'stand', 'standing', 'sit', 'sitting', 'rise', 'rising', 'wheelchair', 'walker', 'cane',
      'crutches', 'scooter', 'assistive device', 'mobility aid', 'independent', 'dependent',
      'supervision', 'assistance', 'stairs', 'steps', 'curbs', 'ramps', 'uneven', 'terrain'
    ];
    
    // Assistive device keywords
    this.deviceKeywords = [
      'wheelchair', 'power wheelchair', 'manual wheelchair', 'walker', 'rollator', 'cane',
      'quad cane', 'crutches', 'forearm crutches', 'scooter', 'lift', 'hospital bed', 'commode',
      'shower chair', 'bath bench', 'grab bar', 'handrail', 'raised toilet seat', 'reacher',
      'dressing stick', 'sock aid', 'long-handled', 'orthotic', 'brace', 'prosthetic'
    ];
  }
  
  /**
   * Extract data from FUNCTIONAL_STATUS section text using enhanced pattern recognition
   * @param {string} text - FUNCTIONAL_STATUS section text
   * @param {Object} allSections - All sections in the document
   * @returns {Object} Extracted data with confidence scores
   */
  extract(text, allSections = {}) {
    // Use base extractor first
    const result = super.extract(text, allSections);
    
    // Additional extraction techniques specific to FUNCTIONAL_STATUS
    this.extractFunctionalNotes(text, result);
    this.extractMobilityStatus(text, result);
    this.extractAssistiveDevices(text, result);
    this.extractTransferStatus(text, result);
    this.extractFunctionalLimitations(text, result);
    
    // Apply FUNCTIONAL_STATUS-specific validations
    this.validateFunctionalData(result);
    
    return result;
  }
  
  /**
   * Extract functional notes (general information about functional status)
   * @param {string} text - FUNCTIONAL_STATUS section text
   * @param {Object} result - Result object to populate
   */
  extractFunctionalNotes(text, result) {
    // If not already extracted, use entire text as notes
    if (!result.notes) {
      result.notes = text.trim();
      result.confidence.notes = 0.9;
      result.notes_method = 'fullText';
    }
  }
  
  /**
   * Extract mobility status using enhanced pattern matching
   * @param {string} text - FUNCTIONAL_STATUS section text
   * @param {Object} result - Result object to populate
   */
  extractMobilityStatus(text, result) {
    // Skip if already extracted with high confidence
    if (result.mobilityStatus && result.confidence.mobilityStatus > 0.7) {
      return;
    }
    
    // Try patterns from functionalPatterns
    for (const pattern of this.functionalPatterns.mobilityStatus) {
      const match = text.match(pattern.regex);
      if (match && match[1]) {
        result.mobilityStatus = match[1].trim();
        result.confidence.mobilityStatus = pattern.confidence;
        result.mobilityStatus_method = 'mobilityPattern';
        return;
      }
    }
    
    // If no match from patterns, extract sentences containing mobility keywords
    const sentences = text.split(/[.!?]\s+|(?=[.!?])/);
    const mobilitySentences = sentences.filter(sentence => 
      this.mobilityKeywords.some(keyword => 
        sentence.toLowerCase().includes(keyword)
      )
    );
    
    if (mobilitySentences.length > 0) {
      result.mobilityStatus = mobilitySentences.join('. ').trim();
      result.confidence.mobilityStatus = 0.6;
      result.mobilityStatus_method = 'keywordSearch';
    }
  }
  
  /**
   * Extract assistive devices information
   * @param {string} text - FUNCTIONAL_STATUS section text
   * @param {Object} result - Result object to populate
   */
  extractAssistiveDevices(text, result) {
    // Skip if already extracted with high confidence
    if (result.assistiveDevices && result.confidence.assistiveDevices > 0.7) {
      return;
    }
    
    // Try patterns from functionalPatterns
    for (const pattern of this.functionalPatterns.assistiveDevices) {
      const match = text.match(pattern.regex);
      if (match && match[1]) {
        result.assistiveDevices = match[1].trim();
        result.confidence.assistiveDevices = pattern.confidence;
        result.assistiveDevices_method = 'devicesPattern';
        return;
      }
    }
    
    // Look for sentences containing device keywords
    const sentences = text.split(/[.!?]\s+|(?=[.!?])/);
    const deviceSentences = sentences.filter(sentence => 
      this.deviceKeywords.some(keyword => 
        sentence.toLowerCase().includes(keyword)
      )
    );
    
    if (deviceSentences.length > 0) {
      result.assistiveDevices = deviceSentences.join('. ').trim();
      result.confidence.assistiveDevices = 0.6;
      result.assistiveDevices_method = 'deviceKeywords';
    }
  }
  
  /**
   * Extract transfer status information
   * @param {string} text - FUNCTIONAL_STATUS section text
   * @param {Object} result - Result object to populate
   */
  extractTransferStatus(text, result) {
    // Skip if already extracted with high confidence
    if (result.transferStatus && result.confidence.transferStatus > 0.7) {
      return;
    }
    
    // Try patterns from functionalPatterns
    for (const pattern of this.functionalPatterns.transferStatus) {
      const match = text.match(pattern.regex);
      if (match && match[1]) {
        result.transferStatus = match[1].trim();
        result.confidence.transferStatus = pattern.confidence;
        result.transferStatus_method = 'transferPattern';
        return;
      }
    }
    
    // Look for transfer-related content
    const transferKeywords = ['transfer', 'bed mobility', 'sit to stand', 'stand to sit', 
                            'chair to bed', 'bed to chair', 'toilet transfer'];
    
    const sentences = text.split(/[.!?]\s+|(?=[.!?])/);
    const transferSentences = sentences.filter(sentence => {
      const lowerSentence = sentence.toLowerCase();
      return transferKeywords.some(keyword => lowerSentence.includes(keyword));
    });
    
    if (transferSentences.length > 0) {
      result.transferStatus = transferSentences.join('. ').trim();
      result.confidence.transferStatus = 0.55;
      result.transferStatus_method = 'transferKeywords';
    }
  }
  
  /**
   * Extract functional limitations information
   * @param {string} text - FUNCTIONAL_STATUS section text
   * @param {Object} result - Result object to populate
   */
  extractFunctionalLimitations(text, result) {
    // Skip if already extracted with high confidence
    if (result.functionalLimitations && result.confidence.functionalLimitations > 0.7) {
      return;
    }
    
    // Try patterns from functionalPatterns
    for (const pattern of this.functionalPatterns.functionalLimitations) {
      const match = text.match(pattern.regex);
      if (match && match[1]) {
        result.functionalLimitations = match[1].trim();
        result.confidence.functionalLimitations = pattern.confidence;
        result.functionalLimitations_method = 'limitationsPattern';
        return;
      }
    }
    
    // Look for limitation-related content
    const limitationKeywords = ['limited', 'restriction', 'impaired', 'difficulty', 'unable', 
                              'challenged', 'deficit', 'problem', 'struggle', 'decreased'];
    
    const sentences = text.split(/[.!?]\s+|(?=[.!?])/);
    const limitationSentences = sentences.filter(sentence => {
      const lowerSentence = sentence.toLowerCase();
      return limitationKeywords.some(keyword => lowerSentence.includes(keyword));
    });
    
    if (limitationSentences.length > 0) {
      result.functionalLimitations = limitationSentences.join('. ').trim();
      result.confidence.functionalLimitations = 0.55;
      result.functionalLimitations_method = 'limitationKeywords';
    }
  }
  
  /**
   * Validate and refine functional status data
   * @param {Object} result - Result object to validate
   */
  validateFunctionalData(result) {
    // Cross-reference between mobility status and assistive devices
    if (result.assistiveDevices && result.mobilityStatus) {
      // Ensure mobility status mentions assistive devices if they're present
      const devices = result.assistiveDevices.toLowerCase();
      const mobility = result.mobilityStatus.toLowerCase();
      
      const commonDevices = this.deviceKeywords.filter(device => 
        devices.includes(device.toLowerCase())
      );
      
      // If devices are mentioned in assistiveDevices but not in mobilityStatus,
      // append this information
      if (commonDevices.length > 0 && !commonDevices.some(device => mobility.includes(device))) {
        if (typeof result.mobilityStatus === 'string') {
          result.mobilityStatus += ` Uses ${commonDevices.join(', ')}.`;
        }
      }
    }
    
    // Ensure safety information exists
    if (!result.safety) {
      // Extract safety info from text if possible
      for (const pattern of this.functionalPatterns.safety) {
        const textLower = (result.notes || '').toLowerCase();
        const match = textLower.match(pattern.regex);
        if (match && match[1]) {
          result.safety = match[1].trim();
          result.confidence.safety = pattern.confidence;
          result.safety_method = 'safetyPattern';
          break;
        }
      }
      
      // If still not found, use a default value with low confidence
      if (!result.safety) {
        result.safety = "Not specifically mentioned";
        result.confidence.safety = 0.3;
        result.safety_method = 'default';
      }
    }
  }
  
  /**
   * Check if text appears to be a FUNCTIONAL_STATUS section
   * @param {Object} result - Extraction result to validate
   * @returns {boolean} True if likely a FUNCTIONAL_STATUS section
   */
  isCorrectSectionType(result) {
    // FUNCTIONAL_STATUS sections should have notes with high confidence
    if (result.notes && result.confidence.notes > 0.7) {
      return true;
    }
    
    // Should have mobility or assistive device information with decent confidence
    if ((result.mobilityStatus && result.confidence.mobilityStatus > 0.6) ||
        (result.assistiveDevices && result.confidence.assistiveDevices > 0.6)) {
      return true;
    }
    
    // Require a minimum overall confidence
    return result.overallConfidence > 0.4;
  }
}

module.exports = FUNCTIONAL_STATUSExtractor;
