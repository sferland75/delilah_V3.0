import React from 'react';

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div data-testid="card" className={className}>{children}</div>
);

export const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div data-testid="card-header">{children}</div>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div data-testid="card-content" className={className}>{children}</div>
);

export const Alert: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div data-testid="alert" className={className}>{children}</div>
);

export const AlertDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div data-testid="alert-description" className={className}>{children}</div>
);

export const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div data-testid="label">{children}</div>
);

export const Select = ({
  value,
  onValueChange,
  children,
  'data-testid': testId
}: {
  value?: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  'data-testid'?: string;
}) => (
  <div data-testid={testId || "select"}>
    {children}
  </div>
);

export const SelectTrigger: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div data-testid="select-trigger">{children}</div>
);

export const SelectValue: React.FC<{ placeholder?: string }> = ({ placeholder }) => (
  <div data-testid="select-value">{placeholder}</div>
);

export const SelectContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div data-testid="select-content">{children}</div>
);

export const SelectItem: React.FC<{ children: React.ReactNode; value: string }> = ({ children, value }) => (
  <div data-testid="select-item" data-value={value}>{children}</div>
);

export const Tabs: React.FC<{ children: React.ReactNode; defaultValue: string; className?: string }> = ({ children, defaultValue, className }) => (
  <div data-testid="tabs" data-default-value={defaultValue} className={className}>{children}</div>
);

export const TabsList: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div data-testid="tabs-list" className={className}>{children}</div>
);

export const TabsTrigger: React.FC<{ children: React.ReactNode; value: string; className?: string }> = ({ children, value, className }) => (
  <div data-testid="tabs-trigger" data-value={value} className={className}>{children}</div>
);

export const TabsContent: React.FC<{ children: React.ReactNode; value: string }> = ({ children, value }) => (
  <div data-testid="tabs-content" data-value={value}>{children}</div>
);

export const Accordion: React.FC<{ children: React.ReactNode; type?: string; className?: string }> = ({ children, type, className }) => (
  <div data-testid="accordion" data-type={type} className={className}>{children}</div>
);

export const AccordionItem: React.FC<{ children: React.ReactNode; value: string; className?: string }> = ({ children, value, className }) => (
  <div data-testid="accordion-item" data-value={value} className={className}>{children}</div>
);

export const AccordionTrigger: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div data-testid="accordion-trigger" className={className}>{children}</div>
);

export const AccordionContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div data-testid="accordion-content" className={className}>{children}</div>
);

export const Textarea: React.FC<{ placeholder?: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ placeholder, ...props }) => (
  <textarea data-testid="textarea" placeholder={placeholder} {...props} />
);