import React from 'react';

export function Alert({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div role="alert" className={className}>{children}</div>;
}

export function AlertDescription({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export function AlertTitle({ children }: { children: React.ReactNode }) {
  return <h5>{children}</h5>;
}