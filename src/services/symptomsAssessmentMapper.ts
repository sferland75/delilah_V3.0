/**
 * Symptoms Assessment Data Mapping Service
 * 
 * This service handles bidirectional mapping between:
 * 1. Context data structure (as used in AssessmentContext)
 * 2. Form data structure (as used in React Hook Form)
 */

import { nanoid } from 'nanoid';
import { SymptomsUpdated } from '@/sections/4-SymptomsAssessment/schema.updated';

// Default form values
export const defaultValues: SymptomsUpdated = {
  general: {
    notes: ''
  },
  physical: [
    {
      id: nanoid(),
      location: '',
      intensity: '',
      description: '',
      frequency: '',
      duration: '',
      aggravating: [],
      alleviating: []
    }
  ],
  cognitive: [
    {
      id: nanoid(),
      type: '',
      impact: '',
      management: '',
      frequency: '',
      triggers: [],
      coping: []
    }
  ],
  emotional: []
};

/**
 * Maps context data to form data structure
 * @param contextData Symptoms assessment data from the assessment context
 * @returns Object containing form data and hasData flag
 */
export function mapContextToForm(contextData: any) {
  try {
    console.log("Symptoms Mapper - Context Data:", contextData);
    
    // Start with default values
    const formData = JSON.parse(JSON.stringify(defaultValues));
    let hasData = false;
    
    if (!contextData || Object.keys(contextData).length === 0) {
      return { formData, hasData };
    }
    
    // Map general notes if they exist
    if (contextData.generalNotes) {
      formData.general.notes = contextData.generalNotes;
      hasData = true;
    }
    
    // Map physical symptoms if they exist
    if (contextData.physicalSymptoms && Array.isArray(contextData.physicalSymptoms) && contextData.physicalSymptoms.length > 0) {
      formData.physical = contextData.physicalSymptoms.map(symptom => ({
        id: symptom.id || nanoid(),
        location: symptom.symptom || '',
        intensity: symptom.intensity || '',
        description: symptom.description || '',
        frequency: symptom.frequency || '',
        duration: symptom.duration || '',
        aggravating: symptom.aggravatingFactors ? 
          (typeof symptom.aggravatingFactors === 'string' ? 
            symptom.aggravatingFactors.split(',').map(s => s.trim()) : 
            Array.isArray(symptom.aggravatingFactors) ? symptom.aggravatingFactors : [symptom.aggravatingFactors]) : 
          [],
        alleviating: symptom.alleviatingFactors ? 
          (typeof symptom.alleviatingFactors === 'string' ? 
            symptom.alleviatingFactors.split(',').map(s => s.trim()) : 
            Array.isArray(symptom.alleviatingFactors) ? symptom.alleviatingFactors : [symptom.alleviatingFactors]) : 
          []
      }));
      hasData = true;
    }
    
    // Map cognitive symptoms if they exist
    if (contextData.cognitiveSymptoms && Array.isArray(contextData.cognitiveSymptoms) && contextData.cognitiveSymptoms.length > 0) {
      formData.cognitive = contextData.cognitiveSymptoms.map(symptom => ({
        id: symptom.id || nanoid(),
        type: symptom.symptom || '',
        impact: symptom.impactOnFunction || symptom.description || '',
        management: symptom.management || '',
        frequency: symptom.frequency || '',
        triggers: symptom.triggers ? 
          (typeof symptom.triggers === 'string' ? 
            symptom.triggers.split(',').map(s => s.trim()) : 
            Array.isArray(symptom.triggers) ? symptom.triggers : []) : 
          [],
        coping: symptom.coping ? 
          (typeof symptom.coping === 'string' ? 
            symptom.coping.split(',').map(s => s.trim()) : 
            Array.isArray(symptom.coping) ? symptom.coping : []) : 
          []
      }));
      hasData = true;
    }
    
    // Map emotional symptoms if they exist
    if (contextData.emotionalSymptoms && Array.isArray(contextData.emotionalSymptoms)) {
      formData.emotional = contextData.emotionalSymptoms.map(symptom => {
        // Handle legacy data structure or possibly missing fields
        return {
          type: symptom.type || symptom.symptom || '',
          severity: symptom.severity || 'moderate',
          frequency: symptom.frequency || 'daily',
          impact: symptom.impact || symptom.impactOnFunction || symptom.description || '',
          management: symptom.management || ''
        };
      });
      hasData = true;
    } else if (Array.isArray(contextData.emotional)) {
      // Handle direct emotional array format
      formData.emotional = contextData.emotional;
      if (contextData.emotional.length > 0) {
        hasData = true;
      }
    }
    
    console.log("Symptoms Mapper - Mapped Form Data:", formData);
    return { formData, hasData };
  } catch (error) {
    console.error("Symptoms Mapper - Error mapping context data:", error);
    return { formData: defaultValues, hasData: false };
  }
}

/**
 * Maps form data to context structure
 * @param formData Form data from React Hook Form
 * @returns Context-structured data
 */
export function mapFormToContext(formData: SymptomsUpdated) {
  try {
    const contextData = {
      generalNotes: formData.general.notes,
      
      physicalSymptoms: formData.physical
        .filter(symptom => symptom.location.trim() !== '')
        .map(symptom => ({
          id: symptom.id,
          symptom: symptom.location,
          intensity: symptom.intensity,
          description: symptom.description,
          frequency: symptom.frequency,
          duration: symptom.duration,
          aggravatingFactors: symptom.aggravating.join(', '),
          alleviatingFactors: symptom.alleviating.join(', '),
          impactOnFunction: symptom.description // Using description as impact
        })),
      
      cognitiveSymptoms: formData.cognitive
        .filter(symptom => symptom.type.trim() !== '')
        .map(symptom => ({
          id: symptom.id,
          symptom: symptom.type,
          severity: "Moderate", // Default value
          description: symptom.impact,
          frequency: symptom.frequency,
          impactOnFunction: symptom.impact,
          management: symptom.management,
          triggers: symptom.triggers,
          coping: symptom.coping
        })),
      
      emotionalSymptoms: formData.emotional.filter(symptom => symptom.type.trim() !== '')
    };
    
    console.log("Symptoms Mapper - Mapped Context Data:", contextData);
    return contextData;
  } catch (error) {
    console.error("Symptoms Mapper - Error mapping to context:", error);
    return {
      generalNotes: '',
      physicalSymptoms: [],
      cognitiveSymptoms: [],
      emotionalSymptoms: []
    };
  }
}

/**
 * Creates a JSON export of the symptoms assessment data
 * @param contextData The context data from AssessmentContext
 * @returns String representation of the JSON data
 */
export function exportSymptomsToJson(contextData: any) {
  try {
    return JSON.stringify(contextData, null, 2);
  } catch (error) {
    console.error("Symptoms Mapper - Error exporting to JSON:", error);
    return '';
  }
}

/**
 * Imports symptoms assessment from JSON
 * @param jsonString JSON string representation of symptoms assessment data
 * @returns Parsed symptoms assessment data
 */
export function importSymptomsFromJson(jsonString: string) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Symptoms Mapper - Error importing from JSON:", error);
    return null;
  }
}