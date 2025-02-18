import React from 'react';
import { render, screen } from '@testing-library/react';

describe('Simple Test', () => {
  it('should pass', () => {
    expect(true).toBe(true);
  });

  it('should render a div', () => {
    render(<div>Test Content</div>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
});