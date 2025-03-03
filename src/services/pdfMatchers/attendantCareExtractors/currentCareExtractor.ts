/**
 * Current Care Extractor
 * 
 * Extracts information about current care arrangements from text.
 */

import { extractListItems } from '../../pdfExtraction';

/**
 * Extract current care information from text
 * @param text The text to extract from
 * @param currentCare Initial current care object to populate
 * @returns Populated current care object
 */
export function extractCurrentCare(text: string, currentCare: any): any {
  // Extract care providers
  const providerPatterns = [
    /(?:care|assistance|support)\s*(?:is|being)\s*provided\s*by\s*([^.]+)/i,
    /(?:caregiver|provider|attendant|helper|service)\s*[:;]\s*([^.]+)/i,
    /(?:receives|has)\s*(?:care|assistance|support|help)\s*from\s*([^.]+)/i
  ];
  
  for (const pattern of providerPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const providersText = match[1].trim();
      const providers = providersText.split(/,|and/).map(item => item.trim()).filter(item => item.length > 0);
      currentCare.providers = [...currentCare.providers, ...providers];
      break;
    }
  }
  
  // If no specific providers found, look for keywords
  if (currentCare.providers.length === 0) {
    const providerKeywords = [
      'spouse', 'husband', 'wife', 'partner', 'family member',
      'son', 'daughter', 'child', 'sibling', 'brother', 'sister',
      'parent', 'mother', 'father', 'relative', 'friend',
      'neighbor', 'nurse', 'attendant', 'aide', 'caregiver',
      'PSW', 'personal support worker', 'agency', 'service'
    ];
    
    for (const keyword of providerKeywords) {
      const pattern = new RegExp(`((?:[a-z]+\\s+)*${keyword}(?:\\s+[a-z]+)*)`, 'i');
      const matches = text.match(pattern);
      if (matches && matches[1]) {
        currentCare.providers.push(matches[1].trim());
      }
    }
  }
  
  // Deduplicate providers
  currentCare.providers = [...new Set(currentCare.providers)];
  
  // Extract schedule
  const schedulePatterns = [
    /(?:schedule|routine|pattern)\s*[:;]\s*([^.]+)/i,
    /(?:care|assistance|support)\s*(?:is|being)\s*provided\s*([^.]*?(?:daily|weekly|on|every|each|mornings?|afternoons?|evenings?|nights?)[^.]*)/i,
    /(?:comes|visits|provides\s*care)\s*([^.]*?(?:daily|weekly|on|every|each|mornings?|afternoons?|evenings?|nights?)[^.]*)/i
  ];
  
  for (const pattern of schedulePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      currentCare.schedule = match[1].trim();
      break;
    }
  }
  
  // Extract hours
  const hoursPatterns = [
    /(?:hours|amount\s*of\s*care|care\s*hours)\s*[:;]\s*([^.]+)/i,
    /(?:receives|has|gets)\s*([^.]*?\d+\s*(?:hours|hrs)[^.]*)/i,
    /([^.]*?\d+\s*(?:hours|hrs)[^.]*?(?:per|a|each)\s*(?:day|week|month)[^.]*)/i
  ];
  
  for (const pattern of hoursPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      currentCare.hours = match[1].trim();
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
      currentCare.notes = match[1].trim();
      break;
    }
  }
  
  return currentCare;
}
