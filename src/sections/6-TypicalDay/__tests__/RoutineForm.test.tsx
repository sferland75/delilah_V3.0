import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { RoutineForm } from '../components/RoutineForm';
import { TypicalDayFormData } from '../types';
import { generateMockTypicalDayData } from './helpers/test-helpers';

const FormWrapper: React.FC<{
  children: React.ReactNode;
  defaultValues?: TypicalDayFormData;
}> = ({ children, defaultValues = generateMockTypicalDayData() }) => {
  const methods = useForm<TypicalDayFormData>({
    defaultValues
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('RoutineForm', () => {
  it('renders routine form fields', () => {
    render(
      <FormWrapper>
        <RoutineForm timeperiod="morning" routineType="preAccident" />
      </FormWrapper>
    );

    expect(screen.getByText('morning Routine')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add activity/i })).toBeInTheDocument();
  });

  it('adds and removes activities', () => {
    render(
      <FormWrapper>
        <RoutineForm timeperiod="morning" routineType="preAccident" />
      </FormWrapper>
    );

    // Add activity
    const addButton = screen.getByRole('button', { name: /add activity/i });
    fireEvent.click(addButton);

    // Check if time block and description fields are added
    expect(screen.getByTestId('preAccident-morning-time-0')).toBeInTheDocument();
    expect(screen.getByTestId('preAccident-morning-desc-0')).toBeInTheDocument();

    // Remove activity
    const removeButton = screen.getByRole('button', { name: /remove activity/i });
    fireEvent.click(removeButton);

    // Check if fields are removed
    expect(screen.queryByTestId('preAccident-morning-time-0')).not.toBeInTheDocument();
    expect(screen.queryByTestId('preAccident-morning-desc-0')).not.toBeInTheDocument();
  });

  it('shows additional fields for post-accident routine', () => {
    render(
      <FormWrapper>
        <RoutineForm timeperiod="morning" routineType="postAccident" />
      </FormWrapper>
    );

    // Add activity
    const addButton = screen.getByRole('button', { name: /add activity/i });
    fireEvent.click(addButton);

    // Check if assistance and limitations fields are present
    expect(screen.getByTestId('postAccident-morning-assistance-0')).toBeInTheDocument();
    expect(screen.getByTestId('postAccident-morning-limitations-0')).toBeInTheDocument();
  });
});