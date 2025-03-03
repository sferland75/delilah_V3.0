/**
 * Typical Day Pattern Matcher
 * 
 * This matcher extracts information about a client's typical daily routine,
 * including morning, afternoon, evening, and night activities and needs.
 */

import { PatternMatcher } from '../pdfInterfaces';
import { extractListItems, extractActivities, extractAssistance } from '../pdfExtraction';

/**
 * Get pattern matcher for typical day section
 */
export function getTypicalDayMatcher(): PatternMatcher {
  return {
    section: 'typicalDay',
    patterns: [
      /typical\s*day/i,
      /daily\s*routine/i,
      /daily\s*activities/i,
      /day\s*in\s*the\s*life/i,
      /(?:24|twenty-four)\s*hour\s*profile/i
    ],
    extract: (text: string) => {
      const typicalDay: any = {
        morning: { description: '', activities: [], assistance: [], wakeTime: '' },
        afternoon: { description: '', activities: [], assistance: [] },
        evening: { description: '', activities: [], assistance: [] },
        night: { description: '', activities: [], assistance: [], bedTime: '' }
      };
      
      // Extract entire typical day section
      let typicalDayText = '';
      const typicalDayPatterns = [
        /typical\s*day\s*[:;]([^]*?)(?:(?:assessment|evaluation|treatment|plan)|\n\s*\n\s*\n)/i,
        /daily\s*routine\s*[:;]([^]*?)(?:(?:assessment|evaluation|treatment|plan)|\n\s*\n\s*\n)/i,
        /day\s*in\s*the\s*life\s*[:;]([^]*?)(?:(?:assessment|evaluation|treatment|plan)|\n\s*\n\s*\n)/i
      ];
      
      for (const pattern of typicalDayPatterns) {
        const match = text.match(pattern);
        if (match && match[1]) {
          typicalDayText = match[1].trim();
          break;
        }
      }
      
      // If no overall section, use entire text
      if (!typicalDayText) {
        typicalDayText = text;
      }
      
      // Extract morning routine
      const morningPatterns = [
        /(?:morning|a\.m\.|am|breakfast)\s*(?:routine|activities|schedule)\s*[:;]([^]*?)(?:(?:afternoon|lunch|noon|midday)|\n\s*\n)/i,
        /(?:morning|waking|breakfast|wakes|wakens)\s*[:;]([^]*?)(?:(?:afternoon|lunch|noon|midday)|\n\s*\n)/i
      ];
      
      for (const pattern of morningPatterns) {
        const match = typicalDayText.match(pattern);
        if (match && match[1]) {
          const morningText = match[1].trim();
          typicalDay.morning.description = morningText;
          
          // Extract activities and assistance
          typicalDay.morning.activities = extractActivities(morningText);
          typicalDay.morning.assistance = extractAssistance(morningText);
          
          // Extract wake time
          const wakeTimePatterns = [
            /(?:wakes|gets up|awakens|rises)\s*(?:at|around)\s*(\d{1,2}(?::\d{2})?\s*(?:am|a\.m\.|))/i,
            /wake(?:\s*up)?\s*time\s*(?:is|:)\s*(\d{1,2}(?::\d{2})?\s*(?:am|a\.m\.|))/i,
            /(\d{1,2}(?::\d{2})?\s*(?:am|a\.m\.|))\s*(?:-|to|until)\s*(?:wake|rise|get up)/i
          ];
          
          for (const pattern of wakeTimePatterns) {
            const match = morningText.match(pattern);
            if (match && match[1]) {
              typicalDay.morning.wakeTime = match[1].trim();
              break;
            }
          }
          
          break;
        }
      }
      
      // Extract afternoon routine
      const afternoonPatterns = [
        /(?:afternoon|lunch|midday|noon|p\.m\.|pm)\s*(?:routine|activities|schedule)\s*[:;]([^]*?)(?:(?:evening|dinner|supper)|\n\s*\n)/i,
        /(?:afternoon|lunch|midday|noon)\s*[:;]([^]*?)(?:(?:evening|dinner|supper)|\n\s*\n)/i
      ];
      
      for (const pattern of afternoonPatterns) {
        const match = typicalDayText.match(pattern);
        if (match && match[1]) {
          const afternoonText = match[1].trim();
          typicalDay.afternoon.description = afternoonText;
          
          // Extract activities and assistance
          typicalDay.afternoon.activities = extractActivities(afternoonText);
          typicalDay.afternoon.assistance = extractAssistance(afternoonText);
          
          break;
        }
      }
      
      // Extract evening routine
      const eveningPatterns = [
        /(?:evening|dinner|supper|p\.m\.|pm)\s*(?:routine|activities|schedule)\s*[:;]([^]*?)(?:(?:night|bedtime|sleep)|\n\s*\n)/i,
        /(?:evening|dinner|supper)\s*[:;]([^]*?)(?:(?:night|bedtime|sleep)|\n\s*\n)/i
      ];
      
      for (const pattern of eveningPatterns) {
        const match = typicalDayText.match(pattern);
        if (match && match[1]) {
          const eveningText = match[1].trim();
          typicalDay.evening.description = eveningText;
          
          // Extract activities and assistance
          typicalDay.evening.activities = extractActivities(eveningText);
          typicalDay.evening.assistance = extractAssistance(eveningText);
          
          break;
        }
      }
      
      // Extract night routine
      const nightPatterns = [
        /(?:night|bedtime|sleep)\s*(?:routine|activities|schedule)\s*[:;]([^]*?)(?:(?:morning|breakfast|wake)|\n\s*\n|$)/i,
        /(?:night|bedtime|sleep)\s*[:;]([^]*?)(?:(?:morning|breakfast|wake)|\n\s*\n|$)/i
      ];
      
      for (const pattern of nightPatterns) {
        const match = typicalDayText.match(pattern);
        if (match && match[1]) {
          const nightText = match[1].trim();
          typicalDay.night.description = nightText;
          
          // Extract activities and assistance
          typicalDay.night.activities = extractActivities(nightText);
          typicalDay.night.assistance = extractAssistance(nightText);
          
          // Extract bedtime
          const bedTimePatterns = [
            /(?:goes to bed|retires|sleeps|bedtime)\s*(?:at|around)\s*(\d{1,2}(?::\d{2})?\s*(?:pm|p\.m\.|))/i,
            /bedtime\s*(?:is|:)\s*(\d{1,2}(?::\d{2})?\s*(?:pm|p\.m\.|))/i,
            /(\d{1,2}(?::\d{2})?\s*(?:pm|p\.m\.|))\s*(?:-|to|until)\s*(?:bed|sleep|retire)/i
          ];
          
          for (const pattern of bedTimePatterns) {
            const match = nightText.match(pattern);
            if (match && match[1]) {
              typicalDay.night.bedTime = match[1].trim();
              break;
            }
          }
          
          break;
        }
      }
      
      // If no structured sections were found, attempt general extraction
      if (!typicalDay.morning.description && !typicalDay.afternoon.description && 
          !typicalDay.evening.description && !typicalDay.night.description) {
        
        // Extract any wake time references
        const wakeTimePatterns = [
          /(?:wakes|gets up|awakens|rises)\s*(?:at|around)\s*(\d{1,2}(?::\d{2})?\s*(?:am|a\.m\.|))/i,
          /wake(?:\s*up)?\s*time\s*(?:is|:)\s*(\d{1,2}(?::\d{2})?\s*(?:am|a\.m\.|))/i
        ];
        
        for (const pattern of wakeTimePatterns) {
          const match = typicalDayText.match(pattern);
          if (match && match[1]) {
            typicalDay.morning.wakeTime = match[1].trim();
            break;
          }
        }
        
        // Extract any bedtime references
        const bedTimePatterns = [
          /(?:goes to bed|retires|sleeps|bedtime)\s*(?:at|around)\s*(\d{1,2}(?::\d{2})?\s*(?:pm|p\.m\.|))/i,
          /bedtime\s*(?:is|:)\s*(\d{1,2}(?::\d{2})?\s*(?:pm|p\.m\.|))/i
        ];
        
        for (const pattern of bedTimePatterns) {
          const match = typicalDayText.match(pattern);
          if (match && match[1]) {
            typicalDay.night.bedTime = match[1].trim();
            break;
          }
        }
        
        // Extract general activities
        const activities = extractActivities(typicalDayText);
        
        // Try to classify activities into time periods
        activities.forEach(activity => {
          // Check for time indicators in the activity
          if (/morning|breakfast|wake|a\.m\.|am\b/.test(activity.toLowerCase())) {
            typicalDay.morning.activities.push(activity);
          } else if (/afternoon|lunch|noon|midday/.test(activity.toLowerCase())) {
            typicalDay.afternoon.activities.push(activity);
          } else if (/evening|dinner|supper/.test(activity.toLowerCase())) {
            typicalDay.evening.activities.push(activity);
          } else if (/night|bed|sleep/.test(activity.toLowerCase())) {
            typicalDay.night.activities.push(activity);
          } else {
            // If no clear indicator, add to morning as default
            typicalDay.morning.activities.push(activity);
          }
        });
        
        // Extract general assistance needs
        const assistance = extractAssistance(typicalDayText);
        
        // Try to classify assistance into time periods
        assistance.forEach(need => {
          // Check for time indicators in the assistance need
          if (/morning|breakfast|wake|a\.m\.|am\b/.test(need.toLowerCase())) {
            typicalDay.morning.assistance.push(need);
          } else if (/afternoon|lunch|noon|midday/.test(need.toLowerCase())) {
            typicalDay.afternoon.assistance.push(need);
          } else if (/evening|dinner|supper/.test(need.toLowerCase())) {
            typicalDay.evening.assistance.push(need);
          } else if (/night|bed|sleep/.test(need.toLowerCase())) {
            typicalDay.night.assistance.push(need);
          } else {
            // If no clear indicator, add to morning as default
            typicalDay.morning.assistance.push(need);
          }
        });
      }
      
      return typicalDay;
    },
    confidence: (result: any) => {
      // Calculate confidence based on presence and quantity of data
      let score = 0;
      const morningWeight = 0.3;
      const afternoonWeight = 0.2;
      const eveningWeight = 0.2;
      const nightWeight = 0.3;
      
      // Check morning data
      let morningScore = 0;
      if (result.morning.description) morningScore += 0.3;
      if (result.morning.wakeTime) morningScore += 0.2;
      if (result.morning.activities && result.morning.activities.length > 0) {
        morningScore += 0.3 * Math.min(1, result.morning.activities.length / 3);
      }
      if (result.morning.assistance && result.morning.assistance.length > 0) {
        morningScore += 0.2 * Math.min(1, result.morning.assistance.length / 2);
      }
      
      // Check afternoon data
      let afternoonScore = 0;
      if (result.afternoon.description) afternoonScore += 0.4;
      if (result.afternoon.activities && result.afternoon.activities.length > 0) {
        afternoonScore += 0.4 * Math.min(1, result.afternoon.activities.length / 3);
      }
      if (result.afternoon.assistance && result.afternoon.assistance.length > 0) {
        afternoonScore += 0.2 * Math.min(1, result.afternoon.assistance.length / 2);
      }
      
      // Check evening data
      let eveningScore = 0;
      if (result.evening.description) eveningScore += 0.4;
      if (result.evening.activities && result.evening.activities.length > 0) {
        eveningScore += 0.4 * Math.min(1, result.evening.activities.length / 3);
      }
      if (result.evening.assistance && result.evening.assistance.length > 0) {
        eveningScore += 0.2 * Math.min(1, result.evening.assistance.length / 2);
      }
      
      // Check night data
      let nightScore = 0;
      if (result.night.description) nightScore += 0.3;
      if (result.night.bedTime) nightScore += 0.2;
      if (result.night.activities && result.night.activities.length > 0) {
        nightScore += 0.3 * Math.min(1, result.night.activities.length / 3);
      }
      if (result.night.assistance && result.night.assistance.length > 0) {
        nightScore += 0.2 * Math.min(1, result.night.assistance.length / 2);
      }
      
      // Calculate total confidence score
      score = (morningScore * morningWeight) + 
              (afternoonScore * afternoonWeight) + 
              (eveningScore * eveningWeight) + 
              (nightScore * nightWeight);
      
      return score;
    }
  };
}
