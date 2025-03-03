import { CompletenessIndicator } from './completenessService';

// Demographics section completeness assessment
export function assessDemographicsCompleteness(demographicsData: any): CompletenessIndicator {
  const missingRequiredFields: string[] = [];
  const optionalMissingFields: string[] = [];
  
  // Check required fields
  if (!demographicsData?.client?.name) {
    missingRequiredFields.push('client.name');
  }
  
  if (!demographicsData?.client?.dateOfBirth) {
    missingRequiredFields.push('client.dateOfBirth');
  }
  
  if (!demographicsData?.assessmentDate) {
    missingRequiredFields.push('assessmentDate');
  }
  
  // Check optional fields
  if (!demographicsData?.client?.contactInformation?.phone && !demographicsData?.client?.contactInformation?.email) {
    optionalMissingFields.push('client.contactInformation');
  }
  
  if (!demographicsData?.referral?.source) {
    optionalMissingFields.push('referral.source');
  }
  
  if (!demographicsData?.referral?.reason) {
    optionalMissingFields.push('referral.reason');
  }
  
  // Calculate completeness score (weight required fields more heavily)
  const requiredFieldsCount = 3; // name, DOB, assessment date
  const optionalFieldsCount = 3; // contact info, referral source, referral reason
  
  const requiredFieldsComplete = missingRequiredFields.length === 0;
  const completedRequiredFields = requiredFieldsCount - missingRequiredFields.length;
  const completedOptionalFields = optionalFieldsCount - optionalMissingFields.length;
  
  const completenessScore = Math.round(
    ((completedRequiredFields * 2) + completedOptionalFields) / 
    ((requiredFieldsCount * 2) + optionalFieldsCount) * 100
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
    section: 'demographics',
    completenessScore,
    requiredFieldsComplete,
    missingRequiredFields,
    optionalMissingFields,
    status,
    recommendations
  };
}

