import React from 'react';
import { render, screen, act } from '../utils/test-utils';
import { PosturalTolerances } from '../../components/PosturalTolerances';
import { UseFormReturn } from 'react-hook-form';
import { FormState } from '../../types';
import { defaultFormState } from '../../schema';

describe('PosturalTolerances', () => {
  it('renders all required fields', () => {
    render(<PosturalTolerances />);
    expect(screen.getByText(/sitting tolerance/i)).toBeInTheDocument();
    expect(screen.getByText(/standing tolerance/i)).toBeInTheDocument();
    expect(screen.getByTestId('input-sitting-duration')).toBeInTheDocument();
    expect(screen.getByTestId('select-sitting-unit')).toBeInTheDocument();
  });

  it('displays correct section headers', () => {
    render(<PosturalTolerances />);
    expect(screen.getByRole('heading', { name: /sitting tolerance/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /standing tolerance/i })).toBeInTheDocument();
  });

  it('allows entering duration values', async () => {
    const formRef = React.createRef<UseFormReturn<FormState>>();
    render(<PosturalTolerances />, { formRef });

    await act(async () => {
      formRef.current?.setValue('data.posturalTolerances.sitting.duration', '45');
      formRef.current?.setValue('data.posturalTolerances.standing.duration', '30');
    });

    expect(formRef.current?.getValues('data.posturalTolerances.sitting.duration')).toBe('45');
    expect(formRef.current?.getValues('data.posturalTolerances.standing.duration')).toBe('30');
  });

  it('allows selecting time units', async () => {
    const formRef = React.createRef<UseFormReturn<FormState>>();
    render(<PosturalTolerances />, { formRef });

    await act(async () => {
      formRef.current?.setValue('data.posturalTolerances.sitting.unit', 'minutes');
      formRef.current?.setValue('data.posturalTolerances.standing.unit', 'hours');
    });

    expect(formRef.current?.getValues('data.posturalTolerances.sitting.unit')).toBe('minutes');
    expect(formRef.current?.getValues('data.posturalTolerances.standing.unit')).toBe('hours');
  });

  it('loads initial values correctly', async () => {
    const initialValues = {
      data: {
        posturalTolerances: {
          sitting: { duration: '45', unit: 'minutes', notes: 'Test note' },
          standing: { duration: '1', unit: 'hours', notes: 'Another note' }
        }
      }
    };

    render(<PosturalTolerances />, { initialValues });

    const duration = screen.getByTestId('input-sitting-duration');
    expect(duration).toHaveValue('45');
    
    expect(screen.getByTestId('select-sitting-unit')).toHaveValue('minutes');
    expect(screen.getByTestId('textarea-sitting-notes')).toHaveValue('Test note');
  });

  it('persists notes in textareas', async () => {
    const formRef = React.createRef<UseFormReturn<FormState>>();
    render(<PosturalTolerances />, { formRef });

    await act(async () => {
      formRef.current?.setValue('data.posturalTolerances.sitting.notes', 'Test sitting notes');
      formRef.current?.setValue('data.posturalTolerances.standing.notes', 'Test standing notes');
    });

    expect(formRef.current?.getValues('data.posturalTolerances.sitting.notes')).toBe('Test sitting notes');
    expect(formRef.current?.getValues('data.posturalTolerances.standing.notes')).toBe('Test standing notes');
  });

  it('validates unit selection options', async () => {
    const formRef = React.createRef<UseFormReturn<FormState>>();
    render(<PosturalTolerances />, { formRef });

    await act(async () => {
      await formRef.current?.reset({
        ...defaultFormState,
        data: {
          ...defaultFormState.data,
          posturalTolerances: {
            sitting: { duration: '30', unit: 'minutes', notes: '' },
            standing: { duration: '1', unit: 'hours', notes: '' }
          }
        }
      });
    });

    const values = formRef.current?.getValues();
    expect(values?.data.posturalTolerances.sitting.unit).toBe('minutes');
    expect(Object.keys(formRef.current?.formState.errors || {})).toHaveLength(0);
  });
});