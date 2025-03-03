import React from 'react';
import { render, screen } from '../utils/test-utils';
import { InjuryMechanism } from '../../components/TabViews/InjuryMechanism';

describe('InjuryMechanism', () => {
  it('renders all required fields', () => {
    render(<InjuryMechanism />);
    
    expect(screen.getByTestId('input-injury.date')).toBeInTheDocument();
    expect(screen.getByTestId('input-injury.time')).toBeInTheDocument();
    expect(screen.getByTestId('input-injury.impactType')).toBeInTheDocument();
    expect(screen.getByTestId('textarea-injury.circumstance')).toBeInTheDocument();
    expect(screen.getByTestId('textarea-injury.immediateSymptoms')).toBeInTheDocument();
  });

  it('displays appropriate field labels', () => {
    render(<InjuryMechanism />);
    
    expect(screen.getByText('Date of Injury')).toBeInTheDocument();
    expect(screen.getByText('Time of Injury')).toBeInTheDocument();
    expect(screen.getByText('Mechanism of Injury')).toBeInTheDocument();
    expect(screen.getByText('Circumstances')).toBeInTheDocument();
    expect(screen.getByText('Immediate Symptoms')).toBeInTheDocument();
  });
});