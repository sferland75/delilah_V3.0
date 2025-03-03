import React from 'react';
import { render, screen } from '@testing-library/react';
import { CareActivity } from '../components/CareActivity';
import { useForm, FormProvider } from 'react-hook-form';
import { act } from '@testing-library/react';
import { mockUiComponents } from './testUtils';

// Mock the component imports using our centralized mocks
jest.mock('@/components/ui/card', () => ({
  Card: mockUiComponents.Card
}));

jest.mock('@/components/ui/label', () => ({
  Label: mockUiComponents.Label
}));

jest.mock('@/components/ui/input', () => ({
  Input: mockUiComponents.Input
}));

jest.mock('@/components/ui/textarea', () => ({
  Textarea: mockUiComponents.Textarea
}));

// Mock the calculations module
const mockCalculateTotalMinutes = jest.fn((minutes, timesPerWeek) => minutes * timesPerWeek);
jest.mock('../utils/calculations', () => ({
  calculateTotalMinutes: (minutes: number, timesPerWeek: number) => mockCalculateTotalMinutes(minutes, timesPerWeek)
}));

interface WrapperProps {
  defaultValues?: any;
  children: React.ReactNode;
}

const FormWrapper = ({ defaultValues = {}, children }: WrapperProps) => {
  const methods = useForm({
    defaultValues: {
      testActivity: {
        minutes: 0,
        timesPerWeek: 0,
        totalMinutes: 0,
        notes: '',
        ...defaultValues?.testActivity
      }
    },
    mode: 'onChange'
  });

  return (
    <FormProvider {...methods}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { form: methods });
        }
        return child;
      })}
    </FormProvider>
  );
};

describe('CareActivity Component', () => {
  beforeEach(() => {
    mockCalculateTotalMinutes.mockClear();
  });

  it('renders the activity label and description', () => {
    render(
      <FormWrapper>
        <CareActivity 
          path="testActivity"
          label="Test Activity"
          description="Test description"
        />
      </FormWrapper>
    );

    expect(screen.getByText('Test Activity')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('renders input fields for minutes and times per week', () => {
    render(
      <FormWrapper>
        <CareActivity 
          path="testActivity"
          label="Test Activity"
        />
      </FormWrapper>
    );

    expect(screen.getByText('Minutes per Activity')).toBeInTheDocument();
    expect(screen.getByText('Times per Week')).toBeInTheDocument();
    expect(screen.getAllByTestId('input').length).toBe(2);
  });

  it('renders textarea for notes', () => {
    render(
      <FormWrapper>
        <CareActivity 
          path="testActivity"
          label="Test Activity"
        />
      </FormWrapper>
    );

    expect(screen.getByText('Notes & Observations')).toBeInTheDocument();
    expect(screen.getByTestId('textarea')).toBeInTheDocument();
  });

  it('displays the total minutes calculation', async () => {
    mockCalculateTotalMinutes.mockReturnValue(45);

    const { rerender } = render(
      <FormWrapper defaultValues={{
        testActivity: { 
          minutes: 15, 
          timesPerWeek: 3
        }
      }}>
        <CareActivity 
          path="testActivity"
          label="Test Activity"
        />
      </FormWrapper>
    );

    // Force a re-render to ensure the calculation runs
    await act(async () => {
      rerender(
        <FormWrapper defaultValues={{
          testActivity: { 
            minutes: 15, 
            timesPerWeek: 3
          }
        }}>
          <CareActivity 
            path="testActivity"
            label="Test Activity"
          />
        </FormWrapper>
      );
    });

    expect(screen.getByText('Total Minutes per Week:')).toBeInTheDocument();
    expect(mockCalculateTotalMinutes).toHaveBeenCalledWith(15, 3);
    expect(screen.getByText('45')).toBeInTheDocument();
  });
});