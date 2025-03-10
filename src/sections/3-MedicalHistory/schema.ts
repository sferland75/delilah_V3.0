import { z } from 'zod';

// Define schema for pre-existing conditions
const preExistingConditionSchema = z.object({
  condition: z.string().min(1, "Condition name is required"),
  status: z.string().optional(),
  diagnosisDate: z.string().optional(),
  details: z.string().optional(),
});

// Define schema for injury details
const injurySchema = z.object({
  date: z.string().min(1, "Date of injury is required"),
  time: z.string().optional(),
  position: z.string().optional(),
  impactType: z.string().min(1, "Mechanism of injury is required"),
  circumstance: z.string().optional(),
  immediateSymptoms: z.string().min(1, "Immediate symptoms are required"),
  initialTreatment: z.string().optional(),
});

// Define schema for treatment
const treatmentSchema = z.object({
  type: z.string().min(1, "Treatment type is required"),
  provider: z.string().optional(),
  facility: z.string().optional(),
  startDate: z.string().optional(),
  frequency: z.string().optional(),
  status: z.string().optional(),
  notes: z.string().optional(),
});

// Define schema for medications
const medicationSchema = z.object({
  name: z.string().min(1, "Medication name is required"),
  dosage: z.string().optional(),
  frequency: z.string().optional(),
  prescribedFor: z.string().optional(),
  prescribedBy: z.string().optional(),
  status: z.string().optional(),
});

// Define the complete form schema
export const medicalHistorySchema = z.object({
  preExistingConditions: z.array(preExistingConditionSchema).optional(),
  injury: injurySchema.optional(),
  currentTreatments: z.array(treatmentSchema).optional(),
  currentMedications: z.array(medicationSchema).optional(),
});

// Define default values for the form
export const defaultFormState = {
  preExistingConditions: [],
  injury: {
    date: '',
    time: '',
    position: '',
    impactType: '',
    circumstance: '',
    immediateSymptoms: '',
    initialTreatment: ''
  },
  currentTreatments: [],
  currentMedications: []
};

// Export form state type
export type FormState = z.infer<typeof medicalHistorySchema>;