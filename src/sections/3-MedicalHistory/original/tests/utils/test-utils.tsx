import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { medicalHistorySchema, defaultFormState } from '../../schema';

// Mock icons consistently across all tests
jest.mock('lucide-react', () => ({
  History: () => <div data-testid="icon-history">History Icon</div>,
  Bone: () => <div data-testid="icon-bone">Bone Icon</div>,
  Stethoscope: () => <div data-testid="icon-stethoscope">Stethoscope Icon</div>,
  Pill: () => <div data-testid="icon-pill">Pill Icon</div>
}));

// Mock form persistence
jest.mock('@/hooks/useFormPersistence', () => ({
  useFormPersistence: () => ({})
}));

// Mock zod resolver
jest.mock('@hookform/resolvers/zod', () => ({
  zodResolver: () => async (values: any) => ({ values, errors: {} })
}));

// Base wrapper for form components
function FormWrapper({ children, initialValues = {} }: { 
  children: React.ReactNode;
  initialValues?: any;
}) {
  const methods = useForm({
    defaultValues: {
      ...defaultFormState,
      ...initialValues,
      config: {
        mode: 'edit',
        activeTab: 'preExisting'
      }
    },
    mode: 'onChange'
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
}

// Custom render function with wrapper
const customRender = (
  ui: React.ReactElement,
  { initialValues, ...options }: Omit<RenderOptions, 'wrapper'> & { initialValues?: any } = {}
) => render(ui, { 
  wrapper: (props) => <FormWrapper {...props} initialValues={initialValues} />,
  ...options 
});

// Common test data
export const mockMedicalHistory = {
  preExistingConditions: [{
    condition: "Hypertension",
    diagnosisDate: "2023-01-01",
    status: "managed" as const,
    details: "Under medication"
  }],
  surgeries: [{
    procedure: "Appendectomy",
    date: "2022-06-15",
    outcome: "Successful",
    surgeon: "Dr. Smith",
    facility: "General Hospital"
  }],
  familyHistory: "No significant conditions",
  allergies: ["Penicillin"],
  injury: {
    date: "2024-02-18",
    time: "14:30",
    position: "seated",
    impactType: "rear-end collision",
    circumstance: "Stopped at red light",
    preparedForImpact: "No warning",
    immediateSymptoms: "Neck pain",
    immediateResponse: "Called 911",
    vehicleDamage: "Moderate rear damage",
    subsequentCare: "ER visit"
  },
  currentMedications: [{
    name: "Ibuprofen",
    dosage: "400mg",
    frequency: "as needed",
    prescribedFor: "Pain management",
    prescribedBy: "Dr. Jones",
    startDate: "2024-02-18",
    status: "current" as const
  }],
  currentTreatments: [{
    provider: "Dr. Wilson",
    type: "Physical Therapy",
    facility: "Rehab Center",
    startDate: "2024-02-19",
    frequency: "2x per week",
    status: "ongoing" as const,
    notes: "Progressive improvement"
  }]
};

export * from '@testing-library/react';
export { customRender as render };