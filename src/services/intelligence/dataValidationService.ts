import { SectionData } from '../../contexts/AssessmentContext';

export interface ValidationWarning {
  id: string;
  section: string;
  field?: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  details?: string;
  suggestedFix?: string;
}

// This service provides data validation warnings based on the assessment data
export const dataValidationService = {
  // Get validation warnings for a specific section
  getWarnings: async (
    sectionName: string,
    sectionData: any,
    fullAssessmentData?: any
  ): Promise<ValidationWarning[]> => {
    try {
      switch (sectionName) {
        case 'demographics':
          return validateDemographics(sectionData);
        case 'medicalHistory':
          return validateMedicalHistory(sectionData, fullAssessmentData);
        case 'symptomsAssessment':
          return validateSymptomsAssessment(sectionData, fullAssessmentData);
        case 'functionalStatus':
          return validateFunctionalStatus(sectionData, fullAssessmentData);
        case 'typicalDay':
          return validateTypicalDay(sectionData);
        case 'environmentalAssessment':
          return validateEnvironmentalAssessment(sectionData, fullAssessmentData);
        case 'activitiesOfDailyLiving':
          return validateActivitiesOfDailyLiving(sectionData, fullAssessmentData);
        case 'attendantCare':
          return validateAttendantCare(sectionData, fullAssessmentData);
        default:
          return [];
      }
    } catch (error) {
      console.error(`Error in getWarnings for ${sectionName}:`, error);
      return [];
    }
  },

  // Get all validation warnings for the entire assessment
  getAllWarnings: async (assessmentData: any): Promise<Record<string, ValidationWarning[]>> => {
    const result: Record<string, ValidationWarning[]> = {};
    
    for (const [section, data] of Object.entries(assessmentData)) {
      if (section !== 'metadata' && data) {
        result[section] = await dataValidationService.getWarnings(
          section, 
          data as SectionData,
          assessmentData
        );
      }
    }
    
    return result;
  }
};

// Validation functions for each section

function validateDemographics(demographicsData: any): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  // Validate client information
  if (!demographicsData?.client?.name) {
    warnings.push({
      id: `demo-name-${Date.now()}`,
      section: 'demographics',
      field: 'client.name',
      message: 'Client name is missing',
      severity: 'critical',
      suggestedFix: 'Add client name to the demographics section'
    });
  }

  if (!demographicsData?.client?.dateOfBirth) {
    warnings.push({
      id: `demo-dob-${Date.now()}`,
      section: 'demographics',
      field: 'client.dateOfBirth',
      message: 'Client date of birth is missing',
      severity: 'warning',
      suggestedFix: 'Add client date of birth to the demographics section'
    });
  } else {
    // Validate date format and reasonableness
    const dob = new Date(demographicsData.client.dateOfBirth);
    const now = new Date();
    if (isNaN(dob.getTime())) {
      warnings.push({
        id: `demo-dob-invalid-${Date.now()}`,
        section: 'demographics',
        field: 'client.dateOfBirth',
        message: 'Client date of birth is in an invalid format',
        severity: 'warning',
        suggestedFix: 'Ensure date of birth is in YYYY-MM-DD format'
      });
    } else if (dob > now) {
      warnings.push({
        id: `demo-dob-future-${Date.now()}`,
        section: 'demographics',
        field: 'client.dateOfBirth',
        message: 'Client date of birth is in the future',
        severity: 'critical',
        suggestedFix: 'Correct the date of birth to a valid past date'
      });
    } else if (dob.getFullYear() < 1900) {
      warnings.push({
        id: `demo-dob-old-${Date.now()}`,
        section: 'demographics',
        field: 'client.dateOfBirth',
        message: 'Client date of birth is before 1900, please verify',
        severity: 'info',
        suggestedFix: 'Verify the date of birth is correct'
      });
    }
  }

  // Validate contact information
  if (
    !demographicsData?.client?.contactInformation?.phone &&
    !demographicsData?.client?.contactInformation?.email
  ) {
    warnings.push({
      id: `demo-contact-${Date.now()}`,
      section: 'demographics',
      field: 'client.contactInformation',
      message: 'No contact information provided for client',
      severity: 'warning',
      suggestedFix: 'Add at least one form of contact information (phone or email)'
    });
  }

  // Validate referral source
  if (!demographicsData?.referral?.source) {
    warnings.push({
      id: `demo-referral-${Date.now()}`,
      section: 'demographics',
      field: 'referral.source',
      message: 'Referral source is missing',
      severity: 'info',
      suggestedFix: 'Add referral source information'
    });
  }

  return warnings;
}

