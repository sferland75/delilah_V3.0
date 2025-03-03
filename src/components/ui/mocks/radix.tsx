import React from 'react';

// Mock Radix UI components
export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label ref={ref} {...props} />
  )
);

export default {
  Label
};