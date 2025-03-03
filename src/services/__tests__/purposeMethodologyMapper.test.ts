/**
 * Purpose & Methodology Mapper Service Tests
 * 
 * Tests for the bidirectional mapping functionality between
 * context data and form data structures.
 */

import { 
  mapContextToForm,
  mapFormToContext,
  exportToJson,
  importFromJson,
  defaultValues
} from '../purposeMethodologyMapper';

// Mock console methods to avoid cluttering test output
global.console.log = jest.fn();
global.console.error = jest.fn();

describe('Purpose & Methodology Mapper Service', () => {
  // Define mock context data for testing
  const mockContextData = {
    purpose: {
      primaryPurpose: 'To assess the client\'s functional status and determine rehabilitation needs',
      assessmentObjectives: [
        'Evaluate current level of function',
        'Identify barriers to independence',
        'Recommend appropriate interventions',
        'Determine equipment needs'
      ],
      referralQuestions: [
        'What are the client\'s current functional limitations?',
        'What equipment would improve the client\'s independence?',
        'How would home modifications enhance safety and accessibility?'
      ]
    },
    methodology: {
      assessmentMethods: [
        'Clinical interview',
        'Standardized assessments',
        'Home environment evaluation',
        'Functional task observation'
      ],
      documentsReviewed: [
        'Medical records from Dr. Smith dated January 15, 2025',
        'Previous OT assessment from June 2024',
        'Diagnostic imaging reports',
        'Discharge summary from rehab facility'
      ],
      standardsCompliance: 'This assessment complies with AOTA standards for occupational therapy evaluation',
      limitations: 'Limited time for assessment may have impacted comprehensiveness',
      methodologyNotes: 'Assessment was conducted over two separate sessions due to client fatigue'
    }
  };

  // Test mapping from context to form
  describe('mapContextToForm', () => {
    it('should correctly map context data to form structure', () => {
      const { formData, hasData } = mapContextToForm(mockContextData);
      
      // Check hasData flag
      expect(hasData).toBe(true);
      
      // Check purpose mapping
      expect(formData.purpose.primaryPurpose).toBe('To assess the client\'s functional status and determine rehabilitation needs');
      expect(formData.purpose.assessmentObjectives).toHaveLength(4);
      expect(formData.purpose.assessmentObjectives).toContain('Evaluate current level of function');
      expect(formData.purpose.assessmentObjectives).toContain('Determine equipment needs');
      expect(formData.purpose.referralQuestions).toHaveLength(3);
      expect(formData.purpose.referralQuestions).toContain('What are the client\'s current functional limitations?');
      expect(formData.purpose.referralQuestions).toContain('How would home modifications enhance safety and accessibility?');
      
      // Check methodology mapping
      expect(formData.methodology.assessmentMethods).toHaveLength(4);
      expect(formData.methodology.assessmentMethods).toContain('Clinical interview');
      expect(formData.methodology.assessmentMethods).toContain('Functional task observation');
      expect(formData.methodology.documentsReviewed).toHaveLength(4);
      expect(formData.methodology.documentsReviewed).toContain('Medical records from Dr. Smith dated January 15, 2025');
      expect(formData.methodology.documentsReviewed).toContain('Discharge summary from rehab facility');
      expect(formData.methodology.standardsCompliance).toBe('This assessment complies with AOTA standards for occupational therapy evaluation');
      expect(formData.methodology.limitations).toBe('Limited time for assessment may have impacted comprehensiveness');
      expect(formData.methodology.methodologyNotes).toBe('Assessment was conducted over two separate sessions due to client fatigue');
    });
    
    it('should return empty form data when context data is empty', () => {
      const { formData, hasData } = mapContextToForm({});
      
      expect(hasData).toBe(false);
      expect(formData).toEqual(defaultValues);
    });
    
    it('should parse string-based lists into arrays', () => {
      const stringBasedContextData = {
        purpose: {
          assessmentObjectives: 'Evaluate functional status. Determine safety risks. Recommend equipment.',
          referralQuestions: 'What is the client\'s mobility level? How can home safety be improved?'
        },
        methodology: {
          assessmentMethods: 'Observation, interview, standardized tests.',
          documentsReviewed: 'Medical records, previous assessments, imaging reports.'
        }
      };
      
      const { formData, hasData } = mapContextToForm(stringBasedContextData);
      
      expect(hasData).toBe(true);
      
      // Check parsing of purpose strings
      expect(Array.isArray(formData.purpose.assessmentObjectives)).toBe(true);
      expect(formData.purpose.assessmentObjectives).toHaveLength(3);
      expect(formData.purpose.assessmentObjectives[0]).toBe('Evaluate functional status');
      
      expect(Array.isArray(formData.purpose.referralQuestions)).toBe(true);
      expect(formData.purpose.referralQuestions).toHaveLength(2);
      expect(formData.purpose.referralQuestions[0]).toBe('What is the client\'s mobility level?');
      
      // Check parsing of methodology strings
      expect(Array.isArray(formData.methodology.assessmentMethods)).toBe(true);
      expect(formData.methodology.assessmentMethods).toHaveLength(3);
      expect(formData.methodology.assessmentMethods).toContain('Observation');
      
      expect(Array.isArray(formData.methodology.documentsReviewed)).toBe(true);
      expect(formData.methodology.documentsReviewed).toHaveLength(3);
      expect(formData.methodology.documentsReviewed).toContain('Medical records');
    });
    
    it('should handle object-based array items', () => {
      const objectBasedContextData = {
        purpose: {
          assessmentObjectives: [
            { objective: 'Assess mobility' },
            { description: 'Evaluate safety' },
            { text: 'Determine equipment needs' }
          ],
          referralQuestions: [
            { question: 'What is the functional level?' },
            { text: 'What supports are needed?' }
          ]
        }
      };
      
      const { formData, hasData } = mapContextToForm(objectBasedContextData);
      
      expect(hasData).toBe(true);
      expect(formData.purpose.assessmentObjectives).toHaveLength(3);
      expect(formData.purpose.assessmentObjectives).toContain('Assess mobility');
      expect(formData.purpose.assessmentObjectives).toContain('Evaluate safety');
      expect(formData.purpose.assessmentObjectives).toContain('Determine equipment needs');
      
      expect(formData.purpose.referralQuestions).toHaveLength(2);
      expect(formData.purpose.referralQuestions).toContain('What is the functional level?');
      expect(formData.purpose.referralQuestions).toContain('What supports are needed?');
    });
    
    it('should handle notes field in different formats', () => {
      const alternateNotesFormat = {
        methodology: {
          notes: 'These are methodology notes in an alternate field'
        }
      };
      
      const { formData, hasData } = mapContextToForm(alternateNotesFormat);
      
      expect(hasData).toBe(true);
      expect(formData.methodology.methodologyNotes).toBe('These are methodology notes in an alternate field');
    });
    
    it('should handle malformed data without crashing', () => {
      const malformedData = {
        purpose: null, // Should be an object
        methodology: {
          assessmentMethods: 123, // Should be a string or array
          // Missing other fields
        }
      };
      
      // Should not throw an error
      const { formData, hasData } = mapContextToForm(malformedData);
      
      expect(formData).toEqual(defaultValues);
      expect(console.error).toHaveBeenCalled();
    });
  });
  
  // Test mapping from form to context
  describe('mapFormToContext', () => {
    it('should correctly map form data to context structure', () => {
      // Sample form data
      const formData = {
        purpose: {
          primaryPurpose: 'To evaluate the client\'s functional abilities following stroke',
          assessmentObjectives: [
            'Assess upper and lower extremity function',
            'Evaluate cognitive status',
            'Determine safe mobility strategies'
          ],
          referralQuestions: [
            'What level of assistance is required for ADLs?',
            'Is the client safe to return home?',
            'What adaptive equipment is recommended?'
          ]
        },
        methodology: {
          assessmentMethods: [
            'Clinical observation',
            'Barthel Index assessment',
            'Home safety evaluation',
            'Cognitive screening'
          ],
          documentsReviewed: [
            'Hospital discharge summary',
            'Neurologist report',
            'Physical therapy assessment'
          ],
          standardsCompliance: 'Assessment follows stroke rehabilitation best practice guidelines',
          limitations: 'Client fatigue limited some aspects of functional testing',
          methodologyNotes: 'Family members provided additional history'
        }
      };
      
      const contextData = mapFormToContext(formData);
      
      // Check purpose mapping
      expect(contextData.purpose.primaryPurpose).toBe('To evaluate the client\'s functional abilities following stroke');
      expect(contextData.purpose.assessmentObjectives).toHaveLength(3);
      expect(contextData.purpose.assessmentObjectives).toContain('Assess upper and lower extremity function');
      expect(contextData.purpose.assessmentObjectives).toContain('Determine safe mobility strategies');
      expect(contextData.purpose.referralQuestions).toHaveLength(3);
      expect(contextData.purpose.referralQuestions).toContain('What level of assistance is required for ADLs?');
      expect(contextData.purpose.referralQuestions).toContain('What adaptive equipment is recommended?');
      
      // Check methodology mapping
      expect(contextData.methodology.assessmentMethods).toHaveLength(4);
      expect(contextData.methodology.assessmentMethods).toContain('Clinical observation');
      expect(contextData.methodology.assessmentMethods).toContain('Cognitive screening');
      expect(contextData.methodology.documentsReviewed).toHaveLength(3);
      expect(contextData.methodology.documentsReviewed).toContain('Hospital discharge summary');
      expect(contextData.methodology.documentsReviewed).toContain('Physical therapy assessment');
      expect(contextData.methodology.standardsCompliance).toBe('Assessment follows stroke rehabilitation best practice guidelines');
      expect(contextData.methodology.limitations).toBe('Client fatigue limited some aspects of functional testing');
      expect(contextData.methodology.methodologyNotes).toBe('Family members provided additional history');
    });
    
    it('should handle empty form data gracefully', () => {
      const emptyFormData = {
        purpose: {
          primaryPurpose: '',
          assessmentObjectives: [],
          referralQuestions: []
        },
        methodology: {
          assessmentMethods: [],
          documentsReviewed: [],
          standardsCompliance: '',
          limitations: '',
          methodologyNotes: ''
        }
      };
      
      const contextData = mapFormToContext(emptyFormData);
      
      // Should return a valid structured object with empty collections
      expect(contextData.purpose).toBeDefined();
      expect(contextData.methodology).toBeDefined();
      expect(contextData.purpose.primaryPurpose).toBe('');
      expect(contextData.purpose.assessmentObjectives).toHaveLength(0);
      expect(contextData.purpose.referralQuestions).toHaveLength(0);
      expect(contextData.methodology.assessmentMethods).toHaveLength(0);
      expect(contextData.methodology.documentsReviewed).toHaveLength(0);
      expect(contextData.methodology.standardsCompliance).toBe('');
    });
    
    it('should handle malformed form data without crashing', () => {
      const malformedFormData = {
        purpose: null, // Should be an object
        methodology: {
          // Missing fields
        }
      };
      
      // Should not throw an error
      const contextData = mapFormToContext(malformedFormData as any);
      
      // Should return an object with properties
      expect(contextData).toBeDefined();
      expect(console.error).toHaveBeenCalled();
    });
  });
  
  // Test JSON import/export functionality
  describe('JSON import/export', () => {
    it('should properly export context data to JSON', () => {
      const jsonString = exportToJson(mockContextData);
      
      // Should be a valid JSON string
      expect(() => JSON.parse(jsonString)).not.toThrow();
      
      // Should contain the original data
      const parsedData = JSON.parse(jsonString);
      expect(parsedData.purpose.primaryPurpose).toBe('To assess the client\'s functional status and determine rehabilitation needs');
      expect(parsedData.purpose.assessmentObjectives).toHaveLength(4);
      expect(parsedData.methodology.assessmentMethods).toHaveLength(4);
    });
    
    it('should properly import JSON to context data', () => {
      const jsonString = JSON.stringify(mockContextData);
      const importedData = importFromJson(jsonString);
      
      // Should match the original data
      expect(importedData).toEqual(mockContextData);
    });
    
    it('should handle invalid JSON during import', () => {
      const invalidJsonString = '{ this is not valid JSON }';
      
      // Should return null for invalid JSON
      const importedData = importFromJson(invalidJsonString);
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
      expect(mappedContextData.purpose.primaryPurpose).toBe(
        mockContextData.purpose.primaryPurpose
      );
      
      expect(mappedContextData.purpose.assessmentObjectives).toHaveLength(
        mockContextData.purpose.assessmentObjectives.length
      );
      
      expect(mappedContextData.purpose.referralQuestions).toHaveLength(
        mockContextData.purpose.referralQuestions.length
      );
      
      expect(mappedContextData.methodology.assessmentMethods).toHaveLength(
        mockContextData.methodology.assessmentMethods.length
      );
      
      expect(mappedContextData.methodology.documentsReviewed).toHaveLength(
        mockContextData.methodology.documentsReviewed.length
      );
      
      expect(mappedContextData.methodology.standardsCompliance).toBe(
        mockContextData.methodology.standardsCompliance
      );
      
      expect(mappedContextData.methodology.methodologyNotes).toBe(
        mockContextData.methodology.methodologyNotes
      );
    });
    
    it('should handle conversion between string and array formats', () => {
      // Context data with string representations
      const stringContextData = {
        purpose: {
          assessmentObjectives: 'Objective 1. Objective 2. Objective 3.',
          referralQuestions: 'Question 1? Question 2?'
        },
        methodology: {
          assessmentMethods: 'Method 1, Method 2, Method 3',
          documentsReviewed: 'Document 1, Document 2'
        }
      };
      
      // First map to form (string -> array)
      const { formData, hasData } = mapContextToForm(stringContextData);
      expect(hasData).toBe(true);
      expect(Array.isArray(formData.purpose.assessmentObjectives)).toBe(true);
      expect(Array.isArray(formData.purpose.referralQuestions)).toBe(true);
      
      // Then map back to context (array stays array)
      const mappedContextData = mapFormToContext(formData);
      expect(Array.isArray(mappedContextData.purpose.assessmentObjectives)).toBe(true);
      expect(Array.isArray(mappedContextData.purpose.referralQuestions)).toBe(true);
      expect(Array.isArray(mappedContextData.methodology.assessmentMethods)).toBe(true);
      expect(Array.isArray(mappedContextData.methodology.documentsReviewed)).toBe(true);
      
      // Verify item count is maintained
      expect(mappedContextData.purpose.assessmentObjectives).toHaveLength(3);
      expect(mappedContextData.purpose.referralQuestions).toHaveLength(2);
      expect(mappedContextData.methodology.assessmentMethods).toHaveLength(3);
      expect(mappedContextData.methodology.documentsReviewed).toHaveLength(2);
    });
  });
});
