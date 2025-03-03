import React from 'react';
import { render, screen } from '@testing-library/react';
import { Alert, AlertDescription, AlertTitle } from './alert';

describe('Alert Components', () => {
  it('renders basic alert', () => {
    render(
      <Alert>
        <AlertDescription>Test alert</AlertDescription>
      </Alert>
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Test alert')).toBeInTheDocument();
  });

  it('renders with title', () => {
    render(
      <Alert>
        <AlertTitle>Alert Title</AlertTitle>
        <AlertDescription>Test alert</AlertDescription>
      </Alert>
    );
    expect(screen.getByText('Alert Title')).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    render(
      <Alert className="custom-alert">
        <AlertDescription className="custom-desc">Test alert</AlertDescription>
      </Alert>
    );
    expect(screen.getByRole('alert')).toHaveClass('custom-alert');
    expect(screen.getByText('Test alert')).toHaveClass('custom-desc');
  });

  it('forwards refs correctly', () => {
    const alertRef = React.createRef<HTMLDivElement>();
    const titleRef = React.createRef<HTMLParagraphElement>();
    const descRef = React.createRef<HTMLParagraphElement>();

    render(
      <Alert ref={alertRef}>
        <AlertTitle ref={titleRef}>Title</AlertTitle>
        <AlertDescription ref={descRef}>Description</AlertDescription>
      </Alert>
    );

    expect(alertRef.current).toBeInstanceOf(HTMLDivElement);
    expect(titleRef.current).toBeInstanceOf(HTMLHeadingElement);
    expect(descRef.current).toBeInstanceOf(HTMLDivElement);
  });

  it('renders with destructive variant', () => {
    render(
      <Alert variant="destructive">
        <AlertDescription>Error alert</AlertDescription>
      </Alert>
    );
    expect(screen.getByRole('alert')).toHaveClass('border-destructive/50');
  });
});