function validateMedicalHistory(
  medicalHistoryData: any,
  fullAssessmentData?: any
): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  // Check if there's at least one condition listed
  if (!medicalHistoryData?.conditions || medicalHistoryData.conditions.length === 0) {
    warnings.push({
      id: `med-conditions-${Date.now()}`,
      section: 'medicalHistory',
      field: 'conditions',
      message: 'No medical conditions listed',
      severity: 'info',
      details: 'Even if the client has no conditions, this should be explicitly noted',
      suggestedFix: 'Add at least one condition or explicitly note "No known medical conditions"'
    });
  }

  // Check if symptoms are consistent with medical conditions
  if (
    fullAssessmentData?.symptomsAssessment?.physicalSymptoms?.length > 0 &&
    medicalHistoryData?.conditions?.length > 0
  ) {
    // Extract symptom names
    const symptomNames = fullAssessmentData.symptomsAssessment.physicalSymptoms
      .map((s: any) => s.name?.toLowerCase())
      .filter(Boolean);
    
    // Extract condition names and details
    const conditionTexts = medicalHistoryData.conditions
      .flatMap((c: any) => [
        c.name?.toLowerCase(),
        c.details?.toLowerCase()
      ])
      .filter(Boolean);
    
    // Check for common symptom-condition mismatches
    const painSymptoms = symptomNames.filter(s => s.includes('pain'));
    const painConditions = conditionTexts.some(c => 
      c.includes('arthritis') || 
      c.includes('injury') || 
      c.includes('chronic pain') ||
      c.includes('fibromyalgia')
    );
    
    if (painSymptoms.length > 0 && !painConditions) {
      warnings.push({
        id: `med-pain-${Date.now()}`,
        section: 'medicalHistory',
        field: 'conditions',
        message: 'Pain symptoms reported without related medical conditions',
        severity: 'warning',
        details: `Pain symptoms (${painSymptoms.join(', ')}) are reported, but no pain-related conditions are documented`,
        suggestedFix: 'Consider adding related diagnoses or conditions that may explain the pain symptoms'
      });
    }
  }

  return warnings;
}

function validateSymptomsAssessment(
  symptomsData: any,
  fullAssessmentData?: any
): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  // Check if there are any symptoms listed
  const noPhysicalSymptoms = !symptomsData?.physicalSymptoms || symptomsData.physicalSymptoms.length === 0;
  const noCognitiveSymptoms = !symptomsData?.cognitiveSymptoms || symptomsData.cognitiveSymptoms.length === 0;
  const noEmotionalSymptoms = !symptomsData?.emotionalSymptoms || symptomsData.emotionalSymptoms.length === 0;
  
  if (noPhysicalSymptoms && noCognitiveSymptoms && noEmotionalSymptoms) {
    warnings.push({
      id: `symptoms-none-${Date.now()}`,
      section: 'symptomsAssessment',
      message: 'No symptoms documented in any category',
      severity: 'warning',
      details: 'Assessment should document symptoms or explicitly note their absence',
      suggestedFix: 'Add symptoms or explicitly document "No symptoms reported"'
    });
  }

  // Check for symptoms without severity
  if (!noPhysicalSymptoms) {
    const symptomsWithoutSeverity = symptomsData.physicalSymptoms.filter((s: any) => !s.severity);
    
    if (symptomsWithoutSeverity.length > 0) {
      warnings.push({
        id: `symptoms-severity-${Date.now()}`,
        section: 'symptomsAssessment',
        field: 'physicalSymptoms',
        message: `${symptomsWithoutSeverity.length} physical symptom(s) missing severity rating`,
        severity: 'warning',
        details: 'All symptoms should have a severity rating',
        suggestedFix: 'Add severity ratings for all listed symptoms'
      });
    }
  }

  // Check for severe symptoms without impact description
  if (!noPhysicalSymptoms) {
    const severeSymptoms = symptomsData.physicalSymptoms.filter(
      (s: any) => s.severity === 'severe' && (!s.impact || s.impact.length < 10)
    );
    
    if (severeSymptoms.length > 0) {
      warnings.push({
        id: `symptoms-impact-${Date.now()}`,
        section: 'symptomsAssessment',
        field: 'physicalSymptoms',
        message: `${severeSymptoms.length} severe symptom(s) missing detailed impact description`,
        severity: 'warning',
        details: 'Severe symptoms should include a detailed description of their impact on function',
        suggestedFix: 'Add detailed impact descriptions for severe symptoms'
      });
    }
  }

  return warnings;
}

