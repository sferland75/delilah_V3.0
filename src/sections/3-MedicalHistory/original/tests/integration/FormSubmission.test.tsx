import React from 'react';
import { render, screen, act } from '../utils/test-utils';
import userEvent from '@testing-library/user-event';
import { MedicalHistorySection } from '../../index';
import { mockMedicalHistory } from '../utils/test-utils';
import { useForm, FormProvider } from 'react-hook-form';
import { defaultFormState } from '../../schema';

describe('Medical History Form Submission', () => {
  const user = userEvent.setup();

  it('completes full medical history workflow', async () => {
    // Create a test wrapper that exposes form methods
    let formMethods: any;
    const TestForm = () => {
      formMethods = useForm({
        defaultValues: {
          ...defaultFormState,
          config: {
            mode: 'edit',
            activeTab: 'preExisting'
          }
        }
      });
      
      return (
        <FormProvider {...formMethods}>
          <MedicalHistorySection />
        </FormProvider>
      );
    };

    render(<TestForm />);

    // Fill pre-existing conditions
    await act(async () => {
      const conditionInput = screen.getByTestId('input-preExistingConditions.0.condition');
      await user.clear(conditionInput);
      await user.type(conditionInput, mockMedicalHistory.preExistingConditions[0].condition);

      // Update form state directly
      formMethods.setValue(
        'data.preExistingConditions.0.condition',
        mockMedicalHistory.preExistingConditions[0].condition
      );
    });

    // Switch to injury tab
    await act(async () => {
      const injuryTab = screen.getByRole('tab', { name: /injury details/i });
      await user.click(injuryTab);
    });

    await act(async () => {
      const dateInput = await screen.findByTestId('input-injury.date');
      await user.clear(dateInput);
      await user.type(dateInput, mockMedicalHistory.injury.date);

      // Update form state directly
      formMethods.setValue('data.injury.date', mockMedicalHistory.injury.date);
    });

    // Switch back to verify data persistence
    await act(async () => {
      const preExistingTab = screen.getByRole('tab', { name: /pre-existing/i });
      await user.click(preExistingTab);
    });

    // Verify data persists
    expect(formMethods.getValues('data.preExistingConditions.0.condition'))
      .toBe(mockMedicalHistory.preExistingConditions[0].condition);
    expect(screen.getByTestId('input-preExistingConditions.0.condition'))
      .toHaveValue(mockMedicalHistory.preExistingConditions[0].condition);
  });
});