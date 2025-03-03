import React from 'react';

export const Card = ({ children }: { children: React.ReactNode }) => (
  <div data-testid="card">{children}</div>
);

export const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div data-testid="card-header">{children}</div>
);

export const CardContent = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div data-testid="card-content" className={className}>{children}</div>
);

export const Select = ({
  id,
  label,
  value,
  onChange,
  options,
  multiple
}: {
  id: string;
  label: string;
  value: string | string[];
  onChange: (value: any) => void;
  options: Array<{ label: string; value: string }>;
  multiple?: boolean;
}) => (
  <div data-testid="select-wrapper">
    <label htmlFor={id}>{label}</label>
    <select
      id={id}
      value={value as string}
      onChange={(e) => onChange(multiple ? Array.from(e.target.selectedOptions).map(o => o.value) : e.target.value)}
      multiple={multiple}
      data-testid="select"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export const Input = ({
  id,
  type = "text",
  label,
  value,
  onChange,
  min,
  max
}: {
  id: string;
  type?: string;
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
}) => (
  <div data-testid="input-wrapper">
    <label htmlFor={id}>{label}</label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      data-testid="input"
    />
  </div>
);

export const Textarea = ({
  id,
  label,
  value,
  onChange,
  placeholder
}: {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
}) => (
  <div data-testid="textarea-wrapper">
    <label htmlFor={id}>{label}</label>
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      data-testid="textarea"
    />
  </div>
);