import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { CascadeTestRunner } from '../../../../test/cascade/CascadeTestRunner';

export interface SymptomsState {
  cognitive?: {
    symptoms: string[];
    description?: string;
  };
  physical?: {
    locations: Array<{ x: number; y: number }>;
    type?: string;
  };
  emotional?: {
    symptoms: string[];
    intensity?: number;
  };
}

const defaultFormValues = {
  cognitive: { symptoms: [] },
  physical: { locations: [] },
  emotional: { symptoms: [] },
  general: { notes: '' }
};

export const SymptomsContext = React.createContext<{
  state: SymptomsState;
  setState: React.Dispatch<React.SetStateAction<SymptomsState>>;
}>({
  state: {},
  setState: () => {}
});

const symptomsConfig = {
  steps: ['cognitive', 'physical', 'emotional'],
  required: ['physical'],
  dependencies: {
    emotional: ['cognitive'] // Emotional requires cognitive first
  }
};

export const setupCascadeTest = () => {
  const runner = new CascadeTestRunner(symptomsConfig);

  const TestWrapper = ({ children }: { children: React.ReactNode }) => {
    const [state, setState] = React.useState<SymptomsState>({});
    const methods = useForm({
      defaultValues: defaultFormValues,
      mode: 'onChange'
    });
    
    return (
      <SymptomsContext.Provider value={{ state, setState }}>
        <FormProvider {...methods}>
          {children}
        </FormProvider>
      </SymptomsContext.Provider>
    );
  };

  return { runner, TestWrapper };
};