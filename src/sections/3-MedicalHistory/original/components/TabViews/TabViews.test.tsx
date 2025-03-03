import React from 'react';
import { render, screen } from '../../tests/utils';
import userEvent from '@testing-library/user-event';
import { PreExistingConditions } from './PreExistingConditions';
import { InjuryMechanism } from './InjuryMechanism';
import { CurrentTreatment } from './CurrentTreatment';
import { Medications } from './Medications';

describe('TabView Components', () => {
  describe('PreExistingConditions', () => {
    it('renders form fields', () => {
      render(<PreExistingConditions />);
      expect(screen.getByTestId('input-preExistingConditions.0.condition')).toBeInTheDocument();
      expect(screen.getByTestId('select-preExistingConditions.0.status')).toBeInTheDocument();
      expect(screen.getByTestId('textarea-preExistingConditions.0.details')).toBeInTheDocument();
    });

    it('handles input changes', async () => {
      const user = userEvent.setup();
      render(<PreExistingConditions />);
      
      const input = screen.getByTestId('input-preExistingConditions.0.condition');
      await user.type(input, 'test');
      expect(input).toBeInTheDocument();
    });
  });

  describe('InjuryMechanism', () => {
    it('renders form fields', () => {
      render(<InjuryMechanism />);
      expect(screen.getByTestId('input-injury.date')).toBeInTheDocument();
      expect(screen.getByTestId('input-injury.impactType')).toBeInTheDocument();
      expect(screen.getByTestId('textarea-injury.circumstance')).toBeInTheDocument();
    });
  });

  describe('CurrentTreatment', () => {
    it('renders form fields', () => {
      render(<CurrentTreatment />);
      expect(screen.getByTestId('input-currentTreatments.0.type')).toBeInTheDocument();
      expect(screen.getByTestId('input-currentTreatments.0.provider')).toBeInTheDocument();
      expect(screen.getByTestId('input-currentTreatments.0.facility')).toBeInTheDocument();
    });
  });

  describe('Medications', () => {
    it('renders form fields', () => {
      render(<Medications />);
      expect(screen.getByTestId('input-currentMedications.0.name')).toBeInTheDocument();
      expect(screen.getByTestId('input-currentMedications.0.dosage')).toBeInTheDocument();
      expect(screen.getByTestId('input-currentMedications.0.frequency')).toBeInTheDocument();
    });
  });
});