/**
 * Data Mapping Utilities
 * 
 * This module provides functions to map between the application's data schema
 * and the formats needed for report generation.
 */

import { DataCompleteness } from './types';
import { getSectionMetadata } from './templates';

/**
 * Extract the relevant data for a specific section from the full assessment
 */
export function extractSectionData(assessmentData: any, sectionId: string): any {
  if (!assessmentData) {
    return null;
  }

  // Map section IDs to the corresponding assessment data structure
  switch (sectionId) {
    case 'initial-assessment':
      return {
        ...assessmentData.demographics,
        ...assessmentData.initialAssessment
      };
    case 'medical-history':
      return assessmentData.medicalHistory || {};
    case 'symptoms-assessment':
      return assessmentData.symptoms || {};
    case 'functional-status':
      return assessmentData.functional || {};
    case 'typical-day':
      return assessmentData.typicalDay || {};
    case 'environmental-assessment':
      return assessmentData.environment || {};
    case 'activities-daily-living':
      return assessmentData.adl || {};
    case 'attendant-care':
      return assessmentData.attendantCare || {};
    default:
      return {};
  }
}

/**
 * Calculate data completeness for all sections
 */
export function getDataCompleteness(assessmentData: any): Record<string, DataCompleteness> {
  const completeness: Record<string, DataCompleteness> = {};
  
  if (!assessmentData) {
    return mapEmptyCompleteness();
  }
  
  // Get all section metadata
  const sectionMetadataList = Object.keys(getSectionMetadata('') ? {} : {});
  
  // Calculate completeness for each section
  for (const sectionId of sectionMetadataList) {
    const sectionData = extractSectionData(assessmentData, sectionId);
    completeness[sectionId] = calculateSectionCompleteness(sectionId, sectionData);
  }
  
  // Add completeness for each section
  completeness['initial-assessment'] = calculateInitialAssessmentCompleteness(assessmentData);
  completeness['medical-history'] = calculateMedicalHistoryCompleteness(assessmentData);
  completeness['symptoms-assessment'] = calculateSymptomsCompleteness(assessmentData);
  completeness['functional-status'] = calculateFunctionalCompleteness(assessmentData);
  completeness['typical-day'] = calculateTypicalDayCompleteness(assessmentData);
  completeness['environmental-assessment'] = calculateEnvironmentalCompleteness(assessmentData);
  completeness['activities-daily-living'] = calculateADLCompleteness(assessmentData);
  completeness['attendant-care'] = calculateAttendantCareCompleteness(assessmentData);
  
  return completeness;
}

/**
 * Calculate completeness for a specific section
 */
function calculateSectionCompleteness(sectionId: string, sectionData: any): DataCompleteness {
  if (!sectionData) {
    return {
      status: 'incomplete',
      percentage: 0,
      missingFields: ['All data missing']
    };
  }
  
  const requiredFields = getRequiredFieldsForSection(sectionId);
  const missingFields = requiredFields.filter(field => 
    sectionData[field] === undefined || 
    sectionData[field] === null || 
    sectionData[field] === '' ||
    (Array.isArray(sectionData[field]) && sectionData[field].length === 0)
  );
  
  const percentage = missingFields.length === 0 ? 100 : 
    Math.round(((requiredFields.length - missingFields.length) / requiredFields.length) * 100);
  
  return {
    status: percentage === 100 ? 'complete' : percentage > 50 ? 'partial' : 'incomplete',
    percentage,
    missingFields: missingFields.length > 0 ? missingFields : undefined
  };
}

/**
 * Return empty completeness data for all sections
 */
function mapEmptyCompleteness(): Record<string, DataCompleteness> {
  return {
    'initial-assessment': { status: 'incomplete', percentage: 0 },
    'medical-history': { status: 'incomplete', percentage: 0 },
    'symptoms-assessment': { status: 'incomplete', percentage: 0 },
    'functional-status': { status: 'incomplete', percentage: 0 },
    'typical-day': { status: 'incomplete', percentage: 0 },
    'environmental-assessment': { status: 'incomplete', percentage: 0 },
    'activities-daily-living': { status: 'incomplete', percentage: 0 },
    'attendant-care': { status: 'incomplete', percentage: 0 }
  };
}

