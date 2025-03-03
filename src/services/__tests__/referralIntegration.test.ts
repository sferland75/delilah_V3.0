/**
 * Unit tests for referralIntegration.ts
 */

import {
  integrateWithDemographics,
  integrateWithPurpose,
  integrateWithMedicalHistory,
  detectSectionRequirements,
  integrateAcrossSections
} from '../referralIntegration';

// Mock referral data for testing
const mockReferralData = {
  client: {
    name: 'John Smith',
    dateOfBirth: 'March 15, 1980',
    dateOfLoss: 'January 10, 2025',
    fileNumber: '234567',
    language: 'English',
    phoneNumbers: ['613-555-1234'],
    address: '123 Main Street, Ottawa, ON K2P 1M2',
    email: 'john.smith@example.com'
  },
  assessmentTypes: ['In-home assessment', 'Attendant Care Needs', 'Functional assessment'],
  reportTypes: [
    { number: '1', description: 'Attendant Care Needs Assessment' },
    { number: '2', description: 'Functional Abilities Evaluation' }
  ],
  specificRequirements: [
    'Assess ability to perform self-care tasks',
    'Evaluate need for home modifications',
    'Determine if client can safely prepare meals',
    'Assess mobility within the home environment'
  ],
  criteria: ['3'],
  domains: [
    'Personal care',
    'Home management',
    'Mobility and transfers',
    'Safety in the home'
  ],
  appointments: [
    {
      assessor: 'Sebastien Ferland',
      type: 'Attendant Care Needs Assessment',
      location: '123 Main Street, Ottawa, ON K2P 1M2',
      dateTime: 'March 10, 2025 9:00 AM',
      duration: '11:00 AM'
    }
  ],
  reportDueDate: 'March 25, 2025',
  reportGuidelines: [
    'Use proper AMA citation format',
    'Include all test results in appendices',
    'Report must be submitted in PDF format',
    'Submit invoice separately'
  ],
  referralSource: {
    organization: 'Omega Medical Associates',
    contactPerson: 'Angelica McClimond',
    contactInfo: 'Angelica McClimond (angelica@omegamedical.ca)'
  }
};

