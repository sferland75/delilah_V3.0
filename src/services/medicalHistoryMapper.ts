/**
 * Medical History Data Mapping Service
 * 
 * This service handles bidirectional mapping between:
 * 1. Context data structure (as used in AssessmentContext)
 * 2. Form data structure (as used in React Hook Form)
 */

import { nanoid } from 'nanoid';

// Default injury details object with all required fields
const defaultInjury = {
  date: '',
  time: '',
  position: '',
  impactType: '',
  circumstance: '',
  preparedForImpact: '',
  immediateSymptoms: '',
  immediateResponse: '',
  vehicleDamage: '',
  subsequentCare: '',
  initialTreatment: ''
};

// Default empty treatment object 
const defaultTreatment = {
  provider: '',
  type: '',
  facility: '',
  startDate: '',
  frequency: '',
  status: 'ongoing',
  notes: '',
  endDate: ''
};

/**
 * Maps context data to form data structure
 * @param contextData Medical history data from the assessment context
 * @param initialFormState The initial form state to populate
 * @returns Populated form data
 */
export function mapContextToForm(contextData: any, initialFormState: any) {
  console.log("Medical History Mapper - Context Data:", contextData);
  
  // Create a deep copy of the initial form state
  const formData = JSON.parse(JSON.stringify(initialFormState));
  let hasData = false;
  
  try {
    // Use pastMedicalHistory if it exists, otherwise check for the nested structure
    const pastMedicalHistory = contextData.pastMedicalHistory || 
                              (contextData.medicalHistory?.pastMedicalHistory) || 
                              {};
    
    console.log("Medical History Mapper - Past Medical History:", pastMedicalHistory);
    
    // 1. Map pre-existing conditions
    if (pastMedicalHistory.conditions && 
        Array.isArray(pastMedicalHistory.conditions)) {
      formData.data.preExistingConditions = pastMedicalHistory.conditions.map((c: any) => ({
        condition: c.condition || '',
        diagnosisDate: c.diagnosisDate || '',
        status: 'active', // Default value
        details: c.treatment || c.notes || ''
      }));
      hasData = true;
    }
    
    // 2. Map surgeries if available
    if (pastMedicalHistory.surgeries && 
        Array.isArray(pastMedicalHistory.surgeries)) {
      formData.data.surgeries = pastMedicalHistory.surgeries.map((s: any) => ({
        procedure: s.procedure || '',
        date: s.date || '',
        outcome: 'Completed', // Default value
        surgeon: s.surgeon || '',
        facility: s.facility || ''
      }));
      hasData = true;
    }
    
    // 3. Map allergies
    if (pastMedicalHistory.allergies) {
      // Split allergies string into array if it's a string
      if (typeof pastMedicalHistory.allergies === 'string') {
        formData.data.allergies = pastMedicalHistory.allergies
          .split(',')
          .map((a: string) => a.trim())
          .filter((a: string) => a.length > 0);
      } else if (Array.isArray(pastMedicalHistory.allergies)) {
        formData.data.allergies = pastMedicalHistory.allergies;
      } else {
        formData.data.allergies = [pastMedicalHistory.allergies];
      }
      hasData = true;
    }
    
    // Add family history if available
    if (pastMedicalHistory.preExistingConditions) {
      formData.data.familyHistory = pastMedicalHistory.preExistingConditions;
      hasData = true;
    }
    
    // 4. Map medications
    if (pastMedicalHistory.medications && 
        Array.isArray(pastMedicalHistory.medications)) {
      formData.data.currentMedications = pastMedicalHistory.medications.map((m: any) => ({
        name: m.name || '',
        dosage: m.dosage || '',
        frequency: m.frequency || '',
        prescribedFor: m.reason || '',
        prescribedBy: m.prescriber || '',
        startDate: m.startDate || '',
        endDate: m.endDate || '',
        status: m.status || 'current' // Default value
      }));
      hasData = true;
    }
    
    // Use injuryDetails if it exists, otherwise check for the nested structure
    const injuryDetails = contextData.injuryDetails || 
                         (contextData.medicalHistory?.injuryDetails) || 
                         {};
    
    // 5. Map injury details
    if (Object.keys(injuryDetails).length > 0) {
      formData.data.injury = {
        ...defaultInjury, // Start with default values
        date: injuryDetails.diagnosisDate || injuryDetails.date || '',
        time: injuryDetails.time || '',
        position: injuryDetails.position || '',
        impactType: injuryDetails.mechanism || '',
        circumstance: injuryDetails.description || '',
        preparedForImpact: injuryDetails.preparedForImpact || '',
        immediateSymptoms: Array.isArray(injuryDetails.complications) ? 
                          injuryDetails.complications.join(', ') : 
                          (injuryDetails.immediateSymptoms || ''),
        immediateResponse: injuryDetails.immediateResponse || '',
        vehicleDamage: injuryDetails.vehicleDamage || '',
        subsequentCare: injuryDetails.subsequentCare || '',
        initialTreatment: injuryDetails.initialTreatment || ''
      };
      hasData = true;
      
      // Add primaryDiagnosis as part of impactType if available
      if (injuryDetails.primaryDiagnosis) {
        formData.data.injury.impactType = 
          (formData.data.injury.impactType ? `${formData.data.injury.impactType} - ` : '') + 
          injuryDetails.primaryDiagnosis;
      }
      
      // Add secondaryDiagnoses to circumstances if available
      if (Array.isArray(injuryDetails.secondaryDiagnoses) && 
          injuryDetails.secondaryDiagnoses.length > 0) {
        const diagnosesText = `Additional diagnoses: ${injuryDetails.secondaryDiagnoses.join(', ')}`;
        formData.data.injury.circumstance = 
          formData.data.injury.circumstance ? 
          `${formData.data.injury.circumstance}\n\n${diagnosesText}` : diagnosesText;
      }
    } else if (contextData.functionalHistory?.recentChanges) {
      // If no injury details but we have functional history, try to extract injury info
      const recentChanges = contextData.functionalHistory.recentChanges;
      
      // Try to extract accident date
      let accidentDate = '';
      const datePattern = /(\d{4}-\d{2}-\d{2})/;
      const dateMatch = recentChanges.match(datePattern);
      if (dateMatch && dateMatch[1]) {
        accidentDate = dateMatch[1];
      }
      
      // Look for mentions of accident
      let accidentType = '';
      let accidentDescription = '';
      
      if (recentChanges.toLowerCase().includes('motor vehicle accident')) {
        accidentType = 'Motor Vehicle Accident';
      } else if (recentChanges.toLowerCase().includes('accident')) {
        accidentType = 'Accident';
      } else if (recentChanges.toLowerCase().includes('injury')) {
        accidentType = 'Injury';
      }
      
      // Extract the sentence containing "accident"
      if (accidentType) {
        const sentences = recentChanges.split('. ');
        for (const sentence of sentences) {
          if (sentence.toLowerCase().includes('accident') || 
              sentence.toLowerCase().includes('injury')) {
            accidentDescription = sentence;
            break;
          }
        }
      }
      
      // Extract symptom information
      let symptoms = '';
      if (recentChanges.toLowerCase().includes('pain') || 
          recentChanges.toLowerCase().includes('difficulty') || 
          recentChanges.toLowerCase().includes('limited')) {
        symptoms = recentChanges.split(', ')
          .filter(part => 
            part.toLowerCase().includes('pain') || 
            part.toLowerCase().includes('difficulty') || 
            part.toLowerCase().includes('limited')
          )
          .join(', ');
      }
      
      // Only populate if we found some information
      if (accidentDate || accidentType || symptoms) {
        formData.data.injury = {
          ...defaultInjury,
          date: accidentDate,
          impactType: accidentType,
          circumstance: accidentDescription,
          immediateSymptoms: symptoms,
        };
        hasData = true;
      }
    }
    
    // Use treatmentHistory if it exists, otherwise check for the nested structure
    const treatmentHistory = contextData.treatmentHistory || 
                            (contextData.medicalHistory?.treatmentHistory) || 
                            {};
    
    // 6. Map treatments
    if (treatmentHistory.rehabilitationServices && 
        Array.isArray(treatmentHistory.rehabilitationServices)) {
      // Map rehabilitation services
      formData.data.currentTreatments = treatmentHistory.rehabilitationServices.map((t: any) => {
        // Determine treatment status based on dates
        let status = 'ongoing';
        if (t.endDate) {
          const endDate = new Date(t.endDate);
          const today = new Date();
          status = endDate < today ? 'completed' : 'ongoing';
        }
        
        return {
          provider: t.provider || '',
          type: t.type || '',
          facility: t.facility || '',
          startDate: t.startDate || '',
          frequency: t.frequency || '',
          status: status,
          notes: Array.isArray(t.goals) ? t.goals.join(', ') : (t.goals || ''),
          endDate: t.endDate || ''
        };
      });
      
      // Add hospitalizations if available
      if (treatmentHistory.hospitalizations && 
          Array.isArray(treatmentHistory.hospitalizations) &&
          treatmentHistory.hospitalizations.length > 0) {
        
        // Convert hospitalizations to the treatment format
        const hospitalTreatments = treatmentHistory.hospitalizations.map((h: any) => ({
          provider: h.provider || h.physician || '',
          type: 'Hospitalization',
          facility: h.facility || '',
          startDate: h.admissionDate || '',
          frequency: 'Daily',
          status: 'completed',
          notes: h.reason || '',
          endDate: h.dischargeDate || ''
        }));
        
        // Add hospitalizations to treatments array
        formData.data.currentTreatments = [
          ...formData.data.currentTreatments,
          ...hospitalTreatments
        ];
      }
      
      hasData = true;
    } else if (pastMedicalHistory.medications) {
      // If no treatment data but we have post-accident medications, create treatment entries
      const postAccidentMeds = Array.isArray(pastMedicalHistory.medications) ? 
        pastMedicalHistory.medications.filter(
          (m: any) => m.reason?.toLowerCase().includes('pain') || 
              m.reason?.toLowerCase().includes('accident') ||
              m.reason?.toLowerCase().includes('spasm')
        ) : [];
      
      if (postAccidentMeds && postAccidentMeds.length > 0) {
        // Create derived treatment entries
        formData.data.currentTreatments = [
          {
            provider: 'Primary Care Physician',
            type: 'Medication Management',
            facility: '',
            startDate: formData.data.injury.date || '',
            frequency: 'As prescribed',
            status: 'ongoing',
            notes: `Management with: ${
              postAccidentMeds.map((m: any) => `${m.name} ${m.dosage}`).join(', ')
            }`,
            endDate: ''
          }
        ];
        
        // Add likely physical therapy for post-accident care
        if (formData.data.injury.impactType &&
            (formData.data.injury.impactType.includes('accident') || 
             formData.data.injury.impactType.includes('Accident'))) {
          formData.data.currentTreatments.push({
            provider: 'Physical Therapist',
            type: 'Physical Therapy',
            facility: '',
            startDate: formData.data.injury.date || '',
            frequency: '2-3x weekly',
            status: 'ongoing',
            notes: 'Rehabilitation for injuries',
            endDate: ''
          });
        }
        
        hasData = true;
      }
    }
    
    // If treatments array is still empty, initialize with one empty treatment
    if (!formData.data.currentTreatments || formData.data.currentTreatments.length === 0) {
      formData.data.currentTreatments = [{ ...defaultTreatment }];
    }
    
    console.log("Medical History Mapper - Mapped Form Data:", formData);
    return { formData, hasData };
  } catch (error) {
    console.error("Medical History Mapper - Error mapping data:", error);
    return { formData: initialFormState, hasData: false };
  }
}

