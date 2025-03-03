import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { SymptomsFormState } from '../../types';
import type { ReactElement } from 'react';

const FormWrapper = ({ children, defaultValues = {} }: { children: ReactElement; defaultValues?: Partial<SymptomsFormState> }) => {
  const methods = useForm<SymptomsFormState>({
    defaultValues: {
      general: { notes: '' },
      physical: [],
      cognitive: [],
      emotional: [],
      ...defaultValues
    }
  });

  return React.createElement(FormProvider, { ...methods }, children);
};

const customRender = (
  ui: ReactElement,
  { defaultValues = {}, ...options } = {}
) => {
  const Wrapper = ({ children }: { children: ReactElement }) => 
    React.createElement(FormWrapper, { defaultValues }, children);

  return rtlRender(ui, { wrapper: Wrapper, ...options });
};

export { customRender as render };
export * from '@testing-library/react';