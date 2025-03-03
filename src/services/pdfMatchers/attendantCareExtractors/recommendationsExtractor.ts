/**
 * Recommendations Extractor
 * 
 * Extracts information about care recommendations from text.
 */

import { extractListItems } from '../../pdfExtraction';

/**
 * Extract recommendations information from text
 * @param text The text to extract from
 * @param recommendations Initial recommendations object to populate
 * @returns Populated recommendations object
 */
export function extractRecommendations(text: string, recommendations: any): any {
  // Extract care level
  const careLevelPatterns = [
    /(?:recommended|proposed|suggested)\s*(?:care\s*level|level\s*of\s*care)\s*[:;]\s*([^.]+)/i,
    /(?:recommend|propose|suggest)\s*([^.]*?(?:24\s*hour|round\s*the\s*clock|full\s*time|part\s*time|hourly|daily|weekly)\s*(?:care|support|assistance)[^.]*)/i,
    /(?:care|support|assistance)\s*(?:should|needs\s*to|must|is\s*to)\s*be\s*([^.]*?(?:24\s*hour|round\s*the\s*clock|full\s*time|part\s*time|hourly|daily|weekly)[^.]*)/i
  ];
  
  for (const pattern of careLevelPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      recommendations.care_level = match[1].trim();
      break;
    }
  }
  
  // Extract provider recommendations
  const providerPatterns = [
    /(?:recommended|proposed|suggested)\s*(?:provider|caregiver|attendant)\s*[:;]\s*([^.]+)/i,
    /(?:recommend|propose|suggest)\s*(?:that\s*care\s*be\s*provided\s*by|the\s*use\s*of)\s*([^.]+)/i,
    /(?:care|support|assistance)\s*(?:should|needs\s*to|must|is\s*to)\s*be\s*provided\s*by\s*([^.]+)/i
  ];
  
  for (const pattern of providerPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const providersText = match[1].trim();
      const providers = providersText.split(/,|and/).map(item => item.trim()).filter(item => item.length > 0);
      recommendations.providers = [...recommendations.providers, ...providers];
      break;
    }
  }
  
  // If no specific providers found, look for keywords
  if (recommendations.providers.length === 0) {
    const providerKeywords = [
      'PSW', 'personal support worker', 'home care', 'agency',
      'attendant', 'nurse', 'nursing', 'caregiver', 'aide',
      'professional', 'service', 'provider'
    ];
    
    for (const keyword of providerKeywords) {
      const pattern = new RegExp(`(?:recommend|suggest|advise)\\s+[^.]*?((?:[a-z]+\\s+)*${keyword}(?:\\s+[a-z]+)*)`, 'i');
      const matches = text.match(pattern);
      if (matches && matches[1]) {
        recommendations.providers.push(matches[1].trim());
      }
    }
  }
  
  // Deduplicate providers
  recommendations.providers = [...new Set(recommendations.providers)];
  
  // Extract recommended hours
  const hoursPatterns = [
    /(?:recommended|proposed|suggested)\s*(?:hours|amount\s*of\s*care|care\s*hours)\s*[:;]\s*([^.]+)/i,
    /(?:recommend|propose|suggest)\s*([^.]*?\d+\s*(?:hours|hrs)[^.]*?(?:per|a|each)\s*(?:day|week|month)[^.]*)/i,
    /(?:care|support|assistance)\s*(?:should|needs\s*to|must|is\s*to)\s*be\s*provided\s*for\s*([^.]*?\d+\s*(?:hours|hrs)[^.]*)/i
  ];
  
  for (const pattern of hoursPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      recommendations.hours = match[1].trim();
      break;
    }
  }
  
  // Extract recommended equipment
  const equipmentPatterns = [
    /(?:recommended|proposed|suggested)\s*(?:equipment|device|assistive\s*technology)\s*[:;]\s*([^.]+)/i,
    /(?:recommend|propose|suggest)\s*(?:the\s*use\s*of|using|obtaining)\s*([^.]*?(?:equipment|device|technology)[^.]*)/i,
    /(?:should|needs\s*to|must)\s*(?:use|obtain|have)\s*([^.]*?(?:equipment|device|technology)[^.]*)/i
  ];
  
  for (const pattern of equipmentPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const equipmentText = match[1].trim();
      const equipment = equipmentText.split(/,|and/).map(item => item.trim()).filter(item => item.length > 0);
      recommendations.equipment = [...recommendations.equipment, ...equipment];
      break;
    }
  }
  
  // If no specific equipment found, look for equipment keywords
  if (recommendations.equipment.length === 0) {
    const equipmentKeywords = [
      'wheelchair', 'walker', 'cane', 'crutches', 'bath bench',
      'shower chair', 'grab bar', 'handrail', 'commode',
      'hospital bed', 'lift', 'transfer board', 'pole',
      'raised toilet seat', 'alert system', 'monitor'
    ];
    
    for (const keyword of equipmentKeywords) {
      const pattern = new RegExp(`(?:recommend|suggest|advise)\\s+[^.]*?((?:[a-z]+\\s+)*${keyword}(?:\\s+[a-z]+)*)`, 'i');
      const matches = text.match(pattern);
      if (matches && matches[1]) {
        recommendations.equipment.push(matches[1].trim());
      }
    }
  }
  
  // Deduplicate equipment
  recommendations.equipment = [...new Set(recommendations.equipment)];
  
  // Extract notes
  const notesPatterns = [
    /(?:notes|comments|observations|additional\s*recommendations)\s*[:;]\s*([^.]+)/i,
    /(?:note|comment|observation)\s*that\s*([^.]+)/i,
    /(?:it\s*is|it\'s)\s*(?:noted|observed|reported|recommended)\s*that\s*([^.]+)/i
  ];
  
  for (const pattern of notesPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      recommendations.notes = match[1].trim();
      break;
    }
  }
  
  return recommendations;
}
