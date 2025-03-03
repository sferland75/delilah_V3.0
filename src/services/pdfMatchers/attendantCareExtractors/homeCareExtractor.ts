/**
 * Home Care Extractor
 * 
 * Extracts information about home care needs from text.
 */

import { extractListItems } from '../../pdfExtraction';

/**
 * Extract home care information from text
 * @param text The text to extract from
 * @param homecare Initial home care object to populate
 * @returns Populated home care object
 */
export function extractHomeCare(text: string, homecare: any): any {
  // Extract home care needs
  const needsItems = extractListItems(text);
  if (needsItems.length > 0) {
    homecare.needs = needsItems.map(item => item.trim());
  } else {
    // Look for needs mentioned in the text
    const homecareNeedsPatterns = [
      /(?:requires|needs|assistance\s*with)\s*([^.,;]+(?:cleaning|laundry|meal|cooking|shopping|housekeeping)[^.,;]*)/i,
      /(?:assist|help)\s*(?:with|for|during)\s*([^.,;]+(?:cleaning|laundry|meal|cooking|shopping|housekeeping)[^.,;]*)/i,
      /(?:assistance|help|support)\s*(?:is\s*needed|required|necessary)\s*(?:with|for|during)\s*([^.,;]+(?:cleaning|laundry|meal|cooking|shopping|housekeeping)[^.,;]*)/i
    ];
    
    for (const pattern of homecareNeedsPatterns) {
      const matches = text.match(new RegExp(pattern, 'gi'));
      if (matches && matches.length > 0) {
        matches.forEach(matchText => {
          const needMatch = matchText.match(pattern);
          if (needMatch && needMatch[1]) {
            homecare.needs.push(needMatch[1].trim());
          }
        });
      }
    }
  }
  
  // Deduplicate needs
  homecare.needs = [...new Set(homecare.needs)];
  
  // Extract frequency
  const frequencyPatterns = [
    /(?:frequency|how\s*often)\s*[:;]\s*([^.,;]+)/i,
    /(?:provided|needed|required|performed)\s*([^.,;]*?\d+\s*(?:times|x)\s*(?:per|a|each)\s*(?:day|week|month)[^.,;]*)/i,
    /([^.,;]*?\d+\s*(?:times|x)\s*(?:per|a|each)\s*(?:day|week|month)[^.,;]*)/i
  ];
  
  for (const pattern of frequencyPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      homecare.frequency = match[1].trim();
      break;
    }
  }
  
  // Extract duration
  const durationPatterns = [
    /(?:duration|how\s*long|time\s*required)\s*[:;]\s*([^.,;]+)/i,
    /(?:takes|requires|needs)\s*([^.,;]*?\d+\s*(?:minutes|hours)[^.,;]*)/i,
    /([^.,;]*?\d+\s*(?:minutes|hours)[^.,;]*)/i
  ];
  
  for (const pattern of durationPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      homecare.duration = match[1].trim();
      break;
    }
  }
  
  // Extract notes
  const notesPatterns = [
    /(?:notes|comments|observations)\s*[:;]\s*([^.]+)/i,
    /(?:note|comment|observation)\s*that\s*([^.]+)/i,
    /(?:it\s*is|it\'s)\s*(?:noted|observed|reported)\s*that\s*([^.]+)/i
  ];
  
  for (const pattern of notesPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      homecare.notes = match[1].trim();
      break;
    }
  }
  
  return homecare;
}
