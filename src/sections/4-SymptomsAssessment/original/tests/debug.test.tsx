import React from 'react';
import { render, screen } from '@testing-library/react';

console.log('Starting debug test');

describe('Debug Test', () => {
  it('should run a simple test', () => {
    console.log('Running simple test');
    render(<div>Test</div>);
    expect(screen.getByText('Test')).toBeInTheDocument();
    console.log('Test complete');
  });
});

console.log('Debug test file loaded');