export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface PreExistingCondition {
  condition: string;
  diagnosisDate?: string;
  status: 'active' | 'resolved' | 'managed';
  details: string;
}

export interface Surgery {
  procedure: string;
  date: string;
  outcome: string;
  surgeon?: string;
  facility?: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  prescribedFor: string;
  prescribedBy?: string;
  startDate?: string;
  endDate?: string;
  status: 'current' | 'discontinued' | 'as-needed';
}

export interface InjuryEvent {
  date: string;
  time?: string;
  position: string;
  impactType: string;
  circumstance: string;
  preparedForImpact: string;
  immediateSymptoms: string;
  immediateResponse: string;
  vehicleDamage: string;
  subsequentCare: string;
}

export interface Treatment {
  provider: string;
  type: string;
  facility: string;
  startDate: string;
  frequency: string;
  status: 'ongoing' | 'completed' | 'planned';
  notes: string;
}

export interface MedicalHistory {
  preExistingConditions: PreExistingCondition[];
  surgeries: Surgery[];
  familyHistory: string;
  allergies: string[];
  injury: InjuryEvent;
  currentMedications: Medication[];
  currentTreatments: Treatment[];
}

// View configuration
export interface ViewConfig {
  mode: 'edit' | 'view';
  activeTab: 'preExisting' | 'injury' | 'treatment' | 'medications';
}

// Form state
export interface FormState {
  data: MedicalHistory;
  config: ViewConfig;
  isDirty: boolean;
  isValid: boolean;
}