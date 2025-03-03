import React from 'react';

export const Tabs = React.forwardRef<HTMLDivElement, any>(({ value, defaultValue, className, children, ...props }, ref) => (
  <div ref={ref} className={className} data-testid="tabs" data-value={value || defaultValue} {...props}>
    {children}
  </div>
));

export const TabsList = React.forwardRef<HTMLDivElement, any>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={className} data-testid="tabs-list" role="tablist" {...props}>
    {children}
  </div>
));

export const TabsTrigger = React.forwardRef<HTMLButtonElement, any>(({ value, className, children, ...props }, ref) => (
  <button
    ref={ref}
    role="tab"
    className={className}
    data-testid="tabs-trigger"
    data-value={value}
    {...props}
  >
    {children}
  </button>
));

export const TabsContent = React.forwardRef<HTMLDivElement, any>(({ value, className, children, ...props }, ref) => (
  <div
    ref={ref}
    role="tabpanel"
    className={className}
    data-testid="tabs-content"
    data-value={value}
    {...props}
  >
    {children}
  </div>
));