import React from 'react';
import { render } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import type { ADLData } from '../types';

export const renderWithFormContext = (
  ui: React.ReactElement, 
  initialValues?: Partial<ADLData>
) => {
  const values = initialValues || {};

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    const methods = useForm<ADLData>({
      defaultValues: values as ADLData
    });
    return (
      <FormProvider {...methods}>
        {children}
      </FormProvider>
    );
  };
  
  return render(ui, { wrapper: Wrapper });
};