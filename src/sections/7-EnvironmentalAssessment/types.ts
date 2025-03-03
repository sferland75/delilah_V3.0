import { z } from 'zod';
import { environmentalAssessmentSchema } from './schema';

// Export the main form state type
export type FormState = z.infer<typeof environmentalAssessmentSchema>;

// Accessibility Issue type
export interface AccessibilityIssue {
  id: string;
  area: string;
  description: string;
  impactLevel: string;
  currentSolutions?: string;
  recommendations?: string;
  isResolvedWithAssistance: boolean;
}

// Adaptive Equipment type
export interface AdaptiveEquipment {
  id: string;
  name: string;
  type: string;
  location: string;
  purpose: string;
  effectiveness: string;
  isOwned: boolean;
  isRecommended: boolean;
  notes?: string;
}

// Safety Hazard type
export interface SafetyHazard {
  id: string;
  type: string;
  location: string;
  description: string;
  riskLevel: string;
  mitigationPlan?: string;
}
