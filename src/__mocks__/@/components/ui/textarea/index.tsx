import React from 'react';

export const Textarea = ({ label, id, value, onChange, ...props }) => (
  <div className="form-control">
    {label && <label htmlFor={id}>{label}</label>}
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      {...props}
    ></textarea>
  </div>
);