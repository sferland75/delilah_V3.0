// Functional Status Section Extractor
// Auto-generated on 2025-02-28
// Part of Delilah V3.0 PDF Import Pattern Recognition

class FUNCTIONAL_STATUSExtractor {
  /**
   * Extract functional status data from text
   * @param {string} text - Section text content
   * @returns {Object} Extracted functional status data
   */
  static extract(text) {
    const data = {
      mobilityStatus: '',
      transferStatus: '',
      balanceStatus: '',
      functionalLimitations: [],
      assistiveDevices: [],
      safety: {
        fallRisk: '',
        fallHistory: '',
        safetyPrecautions: []
      },
      endurance: '',
      functionalGoals: [],
      notes: '',
      confidence: {}
    };
    
    // Extract mobility status
    const mobilityMatches = [
      ...text.matchAll(/(?:mobility|ambulation|gait|walking)(?:\s+status)?(?:\s*:|\s*-|\s*–|\s*\*)?\s*([^.]+)/gi)
    ];
    
    if (mobilityMatches.length > 0) {
      data.mobilityStatus = mobilityMatches[0][1].trim();
      data.confidence.mobilityStatus = 0.8;
    } else {
      // Look for mobility descriptions
      const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
      
      for (const sentence of sentences) {
        const lowerSentence = sentence.toLowerCase();
        
        if ((lowerSentence.includes('walk') || 
             lowerSentence.includes('mobil') || 
             lowerSentence.includes('ambul') || 
             lowerSentence.includes('gait')) && 
            !lowerSentence.includes('goal') && 
            !lowerSentence.includes('recommend') && 
            sentence.length < 200) {
          
          data.mobilityStatus = sentence.trim();
          data.confidence.mobilityStatus = 0.7;
          break;
        }
      }
    }
    
    // Extract transfer status
    const transferMatches = [
      ...text.matchAll(/(?:transfer|bed\s+mobility|sit[\s\-]to[\s\-]stand)(?:\s+status)?(?:\s*:|\s*-|\s*–|\s*\*)?\s*([^.]+)/gi)
    ];
    
    if (transferMatches.length > 0) {
      data.transferStatus = transferMatches[0][1].trim();
      data.confidence.transferStatus = 0.8;
    } else {
      // Look for transfer descriptions
      const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
      
      for (const sentence of sentences) {
        const lowerSentence = sentence.toLowerCase();
        
        if ((lowerSentence.includes('transfer') || 
             lowerSentence.includes('sit to stand') || 
             lowerSentence.includes('sit-to-stand') || 
             lowerSentence.includes('bed mobility')) && 
            !lowerSentence.includes('goal') && 
            !lowerSentence.includes('recommend') && 
            sentence.length < 200) {
          
          data.transferStatus = sentence.trim();
          data.confidence.transferStatus = 0.7;
          break;
        }
      }
    }
    
    // Extract balance status
    const balanceMatches = [
      ...text.matchAll(/(?:balance|stability|steadiness)(?:\s+status)?(?:\s*:|\s*-|\s*–|\s*\*)?\s*([^.]+)/gi)
    ];
    
    if (balanceMatches.length > 0) {
      data.balanceStatus = balanceMatches[0][1].trim();
      data.confidence.balanceStatus = 0.8;
    }
    
    // Extract functional limitations
    const lines = text.split('\n');
    let inLimitationsList = false;
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      // Check if this line appears to start a limitations list
      if (/(?:functional\s+limitations|limitations|deficits|restrictions|impairments|limited\s+in)(?:\s*:|\s*-|\s*–|\s*\*)?/i.test(trimmedLine)) {
        inLimitationsList = true;
        return; // Skip this line as it's a header
      }
      
      // Check if we're in a limitations list and this line has a bullet point or number
      if (inLimitationsList && /^\s*[•\-*\d.)\s]+/.test(trimmedLine)) {
        const limitation = trimmedLine.replace(/^\s*[•\-*\d.)\s]+/, '').trim();
        