/**
 * Calculate completeness for Initial Assessment section
 */
function calculateInitialAssessmentCompleteness(assessmentData: any): DataCompleteness {
  if (!assessmentData || !assessmentData.demographics || !assessmentData.initialAssessment) {
    return { 
      status: 'incomplete', 
      percentage: 0,
      missingFields: ['demographics', 'initialAssessment'] 
    };
  }
  
  const { demographics, initialAssessment } = assessmentData;
  
  const requiredFields = [
    'firstName', 'lastName', 'dateOfBirth', 'referralSource', 'referralReason', 'assessmentDate'
  ];
  
  const combinedData = { ...demographics, ...initialAssessment };
  
  const missingFields = requiredFields.filter(field => 
    !combinedData[field] || combinedData[field] === ''
  );
  
  const percentage = Math.round(((requiredFields.length - missingFields.length) / requiredFields.length) * 100);
  
  return {
    status: percentage === 100 ? 'complete' : percentage > 50 ? 'partial' : 'incomplete',
    percentage,
    missingFields: missingFields.length > 0 ? missingFields : undefined
  };
}

/**
 * Calculate completeness for Medical History section
 */
function calculateMedicalHistoryCompleteness(assessmentData: any): DataCompleteness {
  if (!assessmentData || !assessmentData.medicalHistory) {
    return { 
      status: 'incomplete', 
      percentage: 0,
      missingFields: ['medicalHistory'] 
    };
  }
  
  const { medicalHistory } = assessmentData;
  
  const requiredFields = ['conditions', 'medications', 'allergies'];
  
  const missingFields = requiredFields.filter(field => 
    !medicalHistory[field] || 
    (Array.isArray(medicalHistory[field]) && medicalHistory[field].length === 0)
  );
  
  const percentage = Math.round(((requiredFields.length - missingFields.length) / requiredFields.length) * 100);
  
  return {
    status: percentage === 100 ? 'complete' : percentage > 50 ? 'partial' : 'incomplete',
    percentage,
    missingFields: missingFields.length > 0 ? missingFields : undefined
  };
}

/**
 * Calculate completeness for Symptoms section
 */
function calculateSymptomsCompleteness(assessmentData: any): DataCompleteness {
  if (!assessmentData || !assessmentData.symptoms) {
    return { 
      status: 'incomplete', 
      percentage: 0,
      missingFields: ['symptoms'] 
    };
  }
  
  const { symptoms } = assessmentData;
  
  const requiredFields = ['painLevel', 'painLocations', 'fatigue', 'sleep', 'cognition'];
  
  const missingFields = requiredFields.filter(field => 
    symptoms[field] === undefined || 
    symptoms[field] === null || 
    symptoms[field] === '' ||
    (Array.isArray(symptoms[field]) && symptoms[field].length === 0)
  );
  
  const percentage = Math.round(((requiredFields.length - missingFields.length) / requiredFields.length) * 100);
  
  return {
    status: percentage === 100 ? 'complete' : percentage > 50 ? 'partial' : 'incomplete',
    percentage,
    missingFields: missingFields.length > 0 ? missingFields : undefined
  };
}

/**
 * Calculate completeness for Functional Status section
 */
function calculateFunctionalCompleteness(assessmentData: any): DataCompleteness {
  if (!assessmentData || !assessmentData.functional) {
    return { 
      status: 'incomplete', 
      percentage: 0,
      missingFields: ['functional'] 
    };
  }
  
  const { functional } = assessmentData;
  
  const requiredFields = ['mobility', 'transfers', 'balance', 'endurance', 'strength'];
  
  const missingFields = requiredFields.filter(field => 
    !functional[field] || functional[field] === ''
  );
  
  const percentage = Math.round(((requiredFields.length - missingFields.length) / requiredFields.length) * 100);
  
  return {
    status: percentage === 100 ? 'complete' : percentage > 50 ? 'partial' : 'incomplete',
    percentage,
    missingFields: missingFields.length > 0 ? missingFields : undefined
  };
}

/**
 * Calculate completeness for Typical Day section
 */
