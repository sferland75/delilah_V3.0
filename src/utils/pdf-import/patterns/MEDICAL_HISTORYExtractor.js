/**
 * MEDICAL_HISTORYExtractor.js
 * 
 * Specialized extractor for the MEDICAL_HISTORY section with enhanced pattern recognition
 * based on statistical analysis of successful extractions.
 */

const BaseExtractor = require('./BaseExtractor');

class MEDICAL_HISTORYExtractor extends BaseExtractor {
  constructor() {
    super('MEDICAL_HISTORY');
    
    // Additional patterns specific to MEDICAL_HISTORY section
    this.medicalPatterns = {
      diagnoses: [
        { regex: /(?:diagnos(?:es|is)|diagnostic impression)(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.8 },
        { regex: /(?:diagnosed with|carries a diagnosis of|carries diagnoses of)(.*?)(?:\.|\n|$)/i, confidence: 0.75 },
        { regex: /(?:medical conditions?|health conditions?)(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.7 }
      ],
      primaryDiagnosis: [
        { regex: /(?:primary diagnos(?:is|es)|main diagnos(?:is|es)|principal diagnos(?:is|es))(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.85 },
        { regex: /(?:primary condition|main condition|principal condition)(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.75 }
      ],
      secondaryDiagnoses: [
        { regex: /(?:secondary diagnos(?:es|is)|additional diagnos(?:es|is)|comorbid(?:ities)?)(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.8 },
        { regex: /(?:secondary conditions?|comorbid conditions?)(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.75 }
      ],
      conditions: [
        { regex: /(?:medical conditions?|health concerns|chronic illnesses?)(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.8 },
        { regex: /(?:patient has a history of|client has a history of)(.*?)(?:\.|\n|$)/i, confidence: 0.75 },
        { regex: /(?:past medical history|pmh)(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.7 }
      ],
      surgeries: [
        { regex: /(?:(?:surgical|surgery) history|past surgeries|previous surgeries)(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.8 },
        { regex: /(?:surgeries|surgical procedures?)(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.75 },
        { regex: /(?:underwent|had) (?:surgery|surgical procedure|operation) (?:for|to)(.*?)(?:\.|\n|$)/i, confidence: 0.7 }
      ],
      medications: [
        { regex: /(?:medications?|meds|current medications?)(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.85 },
        { regex: /(?:prescribed medications?|prescriptions?|medication regimen)(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.8 },
        { regex: /(?:currently (?:on|taking)|uses|prescribed) (?:medications?|meds)(.*?)(?:\.|\n|$)/i, confidence: 0.75 }
      ],
      allergies: [
        { regex: /(?:allergies|drug allergies|medication allergies|food allergies)(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.85 },
        { regex: /(?:allergy history|allergic to)(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.8 },
        { regex: /(?:allergic reactions?|adverse reactions?)(?:\s*:|:?\s+)(.*?)(?:\.|\n|$)/i, confidence: 0.75 }
      ]
    };
    
    // Common medical condition terms for pattern matching
    this.medicalTerms = [
      'diabetes', 'hypertension', 'asthma', 'copd', 'arthritis', 'depression', 'anxiety',
      'heart disease', 'stroke', 'cancer', 'chronic pain', 'fibromyalgia', 'hypothyroidism',
      'hyperthyroidism', 'osteoporosis', 'multiple sclerosis', 'parkinsons', 'alzheimers',
      'dementia', 'epilepsy', 'migraine', 'gerd', 'ibs', 'crohns', 'colitis', 'hepatitis',
      'cirrhosis', 'kidney disease', 'renal failure', 'osteoarthritis', 'rheumatoid',
      'lupus', 'psoriasis', 'eczema', 'anemia', 'sleep apnea', 'hyperlipidemia', 'copd'
    ];
    
    // Common surgical procedure terms
    this.surgicalTerms = [
      'appendectomy', 'cholecystectomy', 'hysterectomy', 'laminectomy', 'discectomy',
      'fusion', 'arthroplasty', 'arthroscopy', 'bypass', 'angioplasty', 'stent',
      'transplant', 'amputation', 'resection', 'mastectomy', 'lumpectomy', 'biopsy',
      'caesarean', 'c-section', 'hernia', 'repair', 'replacement', 'knee replacement',
      'hip replacement', 'surgery', 'surgical', 'operation'
    ];
    
    // Common medication terms
    this.medicationTerms = [
      'aspirin', 'ibuprofen', 'acetaminophen', 'tylenol', 'advil', 'motrin',
      'naproxen', 'aleve', 'metformin', 'lisinopril', 'amlodipine', 'atorvastatin',
      'lipitor', 'levothyroxine', 'synthroid', 'metoprolol', 'losartan', 'omeprazole',
      'prilosec', 'albuterol', 'ventolin', 'fluticasone', 'prednisone', 'amoxicillin',
      'azithromycin', 'ciprofloxacin', 'hydrochlorothiazide', 'gabapentin', 'sertraline',
      'zoloft', 'escitalopram', 'lexapro', 'fluoxetine', 'prozac', 'duloxetine',
      'cymbalta', 'citalopram', 'celexa', 'trazodone', 'bupropion', 'wellbutrin',
      'alprazolam', 'xanax', 'lorazepam', 'ativan', 'tramadol', 'hydrocodone',
      'oxycodone', 'morphine', 'insulin', 'mg', 'tablet', 'capsule', 'daily', 'twice'
    ];
  }
  
  /**
   * Extract data from MEDICAL_HISTORY section text using enhanced pattern recognition
   * @param {string} text - MEDICAL_HISTORY section text
   * @param {Object} allSections - All sections in the document
   * @returns {Object} Extracted data with confidence scores
   */
  extract(text, allSections = {}) {
    // Use base extractor first
    const result = super.extract(text, allSections);
    
    // Apply enhanced extraction techniques specific to MEDICAL_HISTORY
    this.extractMedicalNotes(text, result);
    this.extractDiagnoses(text, result);
    this.extractPrimaryDiagnosis(text, result);
    this.extractSecondaryDiagnoses(text, result);
    this.extractConditions(text, result);
    this.extractSurgeries(text, result);
    this.extractMedications(text, result);
    this.extractAllergies(text, result);
    
    // Apply section-specific validations
    this.validateMedicalHistoryData(result);
    
    return result;
  }
  
  /**
   * Extract general medical notes
   * @param {string} text - Section text
   * @param {Object} result - Result object to update
   */
  extractMedicalNotes(text, result) {
    // If not already extracted, use entire text as medical notes
    if (!result.medicalNotes) {
      result.medicalNotes = text.trim();
      result.confidence.medicalNotes = 0.9;
      result.medicalNotes_method = 'fullText';
    }
  }
  
  /**
   * Extract diagnoses
   * @param {string} text - Section text
   * @param {Object} result - Result object to update
   */
  extractDiagnoses(text, result) {
    // Skip if already extracted with high confidence
    if (result.diagnoses && result.confidence.diagnoses > 0.7) {
      return;
    }
    
    // Try patterns from medicalPatterns
    for (const pattern of this.medicalPatterns.diagnoses) {
      const match = text.match(pattern.regex);
      if (match && match[1]) {
        const diagnoses = match[1].trim();
        if (diagnoses.length > 0) {
          result.diagnoses = diagnoses;
          result.confidence.diagnoses = pattern.confidence;
          result.diagnoses_method = 'diagnosesPattern';
          return;
        }
      }
    }
    
    // Look for common medical terms
    const sentences = text.split(/[.;]\s+/);
    const diagnosisSentences = [];
    
    for (const sentence of sentences) {
      // Check if the sentence contains diagnostic language
      if (sentence.match(/diagnos(is|ed|es)/i) || 
          sentence.match(/condition|disorder|illness|disease/i)) {
        diagnosisSentences.push(sentence.trim());
      } else {
        // Check if the sentence contains common medical terms
        for (const term of this.medicalTerms) {
          if (sentence.toLowerCase().includes(term)) {
            diagnosisSentences.push(sentence.trim());
            break;
          }
        }
      }
    }
    
    if (diagnosisSentences.length > 0) {
      result.diagnoses = diagnosisSentences.join('. ');
      result.confidence.diagnoses = 0.6;
      result.diagnoses_method = 'medicalTerms';
    }
  }
  
  /**
   * Extract primary diagnosis
   * @param {string} text - Section text
   * @param {Object} result - Result object to update
   */
  extractPrimaryDiagnosis(text, result) {
    // Skip if already extracted with high confidence
    if (result.primaryDiagnosis && result.confidence.primaryDiagnosis > 0.7) {
      return;
    }
    
    // Try patterns from medicalPatterns
    for (const pattern of this.medicalPatterns.primaryDiagnosis) {
      const match = text.match(pattern.regex);
      if (match && match[1]) {
        const primaryDiagnosis = match[1].trim();
        if (primaryDiagnosis.length > 0) {
          result.primaryDiagnosis = primaryDiagnosis;
          result.confidence.primaryDiagnosis = pattern.confidence;
          result.primaryDiagnosis_method = 'primaryDiagnosisPattern';
          return;
        }
      }
    }
    
    // If we have diagnoses but not primary diagnosis, try to extract the first one
    if (result.diagnoses && typeof result.diagnoses === 'string') {
      const diagnosesList = result.diagnoses.split(/[,;]\s+/);
      if (diagnosesList.length > 0) {
        result.primaryDiagnosis = diagnosesList[0].trim();
        result.confidence.primaryDiagnosis = 0.5;
        result.primaryDiagnosis_method = 'firstDiagnosis';
      }
    }
  }
  
  /**
   * Extract secondary diagnoses
   * @param {string} text - Section text
   * @param {Object} result - Result object to update
   */
  extractSecondaryDiagnoses(text, result) {
    // Skip if already extracted with high confidence
    if (result.secondaryDiagnoses && result.confidence.secondaryDiagnoses > 0.7) {
      return;
    }
    
    // Try patterns from medicalPatterns
    for (const pattern of this.medicalPatterns.secondaryDiagnoses) {
      const match = text.match(pattern.regex);
      if (match && match[1]) {
        const secondaryDiagnoses = match[1].trim();
        if (secondaryDiagnoses.length > 0) {
          result.secondaryDiagnoses = secondaryDiagnoses;
          result.confidence.secondaryDiagnoses = pattern.confidence;
          result.secondaryDiagnoses_method = 'secondaryDiagnosesPattern';
          return;
        }
      }
    }
    
    // If we have diagnoses and primary diagnosis, extract secondary diagnoses
    if (result.diagnoses && result.primaryDiagnosis && 
        typeof result.diagnoses === 'string' && 
        typeof result.primaryDiagnosis === 'string') {
      
      const diagnosesList = result.diagnoses.split(/[,;]\s+/);
      
      // Filter out the primary diagnosis
      const secondaryList = diagnosesList.filter(diagnosis => 
        !diagnosis.includes(result.primaryDiagnosis)
      );
      
      if (secondaryList.length > 0) {
        result.secondaryDiagnoses = secondaryList.join(', ');
        result.confidence.secondaryDiagnoses = 0.5;
        result.secondaryDiagnoses_method = 'derivedFromDiagnoses';
      }
    }
  }
  
  /**
   * Extract medical conditions
   * @param {string} text - Section text
   * @param {Object} result - Result object to update
   */
  extractConditions(text, result) {
    // Skip if already extracted with high confidence
    if (result.conditions && result.confidence.conditions > 0.7) {
      return;
    }
    
    // Try patterns from medicalPatterns
    for (const pattern of this.medicalPatterns.conditions) {
      const match = text.match(pattern.regex);
      if (match && match[1]) {
        const conditions = match[1].trim();
        if (conditions.length > 0) {
          result.conditions = conditions;
          result.confidence.conditions = pattern.confidence;
          result.conditions_method = 'conditionsPattern';
          return;
        }
      }
    }
    
    // If we have diagnoses but not conditions, use diagnoses as conditions
    if (result.diagnoses && !result.conditions) {
      result.conditions = result.diagnoses;
      result.confidence.conditions = 0.6;
      result.conditions_method = 'fromDiagnoses';
    }
    // Alternatively, build conditions from medical terms
    else {
      const sentences = text.split(/[.;]\s+/);
      const conditionSentences = [];
      
      for (const sentence of sentences) {
        for (const term of this.medicalTerms) {
          if (sentence.toLowerCase().includes(term)) {
            conditionSentences.push(sentence.trim());
            break;
          }
        }
      }
      
      if (conditionSentences.length > 0) {
        result.conditions = conditionSentences.join('. ');
        result.confidence.conditions = 0.5;
        result.conditions_method = 'medicalTermSearch';
      }
    }
  }
  
  /**
   * Extract surgical history
   * @param {string} text - Section text
   * @param {Object} result - Result object to update
   */
  extractSurgeries(text, result) {
    // Skip if already extracted with high confidence
    if (result.surgeries && result.confidence.surgeries > 0.7) {
      return;
    }
    
    // Try patterns from medicalPatterns
    for (const pattern of this.medicalPatterns.surgeries) {
      const match = text.match(pattern.regex);
      if (match && match[1]) {
        const surgeries = match[1].trim();
        if (surgeries.length > 0) {
          result.surgeries = surgeries;
          result.confidence.surgeries = pattern.confidence;
          result.surgeries_method = 'surgeriesPattern';
          return;
        }
      }
    }
    
    // Look for sentences containing surgical terms
    const sentences = text.split(/[.;]\s+/);
    const surgerySentences = [];
    
    for (const sentence of sentences) {
      for (const term of this.surgicalTerms) {
        if (sentence.toLowerCase().includes(term)) {
          surgerySentences.push(sentence.trim());
          break;
        }
      }
    }
    
    if (surgerySentences.length > 0) {
      result.surgeries = surgerySentences.join('. ');
      result.confidence.surgeries = 0.6;
      result.surgeries_method = 'surgicalTerms';
    }
  }
  
  /**
   * Extract medications
   * @param {string} text - Section text
   * @param {Object} result - Result object to update
   */
  extractMedications(text, result) {
    // Skip if already extracted with high confidence
    if (result.medications && result.confidence.medications > 0.7) {
      return;
    }
    
    // Try patterns from medicalPatterns
    for (const pattern of this.medicalPatterns.medications) {
      const match = text.match(pattern.regex);
      if (match && match[1]) {
        const medications = match[1].trim();
        if (medications.length > 0) {
          result.medications = medications;
          result.confidence.medications = pattern.confidence;
          result.medications_method = 'medicationsPattern';
          return;
        }
      }
    }
    
    // Look for sentences containing medication terms
    const sentences = text.split(/[.;]\s+/);
    const medicationSentences = [];
    
    for (const sentence of sentences) {
      if (sentence.toLowerCase().includes('medication') || 
          sentence.toLowerCase().includes('prescribed') ||
          sentence.toLowerCase().includes('taking')) {
        medicationSentences.push(sentence.trim());
      } else {
        for (const term of this.medicationTerms) {
          if (sentence.toLowerCase().includes(term)) {
            medicationSentences.push(sentence.trim());
            break;
          }
        }
      }
    }
    
    if (medicationSentences.length > 0) {
      result.medications = medicationSentences.join('. ');
      result.confidence.medications = 0.5;
      result.medications_method = 'medicationTerms';
    }
  }
  
  /**
   * Extract allergies
   * @param {string} text - Section text
   * @param {Object} result - Result object to update
   */
  extractAllergies(text, result) {
    // Skip if already extracted with high confidence
    if (result.allergies && result.confidence.allergies > 0.7) {
      return;
    }
    
    // Try patterns from medicalPatterns
    for (const pattern of this.medicalPatterns.allergies) {
      const match = text.match(pattern.regex);
      if (match && match[1]) {
        const allergies = match[1].trim();
        if (allergies.length > 0) {
          result.allergies = allergies;
          result.confidence.allergies = pattern.confidence;
          result.allergies_method = 'allergiesPattern';
          return;
        }
      }
    }
    
    // Look for allergies in the text
    const allergyRegex = /allergic to\s+([^.;]+)/i;
    const allergyMatch = text.match(allergyRegex);
    
    if (allergyMatch && allergyMatch[1]) {
      result.allergies = allergyMatch[1].trim();
      result.confidence.allergies = 0.6;
      result.allergies_method = 'allergicToPattern';
    } else {
      // Check for "No known allergies" or similar
      if (text.match(/no known (?:drug |medication |food )?allergies/i) ||
          text.match(/nkda|nka/i)) {
        result.allergies = "None";
        result.confidence.allergies = 0.7;
        result.allergies_method = 'noAllergiesPattern';
      }
    }
  }
  
  /**
   * Validate and refine medical history data
   * @param {Object} result - Result object to validate
   */
  validateMedicalHistoryData(result) {
    // Convert list-like strings to arrays for consistency
    const listFields = ['diagnoses', 'conditions', 'surgeries', 'medications', 'allergies', 'secondaryDiagnoses'];
    
    listFields.forEach(field => {
      if (result[field] && typeof result[field] === 'string') {
        // Split by common list separators
        if (result[field].includes(',') || result[field].includes(';')) {
          const items = result[field].split(/[,;]\s*/).map(item => item.trim()).filter(item => item.length > 0);
          
          // Only convert to array if we have multiple items
          if (items.length > 1) {
            result[field] = items;
          }
        }
      }
    });
    
    // If we have no surgeries but find surgical terms in conditions, extract them
    if (!result.surgeries && result.conditions) {
      const conditionsText = typeof result.conditions === 'string' ? 
        result.conditions : result.conditions.join(' ');
      
      const surgicalPhrases = [];
      for (const term of this.surgicalTerms) {
        if (conditionsText.toLowerCase().includes(term)) {
          // Extract the sentence or phrase containing the surgical term
          const sentences = conditionsText.split(/[.;]\s+/);
          for (const sentence of sentences) {
            if (sentence.toLowerCase().includes(term)) {
              surgicalPhrases.push(sentence.trim());
            }
          }
        }
      }
      
      if (surgicalPhrases.length > 0) {
        result.surgeries = surgicalPhrases.join('. ');
        result.confidence.surgeries = 0.4;
        result.surgeries_method = 'derivedFromConditions';
      }
    }
    
    // If we have no allergies, set to "None" with low confidence
    if (!result.allergies) {
      result.allergies = "None documented";
      result.confidence.allergies = 0.2;
      result.allergies_method = 'defaultValue';
    }
  }
  
  /**
   * Check if the section appears to be a MEDICAL_HISTORY section
   * @param {Object} result - Extraction result
   * @returns {boolean} True if likely a MEDICAL_HISTORY section
   */
  isCorrectSectionType(result) {
    // MEDICAL_HISTORY sections typically discuss diagnoses, conditions, etc.
    
    // Check for high-priority fields
    if ((result.diagnoses && result.confidence.diagnoses > 0.6) ||
        (result.conditions && result.confidence.conditions > 0.6) ||
        (result.primaryDiagnosis && result.confidence.primaryDiagnosis > 0.6)) {
      return true;
    }
    
    // Count medical fields present with decent confidence
    let medicalFieldsPresent = 0;
    
    if (result.diagnoses && result.confidence.diagnoses > 0.4) medicalFieldsPresent++;
    if (result.conditions && result.confidence.conditions > 0.4) medicalFieldsPresent++;
    if (result.surgeries && result.confidence.surgeries > 0.4) medicalFieldsPresent++;
    if (result.medications && result.confidence.medications > 0.4) medicalFieldsPresent++;
    if (result.allergies && result.confidence.allergies > 0.4) medicalFieldsPresent++;
    if (result.primaryDiagnosis && result.confidence.primaryDiagnosis > 0.4) medicalFieldsPresent++;
    if (result.secondaryDiagnoses && result.confidence.secondaryDiagnoses > 0.4) medicalFieldsPresent++;
    
    // If we have at least 2 medical fields, it's likely a MEDICAL_HISTORY section
    return medicalFieldsPresent >= 2 || result.overallConfidence > 0.4;
  }
}

module.exports = MEDICAL_HISTORYExtractor;
