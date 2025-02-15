import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MedicalHistorySection } from './index';
import { defaultFormState } from './schema';

// Mock hooks
jest.mock('@/hooks/useFormPersistence', () => ({
  useFormPersistence: jest.fn()
}));

describe('MedicalHistorySection', () => {
  it('renders in edit mode by default', () => {
    render(<MedicalHistorySection />);
    
    expect(screen.getByText('Medical History')).toBeInTheDocument();
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /pre-existing/i })).toBeInTheDocument();
  });

  it('switches between tabs correctly', () => {
    render(<MedicalHistorySection />);
    
    const injuryTab = screen.getByRole('tab', { name: /injury details/i });
    fireEvent.click(injuryTab);
    
    expect(screen.getByText('Injury Mechanism')).toBeInTheDocument();
  });

  it('handles form submissions', async () => {
    render(<MedicalHistorySection />);
    
    // Add a pre-existing condition
    const addButton = screen.getByRole('button', { name: /add condition/i });
    fireEvent.click(addButton);
    
    // Fill out the form
    const conditionInput = screen.getByPlaceholder('Enter condition');
    fireEvent.change(conditionInput, { target: { value: 'Hypertension' } });
    
    // Verify the input was recorded
    expect(conditionInput).toHaveValue('Hypertension');
  });

  it('validates required fields', async () => {
    render(<MedicalHistorySection />);
    
    // Add a condition without filling required fields
    const addButton = screen.getByRole('button', { name: /add condition/i });
    fireEvent.click(addButton);
    
    // Try to submit (implementation dependent)
    // Expect validation errors
    expect(screen.getByText('Condition name is required')).toBeInTheDocument();
  });
});

// Add more test files in components/__tests__ for individual components