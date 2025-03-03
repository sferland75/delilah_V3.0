/**
 * Unit tests for the Data Mapping utilities
 */

import {
  extractSectionData,
  getDataCompleteness,
  mapSchemaDataToReportFormat
} from '../data-mapping';

import { DataCompleteness } from '../types';
import * as templates from '../templates';

// Mock the templates dependency
jest.mock('../templates', () => ({
  getSectionMetadata: jest.fn()
}));

describe('Data Mapping Utilities', () => {
  // Sample assessment data for testing
  const mockAssessmentData = {
    demographics: {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1980-01-15',
      gender: 'Male',
      address: '123 Main St'
    },
    initialAssessment: {
      referralSource: 'Dr. Smith',
      referralReason: 'Functional assessment',
      referralDate: '2025-01-10',
      assessmentDate: '2025-02-15'
    },
    medicalHistory: {
      conditions: ['Arthritis', 'Hypertension'],
      medications: ['Ibuprofen', 'Lisinopril'],
      allergies: ['Penicillin'],
      surgeries: ['Appendectomy']
    },
    symptoms: {
      painLevel: 4,
      painLocations: ['Lower back', 'Right knee'],
      fatigue: 'Moderate',
      sleep: 'Disrupted',
      cognition: 'Normal'
    },
    functional: {
      mobility: 'Independent with cane',
      transfers: 'Independent',
      balance: 'Fair',
      endurance: 'Limited',
      strength: 'Decreased in lower extremities'
    },
    typicalDay: {
      morningRoutine: 'Wake up at 7 AM, shower, breakfast',
      afternoonActivities: 'Light housework, reading',
      eveningRoutine: 'Dinner at 6 PM, TV, bed by 10 PM'
    },
    environment: {
      homeLayout: 'Single-level home',
      accessIssues: 'Three steps at entrance',
      safetyRisks: 'Throw rugs',
      modifications: 'Grab bars in bathroom'
    },
    adl: {
      selfCare: 'Independent',
      homeManagement: 'Needs assistance with heavy cleaning',
      mealPreparation: 'Independent',
      community: 'Drives short distances'
    },
    attendantCare: {
      currentSupport: 'Spouse assists with cleaning',
      supportHours: '5 hours per week',
      recommendedHours: '8 hours per week',
      careActivities: 'Cleaning, laundry, shopping'
    }
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('extractSectionData', () => {
    test('should return null if assessment data is not provided', () => {
      // Act
      const result = extractSectionData(null, 'medical-history');
      
      // Assert
      expect(result).toBeNull();
    });
    
    test('should extract medical history data correctly', () => {
      // Act
      const result = extractSectionData(mockAssessmentData, 'medical-history');
      
      // Assert
      expect(result).toEqual(mockAssessmentData.medicalHistory);
    });
    
    test('should extract combined data for initial assessment', () => {
      // Act
      const result = extractSectionData(mockAssessmentData, 'initial-assessment');
      
      // Assert
      expect(result).toEqual({
        ...mockAssessmentData.demographics,
        ...mockAssessmentData.initialAssessment
      });
    });
    
    test('should return empty object for unknown section', () => {
      // Act
      const result = extractSectionData(mockAssessmentData, 'unknown-section');
      
      // Assert
      expect(result).toEqual({});
    });
    
    test('should return empty object if specific section data is missing', () => {
      // Arrange
      const incompleteData = {
        demographics: mockAssessmentData.demographics
        // Missing other sections
      };
      
      // Act
      const result = extractSectionData(incompleteData, 'medical-history');
      
      // Assert
      expect(result).toEqual({});
    });
  });
  
  describe('getDataCompleteness', () => {
    test('should return empty completeness if assessment data is not provided', () => {
      // Act
      const result = getDataCompleteness(null);
      
      // Assert
      expect(result).toEqual({
        'initial-assessment': { status: 'incomplete', percentage: 0 },
        'medical-history': { status: 'incomplete', percentage: 0 },
        'symptoms-assessment': { status: 'incomplete', percentage: 0 },
        'functional-status': { status: 'incomplete', percentage: 0 },
        'typical-day': { status: 'incomplete', percentage: 0 },
        'environmental-assessment': { status: 'incomplete', percentage: 0 },
        'activities-daily-living': { status: 'incomplete', percentage: 0 },
        'attendant-care': { status: 'incomplete', percentage: 0 }
      });
    });
    
    test('should calculate completeness for initial assessment correctly', () => {
      // Act
      const result = getDataCompleteness(mockAssessmentData);
      
      // Assert
      expect(result['initial-assessment']).toEqual({
        status: 'complete',
        percentage: 100
      });
    });
    
    test('should identify incomplete sections correctly', () => {
      // Arrange
      const incompleteData = {
        ...mockAssessmentData,
        symptoms: {
          painLevel: null,
          // Missing other symptoms fields
        }
      };
      
      // Act
      const result = getDataCompleteness(incompleteData);
      
      // Assert
      expect(result['symptoms-assessment']).toMatchObject({
        status: 'incomplete',
        percentage: expect.any(Number),
        missingFields: expect.arrayContaining(['fatigue', 'sleep'])
      });
      expect(result['symptoms-assessment'].percentage).toBeLessThan(50);
    });
    
    test('should identify partially complete sections correctly', () => {
      // Arrange
      const partialData = {
        ...mockAssessmentData,
        environment: {
          homeLayout: 'Single-level home',
          accessIssues: 'Three steps at entrance',
          // Missing other fields
        }
      };
      
      // Act
      const result = getDataCompleteness(partialData);
      
      // Assert
      expect(result['environmental-assessment']).toMatchObject({
        status: 'partial',
        percentage: 50,
        missingFields: expect.arrayContaining(['safetyRisks', 'modifications'])
      });
    });
  });
  
  describe('mapSchemaDataToReportFormat', () => {
    test('should return empty object if assessment data is not provided', () => {
      // Act
      const result = mapSchemaDataToReportFormat(null);
      
      // Assert
      expect(result).toEqual({});
    });
    
    test('should transform assessment data into report format correctly', () => {
      // Arrange
      // Mock current date for age calculation
      const mockDate = new Date('2025-02-24');
      const originalDate = global.Date;
      global.Date = class extends Date {
        constructor(date) {
          if (date) {
            return super(date);
          }
          return mockDate;
        }
      } as any;
      
      // Act
      const result = mapSchemaDataToReportFormat(mockAssessmentData);
      
      // Assert
      expect(result).toMatchObject({
        client: {
          fullName: 'John Doe',
          firstName: 'John',
          lastName: 'Doe',
          age: 45, // Based on DOB and mocked current date
          dateOfBirth: expect.stringContaining('January 15, 1980'),
          gender: 'Male',
          address: '123 Main St'
        },
        assessment: {
          date: expect.stringContaining('February 15, 2025'),
          referral: {
            source: 'Dr. Smith',
            reason: 'Functional assessment',
            date: expect.stringContaining('January 10, 2025')
          }
        },
        medicalHistory: {
          conditions: 'Arthritis, Hypertension',
          medications: 'Ibuprofen, Lisinopril',
          allergies: 'Penicillin',
          surgeries: 'Appendectomy'
        },
        symptoms: {
          pain: {
            level: 4,
            locations: 'Lower back, Right knee'
          },
          fatigue: 'Moderate',
          sleep: 'Disrupted',
          cognition: 'Normal'
        }
      });
      
      // Restore original Date
      global.Date = originalDate;
    });
    
    test('should handle missing or empty fields gracefully', () => {
      // Arrange
      const incompleteData = {
        demographics: {
          firstName: 'John',
          // Missing lastName
          dateOfBirth: '1980-01-15'
        },
        // Missing other sections
      };
      
      // Act
      const result = mapSchemaDataToReportFormat(incompleteData);
      
      // Assert
      expect(result.client).toMatchObject({
        fullName: 'John', // Only first name
        firstName: 'John',
        lastName: '',
        age: expect.any(Number),
        dateOfBirth: expect.any(String)
      });
      
      // Check that other sections exist but have empty values
      expect(result.medicalHistory).toBeDefined();
      expect(result.medicalHistory.conditions).toBe('');
      expect(result.symptoms).toBeDefined();
      expect(result.symptoms.fatigue).toBe('');
    });
    
    test('should handle empty arrays correctly', () => {
      // Arrange
      const dataWithEmptyArrays = {
        ...mockAssessmentData,
        medicalHistory: {
          conditions: [],
          medications: [],
          allergies: [],
          surgeries: []
        }
      };
      
      // Act
      const result = mapSchemaDataToReportFormat(dataWithEmptyArrays);
      
      // Assert
      expect(result.medicalHistory).toMatchObject({
        conditions: '',
        medications: '',
        allergies: '',
        surgeries: ''
      });
    });
  });
});
