import { z } from 'zod';

export const symptomsSchema = z.object({
  general: z.object({
    notes: z.string(),
  }),
  physical: z.object({
    location: z.string().min(1, "Location is required"),
    intensity: z.string().min(1, "Intensity rating is required"),
    description: z.string().min(1, "Description is required"),
    frequency: z.string().min(1, "Frequency is required"),
    duration: z.string().min(1, "Duration is required"),
    aggravating: z.array(z.string()),
    alleviating: z.array(z.string())
  }),
  cognitive: z.object({
    type: z.string().min(1, "Type of cognitive issue is required"),
    impact: z.string().min(1, "Impact description is required"),
    management: z.string(),
    frequency: z.string().min(1, "Frequency is required"),
    triggers: z.array(z.string()),
    coping: z.array(z.string())
  }),
  emotional: z.array(
    z.object({
      type: z.string(),
      severity: z.string(),
      frequency: z.string(),
      impact: z.string(),
      management: z.string()
    })
  )
});

export type Symptoms = z.infer<typeof symptomsSchema>;