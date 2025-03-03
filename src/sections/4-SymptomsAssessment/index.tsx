'use client';

import { SymptomsAssessment } from './components/SymptomsAssessment';
import { SymptomsAssessmentIntegrated } from './components/SymptomsAssessment.integrated';
import { SymptomsAssessmentIntegratedFinal } from './components/SymptomsAssessment.integrated.final';

// Export all versions for backward compatibility
export { SymptomsAssessment, SymptomsAssessmentIntegrated, SymptomsAssessmentIntegratedFinal };

// Default export is the integrated version
export default SymptomsAssessmentIntegrated;