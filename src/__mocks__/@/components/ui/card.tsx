import React from 'react';

export const Card = React.forwardRef<HTMLDivElement, any>(({ children, className, ...props }, ref) => (
  <div className={className} ref={ref} data-testid="card" {...props}>
    {children}
  </div>
));