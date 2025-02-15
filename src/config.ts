export const CONFIG = {
  // Assessment section configuration
  SECTIONS: {
    DEMOGRAPHICS_HEADER: '1-DemographicsAndHeader',
    PURPOSE_METHODOLOGY: '2-PurposeAndMethodology',
    MEDICAL_HISTORY: '3-MedicalHistory',
    SUBJECTIVE_INFO: '4-SubjectiveInformation',
    FUNCTIONAL_ASSESSMENT: '5-FunctionalAssessment',
    TYPICAL_DAY: '6-TypicalDay',
    ENVIRONMENTAL_ASSESSMENT: '7-EnvironmentalAssessment',
    ADL: '8-ActivitiesOfDailyLiving',
    ATTENDANT_CARE: '9-AttendantCare',
    AMA_GUIDES: '10-AMAGuidesAssessment'
  },

  // Narrative generation settings
  NARRATIVE: {
    DETAIL_LEVELS: {
      BRIEF: 'brief',
      STANDARD: 'standard',
      DETAILED: 'detailed'
    },
    MAX_RETRIES: 3,
    TIMEOUT: 30000
  },

  // Validation settings
  VALIDATION: {
    AUTO_SAVE_INTERVAL: 5000,
    REQUIRED_FIELDS_PER_SECTION: {
      '1-DemographicsAndHeader': ['personalInfo', 'referralInfo'],
      '2-PurposeAndMethodology': ['purpose', 'methodology'],
      '3-MedicalHistory': ['preExisting', 'currentTreatments'],
      '4-SubjectiveInformation': ['symptoms', 'complaints'],
      '5-FunctionalAssessment': ['functionalLimitations', 'assessmentResults'],
      '6-TypicalDay': ['schedule', 'activities'],
      '7-EnvironmentalAssessment': ['homeEnvironment', 'workEnvironment'],
      '8-ActivitiesOfDailyLiving': ['selfCare', 'mobility', 'domesticActivities'],
      '9-AttendantCare': ['careNeeds', 'recommendations'],
      '10-AMAGuidesAssessment': ['impairmentRatings', 'justification']
    }
  }
};