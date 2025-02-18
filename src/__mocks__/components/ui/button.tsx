import React from 'react';
import { forwardRef } from 'react';

export const Button = forwardRef(({ children, type = 'button', ...props }: any, ref) => (
  <button
    ref={ref}
    type={type}
    data-testid={`button-${children?.toLowerCase?.()?.replace(/\s+/g, '-')}`}
    {...props}
  >
    {children}
  </button>
));