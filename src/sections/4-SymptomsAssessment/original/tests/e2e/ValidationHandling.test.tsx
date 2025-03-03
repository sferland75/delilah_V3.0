import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { SymptomsAssessment } from '../../components/SymptomsAssessment';

describe('Validation Error Handling', () => {
  const user = userEvent.setup();

  it('displays appropriate validation errors for required fields', async () => {
    render(React.createElement(SymptomsAssessment));

    // Try to submit empty form
    await user.click(screen.getByTestId('submit-assessment'));

    // Check for required field errors
    expect(screen.getByText('General notes are required')).toBeInTheDocument();
    
    // Fill one field and verify error clears
    await user.type(screen.getByTestId('general-notes'), 'Test notes');
    expect(screen.queryByText('General notes are required')).not.toBeInTheDocument();
  });

  it('validates symptom intensity values', async () => {
    render(React.createElement(SymptomsAssessment));

    // Navigate to physical symptoms
    await user.click(screen.getByTestId('physical-tab'));
    await user.click(screen.getByTestId('add-symptom-button'));

    // Try invalid intensity
    await user.type(screen.getByLabelText(/intensity/i), '11');
    await user.click(screen.getByTestId('save-physical-symptom'));
    
    expect(screen.getByText('Intensity must be between 0 and 10')).toBeInTheDocument();

    // Fix the value
    await user.clear(screen.getByLabelText(/intensity/i));
    await user.type(screen.getByLabelText(/intensity/i), '7');
    await user.click(screen.getByTestId('save-physical-symptom'));

    expect(screen.queryByText('Intensity must be between 0 and 10')).not.toBeInTheDocument();
  });

  it('handles nested form validation', async () => {
    render(React.createElement(SymptomsAssessment));

    // Add incomplete cognitive symptom
    await user.click(screen.getByTestId('cognitive-tab'));
    await user.click(screen.getByTestId('add-cognitive-symptom'));
    
    // Submit without required nested fields
    await user.click(screen.getByTestId('save-cognitive-symptom'));

    // Check for nested validation errors
    expect(screen.getByText('Symptom type is required')).toBeInTheDocument();
    expect(screen.getByText('Description is required')).toBeInTheDocument();
    
    // Fill required fields
    await user.type(screen.getByLabelText(/type/i), 'Memory Issues');
    await user.type(screen.getByLabelText(/description/i), 'Test description');
    await user.click(screen.getByTestId('save-cognitive-symptom'));

    // Verify errors clear
    expect(screen.queryByText('Symptom type is required')).not.toBeInTheDocument();
    expect(screen.queryByText('Description is required')).not.toBeInTheDocument();
  });

  it('validates date and time inputs', async () => {
    render(React.createElement(SymptomsAssessment));

    // Try to enter invalid date
    await user.type(screen.getByTestId('symptom-onset'), '2024-13-45');
    await user.tab();

    expect(screen.getByText('Please enter a valid date')).toBeInTheDocument();

    // Fix the date
    await user.clear(screen.getByTestId('symptom-onset'));
    await user.type(screen.getByTestId('symptom-onset'), '2024-02-15');
    await user.tab();

    expect(screen.queryByText('Please enter a valid date')).not.toBeInTheDocument();
  });
});