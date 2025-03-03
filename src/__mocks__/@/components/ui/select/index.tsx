import React from 'react';

export const Select = ({ label, id, value, onChange, options, multiple = false, ...props }) => (
  <div className="form-control">
    {label && <label htmlFor={id}>{label}</label>}
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(multiple ? 
        Array.from(e.target.selectedOptions, option => option.value) : 
        e.target.value)}
      multiple={multiple}
      {...props}
    >
      {options?.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);