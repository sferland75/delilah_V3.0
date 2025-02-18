import React from 'react';

export function Select({ children, onValueChange, value, ...props }: {
  children: React.ReactNode;
  onValueChange?: (value: string) => void;
  value?: string;
  [key: string]: any;
}) {
  return (
    <select 
      value={value} 
      onChange={e => onValueChange?.(e.target.value)}
      {...props}
    >
      {children}
    </select>
  );
}

export function SelectTrigger({ children, id, ...props }: {
  children: React.ReactNode;
  id?: string;
  [key: string]: any;
}) {
  return <div id={id} {...props}>{children}</div>;
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  return <span>{placeholder}</span>;
}

export function SelectContent({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export function SelectItem({ value, children, ...props }: {
  value: string;
  children: React.ReactNode;
  [key: string]: any;
}) {
  return (
    <option value={value} {...props}>
      {children}
    </option>
  );
}