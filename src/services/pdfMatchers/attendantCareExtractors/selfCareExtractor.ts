/**
 * Self Care Extractor
 * 
 * Extracts information about self care needs from text.
 */

import { extractListItems } from '../../pdfExtraction';

/**
 * Extract self care information from text
 * @param text The text to extract from
 * @param selfCare Initial self care object to populate
 * @returns Populated self care object
 */
export function extractSelfCare(text: string, selfCare: any): any {
  // Extract self care needs
  const needsItems = extractListItems(text);
  if (needsItems.length > 0) {
    selfCare.needs = needsItems.map(item => item.trim());
  } else {
    // Look for needs mentioned in the text
    const selfCareNeedsPatterns = [
      /(?:requires|needs|assistance\s*with)\s*([^.,;]+(?:bathing|showering|grooming|dressing|toileting|feeding|eating)[^.,;]*)/i,
      /(?:assist|help)\s*(?:with|for|during)\s*([^.,;]+(?:bathing|showering|grooming|dressing|toileting|feeding|eating)[^.,;]*)/i,
      /(?:assistance|help|support)\s*(?:is\s*needed|required|necessary)\s*(?:with|for|during)\s*([^.,;]+(?:bathing|showering|grooming|dressing|toileting|feeding|eating)[^.,;]*)/i
    ];
    
    for (const pattern of selfCareNeedsPatterns) {
      const matches = text.match(new RegExp(pattern, 'gi'));
      if (matches && matches.length > 0) {
        matches.forEach(matchText => {
          const needMatch = matchText.match(pattern);
          if (needMatch && needMatch[1]) {
            selfCare.needs.push(needMatch[1].trim());
          }
        });
      }
    }
  }
  
  // Deduplicate needs
  selfCare.needs = [...new Set(selfCare.needs)];
  
  // Extract frequency
  const frequencyPatterns = [
    /(?:frequency|how\s*often)\s*[:;]\s*([^.,;]+)/i,
    /(?:provided|needed|required|performed)\s*([^.,;]*?\d+\s*(?:times|x)\s*(?:per|a|each)\s*(?:day|week|month)[^.,;]*)/i,
    /([^.,;]*?\d+\s*(?:times|x)\s*(?:per|a|each)\s*(?:day|week|month)[^.,;]*)/i
  ];
  
  for (const pattern of frequencyPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      selfCare.frequency = match[1].trim();
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
      selfCare.duration = match[1].trim();
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
      selfCare.notes = match[1].trim();
      break;
    }
  }
  
  return selfCare;
}
