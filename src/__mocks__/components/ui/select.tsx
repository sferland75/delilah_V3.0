import React from 'react';
import { forwardRef } from 'react';

export const Select = forwardRef(({ children, onValueChange, value, name, "aria-labelledby": ariaLabelledBy }: any, ref) => (
  <div 
    ref={ref}
    data-testid="select-container" 
    onChange={onValueChange} 
    value={value}
    role="combobox"
    aria-labelledby={ariaLabelledBy}
    aria-expanded="false"
    aria-controls={`listbox-${name}`}
    aria-haspopup="listbox"
  >
    {children}
  </div>
));

export const SelectTrigger = forwardRef(({ children }: any, ref) => (
  <div ref={ref} data-testid="select-trigger" role="button" tabIndex={0}>
    {children}
  </div>
));

export const SelectValue = forwardRef(({ placeholder }: any, ref) => (
  <span ref={ref} data-testid="select-value">
    {placeholder}
  </span>
));

export const SelectContent = forwardRef(({ children, name }: any, ref) => (
  <div 
    ref={ref} 
    data-testid="select-content" 
    role="listbox"
    id={`listbox-${name}`}
    aria-label={`Select ${name}`}
  >
    {children}
  </div>
));

export const SelectItem = forwardRef(({ value, children }: any, ref) => (
  <div 
    ref={ref}
    data-testid={`select-item-${value}`} 
    data-value={value}
    role="option"
    aria-selected="false"
  >
    {children}
  </div>
));