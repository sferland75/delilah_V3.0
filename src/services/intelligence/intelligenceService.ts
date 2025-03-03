import { contextualSuggestionService } from './contextualSuggestionService';
import { dataValidationService } from './dataValidationService';
import { contentImprovementService } from './contentImprovementService';
import { completenessService } from './completenessService';
import { terminologyConsistencyService } from './terminologyConsistencyService';

// Main intelligence service that coordinates all intelligence features
export const intelligenceService = {
  // Get contextual suggestions for a given section and current data
  getContextualSuggestions: contextualSuggestionService.getSuggestions,
  
  // Get data validation warnings for a given section and current data
  getDataValidationWarnings: dataValidationService.getWarnings,
  
  // Get content improvement recommendations for a given section and current data
  getContentImprovementRecommendations: contentImprovementService.getRecommendations,
  
  // Get section completeness indicators for a given section and current data
  getSectionCompleteness: completenessService.getCompleteness,
  
  // Get terminology consistency checks for a given section and current data
  getTerminologyConsistencyChecks: terminologyConsistencyService.getConsistencyChecks,
  
  // Process a full assessment to get all intelligence insights
  processAssessment: async (assessmentData: any) => {
    return {
      suggestions: await contextualSuggestionService.getAllSuggestions(assessmentData),
      validationWarnings: await dataValidationService.getAllWarnings(assessmentData),
      improvementRecommendations: await contentImprovementService.getAllRecommendations(assessmentData),
      completenessIndicators: await completenessService.getAllCompleteness(assessmentData),
      consistencyChecks: await terminologyConsistencyService.getAllConsistencyChecks(assessmentData),
    };
  }
};
