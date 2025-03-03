/**
 * Medical History Mapper Service Tests
 * 
 * Tests for the bidirectional mapping functionality between
 * context data and form data structures.
 */

import { 
  mapContextToForm, 
  mapFormToContext,
  exportMedicalHistoryToJson,
  importMedicalHistoryFromJson
} from '../medicalHistoryMapper';

// Mock console methods to avoid cluttering test output
global.console.log = jest.fn();
global.console.error = jest.fn();

describe('Medical History Mapper Service', () => {
  // Define default mock data structures
  const mockInitialFormState = {
    data: {
      preExistingConditions: [],
      surgeries: [],
      allergies: [],
      currentMedications: [],
      injury: {
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
      },
      currentTreatments: []
    }
  };

  const mockContextData = {
    pastMedicalHistory: {
      conditions: [
        {
          condition: 'Diabetes Type 2',
          diagnosisDate: '2018-05-15',
          treatment: 'Medication and diet management'
        },
        {
          condition: 'Hypertension',
          diagnosisDate: '2019-08-22',
          treatment: 'Blood pressure medication'
        }
      ],
      surgeries: [
        {
          procedure: 'Appendectomy',
          date: '2010-03-12',
          surgeon: 'Dr. Smith',
          facility: 'General Hospital'
        }
      ],
      allergies: 'Penicillin, Peanuts',
      medications: [
        {
          name: 'Metformin',
          dosage: '500mg',
          frequency: 'twice daily',
          reason: 'Diabetes management',
          prescriber: 'Dr. Johnson',
          startDate: '2018-06-01',
          status: 'current'
        },
        {
          name: 'Lisinopril',
          dosage: '10mg',
          frequency: 'once daily',
          reason: 'Hypertension',
          prescriber: 'Dr. Williams',
          startDate: '2019-09-01',
          status: 'current'
        }
      ]
    },
    functionalHistory: {
      priorLevelOfFunction: 'Independent in all activities of daily living',
      recentChanges: 'Difficulty with stairs since accident on 2023-01-15',
      priorLivingArrangement: 'Lives in two-story home with spouse',
      priorMobilityStatus: 'Independent ambulation'
    },
    injuryDetails: {
      diagnosisDate: '2023-01-15',
      mechanism: 'Motor Vehicle Accident',
      description: 'Rear-ended at stoplight',
      position: 'Driver',
      time: '14:30',
      preparedForImpact: 'No',
      immediateResponse: 'Felt immediate pain in neck and back',
      vehicleDamage: 'Moderate rear damage',
      subsequentCare: 'Went to ER same day',
      initialTreatment: 'Pain medication and physical therapy referral',
      complications: ['Neck pain', 'Back pain', 'Headaches']
    },
    treatmentHistory: {
      rehabilitationServices: [
        {
          type: 'Physical Therapy',
          provider: 'Smith Rehabilitation Center',
          facility: 'Smith Rehabilitation Center',
          frequency: '3x weekly',
          startDate: '2023-01-20',
          goals: ['Reduce pain', 'Improve range of motion']
        },
        {
          type: 'Chiropractic',
          provider: 'Dr. Miller',
          facility: 'Miller Chiropractic',
          frequency: '1x weekly',
          startDate: '2023-02-05',
          goals: ['Spinal alignment']
        }
      ],
      hospitalizations: [
        {
          facility: 'City General Hospital',
          admissionDate: '2023-01-15',
          dischargeDate: '2023-01-16',
          reason: 'Post-accident evaluation',
          provider: 'Dr. Wilson',
          physician: 'Dr. Wilson'
        }
      ]
    }
  };

  // Test mapping from context to form
  describe('mapContextToForm', () => {
    it('should correctly map context data to form structure', () => {
      const { formData, hasData } = mapContextToForm(mockContextData, mockInitialFormState);
      
      // Check hasData flag
      expect(hasData).toBe(true);
      
      // Check pre-existing conditions mapping
      expect(formData.data.preExistingConditions).toHaveLength(2);
      expect(formData.data.preExistingConditions[0].condition).toBe('Diabetes Type 2');
      expect(formData.data.preExistingConditions[0].diagnosisDate).toBe('2018-05-15');
      
      // Check surgeries mapping
      expect(formData.data.surgeries).toHaveLength(1);
      expect(formData.data.surgeries[0].procedure).toBe('Appendectomy');
      
      // Check allergies mapping
      expect(formData.data.allergies).toContain('Penicillin');
      expect(formData.data.allergies).toContain('Peanuts');
      
      // Check injury details mapping
      expect(formData.data.injury.date).toBe('2023-01-15');
      expect(formData.data.injury.impactType).toBe('Motor Vehicle Accident');
      expect(formData.data.injury.immediateSymptoms).toBe('Neck pain, Back pain, Headaches');
      
      // Check treatment mapping
      expect(formData.data.currentTreatments.length).toBeGreaterThan(0);
      const physicalTherapy = formData.data.currentTreatments.find(
        t => t.type === 'Physical Therapy'
      );
      expect(physicalTherapy).toBeDefined();
      expect(physicalTherapy?.provider).toBe('Smith Rehabilitation Center');
      
      // Check hospitalization treatment mapping
      const hospitalization = formData.data.currentTreatments.find(
        t => t.type === 'Hospitalization'
      );
      expect(hospitalization).toBeDefined();
      expect(hospitalization?.facility).toBe('City General Hospital');
      
      // Check medications mapping
      expect(formData.data.currentMedications).toHaveLength(2);
      expect(formData.data.currentMedications[0].name).toBe('Metformin');
      expect(formData.data.currentMedications[0].dosage).toBe('500mg');
    });
    
    it('should return empty form data when context data is empty', () => {
      const { formData, hasData } = mapContextToForm({}, mockInitialFormState);
      
      expect(hasData).toBe(false);
      expect(formData).toEqual(mockInitialFormState);
    });
    
    it('should handle missing sections gracefully', () => {
      const partialContextData = {
        pastMedicalHistory: {
          conditions: [
            {
              condition: 'Asthma',
              diagnosisDate: '2015-03-10',
              treatment: 'Inhaler as needed'
            }
          ]
        }
        // Missing other sections
      };
      
      const { formData, hasData } = mapContextToForm(partialContextData, mockInitialFormState);
      
      expect(hasData).toBe(true);
      expect(formData.data.preExistingConditions).toHaveLength(1);
      expect(formData.data.preExistingConditions[0].condition).toBe('Asthma');
      
      // Other sections should be initialized with defaults
      expect(formData.data.injury).toBeDefined();
      expect(formData.data.currentTreatments).toBeDefined();
    });
    
    it('should handle malformed data without crashing', () => {
      const malformedData = {
        pastMedicalHistory: {
          conditions: "Not an array" // Incorrect type
        }
      };
      
      // Should not throw an error
      const { formData, hasData } = mapContextToForm(malformedData, mockInitialFormState);
      
      expect(hasData).toBe(false);
      expect(formData).toEqual(mockInitialFormState);
      expect(console.error).toHaveBeenCalled();
    });
  });
  
  // Test mapping from form to context
  describe('mapFormToContext', () => {
    it('should correctly map form data to context structure', () => {
      const formData = {
        data: {
          preExistingConditions: [
            {
              condition: 'Arthritis',
              diagnosisDate: '2017-06-12',
              details: 'Joint pain management with NSAIDs'
            }
          ],
          surgeries: [
            {
              procedure: 'Knee Arthroscopy',
              date: '2018-11-30',
              surgeon: 'Dr. Brown',
              facility: 'Orthopedic Surgical Center'
            }
          ],
          allergies: ['Sulfa drugs', 'Shellfish'],
          currentMedications: [
            {
              name: 'Naproxen',
              dosage: '500mg',
              frequency: 'twice daily',
              prescribedFor: 'Joint pain',
              prescribedBy: 'Dr. Lee',
              startDate: '2017-07-01',
              status: 'current'
            }
          ],
          injury: {
            date: '2022-08-10',
            time: '09:45',
            position: 'Passenger',
            impactType: 'Side Impact Collision',
            circumstance: 'Intersection accident, other driver ran red light',
            preparedForImpact: 'Yes',
            immediateSymptoms: 'Shoulder pain, Neck stiffness',
            immediateResponse: 'Evaluated by paramedics on scene',
            vehicleDamage: 'Significant driver side damage',
            subsequentCare: 'Emergency department visit',
            initialTreatment: 'X-rays, pain medication'
          },
          currentTreatments: [
            {
              provider: 'Johnson Rehab Center',
              type: 'Occupational Therapy',
              facility: 'Johnson Rehab Center',
              startDate: '2022-08-20',
              frequency: '2x weekly',
              status: 'ongoing',
              notes: 'Working on shoulder mobility and strength',
              endDate: ''
            },
            {
              provider: 'Dr. Adams',
              type: 'Hospitalization',
              facility: 'Memorial Hospital',
              startDate: '2022-08-10',
              frequency: 'Daily',
              status: 'completed',
              notes: 'Observation for potential internal injuries',
              endDate: '2022-08-12'
            }
          ]
        }
      };
      
      const contextData = mapFormToContext(formData);
      
      // Check pastMedicalHistory mapping
      expect(contextData.pastMedicalHistory.conditions).toHaveLength(1);
      expect(contextData.pastMedicalHistory.conditions[0].condition).toBe('Arthritis');
      expect(contextData.pastMedicalHistory.conditions[0].treatment).toBe('Joint pain management with NSAIDs');
      
      // Check surgeries mapping
      expect(contextData.pastMedicalHistory.surgeries).toHaveLength(1);
      expect(contextData.pastMedicalHistory.surgeries[0].procedure).toBe('Knee Arthroscopy');
      expect(contextData.pastMedicalHistory.surgeries[0].facility).toBe('Orthopedic Surgical Center');
      
      // Check allergies mapping
      expect(contextData.pastMedicalHistory.allergies).toBe('Sulfa drugs, Shellfish');
      
      // Check medications mapping
      expect(contextData.pastMedicalHistory.medications).toHaveLength(1);
      expect(contextData.pastMedicalHistory.medications[0].name).toBe('Naproxen');
      expect(contextData.pastMedicalHistory.medications[0].reason).toBe('Joint pain');
      
      // Check injury details mapping
      expect(contextData.injuryDetails.diagnosisDate).toBe('2022-08-10');
      expect(contextData.injuryDetails.mechanism).toBe('Side Impact Collision');
      expect(contextData.injuryDetails.description).toBe('Intersection accident, other driver ran red light');
      
      // Check treatment history mapping
      expect(contextData.treatmentHistory.hospitalizations).toHaveLength(1);
      expect(contextData.treatmentHistory.hospitalizations[0].facility).toBe('Memorial Hospital');
      expect(contextData.treatmentHistory.hospitalizations[0].admissionDate).toBe('2022-08-10');
      expect(contextData.treatmentHistory.hospitalizations[0].dischargeDate).toBe('2022-08-12');
      
      expect(contextData.treatmentHistory.rehabilitationServices).toHaveLength(1);
      expect(contextData.treatmentHistory.rehabilitationServices[0].type).toBe('Occupational Therapy');
      expect(contextData.treatmentHistory.rehabilitationServices[0].frequency).toBe('2x weekly');
    });
    
    it('should preserve existing context data not covered by the form', () => {
      const existingContextData = {
        functionalHistory: {
          priorLevelOfFunction: 'Fully independent',
          recentChanges: 'Reduced mobility',
          priorLivingArrangement: 'Single family home',
          priorMobilityStatus: 'No mobility aids'
        },
        customField: 'This should be preserved'
      };
      
      const formData = {
        data: {
          preExistingConditions: [],
          surgeries: [],
          allergies: [],
          currentMedications: [],
          injury: {
            date: '2023-05-01',
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
          },
          currentTreatments: []
        }
      };
      
      const contextData = mapFormToContext(formData, existingContextData);
      
      // Check that existing data is preserved
      expect(contextData.functionalHistory.priorLevelOfFunction).toBe('Fully independent');
      expect(contextData.customField).toBe('This should be preserved');
      
      // Check that new data is added
      expect(contextData.injuryDetails.diagnosisDate).toBe('2023-05-01');
    });
    
    it('should handle empty form data gracefully', () => {
      const emptyFormData = {
        data: {
          preExistingConditions: [],
          surgeries: [],
          allergies: [],
          currentMedications: [],
          injury: {
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
          },
          currentTreatments: []
        }
      };
      
      const existingContextData = { someField: 'value' };
      const contextData = mapFormToContext(emptyFormData, existingContextData);
      
      // Should still return a properly structured object
      expect(contextData.pastMedicalHistory).toBeDefined();
      expect(contextData.pastMedicalHistory.conditions).toEqual([]);
      expect(contextData.someField).toBe('value');
    });
    
    it('should handle malformed form data without crashing', () => {
      const malformedFormData = {
        data: {
          // Missing required fields
        }
      };
      
      // Should not throw an error
      const contextData = mapFormToContext(malformedFormData);
      
      // Should return a minimal valid object
      expect(contextData.pastMedicalHistory).toBeDefined();
      expect(contextData.injuryDetails).toBeDefined();
      expect(contextData.treatmentHistory).toBeDefined();
      expect(console.error).toHaveBeenCalled();
    });
  });
  
  // Test JSON import/export functionality
  describe('JSON import/export', () => {
    it('should properly export context data to JSON', () => {
      const jsonString = exportMedicalHistoryToJson(mockContextData);
      
      // Should be a valid JSON string
      expect(() => JSON.parse(jsonString)).not.toThrow();
      
      // Should contain the original data
      const parsedData = JSON.parse(jsonString);
      expect(parsedData.pastMedicalHistory.conditions).toHaveLength(2);
      expect(parsedData.injuryDetails.mechanism).toBe('Motor Vehicle Accident');
    });
    
    it('should properly import JSON to context data', () => {
      const jsonString = JSON.stringify(mockContextData);
      const importedData = importMedicalHistoryFromJson(jsonString);
      
      // Should match the original data
      expect(importedData).toEqual(mockContextData);
    });
    
    it('should handle invalid JSON during import', () => {
      const invalidJsonString = '{ this is not valid JSON }';
      
      // Should return null for invalid JSON
      const importedData = importMedicalHistoryFromJson(invalidJsonString);
      expect(importedData).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });
  });
  
  // Test bidirectional mapping consistency
  describe('Bidirectional mapping', () => {
    it('should maintain data integrity through bidirectional mapping', () => {
      // Start with context data
      const { formData, hasData } = mapContextToForm(mockContextData, mockInitialFormState);
      
      // Map back to context format
      const mappedContextData = mapFormToContext(formData);
      
      // Check key fields for data integrity
      expect(mappedContextData.pastMedicalHistory.conditions).toHaveLength(
        mockContextData.pastMedicalHistory.conditions.length
      );
      
      expect(mappedContextData.pastMedicalHistory.conditions[0].condition).toBe(
        mockContextData.pastMedicalHistory.conditions[0].condition
      );
      
      expect(mappedContextData.injuryDetails.diagnosisDate).toBe(
        mockContextData.injuryDetails.diagnosisDate
      );
      
      expect(mappedContextData.injuryDetails.mechanism).toBe(
        mockContextData.injuryDetails.mechanism
      );
      
      expect(mappedContextData.treatmentHistory.rehabilitationServices).toHaveLength(
        mockContextData.treatmentHistory.rehabilitationServices.length
      );
    });
  });
});
