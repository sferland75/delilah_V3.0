/**
 * Initial Assessment Mapper Service Tests
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
} from '../initialAssessmentMapper';

// Mock console methods to avoid cluttering test output
global.console.log = jest.fn();
global.console.error = jest.fn();

describe('Initial Assessment Mapper Service', () => {
  // Define mock context data for testing
  const mockContextData = {
    demographics: {
      name: 'John Smith',
      dob: '1975-05-15',
      address: '123 Main Street, Anytown, NY 10001',
      phone: '(555) 123-4567',
      email: 'john.smith@example.com',
      caseManager: 'Sarah Johnson',
      insurance: 'ABC Insurance',
      claimNumber: 'CL-123456',
      dateOfInjury: '2024-12-10',
      dateOfAssessment: '2025-02-15',
      assessor: 'Dr. Jane Wilson, OT',
      referralSource: 'Dr. Robert Brown, MD',
      referralReason: 'Functional assessment following MVA'
    },
    assessmentDetails: {
      primaryLanguage: 'English',
      interpreter: false,
      interpreterDetails: '',
      assessmentLocation: 'Client\'s home',
      personsPresent: 'Client and spouse',
      assessmentType: 'In-person',
      assessmentNotes: 'Client was cooperative throughout the assessment'
    }
  };

  // Test mapping from context to form
  describe('mapContextToForm', () => {
    it('should correctly map context data to form structure', () => {
      const { formData, hasData } = mapContextToForm(mockContextData);
      
      // Check hasData flag
      expect(hasData).toBe(true);
      
      // Check demographics mapping
      expect(formData.demographics.clientName).toBe('John Smith');
      expect(formData.demographics.clientDOB).toBe('1975-05-15');
      expect(formData.demographics.clientAddress).toBe('123 Main Street, Anytown, NY 10001');
      expect(formData.demographics.clientPhone).toBe('(555) 123-4567');
      expect(formData.demographics.clientEmail).toBe('john.smith@example.com');
      expect(formData.demographics.caseManager).toBe('Sarah Johnson');
      expect(formData.demographics.insurance).toBe('ABC Insurance');
      expect(formData.demographics.claimNumber).toBe('CL-123456');
      expect(formData.demographics.dateOfInjury).toBe('2024-12-10');
      expect(formData.demographics.dateOfAssessment).toBe('2025-02-15');
      expect(formData.demographics.assessor).toBe('Dr. Jane Wilson, OT');
      expect(formData.demographics.referralSource).toBe('Dr. Robert Brown, MD');
      expect(formData.demographics.referralReason).toBe('Functional assessment following MVA');
      
      // Check assessment details mapping
      expect(formData.assessmentDetails.primaryLanguage).toBe('English');
      expect(formData.assessmentDetails.interpreter).toBe(false);
      expect(formData.assessmentDetails.interpreterDetails).toBe('');
      expect(formData.assessmentDetails.assessmentLocation).toBe('Client\'s home');
      expect(formData.assessmentDetails.personsPresent).toBe('Client and spouse');
      expect(formData.assessmentDetails.assessmentType).toBe('In-person');
      expect(formData.assessmentDetails.assessmentNotes).toBe('Client was cooperative throughout the assessment');
    });
    
    it('should return empty form data when context data is empty', () => {
      const { formData, hasData } = mapContextToForm({});
      
      expect(hasData).toBe(false);
      expect(formData).toEqual(defaultValues);
    });
    
    it('should handle alternate format for client information', () => {
      const alternateFormatData = {
        clientInfo: {
          clientName: 'Jane Doe',
          clientDOB: '1980-10-20',
          clientAddress: '456 Oak Avenue, Somewhere, CA 90210',
          clientPhone: '(555) 987-6543',
          clientEmail: 'jane.doe@example.com',
          caseManager: 'Michael Thompson',
          insurer: 'XYZ Insurance',
          claimNumber: 'CL-654321',
          injuryDate: '2024-11-05',
          assessmentDate: '2025-01-20',
          assessorName: 'Dr. Mark Adams, OT',
          referralSource: 'Dr. Emily White, MD',
          referralReason: 'Home assessment for accessibility'
        }
      };
      
      const { formData, hasData } = mapContextToForm(alternateFormatData);
      
      expect(hasData).toBe(true);
      expect(formData.demographics.clientName).toBe('Jane Doe');
      expect(formData.demographics.clientDOB).toBe('1980-10-20');
      expect(formData.demographics.clientAddress).toBe('456 Oak Avenue, Somewhere, CA 90210');
      expect(formData.demographics.insurance).toBe('XYZ Insurance');
      expect(formData.demographics.dateOfInjury).toBe('2024-11-05');
      expect(formData.demographics.dateOfAssessment).toBe('2025-01-20');
      expect(formData.demographics.assessor).toBe('Dr. Mark Adams, OT');
    });
    
    it('should handle true/Yes values for interpreter flag', () => {
      const contextWithInterpreterYes = {
        assessmentDetails: {
          primaryLanguage: 'Spanish',
          interpreter: 'Yes',
          interpreterDetails: 'Spanish interpreter required'
        }
      };
      
      const { formData, hasData } = mapContextToForm(contextWithInterpreterYes);
      
      expect(hasData).toBe(true);
      expect(formData.assessmentDetails.primaryLanguage).toBe('Spanish');
      expect(formData.assessmentDetails.interpreter).toBe(true);
      expect(formData.assessmentDetails.interpreterDetails).toBe('Spanish interpreter required');
      
      const contextWithInterpreterTrue = {
        assessmentDetails: {
          primaryLanguage: 'Spanish',
          interpreter: true,
          interpreterDetails: 'Spanish interpreter required'
        }
      };
      
      const { formData: formData2, hasData: hasData2 } = mapContextToForm(contextWithInterpreterTrue);
      
      expect(hasData2).toBe(true);
      expect(formData2.assessmentDetails.interpreter).toBe(true);
    });
    
    it('should handle malformed data without crashing', () => {
      const malformedData = {
        demographics: null, // Should be an object
        assessmentDetails: {
          // Missing fields
        }
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
      // Sample form data
      const formData = {
        demographics: {
          clientName: 'David Miller',
          clientDOB: '1968-08-25',
          clientAddress: '789 Pine Street, Elsewhere, TX 75001',
          clientPhone: '(555) 456-7890',
          clientEmail: 'david.miller@example.com',
          caseManager: 'Jessica Williams',
          insurance: 'DEF Insurance',
          claimNumber: 'CL-789012',
          dateOfInjury: '2024-10-15',
          dateOfAssessment: '2025-02-01',
          assessor: 'Dr. Thomas Lee, OT',
          referralSource: 'Dr. Samantha Green, MD',
          referralReason: 'ADL assessment post-surgery'
        },
        assessmentDetails: {
          primaryLanguage: 'English',
          interpreter: true,
          interpreterDetails: 'Sign language interpreter required',
          assessmentLocation: 'Clinic',
          personsPresent: 'Client and caregiver',
          assessmentType: 'In-person',
          assessmentNotes: 'Assessment completed over two sessions'
        }
      };
      
      const contextData = mapFormToContext(formData);
      
      // Check demographics mapping
      expect(contextData.demographics.name).toBe('David Miller');
      expect(contextData.demographics.dob).toBe('1968-08-25');
      expect(contextData.demographics.address).toBe('789 Pine Street, Elsewhere, TX 75001');
      expect(contextData.demographics.phone).toBe('(555) 456-7890');
      expect(contextData.demographics.email).toBe('david.miller@example.com');
      expect(contextData.demographics.caseManager).toBe('Jessica Williams');
      expect(contextData.demographics.insurance).toBe('DEF Insurance');
      expect(contextData.demographics.claimNumber).toBe('CL-789012');
      expect(contextData.demographics.dateOfInjury).toBe('2024-10-15');
      expect(contextData.demographics.dateOfAssessment).toBe('2025-02-01');
      expect(contextData.demographics.assessor).toBe('Dr. Thomas Lee, OT');
      expect(contextData.demographics.referralSource).toBe('Dr. Samantha Green, MD');
      expect(contextData.demographics.referralReason).toBe('ADL assessment post-surgery');
      
      // Check assessment details mapping
      expect(contextData.assessmentDetails.primaryLanguage).toBe('English');
      expect(contextData.assessmentDetails.interpreter).toBe(true);
      expect(contextData.assessmentDetails.interpreterDetails).toBe('Sign language interpreter required');
      expect(contextData.assessmentDetails.assessmentLocation).toBe('Clinic');
      expect(contextData.assessmentDetails.personsPresent).toBe('Client and caregiver');
      expect(contextData.assessmentDetails.assessmentType).toBe('In-person');
      expect(contextData.assessmentDetails.assessmentNotes).toBe('Assessment completed over two sessions');
    });
    
    it('should handle empty form data gracefully', () => {
      const emptyFormData = {
        demographics: {
          clientName: '',
          clientDOB: '',
          clientAddress: '',
          clientPhone: '',
          clientEmail: '',
          caseManager: '',
          insurance: '',
          claimNumber: '',
          dateOfInjury: '',
          dateOfAssessment: '',
          assessor: '',
          referralSource: '',
          referralReason: ''
        },
        assessmentDetails: {
          primaryLanguage: '',
          interpreter: false,
          interpreterDetails: '',
          assessmentLocation: '',
          personsPresent: '',
          assessmentType: '',
          assessmentNotes: ''
        }
      };
      
      const contextData = mapFormToContext(emptyFormData);
      
      // Should return a valid structured object with empty fields
      expect(contextData.demographics).toBeDefined();
      expect(contextData.assessmentDetails).toBeDefined();
      expect(contextData.demographics.name).toBe('');
      expect(contextData.demographics.dob).toBe('');
      expect(contextData.assessmentDetails.primaryLanguage).toBe('');
      expect(contextData.assessmentDetails.interpreter).toBe(false);
    });
    
    it('should handle malformed form data without crashing', () => {
      const malformedFormData = {
        demographics: null, // Should be an object
        assessmentDetails: {
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
      expect(parsedData.demographics.name).toBe('John Smith');
      expect(parsedData.demographics.dob).toBe('1975-05-15');
      expect(parsedData.assessmentDetails.primaryLanguage).toBe('English');
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
      expect(mappedContextData.demographics.name).toBe(
        mockContextData.demographics.name
      );
      
      expect(mappedContextData.demographics.dob).toBe(
        mockContextData.demographics.dob
      );
      
      expect(mappedContextData.demographics.insurance).toBe(
        mockContextData.demographics.insurance
      );
      
      expect(mappedContextData.assessmentDetails.primaryLanguage).toBe(
        mockContextData.assessmentDetails.primaryLanguage
      );
      
      expect(mappedContextData.assessmentDetails.interpreter).toBe(
        mockContextData.assessmentDetails.interpreter
      );
      
      expect(mappedContextData.assessmentDetails.assessmentLocation).toBe(
        mockContextData.assessmentDetails.assessmentLocation
      );
    });
  });
});
