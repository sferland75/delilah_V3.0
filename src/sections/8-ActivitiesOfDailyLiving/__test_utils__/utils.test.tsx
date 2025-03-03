import React from 'react';
import { renderWithFormContext } from './utils';

describe('renderWithFormContext', () => {
  it('handles null defaultValues', () => {
    const TestComponent = () => <div data-testid="test">Test</div>;
    const { getByTestId } = renderWithFormContext(<TestComponent />, null);
    expect(getByTestId('test')).toBeInTheDocument();
  });

  it('handles empty defaultValues', () => {
    const TestComponent = () => <div data-testid="test">Test</div>;
    const { getByTestId } = renderWithFormContext(<TestComponent />, {});
    expect(getByTestId('test')).toBeInTheDocument();
  });

  it('handles specified defaultValues', () => {
    const TestComponent = () => <div data-testid="test">Test</div>;
    const { getByTestId } = renderWithFormContext(<TestComponent />, {
      basic: {
        bathing: {
          shower: { independence: 'independent', notes: 'test' }
        }
      }
    });
    expect(getByTestId('test')).toBeInTheDocument();
  });
});