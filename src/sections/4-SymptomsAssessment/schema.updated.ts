import { z } from 'zod';

// Common structure for all physical symptoms
const physicalSymptomSchema = z.object({
  id: z.string(),
  location: z.string().min(1, "Location is required"),
  intensity: z.string().min(1, "Intensity rating is required"),
  description: z.string().min(1, "Description is required"),
  frequency: z.string().min(1, "Frequency is required"),
  duration: z.string().min(1, "Duration is required"),
  aggravating: z.array(z.string()),
  alleviating: z.array(z.string())
});

// Common structure for all cognitive symptoms
const cognitiveSymptomSchema = z.object({
  id: z.string(),
  type: z.string().min(1, "Type of cognitive issue is required"),
  impact: z.string().min(1, "Impact description is required"),
  management: z.string(),
  frequency: z.string().min(1, "Frequency is required"),
  triggers: z.array(z.string()),
  coping: z.array(z.string())
});

// Emotional symptom structure (already an array in the original schema)
const emotionalSymptomSchema = z.object({
  type: z.string(),
  severity: z.string(),
  frequency: z.string(),
  impact: z.string(),
  management: z.string()
});

// Updated symptoms schema with arrays for physical and cognitive symptoms
export const symptomsSchemaUpdated = z.object({
  general: z.object({
    notes: z.string(),
  }),
  physical: z.array(physicalSymptomSchema).min(1, "At least one physical symptom is required"),
  cognitive: z.array(cognitiveSymptomSchema).min(1, "At least one cognitive symptom is required"),
  emotional: z.array(emotionalSymptomSchema)
});

export type PhysicalSymptom = z.infer<typeof physicalSymptomSchema>;
export type CognitiveSymptom = z.infer<typeof cognitiveSymptomSchema>;
export type EmotionalSymptom = z.infer<typeof emotionalSymptomSchema>;
export type SymptomsUpdated = z.infer<typeof symptomsSchemaUpdated>;

// Legacy schema type for backward compatibility
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

// Migration utility function to convert from legacy schema to new schema
export function migrateToUpdatedSchema(legacyData: Symptoms): SymptomsUpdated {
  return {
    general: legacyData.general,
    physical: [
      {
        id: "1",
        ...legacyData.physical
      }
    ],
    cognitive: [
      {
        id: "1",
        ...legacyData.cognitive
      }
    ],
    emotional: legacyData.emotional
  };
}

// Migration utility function to convert from new schema to legacy schema (for backward compatibility)
export function migrateToLegacySchema(updatedData: SymptomsUpdated): Symptoms {
  return {
    general: updatedData.general,
    physical: updatedData.physical[0] ? {
      location: updatedData.physical[0].location,
      intensity: updatedData.physical[0].intensity,
      description: updatedData.physical[0].description,
      frequency: updatedData.physical[0].frequency,
      duration: updatedData.physical[0].duration,
      aggravating: updatedData.physical[0].aggravating,
      alleviating: updatedData.physical[0].alleviating
    } : {
      location: "",
      intensity: "",
      description: "",
      frequency: "",
      duration: "",
      aggravating: [],
      alleviating: []
    },
    cognitive: updatedData.cognitive[0] ? {
      type: updatedData.cognitive[0].type,
      impact: updatedData.cognitive[0].impact,
      management: updatedData.cognitive[0].management,
      frequency: updatedData.cognitive[0].frequency,
      triggers: updatedData.cognitive[0].triggers,
      coping: updatedData.cognitive[0].coping
    } : {
      type: "",
      impact: "",
      management: "",
      frequency: "",
      triggers: [],
      coping: []
    },
    emotional: updatedData.emotional
  };
}
