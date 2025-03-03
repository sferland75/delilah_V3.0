import { CompletenessIndicator } from './completenessService';

// Environmental Assessment section completeness assessment
export function assessEnvironmentalAssessmentCompleteness(environmentalAssessmentData: any): CompletenessIndicator {
  const missingRequiredFields: string[] = [];
  const optionalMissingFields: string[] = [];
  
  // Check required fields
  if (!environmentalAssessmentData?.dwelling?.type) {
    missingRequiredFields.push('dwelling.type');
  }
  
  if (!environmentalAssessmentData?.dwelling?.description) {
    missingRequiredFields.push('dwelling.description');
  }
  
  if (!environmentalAssessmentData?.safetyAssessment) {
    missingRequiredFields.push('safetyAssessment');
  } else {
    // Check key safety areas
    const safetyAreas = ['bathroomSafety', 'kitchenSafety'];
    for (const area of safetyAreas) {
      if (!environmentalAssessmentData.safetyAssessment[area]) {
        missingRequiredFields.push(`safetyAssessment.${area}`);
      }
    }
  }
  
  // Check optional fields
  if (!environmentalAssessmentData?.accessibilityIssues || !environmentalAssessmentData.accessibilityIssues.issues) {
    optionalMissingFields.push('accessibilityIssues');
  }
  
  // Calculate completeness score
  const requiredFieldsCount = 4; // dwelling type, description, bathroom safety, kitchen safety
  const optionalFieldsCount = 1; // accessibility issues
  
  const requiredFieldsComplete = missingRequiredFields.length === 0;
  const completedRequiredFields = requiredFieldsCount - missingRequiredFields.length;
  const completedOptionalFields = optionalFieldsCount - optionalMissingFields.length;
  
  // Additional detail check
  let detailScore = 0;
  
  // Check dwelling description detail
  if (environmentalAssessmentData?.dwelling?.description) {
    if (environmentalAssessmentData.dwelling.description.length > 100) {
      detailScore += 10;
    } else if (environmentalAssessmentData.dwelling.description.length > 50) {
      detailScore += 5;
    }
  }
  
  // Check safety assessments detail
  if (environmentalAssessmentData?.safetyAssessment) {
    let detailedSafetyAreas = 0;
    const safetyAreas = ['bathroomSafety', 'kitchenSafety', 'bedroomSafety', 'entranceExitSafety'];
    
    for (const area of safetyAreas) {
      const content = environmentalAssessmentData.safetyAssessment[area];
      if (content && content.length > 50) {
        detailedSafetyAreas++;
      }
    }
    
    detailScore += Math.min(detailedSafetyAreas * 2.5, 10);
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
    section: 'environmentalAssessment',
    completenessScore,
    requiredFieldsComplete,
    missingRequiredFields,
    optionalMissingFields,
    status,
    recommendations
  };
}

// Activities of Daily Living section completeness assessment
export function assessActivitiesOfDailyLivingCompleteness(adlData: any): CompletenessIndicator {
  const missingRequiredFields: string[] = [];
  const optionalMissingFields: string[] = [];
  
  // Check required fields
  if (!adlData?.basicAdls) {
    missingRequiredFields.push('basicAdls');
  } else {
    // Check required basic ADLs
    const requiredBasicAdls = ['bathing', 'dressing', 'toileting', 'transferring', 'feeding'];
    
    for (const adl of requiredBasicAdls) {
      if (adlData.basicAdls[adl] === undefined) {
        missingRequiredFields.push(`basicAdls.${adl}`);
      }
    }
  }
  
  // Check optional fields
  if (!adlData?.instrumentalAdls) {
    optionalMissingFields.push('instrumentalAdls');
  } else {
    // Check key IADLs
    const keyIadls = ['mealPreparation', 'homeManagement', 'financialManagement', 'communityMobility'];
    
    for (const iadl of keyIadls) {
      if (adlData.instrumentalAdls[iadl] === undefined) {
        optionalMissingFields.push(`instrumentalAdls.${iadl}`);
      }
    }
  }
  
  // Calculate completeness score
  const requiredFieldsCount = 6; // basicAdls section plus 5 key ADLs
  const optionalFieldsCount = 5; // IADLs section plus 4 key IADLs
  
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
    section: 'activitiesOfDailyLiving',
    completenessScore,
    requiredFieldsComplete,
    missingRequiredFields,
    optionalMissingFields,
    status,
    recommendations
  };
}
