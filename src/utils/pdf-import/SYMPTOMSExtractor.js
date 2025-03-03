// Symptoms Section Extractor
// Auto-generated on 2025-02-28
// Part of Delilah V3.0 PDF Import Pattern Recognition

class SYMPTOMSExtractor {
  /**
   * Extract symptoms data from text
   * @param {string} text - Section text content
   * @returns {Object} Extracted symptoms data
   */
  static extract(text) {
    const data = {
      reportedSymptoms: [],
      painDescription: '',
      painLocation: [],
      painIntensity: '',
      aggravatingFactors: [],
      relievingFactors: [],
      functionalImpact: [],
      symptomOnset: '',
      symptomProgression: '',
      symptomNotes: '',
      confidence: {}
    };
    
    // Extract reported symptoms
    const lines = text.split('\n');
    let inSymptomsList = false;
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      // Check if this line appears to start a symptoms list
      if (/(?:symptoms?|complaints?|problems?|difficulties|chief\s+complaint|reported\s+symptoms?)(?:\s*:|\s*-|\s*–|\s*\*)?/i.test(trimmedLine)) {
        inSymptomsList = true;
        return; // Skip this line as it's a header
      }
      
      // Check if we're in a symptoms list and this line has a bullet point or number
      if (inSymptomsList && /^\s*[•\-*\d.)\s]+/.test(trimmedLine)) {
        const symptom = trimmedLine.replace(/^\s*[•\-*\d.)\s]+/, '').trim();
        
