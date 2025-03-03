/**
 * Leisure Activities Extractor
 * 
 * Extracts information about leisure and recreational activities from text.
 */

import { extractListItems } from '../../pdfExtraction';

/**
 * Extract leisure activities information from text
 * @param text The text to extract from
 * @param leisure Initial leisure object to populate
 * @returns Populated leisure object
 */
export function extractLeisureActivities(text: string, leisure: any): any {
  // Extract activities
  const activityPatterns = [
    /(?:leisure|recreational)\s*activities\s*[:;]\s*([^.]+)/i,
    /(?:engages|participates)\s*in\s*(?:the\s*following|these)?\s*(?:leisure|recreational)\s*activities\s*[:;]?\s*([^.]+)/i,
    /(?:leisure|recreational)\s*activities\s*(?:include|consist\s*of|are)\s*[:;]?\s*([^.]+)/i
  ];
  
  for (const pattern of activityPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const activitiesText = match[1].trim();
      const activities = extractListItems(activitiesText);
      
      if (activities.length > 0) {
        leisure.activities = activities.map(activity => activity.trim());
      } else if (activitiesText) {
        // If no list items found but text exists, use comma separation
        leisure.activities = activitiesText.split(/,|and/).map(item => item.trim()).filter(item => item.length > 0);
      }
      
      break;
    }
  }
  
  // If no activities found with specific patterns, search for activity mentions
  if (leisure.activities.length === 0) {
    const activityKeywords = [
      'reading', 'watching', 'gardening', 'walking', 'exercise',
      'crafts', 'arts', 'music', 'singing', 'dancing', 'games',
      'sports', 'swimming', 'fishing', 'hunting', 'cooking',
      'baking', 'knitting', 'sewing', 'woodworking', 'photography',
      'computer', 'internet', 'social media', 'visiting', 'travel',
      'movies', 'television', 'radio', 'puzzles', 'cards'
    ];
    
    const activityMentionPatterns = [
      /(?:enjoys|likes|prefers|interested\s*in)\s*([^.,;]+)/i,
      /(?:leisure|recreational|free\s*time)\s*(?:activities|pursuits|interests)\s*(?:include|are)?\s*([^.,;]+)/i,
      /(?:participates|engages)\s*in\s*([^.,;]+)/i,
      /(?:time|day)\s*(?:with|doing|engaging\s*in)\s*([^.,;]+)/i
    ];
    
    for (const pattern of activityMentionPatterns) {
      const matches = text.match(new RegExp(pattern, 'gi'));
      if (matches && matches.length > 0) {
        matches.forEach(matchText => {
          const activityMatch = matchText.match(pattern);
          if (activityMatch && activityMatch[1]) {
            const activity = activityMatch[1].trim();
            
            // Check if activity contains any of the keywords
            for (const keyword of activityKeywords) {
              if (activity.toLowerCase().includes(keyword)) {
                leisure.activities.push(activity);
                break;
              }
            }
          }
        });
      }
    }
    
    // Deduplicate activities
    leisure.activities = [...new Set(leisure.activities)];
  }
  
  // Extract interests
  const interestPatterns = [
    /(?:interests|hobbies)\s*[:;]\s*([^.]+)/i,
    /(?:interested|expresses\s*interest)\s*in\s*[:;]?\s*([^.]+)/i,
    /(?:interests|hobbies)\s*(?:include|consist\s*of|are)\s*[:;]?\s*([^.]+)/i
  ];
  
  for (const pattern of interestPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const interestsText = match[1].trim();
      const interests = extractListItems(interestsText);
      
      if (interests.length > 0) {
        leisure.interests = interests.map(interest => interest.trim());
      } else if (interestsText) {
        // If no list items found but text exists, use comma separation
        leisure.interests = interestsText.split(/,|and/).map(item => item.trim()).filter(item => item.length > 0);
      }
      
      break;
    }
  }
  
  // Extract barriers to leisure participation
  const barrierPatterns = [
    /(?:barriers|obstacles|limitations|challenges)\s*(?:to|for|in)\s*(?:leisure|recreation|participation)\s*[:;]\s*([^.]+)/i,
    /(?:difficulty|unable|challenging)\s*(?:participating|engaging)\s*in\s*(?:leisure|recreational)\s*activities\s*(?:due\s*to|because\s*of|from)\s*([^.]+)/i,
    /(?:restricted|limited|impaired)\s*(?:leisure|recreational|activity)\s*participation\s*(?:due\s*to|because\s*of|from)\s*([^.]+)/i
  ];
  
  for (const pattern of barrierPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const barriersText = match[1].trim();
      const barriers = extractListItems(barriersText);
      
      if (barriers.length > 0) {
        leisure.barriers = barriers.map(barrier => barrier.trim());
      } else if (barriersText) {
        // If no list items found but text exists, use comma separation
        leisure.barriers = barriersText.split(/,|and/).map(item => item.trim()).filter(item => item.length > 0);
      }
      
      break;
    }
  }
  
  // Extract additional notes
  const notesPatterns = [
    /(?:leisure|recreational|activity)\s*(?:notes|observations|comments)\s*[:;]\s*([^.]+)/i,
    /(?:regarding|note\s*about|observation\s*of)\s*(?:leisure|recreational)\s*activities\s*[:;]?\s*([^.]+)/i,
    /(?:therapist|assessor)\s*(?:notes|observes|comments)\s*(?:regarding|about|on)\s*(?:leisure|recreational)\s*activities\s*[:;]?\s*([^.]+)/i
  ];
  
  for (const pattern of notesPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      leisure.notes = match[1].trim();
      break;
    }
  }
  
  return leisure;
}
