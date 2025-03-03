import * as React from 'react';
import { render } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';

interface WrapperProps {
  children: React.ReactNode;
}

function Wrapper({ children }: WrapperProps) {
  const methods = useForm();
  return React.createElement(FormProvider, { ...methods }, children);
}

function WrapperWithValues({ children, defaultValues }: WrapperProps & { defaultValues: any }) {
  const methods = useForm({ defaultValues });
  return React.createElement(FormProvider, { ...methods }, children);
}

export function renderWithFormContext(ui: React.ReactElement, defaultValues?: any) {
  if (defaultValues) {
    return render(React.createElement(WrapperWithValues, { defaultValues }, ui));
  }
  return render(React.createElement(Wrapper, null, ui));
}