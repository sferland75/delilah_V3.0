import React from 'react';
import { render, screen, act, fireEvent } from '../utils/test-utils';
import userEvent from '@testing-library/user-event';
import { MedicalHistorySection } from '../../index';
import { useForm, FormProvider } from 'react-hook-form';
import { defaultFormState } from '../../schema';

describe('Medical History Tab Navigation', () => {
  const user = userEvent.setup();

  it('persists data between tab switches', async () => {
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

    // Enter data in pre-existing conditions
    const conditionInput = screen.getByTestId('input-preExistingConditions.0.condition');
    
    await act(async () => {
      await user.clear(conditionInput);
      // Direct DOM manipulation
      fireEvent.change(conditionInput, { target: { value: 'Asthma' } });
      formMethods.setValue('data.preExistingConditions.0.condition', 'Asthma');
    });

    // Switch tabs
    await act(async () => {
      const injuryTab = screen.getByRole('tab', { name: /injury details/i });
      await user.click(injuryTab);

      const preExistingTab = screen.getByRole('tab', { name: /pre-existing/i });
      await user.click(preExistingTab);
    });

    // Allow time for re-render
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Verify data persists
    expect(formMethods.getValues('data.preExistingConditions.0.condition')).toBe('Asthma');
    const inputAfterSwitch = screen.getByTestId('input-preExistingConditions.0.condition');
    expect(inputAfterSwitch).toHaveValue('Asthma');
  });

  it('loads correct form fields for each tab', async () => {
    render(<MedicalHistorySection />);

    // Pre-existing tab fields
    expect(screen.getByTestId('input-preExistingConditions.0.condition')).toBeInTheDocument();

    // Switch to injury tab
    await act(async () => {
      const injuryTab = screen.getByRole('tab', { name: /injury details/i });
      await user.click(injuryTab);
    });
    await screen.findByTestId('input-injury.date');

    // Switch to medications tab
    await act(async () => {
      const medicationsTab = screen.getByRole('tab', { name: /medications/i });
      await user.click(medicationsTab);
    });
    await screen.findByTestId('input-currentMedications.0.name');
  });
});