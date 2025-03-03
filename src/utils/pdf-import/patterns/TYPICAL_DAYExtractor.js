/**
 * TYPICAL_DAYExtractor.js
 * 
 * Specialized extractor for the TYPICAL_DAY section with enhanced pattern recognition
 * based on statistical analysis of successful extractions.
 */

const BaseExtractor = require('./BaseExtractor');

class TYPICAL_DAYExtractor extends BaseExtractor {
  constructor() {
    super('TYPICAL_DAY');
    
    // Additional patterns specific to TYPICAL_DAY section
    this.routinePatterns = {
      morningRoutine: [
        { regex: /(?:morning routine|morning activities|morning schedule)(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.85 },
        { regex: /(?:in the morning|mornings?),? (?:the client|patient|he|she|they) (.*?)(?:\.|\n|$)/i, confidence: 0.8 },
        { regex: /(?:wakes up|gets up|starts the day) (.*?)(?:\.|\n|$)/i, confidence: 0.75 }
      ],
      afternoonRoutine: [
        { regex: /(?:afternoon routine|afternoon activities|afternoon schedule|midday)(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.85 },
        { regex: /(?:in the afternoon|afternoons?),? (?:the client|patient|he|she|they) (.*?)(?:\.|\n|$)/i, confidence: 0.8 },
        { regex: /(?:after lunch|midday|noon) (.*?)(?:\.|\n|$)/i, confidence: 0.75 }
      ],
      eveningRoutine: [
        { regex: /(?:evening routine|evening activities|evening schedule)(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.85 },
        { regex: /(?:in the evening|evenings?),? (?:the client|patient|he|she|they) (.*?)(?:\.|\n|$)/i, confidence: 0.8 },
        { regex: /(?:after dinner|before bed) (.*?)(?:\.|\n|$)/i, confidence: 0.75 }
      ],
      nightRoutine: [
        { regex: /(?:night routine|night activities|night schedule|bedtime routine)(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.85 },
        { regex: /(?:at night|nights?),? (?:the client|patient|he|she|they) (.*?)(?:\.|\n|$)/i, confidence: 0.8 },
        { regex: /(?:goes to bed|prepares for sleep|before sleeping) (.*?)(?:\.|\n|$)/i, confidence: 0.75 }
      ],
      dailyActivities: [
        { regex: /(?:daily activities|daily routine|daily schedule|daily tasks)(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.85 },
        { regex: /(?:every day|daily),? (?:the client|patient|he|she|they) (.*?)(?:\.|\n|$)/i, confidence: 0.8 },
        { regex: /(?:regular activities|routine activities) include (.*?)(?:\.|\n|$)/i, confidence: 0.75 }
      ],
      weeklyActivities: [
        { regex: /(?:weekly activities|weekly routine|weekly schedule)(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.85 },
        { regex: /(?:during the week|weekly),? (?:the client|patient|he|she|they) (.*?)(?:\.|\n|$)/i, confidence: 0.8 },
        { regex: /(?:once a week|several times a week) (.*?)(?:\.|\n|$)/i, confidence: 0.75 }
      ],
      leisureActivities: [
        { regex: /(?:leisure activities|recreational activities|hobbies|interests)(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.85 },
        { regex: /(?:enjoys|likes|prefers|engages in) (.*?)(?:\.|\n|$)/i, confidence: 0.7 },
        { regex: /(?:for fun|for enjoyment|for recreation) (.*?)(?:\.|\n|$)/i, confidence: 0.7 }
      ]
    };
    
    // Time-of-day indicators for routine identification
    this.timeIndicators = {
      morning: ['morning', 'breakfast', 'wake', 'awake', 'AM', 'early', '6am', '7am', '8am', '9am', '10am', '11am'],
      afternoon: ['afternoon', 'lunch', 'midday', 'noon', '12pm', '1pm', '2pm', '3pm', '4pm'],
      evening: ['evening', 'dinner', 'supper', 'late afternoon', '5pm', '6pm', '7pm', '8pm'],
      night: ['night', 'bedtime', 'sleep', 'bed', 'late', '9pm', '10pm', '11pm', 'midnight']
    };
    
    // Activity keywords for pattern matching
    this.activityKeywords = [
      'eat', 'eating', 'meal', 'meals', 'breakfast', 'lunch', 'dinner', 'snack',
      'dress', 'dressing', 'clothes', 'bath', 'bathing', 'shower', 'hygiene',
      'toilet', 'toileting', 'bathroom', 'groom', 'grooming', 'hair', 'teeth',
      'work', 'working', 'job', 'employment', 'school', 'class', 'study',
      'exercise', 'walk', 'walking', 'workout', 'therapy', 'medication', 'meds',
      'clean', 'cleaning', 'housework', 'chores', 'cook', 'cooking', 'prepare',
      'preparation', 'shop', 'shopping', 'errands', 'appointment', 'visit',
      'TV', 'television', 'watch', 'watching', 'read', 'reading', 'computer',
      'internet', 'phone', 'social', 'socialize', 'socializing', 'family',
      'friend', 'friends', 'nap', 'napping', 'rest', 'sleep', 'sleeping'
    ];
  }
  
  /**
   * Extract data from TYPICAL_DAY section text using enhanced pattern recognition
   * @param {string} text - TYPICAL_DAY section text
   * @param {Object} allSections - All sections in the document
   * @returns {Object} Extracted data with confidence scores
   */
  extract(text, allSections = {}) {
    // Use base extractor first
    const result = super.extract(text, allSections);
    
    // Additional extraction techniques specific to TYPICAL_DAY
    this.extractRoutineNotes(text, result);
    this.extractTimeBasedRoutines(text, result);
    this.extractActivityBasedRoutines(text, result);
    
    // Apply TYPICAL_DAY-specific validations
    this.validateRoutineData(result);
    
    return result;
  }
  
  /**
   * Extract routine notes (general information about daily routines)
   * @param {string} text - TYPICAL_DAY section text
   * @param {Object} result - Result object to populate
   */
  extractRoutineNotes(text, result) {
    // If not already extracted, use entire text as routine notes
    if (!result.routineNotes) {
      result.routineNotes = text.trim();
      result.confidence.routineNotes = 0.9;
      result.routineNotes_method = 'fullText';
    }
  }
  
  /**
   * Extract time-based routines using pattern matching
   * @param {string} text - TYPICAL_DAY section text
   * @param {Object} result - Result object to populate
   */
  extractTimeBasedRoutines(text, result) {
    // Extract morning routine if not already extracted with high confidence
    if (!result.morningRoutine || result.confidence.morningRoutine < 0.7) {
      this.extractSpecificRoutine(text, result, 'morningRoutine', this.routinePatterns.morningRoutine, this.timeIndicators.morning);
    }
    
    // Extract afternoon routine if not already extracted with high confidence
    if (!result.afternoonRoutine || result.confidence.afternoonRoutine < 0.7) {
      this.extractSpecificRoutine(text, result, 'afternoonRoutine', this.routinePatterns.afternoonRoutine, this.timeIndicators.afternoon);
    }
    
    // Extract evening routine if not already extracted with high confidence
    if (!result.eveningRoutine || result.confidence.eveningRoutine < 0.7) {
      this.extractSpecificRoutine(text, result, 'eveningRoutine', this.routinePatterns.eveningRoutine, this.timeIndicators.evening);
    }
    
    // Extract night routine if not already extracted with high confidence
    if (!result.nightRoutine || result.confidence.nightRoutine < 0.7) {
      this.extractSpecificRoutine(text, result, 'nightRoutine', this.routinePatterns.nightRoutine, this.timeIndicators.night);
    }
  }
  
  /**
   * Extract a specific time-based routine
   * @param {string} text - TYPICAL_DAY section text
   * @param {Object} result - Result object to populate
   * @param {string} routineField - Field name for the routine
   * @param {Array} patterns - Regex patterns for this routine
   * @param {Array} timeIndicators - Time-related keywords for this routine
   */
  extractSpecificRoutine(text, result, routineField, patterns, timeIndicators) {
    // Try patterns first
    for (const pattern of patterns) {
      const match = text.match(pattern.regex);
      if (match && match[1]) {
        result[routineField] = match[1].trim();
        result.confidence[routineField] = pattern.confidence;
        result[`${routineField}_method`] = 'routinePattern';
        return;
      }
    }
    
    // If no direct pattern match, extract sentences containing time indicators
    const sentences = text.split(/[.!?]\s+|(?=[.!?])/);
    const timeRelatedSentences = sentences.filter(sentence => {
      const lowerSentence = sentence.toLowerCase();
      return timeIndicators.some(indicator => lowerSentence.includes(indicator.toLowerCase()));
    });
    
    if (timeRelatedSentences.length > 0) {
      // Filter for sentences that also contain activity keywords
      const activitySentences = timeRelatedSentences.filter(sentence => {
        const lowerSentence = sentence.toLowerCase();
        return this.activityKeywords.some(activity => lowerSentence.includes(activity.toLowerCase()));
      });
      
      // If we found sentences with both time and activity, use those
      // Otherwise fall back to just time-related sentences
      const relevantSentences = activitySentences.length > 0 ? activitySentences : timeRelatedSentences;
      
      result[routineField] = relevantSentences.join('. ').trim();
      result.confidence[routineField] = 0.6;
      result[`${routineField}_method`] = 'timeKeywords';
    }
  }
  
  /**
   * Extract activity-based routines
   * @param {string} text - TYPICAL_DAY section text
   * @param {Object} result - Result object to populate
   */
  extractActivityBasedRoutines(text, result) {
    // Extract daily activities if not already extracted with high confidence
    if (!result.dailyActivities || result.confidence.dailyActivities < 0.7) {
      // Try patterns from routinePatterns
      for (const pattern of this.routinePatterns.dailyActivities) {
        const match = text.match(pattern.regex);
        if (match && match[1]) {
          result.dailyActivities = match[1].trim();
          result.confidence.dailyActivities = pattern.confidence;
          result.dailyActivities_method = 'dailyPattern';
          break;
        }
      }
      
      // If no match, look for sentences containing daily indicators
      if (!result.dailyActivities) {
        const dailyIndicators = ['every day', 'daily', 'each day', 'regularly', 'routine', 'always'];
        
        const sentences = text.split(/[.!?]\s+|(?=[.!?])/);
        const dailySentences = sentences.filter(sentence => {
          const lowerSentence = sentence.toLowerCase();
          return dailyIndicators.some(indicator => lowerSentence.includes(indicator));
        });
        
        if (dailySentences.length > 0) {
          result.dailyActivities = dailySentences.join('. ').trim();
          result.confidence.dailyActivities = 0.5;
          result.dailyActivities_method = 'dailyKeywords';
        }
      }
    }
    
    // Extract weekly activities
    if (!result.weeklyActivities || result.confidence.weeklyActivities < 0.7) {
      // Try patterns from routinePatterns
      for (const pattern of this.routinePatterns.weeklyActivities) {
        const match = text.match(pattern.regex);
        if (match && match[1]) {
          result.weeklyActivities = match[1].trim();
          result.confidence.weeklyActivities = pattern.confidence;
          result.weeklyActivities_method = 'weeklyPattern';
          break;
        }
      }
      
      // If no match, look for sentences containing weekly indicators
      if (!result.weeklyActivities) {
        const weeklyIndicators = ['weekly', 'each week', 'every week', 'once a week', 'twice a week'];
        
        const sentences = text.split(/[.!?]\s+|(?=[.!?])/);
        const weeklySentences = sentences.filter(sentence => {
          const lowerSentence = sentence.toLowerCase();
          return weeklyIndicators.some(indicator => lowerSentence.includes(indicator));
        });
        
        if (weeklySentences.length > 0) {
          result.weeklyActivities = weeklySentences.join('. ').trim();
          result.confidence.weeklyActivities = 0.5;
          result.weeklyActivities_method = 'weeklyKeywords';
        }
      }
    }
    
    // Extract leisure activities
    if (!result.leisureActivities || result.confidence.leisureActivities < 0.7) {
      // Try patterns from routinePatterns
      for (const pattern of this.routinePatterns.leisureActivities) {
        const match = text.match(pattern.regex);
        if (match && match[1]) {
          result.leisureActivities = match[1].trim();
          result.confidence.leisureActivities = pattern.confidence;
          result.leisureActivities_method = 'leisurePattern';
          break;
        }
      }
      
      // If no match, look for sentences containing leisure indicators
      if (!result.leisureActivities) {
        const leisureIndicators = ['hobby', 'hobbies', 'leisure', 'enjoy', 'enjoys', 'fun', 'recreation', 'interest', 'interests', 'pastime'];
        
        const sentences = text.split(/[.!?]\s+|(?=[.!?])/);
        const leisureSentences = sentences.filter(sentence => {
          const lowerSentence = sentence.toLowerCase();
          return leisureIndicators.some(indicator => lowerSentence.includes(indicator));
        });
        
        if (leisureSentences.length > 0) {
          result.leisureActivities = leisureSentences.join('. ').trim();
          result.confidence.leisureActivities = 0.5;
          result.leisureActivities_method = 'leisureKeywords';
        }
      }
    }
  }
  
  /**
   * Validate and refine routine data
   * @param {Object} result - Result object to validate
   */
  validateRoutineData(result) {
    // Ensure we have at least one time-based routine
    const hasTimeBasedRoutine = result.morningRoutine || result.afternoonRoutine || 
                              result.eveningRoutine || result.nightRoutine;
    
    if (!hasTimeBasedRoutine && result.routineNotes) {
      // Try to extract time-based routines from general notes
      const text = result.routineNotes;
      
      // Check for morning routine indicators
      if (!result.morningRoutine) {
        const morningIndicators = this.timeIndicators.morning;
        const sentences = text.split(/[.!?]\s+|(?=[.!?])/);
        const morningSentences = sentences.filter(sentence => {
          const lowerSentence = sentence.toLowerCase();
          return morningIndicators.some(indicator => lowerSentence.includes(indicator.toLowerCase()));
        });
        
        if (morningSentences.length > 0) {
          result.morningRoutine = morningSentences.join('. ').trim();
          result.confidence.morningRoutine = 0.4;
          result.morningRoutine_method = 'inferenceFromNotes';
        }
      }
      
      // Similar checks for afternoon, evening, and night routines would go here
    }
    
    // Cross-reference between time-based routines for consistency
    // For example, if morning routine mentions breakfast but afternoon routine
    // mentions having breakfast, there's an inconsistency
    if (result.morningRoutine && result.afternoonRoutine) {
      const morning = result.morningRoutine.toLowerCase();
      const afternoon = result.afternoonRoutine.toLowerCase();
      
      // Check for breakfast in afternoon
      if (afternoon.includes('breakfast') && !morning.includes('breakfast')) {
        // This is likely an inconsistency - breakfast should be in morning
        // We could adjust the routines here, but for simplicity let's just log it
        console.log('Potential inconsistency: breakfast mentioned in afternoon but not morning');
      }
    }
    
    // Similar cross-references could be done for other time periods
  }
  
  /**
   * Check if text appears to be a TYPICAL_DAY section
   * @param {Object} result - Extraction result to validate
   * @returns {boolean} True if likely a TYPICAL_DAY section
   */
  isCorrectSectionType(result) {
    // TYPICAL_DAY sections should have routine notes with high confidence
    if (result.routineNotes && result.confidence.routineNotes > 0.7) {
      return true;
    }
    
    // TYPICAL_DAY sections should have at least one time-based routine
    if ((result.morningRoutine && result.confidence.morningRoutine > 0.6) ||
        (result.afternoonRoutine && result.confidence.afternoonRoutine > 0.6) ||
        (result.eveningRoutine && result.confidence.eveningRoutine > 0.6) ||
        (result.nightRoutine && result.confidence.nightRoutine > 0.6)) {
      return true;
    }
    
    // Require a minimum overall confidence
    return result.overallConfidence > 0.4;
  }
}

module.exports = TYPICAL_DAYExtractor;
