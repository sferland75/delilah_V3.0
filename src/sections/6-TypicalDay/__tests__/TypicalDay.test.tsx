import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { TypicalDay } from '../TypicalDay';
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

describe('TypicalDay', () => {
  it('renders pre and post accident sections', () => {
    render(
      <FormWrapper>
        <TypicalDay />
      </FormWrapper>
    );
    
    expect(screen.getByTestId('pre-accident-tab')).toBeInTheDocument();
    expect(screen.getByTestId('post-accident-tab')).toBeInTheDocument();
  });

  it('switches between pre and post accident views', () => {
    render(
      <FormWrapper>
        <TypicalDay />
      </FormWrapper>
    );

    const postAccidentTab = screen.getByTestId('post-accident-tab');
    fireEvent.click(postAccidentTab);
    
    expect(screen.getByTestId('post-accident-content')).toBeInTheDocument();
    
    const preAccidentTab = screen.getByTestId('pre-accident-tab');
    fireEvent.click(preAccidentTab);
    
    expect(screen.getByTestId('pre-accident-content')).toBeInTheDocument();
  });

  it('preserves data between tab switches', () => {
    render(
      <FormWrapper>
        <TypicalDay />
      </FormWrapper>
    );

    // Add pre-accident activity
    const addPreButton = screen.getByTestId('add-preAccident-morning-activity');
    fireEvent.click(addPreButton);
    
    const preInput = screen.getByTestId('preAccident-morning-time-0');
    fireEvent.change(preInput, { target: { value: '8:00 AM' } });

    // Switch to post-accident
    const postAccidentTab = screen.getByTestId('post-accident-tab');
    fireEvent.click(postAccidentTab);
    
    // Switch back to pre-accident
    const preAccidentTab = screen.getByTestId('pre-accident-tab');
    fireEvent.click(preAccidentTab);

    // Check if data persists
    expect(screen.getByTestId('preAccident-morning-time-0')).toHaveValue('8:00 AM');
  });
});