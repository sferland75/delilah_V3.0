import { SectionData } from '../../contexts/AssessmentContext';
import { 
  assessDemographicsCompleteness,
  assessMedicalHistoryCompleteness,
  assessSymptomsAssessmentCompleteness, 
  assessFunctionalStatusCompleteness,
  assessTypicalDayCompleteness,
  assessEnvironmentalAssessmentCompleteness,
  assessActivitiesOfDailyLivingCompleteness,
  assessAttendantCareCompleteness
} from './completenessAssessors';

export interface CompletenessIndicator {
  section: string;
  completenessScore: number; // 0-100 percentage
  requiredFieldsComplete: boolean;
  missingRequiredFields: string[];
  optionalMissingFields: string[];
  status: 'incomplete' | 'partial' | 'complete';
  recommendations: string[];
}

// Default indicator for unknown sections
function createDefaultCompletenessIndicator(sectionName: string): CompletenessIndicator {
  return {
    section: sectionName,
    completenessScore: 0,
    requiredFieldsComplete: false,
    missingRequiredFields: ['unknown'],
    optionalMissingFields: [],
    status: 'incomplete',
    recommendations: ['Complete required fields for this section']
  };
}

// This service provides section completeness indicators
export const completenessService = {
  // Get completeness indicator for a specific section
  getCompleteness: async (
    sectionName: string,
    sectionData: any,
    fullAssessmentData?: any
  ): Promise<CompletenessIndicator> => {
    try {
      switch (sectionName) {
        case 'demographics':
          return assessDemographicsCompleteness(sectionData);
        case 'medicalHistory':
          return assessMedicalHistoryCompleteness(sectionData);
        case 'symptomsAssessment':
          return assessSymptomsAssessmentCompleteness(sectionData);
        case 'functionalStatus':
          return assessFunctionalStatusCompleteness(sectionData);
        case 'typicalDay':
          return assessTypicalDayCompleteness(sectionData);
        case 'environmentalAssessment':
          return assessEnvironmentalAssessmentCompleteness(sectionData);
        case 'activitiesOfDailyLiving':
          return assessActivitiesOfDailyLivingCompleteness(sectionData);
        case 'attendantCare':
          return assessAttendantCareCompleteness(sectionData);
        default:
          return createDefaultCompletenessIndicator(sectionName);
      }
    } catch (error) {
      console.error(`Error in getCompleteness for ${sectionName}:`, error);
      return createDefaultCompletenessIndicator(sectionName);
    }
  },

  // Get all completeness indicators for the entire assessment
  getAllCompleteness: async (assessmentData: any): Promise<Record<string, CompletenessIndicator>> => {
    const result: Record<string, CompletenessIndicator> = {};
    
    for (const [section, data] of Object.entries(assessmentData)) {
      if (section !== 'metadata' && data) {
        result[section] = await completenessService.getCompleteness(
          section, 
          data as SectionData,
          assessmentData
        );
      }
    }
    
    return result;
  }
};
