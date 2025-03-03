import React from 'react';
import { render, screen, act } from '../utils/test-utils';
import { TransfersAssessment } from '../../components/TransfersAssessment';
import { UseFormReturn } from 'react-hook-form';
import { FormState } from '../../types';
import { defaultFormState } from '../../schema';

describe('TransfersAssessment', () => {
  it('renders all required fields', () => {
    render(<TransfersAssessment />);
    expect(screen.getByText(/bed mobility/i)).toBeInTheDocument();
    expect(screen.getByTestId('select-bed-independence')).toBeInTheDocument();
    expect(screen.getByTestId('textarea-bed-notes')).toBeInTheDocument();
  });

  it('displays correct section headers', () => {
    render(<TransfersAssessment />);
    expect(screen.getByRole('heading', { name: /bed mobility/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /toileting/i })).toBeInTheDocument();
  });

  it('allows selecting independence levels', async () => {
    const formRef = React.createRef<UseFormReturn<FormState>>();
    render(<TransfersAssessment />, { formRef });

    await act(async () => {
      formRef.current?.setValue('data.transfers.bedMobility.independence', 'modified');
      formRef.current?.setValue('data.transfers.toileting.independence', 'supervised');
    });

    expect(formRef.current?.getValues('data.transfers.bedMobility.independence')).toBe('modified');
    expect(formRef.current?.getValues('data.transfers.toileting.independence')).toBe('supervised');
  });

  it('loads initial values correctly', () => {
    const initialValues = {
      data: {
        transfers: {
          bedMobility: { independence: 'modified', notes: 'Test note' },
          toileting: { independence: 'supervised', notes: 'Another note' }
        }
      }
    };

    render(<TransfersAssessment />, { initialValues });

    expect(screen.getByTestId('select-bed-independence')).toHaveValue('modified');
    expect(screen.getByTestId('textarea-bed-notes')).toHaveValue('Test note');
    expect(screen.getByTestId('select-toilet-independence')).toHaveValue('supervised');
    expect(screen.getByTestId('textarea-toilet-notes')).toHaveValue('Another note');
  });

  it('persists notes in textareas', async () => {
    const formRef = React.createRef<UseFormReturn<FormState>>();
    render(<TransfersAssessment />, { formRef });

    await act(async () => {
      formRef.current?.setValue('data.transfers.bedMobility.notes', 'Test bed notes');
      formRef.current?.setValue('data.transfers.toileting.notes', 'Test toilet notes');
    });

    expect(formRef.current?.getValues('data.transfers.bedMobility.notes')).toBe('Test bed notes');
    expect(formRef.current?.getValues('data.transfers.toileting.notes')).toBe('Test toilet notes');
  });

  it('validates independence level selection', async () => {
    const formRef = React.createRef<UseFormReturn<FormState>>();
    render(<TransfersAssessment />, { formRef });

    await act(async () => {
      await formRef.current?.reset({
        ...defaultFormState,
        data: {
          ...defaultFormState.data,
          transfers: {
            bedMobility: { independence: 'modified', notes: '' },
            toileting: { independence: 'supervised', notes: '' }
          }
        }
      });
    });

    const values = formRef.current?.getValues();
    expect(values?.data.transfers.bedMobility.independence).toBe('modified');
    expect(Object.keys(formRef.current?.formState.errors || {})).toHaveLength(0);
  });
});