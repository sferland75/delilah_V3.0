import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

export const TestProvider = ({ children }) => {
  const methods = useForm();
  return React.createElement(FormProvider, { ...methods }, children);
};