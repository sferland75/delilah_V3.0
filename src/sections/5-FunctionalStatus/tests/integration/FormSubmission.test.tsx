import React from 'react';
import { render, screen, act, setFieldValue } from '../utils/test-utils';
import { FunctionalStatus } from '../../FunctionalStatus';
import { UseFormReturn } from 'react-hook-form';
import { FormState } from '../../types';

describe('Functional Status Form Submission', () => {
  it('completes full functional status workflow', async () => {
    const formRef = React.createRef<UseFormReturn<FormState>>();
    render(<FunctionalStatus />, { formRef });

    // Postural Tolerances section
    await setFieldValue(formRef, 'config.activeTab', 'posturalTolerances');
    await setFieldValue(formRef, 'data.posturalTolerances.sitting.duration', '45');
    await setFieldValue(formRef, 'data.posturalTolerances.sitting.unit', 'minutes');
    await setFieldValue(formRef, 'data.posturalTolerances.sitting.notes', 'Good sitting tolerance');

    // Transfers section
    await setFieldValue(formRef, 'config.activeTab', 'transfers');
    await setFieldValue(formRef, 'data.transfers.bedMobility.independence', 'modified');
    await setFieldValue(formRef, 'data.transfers.bedMobility.notes', 'Uses rail for support');

    // Verify data persistence
    expect(formRef.current?.getValues('data.posturalTolerances.sitting.duration')).toBe('45');
    expect(formRef.current?.getValues('data.posturalTolerances.sitting.unit')).toBe('minutes');
    expect(formRef.current?.getValues('data.transfers.bedMobility.independence')).toBe('modified');
  });

  it('preserves data between tab switches', async () => {
    const formRef = React.createRef<UseFormReturn<FormState>>();
    render(<FunctionalStatus />, { formRef });

    // Set data and switch tabs
    await setFieldValue(formRef, 'config.activeTab', 'posturalTolerances');
    await setFieldValue(formRef, 'data.posturalTolerances.sitting.duration', '45');
    
    await setFieldValue(formRef, 'config.activeTab', 'transfers');
    await setFieldValue(formRef, 'config.activeTab', 'posturalTolerances');

    // Verify data persists
    expect(formRef.current?.getValues('data.posturalTolerances.sitting.duration')).toBe('45');
  });

  it('handles tab switching without data loss', async () => {
    const formRef = React.createRef<UseFormReturn<FormState>>();
    render(<FunctionalStatus />, { formRef });

    // Fill data in multiple tabs
    await setFieldValue(formRef, 'config.activeTab', 'posturalTolerances');
    await setFieldValue(formRef, 'data.posturalTolerances.sitting.duration', '45');
    
    await setFieldValue(formRef, 'config.activeTab', 'transfers');
    await setFieldValue(formRef, 'data.transfers.bedMobility.independence', 'modified');

    // Verify all data persists
    expect(formRef.current?.getValues('data.posturalTolerances.sitting.duration')).toBe('45');
    expect(formRef.current?.getValues('data.transfers.bedMobility.independence')).toBe('modified');
  });
});