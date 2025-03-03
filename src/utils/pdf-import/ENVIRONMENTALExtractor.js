// Environmental Assessment Section Extractor
// Auto-generated on 2025-02-28
// Part of Delilah V3.0 PDF Import Pattern Recognition

class ENVIRONMENTALExtractor {
  /**
   * Extract environmental assessment data from text
   * @param {string} text - Section text content
   * @returns {Object} Extracted environmental data
   */
  static extract(text) {
    const data = {
      homeType: '',
      livingArrangement: '',
      homeLayout: [],
      access: {
        entrance: '',
        bathroom: '',
        bedroom: '',
        kitchen: ''
      },
      barriers: [],
      recommendations: [],
      safetyRisks: [],
      environmentalNotes: '',
      confidence: {}
    };
    
    // Extract home type (house, apartment, etc.)
    const homeTypeMatches = [
      ...text.matchAll(/(?:home\s+type|residence\s+type|dwelling\s+type|type\s+of\s+home|type\s+of\s+residence|type\s+of\s+dwelling|lives\s+in\s+a|resides\s+in\s+a)(?:\s*:|\s*-|\s*–|\s*\*)?\s*([^.,\n]+)/gi),
      ...text.matchAll(/(?:a|the)\s+(house|apartment|condo|condominium|townhouse|bungalow|mobile\s+home|duplex|semi-detached|detached|two-storey)/gi)
    ];
    
    if (homeTypeMatches.length > 0) {
      data.homeType = homeTypeMatches[0][1].trim();
      data.confidence.homeType = 0.8;
    }
    
    // Extract living arrangement
    const livingArrangementMatches = [
      ...text.matchAll(/(?:living\s+arrangement|lives\s+with|resides\s+with|household\s+composition)(?:\s*:|\s*-|\s*–|\s*\*)?\s*([^.,\n]+)/gi),
      ...text.matchAll(/(?:lives|resides)\s+(?:alone|with\s+[^.,\n]+)/gi)
    ];
    
    if (livingArrangementMatches.length > 0) {
      data.livingArrangement = livingArrangementMatches[0][1] ? 
                              livingArrangementMatches[0][1].trim() : 
                              livingArrangementMatches[0][0].replace(/(?:lives|resides)\s+/, '').trim();
      data.confidence.livingArrangement = 0.8;
    }
    
    // Extract home layout and structure
    const layoutKeywords = ['level', 'story', 'storey', 'floor', 'bedroom', 'bathroom', 'kitchen', 
                           'living room', 'dining', 'basement', 'stair', 'hallway', 'door', 'entrance'];
    
    const lines = text.split('\n');
    let inLayoutSection = false;
    
    lines.forEach(line => {
      const trimmedLine = line.trim().toLowerCase();
      
      // Check if this line appears to start a layout description
      if (/(?:home\s+layout|house\s+layout|layout\s+of\s+the\s+home|floor\s+plan|physical\s+layout)(?:\s*:|\s*-|\s*–|\s*\*)?/i.test(trimmedLine)) {
        inLayoutSection = true;
        return; // Skip this line as it's a header
      }
      
      // Check if we're in a layout section or if this line contains layout information
      if ((inLayoutSection || 
           layoutKeywords.some(keyword => trimmedLine.includes(keyword))) && 
          trimmedLine.length > 0 && 
          !/(?:barriers|hazards|safety concerns|recommendations)/i.test(trimmedLine)) {
        
        // Extract layout information
        if (trimmedLine.length < 200) { // Reasonable length for a layout description line
          data.homeLayout.push(line.trim());
        }
      }
      
      // Check if this line ends the layout section
      if (inLayoutSection && 
          (trimmedLine.length === 0 || 
           /(?:barriers|hazards|safety concerns|recommendations|assessment)/i.test(trimmedLine))) {
        inLayoutSection = false;
      }
    });
    
    data.confidence.homeLayout = data.homeLayout.length > 0 ? 0.7 : 0;
    
    // Extract access information for specific areas
    
    // Entrance access
    const entranceMatches = [
      ...text.matchAll(/(?:entrance|entry|access\s+to\s+home|home\s+entrance)(?:\s*:|\s*-|\s*–|\s*\*)?\s*([^.,\n]{3,}(?:[^\n.]*)?)/gi)
    ];
    
    if (entranceMatches.length > 0) {
      data.access.entrance = entranceMatches[0][1].trim();
      data.confidence.entranceAccess = 0.7;
    }
    
    // Bathroom access
    const bathroomMatches = [
      ...text.matchAll(/(?:bathroom|washroom|toilet|shower|bath)(?:\s+access)?(?:\s*:|\s*-|\s*–|\s*\*)?\s*([^.,\n]{3,}(?:[^\n.]*)?)/gi)
    ];
    
    if (bathroomMatches.length > 0) {
      data.access.bathroom = bathroomMatches[0][1].trim();
      data.confidence.bathroomAccess = 0.7;
    }
    
    // Bedroom access
    const bedroomMatches = [
      ...text.matchAll(/(?:bedroom|sleeping\s+area)(?:\s+access)?(?:\s*:|\s*-|\s*–|\s*\*)?\s*([^.,\n]{3,}(?:[^\n.]*)?)/gi)
    ];
    
    if (bedroomMatches.length > 0) {
      data.access.bedroom = bedroomMatches[0][1].trim();
      data.confidence.bedroomAccess = 0.7;
    }
    
    // Kitchen access
    const kitchenMatches = [
      ...text.matchAll(/(?:kitchen|cooking\s+area)(?:\s+access)?(?:\s*:|\s*-|\s*–|\s*\*)?\s*([^.,\n]{3,}(?:[^\n.]*)?)/gi)
    ];
    
    if (kitchenMatches.length > 0) {
      data.access.kitchen = kitchenMatches[0][1].trim();
      data.confidence.kitchenAccess = 0.7;
    }
    
    // Extract barriers
    let inBarriersSection = false;
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      // Check if this line appears to start a barriers list
      if (/(?:barriers|obstacles|hazards|challenges|difficulties|safety\s+concerns)(?:\s*:|\s*-|\s*–|\s*\*)?/i.test(trimmedLine)) {
        inBarriersSection = true;
        return; // Skip this line as it's a header
      }
      
      // Check if we're in a barriers section and this line has a bullet point or number
      if (inBarriersSection && /^\s*[•\-*\d.)\s]+/.test(trimmedLine)) {
        const barrier = trimmedLine.replace(/^\s*[•\-*\d.)\s]+/, '').trim();
        
