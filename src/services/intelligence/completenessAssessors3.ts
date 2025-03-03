import { CompletenessIndicator } from './completenessService';

// Attendant Care section completeness assessment
export function assessAttendantCareCompleteness(attendantCareData: any): CompletenessIndicator {
  const missingRequiredFields: string[] = [];
  const optionalMissingFields: string[] = [];
  
  // Check required fields
  if (!attendantCareData?.needsAssessment) {
    missingRequiredFields.push('needsAssessment');
  } else if (!attendantCareData.needsAssessment.needs || attendantCareData.needsAssessment.needs.length === 0) {
    missingRequiredFields.push('needsAssessment.needs');
  }
  
  if (!attendantCareData?.recommendations) {
    missingRequiredFields.push('recommendations');
  } else {
    if (attendantCareData.recommendations.totalHours === undefined) {
      missingRequiredFields.push('recommendations.totalHours');
    }
  }
  
  // Check optional fields
  if (!attendantCareData?.currentServices) {
    optionalMissingFields.push('currentServices');
  }
  
  if (!attendantCareData?.serviceSchedule) {
    optionalMissingFields.push('serviceSchedule');
  }
  
  // Calculate completeness score
  const requiredFieldsCount = 3; // needsAssessment, needs, recommendations
  const optionalFieldsCount = 2; // currentServices, serviceSchedule
  
  const requiredFieldsComplete = missingRequiredFields.length === 0;
  const completedRequiredFields = requiredFieldsCount - missingRequiredFields.length;
  const completedOptionalFields = optionalFieldsCount - optionalMissingFields.length;
  
  // Additional detail check
  let detailScore = 0;
  
  // Check needs detail
  if (attendantCareData?.needsAssessment?.needs?.length > 0) {
    const needs = attendantCareData.needsAssessment.needs;
    const detailedNeeds = needs.filter((n: any) => n.description && n.description.length > 20).length;
    
    if (needs.length > 0) {
      detailScore += Math.min(Math.round((detailedNeeds / needs.length) * 20), 20);
    }
  }
  
  const completenessScore = Math.round(
    ((completedRequiredFields * 2) + completedOptionalFields) / 
    ((requiredFieldsCount * 2) + optionalFieldsCount) * 80 + detailScore
  );
  
  // Determine status
  let status: 'incomplete' | 'partial' | 'complete' = 'incomplete';
  if (requiredFieldsComplete && completenessScore >= 90) {
    status = 'complete';
  } else if (requiredFieldsComplete || completenessScore >= 50) {
    status = 'partial';
  }
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  if (missingRequiredFields.length > 0) {
    recommendations.push(`Add required fields: ${missingRequiredFields.join(', ')}`);
  }
  
  if (optionalMissingFields.length > 0) {
    recommendations.push(`Consider adding optional fields: ${optionalMissingFields.join(', ')}`);
  }
  
  return {
    section: 'attendantCare',
    completenessScore,
    requiredFieldsComplete,
    missingRequiredFields,
    optionalMissingFields,
    status,
    recommendations
  };
}
