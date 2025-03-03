/**
 * Symptoms Schema Migration Utility
 * 
 * This utility provides functions to migrate between the legacy and updated symptoms schema.
 * It's designed to handle the transition from single physical/cognitive symptoms to arrays of multiple symptoms.
 */

import { 
  Symptoms, 
  SymptomsUpdated, 
  migrateToUpdatedSchema,
  migrateToLegacySchema
} from '@/sections/4-SymptomsAssessment/schema.updated';

/**
 * Migrates data from legacy schema to updated schema with support for multiple symptoms
 */
export function migrateSymptomsToUpdated(legacyData: any): SymptomsUpdated {
  try {
    // Validate that the input has the expected structure
    if (!legacyData || typeof legacyData !== 'object') {
      console.error('Invalid symptoms data format for migration', legacyData);
      throw new Error('Invalid symptoms data format');
    }

    // Handle the case where data might already be in the updated format
    if (Array.isArray(legacyData.physical) && Array.isArray(legacyData.cognitive)) {
      return legacyData as SymptomsUpdated;
    }

    // Use the migration function from schema.updated.ts
    return migrateToUpdatedSchema(legacyData as Symptoms);
  } catch (error) {
    console.error('Error migrating symptoms data to updated schema:', error);
    
    // Return a default structure if migration fails
    return {
      general: {
        notes: legacyData?.general?.notes || ''
      },
      physical: [
        {
          id: '1',
          location: '',
          intensity: '',
          description: '',
          frequency: '',
          duration: '',
          aggravating: [],
          alleviating: []
        }
      ],
      cognitive: [
        {
          id: '1',
          type: '',
          impact: '',
          management: '',
          frequency: '',
          triggers: [],
          coping: []
        }
      ],
      emotional: []
    };
  }
}

/**
 * Migrates data from updated schema to legacy schema
 * This is useful for maintaining compatibility with existing systems during the transition period.
 */
export function migrateSymptomsToLegacy(updatedData: any): Symptoms {
  try {
    // Validate that the input has the expected structure
    if (!updatedData || typeof updatedData !== 'object') {
      console.error('Invalid symptoms data format for migration', updatedData);
      throw new Error('Invalid symptoms data format');
    }

    // Handle the case where data might already be in the legacy format
    if (!Array.isArray(updatedData.physical) && !Array.isArray(updatedData.cognitive)) {
      return updatedData as Symptoms;
    }

    // Use the migration function from schema.updated.ts
    return migrateToLegacySchema(updatedData as SymptomsUpdated);
  } catch (error) {
    console.error('Error migrating symptoms data to legacy schema:', error);
    
    // Return a default structure if migration fails
    return {
      general: {
        notes: updatedData?.general?.notes || ''
      },
      physical: {
        location: '',
        intensity: '',
        description: '',
        frequency: '',
        duration: '',
        aggravating: [],
        alleviating: []
      },
      cognitive: {
        type: '',
        impact: '',
        management: '',
        frequency: '',
        triggers: [],
        coping: []
      },
      emotional: []
    };
  }
}

/**
 * Safely checks if the data is in updated schema format
 */
export function isUpdatedSymptomsSchema(data: any): boolean {
  try {
    return (
      data &&
      typeof data === 'object' &&
      Array.isArray(data.physical) &&
      Array.isArray(data.cognitive)
    );
  } catch (error) {
    return false;
  }
}

/**
 * Bulk migration utility for migrating all patient records
 * @param records Array of patient records containing symptoms data
 */
export function bulkMigrateSymptomsData(records: any[]): any[] {
  return records.map(record => {
    if (record && record.symptoms) {
      return {
        ...record,
        symptoms: migrateSymptomsToUpdated(record.symptoms)
      };
    }
    return record;
  });
}

/**
 * Data integrity verification utility
 * Checks if a symptoms data object is valid according to the updated schema
 */
