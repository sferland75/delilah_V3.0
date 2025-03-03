import React from 'react';
import { render as rtlRender, screen, act } from '@testing-library/react';
import { FormProvider, useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { functionalStatusSchema, defaultFormState } from '../../schema';
import { type FormState } from '../../types';

interface FormWrapperProps {
  children: React.ReactNode;
  initialValues?: Partial<FormState>;
  formRef?: React.RefObject<UseFormReturn<FormState>>;
}

function FormWrapper({ 
  children, 
  formRef,
  initialValues = {} 
}: FormWrapperProps) {
  const formValues = {
    ...defaultFormState,
    ...initialValues
  };

  const methods = useForm<FormState>({
    defaultValues: formValues,
    mode: 'onBlur',
    criteriaMode: 'firstError',
    shouldUnregister: false,
    resolver: async (data, context, options) => {
      // Validate with schema
      const result = await functionalStatusSchema.safeParseAsync(data);
      if (result.success) {
        return {
          values: result.data,
          errors: {}
        };
      } else {
        const errors = {};
        result.error.errors.forEach(error => {
          const path = error.path.join('.');
          if (!errors[path]) {
            errors[path] = {
              type: error.code,
              message: error.message
            };
          }
        });
        return {
          values: {},
          errors
        };
      }
    }
  });

  React.useEffect(() => {
    if (formRef) {
      formRef.current = methods;
    }
  }, [formRef, methods]);

  return <FormProvider {...methods}>{children}</FormProvider>;
}

interface CustomRenderOptions {
  initialValues?: Partial<FormState>;
  formRef?: React.RefObject<UseFormReturn<FormState>>;
}

function render(
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
) {
  const formRef = options.formRef || React.createRef<UseFormReturn<FormState>>();
  
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <FormWrapper 
      initialValues={options.initialValues} 
      formRef={formRef}
    >
      {children}
    </FormWrapper>
  );

  return {
    ...rtlRender(ui, { wrapper: Wrapper }),
    formRef
  };
}

async function setFieldValue(
  formRef: React.RefObject<UseFormReturn<FormState>>,
  name: string, 
  value: any
) {
  if (!formRef.current) return;

  await act(async () => {
    formRef.current?.setValue(name, value, {
      shouldDirty: true,
      shouldTouch: true
    });
    // Wait for validation
    await new Promise(resolve => setTimeout(resolve, 0));
  });
}

async function validateForm(formRef: React.RefObject<UseFormReturn<FormState>>) {
  if (!formRef.current) return false;

  let isValid = false;
  await act(async () => {
    isValid = await formRef.current?.trigger();
    // Wait for validation
    await new Promise(resolve => setTimeout(resolve, 0));
  });
  return isValid;
}

async function waitForFormState(formRef: React.RefObject<UseFormReturn<FormState>>) {
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
  });
}

export {
  render,
  screen,
  act,
  setFieldValue,
  validateForm,
  waitForFormState
};