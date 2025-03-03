import React from 'react';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ type = 'text', id, ...props }, ref) => {
    // Add the id to the testid to make it unique
    return <input type={type} ref={ref} data-testid={`input-${id}`} id={id} {...props} />;
  }
);

Input.displayName = 'Input';

export default Input;