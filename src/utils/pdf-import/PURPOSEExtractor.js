// Purpose & Methodology Section Extractor
// Auto-generated on 2025-02-28
// Part of Delilah V3.0 PDF Import Pattern Recognition

class PURPOSEExtractor {
  /**
   * Extract purpose & methodology data from text
   * @param {string} text - Section text content
   * @returns {Object} Extracted purpose & methodology data
   */
  static extract(text) {
    const data = {
      assessmentPurpose: '',
      referralSource: '',
      referralDate: '',
      assessmentDate: '',
      methodologies: [],
      assessmentTools: [],
      locationOfAssessment: '',
      otherParticipants: [],
      purposeNotes: '',
      confidence: {}
    };
    
    // Extract assessment purpose
    const purposeMatches = [
      ...text.matchAll(/(?:purpose|reason|objective)(?:\s+of)?(?:\s+the)?(?:\s+assessment|evaluation|report)(?:\s*:|\s*-|\s*–|\s*\*)?\s*([^.]+)/gi),
      ...text.matchAll(/(?:requested|referred)(?:\s+to)?(?:\s+complete|conduct|perform|provide)(?:\s+an)?(?:\s+assessment|evaluation|report)(?:\s+to|for)?\s*([^.]+)/gi)
    ];
    
    if (purposeMatches.length > 0) {
      data.assessmentPurpose = purposeMatches[0][1].trim();
      data.confidence.assessmentPurpose = 0.8;
    } else {
      // If no explicit purpose statement, use the first 1-2 sentences
      const firstSentences = text.split(/[.!?]/).slice(0, 2).join('.').trim() + '.';
      if (firstSentences.length < 200) {
        data.assessmentPurpose = firstSentences;
        data.confidence.assessmentPurpose = 0.5;
      }
    }
    
    // Extract referral source
    const referralSourceMatches = [
      ...text.matchAll(/(?:referred|requested|referral)(?:\s+by|from|source)(?:\s*:|\s*-|\s*–|\s*\*)?\s*([^.,;]+)/gi)
    ];
    
    if (referralSourceMatches.length > 0) {
      data.referralSource = referralSourceMatches[0][1].trim();
      data.confidence.referralSource = 0.8;
    }
    
    // Extract referral date
    const referralDateMatches = [
      ...text.matchAll(/(?:referral|referred|request)(?:\s+date|on)(?:\s*:|\s*-|\s*–|\s*\*)?\s*([^.,;]+)/gi),
      ...text.matchAll(/(?:date\s+of\s+referral)(?:\s*:|\s*-|\s*–|\s*\*)?\s*([^.,;]+)/gi)
    ];
    
    if (referralDateMatches.length > 0) {
      data.referralDate = referralDateMatches[0][1].trim();
      data.confidence.referralDate = 0.8;
    }
    
    // Extract assessment date
    const assessmentDateMatches = [
      ...text.matchAll(/(?:assessment|evaluation|report)(?:\s+date|on)(?:\s*:|\s*-|\s*–|\s*\*)?\s*([^.,;]+)/gi),
      ...text.matchAll(/(?:date\s+of\s+assessment|date\s+of\s+evaluation)(?:\s*:|\s*-|\s*–|\s*\*)?\s*([^.,;]+)/gi),
      ...text.matchAll(/(?:assessed|evaluated|seen|visited)(?:\s+on)(?:\s*:|\s*-|\s*–|\s*\*)?\s*([^.,;]+)/gi)
    ];
    
    if (assessmentDateMatches.length > 0) {
      data.assessmentDate = assessmentDateMatches[0][1].trim();
      data.confidence.assessmentDate = 0.8;
    }
    
    // Extract methodologies
    const methodologyKeywords = [
      'interview', 'observation', 'assessment', 'evaluation', 'review', 
      'testing', 'examination', 'questionnaire', 'screening', 'measurement'
    ];
    
    const lines = text.split('\n');
    let inMethodologySection = false;
    
    lines.forEach(line => {
      const trimmedLine = line.trim().toLowerCase();
      
      // Check if this line appears to start a methodology description
      if (/(?:methodology|method|approach|conducted|completed|performed|proceeded)(?:\s*:|\s*-|\s*–|\s*\*)?/i.test(trimmedLine)) {
        inMethodologySection = true;
      }
      
      // Check if we're in a methodology section or if this line contains methodology information
      if (inMethodologySection || 
          methodologyKeywords.some(keyword => trimmedLine.includes(keyword))) {
        
        // Look for bullet points or numbered items
        if (/^\s*[•\-*\d.)\s]+/.test(trimmedLine)) {
          const methodology = line.replace(/^\s*[•\-*\d.)\s]+/, '').trim();
          
          if (methodology.length > 0 && !data.methodologies.includes(methodology)) {
            data.methodologies.push(methodology);
          }
        }
        // Or look for methodology keywords
        else if (methodologyKeywords.some(keyword => trimmedLine.includes(keyword))) {
          // Find sentences containing methodology keywords
          const methodologySentences = line.split(/[.!?]/)
            .filter(sentence => 
              methodologyKeywords.some(keyword => 
                sentence.toLowerCase().includes(keyword)
              )
            )
            .map(sentence => sentence.trim() + '.');
          
          methodologySentences.forEach(sentence => {
            if (sentence.length > 5 && !data.methodologies.includes(sentence)) {
              data.methodologies.push(sentence);
            }
          });
        }
      }
      
      // Check if this line ends the methodology section
      if (inMethodologySection && 
          (trimmedLine.length === 0 || 
           /(?:results|findings|assessment|observation)/i.test(trimmedLine))) {
        inMethodologySection = false;
      }
    });
    
    data.confidence.methodologies = data.methodologies.length > 0 ? 0.7 : 0;
    
    // Extract assessment tools
    const assessmentToolMatches = [
      ...text.matchAll(/(?:assessment tools|standardized tools|standardized assessments|assessments used|measures|scales)(?:\s*:|\s*-|\s*–|\s*\*)?\s*([^.]+)/gi)
    ];
    
    if (assessmentToolMatches.length > 0) {
      // Extract the tools list
      const toolsText = assessmentToolMatches[0][1].trim();
      
      // Split by common list separators
      const tools = toolsText.split(/[,;]|and\s+(?=[a-z])/i)
        .map(tool => tool.trim())
        .filter(tool => tool.length > 0);
      
      data.assessmentTools = tools;
      data.confidence.assessmentTools = 0.8;
    } else {
      // Look for common assessment tool names
      const commonTools = [
        'Berg Balance Scale', 'BBS', 'Barthel Index', 'FIM', 
        'Functional Independence Measure', 'Lawton IADL', 'COPM',
        'Canadian Occupational Performance Measure', 'MoCA', 'Montreal Cognitive Assessment',
        'Timed Up and Go', 'TUG', 'Short Physical Performance Battery', 'SPPB',
        'Assessment of Motor and Process Skills', 'AMPS', 'PHQ-9',
        'Patient Health Questionnaire', 'GAD-7', 'Generalized Anxiety Disorder'
      ];
      
      commonTools.forEach(tool => {
        if (text.includes(tool)) {
          data.assessmentTools.push(tool);
        }
      });
      
      data.confidence.assessmentTools = data.assessmentTools.length > 0 ? 0.6 : 0;
    }
    
    // Extract location of assessment
    const locationMatches = [
      ...text.matchAll(/(?:location|setting|place|site|conducted|performed|completed)(?:\s+at|in|of)(?:\s+the)?(?:\s+assessment|evaluation|visit|interview)?(?:\s*:|\s*-|\s*–|\s*\*)?\s*([^.,;]+)/gi),
      ...text.matchAll(/(?:assessment|evaluation|visited)(?:\s+was)?(?:\s+conducted|performed|completed|carried out)(?:\s+at|in)(?:\s*:|\s*-|\s*–|\s*\*)?\s*([^.,;]+)/gi),
      ...text.matchAll(/(?:home\s+visit|visited\s+client|visited\s+patient)(?:\s+at)?(?:\s*:|\s*-|\s*–|\s*\*)?\s*([^.,;]+)/gi)
    ];
    
    if (locationMatches.length > 0) {
      data.locationOfAssessment = locationMatches[0][1].trim();
      data.confidence.locationOfAssessment = 0.7;
    }
    
    // Extract other participants
    const participantMatches = [
      ...text.matchAll(/(?:present|attended|accompanied|present\s+during|participated|interview\s+with)(?:\s+the)?(?:\s+assessment|evaluation|visit|interview)?(?:\s*:|\s*-|\s*–|\s*\*)?\s*([^.]+)/gi),
      ...text.matchAll(/(?:family\s+members?|caregivers?|spouses?|partners?)(?:\s+present|attended|accompanied|participated)?(?:\s*:|\s*-|\s*–|\s*\*)?\s*([^.,;]*)/gi)
    ];
    
    if (participantMatches.length > 0) {
      // Extract participant names/roles
      const participantsText = participantMatches[0][0].trim();
      
      // Split by common separators
      const participants = participantsText.split(/[,;]|and\s+(?=[a-z])/i)
        .map(participant => participant.trim())
        .filter(participant => 
          participant.length > 0 && 
          !/(?:present|attended|accompanied|present\s+during|participated|interview\s+with|assessment|evaluation)/i.test(participant)
        );
      
      data.otherParticipants = participants;
      data.confidence.otherParticipants = 0.7;
    }
    
    // Add the full text as purpose notes
    data.purposeNotes = text;
    
    return data;
  }
}

module.exports = PURPOSEExtractor;
