import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { defaultFormState } from '../schema';

// Custom render function for Medical History components
function render(
  ui: React.ReactElement,
  {
    formValues = defaultFormState,
    ...options
  } = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    const methods = useForm({
      defaultValues: formValues,
      mode: 'onBlur'
    });

    return <FormProvider {...methods}>{children}</FormProvider>;
  }

  return {
    ...rtlRender(ui, { wrapper: Wrapper, ...options }),
  };
}

// Generate test data
export const mockMedicalHistory = {
  preExisting: {
    conditions: [
      { name: 'Hypertension', dateOfOnset: '2020-01-01', notes: 'Controlled with medication' },
      { name: 'Diabetes', dateOfOnset: '2019-06-15', notes: 'Type 2, diet controlled' }
    ],
    surgeries: [
      { procedure: 'Appendectomy', date: '2018-03-20', notes: 'No complications' }
    ]
  },
  injury: {
    details: 'Workplace injury',
    date: '2023-12-01',
    mechanism: 'Slip and fall',
    initialSymptoms: ['Back pain', 'Right leg numbness'],
    workerComp: true,
    claimNumber: 'WC123456'
  },
  treatment: {
    providers: [
      { name: 'Dr. Smith', specialty: 'Orthopedics', facility: 'Main Hospital', startDate: '2023-12-02' }
    ],
    therapies: [
      { type: 'Physical Therapy', frequency: '2x per week', startDate: '2023-12-15', ongoing: true }
    ]
  },
  medications: {
    current: [
      { name: 'Ibuprofen', dosage: '800mg', frequency: 'As needed', startDate: '2023-12-01' }
    ],
    past: []
  },
  config: {
    mode: 'edit',
    activeTab: 'preExisting'
  }
};

export { render };
export * from '@testing-library/react';