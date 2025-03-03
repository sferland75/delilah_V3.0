import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { SleepScheduleForm } from '../components/SleepScheduleForm';
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

describe('SleepScheduleForm', () => {
  it('renders sleep schedule form fields', () => {
    render(
      <FormWrapper>
        <SleepScheduleForm routineType="preAccident" />
      </FormWrapper>
    );

    expect(screen.getByTestId('preAccident-wake-time')).toBeInTheDocument();
    expect(screen.getByTestId('preAccident-bed-time')).toBeInTheDocument();
    expect(screen.getByTestId('preAccident-sleep-quality')).toBeInTheDocument();
  });
});