describe('Referral Integration Service', () => {
  describe('integrateWithDemographics', () => {
    test('should integrate referral client data into empty demographics', () => {
      const emptyDemographics = {};
      const result = integrateWithDemographics(mockReferralData, emptyDemographics);
      
      expect(result).toHaveProperty('clientName', 'John Smith');
      expect(result).toHaveProperty('dateOfBirth', 'March 15, 1980');
      expect(result).toHaveProperty('dateOfLoss', 'January 10, 2025');
      expect(result).toHaveProperty('_metadata.referralIntegrated', true);
    });
    
    test('should not overwrite existing demographics data', () => {
      const existingDemographics = {
        clientName: 'Existing Name',
        dateOfBirth: 'January 1, 1980',
        phoneNumber: 'Existing Phone'
      };
      const result = integrateWithDemographics(mockReferralData, existingDemographics);
      
      expect(result).toHaveProperty('clientName', 'Existing Name');
      expect(result).toHaveProperty('dateOfBirth', 'January 1, 1980');
    });
    
    test('should return original data when referral data is empty', () => {
      const existingDemographics = { clientName: 'Existing Name' };
      const result = integrateWithDemographics(null, existingDemographics);
      
      expect(result).toEqual(existingDemographics);
    });
  });
  
  describe('integrateWithPurpose', () => {
    test('should integrate referral requirements into empty purpose data', () => {
      const emptyPurpose = {};
      const result = integrateWithPurpose(mockReferralData, emptyPurpose);
      
      expect(result).toHaveProperty('referralRequirements');
      expect(result.referralRequirements).toContain('Assessment Types:');
      expect(result.referralRequirements).toContain('In-home assessment');
      expect(result).toHaveProperty('purposeStatement');
      expect(result.purposeStatement).toContain('conduct In-home assessment, Attendant Care Needs, Functional assessment');
    });
    
    test('should not overwrite existing purpose statement', () => {
      const existingPurpose = {
        purposeStatement: 'Existing purpose statement',
        referralRequirements: ''
      };
      const result = integrateWithPurpose(mockReferralData, existingPurpose);
      
      expect(result).toHaveProperty('purposeStatement', 'Existing purpose statement');
      expect(result).toHaveProperty('referralRequirements');
      expect(result.referralRequirements).toContain('Assessment Types:');
    });
  });
  
  describe('integrateWithMedicalHistory', () => {
    test('should integrate injury date from referral', () => {
      const emptyMedicalHistory = {};
      const result = integrateWithMedicalHistory(mockReferralData, emptyMedicalHistory);
      
      expect(result).toHaveProperty('injuryDate', 'January 10, 2025');
    });
    
    test('should add context notes based on referral domains', () => {
      const emptyMedicalHistory = {};
      const referralWithPain = {
        ...mockReferralData,
        specificRequirements: ['Assess pain management', 'Evaluate medication regimen']
      };
      
      const result = integrateWithMedicalHistory(referralWithPain, emptyMedicalHistory);
      
      expect(result).toHaveProperty('referralContext');
      expect(result.referralContext).toContain('Pain management was mentioned');
      expect(result.referralContext).toContain('Medication management was mentioned');
    });
  });
  
  describe('detectSectionRequirements', () => {
    test('should detect FUNCTIONAL_STATUS requirements', () => {
      const result = detectSectionRequirements(mockReferralData, 'FUNCTIONAL_STATUS');
      
      expect(result.hasRequirements).toBe(true);
      expect(result.requirements).toContain('Assess mobility status and capabilities');
      expect(result.priorities).toContain('Complete functional assessment as specifically requested in referral');
    });
    
    test('should detect ADLS requirements', () => {
      const result = detectSectionRequirements(mockReferralData, 'ADLS');
      
      expect(result.hasRequirements).toBe(true);
      expect(result.requirements).toContain('Assess self-care abilities');
    });
    
    test('should detect ENVIRONMENTAL requirements', () => {
      const result = detectSectionRequirements(mockReferralData, 'ENVIRONMENTAL');
      
      expect(result.hasRequirements).toBe(true);
      expect(result.requirements).toContain('Assess home factors');
      expect(result.requirements).toContain('Assess safety factors');
    });
    
    test('should return empty requirements for unrelated sections', () => {
      const result = detectSectionRequirements(mockReferralData, 'UNRELATED_SECTION');
      
      expect(result.hasRequirements).toBe(false);
      expect(result.requirements).toHaveLength(0);
      expect(result.priorities).toHaveLength(0);
    });
  });
  
  describe('integrateAcrossSections', () => {
    test('should integrate referral data across all assessment sections', () => {
      const assessmentData = {
        demographics: {},
        purpose: {},
        medicalHistory: {},
        functionalStatus: {},
        typicalDay: {},
        adls: {},
        environmental: {},
        attendantCare: {},
        symptoms: {}
      };
      
      const result = integrateAcrossSections(mockReferralData, assessmentData);
      
      // Check demographics integration
      expect(result.demographics).toHaveProperty('clientName', 'John Smith');
      
      // Check purpose integration
      expect(result.purpose).toHaveProperty('referralRequirements');
      expect(result.purpose.referralRequirements).toContain('Assessment Types:');
      
      // Check medical history integration
      expect(result.medicalHistory).toHaveProperty('injuryDate', 'January 10, 2025');
      
      // Check functional status integration
      expect(result.functionalStatus).toHaveProperty('_metadata.referralRequirements');
      expect(result.functionalStatus._metadata.referralRequirements).toContain('Assess mobility status and capabilities');
      
      // Check overall metadata
      expect(result).toHaveProperty('_metadata.referralIntegrated', true);
      expect(result).toHaveProperty('_metadata.referralSource', 'Omega Medical Associates');
    });
    
    test('should return original data when referral data is empty', () => {
      const assessmentData = { demographics: { clientName: 'Original Name' } };
      const result = integrateAcrossSections(null, assessmentData);
      
      expect(result).toEqual(assessmentData);
    });
  });
});
