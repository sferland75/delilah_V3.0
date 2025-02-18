import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';

function render(ui: React.ReactElement, { formValues = {}, ...options } = {}) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    const methods = useForm({
      defaultValues: formValues
    });
    return <FormProvider {...methods}>{children}</FormProvider>;
  }
  return rtlRender(ui, { wrapper: Wrapper, ...options });
}

export * from '@testing-library/react';
export { render };