        if (barrier.length > 0 && !data.barriers.includes(barrier)) {
          data.barriers.push(barrier);
        }
      }
      
      // Check if this line ends the barriers section
      if (inBarriersSection && 
          (trimmedLine.length === 0 || 
           /(?:recommendations|modifications|adaptations|suggested|assessment)/i.test(trimmedLine))) {
        inBarriersSection = false;
      }
    });
    
    data.confidence.barriers = data.barriers.length > 0 ? 0.8 : 0;
    
    // Extract recommendations
    let inRecommendationsSection = false;
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      // Check if this line appears to start a recommendations list
      if (/(?:recommendations|modifications|adaptations|suggested\s+changes|home\s+modifications)(?:\s*:|\s*-|\s*–|\s*\*)?/i.test(trimmedLine)) {
        inRecommendationsSection = true;
        return; // Skip this line as it's a header
      }
      
      // Check if we're in a recommendations section and this line has a bullet point or number
      if (inRecommendationsSection && /^\s*[•\-*\d.)\s]+/.test(trimmedLine)) {
        const recommendation = trimmedLine.replace(/^\s*[•\-*\d.)\s]+/, '').trim();
        
        if (recommendation.length > 0 && !data.recommendations.includes(recommendation)) {
          data.recommendations.push(recommendation);
        }
      }
      
      // Check if this line ends the recommendations section
      if (inRecommendationsSection && 
          (trimmedLine.length === 0 || 
           /(?:conclusion|summary|assessment)/i.test(trimmedLine))) {
        inRecommendationsSection = false;
      }
    });
    
    data.confidence.recommendations = data.recommendations.length > 0 ? 0.8 : 0;
    
    // Extract safety risks
    let inSafetySection = false;
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      // Check if this line appears to start a safety risks list
      if (/(?:safety\s+risks|safety\s+concerns|fall\s+risks|hazards|risks|dangers)(?:\s*:|\s*-|\s*–|\s*\*)?/i.test(trimmedLine)) {
        inSafetySection = true;
        return; // Skip this line as it's a header
      }
      
      // Check if we're in a safety section and this line has a bullet point or number
      if (inSafetySection && /^\s*[•\-*\d.)\s]+/.test(trimmedLine)) {
        const risk = trimmedLine.replace(/^\s*[•\-*\d.)\s]+/, '').trim();
        
        if (risk.length > 0 && !data.safetyRisks.includes(risk)) {
          data.safetyRisks.push(risk);
        }
      }
      
      // Check if this line ends the safety section
      if (inSafetySection && 
          (trimmedLine.length === 0 || 
           /(?:recommendations|modifications|adaptations|assessment)/i.test(trimmedLine))) {
        inSafetySection = false;
      }
    });
    
    data.confidence.safetyRisks = data.safetyRisks.length > 0 ? 0.7 : 0;
    
    // Add the full text as environmental notes
    data.environmentalNotes = text;
    
    return data;
  }
}

module.exports = ENVIRONMENTALExtractor;
