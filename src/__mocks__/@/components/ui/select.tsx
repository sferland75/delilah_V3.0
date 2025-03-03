import React from 'react';

export const Select = React.forwardRef<HTMLDivElement, any>(({ children, value, onValueChange, className, 'data-testid': testId, ...props }, ref) => (
  <div ref={ref} className={className} data-testid={testId || "select"} {...props}>
    <select value={value} onChange={e => onValueChange?.(e.target.value)}>
      {children}
    </select>
  </div>
));

export const SelectTrigger = React.forwardRef<HTMLButtonElement, any>(({ children, className, ...props }, ref) => (
  <button ref={ref} className={className} data-testid="select-trigger" {...props}>
    {children}
  </button>
));

export const SelectValue = React.forwardRef<HTMLSpanElement, any>(({ children, placeholder, className, ...props }, ref) => (
  <span ref={ref} className={className} data-testid="select-value" {...props}>
    {children || placeholder}
  </span>
));

export const SelectContent = React.forwardRef<HTMLDivElement, any>(({ children, className, ...props }, ref) => (
  <div ref={ref} className={className} data-testid="select-content" {...props}>
    {children}
  </div>
));

export const SelectItem = React.forwardRef<HTMLOptionElement, any>(({ children, value, className, ...props }, ref) => (
  <option ref={ref} value={value} className={className} data-testid="select-item" {...props}>
    {children}
  </option>
));