import React from 'react';

export const Accordion = ({ children, ...props }: { children: React.ReactNode }) => (
  <div data-testid="accordion" {...props}>{children}</div>
);

export const AccordionItem = ({ children, ...props }: { children: React.ReactNode }) => (
  <div data-testid="accordion-item" {...props}>{children}</div>
);

export const AccordionTrigger = ({ children, ...props }: { children: React.ReactNode }) => (
  <button data-testid="accordion-trigger" {...props}>{children}</button>
);

export const AccordionContent = ({ children, ...props }: { children: React.ReactNode }) => (
  <div data-testid="accordion-content" {...props}>{children}</div>
);

export default {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
};