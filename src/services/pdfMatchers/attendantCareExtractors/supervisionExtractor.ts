/**
 * Supervision Extractor
 * 
 * Extracts information about supervision needs from text.
 */

import { extractListItems } from '../../pdfExtraction';

/**
 * Extract supervision information from text
 * @param text The text to extract from
 * @param supervision Initial supervision object to populate
 * @returns Populated supervision object
 */
export function extractSupervision(text: string, supervision: any): any {
  // Extract supervision needs
  const needsItems = extractListItems(text);
  if (needsItems.length > 0) {
    supervision.needs = needsItems.map(item => item.trim());
  } else {
    // Look for needs mentioned in the text
    const supervisionNeedsPatterns = [
      /(?:requires|needs|assistance\s*with)\s*([^.,;]+(?:supervision|monitoring|observation|safety|oversight|cueing)[^.,;]*)/i,
      /(?:needs|requires)\s*(?:to\s*be)\s*([^.,;]+(?:supervised|monitored|observed|watched)[^.,;]*)/i,
      /(?:supervision|monitoring|observation|oversight)\s*(?:is\s*needed|required|necessary)\s*(?:for|during|because\s*of)\s*([^.,;]+)/i
    ];
    
    for (const pattern of supervisionNeedsPatterns) {
      const matches = text.match(new RegExp(pattern, 'gi'));
      if (matches && matches.length > 0) {
        matches.forEach(matchText => {
          const needMatch = matchText.match(pattern);
          if (needMatch && needMatch[1]) {
            supervision.needs.push(needMatch[1].trim());
          }
        });
      }
    }
  }
  
  // Deduplicate needs
  supervision.needs = [...new Set(supervision.needs)];
  
  // Extract frequency
  const frequencyPatterns = [
    /(?:frequency|how\s*often)\s*[:;]\s*([^.,;]+)/i,
    /(?:provided|needed|required|performed)\s*([^.,;]*?(?:continuous|constant|24\s*hour|hourly|\d+\s*(?:times|x)\s*(?:per|a|each)\s*(?:day|week|month))[^.,;]*)/i,
    /([^.,;]*?(?:continuous|constant|24\s*hour|hourly|\d+\s*(?:times|x)\s*(?:per|a|each)\s*(?:day|week|month))[^.,;]*)/i
  ];
  
  for (const pattern of frequencyPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      supervision.frequency = match[1].trim();
      break;
    }
  }
  
  // Extract duration
  const durationPatterns = [
    /(?:duration|how\s*long|time\s*required)\s*[:;]\s*([^.,;]+)/i,
    /(?:throughout|during|for)\s*([^.,;]*?(?:the\s*day|each\s*day|entire\s*day|overnight|\d+\s*(?:minutes|hours))[^.,;]*)/i,
    /([^.,;]*?\d+\s*(?:minutes|hours)[^.,;]*)/i
  ];
  
  for (const pattern of durationPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      supervision.duration = match[1].trim();
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
      supervision.notes = match[1].trim();
      break;
    }
  }
  
  return supervision;
}
