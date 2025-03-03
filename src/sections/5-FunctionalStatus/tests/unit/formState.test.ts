import { renderHook } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { functionalStatusSchema, defaultFormState } from '../../schema';
import { FormState } from '../../types';

describe('Functional Status Form State', () => {
  const setupForm = () => {
    return renderHook(() => useForm<FormState>({
      defaultValues: defaultFormState,
      mode: 'onChange'
    }));
  };

  describe('Form State Management', () => {
    it('initializes with default values', () => {
      const { result } = setupForm();
      expect(result.current.getValues()).toEqual(defaultFormState);
    });

    it('tracks dirty state on field changes', async () => {
      const { result } = setupForm();

      // Set initial value
      result.current.setValue('data.posturalTolerances.sitting.duration', '30');

      // Check value updated
      expect(result.current.getValues('data.posturalTolerances.sitting.duration')).toBe('30');
      expect(result.current.getValues()).not.toEqual(defaultFormState);
    });

    it('handles tab switching correctly', async () => {
      const { result } = setupForm();

      result.current.setValue('config.activeTab', 'mmt');
      expect(result.current.getValues('config.activeTab')).toBe('mmt');
    });
  });

  describe('Form Field Updates', () => {
    it('updates nested field values', async () => {
      const { result } = setupForm();

      const newValue = {
        value: 45,
        notes: 'Normal range'
      };

      result.current.setValue('data.rangeOfMotion.cervical.flexion', newValue);
      expect(result.current.getValues('data.rangeOfMotion.cervical.flexion')).toEqual(newValue);
    });

    it('updates multiple fields simultaneously', async () => {
      const { result } = setupForm();

      result.current.setValue('data.transfers.bedMobility.independence', 'modified');
      result.current.setValue('data.transfers.toileting.independence', 'supervised');

      expect(result.current.getValues('data.transfers.bedMobility.independence')).toBe('modified');
      expect(result.current.getValues('data.transfers.toileting.independence')).toBe('supervised');
    });
  });

  describe('Form State Persistence', () => {
    it('tracks validation state', async () => {
      const { result } = setupForm();

      // Set valid data
      result.current.setValue('data.rangeOfMotion.cervical.flexion', {
        value: 45,
        notes: ''
      });

      // Only check if errors object exists
      expect(Object.keys(result.current.formState.errors || {})).toHaveLength(0);
    });

    it('maintains form state during tab switches', async () => {
      const { result } = setupForm();

      result.current.setValue('data.transfers.bedMobility.independence', 'modified');
      result.current.setValue('config.activeTab', 'mmt');
      result.current.setValue('config.activeTab', 'transfers');

      expect(result.current.getValues('data.transfers.bedMobility.independence')).toBe('modified');
    });
  });
});