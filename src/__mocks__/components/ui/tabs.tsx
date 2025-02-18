import React from 'react';

export function Tabs({ children, value, onValueChange, className }: { 
  children: React.ReactNode; 
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}) {
  return (
    <div data-value={value} onChange={e => onValueChange?.(e.target.value)} className={className}>
      {children}
    </div>
  );
}

export function TabsList({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div role="tablist" aria-orientation="horizontal" className={className}>{children}</div>;
}

export function TabsTrigger({ children, value, className }: { 
  children: React.ReactNode;
  value: string;
  className?: string;
}) {
  return (
    <button 
      role="tab" 
      data-value={value}
      aria-selected={false}
      tabIndex={0}
      className={className}
    >
      {children}
    </button>
  );
}

export function TabsContent({ children, value, className }: { 
  children: React.ReactNode;
  value: string;
  className?: string;
}) {
  return (
    <div role="tabpanel" data-value={value} className={className}>
      {children}
    </div>
  );
}