// Helper functions for conversion and analysis

// Map independence level text to form value
export const mapIndependenceLevelToValue = (independenceText: string): string => {
  try {
    const text = independenceText.toLowerCase();
    
    if (text.includes('independent') && !text.includes('modified') && !text.includes('setup')) {
      return 'independent';
    }
    
    if (text.includes('modified independent') || 
        text.includes('uses device') || 
        text.includes('uses equipment') ||
        text.includes('with device') ||
        text.includes('with equipment') ||
        text.includes('with adaptation')) {
      return 'modified_independent';
    }
    
    if (text.includes('supervision') || text.includes('setup')) {
      return 'supervision';
    }
    
    if (text.includes('minimal assist') || 
        text.includes('minimal asst') || 
        text.includes('minimal help') ||
        text.includes('min. assist')) {
      return 'minimal_assistance';
    }
    
    if (text.includes('moderate assist') || 
        text.includes('moderate asst') || 
        text.includes('moderate help') ||
        text.includes('mod. assist')) {
      return 'moderate_assistance';
    }
    
    if (text.includes('maximal assist') || 
        text.includes('maximum assist') || 
        text.includes('max assist') ||
        text.includes('max. assist') ||
        text.includes('maximum help')) {
      return 'maximal_assistance';
    }
    
    if (text.includes('total assist') || 
        text.includes('dependent') || 
        text.includes('unable to perform') ||
        text.includes('complete assist')) {
      return 'total_assistance';
    }
    
    if (text.includes('not applicable') || 
        text.includes('n/a') || 
        text.includes('not assessed')) {
      return 'not_applicable';
    }
    
    // Default fallback based on text analysis
    if (text.includes('independent')) {
      return 'independent';
    } else if (text.includes('assist')) {
      return 'moderate_assistance';
    } else if (text.includes('unable')) {
      return 'total_assistance';
    }
    
    return 'not_applicable';
  } catch (error) {
    console.error("Error mapping independence level:", error);
    return 'not_applicable';
  }
};

// Extract notes from the independence level text
export const extractNotesFromIndependenceText = (independenceText: string): string => {
  try {
    // Find common patterns that indicate notes
    const patterns = [
      { regex: /independent\s+(in|with|for)\s+(.*?)(\.|$)/i, group: 2 },
      { regex: /independent\.(.*?)(\.|$)/i, group: 1 },
      { regex: /assistance\s+(in|with|for)\s+(.*?)(\.|$)/i, group: 2 },
      { regex: /assistance\.(.*?)(\.|$)/i, group: 1 },
      { regex: /:\s*(.*?)(\.|$)/i, group: 1 },
      { regex: /-\s*(.*?)(\.|$)/i, group: 1 }
    ];
    
    for (const pattern of patterns) {
      const match = independenceText.match(pattern.regex);
      if (match && match[pattern.group].trim()) {
        return match[pattern.group].trim();
      }
    }
    
    // If no pattern matches, return the full text
    return independenceText;
  } catch (error) {
    console.error("Error extracting notes:", error);
    return independenceText;
  }
};

// Determine independence level from descriptive text
export const determineIndependenceFromText = (text: string): string => {
  try {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('unable') || 
        lowerText.includes('cannot') || 
        lowerText.includes('not able') ||
        lowerText.includes('no longer able')) {
      return 'total_assistance';
    }
    
    if (lowerText.includes('difficult') || 
        lowerText.includes('challenge') || 
        lowerText.includes('struggle') ||
        lowerText.includes('hard')) {
      return 'moderate_assistance';
    }
    
    if (lowerText.includes('with help') || 
        lowerText.includes('assistance') || 
        lowerText.includes('assist')) {
      return 'minimal_assistance';
    }
    
    if (lowerText.includes('modified') || 
        lowerText.includes('adaptation') || 
        lowerText.includes('adapted')) {
      return 'modified_independent';
    }
    
    if (lowerText.includes('independent') || 
        lowerText.includes('able to') || 
        lowerText.includes('can do')) {
      return 'independent';
    }
    
    // Default based on general sentiment analysis
    if (lowerText.includes('good') || 
        lowerText.includes('well') || 
        lowerText.includes('fine') ||
        lowerText.includes('enjoy') ||
        lowerText.includes('regular')) {
      return 'independent';
    }
    
    if (lowerText.includes('limited') || 
        lowerText.includes('restrict') || 
        lowerText.includes('reduced')) {
      return 'minimal_assistance';
    }
    
    return 'not_applicable';
  } catch (error) {
    console.error("Error determining independence from text:", error);
    return 'not_applicable';
  }
};

// Extract entertainment information from hobbies text
export const extractEntertainmentFromHobbies = (hobbiesText: string): string => {
  try {
    const entertainmentKeywords = ['movie', 'tv', 'television', 'show', 'concert', 'theater', 'theatre', 'performance', 'streaming', 'watch'];
    
    const sentences = hobbiesText.split(/[.!?]+/);
    const relevantSentences = sentences.filter(sentence => 
      entertainmentKeywords.some(keyword => 
        sentence.toLowerCase().includes(keyword)
      )
    );
    
    if (relevantSentences.length > 0) {
      return relevantSentences.join('. ') + '.';
    }
    
    return "Entertainment-related aspects not specifically described.";
  } catch (error) {
    console.error("Error extracting entertainment info:", error);
    return hobbiesText;
  }
};

// Extract sleep information from health management text
export const extractSleepInfoFromText = (healthText: string): string => {
  try {
    const sleepKeywords = ['sleep', 'insomnia', 'rest', 'fatigue', 'tired', 'bed', 'night'];
    
    const sentences = healthText.split(/[.!?]+/);
    const relevantSentences = sentences.filter(sentence => 
      sleepKeywords.some(keyword => 
        sentence.toLowerCase().includes(keyword)
      )
    );
    
    if (relevantSentences.length > 0) {
      return relevantSentences.join('. ') + '.';
    }
    
    return "Sleep aspects not specifically described.";
  } catch (error) {
    console.error("Error extracting sleep info:", error);
    return healthText;
  }
};

// Helper function to get status and notes for a given ADL category and item
export const getStatusAndNotesForADL = (category: any, item: string): string => {
  try {
    if (category && category[item] && category[item].independence) {
      const notes = category[item].notes || 'No specific observations';
      return `${category[item].independence} - ${notes}`;
    }
    return "Not assessed";
  } catch (error) {
    console.error(`Error getting status for ${item}:`, error);
    return "Not assessed";
  }
};
