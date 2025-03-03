/**
 * Intelligent Suggestion Service
 * 
 * This service integrates all data validation, content suggestion, and missing
 * information detection to provide comprehensive suggestions for improving
 * assessment data.
 */

import { CrossSectionValidator, ValidationResult } from './validation/CrossSectionValidator';
import { ContentSuggestionService, ContentSuggestion } from './suggestions/ContentSuggestionService';
import { MissingInformationDetector, MissingInformation } from './validation/MissingInformationDetector';

export interface SuggestionResult {
  validationResults: ValidationResult[];
  contentSuggestions: ContentSuggestion[];
  missingInformation: MissingInformation[];
  timestamp: string;
}

export class IntelligentSuggestionService {
  private validator: CrossSectionValidator;
  private suggestionService: ContentSuggestionService;
  private missingInfoDetector: MissingInformationDetector;
  
  constructor() {
    this.validator = new CrossSectionValidator();
    this.suggestionService = new ContentSuggestionService();
    this.missingInfoDetector = new MissingInformationDetector();
  }
  
  /**
   * Generate comprehensive suggestions for the extracted data
   * @param extractedData The extracted assessment data
   * @returns Comprehensive suggestion results
   */
  generateSuggestions(extractedData: any): SuggestionResult {
    if (!extractedData) {
      return {
        validationResults: [],
        contentSuggestions: [],
        missingInformation: [],
        timestamp: new Date().toISOString()
      };
    }
    
    // Generate validation results
    const validationResults = this.validator.validateData(extractedData);
    
    // Generate content suggestions
    const contentSuggestions = this.suggestionService.generateSuggestions(extractedData);
    
    // Generate missing information
    const missingInformation = this.missingInfoDetector.detectMissingInfo(extractedData);
    
    // Return comprehensive results
    return {
      validationResults,
      contentSuggestions,
      missingInformation,
      timestamp: new Date().toISOString()
    };
  }
  
  /**
   * Apply suggested fixes to the assessment data
   * @param extractedData The original assessment data
   * @param suggestionsToApply Array of suggestion IDs to apply
   * @returns Updated assessment data
   */
  applySuggestions(extractedData: any, suggestionsToApply: string[]): any {
    if (!extractedData || !suggestionsToApply || suggestionsToApply.length === 0) {
      return extractedData;
    }
    
    // Generate all suggestions
    const allSuggestions = this.generateSuggestions(extractedData);
    
    // Create a deep copy of the data to modify
    const updatedData = JSON.parse(JSON.stringify(extractedData));
    
    // Apply content suggestions
    allSuggestions.contentSuggestions.forEach(suggestion => {
      if (suggestionsToApply.includes(suggestion.id)) {
        this.applySuggestion(updatedData, suggestion);
      }
    });
    
    // Apply validation fixes
    allSuggestions.validationResults.forEach(validation => {
      if (validation.suggestedFix && suggestionsToApply.includes(validation.section + '-' + validation.field)) {
        this.applyValidationFix(updatedData, validation);
      }
    });
    
    return updatedData;
  }
  
  /**
   * Apply a single content suggestion to the data
   */
  private applySuggestion(data: any, suggestion: ContentSuggestion): void {
    // Get the section and field path
    const { section, field } = suggestion;
    
    // Split the field path into components
    const fieldPath = field.split('.');
    
    // Navigate to the object containing the field
    let current = data;
    let parentField = '';
    let finalField = fieldPath[0];
    
    // Navigate the path except for the final element
    for (let i = 0; i < fieldPath.length - 1; i++) {
      const pathPart = fieldPath[i];
      
      // If the path doesn't exist yet, create it
      if (!current[pathPart]) {
        current[pathPart] = {};
      }
      
      // Move to the next level
      if (i === fieldPath.length - 2) {
        parentField = pathPart;
      }
      
      current = current[pathPart];
      finalField = fieldPath[i + 1];
    }
    
    // Update the value
    current[finalField] = suggestion.suggestedValue;
  }
  
  /**
   * Apply a validation fix to the data
   */
  private applyValidationFix(data: any, validation: ValidationResult): void {
    if (!validation.suggestedFix) return;
    
    const { section, field } = validation;
    
    if (!field) {
      // If no field is specified, we can't apply the fix
      return;
    }
    
    // Split the field path into components
    const fieldPath = field.split('.');
    
    // Navigate to the object containing the field
    let current = data;
    
    // Navigate the path except for the final element
    for (let i = 0; i < fieldPath.length - 1; i++) {
      const pathPart = fieldPath[i];
      
      // If the path doesn't exist yet, create it
      if (!current[pathPart]) {
        current[pathPart] = {};
      }
      
      // Move to the next level
      current = current[pathPart];
    }
    
    // Get the final field name
    const finalField = fieldPath[fieldPath.length - 1];
    
    // Apply the fix based on the action
    const { action, value } = validation.suggestedFix;
    
    if (action === 'add') {
      // Add to an array
      if (Array.isArray(current[finalField])) {
        current[finalField].push(value);
      } else {
        current[finalField] = [value];
      }
    } else if (action === 'change') {
      // Change a value
      current[finalField] = value;
    } else if (action === 'verify') {
      // For verification, we don't automatically change values
      // This would be handled by the UI
    }
  }
}