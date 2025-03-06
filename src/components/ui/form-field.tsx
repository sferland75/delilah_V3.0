"use client"

import React from "react";
import { Controller, useFormContext } from "react-hook-form";

type FormFieldProps = {
  name: string;
  control?: any;
  render: (props: { field: any }) => React.ReactNode;
};

// This component creates a wrapper for react-hook-form's Controller
// It allows for consistent field handling across the application
export const FormField = ({ name, control, render }: FormFieldProps) => {
  const formContext = useFormContext();
  const fieldControl = control || formContext?.control;

  if (!fieldControl) {
    console.error("FormField must be used within a FormProvider or be passed a control prop");
    return null;
  }

  return (
    <Controller
      name={name}
      control={fieldControl}
      render={({ field, fieldState }) => render({ field })}
    />
  );
};
