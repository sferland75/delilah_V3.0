// Activities of Daily Living (ADLs) Section Extractor
// Auto-generated on 2025-02-28
// Part of Delilah V3.0 PDF Import Pattern Recognition

class ADLSExtractor {
  /**
   * Extract ADLs data from text
   * @param {string} text - Section text content
   * @returns {Object} Extracted ADLs data
   */
  static extract(text) {
    const data = {
      selfCare: {
        bathing: this.extractCapabilityLevel(text, ['bath', 'shower', 'bathing', 'hygiene']),
        dressing: this.extractCapabilityLevel(text, ['dress', 'dressing', 'clothes']),
        toileting: this.extractCapabilityLevel(text, ['toilet', 'toileting', 'bathroom', 'commode']),
        feeding: this.extractCapabilityLevel(text, ['feed', 'feeding', 'eating', 'meal consumption']),
        grooming: this.extractCapabilityLevel(text, ['groom', 'grooming', 'hygiene', 'shaving', 'brushing teeth'])
      },
      mobility: {
        transfers: this.extractCapabilityLevel(text, ['transfer', 'bed mobility', 'sit to stand']),
        ambulation: this.extractCapabilityLevel(text, ['walk', 'ambulation', 'mobility', 'ambulate']),
        stairs: this.extractCapabilityLevel(text, ['stair', 'stairs', 'steps']),
        outdoorMobility: this.extractCapabilityLevel(text, ['outdoor', 'outside', 'community mobility'])
      },
      instrumental: {
        mealPrep: this.extractCapabilityLevel(text, ['meal preparation', 'cooking', 'prepare food']),
        housekeeping: this.extractCapabilityLevel(text, ['housekeeping', 'cleaning', 'chores', 'laundry']),
        shopping: this.extractCapabilityLevel(text, ['shop', 'shopping', 'grocery', 'purchase']),
        finances: this.extractCapabilityLevel(text, ['financ', 'money', 'banking', 'bills', 'budget']),
        medication: this.extractCapabilityLevel(text, ['medication', 'med', 'prescription', 'pill'])
      },
      summary: '',
      recommendations: [],
      adlNotes: '',
      confidence: {}
    };
    
    // Extract summary
    const summaryMatches = [
      ...text.matchAll(/(?:summary|overall\s+functional\s+status|functional\s+summary|conclusion)(?:\s*:|\s*-|\s*–|\s*\*)?\s*([^.]+(?:\.[^.]+){0,3})/gi)
    ];
    
    if (summaryMatches.length > 0) {
      data.summary = summaryMatches[0][1].trim();
      data.confidence.summary = 0.8;
    }
    
    // Extract recommendations
    const lines = text.split('\n');
    let inRecommendationsSection = false;
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      // Check if this line appears to start a recommendations list
      if (/(?:recommendations|suggested|recommended|advise)(?:\s*:|\s*-|\s*–|\s*\*)?/i.test(trimmedLine)) {
        inRecommendationsSection = true;
        return; // Skip this line as it's a header
      }
      
      // Check if we're in a recommendations section and this line has a bullet point or number
      if (inRecommendationsSection && /^\s*[•\-*\d.)\s]+/.test(trimmedLine)) {
        const recommendation = trimmedLine.replace(/^\s*[•\-*\d.)\s]+/, '').trim();
        
        if (recommendation.length > 0 && !data.recommendations.includes(recommendation)) {
          data.recommendations.push(recommendation);
        }
      }
      
      // Check if this line ends the recommendations section
      if (inRecommendationsSection && 
          (trimmedLine.length === 0 || 
           /(?:conclusion|assessment|summary)/i.test(trimmedLine))) {
        inRecommendationsSection = false;
      }
    });
    
    data.confidence.recommendations = data.recommendations.length > 0 ? 0.8 : 0;
    
    // Add confidence scores for each ADL category
    const confidenceCategories = ['selfCare', 'mobility', 'instrumental'];
    confidenceCategories.forEach(category => {
      data.confidence[category] = {};
      Object.keys(data[category]).forEach(adl => {
        // If we have a level or notes, we have some confidence
        if (data[category][adl].level !== 'unknown' || data[category][adl].notes.length > 0) {
          data.confidence[category][adl] = data[category][adl].level !== 'unknown' ? 0.8 : 0.5;
        } else {
          data.confidence[category][adl] = 0;
        }
      });
    });
    
    // Add the full text as ADL notes
    data.adlNotes = text;
    
    return data;
  }
  
  /**
   * Extract capability level for a specific ADL
   * @param {string} text - Full section text
   * @param {Array<string>} keywords - Keywords related to this ADL
   * @returns {Object} ADL capability level and notes
   */
  static extractCapabilityLevel(text, keywords) {
    const result = {
      level: 'unknown',
      notes: ''
    };
    
    // Create regex pattern to match ADL descriptions
    const keywordPattern = keywords.join('|');
    const regex = new RegExp(`(?:${keywordPattern})(?:[^.]*?)(?:\\b(independent|supervision|minimal assist|moderate assist|maximal assist|dependent|unable|requires assist|with assist|standby assist)\\b)`, 'i');
    
    // Match relevant sentences for this ADL
    const regex2 = new RegExp(`(?:[^.]*?(?:${keywordPattern})[^.]*?\\.){1,3}`, 'gi');
    const contextMatches = [...text.matchAll(regex2)];
    
    if (contextMatches.length > 0) {
      // Get the context around this ADL
      const adlContext = contextMatches[0][0];
      result.notes = adlContext.trim();
      
      // Try to determine the capability level
      const levelMatch = adlContext.match(regex);
      
      if (levelMatch) {
        const levelText = levelMatch[1].toLowerCase();
        
        // Map the matched text to standardized levels
        if (levelText.includes('independent')) {
          result.level = 'independent';
        } else if (levelText.includes('supervision') || levelText.includes('standby')) {
          result.level = 'supervision';
        } else if (levelText.includes('minimal')) {
          result.level = 'minimalAssist';
        } else if (levelText.includes('moderate')) {
          result.level = 'moderateAssist';
        } else if (levelText.includes('maximal')) {
          result.level = 'maximalAssist';
        } else if (levelText.includes('dependent') || levelText.includes('unable')) {
          result.level = 'dependent';
        } else if (levelText.includes('assist')) {
          // Generic assist - try to determine level
          if (adlContext.match(/\b(some|little|partial)\b/i)) {
            result.level = 'minimalAssist';
          } else if (adlContext.match(/\b(significant|substantial|considerable)\b/i)) {
            result.level = 'moderateAssist';
          } else {
            result.level = 'moderateAssist'; // Default if unspecified
          }
        }
      } else {
        // If no explicit level, try to infer from context
        if (adlContext.match(/\bindependent\b|\bable\b|\bwithout assistance\b|\bwithout help\b/i)) {
          result.level = 'independent';
        } else if (adlContext.match(/\bunable\b|\bcannot\b|\bcompletely dependent\b/i)) {
          result.level = 'dependent';
        } else if (adlContext.match(/\b(require|need)\s+(full|complete|total)\b/i)) {
          result.level = 'maximalAssist';
        }
      }
    }
    
    return result;
  }
}

module.exports = ADLSExtractor;
