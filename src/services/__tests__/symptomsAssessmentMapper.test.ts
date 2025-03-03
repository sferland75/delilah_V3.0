/**
 * Symptoms Assessment Mapper Service Tests
 * 
 * Tests for the bidirectional mapping functionality between
 * context data and form data structures.
 */

import { 
  mapContextToForm,
  mapFormToContext,
  exportSymptomsToJson,
  importSymptomsFromJson,
  defaultValues
} from '../symptomsAssessmentMapper';

// Mock nanoid to return predictable IDs in tests
jest.mock('nanoid', () => ({
  nanoid: () => 'test-id-123'
}));

// Mock console methods to avoid cluttering test output
global.console.log = jest.fn();
global.console.error = jest.fn();

describe('Symptoms Assessment Mapper Service', () => {
  // Define mock context data for testing
  const mockContextData = {
    generalNotes: 'Client reports symptoms primarily related to MVA from January 2023.',
    physicalSymptoms: [
      {
        id: 'phys-1',
        symptom: 'Headache',
        intensity: '7/10',
        description: 'Throbbing pain in temples and behind eyes',
        frequency: 'Daily',
        duration: '2-6 hours',
        aggravatingFactors: 'Screen time, bright lights, noise',
        alleviatingFactors: 'Rest in dark room, medication, cold compress'
      },
      {
        id: 'phys-2',
        symptom: 'Neck pain',
        intensity: '6/10',
        description: 'Sharp pain with movement, stiffness',
        frequency: 'Constant',
        duration: 'Ongoing',
        aggravatingFactors: 'Turning head, poor posture',
        alleviatingFactors: 'Heat, massage, gentle stretching'
      }
    ],
    cognitiveSymptoms: [
      {
        id: 'cog-1',
        symptom: 'Memory issues',
        severity: 'Moderate',
        description: 'Difficulty remembering appointments and recent events',
        frequency: 'Daily',
        impactOnFunction: 'Affecting work performance and daily organization',
        management: 'Using smartphone reminders and written notes',
        triggers: ['Fatigue', 'Stress', 'Information overload'],
        coping: ['Calendar app', 'Notebook system']
      },
      {
        id: 'cog-2',
        symptom: 'Concentration problems',
        severity: 'Moderate to severe',
        description: 'Unable to focus for more than 30 minutes',
        frequency: 'Daily',
        impactOnFunction: 'Difficulty completing tasks at work and home',
        management: 'Breaking tasks into smaller steps',
        triggers: ['Noise', 'Multiple stimuli'],
        coping: ['Quiet environment', 'Task lists']
      }
    ],
    emotionalSymptoms: [
      {
        type: 'Anxiety',
        severity: 'moderate',
        frequency: 'daily',
        impact: 'Interferes with social activities and sleep',
        management: 'Deep breathing, counseling'
      },
      {
        type: 'Irritability',
        severity: 'moderate',
        frequency: 'intermittent',
        impact: 'Affecting relationships with family members',
        management: 'Taking breaks when needed'
      }
    ]
  };

  // Test mapping from context to form
  describe('mapContextToForm', () => {
    it('should correctly map context data to form structure', () => {
      const { formData, hasData } = mapContextToForm(mockContextData);
      
      // Check hasData flag
      expect(hasData).toBe(true);
      
      // Check general notes mapping
      expect(formData.general.notes).toBe('Client reports symptoms primarily related to MVA from January 2023.');
      
      // Check physical symptoms mapping
      expect(formData.physical).toHaveLength(2);
      expect(formData.physical[0].location).toBe('Headache');
      expect(formData.physical[0].intensity).toBe('7/10');
      expect(formData.physical[0].frequency).toBe('Daily');
      expect(formData.physical[0].duration).toBe('2-6 hours');
      expect(formData.physical[0].aggravating).toEqual(['Screen time', 'bright lights', 'noise']);
      expect(formData.physical[0].alleviating).toEqual(['Rest in dark room', 'medication', 'cold compress']);
      
      // Check cognitive symptoms mapping
      expect(formData.cognitive).toHaveLength(2);
      expect(formData.cognitive[0].type).toBe('Memory issues');
      expect(formData.cognitive[0].impact).toBe('Affecting work performance and daily organization');
      expect(formData.cognitive[0].frequency).toBe('Daily');
      expect(formData.cognitive[0].triggers).toEqual(['Fatigue', 'Stress', 'Information overload']);
      expect(formData.cognitive[0].coping).toEqual(['Calendar app', 'Notebook system']);
      
      // Check emotional symptoms mapping
      expect(formData.emotional).toHaveLength(2);
      expect(formData.emotional[0].type).toBe('Anxiety');
      expect(formData.emotional[0].severity).toBe('moderate');
      expect(formData.emotional[0].frequency).toBe('daily');
      expect(formData.emotional[0].impact).toBe('Interferes with social activities and sleep');
    });
    
    it('should return empty form data when context data is empty', () => {
      const { formData, hasData } = mapContextToForm({});
      
      expect(hasData).toBe(false);
      expect(formData).toEqual(defaultValues);
    });
    
    it('should handle comma-separated factor lists', () => {
      const singleStringFactors = {
        physicalSymptoms: [
          {
            id: 'phys-1',
            symptom: 'Back pain',
            aggravatingFactors: 'Bending, lifting, sitting for long periods',
            alleviatingFactors: 'Rest, heat, medication'
          }
        ]
      };
      
      const { formData, hasData } = mapContextToForm(singleStringFactors);
      
      expect(hasData).toBe(true);
      expect(formData.physical[0].location).toBe('Back pain');
      expect(formData.physical[0].aggravating).toEqual(['Bending', 'lifting', 'sitting for long periods']);
      expect(formData.physical[0].alleviating).toEqual(['Rest', 'heat', 'medication']);
    });
    
    it('should handle legacy emotional symptoms format', () => {
      const legacyFormat = {
        emotionalSymptoms: [
          {
            symptom: 'Depression',
            severity: 'mild',
            impactOnFunction: 'Low energy affecting daily activities',
            frequency: 'daily'
          }
        ]
      };
      
      const { formData, hasData } = mapContextToForm(legacyFormat);
      
      expect(hasData).toBe(true);
      expect(formData.emotional).toHaveLength(1);
      expect(formData.emotional[0].type).toBe('Depression');
      expect(formData.emotional[0].severity).toBe('mild');
      expect(formData.emotional[0].impact).toBe('Low energy affecting daily activities');
    });
    
    it('should handle different symptom count formats (none, single, multiple)', () => {
      // No symptoms
      const noSymptoms = { generalNotes: 'No symptoms reported' };
      const { formData: noSymptomsForm, hasData: noSymptomsHasData } = mapContextToForm(noSymptoms);
      
      expect(noSymptomsHasData).toBe(true); // Has general notes
      expect(noSymptomsForm.physical).toEqual(defaultValues.physical);
      expect(noSymptomsForm.cognitive).toEqual(defaultValues.cognitive);
      expect(noSymptomsForm.emotional).toEqual([]);
      
      // Single symptom
      const singleSymptom = {
        physicalSymptoms: [
          {
            symptom: 'Dizziness',
            frequency: 'Intermittent'
          }
        ]
      };
      
      const { formData: singleForm, hasData: singleHasData } = mapContextToForm(singleSymptom);
      
      expect(singleHasData).toBe(true);
      expect(singleForm.physical).toHaveLength(1);
      expect(singleForm.physical[0].location).toBe('Dizziness');
      expect(singleForm.physical[0].frequency).toBe('Intermittent');
      
      // Multiple symptoms of different types
      const multipleSymptoms = {
        physicalSymptoms: [
          { symptom: 'Pain 1' },
          { symptom: 'Pain 2' }
        ],
        cognitiveSymptoms: [
          { symptom: 'Cognition 1' }
        ]
      };
      
      const { formData: multipleForm, hasData: multipleHasData } = mapContextToForm(multipleSymptoms);
      
      expect(multipleHasData).toBe(true);
      expect(multipleForm.physical).toHaveLength(2);
      expect(multipleForm.cognitive).toHaveLength(1);
    });
    
    it('should handle malformed data without crashing', () => {
      const malformedData = {
        physicalSymptoms: "Not an array", // Incorrect type
        cognitiveSymptoms: [null], // Invalid elements
        emotionalSymptoms: {} // Wrong type
      };
      
      // Should not throw an error
      const { formData, hasData } = mapContextToForm(malformedData);
      
      expect(hasData).toBe(false);
      expect(formData).toEqual(defaultValues);
      expect(console.error).toHaveBeenCalled();
    });
  });
  
  // Test mapping from form to context
  describe('mapFormToContext', () => {
    it('should correctly map form data to context structure', () => {
      const formData = {
        general: {
          notes: 'Client reports gradual improvement of symptoms over the past month'
        },
        physical: [
          {
            id: 'phys-1',
            location: 'Lower back pain',
            intensity: '5/10',
            description: 'Dull ache with occasional sharp pain',
            frequency: 'Daily',
            duration: '2-3 hours',
            aggravating: ['Sitting', 'Bending', 'Lifting'],
            alleviating: ['Walking', 'Heat', 'Stretching']
          }
        ],
        cognitive: [
          {
            id: 'cog-1',
            type: 'Word finding difficulty',
            impact: 'Causes frustration during conversations',
            management: 'Taking pauses, using alternative words',
            frequency: 'Daily',
            triggers: ['Fatigue', 'Stress'],
            coping: ['Speaking more slowly', 'Pre-planning important conversations']
          }
        ],
        emotional: [
          {
            type: 'Frustration',
            severity: 'moderate',
            frequency: 'daily',
            impact: 'Affects family interactions',
            management: 'Taking breaks, meditation'
          }
        ]
      };
      
      const contextData = mapFormToContext(formData);
      
      // Check general notes mapping
      expect(contextData.generalNotes).toBe('Client reports gradual improvement of symptoms over the past month');
      
      // Check physical symptoms mapping
      expect(contextData.physicalSymptoms).toHaveLength(1);
      expect(contextData.physicalSymptoms[0].symptom).toBe('Lower back pain');
      expect(contextData.physicalSymptoms[0].intensity).toBe('5/10');
      expect(contextData.physicalSymptoms[0].frequency).toBe('Daily');
      expect(contextData.physicalSymptoms[0].duration).toBe('2-3 hours');
      expect(contextData.physicalSymptoms[0].aggravatingFactors).toBe('Sitting, Bending, Lifting');
      expect(contextData.physicalSymptoms[0].alleviatingFactors).toBe('Walking, Heat, Stretching');
      
      // Check cognitive symptoms mapping
      expect(contextData.cognitiveSymptoms).toHaveLength(1);
      expect(contextData.cognitiveSymptoms[0].symptom).toBe('Word finding difficulty');
      expect(contextData.cognitiveSymptoms[0].impactOnFunction).toBe('Causes frustration during conversations');
      expect(contextData.cognitiveSymptoms[0].management).toBe('Taking pauses, using alternative words');
      expect(contextData.cognitiveSymptoms[0].frequency).toBe('Daily');
      expect(contextData.cognitiveSymptoms[0].triggers).toEqual(['Fatigue', 'Stress']);
      
      // Check emotional symptoms mapping
      expect(contextData.emotionalSymptoms).toHaveLength(1);
      expect(contextData.emotionalSymptoms[0].type).toBe('Frustration');
      expect(contextData.emotionalSymptoms[0].severity).toBe('moderate');
      expect(contextData.emotionalSymptoms[0].frequency).toBe('daily');
      expect(contextData.emotionalSymptoms[0].impact).toBe('Affects family interactions');
    });
    
    it('should filter out empty symptom entries', () => {
      const formDataWithEmpty = {
        general: {
          notes: 'Test notes'
        },
        physical: [
          {
            id: 'phys-1',
            location: 'Headache',
            intensity: '7/10',
            description: '',
            frequency: '',
            duration: '',
            aggravating: [],
            alleviating: []
          },
          {
            id: 'phys-2',
            location: '',  // Empty location should be filtered out
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
            id: 'cog-1',
            type: 'Memory issues',
            impact: '',
            management: '',
            frequency: '',
            triggers: [],
            coping: []
          },
          {
            id: 'cog-2',
            type: '',  // Empty type should be filtered out
            impact: 'Some impact description',
            management: '',
            frequency: '',
            triggers: [],
            coping: []
          }
        ],
        emotional: [
          {
            type: 'Anxiety',
            severity: '',
            frequency: '',
            impact: '',
            management: ''
          },
          {
            type: '',  // Empty type should be filtered out
            severity: 'severe',
            frequency: 'daily',
            impact: 'Significant impact',
            management: ''
          }
        ]
      };
      
      const contextData = mapFormToContext(formDataWithEmpty);
      
      // Should only include non-empty entries
      expect(contextData.physicalSymptoms).toHaveLength(1);
      expect(contextData.physicalSymptoms[0].symptom).toBe('Headache');
      
      expect(contextData.cognitiveSymptoms).toHaveLength(1);
      expect(contextData.cognitiveSymptoms[0].symptom).toBe('Memory issues');
      
      expect(contextData.emotionalSymptoms).toHaveLength(1);
      expect(contextData.emotionalSymptoms[0].type).toBe('Anxiety');
    });
    
    it('should handle empty form data gracefully', () => {
      const emptyFormData = {
        general: {
          notes: ''
        },
        physical: [
          {
            id: 'phys-1',
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
            id: 'cog-1',
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
      
      const contextData = mapFormToContext(emptyFormData);
      
      // Should return a properly structured object with empty collections
      expect(contextData.physicalSymptoms).toHaveLength(0);
      expect(contextData.cognitiveSymptoms).toHaveLength(0);
      expect(contextData.emotionalSymptoms).toHaveLength(0);
    });
    
    it('should handle malformed form data without crashing', () => {
      const malformedFormData = {
        general: null, // Should be an object
        physical: null, // Should be an array
        cognitive: [
          {
            // Missing required fields
          }
        ],
        // Missing emotional
      };
      
      // Should not throw an error
      const contextData = mapFormToContext(malformedFormData as any);
      
      // Should return a minimal valid object
      expect(contextData.generalNotes).toBe('');
      expect(contextData.physicalSymptoms).toHaveLength(0);
      expect(contextData.cognitiveSymptoms).toHaveLength(0);
      expect(contextData.emotionalSymptoms).toHaveLength(0);
      expect(console.error).toHaveBeenCalled();
    });
  });
  
  // Test JSON import/export functionality
  describe('JSON import/export', () => {
    it('should properly export context data to JSON', () => {
      const jsonString = exportSymptomsToJson(mockContextData);
      
      // Should be a valid JSON string
      expect(() => JSON.parse(jsonString)).not.toThrow();
      
      // Should contain the original data
      const parsedData = JSON.parse(jsonString);
      expect(parsedData.physicalSymptoms).toHaveLength(2);
      expect(parsedData.cognitiveSymptoms).toHaveLength(2);
      expect(parsedData.emotionalSymptoms).toHaveLength(2);
      expect(parsedData.physicalSymptoms[0].symptom).toBe('Headache');
    });
    
    it('should properly import JSON to context data', () => {
      const jsonString = JSON.stringify(mockContextData);
      const importedData = importSymptomsFromJson(jsonString);
      
      // Should match the original data
      expect(importedData).toEqual(mockContextData);
    });
    
    it('should handle invalid JSON during import', () => {
      const invalidJsonString = '{ this is not valid JSON }';
      
      // Should return null for invalid JSON
      const importedData = importSymptomsFromJson(invalidJsonString);
      expect(importedData).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });
  });
  
  // Test bidirectional mapping consistency
  describe('Bidirectional mapping', () => {
    it('should maintain data integrity through bidirectional mapping', () => {
      // Start with context data
      const { formData, hasData } = mapContextToForm(mockContextData);
      
      // Map back to context format
      const mappedContextData = mapFormToContext(formData);
      
      // Check key fields for data integrity
      expect(mappedContextData.generalNotes).toBe(
        mockContextData.generalNotes
      );
      
      expect(mappedContextData.physicalSymptoms).toHaveLength(
        mockContextData.physicalSymptoms.length
      );
      
      expect(mappedContextData.physicalSymptoms[0].symptom).toBe(
        mockContextData.physicalSymptoms[0].symptom
      );
      
      expect(mappedContextData.cognitiveSymptoms).toHaveLength(
        mockContextData.cognitiveSymptoms.length
      );
      
      expect(mappedContextData.cognitiveSymptoms[0].symptom).toBe(
        mockContextData.cognitiveSymptoms[0].symptom
      );
      
      expect(mappedContextData.emotionalSymptoms).toHaveLength(
        mockContextData.emotionalSymptoms.length
      );
      
      expect(mappedContextData.emotionalSymptoms[0].type).toBe(
        mockContextData.emotionalSymptoms[0].type
      );
    });
  });
});
