'use client';

// This file provides utility UI components specific to forms for the Functional Status section

import React from 'react';
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

/**
 * A custom select control that uses native HTML select elements
 * This avoids the issues with shadcn/ui Select component
 */
export const NativeSelect = React.forwardRef(({ className, value, onChange, children, ...props }, ref) => {
  return (
    <select
      className={`w-full rounded-md border border-input bg-background px-3 py-2 text-sm ${className || ''}`}
      value={value || ''}
      onChange={onChange}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  );
});

NativeSelect.displayName = 'NativeSelect';

/**
 * A checkbox field with label and description
 */
export const CheckboxField = ({ control, name, label, description, onChange }) => {
  return (
    <FormItem className="flex flex-row items-center space-x-2">
      <FormControl>
        <Checkbox
          checked={control.value || false}
          onCheckedChange={onChange}
        />
      </FormControl>
      <div className="space-y-0.5">
        <FormLabel className="text-lg font-semibold">
          {label}
        </FormLabel>
        {description && (
          <FormDescription>
            {description}
          </FormDescription>
        )}
      </div>
    </FormItem>
  );
};

/**
 * A number input with degree symbol
 */
export const DegreeInput = ({ value, onChange, placeholder = "Degrees", min = 0, max = 180, className = "" }) => {
  return (
    <div className="flex items-center space-x-2">
      <Input
        type="number"
        placeholder={placeholder}
        min={min}
        max={max}
        value={value || ''}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
        className={`w-full ${className}`}
      />
      <span className="text-sm">°</span>
    </div>
  );
};

/**
 * A select field for limitation types
 */
export const LimitationTypeSelect = ({ value, onChange }) => {
  return (
    <NativeSelect value={value} onChange={onChange}>
      <option value="">None</option>
      <option value="pain">Pain Limited</option>
      <option value="mechanical">Mechanically Limited</option>
      <option value="weakness">Weakness Limited</option>
      <option value="apprehension">Apprehension Limited</option>
    </NativeSelect>
  );
};
