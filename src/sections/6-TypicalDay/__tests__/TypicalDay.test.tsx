import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { TypicalDayIntegrated } from '../components/TypicalDay.integrated';
import { typicalDaySchema, defaultFormState } from '../schema';
import { AssessmentProvider } from '@/contexts/AssessmentContext';
import { zodResolver } from '@hookform/resolvers/zod';
import type { TypicalDay } from '../schema';

// Mock the assessment context
jest.mock('@/contexts/AssessmentContext', () => ({
  useAssessment: jest.fn(() => ({
    data: { typicalDay: {} },
    updateSection: jest.fn()
  })),
  AssessmentProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

// Mock the mapper service
jest.mock('@/services/typicalDayMapper', () => ({
  mapContextToForm: jest.fn(() => ({ 
    formData: defaultFormState, 
    hasData: false 
  })),
  mapFormToContext: jest.fn(() => ({}))
}));

const FormWrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const methods = useForm<TypicalDay>({
    resolver: zodResolver(typicalDaySchema),
    defaultValues: defaultFormState
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('TypicalDayIntegrated', () => {
  it('renders without crashing', () => {
    render(
      <AssessmentProvider>
        <FormWrapper>
          <TypicalDayIntegrated />
        </FormWrapper>
      </AssessmentProvider>
    );
    
    expect(screen.getByText(/Typical Day/i)).toBeInTheDocument();
  });

  it('toggles between pre and post accident tabs', () => {
    render(
      <AssessmentProvider>
        <FormWrapper>
          <TypicalDayIntegrated />
        </FormWrapper>
      </AssessmentProvider>
    );

    // Check Pre-Accident tab is active by default
    const preAccidentTab = screen.getByText(/Pre-Accident/i);
    expect(preAccidentTab).toBeInTheDocument();
    
    // Click on Post-Accident tab
    const postAccidentTab = screen.getByText(/Post-Accident/i);
    fireEvent.click(postAccidentTab);
    
    // Click back to Pre-Accident
    fireEvent.click(preAccidentTab);
  });
  
  it('renders sleep schedule component', async () => {
    render(
      <AssessmentProvider>
        <FormWrapper>
          <TypicalDayIntegrated />
        </FormWrapper>
      </AssessmentProvider>
    );
    
    // Check if sleep schedule component is rendered
    await waitFor(() => {
      expect(screen.getByText(/Sleep Schedule/i)).toBeInTheDocument();
    });
  });
  
  it('shows time blocks for morning, afternoon, evening and night', () => {
    render(
      <AssessmentProvider>
        <FormWrapper>
          <TypicalDayIntegrated />
        </FormWrapper>
      </AssessmentProvider>
    );
    
    // Check for time blocks
    expect(screen.getByText(/Morning/i)).toBeInTheDocument();
    expect(screen.getByText(/Afternoon/i)).toBeInTheDocument();
    expect(screen.getByText(/Evening/i)).toBeInTheDocument();
    expect(screen.getByText(/Night/i)).toBeInTheDocument();
  });
  
  it('has a submit button', () => {
    render(
      <AssessmentProvider>
        <FormWrapper>
          <TypicalDayIntegrated />
        </FormWrapper>
      </AssessmentProvider>
    );
    
    // Check for submit button
    expect(screen.getByText(/Save Typical Day/i)).toBeInTheDocument();
  });
  
  it('has a reset button', () => {
    render(
      <AssessmentProvider>
        <FormWrapper>
          <TypicalDayIntegrated />
        </FormWrapper>
      </AssessmentProvider>
    );
    
    // Check for reset button
    expect(screen.getByText(/Reset/i)).toBeInTheDocument();
  });
});