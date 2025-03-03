import { z } from 'zod';
import { functionalStatusSchema } from './schema';

export type FormState = z.infer<typeof functionalStatusSchema>;

// Define types for each assessment component for better type safety
export type RangeOfMotionAssessment = {
  value: number | null;
  notes: string;
};

export type MuscleAssessment = {
  right: number;
  left: number;
  notes: string;
};

export type BergBalanceAssessment = {
  score: number;
  notes: string;
};

export type PosturalToleranceAssessment = {
  duration: string;
  unit: 'minutes' | 'hours';
  notes: string;
};

export type TransferAssessment = {
  independence: 'independent' | 'modified' | 'supervised' | 'dependent';
  notes: string;
};