import React from 'react';

export const Button = React.forwardRef<HTMLButtonElement, any>((props, ref) => (
  <button
    ref={ref}
    onClick={props.onClick}
    className={props.className}
    type={props.type}
    data-variant={props.variant || 'default'}
    data-size={props.size || 'default'}
  >
    {props.children}
  </button>
));