import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { SymptomsFormState } from '../../types';
import { symptomsSchema, defaultSymptomsState } from '../../schema';

export const mockPhysicalSymptom = {
  location: 'Lower back',
  painType: 'Aching' as const,
  severity: 'Moderate' as const,
  frequency: 'Often' as const,
  aggravating: 'Prolonged sitting',
  relieving: 'Stretching exercises'
};

export const mockCognitiveSymptom = {
  symptom: 'Memory' as const,
  severity: 'Mild' as const,
  frequency: 'Sometimes' as const,
  impact: 'Difficulty remembering appointments',
  management: 'Using a calendar app'
};

export const mockEmotionalSymptom = {
  symptom: 'Anxiety' as const,
  severity: 'Moderate' as const,
  frequency: 'Often' as const,
  impact: 'Difficulty in social situations',
  management: 'Deep breathing exercises'
};

function Wrapper({ children }: { children: React.ReactNode }) {
  const methods = useForm<SymptomsFormState>({
    defaultValues: defaultSymptomsState
  });

  return React.createElement(FormProvider, { ...methods }, children);
}

export function render(ui: React.ReactElement, options = {}) {
  return rtlRender(ui, { wrapper: Wrapper, ...options });
}

export * from '@testing-library/react';