function calculateTypicalDayCompleteness(assessmentData: any): DataCompleteness {
  if (!assessmentData || !assessmentData.typicalDay) {
    return { 
      status: 'incomplete', 
      percentage: 0,
      missingFields: ['typicalDay'] 
    };
  }
  
  const { typicalDay } = assessmentData;
  
  const requiredFields = ['morningRoutine', 'afternoonActivities', 'eveningRoutine'];
  
  const missingFields = requiredFields.filter(field => 
    !typicalDay[field] || typicalDay[field] === ''
  );
  
  const percentage = Math.round(((requiredFields.length - missingFields.length) / requiredFields.length) * 100);
  
  return {
    status: percentage === 100 ? 'complete' : percentage > 50 ? 'partial' : 'incomplete',
    percentage,
    missingFields: missingFields.length > 0 ? missingFields : undefined
  };
}

/**
 * Calculate completeness for Environmental Assessment section
 */
function calculateEnvironmentalCompleteness(assessmentData: any): DataCompleteness {
  if (!assessmentData || !assessmentData.environment) {
    return { 
      status: 'incomplete', 
      percentage: 0,
      missingFields: ['environment'] 
    };
  }
  
  const { environment } = assessmentData;
  
  const requiredFields = ['homeLayout', 'accessIssues', 'safetyRisks', 'modifications'];
  
  const missingFields = requiredFields.filter(field => 
    !environment[field] || environment[field] === ''
  );
  
  const percentage = Math.round(((requiredFields.length - missingFields.length) / requiredFields.length) * 100);
  
  return {
    status: percentage === 100 ? 'complete' : percentage > 50 ? 'partial' : 'incomplete',
    percentage,
    missingFields: missingFields.length > 0 ? missingFields : undefined
  };
}

/**
 * Calculate completeness for Activities of Daily Living section
 */
function calculateADLCompleteness(assessmentData: any): DataCompleteness {
  if (!assessmentData || !assessmentData.adl) {
    return { 
      status: 'incomplete', 
      percentage: 0,
      missingFields: ['adl'] 
    };
  }
  
  const { adl } = assessmentData;
  
  const requiredFields = ['selfCare', 'homeManagement', 'mealPreparation', 'community'];
  
  const missingFields = requiredFields.filter(field => 
    !adl[field] || adl[field] === ''
  );
  
  const percentage = Math.round(((requiredFields.length - missingFields.length) / requiredFields.length) * 100);
  
  return {
    status: percentage === 100 ? 'complete' : percentage > 50 ? 'partial' : 'incomplete',
    percentage,
    missingFields: missingFields.length > 0 ? missingFields : undefined
  };
}

/**
 * Calculate completeness for Attendant Care section
 */
function calculateAttendantCareCompleteness(assessmentData: any): DataCompleteness {
  if (!assessmentData || !assessmentData.attendantCare) {
    return { 
      status: 'incomplete', 
      percentage: 0,
      missingFields: ['attendantCare'] 
    };
  }
  
  const { attendantCare } = assessmentData;
  
  const requiredFields = ['currentSupport', 'supportHours', 'recommendedHours', 'careActivities'];
  
  const missingFields = requiredFields.filter(field => 
    !attendantCare[field] || attendantCare[field] === ''
  );
  
  const percentage = Math.round(((requiredFields.length - missingFields.length) / requiredFields.length) * 100);
  
  return {
    status: percentage === 100 ? 'complete' : percentage > 50 ? 'partial' : 'incomplete',
    percentage,
    missingFields: missingFields.length > 0 ? missingFields : undefined
  };
}

/**
 * Get required fields for a specific section
 */
function getRequiredFieldsForSection(sectionId: string): string[] {
  // Map of required fields for each section
  const requiredFieldsMap: Record<string, string[]> = {
    'initial-assessment': ['firstName', 'lastName', 'dateOfBirth', 'referralSource', 'referralReason', 'assessmentDate'],
    'medical-history': ['conditions', 'medications', 'allergies'],
    'symptoms-assessment': ['painLevel', 'painLocations', 'fatigue', 'sleep', 'cognition'],
    'functional-status': ['mobility', 'transfers', 'balance', 'endurance', 'strength'],
    'typical-day': ['morningRoutine', 'afternoonActivities', 'eveningRoutine'],
    'environmental-assessment': ['homeLayout', 'accessIssues', 'safetyRisks', 'modifications'],
    'activities-daily-living': ['selfCare', 'homeManagement', 'mealPreparation', 'community'],
    'attendant-care': ['currentSupport', 'supportHours', 'recommendedHours', 'careActivities']
  };
  
  return requiredFieldsMap[sectionId] || [];
}

