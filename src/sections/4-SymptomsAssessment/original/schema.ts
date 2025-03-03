import { z } from 'zod';

const severityEnum = z.enum(['None', 'Mild', 'Moderate', 'Severe', 'Very Severe']);
const frequencyEnum = z.enum(['Rarely', 'Sometimes', 'Often', 'Most of the time', 'Constantly']);

const physicalSymptomSchema = z.object({
  location: z.string().min(1, 'Location is required'),
  painType: z.enum([
    'Aching', 'Burning', 'Sharp', 'Stabbing', 'Throbbing',
    'Tingling', 'Numbness', 'Stiffness', 'Other'
  ]),
  severity: severityEnum,
  frequency: frequencyEnum,
  aggravating: z.string(),
  relieving: z.string()
});

const cognitiveSymptomSchema = z.object({
  symptom: z.enum([
    'Attention', 'Memory', 'Processing Speed', 'Executive Function',
    'Language', 'Learning', 'Problem Solving', 'Other'
  ]),
  severity: severityEnum,
  frequency: frequencyEnum,
  impact: z.string(),
  management: z.string()
});

const emotionalSymptomSchema = z.object({
  symptom: z.enum([
    'Anxiety', 'Depression', 'Irritability', 'Mood Swings',
    'Stress', 'Emotional Regulation', 'Social Withdrawal', 'Other'
  ]),
  severity: severityEnum,
  frequency: frequencyEnum,
  impact: z.string(),
  management: z.string()
});

export const symptomsSchema = z.object({
  generalNotes: z.string(),
  physical: z.array(physicalSymptomSchema),
  cognitive: z.array(cognitiveSymptomSchema),
  emotional: z.array(emotionalSymptomSchema)
});

export const defaultSymptomsState = {
  generalNotes: '',
  physical: [],
  cognitive: [],
  emotional: []
};