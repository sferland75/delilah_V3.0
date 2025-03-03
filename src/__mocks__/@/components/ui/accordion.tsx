import React from 'react';

export const Accordion = React.forwardRef<HTMLDivElement, any>(({ type, className, children, ...props }, ref) => (
  <div ref={ref} className={className} data-testid="accordion" data-type={type} {...props}>
    {children}
  </div>
));

export const AccordionItem = React.forwardRef<HTMLDivElement, any>(({ value, className, children, ...props }, ref) => (
  <div ref={ref} className={className} data-testid="accordion-item" data-value={value} {...props}>
    {children}
  </div>
));

export const AccordionTrigger = React.forwardRef<HTMLButtonElement, any>(({ className, children, ...props }, ref) => (
  <button ref={ref} className={className} data-testid="accordion-trigger" {...props}>
    {children}
  </button>
));

export const AccordionContent = React.forwardRef<HTMLDivElement, any>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={className} data-testid="accordion-content" {...props}>
    {children}
  </div>
));