import React from 'react';

export const Checkbox = React.forwardRef<HTMLInputElement>((props: any, ref) => (
  <input
    type="checkbox"
    ref={ref}
    {...props}
  />
));