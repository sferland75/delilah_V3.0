import React from 'react';
import { render, screen, act, setFieldValue } from '../utils/test-utils';
import { FunctionalStatus } from '../../FunctionalStatus';
import { UseFormReturn } from 'react-hook-form';
import { FormState } from '../../types';

describe('Functional Status Tab Navigation', () => {
  it('shows correct tab layout', () => {
    render(<FunctionalStatus />);

    expect(screen.getByRole('tab', { name: /range of motion/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /manual muscle/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /berg balance/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /postural tolerances/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /transfers/i })).toBeInTheDocument();
  });

  it('switches content when tabs are clicked', async () => {
    const formRef = React.createRef<UseFormReturn<FormState>>();
    render(<FunctionalStatus />, { formRef });

    // Switch to Postural Tolerances
    await setFieldValue(formRef, 'config.activeTab', 'posturalTolerances');
    expect(screen.getByText(/sitting tolerance/i)).toBeInTheDocument();

    // Switch to Transfers
    await setFieldValue(formRef, 'config.activeTab', 'transfers');
    expect(screen.getByText(/bed mobility/i)).toBeInTheDocument();
  });

  it('updates form state when changing tabs', async () => {
    const formRef = React.createRef<UseFormReturn<FormState>>();
    render(<FunctionalStatus />, { formRef });

    // Initial tab should be ROM
    expect(formRef.current?.getValues('config.activeTab')).toBe('rom');

    // Switch to Manual Muscle Testing
    await setFieldValue(formRef, 'config.activeTab', 'mmt');
    
    // Wait for state update
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(formRef.current?.getValues('config.activeTab')).toBe('mmt');
  });

  it('maintains header visibility across tab changes', async () => {
    const formRef = React.createRef<UseFormReturn<FormState>>();
    render(<FunctionalStatus />, { formRef });

    const header = screen.getByText(/functional status assessment/i);
    expect(header).toBeVisible();

    // Switch tabs and verify header
    await setFieldValue(formRef, 'config.activeTab', 'mmt');
    expect(header).toBeVisible();

    await setFieldValue(formRef, 'config.activeTab', 'berg');
    expect(header).toBeVisible();
  });

  it('preserves form data between tab switches', async () => {
    const formRef = React.createRef<UseFormReturn<FormState>>();
    render(<FunctionalStatus />, { formRef });

    // Set data in first tab
    await setFieldValue(formRef, 'data.posturalTolerances.sitting.duration', '45');
    
    // Switch tabs
    await setFieldValue(formRef, 'config.activeTab', 'transfers');
    await setFieldValue(formRef, 'config.activeTab', 'posturalTolerances');

    // Verify data persists
    expect(formRef.current?.getValues('data.posturalTolerances.sitting.duration')).toBe('45');
  });
});