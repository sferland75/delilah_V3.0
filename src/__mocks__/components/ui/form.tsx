import React from 'react';

export function Form({ children }: { children: React.ReactNode }) {
  return <form>{children}</form>;
}

export function FormField({ name, control, render }: { 
  name: string;
  control: any;
  render: (props: any) => React.ReactNode;
}) {
  return render({ 
    field: { 
      name,
      id: name,
      value: '',
      onChange: jest.fn(),
      onBlur: jest.fn(),
      ref: jest.fn()
    }
  });
}

export function FormItem({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export function FormLabel({ children }: { children: React.ReactNode }) {
  return <label>{children}</label>;
}

export function FormControl({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export function FormDescription({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export function FormMessage({ children }: { children: React.ReactNode }) {
  return children ? <div role="alert">{children}</div> : null;
}