        if (symptom.length > 0 && !data.reportedSymptoms.includes(symptom)) {
          data.reportedSymptoms.push(symptom);
        }
      }
      
      // Check if this line ends the symptoms list
      if (inSymptomsList && 
          (trimmedLine.length === 0 || 
           /(?:assessment|functional|status|pain|description|onset|duration)/i.test(trimmedLine))) {
        inSymptomsList = false;
      }
    });
    
    // If no symptoms were found with bullets, try to extract them differently
    if (data.reportedSymptoms.length === 0) {
      const symptomKeywords = [
        'pain', 'discomfort', 'ache', 'soreness', 'stiffness', 'weakness', 
        'numbness', 'tingling', 'difficulty', 'unable to', 'limited', 'restriction'
      ];
      
      // Extract sentences containing symptom keywords
      const symptomSentences = text.match(/[^.!?]+[.!?]+/g) || [];
      
      symptomSentences.forEach(sentence => {
        const lowerSentence = sentence.toLowerCase();
        
        if (symptomKeywords.some(keyword => lowerSentence.includes(keyword)) && 
            !data.reportedSymptoms.includes(sentence.trim())) {
          
          // Only include reasonably sized sentences
          if (sentence.length < 200) {
            data.reportedSymptoms.push(sentence.trim());
          }
        }
      });
    }
    
    data.confidence.reportedSymptoms = data.reportedSymptoms.length > 0 ? 0.8 : 0;
    
    // Extract pain description
    const painMatches = [
      ...text.matchAll(/(?:pain\s+description|description\s+of\s+pain|pain\s+is\s+described\s+as)(?:\s*:|\s*-|\s*–|\s*\*)?\s*([^.]+)/gi)
    ];
    
    if (painMatches.length > 0) {
      data.painDescription = painMatches[0][1].trim();
      data.confidence.painDescription = 0.8;
    } else {
      // Try to find pain descriptors
      const painDescriptors = [
        'sharp', 'dull', 'aching', 'throbbing', 'stabbing', 'burning', 
        'shooting', 'radiating', 'pulsating', 'gnawing', 'cramping'
      ];
      
      const painSentences = text.match(/[^.!?]+[.!?]+/g) || [];
      
      for (const sentence of painSentences) {
        const lowerSentence = sentence.toLowerCase();
        
        if (lowerSentence.includes('pain') && 
            painDescriptors.some(descriptor => lowerSentence.includes(descriptor))) {
          data.painDescription = sentence.trim();
          data.confidence.painDescription = 0.7;
          break;
        }
      }
    }
    
    // Extract pain location
    const locationMatches = [
      ...text.matchAll(/(?:pain\s+location|location\s+of\s+pain|pain\s+in)(?:\s*:|\s*-|\s*–|\s*\*)?\s*([^.]+)/gi)
    ];
    
    if (locationMatches.length > 0) {
      // Split by commas or 'and'
      const locations = locationMatches[0][1].split(/[,;]|\s+and\s+/)
        .map(loc => loc.trim())
        .filter(loc => loc.length > 0);
      
      data.painLocation = locations;
      data.confidence.painLocation = 0.8;
    } else {
      // Try to find body parts mentioned with pain
      const bodyParts = [
        'head', 'neck', 'shoulder', 'arm', 'elbow', 'wrist', 'hand', 'finger', 
        'chest', 'back', 'spine', 'hip', 'leg', 'knee', 'ankle', 'foot', 'toe'
      ];
      
      const painLocationSentences = text.match(/[^.!?]+[.!?]+/g) || [];
      
      for (const sentence of painLocationSentences) {
        const lowerSentence = sentence.toLowerCase();
        
        if (lowerSentence.includes('pain')) {
          bodyParts.forEach(part => {
            if (lowerSentence.includes(part) && !data.painLocation.includes(part)) {
              data.painLocation.push(part);
              data.confidence.painLocation = 0.7;
            }
          });
        }
      }
    }
    
    // Extract pain intensity
    const intensityMatches = [
      ...text.matchAll(/(?:pain\s+intensity|pain\s+level|pain\s+score|intensity\s+of\s+pain|pain\s+rating|rated\s+(?:pain|it)\s+as)(?:\s*:|\s*-|\s*–|\s*\*)?\s*([^.]+)/gi),
      ...text.matchAll(/(?:pain)(?:\s+is)?\s+(?:rated|scored)(?:\s+as)?\s*(\d+\/\d+|\d+\s*(?:out of|on a scale of)\s*\d+)/gi)
    ];
    
    if (intensityMatches.length > 0) {
      data.painIntensity = intensityMatches[0][1].trim();
      data.confidence.painIntensity = 0.8;
    }
    
    // Extract aggravating factors
    const aggravatingMatches = [
      ...text.matchAll(/(?:aggravating\s+factors|worsen(?:s|ed|ing)?|exacerbate(?:s|d|ing)?|increase(?:s|d|ing)?\s+(?:pain|symptoms)|makes?\s+(?:pain|symptoms|it)\s+worse)(?:\s*:|\s*-|\s*–|\s*\*)?\s*([^.]+)/gi)
    ];
    
    if (aggravatingMatches.length > 0) {
      // Split by commas or 'and'
      const factors = aggravatingMatches[0][1].split(/[,;]|\s+and\s+/)
        .map(factor => factor.trim())
        .filter(factor => factor.length > 0);
      
      data.aggravatingFactors = factors;
      data.confidence.aggravatingFactors = 0.8;
    }
    
    // Extract relieving factors
    const relievingMatches = [
      ...text.matchAll(/(?:relieving\s+factors|alleviat(?:es|ed|ing)|decrease(?:s|d|ing)?\s+(?:pain|symptoms)|makes?\s+(?:pain|symptoms|it)\s+better|helps?)(?:\s*:|\s*-|\s*–|\s*\*)?\s*([^.]+)/gi)
    ];
    
    if (relievingMatches.length > 0) {
      // Split by commas or 'and'
      const factors = relievingMatches[0][1].split(/[,;]|\s+and\s+/)
        .map(factor => factor.trim())
        .filter(factor => factor.length > 0);
      
      data.relievingFactors = factors;
      data.confidence.relievingFactors = 0.8;
    }
    
    // Extract functional impact
    const impactMatches = [
      ...text.matchAll(/(?:functional\s+impact|impact\s+on\s+function|affects?\s+(?:ability|function)|limits?\s+(?:ability|function)|unable\s+to|difficulty\s+with|limited\s+in)(?:\s*:|\s*-|\s*–|\s*\*)?\s*([^.]+)/gi)
    ];
    
    if (impactMatches.length > 0) {
      // Split by commas or 'and'
      const impacts = impactMatches[0][1].split(/[,;]|\s+and\s+/)
        .map(impact => impact.trim())
        .filter(impact => impact.length > 0);
      
      data.functionalImpact = impacts;
      data.confidence.functionalImpact = 0.8;
    } else {
      // Look for functional impact keywords
      const functionKeywords = [
        'unable to', 'difficulty with', 'limited in', 'cannot', 'struggles to'
      ];
      
      const impactSentences = text.match(/[^.!?]+[.!?]+/g) || [];
      
      for (const sentence of impactSentences) {
        const lowerSentence = sentence.toLowerCase();
        
        if (functionKeywords.some(keyword => lowerSentence.includes(keyword))) {
          // Only include reasonably sized sentences
          if (sentence.length < 200) {
            data.functionalImpact.push(sentence.trim());
            data.confidence.functionalImpact = 0.7;
          }
        }
      }
    }
    
    // Extract symptom onset
    const onsetMatches = [
      ...text.matchAll(/(?:onset|started|began|since|initiated|origin|first\s+occurred|first\s+noticed|start\s+of\s+symptoms|when\s+symptoms\s+began)(?:\s*:|\s*-|\s*–|\s*\*)?\s*([^.]+)/gi)
    ];
    
    if (onsetMatches.length > 0) {
      data.symptomOnset = onsetMatches[0][1].trim();
      data.confidence.symptomOnset = 0.8;
    }
    
    // Extract symptom progression
    const progressionMatches = [
      ...text.matchAll(/(?:progression|course|over\s+time|evolved|changed|worsened|improved|fluctuated)(?:\s*:|\s*-|\s*–|\s*\*)?\s*([^.]+)/gi)
    ];
    
    if (progressionMatches.length > 0) {
      data.symptomProgression = progressionMatches[0][1].trim();
      data.confidence.symptomProgression = 0.8;
    }
    
    // Add the full text as symptom notes
    data.symptomNotes = text;
    
    return data;
  }
}

module.exports = SYMPTOMSExtractor;
