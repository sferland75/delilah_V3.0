import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';

// Centralized UI component mocks
const mockUiComponents = {
  // Tabs components with proper accessibility attributes
  Tabs: ({ children, defaultValue, className, ...props }: any) => (
    <div 
      data-testid="tabs" 
      data-default-value={defaultValue} 
      className={className}
      {...props}
    >
      {children}
    </div>
  ),
  
  TabsList: ({ children, className, ...props }: any) => (
    <div 
      data-testid="tabs-list" 
      role="tablist"
      className={className}
      {...props}
    >
      {children}
    </div>
  ),
  
  TabsTrigger: ({ children, value, className, ...props }: any) => (
    <button 
      data-testid="tab-trigger" 
      data-value={value} 
      role="tab"
      aria-selected={props['aria-selected']}
      aria-controls={`panel-${value}`}
      className={className}
      {...props}
    >
      {children}
    </button>
  ),
  
  TabsContent: ({ children, value, className, ...props }: any) => (
    <div 
      data-testid="tabs-content" 
      data-value={value} 
      role="tabpanel"
      id={`panel-${value}`}
      className={className}
      {...props}
    >
      {children}
    </div>
  ),
  
  // Alert Dialog components
  AlertDialog: ({ children, open, onOpenChange, ...props }: any) => (
    <div 
      data-testid="alert-dialog" 
      data-open={open} 
      role="dialog"
      aria-modal="true"
      {...props}
    >
      {onOpenChange && (
        <button 
          data-testid="dialog-close" 
          onClick={() => onOpenChange(false)}
        >
          Close
        </button>
      )}
      {children}
    </div>
  ),
  
  AlertDialogContent: ({ children, className, ...props }: any) => (
    <div data-testid="alert-dialog-content" className={className} {...props}>
      {children}
    </div>
  ),
  
  AlertDialogHeader: ({ children, ...props }: any) => (
    <div data-testid="alert-dialog-header" {...props}>
      {children}
    </div>
  ),
  
  AlertDialogTitle: ({ children, ...props }: any) => (
    <div data-testid="alert-dialog-title" {...props}>
      {children}
    </div>
  ),
  
  AlertDialogDescription: ({ children, ...props }: any) => (
    <div data-testid="alert-dialog-description" {...props}>
      {children}
    </div>
  ),
  
  // Card component
  Card: ({ children, className, ...props }: any) => (
    <div data-testid="card" className={className} {...props}>
      {children}
    </div>
  ),
  
  // Button component
  Button: ({ children, type, onClick, variant, className, ...props }: any) => (
    <button 
      data-testid="button" 
      type={type} 
      onClick={onClick}
      data-variant={variant}
      className={className}
      {...props}
    >
      {children}
    </button>
  ),
  
  // Input component
  Input: (props: any) => (
    <input data-testid="input" {...props} />
  ),
  
  // Label component
  Label: ({ children, className, ...props }: any) => (
    <label data-testid="label" className={className} {...props}>
      {children}
    </label>
  ),
  
  // Textarea component
  Textarea: (props: any) => (
    <textarea data-testid="textarea" {...props} />
  ),
  
  // Select component
  Select: ({ children, ...props }: any) => (
    <div data-testid="select" {...props}>
      {children}
    </div>
  ),
  
  SelectTrigger: ({ children, ...props }: any) => (
    <div data-testid="select-trigger" {...props}>
      {children}
    </div>
  ),
  
  SelectValue: (props: any) => (
    <span data-testid="select-value" {...props} />
  ),
  
  SelectContent: ({ children, ...props }: any) => (
    <div data-testid="select-content" {...props}>
      {children}
    </div>
  ),
  
  SelectItem: ({ children, value, ...props }: any) => (
    <div data-testid="select-item" data-value={value} {...props}>
      {children}
    </div>
  )
};

// Form wrapper for testing components that use forms
export const renderWithForm = (
  ui: React.ReactElement,
  defaultFormValues = {},
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    const methods = useForm({
      defaultValues: defaultFormValues,
      mode: 'onChange'
    });

    return <FormProvider {...methods}>{children}</FormProvider>;
  };

  return render(ui, { wrapper: Wrapper, ...options });
};

export { mockUiComponents };
