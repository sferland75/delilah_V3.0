import React from 'react';

export const Card = ({ children, className = '', ...props }) => (
  <div data-testid="card" className={className} {...props}>
    {children}
  </div>
);

export const CardHeader = ({ children, className = '', ...props }) => (
  <div data-testid="card-header" className={className} {...props}>
    {children}
  </div>
);

export const CardContent = ({ children, className = '', ...props }) => (
  <div data-testid="card-content" className={className} {...props}>
    {children}
  </div>
);