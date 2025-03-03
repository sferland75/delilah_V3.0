/**
 * Tests for the Enhanced Referral Document Extraction functionality
 * Part of Delilah V3.0 Enhanced Pattern Recognition
 */

const { extractReferralData } = require('../REFERRALExtractor');
const fs = require('fs');
const path = require('path');

// Load sample referral documents
const SAMPLE_REFERRAL_TEXT_1 = fs.readFileSync(
  path.join(process.cwd(), 'public/data/sample-referrals/sample-referral-text-1.txt'), 
  'utf8'
);

const SAMPLE_REFERRAL_TEXT_2 = fs.readFileSync(
  path.join(process.cwd(), 'public/data/sample-referrals/sample-referral-text-2.txt'), 
  'utf8'
);

describe('Enhanced Referral Extractor', () => {
  test('should extract client information correctly', () => {
    const result = extractReferralData(SAMPLE_REFERRAL_TEXT_1);
    
    // Check client info
    expect(result.clientInfo.name.value).toBe('John Smith');
    expect(result.clientInfo.dateOfBirth.value).toBe('March 15, 1980');
    expect(result.clientInfo.dateOfLoss.value).toBe('January 10, 2025');
    expect(result.clientInfo.fileNumber.value).toBe('234567');
    
    // Check confidence scores
    expect(result.clientInfo.name.confidence).toBeGreaterThan(0.8);
    expect(result.metadata.sectionConfidence.clientInfo).toBeGreaterThan(0.7);
  });
  
  test('should extract assessment requirements correctly', () => {
    const result = extractReferralData(SAMPLE_REFERRAL_TEXT_1);
    
    // Check assessment types
    expect(result.assessmentRequirements.assessmentTypes.value).toContain('In-home assessment');
    expect(result.assessmentRequirements.assessmentTypes.value).toContain('Attendant Care Needs');
    
    // Check report types
    expect(result.assessmentRequirements.reportTypes.value.length).toBe(2);
    expect(result.assessmentRequirements.reportTypes.value[0].number).toBe('1');
    expect(result.assessmentRequirements.reportTypes.value[0].description).toContain('Attendant Care');
    
    // Check specific requirements
    expect(result.assessmentRequirements.specificRequirements.value.length).toBeGreaterThan(0);
    expect(result.assessmentRequirements.specificRequirements.value[0]).toContain('self-care');
  });
  
  test('should extract scheduling information correctly', () => {
    const result = extractReferralData(SAMPLE_REFERRAL_TEXT_1);
    
    // Check appointments
    expect(result.schedulingInfo.appointments.value.length).toBeGreaterThan(0);
    const appointment = result.schedulingInfo.appointments.value[0];
    expect(appointment.assessor).toContain('Sebastien');
    expect(appointment.dateTime).toContain('March 10, 2025');
    
    // Check assessor
    expect(result.schedulingInfo.assessors.value.length).toBeGreaterThan(0);
    expect(result.schedulingInfo.assessors.value[0].specialization).toContain('Occupational');
  });
  
  test('should extract reporting requirements correctly', () => {
    const result = extractReferralData(SAMPLE_REFERRAL_TEXT_1);
    
    // Check due date
    expect(result.reportingRequirements.dueDate.value).toBe('March 25, 2025');
    
    // Check guidelines
    expect(result.reportingRequirements.guidelines.value.length).toBeGreaterThan(0);
    expect(result.reportingRequirements.guidelines.value[0]).toContain('AMA');
  });
  
  test('should extract referral source information correctly', () => {
    const result = extractReferralData(SAMPLE_REFERRAL_TEXT_1);
    
    // Check organization
    expect(result.referralSource.organization.value).toBe('Omega Medical Associates');
    
    // Check contact person
    expect(result.referralSource.contactPerson.value).toBe('Angelica McClimond');
  });
  
  test('should correctly handle a different referral format', () => {
    const result = extractReferralData(SAMPLE_REFERRAL_TEXT_2);
    
    // Check client info
    expect(result.clientInfo.name.value).toBe('Maria Garcia');
    expect(result.clientInfo.language.value).toBe('Spanish');
    
    // Check interpreter needed
    expect(result.schedulingInfo.interpreterNeeded.value).toBe(true);
    
    // Check organization
    expect(result.referralSource.organization.value).toBe('Comprehensive Health Partners');
  });
  
  test('should add appropriate confidence scores', () => {
    const result = extractReferralData(SAMPLE_REFERRAL_TEXT_1);
    
    // Check metadata
    expect(result.metadata.confidence).toBeGreaterThan(0.5);
    expect(result.metadata.sectionConfidence).toBeDefined();
    
    // Check section confidences
    expect(result.metadata.sectionConfidence.clientInfo).toBeGreaterThan(0);
    expect(result.metadata.sectionConfidence.assessmentRequirements).toBeGreaterThan(0);
    expect(result.metadata.sectionConfidence.schedulingInfo).toBeGreaterThan(0);
    expect(result.metadata.sectionConfidence.reportingRequirements).toBeGreaterThan(0);
    expect(result.metadata.sectionConfidence.referralSource).toBeGreaterThan(0);
  });
});
