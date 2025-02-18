import React from 'react';
import { forwardRef } from 'react';

export const Input = forwardRef(({ type = 'text', name, ...props }: any, ref) => (
  <input
    ref={ref}
    type={type}
    data-testid={`input-${name}`}
    id={`input-${name}`}
    name={name}
    {...props}
  />
));