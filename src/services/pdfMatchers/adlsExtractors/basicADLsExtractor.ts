/**
 * Basic ADLs Extractor
 * 
 * Extracts information about basic activities of daily living from text.
 */

/**
 * Extract basic ADLs information from text
 * @param text The text to extract from
 * @param basicADLs Initial basic ADLs object to populate
 * @returns Populated basic ADLs object
 */
export function extractBasicADLs(text: string, basicADLs: any): any {
  // Extract feeding information
  const feedingPatterns = [
    /(?:feeding|eating|diet|nutrition|meal|food)\s*[:;]\s*([^.,;]+)/i,
    /(?:feeding|eating|diet|nutrition|meal|food)\s*(?:status|ability|function|independence)\s*[:;]\s*([^.,;]+)/i,
    /(?:client|patient|individual)\s*(?:is|can|requires)\s*([^.,;]+)\s*(?:with|for|when)\s*(?:feeding|eating|meals)/i
  ];
  
  for (const pattern of feedingPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      basicADLs.feeding.status = match[1].trim();
      
      // Look for additional notes
      const notePattern = new RegExp(`(?:feeding|eating|diet|nutrition|meal|food).*?${match[1].trim()}[^.]*\\.\\s*([^.]+)`, 'i');
      const noteMatch = text.match(notePattern);
      if (noteMatch && noteMatch[1]) {
        basicADLs.feeding.notes = noteMatch[1].trim();
      }
      
      break;
    }
  }
  
  // Extract bathing information
  const bathingPatterns = [
    /(?:bathing|showering|bath|shower|hygiene|washing)\s*[:;]\s*([^.,;]+)/i,
    /(?:bathing|showering|bath|shower|hygiene|washing)\s*(?:status|ability|function|independence)\s*[:;]\s*([^.,;]+)/i,
    /(?:client|patient|individual)\s*(?:is|can|requires)\s*([^.,;]+)\s*(?:with|for|when)\s*(?:bathing|showering|hygiene)/i
  ];
  
  for (const pattern of bathingPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      basicADLs.bathing.status = match[1].trim();
      
      // Look for additional notes
      const notePattern = new RegExp(`(?:bathing|showering|bath|shower|hygiene).*?${match[1].trim()}[^.]*\\.\\s*([^.]+)`, 'i');
      const noteMatch = text.match(notePattern);
      if (noteMatch && noteMatch[1]) {
        basicADLs.bathing.notes = noteMatch[1].trim();
      }
      
      break;
    }
  }
  
  // Extract grooming information
  const groomingPatterns = [
    /(?:grooming|personal\s*hygiene|oral\s*care|hair|teeth|shaving)\s*[:;]\s*([^.,;]+)/i,
    /(?:grooming|personal\s*hygiene|oral\s*care)\s*(?:status|ability|function|independence)\s*[:;]\s*([^.,;]+)/i,
    /(?:client|patient|individual)\s*(?:is|can|requires)\s*([^.,;]+)\s*(?:with|for|when)\s*(?:grooming|personal\s*hygiene|oral\s*care)/i
  ];
  
  for (const pattern of groomingPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      basicADLs.grooming.status = match[1].trim();
      
      // Look for additional notes
      const notePattern = new RegExp(`(?:grooming|personal\\s*hygiene|oral\\s*care).*?${match[1].trim()}[^.]*\\.\\s*([^.]+)`, 'i');
      const noteMatch = text.match(notePattern);
      if (noteMatch && noteMatch[1]) {
        basicADLs.grooming.notes = noteMatch[1].trim();
      }
      
      break;
    }
  }
  
  // Extract dressing information
  const dressingPatterns = [
    /(?:dressing|clothing|dress|undress|donning|doffing)\s*[:;]\s*([^.,;]+)/i,
    /(?:dressing|clothing|dress|undress)\s*(?:status|ability|function|independence)\s*[:;]\s*([^.,;]+)/i,
    /(?:client|patient|individual)\s*(?:is|can|requires)\s*([^.,;]+)\s*(?:with|for|when)\s*(?:dressing|clothing|undressing)/i
  ];
  
  for (const pattern of dressingPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      basicADLs.dressing.status = match[1].trim();
      
      // Look for additional notes
      const notePattern = new RegExp(`(?:dressing|clothing|dress|undress).*?${match[1].trim()}[^.]*\\.\\s*([^.]+)`, 'i');
      const noteMatch = text.match(notePattern);
      if (noteMatch && noteMatch[1]) {
        basicADLs.dressing.notes = noteMatch[1].trim();
      }
      
      break;
    }
  }
  
  // Extract toileting information
  const toiletingPatterns = [
    /(?:toileting|toilet|bathroom|bowel|bladder|continence)\s*[:;]\s*([^.,;]+)/i,
    /(?:toileting|toilet|bathroom|bowel|bladder)\s*(?:status|ability|function|independence)\s*[:;]\s*([^.,;]+)/i,
    /(?:client|patient|individual)\s*(?:is|can|requires)\s*([^.,;]+)\s*(?:with|for|when)\s*(?:toileting|using\s*the\s*bathroom|using\s*the\s*toilet)/i
  ];
  
  for (const pattern of toiletingPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      basicADLs.toileting.status = match[1].trim();
      
      // Look for additional notes
      const notePattern = new RegExp(`(?:toileting|toilet|bathroom|bowel|bladder).*?${match[1].trim()}[^.]*\\.\\s*([^.]+)`, 'i');
      const noteMatch = text.match(notePattern);
      if (noteMatch && noteMatch[1]) {
        basicADLs.toileting.notes = noteMatch[1].trim();
      }
      
      break;
    }
  }
  
  // Extract transfers information
  const transfersPatterns = [
    /(?:transfers|transfer|sit\s*to\s*stand|bed\s*to\s*chair)\s*[:;]\s*([^.,;]+)/i,
    /(?:transfers|transfer)\s*(?:status|ability|function|independence)\s*[:;]\s*([^.,;]+)/i,
    /(?:client|patient|individual)\s*(?:is|can|requires)\s*([^.,;]+)\s*(?:with|for|when)\s*(?:transfers|transferring)/i
  ];
  
  for (const pattern of transfersPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      basicADLs.transfers.status = match[1].trim();
      
      // Look for additional notes
      const notePattern = new RegExp(`(?:transfers|transfer|sit\\s*to\\s*stand).*?${match[1].trim()}[^.]*\\.\\s*([^.]+)`, 'i');
      const noteMatch = text.match(notePattern);
      if (noteMatch && noteMatch[1]) {
        basicADLs.transfers.notes = noteMatch[1].trim();
      }
      
      break;
    }
  }
  
  // Extract mobility information
  const mobilityPatterns = [
    /(?:mobility|ambulation|walking|gait|moving)\s*[:;]\s*([^.,;]+)/i,
    /(?:mobility|ambulation|walking|gait)\s*(?:status|ability|function|independence)\s*[:;]\s*([^.,;]+)/i,
    /(?:client|patient|individual)\s*(?:is|can|requires)\s*([^.,;]+)\s*(?:with|for|when)\s*(?:walking|moving|ambulating)/i
  ];
  
  for (const pattern of mobilityPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      basicADLs.mobility.status = match[1].trim();
      
      // Look for additional notes
      const notePattern = new RegExp(`(?:mobility|ambulation|walking|gait).*?${match[1].trim()}[^.]*\\.\\s*([^.]+)`, 'i');
      const noteMatch = text.match(notePattern);
      if (noteMatch && noteMatch[1]) {
        basicADLs.mobility.notes = noteMatch[1].trim();
      }
      
      break;
    }
  }
  
  // Extract other basic ADLs
  const otherBasicADLPatterns = [
    /(?:also|other|additional)\s*(?:requires|needs|has|demonstrates)\s*(?:assistance|help|support|difficulty)\s*(?:with|for|in)\s*([^.,;]+)/i,
    /(?:assistance|help|support|difficulty)\s*(?:also|is\s*also|needed|required)\s*(?:with|for|in)\s*([^.,;]+)/i
  ];
  
  for (const pattern of otherBasicADLPatterns) {
    const matches = text.match(new RegExp(pattern, 'gi'));
    if (matches && matches.length > 0) {
      matches.forEach(matchText => {
        const otherMatch = matchText.match(pattern);
        if (otherMatch && otherMatch[1]) {
          // Check if this is already covered in one of the specific categories
          const otherADL = otherMatch[1].trim();
          const lowerOtherADL = otherADL.toLowerCase();
          
          if (!lowerOtherADL.includes('feeding') && 
              !lowerOtherADL.includes('eating') && 
              !lowerOtherADL.includes('bathing') && 
              !lowerOtherADL.includes('shower') && 
              !lowerOtherADL.includes('grooming') && 
              !lowerOtherADL.includes('hygiene') && 
              !lowerOtherADL.includes('dressing') && 
              !lowerOtherADL.includes('clothing') && 
              !lowerOtherADL.includes('toilet') && 
              !lowerOtherADL.includes('bathroom') && 
              !lowerOtherADL.includes('transfer') && 
              !lowerOtherADL.includes('mobility') && 
              !lowerOtherADL.includes('walking') && 
              !lowerOtherADL.includes('ambulation')) {
            basicADLs.other.push(otherADL);
          }
        }
      });
    }
  }
  
  return basicADLs;
}
