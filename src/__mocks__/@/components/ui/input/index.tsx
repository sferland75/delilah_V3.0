import React from 'react';

export const Input = ({ label, id, type = 'text', value, onChange, ...props }) => (
  <div className="form-control">
    {label && <label htmlFor={id}>{label}</label>}
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      {...props}
    />
  </div>
);