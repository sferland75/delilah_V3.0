// Export components
export { SymptomsAssessment } from './components/SymptomsAssessment';
export { default as SimpleSymptomsAssessment } from './SimpleSymptomsAssessment';
export { default as SymptomsAssessmentSection } from './SymptomsAssessmentSection';

// Export types and schemas from both schema files for compatibility
export type { Symptoms } from './schema';
export { symptomsSchema } from './schema';

// Also export updated schema
export type { SymptomsUpdated } from './schema.updated';
export { symptomsSchemaUpdated } from './schema.updated';