export function validateSymptomsData(data: any): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  try {
    // Basic structure checks
    if (!data || typeof data !== 'object') {
      errors.push('Invalid symptoms data: not an object');
      return { isValid: false, errors };
    }

    // Check general section
    if (!data.general || typeof data.general !== 'object') {
      errors.push('Missing or invalid general section');
    }

    // Check physical symptoms
    if (!Array.isArray(data.physical)) {
      errors.push('Physical symptoms must be an array');
    } else if (data.physical.length === 0) {
      errors.push('At least one physical symptom is required');
    } else {
      // Check each physical symptom
      data.physical.forEach((symptom, index) => {
        if (!symptom.id) {
          errors.push(`Physical symptom ${index + 1} is missing id`);
        }
        if (!symptom.location) {
          errors.push(`Physical symptom ${index + 1} is missing location`);
        }
        if (!symptom.intensity) {
          errors.push(`Physical symptom ${index + 1} is missing intensity`);
        }
        if (!symptom.description) {
          errors.push(`Physical symptom ${index + 1} is missing description`);
        }
        if (!symptom.frequency) {
          errors.push(`Physical symptom ${index + 1} is missing frequency`);
        }
        if (!symptom.duration) {
          errors.push(`Physical symptom ${index + 1} is missing duration`);
        }
        if (!Array.isArray(symptom.aggravating)) {
          errors.push(`Physical symptom ${index + 1} aggravating factors must be an array`);
        }
        if (!Array.isArray(symptom.alleviating)) {
          errors.push(`Physical symptom ${index + 1} alleviating factors must be an array`);
        }
      });
    }

    // Check cognitive symptoms
    if (!Array.isArray(data.cognitive)) {
      errors.push('Cognitive symptoms must be an array');
    } else if (data.cognitive.length === 0) {
      errors.push('At least one cognitive symptom is required');
    } else {
      // Check each cognitive symptom
      data.cognitive.forEach((symptom, index) => {
        if (!symptom.id) {
          errors.push(`Cognitive symptom ${index + 1} is missing id`);
        }
        if (!symptom.type) {
          errors.push(`Cognitive symptom ${index + 1} is missing type`);
        }
        if (!symptom.impact) {
          errors.push(`Cognitive symptom ${index + 1} is missing impact`);
        }
        if (!symptom.frequency) {
          errors.push(`Cognitive symptom ${index + 1} is missing frequency`);
        }
        if (!Array.isArray(symptom.triggers)) {
          errors.push(`Cognitive symptom ${index + 1} triggers must be an array`);
        }
        if (!Array.isArray(symptom.coping)) {
          errors.push(`Cognitive symptom ${index + 1} coping strategies must be an array`);
        }
      });
    }

    // Check emotional symptoms
    if (!Array.isArray(data.emotional)) {
      errors.push('Emotional symptoms must be an array');
    } else {
      // Check each emotional symptom
      data.emotional.forEach((symptom, index) => {
        if (!symptom.type) {
          errors.push(`Emotional symptom ${index + 1} is missing type`);
        }
        if (!symptom.severity) {
          errors.push(`Emotional symptom ${index + 1} is missing severity`);
        }
        if (!symptom.frequency) {
          errors.push(`Emotional symptom ${index + 1} is missing frequency`);
        }
        if (!symptom.impact) {
          errors.push(`Emotional symptom ${index + 1} is missing impact`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  } catch (error) {
    errors.push(`Validation error: ${error instanceof Error ? error.message : String(error)}`);
    return {
      isValid: false,
      errors
    };
  }
}

/**
 * Creates a diagnostic report about data migration status
 * @param data The symptoms data to diagnose
 */
export function createMigrationDiagnosticReport(data: any): {
  originalFormat: 'legacy' | 'updated' | 'unknown';
  migrationRequired: boolean;
  migrationPossible: boolean;
  diagnosticInfo: Record<string, any>;
  recommendation: string;
} {
  let originalFormat: 'legacy' | 'updated' | 'unknown' = 'unknown';
  let migrationRequired = false;
  let migrationPossible = true;
  const diagnosticInfo: Record<string, any> = {};

  try {
    // Check if data exists
    if (!data || typeof data !== 'object') {
      return {
        originalFormat: 'unknown',
        migrationRequired: false,
        migrationPossible: false,
        diagnosticInfo: { error: 'No valid data provided' },
        recommendation: 'Unable to migrate: no valid data provided'
      };
    }

    // Determine original format
    if (data.physical && data.cognitive) {
      if (Array.isArray(data.physical) && Array.isArray(data.cognitive)) {
        originalFormat = 'updated';
        migrationRequired = false;
      } else if (typeof data.physical === 'object' && typeof data.cognitive === 'object') {
        originalFormat = 'legacy';
        migrationRequired = true;
      }
    }

    // Check for data integrity
    diagnosticInfo.hasPhysicalData = originalFormat === 'legacy' 
      ? Object.keys(data.physical || {}).length > 0
      : (data.physical || []).length > 0;
      
    diagnosticInfo.hasCognitiveData = originalFormat === 'legacy'
      ? Object.keys(data.cognitive || {}).length > 0
      : (data.cognitive || []).length > 0;
      
    diagnosticInfo.hasEmotionalData = (data.emotional || []).length > 0;
    
    // Test migration for legacy data
    if (originalFormat === 'legacy') {
      try {
        const testMigration = migrateToUpdatedSchema(data as Symptoms);
        const validationResult = validateSymptomsData(testMigration);
        diagnosticInfo.migrationTestResult = validationResult.isValid ? 'success' : 'failed';
        diagnosticInfo.migrationErrors = validationResult.errors;
        migrationPossible = validationResult.isValid;
      } catch (error) {
        diagnosticInfo.migrationTestResult = 'error';
        diagnosticInfo.migrationError = error instanceof Error ? error.message : String(error);
        migrationPossible = false;
      }
    }

    // Generate recommendation
    let recommendation = '';
    if (originalFormat === 'unknown') {
      recommendation = 'Cannot determine data format. Manual intervention required.';
    } else if (originalFormat === 'updated') {
      recommendation = 'Data is already in updated format. No migration needed.';
    } else if (migrationPossible) {
      recommendation = 'Data is in legacy format and can be safely migrated to the updated schema.';
    } else {
      recommendation = 'Data is in legacy format but has issues that prevent safe migration. Review diagnostic information.';
    }

    return {
      originalFormat,
      migrationRequired,
      migrationPossible,
      diagnosticInfo,
      recommendation
    };
  } catch (error) {
    return {
      originalFormat: 'unknown',
      migrationRequired: false,
      migrationPossible: false,
      diagnosticInfo: { error: error instanceof Error ? error.message : String(error) },
      recommendation: 'Error during diagnostic analysis. Manual intervention required.'
    };
  }
}