// Medical History section completeness assessment
export function assessMedicalHistoryCompleteness(medicalHistoryData: any): CompletenessIndicator {
  const missingRequiredFields: string[] = [];
  const optionalMissingFields: string[] = [];
  
  // Medical history doesn't strictly require conditions, but should have something to indicate status
  const hasConditions = medicalHistoryData?.conditions && medicalHistoryData.conditions.length > 0;
  const hasNoConditionsIndicator = medicalHistoryData?.noConditionsReported === true;
  
  if (!hasConditions && !hasNoConditionsIndicator) {
    missingRequiredFields.push('conditions or noConditionsReported');
  }
  
  // Check optional fields
  if (!medicalHistoryData?.medications || medicalHistoryData.medications.length === 0) {
    optionalMissingFields.push('medications');
  }
  
  if (!medicalHistoryData?.allergies || medicalHistoryData.allergies.length === 0) {
    optionalMissingFields.push('allergies');
  }
  
  if (!medicalHistoryData?.surgeries || medicalHistoryData.surgeries.length === 0) {
    optionalMissingFields.push('surgeries');
  }
  
  // Calculate completeness score
  const requiredFieldsCount = 1; // conditions or noConditionsReported flag
  const optionalFieldsCount = 3; // medications, allergies, surgeries
  
  const requiredFieldsComplete = missingRequiredFields.length === 0;
  const completedRequiredFields = requiredFieldsCount - missingRequiredFields.length;
  const completedOptionalFields = optionalFieldsCount - optionalMissingFields.length;
  
  // Additional depth check - do conditions have details?
  let detailScore = 0;
  if (hasConditions) {
    const conditionsWithDetails = medicalHistoryData.conditions.filter(
      (c: any) => c.details && c.details.length > 10
    ).length;
    
    if (medicalHistoryData.conditions.length > 0) {
      detailScore = Math.round((conditionsWithDetails / medicalHistoryData.conditions.length) * 20);
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
  
  if (hasConditions && detailScore < 15) {
    recommendations.push('Add more details to conditions to improve documentation quality');
  }
  
  return {
    section: 'medicalHistory',
    completenessScore,
    requiredFieldsComplete,
    missingRequiredFields,
    optionalMissingFields,
    status,
    recommendations
  };
}

// Symptoms Assessment section completeness assessment
export function assessSymptomsAssessmentCompleteness(symptomsData: any): CompletenessIndicator {
  const missingRequiredFields: string[] = [];
  const optionalMissingFields: string[] = [];
  
  // Should have at least one category of symptoms or explicitly note no symptoms
  const hasPhysicalSymptoms = symptomsData?.physicalSymptoms && symptomsData.physicalSymptoms.length > 0;
  const hasCognitiveSymptoms = symptomsData?.cognitiveSymptoms && symptomsData.cognitiveSymptoms.length > 0;
  const hasEmotionalSymptoms = symptomsData?.emotionalSymptoms && symptomsData.emotionalSymptoms.length > 0;
  const hasNoSymptomsIndicator = symptomsData?.noSymptomsReported === true;
  
  if (!hasPhysicalSymptoms && !hasCognitiveSymptoms && !hasEmotionalSymptoms && !hasNoSymptomsIndicator) {
    missingRequiredFields.push('symptoms or noSymptomsReported flag');
  }
  
  // Calculate completeness score
  let completenessScore = 0;
  const requiredFieldsComplete = missingRequiredFields.length === 0;
  
  // Calculate based on symptom details
  if (requiredFieldsComplete) {
    // Start with 50 points for having the required structure
    completenessScore = 50;
    
    // Calculate detail quality for each symptom type
    const symptomsWithDetails: Record<string, number> = {
      physical: 0,
      cognitive: 0,
      emotional: 0
    };
    
    const symptomCounts: Record<string, number> = {
      physical: hasPhysicalSymptoms ? symptomsData.physicalSymptoms.length : 0,
      cognitive: hasCognitiveSymptoms ? symptomsData.cognitiveSymptoms.length : 0,
      emotional: hasEmotionalSymptoms ? symptomsData.emotionalSymptoms.length : 0
    };
    
    if (hasPhysicalSymptoms) {
      symptomsWithDetails.physical = symptomsData.physicalSymptoms.filter(
        (s: any) => s.severity && s.impact && s.impact.length > 15
      ).length;
    }
    
    if (hasCognitiveSymptoms) {
      symptomsWithDetails.cognitive = symptomsData.cognitiveSymptoms.filter(
        (s: any) => s.severity && s.impact && s.impact.length > 15
      ).length;
    }
    
    if (hasEmotionalSymptoms) {
      symptomsWithDetails.emotional = symptomsData.emotionalSymptoms.filter(
        (s: any) => s.severity && s.impact && s.impact.length > 15
      ).length;
    }
    
    // Calculate detail score - max 50 additional points
    let detailScore = 0;
    const totalSymptoms = symptomCounts.physical + symptomCounts.cognitive + symptomCounts.emotional;
    const totalSymptomsWithDetails = symptomsWithDetails.physical + symptomsWithDetails.cognitive + symptomsWithDetails.emotional;
    
    if (totalSymptoms > 0) {
      detailScore = Math.round((totalSymptomsWithDetails / totalSymptoms) * 50);
    } else if (hasNoSymptomsIndicator) {
      // If no symptoms but the flag is set, give full detail points
      detailScore = 50;
    }
    
    completenessScore += detailScore;
  }
  
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
  
  if (hasPhysicalSymptoms && symptomsData.physicalSymptoms.some((s: any) => !s.severity)) {
    recommendations.push('Add severity ratings to all physical symptoms');
  }
  
  if (hasPhysicalSymptoms && symptomsData.physicalSymptoms.some((s: any) => !s.impact || s.impact.length < 15)) {
    recommendations.push('Add detailed impact descriptions to physical symptoms');
  }
  
  return {
    section: 'symptomsAssessment',
    completenessScore,
    requiredFieldsComplete,
    missingRequiredFields,
    optionalMissingFields,
    status,
    recommendations
  };
}

// Import other assessors
export { assessFunctionalStatusCompleteness, assessTypicalDayCompleteness } from './completenessAssessors1';
export { assessEnvironmentalAssessmentCompleteness, assessActivitiesOfDailyLivingCompleteness } from './completenessAssessors2';
export { assessAttendantCareCompleteness } from './completenessAssessors3';
