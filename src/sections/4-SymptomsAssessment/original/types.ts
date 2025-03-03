export interface SymptomsFormState {
  general: {
    notes: string;
  };
  physical: Array<{
    location: string;
    type: string;
    intensity: string;
    description: string;
    frequency: string;
  }>;
  cognitive: Array<{
    type: string;
    description: string;
    impact: string;
    management: string;
    frequency: string;
  }>;
  emotional: Array<{
    type: string;
    impact: string;
    management: string;
    description: string;
    frequency: string;
  }>;
}