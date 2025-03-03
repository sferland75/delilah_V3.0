import React from 'react';

export const Collapsible = ({ children, open, ...props }: any) => (
  <div data-testid="collapsible" data-state={open ? 'open' : 'closed'} {...props}>
    {children}
  </div>
);

export const CollapsibleTrigger = ({ children, ...props }: any) => (
  <button data-testid="collapsible-trigger" type="button" {...props}>
    {children}
  </button>
);

export const CollapsibleContent = ({ children, ...props }: any) => (
  <div data-testid="collapsible-content" {...props}>
    {children}
  </div>
);