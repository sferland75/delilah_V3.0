import React from 'react';

export const Alert = React.forwardRef<HTMLDivElement, any>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={className} data-testid="alert" {...props}>
    {children}
  </div>
));

export const AlertTitle = React.forwardRef<HTMLHeadingElement, any>(({ className, children, ...props }, ref) => (
  <h5 ref={ref} className={className} data-testid="alert-title" {...props}>
    {children}
  </h5>
));

export const AlertDescription = React.forwardRef<HTMLParagraphElement, any>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={className} data-testid="alert-description" {...props}>
    {children}
  </div>
));