import { renderHook, act } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { useFormPersistence } from './useFormPersistence';

describe('useFormPersistence', () => {
  const STORAGE_KEY = 'delilah_assessment_draft';
  
  beforeEach(() => {
    localStorage.clear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('loads saved data on mount', () => {
    const savedData = {
      demographics: {
        firstName: 'John',
        lastName: 'Doe'
      }
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedData));

    const { result } = renderHook(() => {
      const form = useForm({
        defaultValues: {
          demographics: {
            firstName: '',
            lastName: ''
          }
        }
      });
      const persistence = useFormPersistence(form);
      return { form, persistence };
    });

    expect(result.current.form.getValues()).toEqual(savedData);
  });

  it('saves form data on change', () => {
    const { result } = renderHook(() => {
      const form = useForm({
        defaultValues: {
          demographics: {
            firstName: '',
            lastName: ''
          }
        }
      });
      const persistence = useFormPersistence(form);
      return { form, persistence };
    });

    act(() => {
      result.current.form.setValue('demographics.firstName', 'John');
    });

    // Fast-forward debounce timer
    jest.runAllTimers();

    const savedData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    expect(savedData.demographics.firstName).toBe('John');
  });

  it('clears saved data', () => {
    const savedData = {
      demographics: {
        firstName: 'John',
        lastName: 'Doe'
      }
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedData));

    const { result } = renderHook(() => {
      const form = useForm();
      const persistence = useFormPersistence(form);
      return { form, persistence };
    });

    act(() => {
      result.current.persistence.clearSavedData();
    });

    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});