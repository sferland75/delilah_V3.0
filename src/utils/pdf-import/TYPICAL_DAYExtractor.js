// Typical Day Section Extractor
// Auto-generated on 2025-02-28
// Part of Delilah V3.0 PDF Import Pattern Recognition

class TYPICAL_DAYExtractor {
  /**
   * Extract typical day data from text
   * @param {string} text - Section text content
   * @returns {Object} Extracted typical day data
   */
  static extract(text) {
    const data = {
      morningRoutine: [],
      afternoonRoutine: [],
      eveningRoutine: [],
      nightRoutine: [],
      dailyActivities: [],
      weeklyActivities: [],
      leisureActivities: [],
      routineNotes: '',
      confidence: {}
    };
    
    // Extract routines by time of day
    const lines = text.split('\n');
    let currentSection = null;
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      // Skip empty lines
      if (trimmedLine.length === 0) {
        return;
      }
      
      // Check if this line indicates a time of day
      if (/(?:morning|a\.m\.|am)(?:\s*:|\s*-|\s*–|\s*\*)?/i.test(trimmedLine) && 
          !trimmedLine.toLowerCase().includes('afternoon') && 
          !trimmedLine.toLowerCase().includes('evening')) {
        currentSection = 'morning';
      } else if (/(?:afternoon|noon|midday|lunch)(?:\s*:|\s*-|\s*–|\s*\*)?/i.test(trimmedLine)) {
        currentSection = 'afternoon';
      } else if (/(?:evening|dinner|p\.m\.|pm)(?:\s*:|\s*-|\s*–|\s*\*)?/i.test(trimmedLine) && 
                !trimmedLine.toLowerCase().includes('morning') && 
                !trimmedLine.toLowerCase().includes('afternoon')) {
        currentSection = 'evening';
      } else if (/(?:night|bedtime|sleep|before\s+bed)(?:\s*:|\s*-|\s*–|\s*\*)?/i.test(trimmedLine)) {
        currentSection = 'night';
      }
      
      // Add line to appropriate section if it doesn't look like a header
      if (currentSection && 
          line.length > 5 && 
          !/^(?:morning|afternoon|evening|night|routine|schedule|activities)(?:\s*:|\s*-|\s*–|\s*\*)?$/i.test(trimmedLine)) {
        
        // Remove bullet points or numbers
        const cleanLine = trimmedLine.replace(/^\s*[•\-*\d.)\s]+/, '').trim();
        
        if (cleanLine.length > 0) {
          if (currentSection === 'morning' && !data.morningRoutine.includes(cleanLine)) {
            data.morningRoutine.push(cleanLine);
          } else if (currentSection === 'afternoon' && !data.afternoonRoutine.includes(cleanLine)) {
            data.afternoonRoutine.push(cleanLine);
          } else if (currentSection === 'evening' && !data.eveningRoutine.includes(cleanLine)) {
            data.eveningRoutine.push(cleanLine);
          } else if (currentSection === 'night' && !data.nightRoutine.includes(cleanLine)) {
            data.nightRoutine.push(cleanLine);
          }
        }
      }
    });
    
    // Add confidence scores based on extraction
    data.confidence.morningRoutine = data.morningRoutine.length > 0 ? 0.8 : 0;
    data.confidence.afternoonRoutine = data.afternoonRoutine.length > 0 ? 0.8 : 0;
    data.confidence.eveningRoutine = data.eveningRoutine.length > 0 ? 0.8 : 0;
    data.confidence.nightRoutine = data.nightRoutine.length > 0 ? 0.8 : 0;
    
    // If we didn't get anything structured by time, try a different approach
    if (data.morningRoutine.length === 0 && 
        data.afternoonRoutine.length === 0 && 
        data.eveningRoutine.length === 0 && 
        data.nightRoutine.length === 0) {
      
      // Look for time-based patterns
      const timePatterns = [
        /\b\d{1,2}[\s:-]*(?:am|a\.m\.|AM|A\.M\.)\b/,
        /\b\d{1,2}[\s:-]*(?:pm|p\.m\.|PM|P\.M\.)\b/,
        /\b\d{1,2}[\s:-]\d{2}\b/
      ];
      
      // Extract lines with time markers
      lines.forEach(line => {
        const trimmedLine = line.trim();
        
        if (timePatterns.some(pattern => pattern.test(trimmedLine))) {
          // Determine time of day if possible
          const lowerLine = trimmedLine.toLowerCase();
          let timeOfDay = 'dailyActivities';
          
          if (/\b(?:[5-9]|1[0-1])[\s:-]*(?:am|a\.m\.)\b/.test(lowerLine) || 
              lowerLine.includes('morning') || 
              lowerLine.includes('breakfast') || 
              lowerLine.includes('wake')) {
            timeOfDay = 'morningRoutine';
          } else if (/\b(?:12|1[0-4])[\s:-]*(?:pm|p\.m\.)\b/.test(lowerLine) || 
                   lowerLine.includes('lunch') || 
                   lowerLine.includes('noon') || 
                   lowerLine.includes('afternoon')) {
            timeOfDay = 'afternoonRoutine';
          } else if (/\b(?:1[5-9]|2[0-1])[\s:-]*(?:pm|p\.m\.)\b/.test(lowerLine) || 
                   /\b(?:[5-9])[\s:-]*(?:pm|p\.m\.)\b/.test(lowerLine) || 
                   lowerLine.includes('dinner') || 
                   lowerLine.includes('evening')) {
            timeOfDay = 'eveningRoutine';
          } else if (/\b(?:2[2-3]|24|[0-4])[\s:-]*(?:pm|p\.m\.)\b/.test(lowerLine) || 
                   /\b(?:1[0-2])[\s:-]*(?:pm|p\.m\.)\b/.test(lowerLine) || 
                   lowerLine.includes('night') || 
                   lowerLine.includes('bed') || 
                   lowerLine.includes('sleep')) {
            timeOfDay = 'nightRoutine';
          }
          
          // Add to appropriate section
          if (timeOfDay === 'morningRoutine' && !data.morningRoutine.includes(trimmedLine)) {
            data.morningRoutine.push(trimmedLine);
            data.confidence.morningRoutine = 0.7;
          } else if (timeOfDay === 'afternoonRoutine' && !data.afternoonRoutine.includes(trimmedLine)) {
            data.afternoonRoutine.push(trimmedLine);
            data.confidence.afternoonRoutine = 0.7;
          } else if (timeOfDay === 'eveningRoutine' && !data.eveningRoutine.includes(trimmedLine)) {
            data.eveningRoutine.push(trimmedLine);
            data.confidence.eveningRoutine = 0.7;
          } else if (timeOfDay === 'nightRoutine' && !data.nightRoutine.includes(trimmedLine)) {
            data.nightRoutine.push(trimmedLine);
            data.confidence.nightRoutine = 0.7;
          } else if (!data.dailyActivities.includes(trimmedLine)) {
            data.dailyActivities.push(trimmedLine);
            data.confidence.dailyActivities = 0.7;
          }
        }
      });
    }
    
    // Extract daily activities
    let inDailyActivitiesList = false;
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      // Check if this line appears to start a daily activities list
      if (/(?:daily\s+activities|regular\s+activities|routine\s+activities|typical\s+activities)(?:\s*:|\s*-|\s*–|\s*\*)?/i.test(trimmedLine)) {
        inDailyActivitiesList = true;
        return; // Skip this line as it's a header
      }
      
      // Check if we're in a daily activities list and this line has content
      if (inDailyActivitiesList && trimmedLine.length > 0) {
        // Remove bullet points or numbers
        const cleanLine = trimmedLine.replace(/^\s*[•\-*\d.)\s]+/, '').trim();
        
        if (cleanLine.length > 0 && !data.dailyActivities.includes(cleanLine)) {
          data.dailyActivities.push(cleanLine);
        }
      }
      
      // Check if this line ends the daily activities list
      if (inDailyActivitiesList && 
          (trimmedLine.length === 0 || 
           /(?:weekly|leisure|weekend|assessment|function)/i.test(trimmedLine))) {
        inDailyActivitiesList = false;
      }
    });
    
    data.confidence.dailyActivities = data.dailyActivities.length > 0 ? 0.8 : 0;
    
    // Extract weekly activities
    let inWeeklyActivitiesList = false;
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      // Check if this line appears to start a weekly activities list
      if (/(?:weekly\s+activities|weekly\s+routine|weekend\s+activities|weekend)(?:\s*:|\s*-|\s*–|\s*\*)?/i.test(trimmedLine)) {
        inWeeklyActivitiesList = true;
        return; // Skip this line as it's a header
      }
      
      // Check if we're in a weekly activities list and this line has content
      if (inWeeklyActivitiesList && trimmedLine.length > 0) {
        // Remove bullet points or numbers
        const cleanLine = trimmedLine.replace(/^\s*[•\-*\d.)\s]+/, '').trim();
        
        if (cleanLine.length > 0 && !data.weeklyActivities.includes(cleanLine)) {
          data.weeklyActivities.push(cleanLine);
        }
      }
      
      // Check if this line ends the weekly activities list
      if (inWeeklyActivitiesList && 
          (trimmedLine.length === 0 || 
           /(?:leisure|hobbies|daily|assessment|function)/i.test(trimmedLine))) {
        inWeeklyActivitiesList = false;
      }
    });
    
    data.confidence.weeklyActivities = data.weeklyActivities.length > 0 ? 0.8 : 0;
    
    // Extract leisure activities
    let inLeisureActivitiesList = false;
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      // Check if this line appears to start a leisure activities list
      if (/(?:leisure|hobbies|interests|recreational|pastimes|enjoys)(?:\s*:|\s*-|\s*–|\s*\*)?/i.test(trimmedLine)) {
        inLeisureActivitiesList = true;
        return; // Skip this line as it's a header
      }
      
      // Check if we're in a leisure activities list and this line has content
      if (inLeisureActivitiesList && trimmedLine.length > 0) {
        // Remove bullet points or numbers
        const cleanLine = trimmedLine.replace(/^\s*[•\-*\d.)\s]+/, '').trim();
        
        if (cleanLine.length > 0 && !data.leisureActivities.includes(cleanLine)) {
          data.leisureActivities.push(cleanLine);
        }
      }
      
      // Check if this line ends the leisure activities list
      if (inLeisureActivitiesList && 
          (trimmedLine.length === 0 || 
           /(?:weekly|daily|assessment|function)/i.test(trimmedLine))) {
        inLeisureActivitiesList = false;
      }
    });
    
    data.confidence.leisureActivities = data.leisureActivities.length > 0 ? 0.8 : 0;
    
    // Add the full text as routine notes
    data.routineNotes = text;
    
    return data;
  }
}

module.exports = TYPICAL_DAYExtractor;