/**
 * Maps form data to context structure
 * @param formData Form data from React Hook Form
 * @param existingContextData Any existing context data to merge with
 * @returns Context-structured data
 */
export function mapFormToContext(formData: any, existingContextData: any = {}) {
  try {
    // Convert form data to the structure expected by the context
    const medicalHistoryData = {
      // Preserve any existing data not covered by the form
      ...existingContextData,
      
      // Map pastMedicalHistory section
      pastMedicalHistory: {
        // Keep any existing data not modified by the form
        ...(existingContextData.pastMedicalHistory || {}),
        
        // Map conditions from form
        conditions: (formData.data.preExistingConditions || [])
          .filter((c: any) => c.condition?.trim())
          .map((condition: any) => ({
            condition: condition.condition,
            diagnosisDate: condition.diagnosisDate,
            treatment: condition.details
          })),
        
        // Map surgeries from form
        surgeries: (formData.data.surgeries || [])
          .filter((s: any) => s.procedure?.trim())
          .map((surgery: any) => ({
            procedure: surgery.procedure,
            date: surgery.date,
            surgeon: surgery.surgeon,
            facility: surgery.facility
          })),
        
        // Map allergies from form
        allergies: (formData.data.allergies || []).join(', '),
        
        // Map medications from form
        medications: (formData.data.currentMedications || [])
          .filter((m: any) => m.name?.trim())
          .map((med: any) => ({
            name: med.name,
            dosage: med.dosage,
            frequency: med.frequency,
            reason: med.prescribedFor,
            prescriber: med.prescribedBy,
            startDate: med.startDate,
            endDate: med.endDate,
            status: med.status
          })),
          
        // Map family history from form
        preExistingConditions: formData.data.familyHistory || '',
      },
      
      // Preserve functional history if it exists
      functionalHistory: existingContextData.functionalHistory || {
        priorLevelOfFunction: '',
        recentChanges: '',
        priorLivingArrangement: '',
        priorMobilityStatus: ''
      },
      
      // Map injury details from form
      injuryDetails: {
        // Keep any existing data not modified by the form
        ...(existingContextData.injuryDetails || {}),
        
        diagnosisDate: formData.data.injury?.date || '',
        mechanism: formData.data.injury?.impactType || '',
        description: formData.data.injury?.circumstance || '',
        position: formData.data.injury?.position || '',
        time: formData.data.injury?.time || '',
        preparedForImpact: formData.data.injury?.preparedForImpact || '',
        immediateResponse: formData.data.injury?.immediateResponse || '',
        vehicleDamage: formData.data.injury?.vehicleDamage || '',
        subsequentCare: formData.data.injury?.subsequentCare || '',
        initialTreatment: formData.data.injury?.initialTreatment || '',
        complications: formData.data.injury?.immediateSymptoms ? 
                      formData.data.injury.immediateSymptoms.split(', ').filter((s: string) => s.trim()) : 
                      [],
      },
      
      // Map treatment history from form
      treatmentHistory: {
        // Keep any existing data not modified by the form
        ...(existingContextData.treatmentHistory || {}),
        
        // Map hospitalizations (treatments with type == 'Hospitalization')
        hospitalizations: (formData.data.currentTreatments || [])
          .filter((t: any) => t.type === 'Hospitalization' && t.provider?.trim())
          .map((h: any) => ({
            facility: h.facility,
            admissionDate: h.startDate,
            dischargeDate: h.endDate,
            reason: h.notes,
            provider: h.provider,
            physician: h.provider
          })),
        
        // Map rehabilitation services (all other treatment types)
        rehabilitationServices: (formData.data.currentTreatments || [])
          .filter((t: any) => t.type !== 'Hospitalization' && t.type?.trim())
          .map((therapy: any) => ({
            type: therapy.type,
            provider: therapy.provider,
            facility: therapy.facility,
            frequency: therapy.frequency,
            startDate: therapy.startDate,
            endDate: therapy.endDate || '',
            goals: therapy.notes ? [therapy.notes] : []
          }))
      }
    };
    
    console.log("Medical History Mapper - Mapped Context Data:", medicalHistoryData);
    return medicalHistoryData;
  } catch (error) {
    console.error("Medical History Mapper - Error mapping to context:", error);
    return existingContextData;
  }
}

/**
 * Creates a JSON export of the medical history data
 * @param contextData The context data from AssessmentContext
 * @returns String representation of the JSON data
 */
export function exportMedicalHistoryToJson(contextData: any) {
  try {
    return JSON.stringify(contextData, null, 2);
  } catch (error) {
    console.error("Medical History Mapper - Error exporting to JSON:", error);
    return '';
  }
}

/**
 * Imports medical history from JSON
 * @param jsonString JSON string representation of medical history data
 * @returns Parsed medical history data for the context
 */
export function importMedicalHistoryFromJson(jsonString: string) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Medical History Mapper - Error importing from JSON:", error);
    return null;
  }
}