function validateFunctionalStatus(
  functionalStatusData: any,
  fullAssessmentData?: any
): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  // Validate mobility assessment
  if (!functionalStatusData?.mobilityAssessment) {
    warnings.push({
      id: `func-mobility-${Date.now()}`,
      section: 'functionalStatus',
      field: 'mobilityAssessment',
      message: 'Mobility assessment section is missing',
      severity: 'warning',
      suggestedFix: 'Complete the mobility assessment section'
    });
  } else {
    // Check for missing mobility scores
    if (functionalStatusData.mobilityAssessment.independenceScore === undefined) {
      warnings.push({
        id: `func-mobility-score-${Date.now()}`,
        section: 'functionalStatus',
        field: 'mobilityAssessment.independenceScore',
        message: 'Mobility independence score is missing',
        severity: 'info',
        suggestedFix: 'Add an independence score for mobility'
      });
    }
    
    // Check for assistive devices inconsistency
    if (
      functionalStatusData.mobilityAssessment.usesAssistiveDevices === true &&
      (!functionalStatusData.mobilityAssessment.assistiveDevices || 
       functionalStatusData.mobilityAssessment.assistiveDevices.length === 0)
    ) {
      warnings.push({
        id: `func-devices-${Date.now()}`,
        section: 'functionalStatus',
        field: 'mobilityAssessment.assistiveDevices',
        message: 'Client uses assistive devices but none are specified',
        severity: 'warning',
        suggestedFix: 'Add details about which assistive devices are used'
      });
    }
  }

  // Validate upper extremity function
  if (!functionalStatusData?.upperExtremityFunction) {
    warnings.push({
      id: `func-upper-${Date.now()}`,
      section: 'functionalStatus',
      field: 'upperExtremityFunction',
      message: 'Upper extremity function assessment is missing',
      severity: 'warning',
      suggestedFix: 'Complete the upper extremity function assessment'
    });
  } else {
    // Check for ROM data but no functional impacts
    const hasRomData = 
      functionalStatusData.upperExtremityFunction.rightArm?.rom ||
      functionalStatusData.upperExtremityFunction.leftArm?.rom;
    const hasRomImpacts = functionalStatusData.upperExtremityFunction.functionalImpacts?.length > 0;
    
    if (hasRomData && !hasRomImpacts) {
      warnings.push({
        id: `func-rom-impacts-${Date.now()}`,
        section: 'functionalStatus',
        field: 'upperExtremityFunction.functionalImpacts',
        message: 'ROM limitations noted but functional impacts are missing',
        severity: 'warning',
        details: 'When ROM limitations are documented, their impact on function should be described',
        suggestedFix: 'Add functional impacts related to the ROM limitations'
      });
    }
  }

  return warnings;
}

function validateTypicalDay(typicalDayData: any): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  // Check if any time periods are completely empty
  const timeSlots = ['morningRoutine', 'afternoonRoutine', 'eveningRoutine', 'nightRoutine'];
  
  for (const slot of timeSlots) {
    if (!typicalDayData?.[slot] || typicalDayData[slot].trim() === '') {
      warnings.push({
        id: `typical-${slot}-${Date.now()}`,
        section: 'typicalDay',
        field: slot,
        message: `${slot.replace('Routine', '')} routine is empty`,
        severity: 'warning',
        details: 'All time periods should be documented to provide a comprehensive picture of daily function',
        suggestedFix: `Add information about the client's ${slot.replace('Routine', '')} routine`
      });
    }
  }

  // Check for very short descriptions
  for (const slot of timeSlots) {
    if (typicalDayData?.[slot] && typicalDayData[slot].length < 20) {
      warnings.push({
        id: `typical-short-${slot}-${Date.now()}`,
        section: 'typicalDay',
        field: slot,
        message: `${slot.replace('Routine', '')} routine description is very brief`,
        severity: 'info',
        details: 'Routine descriptions should provide enough detail to understand functional abilities',
        suggestedFix: `Add more details to the ${slot.replace('Routine', '')} routine description`
      });
    }
  }

  return warnings;
}

