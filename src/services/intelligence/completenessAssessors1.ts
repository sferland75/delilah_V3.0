import { CompletenessIndicator } from './completenessService';

// Functional Status section completeness assessment
export function assessFunctionalStatusCompleteness(functionalStatusData: any): CompletenessIndicator {
  const missingRequiredFields: string[] = [];
  const optionalMissingFields: string[] = [];
  
  // Check required fields - mobility assessment and upper extremity function are considered required
  if (!functionalStatusData?.mobilityAssessment) {
    missingRequiredFields.push('mobilityAssessment');
  } else {
    if (functionalStatusData.mobilityAssessment.independenceScore === undefined) {
      missingRequiredFields.push('mobilityAssessment.independenceScore');
    }
    
    if (!functionalStatusData.mobilityAssessment.description) {
      missingRequiredFields.push('mobilityAssessment.description');
    }
  }
  
  if (!functionalStatusData?.upperExtremityFunction) {
    missingRequiredFields.push('upperExtremityFunction');
  } else {
    if (!functionalStatusData.upperExtremityFunction.rightArm && !functionalStatusData.upperExtremityFunction.leftArm) {
      missingRequiredFields.push('upperExtremityFunction.arm data');
    }
  }
  
  // Check optional fields
  if (!functionalStatusData?.cognitiveFunctioning) {
    optionalMissingFields.push('cognitiveFunctioning');
  }
  
  // Calculate completeness score
  const requiredFieldsCount = 4; // mobilityAssessment, independence score, description, upper extremity
  const optionalFieldsCount = 1; // cognitive functioning
  
  const requiredFieldsComplete = missingRequiredFields.length === 0;
  const completedRequiredFields = requiredFieldsCount - missingRequiredFields.length;
  const completedOptionalFields = optionalFieldsCount - optionalMissingFields.length;
  
  // Additional depth check
  let detailScore = 0;
  
  // Check mobility description detail
  if (functionalStatusData?.mobilityAssessment?.description) {
    if (functionalStatusData.mobilityAssessment.description.length > 100) {
      detailScore += 10;
    } else if (functionalStatusData.mobilityAssessment.description.length > 50) {
      detailScore += 5;
    }
  }
  
  // Check upper extremity detail
  if (functionalStatusData?.upperExtremityFunction?.functionalImpacts) {
    if (functionalStatusData.upperExtremityFunction.functionalImpacts.length >= 3) {
      detailScore += 10;
    } else if (functionalStatusData.upperExtremityFunction.functionalImpacts.length > 0) {
      detailScore += 5;
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
  
  if (functionalStatusData?.mobilityAssessment?.description && functionalStatusData.mobilityAssessment.description.length < 50) {
    recommendations.push('Provide more detailed description of mobility function');
  }
  
  if (!functionalStatusData?.upperExtremityFunction?.functionalImpacts || functionalStatusData.upperExtremityFunction.functionalImpacts.length < 2) {
    recommendations.push('Add more functional impacts related to upper extremity function');
  }
  
  return {
    section: 'functionalStatus',
    completenessScore,
    requiredFieldsComplete,
    missingRequiredFields,
    optionalMissingFields,
    status,
    recommendations
  };
}

// Typical Day section completeness assessment
export function assessTypicalDayCompleteness(typicalDayData: any): CompletenessIndicator {
  const missingRequiredFields: string[] = [];
  const optionalMissingFields: string[] = [];
  
  // Check required fields - all daily routines are considered required
  const routines = ['morningRoutine', 'afternoonRoutine', 'eveningRoutine', 'nightRoutine'];
  
  for (const routine of routines) {
    if (!typicalDayData?.[routine] || typicalDayData[routine].trim() === '') {
      missingRequiredFields.push(routine);
    }
  }
  
  // Calculate completeness score
  const requiredFieldsCount = routines.length;
  
  const requiredFieldsComplete = missingRequiredFields.length === 0;
  const completedRequiredFields = requiredFieldsCount - missingRequiredFields.length;
  
  // Check detail level of descriptions
  let detailScore = 0;
  let detailRecommendations: string[] = [];
  
  for (const routine of routines) {
    if (typicalDayData?.[routine]) {
      const content = typicalDayData[routine];
      
      if (content.length > 150) {
        detailScore += 10;
      } else if (content.length > 75) {
        detailScore += 5;
      } else if (content.length < 30 && content.trim() !== '') {
        detailRecommendations.push(`Provide more details about ${routine.replace('Routine', ' routine')}`);
      }
    }
  }
  
  // Normalize detail score to max of 20
  detailScore = Math.min(detailScore, 20);
  
  const completenessScore = Math.round(
    (completedRequiredFields / requiredFieldsCount) * 80 + detailScore
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
  
  recommendations.push(...detailRecommendations);
  
  return {
    section: 'typicalDay',
    completenessScore,
    requiredFieldsComplete,
    missingRequiredFields,
    optionalMissingFields,
    status,
    recommendations
  };
}
