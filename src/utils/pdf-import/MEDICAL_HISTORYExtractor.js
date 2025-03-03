// Medical History Section Extractor
// Auto-generated on 2025-02-28
// Part of Delilah V3.0 PDF Import Pattern Recognition

class MEDICAL_HISTORYExtractor {
  /**
   * Extract medical history data from text
   * @param {string} text - Section text content
   * @returns {Object} Extracted medical history data
   */
  static extract(text) {
    const data = {
      conditions: [],
      diagnoses: [],
      surgeries: [],
      medications: [],
      allergies: [],
      primaryDiagnosis: '',
      secondaryDiagnoses: [],
      medicalNotes: '',
      confidence: {}
    };
    
    // Extract diagnoses (primary and others)
    const diagnosisMatches = [
      ...text.matchAll(/(?:diagnosis|diagnoses|diagnosed\s+with)(?:\s*:|\s*-|\s*–|\s*\*)?\s*([^.]+)/gi)
    ];
    
    if (diagnosisMatches.length > 0) {
      // The first match is likely the primary diagnosis
      data.primaryDiagnosis = diagnosisMatches[0][1].trim();
      data.confidence.primaryDiagnosis = 0.8;
      
      // Extract all diagnoses
      diagnosisMatches.forEach(match => {
        const diagnosis = match[1].trim();
        data.diagnoses.push(diagnosis);
      });
      
      data.confidence.diagnoses = 0.8;
    }
    
    // Extract medical conditions from bullet points or numbered lists
    const lines = text.split('\n');
    let inConditionsList = false;
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      // Check if this line appears to start a conditions list
      if (/(?:conditions?|problems?|diagnoses|medical\s+history)(?:\s*:|\s*-|\s*–|\s*\*)?/i.test(trimmedLine)) {
        inConditionsList = true;
        return; // Skip this line as it's a header
      }
      
      // Check if we're in a conditions list and this line has a bullet point or number
      if (inConditionsList && /^\s*[•\-*\d.)\s]+/.test(trimmedLine)) {
        const condition = trimmedLine.replace(/^\s*[•\-*\d.)\s]+/, '').trim();
        
        // Avoid duplicating the primary diagnosis
        if (condition.length > 0 && 
            condition !== data.primaryDiagnosis && 
            !data.conditions.includes(condition)) {
          data.conditions.push(condition);
        }
      }
      
      // Check if this line ends the conditions list
      if (inConditionsList && 
          (trimmedLine.length === 0 || 
           /(?:medications?|surgeries|allergies|past\s+medical|assessment|treatment)/i.test(trimmedLine))) {
        inConditionsList = false;
      }
    });
    
    data.confidence.conditions = data.conditions.length > 0 ? 0.7 : 0;
    
    // Extract medications
    let inMedicationsList = false;
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      // Check if this line appears to start a medications list
      if (/(?:medications?|meds|prescriptions?|currently\s+taking)(?:\s*:|\s*-|\s*–|\s*\*)?/i.test(trimmedLine)) {
        inMedicationsList = true;
        return; // Skip this line as it's a header
      }
      
      // Check if we're in a medications list and this line has a bullet point or number
      if (inMedicationsList && 
          (/^\s*[•\-*\d.)\s]+/.test(trimmedLine) || 
           /\d+\s*mg|\d+\s*mcg|\d+\s*ml|daily|twice|once/i.test(trimmedLine))) {
        const medication = trimmedLine.replace(/^\s*[•\-*\d.)\s]+/, '').trim();
        
        if (medication.length > 0 && !data.medications.includes(medication)) {
          data.medications.push(medication);
        }
      }
      
      // Check if this line ends the medications list
      if (inMedicationsList && 
          (trimmedLine.length === 0 || 
           /(?:surgeries|procedures|allergies|assessment|treatment)/i.test(trimmedLine))) {
        inMedicationsList = false;
      }
    });
    
    data.confidence.medications = data.medications.length > 0 ? 0.7 : 0;
    
    // Extract surgeries/procedures
    let inSurgeriesList = false;
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      // Check if this line appears to start a surgeries list
      if (/(?:surgeries|surgical\s+history|procedures|operations)(?:\s*:|\s*-|\s*–|\s*\*)?/i.test(trimmedLine)) {
        inSurgeriesList = true;
        return; // Skip this line as it's a header
      }
      
      // Check if we're in a surgeries list and this line has a bullet point or number
      if (inSurgeriesList && /^\s*[•\-*\d.)\s]+/.test(trimmedLine)) {
        const surgery = trimmedLine.replace(/^\s*[•\-*\d.)\s]+/, '').trim();
        
        if (surgery.length > 0 && !data.surgeries.includes(surgery)) {
          data.surgeries.push(surgery);
        }
      }
      
      // Check if this line ends the surgeries list
      if (inSurgeriesList && 
          (trimmedLine.length === 0 || 
           /(?:medications?|allergies|assessment|treatment)/i.test(trimmedLine))) {
        inSurgeriesList = false;
      }
    });
    
    data.confidence.surgeries = data.surgeries.length > 0 ? 0.7 : 0;
    
    // Extract allergies
    let inAllergiesList = false;
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      // Check if this line appears to start an allergies list
      if (/(?:allergies|allergic\s+to)(?:\s*:|\s*-|\s*–|\s*\*)?/i.test(trimmedLine)) {
        inAllergiesList = true;
        return; // Skip this line as it's a header
      }
      
      // Check if we're in an allergies list and this line has content
      if (inAllergiesList && trimmedLine.length > 0) {
        // Check for common "No Known Allergies" patterns
        if (/no\s+known\s+allergies|n\.?k\.?a\.?|none/i.test(trimmedLine)) {
          data.allergies.push("No Known Allergies");
          inAllergiesList = false; // End processing since there are no allergies
        } 
        // Otherwise parse the allergies
        else if (/^\s*[•\-*\d.)\s]+/.test(trimmedLine)) {
          const allergy = trimmedLine.replace(/^\s*[•\-*\d.)\s]+/, '').trim();
          
          if (allergy.length > 0 && !data.allergies.includes(allergy)) {
            data.allergies.push(allergy);
          }
        }
      }
      
      // Check if this line ends the allergies list
      if (inAllergiesList && 
          (trimmedLine.length === 0 || 
           /(?:medications?|surgeries|assessment|treatment)/i.test(trimmedLine))) {
        inAllergiesList = false;
      }
    });
    
    data.confidence.allergies = data.allergies.length > 0 ? 0.7 : 0;
    
    // Set the secondary diagnoses (all diagnoses except the primary)
    if (data.diagnoses.length > 1) {
      data.secondaryDiagnoses = data.diagnoses.filter(d => d !== data.primaryDiagnosis);
      data.confidence.secondaryDiagnoses = 0.7;
    }
    
    // Add the full text as medical notes
    data.medicalNotes = text;
    
    return data;
  }
}

module.exports = MEDICAL_HISTORYExtractor;
