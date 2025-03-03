// Export the legacy components for backward compatibility
export { SymptomsAssessment } from './components/SymptomsAssessment';
export type { Symptoms } from './schema.updated';
export { symptomsSchema } from './schema.updated';

// Export the updated components
export { SymptomsAssessmentUpdated } from './components/SymptomsAssessment.updated';
export type { 
  SymptomsUpdated, 
  PhysicalSymptom, 
  CognitiveSymptom, 
  EmotionalSymptom 
} from './schema.updated';
export { 
  symptomsSchemaUpdated, 
  migrateToUpdatedSchema, 
  migrateToLegacySchema 
} from './schema.updated';