        if (limitation.length > 0 && !data.functionalLimitations.includes(limitation)) {
          data.functionalLimitations.push(limitation);
        }
      }
      
      // Check if this line ends the limitations list
      if (inLimitationsList && 
          (trimmedLine.length === 0 || 
           /(?:assistive|devices|goals|assessment|endurance|adaptive|equipment)/i.test(trimmedLine))) {
        inLimitationsList = false;
      }
    });
    
    // If no limitations were found with bullets, try to extract them differently
    if (data.functionalLimitations.length === 0) {
      const limitationKeywords = [
        'difficulty with', 'unable to', 'limited in', 'limited ability', 
        'impaired', 'deficit', 'restriction', 'cannot'
      ];
      
      // Extract sentences containing limitation keywords
      const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
      
      sentences.forEach(sentence => {
        const lowerSentence = sentence.toLowerCase();
        
        if (limitationKeywords.some(keyword => lowerSentence.includes(keyword)) && 
            !data.functionalLimitations.includes(sentence.trim()) && 
            sentence.length < 200) {
          
          data.functionalLimitations.push(sentence.trim());
        }
      });
    }
    
    data.confidence.functionalLimitations = data.functionalLimitations.length > 0 ? 0.8 : 0;
    
    // Extract assistive devices
    const deviceMatches = [
      ...text.matchAll(/(?:assistive\s+devices?|adaptive\s+equipment|aid|uses?|equipment|mobility\s+aids?)(?:\s*:|\s*-|\s*–|\s*\*)?\s*([^.]+)/gi)
    ];
    
    if (deviceMatches.length > 0) {
      // Split by commas or 'and'
      const devices = deviceMatches[0][1].split(/[,;]|\s+and\s+/)
        .map(device => device.trim())
        .filter(device => device.length > 0);
      
      data.assistiveDevices = devices;
      data.confidence.assistiveDevices = 0.8;
    } else {
      // Look for common assistive devices
      const deviceKeywords = [
        'walker', 'cane', 'wheelchair', 'scooter', 'rollator', 'crutches', 
        'quad cane', 'gait aid', 'grab bars', 'raised toilet seat', 'commode'
      ];
      
      const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
      
      sentences.forEach(sentence => {
        const lowerSentence = sentence.toLowerCase();
        
        deviceKeywords.forEach(device => {
          if (lowerSentence.includes(device) && 
              !data.assistiveDevices.includes(device)) {
            data.assistiveDevices.push(device);
            data.confidence.assistiveDevices = 0.7;
          }
        });
      });
    }
    
    // Extract fall risk and history
    const fallRiskMatches = [
      ...text.matchAll(/(?:fall\s+risk|risk\s+of\s+falls?|risk\s+for\s+falls?)(?:\s*:|\s*-|\s*–|\s*\*)?\s*([^.]+)/gi)
    ];
    
    if (fallRiskMatches.length > 0) {
      data.safety.fallRisk = fallRiskMatches[0][1].trim();
      data.confidence.fallRisk = 0.8;
    }
    
    const fallHistoryMatches = [
      ...text.matchAll(/(?:fall\s+history|history\s+of\s+falls?|previous\s+falls?|reported\s+falls?)(?:\s*:|\s*-|\s*–|\s*\*)?\s*([^.]+)/gi)
    ];
    
    if (fallHistoryMatches.length > 0) {
      data.safety.fallHistory = fallHistoryMatches[0][1].trim();
      data.confidence.fallHistory = 0.8;
    } else {
      // Look for fall history in sentences
      const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
      
      for (const sentence of sentences) {
        const lowerSentence = sentence.toLowerCase();
        
        if ((lowerSentence.includes('fall') || lowerSentence.includes('fell')) && 
            (lowerSentence.includes('time') || 
             lowerSentence.includes('occasion') || 
             lowerSentence.includes('reported') || 
             lowerSentence.includes('history') || 
             /\d+/.test(lowerSentence))) {
          
          data.safety.fallHistory = sentence.trim();
          data.confidence.fallHistory = 0.7;
          break;
        }
      }
    }
    
    // Extract safety precautions
    const safetyPrecautionMatches = [
      ...text.matchAll(/(?:safety\s+precautions?|precautions?|safety\s+measures?|safety\s+needs?|safety\s+recommendations?)(?:\s*:|\s*-|\s*–|\s*\*)?\s*([^.]+)/gi)
    ];
    
    if (safetyPrecautionMatches.length > 0) {
      // Split by commas or 'and'
      const precautions = safetyPrecautionMatches[0][1].split(/[,;]|\s+and\s+/)
        .map(precaution => precaution.trim())
        .filter(precaution => precaution.length > 0);
      
      data.safety.safetyPrecautions = precautions;
      data.confidence.safetyPrecautions = 0.8;
    }
    
    // Extract endurance
    const enduranceMatches = [
      ...text.matchAll(/(?:endurance|stamina|activity\s+tolerance|fatigue)(?:\s*:|\s*-|\s*–|\s*\*)?\s*([^.]+)/gi)
    ];
    
    if (enduranceMatches.length > 0) {
      data.endurance = enduranceMatches[0][1].trim();
      data.confidence.endurance = 0.8;
    }
    
    // Extract functional goals
    let inGoalsList = false;
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      // Check if this line appears to start a goals list
      if (/(?:goals?|functional\s+goals?|treatment\s+goals?|rehabilitation\s+goals?)(?:\s*:|\s*-|\s*–|\s*\*)?/i.test(trimmedLine)) {
        inGoalsList = true;
        return; // Skip this line as it's a header
      }
      
      // Check if we're in a goals list and this line has a bullet point or number
      if (inGoalsList && /^\s*[•\-*\d.)\s]+/.test(trimmedLine)) {
        const goal = trimmedLine.replace(/^\s*[•\-*\d.)\s]+/, '').trim();
        
        if (goal.length > 0 && !data.functionalGoals.includes(goal)) {
          data.functionalGoals.push(goal);
        }
      }
      
      // Check if this line ends the goals list
      if (inGoalsList && 
          (trimmedLine.length === 0 || 
           /(?:assessment|conclusion|summary|recommendation)/i.test(trimmedLine))) {
        inGoalsList = false;
      }
    });
    
    data.confidence.functionalGoals = data.functionalGoals.length > 0 ? 0.8 : 0;
    
    // Add the full text as notes
    data.notes = text;
    
    return data;
  }
}

module.exports = FUNCTIONAL_STATUSExtractor;
