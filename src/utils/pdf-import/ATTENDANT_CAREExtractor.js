// Attendant Care Section Extractor
// Auto-generated on 2025-02-28
// Part of Delilah V3.0 PDF Import Pattern Recognition

class ATTENDANT_CAREExtractor {
  /**
   * Extract attendant care data from text
   * @param {string} text - Section text content
   * @returns {Object} Extracted attendant care data
   */
  static extract(text) {
    const data = {
      caregiverInfo: {
        type: '',
        name: '',
        relationship: '',
        availability: ''
      },
      careNeeds: {
        personalCare: [],
        housekeeping: [],
        mealPrep: [],
        medication: [],
        mobility: [],
        supervision: []
      },
      careHours: {
        daily: '',
        weekly: '',
        breakdown: {}
      },
      recommendations: [],
      currentServices: [],
      notes: '',
      confidence: {}
    };
    
    // Extract caregiver information
    const caregiverTypeMatches = [
      ...text.matchAll(/(?:caregiver|care\s+provider|attendant|support\s+person|personal\s+support\s+worker|PSW)(?:\s+type)?(?:\s*:|\s*-|\s*–|\s*\*)?\s*([^.]+)/gi)
    ];
    
    if (caregiverTypeMatches.length > 0) {
      data.caregiverInfo.type = caregiverTypeMatches[0][1].trim();
      data.confidence.caregiverType = 0.8;
    }
    
    const caregiverNameMatches = [
      ...text.matchAll(/(?:caregiver|care\s+provider|attendant|PSW)(?:'s)?\s+name(?:\s*:|\s*-|\s*–|\s*\*)?\s*([^.]+)/gi)
    ];
    
    if (caregiverNameMatches.length > 0) {
      data.caregiverInfo.name = caregiverNameMatches[0][1].trim();
      data.confidence.caregiverName = 0.8;
    }
    
    const relationshipMatches = [
      ...text.matchAll(/(?:relationship|relation|related|family\s+member)(?:\s*:|\s*-|\s*–|\s*\*)?\s*([^.]+)/gi)
    ];
    
    if (relationshipMatches.length > 0) {
      data.caregiverInfo.relationship = relationshipMatches[0][1].trim();
      data.confidence.relationship = 0.8;
    }
    
    const availabilityMatches = [
      ...text.matchAll(/(?:availability|available|schedule|hours)(?:\s*:|\s*-|\s*–|\s*\*)?\s*([^.]+)/gi)
    ];
    
    if (availabilityMatches.length > 0) {
      data.caregiverInfo.availability = availabilityMatches[0][1].trim();
      data.confidence.availability = 0.8;
    }
    
    // Extract care needs by category
    
    // Personal Care
    const extractCategoryNeeds = (category, keywords) => {
      const lines = text.split('\n');
      let inCategoryList = false;
      const categoryNeeds = [];
      
      // Look for section headers
      lines.forEach(line => {
        const trimmedLine = line.trim();
        
        // Check if this line appears to start a category list
        if (keywords.some(keyword => 
            new RegExp(`(?:${keyword})(?:\\s*:|-|–|\\*)?`, 'i').test(trimmedLine))) {
          inCategoryList = true;
          return; // Skip this line as it's a header
        }
        
        // Check if we're in a category list and this line has content
        if (inCategoryList && trimmedLine.length > 0) {
          // Remove bullet points or numbers
          const cleanLine = trimmedLine.replace(/^\s*[•\-*\d.)\s]+/, '').trim();
          
          if (cleanLine.length > 0 && !categoryNeeds.includes(cleanLine)) {
            categoryNeeds.push(cleanLine);
          }
        }
        
        // Check if this line ends the category list
        if (inCategoryList && 
            (trimmedLine.length === 0 || 
             /(?:housekeeping|meal|medication|mobility|supervision|assessment|recommendation)/i.test(trimmedLine) && 
             !keywords.some(keyword => trimmedLine.toLowerCase().includes(keyword.toLowerCase())))) {
          inCategoryList = false;
        }
      });
      
      // If we didn't find any explicit lists, try to infer from keywords
      if (categoryNeeds.length === 0) {
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
        
        sentences.forEach(sentence => {
          const lowerSentence = sentence.toLowerCase();
          
          if (keywords.some(keyword => lowerSentence.includes(keyword.toLowerCase())) && 
              (lowerSentence.includes('assist') || 
               lowerSentence.includes('help') || 
               lowerSentence.includes('support') || 
               lowerSentence.includes('need') || 
               lowerSentence.includes('require'))) {
            
            if (!categoryNeeds.includes(sentence.trim()) && sentence.length < 200) {
              categoryNeeds.push(sentence.trim());
            }
          }
        });
      }
      
      return categoryNeeds;
    };
    
    // Extract needs for each category
    data.careNeeds.personalCare = extractCategoryNeeds('personalCare', [
      'personal care', 'bathing', 'showering', 'dressing', 'grooming', 'toileting', 'hygiene'
    ]);
    data.confidence.personalCare = data.careNeeds.personalCare.length > 0 ? 0.8 : 0;
    
    data.careNeeds.housekeeping = extractCategoryNeeds('housekeeping', [
      'housekeeping', 'cleaning', 'laundry', 'chores', 'household tasks'
    ]);
    data.confidence.housekeeping = data.careNeeds.housekeeping.length > 0 ? 0.8 : 0;
    
    data.careNeeds.mealPrep = extractCategoryNeeds('mealPrep', [
      'meal preparation', 'meal prep', 'cooking', 'food preparation', 'meals'
    ]);
    data.confidence.mealPrep = data.careNeeds.mealPrep.length > 0 ? 0.8 : 0;
    
    data.careNeeds.medication = extractCategoryNeeds('medication', [
      'medication', 'medicine', 'prescription', 'pills', 'drug'
    ]);
    data.confidence.medication = data.careNeeds.medication.length > 0 ? 0.8 : 0;
    
    data.careNeeds.mobility = extractCategoryNeeds('mobility', [
      'mobility assistance', 'transfers', 'walking', 'ambulation', 'repositioning'
    ]);
    data.confidence.mobility = data.careNeeds.mobility.length > 0 ? 0.8 : 0;
    
    data.careNeeds.supervision = extractCategoryNeeds('supervision', [
      'supervision', 'monitoring', 'cueing', 'reminders', 'safety supervision'
    ]);
    data.confidence.supervision = data.careNeeds.supervision.length > 0 ? 0.8 : 0;
    
    // Extract care hours
    const dailyHoursMatches = [
      ...text.matchAll(/(?:daily\s+hours|hours\s+per\s+day|hours\/day|hours\s+a\s+day)(?:\s*:|\s*-|\s*–|\s*\*)?\s*([^.]+)/gi),
      ...text.matchAll(/(\d+(?:\.\d+)?)\s*hours?\s+(?:per|a|each)\s+day/gi)
    ];
    
    if (dailyHoursMatches.length > 0) {
      data.careHours.daily = dailyHoursMatches[0][1] ? dailyHoursMatches[0][1].trim() : dailyHoursMatches[0][0].trim();
      data.confidence.dailyHours = 0.8;
    }
    
    const weeklyHoursMatches = [
      ...text.matchAll(/(?:weekly\s+hours|hours\s+per\s+week|hours\/week|hours\s+a\s+week)(?:\s*:|\s*-|\s*–|\s*\*)?\s*([^.]+)/gi),
      ...text.matchAll(/(\d+(?:\.\d+)?)\s*hours?\s+(?:per|a|each)\s+week/gi)
    ];
    
    if (weeklyHoursMatches.length > 0) {
      data.careHours.weekly = weeklyHoursMatches[0][1] ? weeklyHoursMatches[0][1].trim() : weeklyHoursMatches[0][0].trim();
      data.confidence.weeklyHours = 0.8;
    }
    
    // Extract hour breakdowns
    const breakdownKeywords = [
      { key: 'morning', patterns: ['morning', 'am', 'a.m'] },
      { key: 'afternoon', patterns: ['afternoon', 'noon', 'midday'] },
      { key: 'evening', patterns: ['evening', 'pm', 'p.m', 'dinner'] },
      { key: 'night', patterns: ['night', 'overnight', 'sleep'] },
      { key: 'weekday', patterns: ['weekday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'] },
      { key: 'weekend', patterns: ['weekend', 'saturday', 'sunday'] }
    ];
    
    breakdownKeywords.forEach(item => {
      const patterns = item.patterns.map(p => `(?:${p})`).join('|');
      const regex = new RegExp(`(?:${patterns})(?:[^.]*?)(?:\\d+(?:\\.\\d+)?\\s*hours?)`, 'i');
      
      if (regex.test(text)) {
        const matches = [...text.matchAll(new RegExp(`(?:${patterns})(?:[^.]*?)(\\d+(?:\\.\\d+)?)\\s*hours?`, 'gi'))];
        if (matches.length > 0) {
          data.careHours.breakdown[item.key] = `${matches[0][1]} hours`;
        }
      }
    });
    
    // Extract recommendations
    const lines = text.split('\n');
    let inRecommendationsList = false;
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      // Check if this line appears to start a recommendations list
      if (/(?:recommendations?|recommend|suggested|proposed)(?:\s*:|\s*-|\s*–|\s*\*)?/i.test(trimmedLine)) {
        inRecommendationsList = true;
        return; // Skip this line as it's a header
      }
      
      // Check if we're in a recommendations list and this line has content
      if (inRecommendationsList && trimmedLine.length > 0) {
        // Remove bullet points or numbers
        const cleanLine = trimmedLine.replace(/^\s*[•\-*\d.)\s]+/, '').trim();
        
        if (cleanLine.length > 0 && !data.recommendations.includes(cleanLine)) {
          data.recommendations.push(cleanLine);
        }
      }
      
      // Check if this line ends the recommendations list
      if (inRecommendationsList && 
          (trimmedLine.length === 0 || 
           /(?:assessment|conclusion|summary|service)/i.test(trimmedLine))) {
        inRecommendationsList = false;
      }
    });
    
    data.confidence.recommendations = data.recommendations.length > 0 ? 0.8 : 0;
    
    // Extract current services
    let inServicesList = false;
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      // Check if this line appears to start a services list
      if (/(?:current\s+services|existing\s+services|services\s+in\s+place|receiving|supports)(?:\s*:|\s*-|\s*–|\s*\*)?/i.test(trimmedLine)) {
        inServicesList = true;
        return; // Skip this line as it's a header
      }
      
      // Check if we're in a services list and this line has content
      if (inServicesList && trimmedLine.length > 0) {
        // Remove bullet points or numbers
        const cleanLine = trimmedLine.replace(/^\s*[•\-*\d.)\s]+/, '').trim();
        
        if (cleanLine.length > 0 && !data.currentServices.includes(cleanLine)) {
          data.currentServices.push(cleanLine);
        }
      }
      
      // Check if this line ends the services list
      if (inServicesList && 
          (trimmedLine.length === 0 || 
           /(?:assessment|conclusion|summary|recommendation)/i.test(trimmedLine))) {
        inServicesList = false;
      }
    });
    
    data.confidence.currentServices = data.currentServices.length > 0 ? 0.8 : 0;
    
    // Add the full text as notes
    data.notes = text;
    
    return data;
  }
}

module.exports = ATTENDANT_CAREExtractor;
