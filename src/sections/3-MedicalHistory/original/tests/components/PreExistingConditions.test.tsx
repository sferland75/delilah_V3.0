import React from 'react';
import { render, screen } from '../utils/test-utils';
import { PreExistingConditions } from '../../components/TabViews/PreExistingConditions';

describe('PreExistingConditions', () => {
  it('renders all required fields', () => {
    render(<PreExistingConditions />);
    
    expect(screen.getByTestId('input-preExistingConditions.0.condition')).toBeInTheDocument();
    expect(screen.getByTestId('select-preExistingConditions.0.status')).toBeInTheDocument();
    expect(screen.getByTestId('textarea-preExistingConditions.0.details')).toBeInTheDocument();
  });

  it('displays field labels correctly', () => {
    render(<PreExistingConditions />);
    
    expect(screen.getByText('Condition')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Details')).toBeInTheDocument();
  });
});