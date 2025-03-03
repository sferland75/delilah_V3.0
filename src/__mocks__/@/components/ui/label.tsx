import React from 'react';

export const Label = React.forwardRef<HTMLLabelElement, any>(
  ({ className, children, ...props }, ref) => (
    <label
      ref={ref}
      className={className}
      data-testid="label"
      {...props}
    >
      {children}
    </label>
  )
);