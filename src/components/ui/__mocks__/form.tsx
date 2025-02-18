import React from 'react';

export const FormField = ({ name, children, render }: any) => {
  return render({
    field: {
      name,
      onChange: jest.fn(),
      onBlur: jest.fn(),
      value: '',
      ref: jest.fn()
    }
  });
};

export const FormItem = ({ children }: any) => (
  <div role="group">{children}</div>
);

export const FormLabel = ({ children }: any) => (
  <label>{children}</label>
);

export const FormControl = ({ children }: any) => children;

export const FormMessage = ({ children }: any) => (
  children ? <div role="alert" aria-live="polite">{children}</div> : null
);

export const FormDescription = ({ children }: any) => children;