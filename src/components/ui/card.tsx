import React from 'react';

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

export function CardHeader({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3>{children}</h3>;
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}