import { z } from 'zod';

// Define possible dwelling types
export const dwellingTypes = ['house', 'apartment', 'condo', 'townhouse', 'mobile_home', 'other'] as const;
export const flooringTypes = ['carpet', 'hardwood', 'tile', 'vinyl', 'laminate', 'concrete', 'other'] as const;
export const outdoorSpaceTypes = ['garden', 'balcony', 'yard', 'patio', 'deck', 'porch', 'other'] as const;
export const accessibilityAreaTypes = ['entrance', 'bathroom', 'kitchen', 'bedroom', 'hallway', 'stairs', 'other'] as const;
export const safetyHazardTypes = ['tripping', 'falling', 'electrical', 'fire', 'storage', 'clutter', 'lighting', 'other'] as const;
export const independenceLevels = ['independent', 'supervision', 'minimal_assistance', 'moderate_assistance', 'maximal_assistance', 'dependent', 'not_applicable'] as const;

// Schema for accessibility items
const accessibilityIssueSchema = z.object({
  id: z.string(),
  area: z.enum(accessibilityAreaTypes),
  description: z.string().min(1, "Description is required"),
  impactLevel: z.string().min(1, "Impact level is required"),
  currentSolutions: z.string().optional(),
  recommendations: z.string().optional(),
  isResolvedWithAssistance: z.boolean().default(false)
});

// Schema for assistive devices/adaptive equipment
const adaptiveEquipmentSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  location: z.string().min(1, "Location is required"),
  purpose: z.string().min(1, "Purpose is required"),
  effectiveness: z.string().min(1, "Effectiveness rating is required"),
  isOwned: z.boolean().default(false),
  isRecommended: z.boolean().default(false),
  notes: z.string().optional()
});

// Schema for interior environment details
const interiorEnvironmentSchema = z.object({
  flooring: z.object({
    types: z.array(z.enum(flooringTypes)),
    concerns: z.string().optional(),
    notes: z.string().optional()
  }),
  lighting: z.object({
    isAdequate: z.boolean().default(true),
    concerns: z.string().optional()
  }),
  temperature: z.object({
    isControlled: z.boolean().default(true),
    concerns: z.string().optional()
  }),
  noise: z.object({
    isDisruptive: z.boolean().default(false),
    concerns: z.string().optional()
  }),
  generalNotes: z.string().optional()
});

// Schema for safety assessment
const safetyAssessmentSchema = z.object({
  hazards: z.array(z.object({
    id: z.string(),
    type: z.enum(safetyHazardTypes),
    location: z.string().min(1, "Location is required"),
    description: z.string().min(1, "Description is required"),
    riskLevel: z.string().min(1, "Risk level is required"),
    mitigationPlan: z.string().optional()
  })),
  modifications: z.array(z.string()),
  recommendations: z.array(z.string()),
  emergencyPlan: z.object({
    exists: z.boolean().default(false),
    isAdequate: z.boolean().default(false),
    improvements: z.string().optional()
  }),
  generalNotes: z.string().optional()
});

// Complete schema for the entire environmental assessment
export const environmentalAssessmentSchema = z.object({
  dwelling: z.object({
    type: z.enum(dwellingTypes),
    floors: z.number().min(1).max(99),
    rooms: z.object({
      bedrooms: z.number().min(0),
      bathrooms: z.number().min(0),
      kitchen: z.boolean().default(true),
      livingRoom: z.boolean().default(true),
      other: z.array(z.string())
    }),
    generalNotes: z.string().optional()
  }),
  interiorEnvironment: interiorEnvironmentSchema,
  accessibilityIssues: z.object({
    issues: z.array(accessibilityIssueSchema).default([]),
    generalNotes: z.string().optional()
  }),
  adaptiveEquipment: z.object({
    equipment: z.array(adaptiveEquipmentSchema).default([]),
    generalNotes: z.string().optional()
  }),
  outdoor: z.object({
    hasSpace: z.boolean().default(false),
    types: z.array(z.enum(outdoorSpaceTypes)),
    access: z.object({
      isAccessible: z.boolean().default(true),
      barriers: z.string().optional(),
      recommendations: z.string().optional()
    }),
    generalNotes: z.string().optional()
  }),
  safety: safetyAssessmentSchema
});

// Default values for the form
export const defaultFormState = {
  dwelling: {
    type: 'house',
    floors: 1,
    rooms: {
      bedrooms: 1,
      bathrooms: 1,
      kitchen: true,
      livingRoom: true,
      other: []
    },
    generalNotes: ''
  },
  interiorEnvironment: {
    flooring: {
      types: [],
      concerns: '',
      notes: ''
    },
    lighting: {
      isAdequate: true,
      concerns: ''
    },
    temperature: {
      isControlled: true,
      concerns: ''
    },
    noise: {
      isDisruptive: false,
      concerns: ''
    },
    generalNotes: ''
  },
  accessibilityIssues: {
    issues: [],
    generalNotes: ''
  },
  adaptiveEquipment: {
    equipment: [],
    generalNotes: ''
  },
  outdoor: {
    hasSpace: false,
    types: [],
    access: {
      isAccessible: true,
      barriers: '',
      recommendations: ''
    },
    generalNotes: ''
  },
  safety: {
    hazards: [],
    modifications: [],
    recommendations: [],
    emergencyPlan: {
      exists: false,
      isAdequate: false,
      improvements: ''
    },
    generalNotes: ''
  }
};

// TypeScript type derived from schema
export type FormState = z.infer<typeof environmentalAssessmentSchema>;