/**
 * Format assessment data into the structure expected by report templates
 */
export function mapSchemaDataToReportFormat(assessmentData: any): any {
  if (!assessmentData) {
    return {};
  }
  
  // Transform the data schema into a format that's more user-friendly for report generation
  return {
    client: {
      fullName: `${assessmentData.demographics?.firstName || ''} ${assessmentData.demographics?.lastName || ''}`.trim(),
      firstName: assessmentData.demographics?.firstName || '',
      lastName: assessmentData.demographics?.lastName || '',
      age: calculateAge(assessmentData.demographics?.dateOfBirth),
      dateOfBirth: formatDate(assessmentData.demographics?.dateOfBirth),
      gender: assessmentData.demographics?.gender || '',
      address: assessmentData.demographics?.address || '',
      phone: assessmentData.demographics?.phone || '',
      email: assessmentData.demographics?.email || ''
    },
    assessment: {
      date: formatDate(assessmentData.initialAssessment?.assessmentDate),
      referral: {
        source: assessmentData.initialAssessment?.referralSource || '',
        reason: assessmentData.initialAssessment?.referralReason || '',
        date: formatDate(assessmentData.initialAssessment?.referralDate)
      }
    },
    medicalHistory: {
      conditions: formatList(assessmentData.medicalHistory?.conditions),
      medications: formatList(assessmentData.medicalHistory?.medications),
      allergies: formatList(assessmentData.medicalHistory?.allergies),
      surgeries: formatList(assessmentData.medicalHistory?.surgeries)
    },
    symptoms: {
      pain: {
        level: assessmentData.symptoms?.painLevel,
        locations: formatList(assessmentData.symptoms?.painLocations),
        description: assessmentData.symptoms?.painDescription || ''
      },
      fatigue: assessmentData.symptoms?.fatigue || '',
      sleep: assessmentData.symptoms?.sleep || '',
      cognition: assessmentData.symptoms?.cognition || ''
    },
    functional: {
      mobility: assessmentData.functional?.mobility || '',
      transfers: assessmentData.functional?.transfers || '',
      balance: assessmentData.functional?.balance || '',
      endurance: assessmentData.functional?.endurance || '',
      strength: assessmentData.functional?.strength || ''
    },
    typicalDay: {
      morning: assessmentData.typicalDay?.morningRoutine || '',
      afternoon: assessmentData.typicalDay?.afternoonActivities || '',
      evening: assessmentData.typicalDay?.eveningRoutine || ''
    },
    environment: {
      home: assessmentData.environment?.homeLayout || '',
      access: assessmentData.environment?.accessIssues || '',
      safety: assessmentData.environment?.safetyRisks || '',
      modifications: assessmentData.environment?.modifications || ''
    },
    adl: {
      selfCare: assessmentData.adl?.selfCare || '',
      homeManagement: assessmentData.adl?.homeManagement || '',
      mealPreparation: assessmentData.adl?.mealPreparation || '',
      community: assessmentData.adl?.community || ''
    },
    attendantCare: {
      currentSupport: assessmentData.attendantCare?.currentSupport || '',
      supportHours: assessmentData.attendantCare?.supportHours || '',
      recommendedHours: assessmentData.attendantCare?.recommendedHours || '',
      careActivities: assessmentData.attendantCare?.careActivities || ''
    }
  };
}

/**
 * Helper function to calculate age from date of birth
 */
function calculateAge(dateOfBirth: string): number {
  if (!dateOfBirth) return 0;
  
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Format a date string into a readable format
 */
function formatDate(dateString: string): string {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return dateString;
  }
}

/**
 * Format an array into a comma-separated list
 */
function formatList(items: string[] | null | undefined): string {
  if (!items || !Array.isArray(items) || items.length === 0) {
    return '';
  }
  
  return items.join(', ');
}