function validateEnvironmentalAssessment(
  environmentalAssessmentData: any,
  fullAssessmentData?: any
): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  // Check if basic dwelling information is provided
  if (!environmentalAssessmentData?.dwelling?.type) {
    warnings.push({
      id: `env-dwelling-${Date.now()}`,
      section: 'environmentalAssessment',
      field: 'dwelling.type',
      message: 'Dwelling type is not specified',
      severity: 'warning',
      suggestedFix: 'Specify the type of dwelling'
    });
  }

  // Check if accessibility issues are documented for clients with mobility issues
  const hasMobilityIssues = fullAssessmentData?.functionalStatus?.mobilityAssessment?.independenceScore < 3 ||
    (fullAssessmentData?.functionalStatus?.mobilityAssessment?.assistiveDevices?.length > 0);
  
  if (
    hasMobilityIssues && 
    (!environmentalAssessmentData?.accessibilityIssues?.issues || 
     environmentalAssessmentData.accessibilityIssues.issues.length === 0)
  ) {
    warnings.push({
      id: `env-accessibility-${Date.now()}`,
      section: 'environmentalAssessment',
      field: 'accessibilityIssues',
      message: 'Client has mobility issues but no accessibility issues are documented',
      severity: 'warning',
      details: 'Clients with mobility limitations typically face some environmental barriers',
      suggestedFix: 'Document environmental barriers or explicitly note that the environment is fully accessible'
    });
  }

  // Check if safety assessment is complete
  if (!environmentalAssessmentData?.safetyAssessment) {
    warnings.push({
      id: `env-safety-${Date.now()}`,
      section: 'environmentalAssessment',
      field: 'safetyAssessment',
      message: 'Safety assessment is missing',
      severity: 'warning',
      suggestedFix: 'Complete the safety assessment section'
    });
  } else {
    // Check for incomplete safety assessment areas
    const safetyAreas = [
      'bathroomSafety', 
      'kitchenSafety', 
      'bedroomSafety', 
      'entranceExitSafety'
    ];
    
    for (const area of safetyAreas) {
      if (!environmentalAssessmentData.safetyAssessment[area]) {
        warnings.push({
          id: `env-safety-${area}-${Date.now()}`,
          section: 'environmentalAssessment',
          field: `safetyAssessment.${area}`,
          message: `${area.replace('Safety', '')} safety assessment is missing`,
          severity: 'info',
          suggestedFix: `Complete the ${area.replace('Safety', '')} safety assessment`
        });
      }
    }
  }

  return warnings;
}

