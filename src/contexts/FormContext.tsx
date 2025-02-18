import React, { createContext, useContext } from 'react';
import { FormProvider as RHFProvider } from 'react-hook-form';

export const FormContext = createContext({});

export const FormProvider = ({ children }: { children: React.ReactNode }) => {
  return <RHFProvider>{children}</RHFProvider>;
};

export const useFormContext = () => useContext(FormContext);