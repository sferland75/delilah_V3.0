/**
 * Instrumental ADLs Extractor
 * 
 * Extracts information about instrumental activities of daily living from text.
 */

/**
 * Extract instrumental ADLs information from text
 * @param text The text to extract from
 * @param instrumentalADLs Initial instrumental ADLs object to populate
 * @returns Populated instrumental ADLs object
 */
export function extractInstrumentalADLs(text: string, instrumentalADLs: any): any {
  // Extract meal preparation information
  const mealPrepPatterns = [
    /(?:meal|food)\s*(?:preparation|prep|cooking)\s*[:;]\s*([^.,;]+)/i,
    /(?:meal|food)\s*(?:preparation|prep|cooking)\s*(?:status|ability|function|independence)\s*[:;]\s*([^.,;]+)/i,
    /(?:client|patient|individual)\s*(?:is|can|requires)\s*([^.,;]+)\s*(?:with|for|when)\s*(?:preparing|cooking|making)\s*(?:meals|food)/i
  ];
  
  for (const pattern of mealPrepPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      instrumentalADLs.meal_preparation.status = match[1].trim();
      
      // Look for additional notes
      const notePattern = new RegExp(`(?:meal|food)\\s*(?:preparation|prep|cooking).*?${match[1].trim()}[^.]*\\.\\s*([^.]+)`, 'i');
      const noteMatch = text.match(notePattern);
      if (noteMatch && noteMatch[1]) {
        instrumentalADLs.meal_preparation.notes = noteMatch[1].trim();
      }
      
      break;
    }
  }
  
  // Extract medication management information
  const medicationPatterns = [
    /(?:medication|medicine|med)\s*(?:management|administration|compliance)\s*[:;]\s*([^.,;]+)/i,
    /(?:medication|medicine|med)\s*(?:management|administration)\s*(?:status|ability|function|independence)\s*[:;]\s*([^.,;]+)/i,
    /(?:client|patient|individual)\s*(?:is|can|requires)\s*([^.,;]+)\s*(?:with|for|when)\s*(?:managing|taking|administering)\s*(?:medications|medicines|meds)/i
  ];
  
  for (const pattern of medicationPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      instrumentalADLs.medication_management.status = match[1].trim();
      
      // Look for additional notes
      const notePattern = new RegExp(`(?:medication|medicine|med)\\s*(?:management|administration).*?${match[1].trim()}[^.]*\\.\\s*([^.]+)`, 'i');
      const noteMatch = text.match(notePattern);
      if (noteMatch && noteMatch[1]) {
        instrumentalADLs.medication_management.notes = noteMatch[1].trim();
      }
      
      break;
    }
  }
  
  // Extract money management information
  const moneyPatterns = [
    /(?:money|financial|finance|banking|bill)\s*(?:management|handling|budgeting)\s*[:;]\s*([^.,;]+)/i,
    /(?:money|financial|finance)\s*(?:management|handling)\s*(?:status|ability|function|independence)\s*[:;]\s*([^.,;]+)/i,
    /(?:client|patient|individual)\s*(?:is|can|requires)\s*([^.,;]+)\s*(?:with|for|when)\s*(?:managing|handling|budgeting)\s*(?:money|finances|bills)/i
  ];
  
  for (const pattern of moneyPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      instrumentalADLs.money_management.status = match[1].trim();
      
      // Look for additional notes
      const notePattern = new RegExp(`(?:money|financial|finance)\\s*(?:management|handling).*?${match[1].trim()}[^.]*\\.\\s*([^.]+)`, 'i');
      const noteMatch = text.match(notePattern);
      if (noteMatch && noteMatch[1]) {
        instrumentalADLs.money_management.notes = noteMatch[1].trim();
      }
      
      break;
    }
  }
  
  // Extract phone use information
  const phonePatterns = [
    /(?:phone|telephone|communication\s*device)\s*(?:use|usage|utilization)\s*[:;]\s*([^.,;]+)/i,
    /(?:phone|telephone|communication)\s*(?:use|usage)\s*(?:status|ability|function|independence)\s*[:;]\s*([^.,;]+)/i,
    /(?:client|patient|individual)\s*(?:is|can|requires)\s*([^.,;]+)\s*(?:with|for|when)\s*(?:using|operating|answering)\s*(?:phone|telephone|communication\s*device)/i
  ];
  
  for (const pattern of phonePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      instrumentalADLs.phone_use.status = match[1].trim();
      
      // Look for additional notes
      const notePattern = new RegExp(`(?:phone|telephone|communication)\\s*(?:use|usage).*?${match[1].trim()}[^.]*\\.\\s*([^.]+)`, 'i');
      const noteMatch = text.match(notePattern);
      if (noteMatch && noteMatch[1]) {
        instrumentalADLs.phone_use.notes = noteMatch[1].trim();
      }
      
      break;
    }
  }
  
  // Extract housekeeping information
  const housekeepingPatterns = [
    /(?:housekeeping|cleaning|home\s*maintenance|household\s*chores)\s*[:;]\s*([^.,;]+)/i,
    /(?:housekeeping|cleaning|home\s*maintenance)\s*(?:status|ability|function|independence)\s*[:;]\s*([^.,;]+)/i,
    /(?:client|patient|individual)\s*(?:is|can|requires)\s*([^.,;]+)\s*(?:with|for|when)\s*(?:housekeeping|cleaning|maintaining)\s*(?:home|house|household)/i
  ];
  
  for (const pattern of housekeepingPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      instrumentalADLs.housekeeping.status = match[1].trim();
      
      // Look for additional notes
      const notePattern = new RegExp(`(?:housekeeping|cleaning|home\\s*maintenance).*?${match[1].trim()}[^.]*\\.\\s*([^.]+)`, 'i');
      const noteMatch = text.match(notePattern);
      if (noteMatch && noteMatch[1]) {
        instrumentalADLs.housekeeping.notes = noteMatch[1].trim();
      }
      
      break;
    }
  }
  
  // Extract laundry information
  const laundryPatterns = [
    /(?:laundry|clothes\s*washing)\s*[:;]\s*([^.,;]+)/i,
    /(?:laundry|clothes\s*washing)\s*(?:status|ability|function|independence)\s*[:;]\s*([^.,;]+)/i,
    /(?:client|patient|individual)\s*(?:is|can|requires)\s*([^.,;]+)\s*(?:with|for|when)\s*(?:doing|performing|completing)\s*(?:laundry|clothes\s*washing)/i
  ];
  
  for (const pattern of laundryPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      instrumentalADLs.laundry.status = match[1].trim();
      
      // Look for additional notes
      const notePattern = new RegExp(`(?:laundry|clothes\\s*washing).*?${match[1].trim()}[^.]*\\.\\s*([^.]+)`, 'i');
      const noteMatch = text.match(notePattern);
      if (noteMatch && noteMatch[1]) {
        instrumentalADLs.laundry.notes = noteMatch[1].trim();
      }
      
      break;
    }
  }
  
  // Extract transportation information
  const transportationPatterns = [
    /(?:transportation|travel|commuting|driving|public\s*transport)\s*[:;]\s*([^.,;]+)/i,
    /(?:transportation|travel|commuting|driving)\s*(?:status|ability|function|independence)\s*[:;]\s*([^.,;]+)/i,
    /(?:client|patient|individual)\s*(?:is|can|requires)\s*([^.,;]+)\s*(?:with|for|when)\s*(?:transportation|traveling|commuting|driving)/i
  ];
  
  for (const pattern of transportationPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      instrumentalADLs.transportation.status = match[1].trim();
      
      // Look for additional notes
      const notePattern = new RegExp(`(?:transportation|travel|commuting|driving).*?${match[1].trim()}[^.]*\\.\\s*([^.]+)`, 'i');
      const noteMatch = text.match(notePattern);
      if (noteMatch && noteMatch[1]) {
        instrumentalADLs.transportation.notes = noteMatch[1].trim();
      }
      
      break;
    }
  }
  
  // Extract shopping information
  const shoppingPatterns = [
    /(?:shopping|purchasing|buying|groceries)\s*[:;]\s*([^.,;]+)/i,
    /(?:shopping|purchasing|buying|groceries)\s*(?:status|ability|function|independence)\s*[:;]\s*([^.,;]+)/i,
    /(?:client|patient|individual)\s*(?:is|can|requires)\s*([^.,;]+)\s*(?:with|for|when)\s*(?:shopping|purchasing|buying|getting\s*groceries)/i
  ];
  
  for (const pattern of shoppingPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      instrumentalADLs.shopping.status = match[1].trim();
      
      // Look for additional notes
      const notePattern = new RegExp(`(?:shopping|purchasing|buying|groceries).*?${match[1].trim()}[^.]*\\.\\s*([^.]+)`, 'i');
      const noteMatch = text.match(notePattern);
      if (noteMatch && noteMatch[1]) {
        instrumentalADLs.shopping.notes = noteMatch[1].trim();
      }
      
      break;
    }
  }
  
  // Extract other instrumental ADLs
  const otherInstrumentalADLPatterns = [
    /(?:also|other|additional)\s*(?:requires|needs|has|demonstrates)\s*(?:assistance|help|support|difficulty)\s*(?:with|for|in)\s*([^.,;]+)/i,
    /(?:assistance|help|support|difficulty)\s*(?:also|is\s*also|needed|required)\s*(?:with|for|in)\s*([^.,;]+)/i
  ];
  
  for (const pattern of otherInstrumentalADLPatterns) {
    const matches = text.match(new RegExp(pattern, 'gi'));
    if (matches && matches.length > 0) {
      matches.forEach(matchText => {
        const otherMatch = matchText.match(pattern);
        if (otherMatch && otherMatch[1]) {
          // Check if this is already covered in one of the specific categories
          const otherIADL = otherMatch[1].trim();
          const lowerOtherIADL = otherIADL.toLowerCase();
          
          if (!lowerOtherIADL.includes('meal') && 
              !lowerOtherIADL.includes('cook') && 
              !lowerOtherIADL.includes('food') && 
              !lowerOtherIADL.includes('medic') && 
              !lowerOtherIADL.includes('money') && 
              !lowerOtherIADL.includes('financ') && 
              !lowerOtherIADL.includes('phone') && 
              !lowerOtherIADL.includes('telephon') && 
              !lowerOtherIADL.includes('house') && 
              !lowerOtherIADL.includes('clean') && 
              !lowerOtherIADL.includes('laundry') && 
              !lowerOtherIADL.includes('cloth') && 
              !lowerOtherIADL.includes('transport') && 
              !lowerOtherIADL.includes('travel') && 
              !lowerOtherIADL.includes('driving') && 
              !lowerOtherIADL.includes('shop') && 
              !lowerOtherIADL.includes('grocer')) {
            instrumentalADLs.other.push(otherIADL);
          }
        }
      });
    }
  }
  
  return instrumentalADLs;
}