function validateActivitiesOfDailyLiving(
  adlData: any,
  fullAssessmentData?: any
): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  // Check if basic ADL information is provided
  if (!adlData?.basicAdls) {
    warnings.push({
      id: `adl-basic-${Date.now()}`,
      section: 'activitiesOfDailyLiving',
      field: 'basicAdls',
      message: 'Basic ADLs section is missing',
      severity: 'warning',
      suggestedFix: 'Complete the basic ADLs section'
    });
  } else {
    // Check for incomplete basic ADL areas
    const basicAdlAreas = [
      'bathing', 
      'dressing', 
      'toileting', 
      'transferring',
      'feeding',
      'grooming'
    ];
    
    for (const area of basicAdlAreas) {
      if (adlData.basicAdls[area] === undefined) {
        warnings.push({
          id: `adl-basic-${area}-${Date.now()}`,
          section: 'activitiesOfDailyLiving',
          field: `basicAdls.${area}`,
          message: `${area} assessment is missing`,
          severity: 'info',
          suggestedFix: `Complete the ${area} assessment`
        });
      }
    }
  }

  // Check if instrumental ADL information is provided
  if (!adlData?.instrumentalAdls) {
    warnings.push({
      id: `adl-iadl-${Date.now()}`,
      section: 'activitiesOfDailyLiving',
      field: 'instrumentalAdls',
      message: 'Instrumental ADLs section is missing',
      severity: 'warning',
      suggestedFix: 'Complete the instrumental ADLs section'
    });
  }

  // Check for consistency with symptoms
  if (
    fullAssessmentData?.symptomsAssessment?.physicalSymptoms?.some(
      (s: any) => 
        (s.name?.toLowerCase().includes('pain') || s.name?.toLowerCase().includes('fatigue')) && 
        s.severity === 'severe'
    ) &&
    adlData?.basicAdls
  ) {
    // If there are severe pain/fatigue symptoms, check if any ADLs are marked as independent
    const independentAdls = Object.entries(adlData.basicAdls)
      .filter(([key, value]: [string, any]) => value?.independenceLevel === 'independent')
      .map(([key]: [string, any]) => key);
    
    if (independentAdls.length > 3) {
      warnings.push({
        id: `adl-symptom-consistency-${Date.now()}`,
        section: 'activitiesOfDailyLiving',
        message: 'Severe pain/fatigue reported but multiple ADLs rated as fully independent',
        severity: 'info',
        details: `Client reports severe pain/fatigue but is rated as independent in ${independentAdls.join(', ')}`,
        suggestedFix: 'Verify independence levels or document how client manages ADLs despite symptoms'
      });
    }
  }

  return warnings;
}

function validateAttendantCare(
  attendantCareData: any,
  fullAssessmentData?: any
): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  // Check if attendant care needs assessment is provided
  if (!attendantCareData?.needsAssessment) {
    warnings.push({
      id: `attendant-needs-${Date.now()}`,
      section: 'attendantCare',
      field: 'needsAssessment',
      message: 'Attendant care needs assessment is missing',
      severity: 'warning',
      suggestedFix: 'Complete the attendant care needs assessment'
    });
  }

  // Check for consistency with ADLs
  if (
    attendantCareData?.needsAssessment?.needs?.length > 0 &&
    fullAssessmentData?.activitiesOfDailyLiving?.basicAdls
  ) {
    // Extract needs categories
    const careNeeds = attendantCareData.needsAssessment.needs.map(
      (n: any) => n.category?.toLowerCase()
    ).filter(Boolean);
    
    // Check for ADLs marked as dependent but not included in attendant care
    const adlData = fullAssessmentData.activitiesOfDailyLiving.basicAdls;
    const dependentAdls = Object.entries(adlData)
      .filter(([key, value]: [string, any]) => 
        value?.independenceLevel === 'dependent' || 
        value?.independenceLevel === 'maximal assistance'
      )
      .map(([key]: [string, any]) => key);
    
    const missingCareNeeds = dependentAdls.filter(adl => {
      // Map ADL to care need category
      const categoryMap: Record<string, string> = {
        'bathing': 'hygiene',
        'dressing': 'dressing',
        'toileting': 'toileting',
        'transferring': 'mobility',
        'feeding': 'feeding',
        'grooming': 'hygiene'
      };
      
      const category = categoryMap[adl];
      return category && !careNeeds.some(need => need.includes(category));
    });
    
    if (missingCareNeeds.length > 0) {
      warnings.push({
        id: `attendant-consistency-${Date.now()}`,
        section: 'attendantCare',
        message: 'Dependent ADLs not reflected in attendant care needs',
        severity: 'warning',
        details: `Client needs assistance with ${missingCareNeeds.join(', ')} but these are not included in attendant care needs`,
        suggestedFix: 'Add attendant care needs corresponding to all dependent ADLs'
      });
    }
  }

  // Check for hourly calculations
  if (
    attendantCareData?.recommendations?.totalHours === undefined &&
    attendantCareData?.needsAssessment?.needs?.length > 0
  ) {
    warnings.push({
      id: `attendant-hours-${Date.now()}`,
      section: 'attendantCare',
      field: 'recommendations.totalHours',
      message: 'Total attendant care hours not calculated',
      severity: 'warning',
      details: 'Attendant care needs are documented but total hours are not calculated',
      suggestedFix: 'Calculate and document total recommended attendant care hours'
    });
  }

  return warnings;
}
