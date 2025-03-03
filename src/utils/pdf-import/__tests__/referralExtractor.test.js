/**
 * Tests for the Referral Document Extraction functionality
 * Part of Delilah V3.0 Enhanced Pattern Recognition
 */

import { detectReferralDocument, detectReferralSections } from '../ReferralDetector';
import { REFERRALExtractor } from '../extractors';
import { processReferralDocument, mapReferralToApplicationModel } from '../index';

// Sample referral document text
const SAMPLE_REFERRAL_TEXT = `
255 Consumers Road, Suite 100
North York, ON M2J 1R4
Tel: 416-489-0711 Fax: 416-489-7009
www.omegamedical.ca
February 4, 2025

ASSESSOR INSTRUCTIONS
Medical Legal Assessment

Sebastien Ferland

RE:                    CLIENT:             Saiffudin Saies
                       DOB:                January 1, 1967
                       DATE OF LOSS:       December 17, 2024 
                       OMEGA FILE NO.:     213249

You will be conducting an Attendant Care Needs assessment with Form 1 of the above client on behalf of 
Omega Medical Associates addressing all impairments (physical, cognitive, and psych).

Please see the letter of instructions set out by the referral source to assist you in your report preparation

Please confirm if you've previously seen the client in any capacity or if there is a conflict of interest. If any 
concerns are identified, please contact Angelica (angelica@omegamedical.ca).

Fee: $1250 + .50/km                       Report Due:

Below is your appointment information, and if applicable, other appointments scheduled for this client. 

Assessor                           Type                 Location                         Date/Time/Duration
Sebastien Ferland,                 Attendant            Client's Home:                  February 18, 2025
OT Reg (ON) Occupational           Care Needs -        1129 Meadowlands Dr E., Apt. 303 10:30 AM-2:30 PM
Therapist                          Assessment -         Ottawa, ON K2E 6J6
sebastien@ferlandassociates.com                         Phone: 753-881-2206
                                                       Email: saifudden.saies@gmail.com

Should you have any clinical questions please contact Danielle Villalta (dvillalta@omegamedical.ca).

Please submit your report & invoice to reports@omegamedical.ca

Yours sincerely,

Angelica McClimond
Assessment Services Coordinator
`;

describe('Referral Document Detection', () => {
  test('detectReferralDocument correctly identifies a referral document', () => {
    const result = detectReferralDocument(SAMPLE_REFERRAL_TEXT);
    expect(result.isReferral).toBe(true);
    expect(result.confidence).toBeGreaterThan(0.7);
    expect(result.documentType).toBe('REFERRAL');
  });
  
  test('detectReferralDocument returns false for non-referral text', () => {
    const nonReferralText = `
    Medical History
    
    Patient reports a history of diabetes and hypertension. Currently taking Metformin 500mg twice daily 
    and Lisinopril 10mg once daily. No known allergies to medications.
    
    Previous surgeries include appendectomy in 2010.
    `;
    
    const result = detectReferralDocument(nonReferralText);
    expect(result.isReferral).toBe(false);
    expect(result.confidence).toBeLessThan(0.5);
  });
});

describe('Referral Section Detection', () => {
  test('detectReferralSections correctly identifies sections in a referral document', () => {
    const result = detectReferralSections(SAMPLE_REFERRAL_TEXT);
    
    // Check overall structure
    expect(result.sections).toBeDefined();
    expect(result.confidence).toBeGreaterThan(0);
    
    // Check for expected sections
    expect(Object.keys(result.sections)).toContain('CLIENT_INFO');
    expect(Object.keys(result.sections)).toContain('ASSESSMENT_REQUIREMENTS');
    
    // Check section content
    const clientInfoSection = result.sections.CLIENT_INFO;
    expect(clientInfoSection).toBeDefined();
    expect(clientInfoSection.text).toContain('CLIENT:');
    expect(clientInfoSection.text).toContain('DOB:');
    expect(clientInfoSection.confidence).toBeGreaterThan(0.5);
  });
});

describe('Referral Data Extraction', () => {
  test('extractReferralData extracts structured data from referral document', () => {
    const result = REFERRALExtractor.extractReferralData(SAMPLE_REFERRAL_TEXT);
    
    // Check metadata
    expect(result.metadata.documentType).toBe('REFERRAL');
    expect(result.metadata.confidence).toBeGreaterThan(0);
    
    // Check client info
    expect(result.clientInfo.name.value).toBe('Saiffudin Saies');
    expect(result.clientInfo.dateOfBirth.value).toBe('January 1, 1967');
    expect(result.clientInfo.dateOfLoss.value).toBe('December 17, 2024');
    expect(result.clientInfo.fileNumber.value).toBe('213249');
    
    // Check assessment requirements
    expect(result.assessmentRequirements.assessmentTypes.value).toContain('Attendant Care Needs');
    
    // Check scheduling
    expect(result.schedulingInfo.appointments.value.length).toBeGreaterThan(0);
    if (result.schedulingInfo.appointments.value.length > 0) {
      expect(result.schedulingInfo.appointments.value[0].dateTime).toContain('February 18, 2025');
    }
    
    // Check referral source
    expect(result.referralSource.organization.value).toBe('Omega Medical Associates');
    expect(result.referralSource.contactPerson.value).toBe('Angelica McClimond');
  });
});

describe('Full Referral Processing Pipeline', () => {
  test('processReferralDocument processes a referral document end-to-end', () => {
    const result = processReferralDocument(SAMPLE_REFERRAL_TEXT);
    
    // Check document type
    expect(result.documentType).toBe('REFERRAL');
    
    // Check confidence
    expect(result.confidence).toBeGreaterThan(0);
    
    // Check for REFERRAL data section
    expect(result.data.REFERRAL).toBeDefined();
    
    // Check mapping to application model
    const appModel = mapReferralToApplicationModel(result);
    expect(appModel.referral).toBeDefined();
    expect(appModel.referral.client.name).toBe('Saiffudin Saies');
    expect(appModel.referral.client.dateOfBirth).toBe('January 1, 1967');
  });
});
