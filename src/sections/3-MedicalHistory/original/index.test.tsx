import React from 'react';
import { render, screen, act } from './tests/utils';
import userEvent from '@testing-library/user-event';
import { MedicalHistorySection } from './';
import { mockMedicalHistory } from './tests/utils';

describe('MedicalHistorySection', () => {
  it('renders in edit mode by default', async () => {
    render(<MedicalHistorySection />, {
      formValues: {
        data: mockMedicalHistory,
        config: { mode: 'edit', activeTab: 'preExisting' }
      }
    });

    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getByText(/pre-existing/i)).toBeInTheDocument();
    // Verify edit mode form elements are present
    expect(screen.getByTestId('input-preExistingConditions.0.condition')).toBeInTheDocument();
  });

  it('handles undefined config gracefully', () => {
    render(<MedicalHistorySection />);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getByText(/pre-existing/i)).toBeInTheDocument();
  });

  it('handles missing mode/activeTab gracefully', () => {
    render(<MedicalHistorySection />, {
      formValues: { data: mockMedicalHistory }
    });

    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getByText(/pre-existing/i)).toBeInTheDocument();
  });

  it('renders in view mode when configured', async () => {
    render(<MedicalHistorySection />, {
      formValues: {
        data: mockMedicalHistory,
        config: { mode: 'view' }
      }
    });

    expect(screen.getByText(/hypertension/i)).toBeInTheDocument();
    // Should show text content instead of form inputs
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('handles form persistence correctly', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<MedicalHistorySection />, {
      formValues: {
        data: mockMedicalHistory,
        config: { mode: 'edit', activeTab: 'preExisting' }
      }
    });

    const conditionInput = screen.getByTestId('input-preExistingConditions.0.condition');
    await user.clear(conditionInput);
    await user.type(conditionInput, 'Diabetes');

    expect(conditionInput).toHaveValue('Diabetes');

    // Rerender with same data should maintain form state
    rerender(<MedicalHistorySection />);
    expect(screen.getByTestId('input-preExistingConditions.0.condition')).toHaveValue('Diabetes');
  });

  it('maintains form state during tab changes', async () => {
    const user = userEvent.setup();
    render(<MedicalHistorySection />, {
      formValues: {
        data: mockMedicalHistory,
        config: { mode: 'edit', activeTab: 'preExisting' }
      }
    });

    // Edit data in first tab
    const conditionInput = screen.getByTestId('input-preExistingConditions.0.condition');
    await user.clear(conditionInput);
    await user.type(conditionInput, 'Diabetes');

    // Change tab
    const injuryTab = screen.getByRole('tab', { name: /injury/i });
    await user.click(injuryTab);

    // Change back and verify data persists
    const preExistingTab = screen.getByRole('tab', { name: /pre-existing/i });
    await user.click(preExistingTab);

    expect(screen.getByTestId('input-preExistingConditions.0.condition')).toHaveValue('Diabetes');
  });
});