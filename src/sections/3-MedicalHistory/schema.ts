import { z } from 'zod';

// Helper schemas
const emergencyContactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(10, 'Valid phone number required'),
  relationship: z.string().min(1, 'Relationship is required')
});

const preExistingConditionSchema = z.object({
  condition: z.string().min(1, 'Condition name is required'),
  diagnosisDate: z.string().optional(),
  status: z.enum(['active', 'resolved', 'managed']),
  details: z.string().min(1, 'Details are required')
});

const surgerySchema = z.object({
  procedure: z.string().min(1, 'Procedure name is required'),
  date: z.string().min(1, 'Date is required'),
  outcome: z.string().min(1, 'Outcome is required'),
  surgeon: z.string().optional(),
  facility: z.string().optional()
});

const medicationSchema = z.object({
  name: z.string().min(1, 'Medication name is required'),
  dosage: z.string().min(1, 'Dosage is required'),
  frequency: z.string().min(1, 'Frequency is required'),
  prescribedFor: z.string().min(1, 'Prescription reason is required'),
  prescribedBy: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.enum(['current', 'discontinued', 'as-needed'])
});

const injuryEventSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  time: z.string().optional(),
  position: z.string().min(1, 'Position is required'),
  impactType: z.string().min(1, 'Impact type is required'),
  circumstance: z.string().min(1, 'Circumstances are required'),
  preparedForImpact: z.string().min(1, 'Impact preparation details required'),
  immediateSymptoms: z.string().min(1, 'Immediate symptoms are required'),
  immediateResponse: z.string().min(1, 'Immediate response details required'),
  vehicleDamage: z.string().min(1, 'Vehicle damage details required'),
  subsequentCare: z.string().min(1, 'Subsequent care details required')
});

const treatmentSchema = z.object({
  provider: z.string().min(1, 'Provider name is required'),
  type: z.string().min(1, 'Treatment type is required'),
  facility: z.string().min(1, 'Facility name is required'),
  startDate: z.string().min(1, 'Start date is required'),
  frequency: z.string().min(1, 'Frequency is required'),
  status: z.enum(['ongoing', 'completed', 'planned']),
  notes: z.string().min(1, 'Treatment notes are required')
});

// Main schema
export const medicalHistorySchema = z.object({
  preExistingConditions: z.array(preExistingConditionSchema),
  surgeries: z.array(surgerySchema),
  familyHistory: z.string().min(1, 'Family history is required'),
  allergies: z.array(z.string()),
  injury: injuryEventSchema,
  currentMedications: z.array(medicationSchema),
  currentTreatments: z.array(treatmentSchema)
});

// View configuration schema
export const viewConfigSchema = z.object({
  mode: z.enum(['edit', 'view']),
  activeTab: z.enum(['preExisting', 'injury', 'treatment', 'medications']),
});

// Form state schema
export const formStateSchema = z.object({
  data: medicalHistorySchema,
  config: viewConfigSchema,
  isDirty: z.boolean(),
  isValid: z.boolean()
});

// Default values
export const defaultMedicalHistory = {
  preExistingConditions: [],
  surgeries: [],
  familyHistory: '',
  allergies: [],
  injury: {
    date: '',
    position: '',
    impactType: '',
    circumstance: '',
    preparedForImpact: '',
    immediateSymptoms: '',
    immediateResponse: '',
    vehicleDamage: '',
    subsequentCare: ''
  },
  currentMedications: [],
  currentTreatments: []
};

export const defaultViewConfig = {
  mode: 'edit' as const,
  activeTab: 'preExisting' as const
};

export const defaultFormState = {
  data: defaultMedicalHistory,
  config: defaultViewConfig,
  isDirty: false,
  isValid: false
};