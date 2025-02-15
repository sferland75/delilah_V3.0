import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { debounce } from '@/lib/utils';

const STORAGE_KEY = 'delilah_assessment_draft';

export function useFormPersistence<T>(form: UseFormReturn<T>) {
  const { watch, reset } = form;

  // Load saved data on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        reset(parsedData);
      } catch (error) {
        console.error('Error loading saved form data:', error);
      }
    }
  }, [reset]);

  // Save data on change
  useEffect(() => {
    const saveData = debounce((data: T) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        console.error('Error saving form data:', error);
      }
    }, 1000);

    const subscription = watch((data) => {
      saveData(data as T);
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  return {
    clearSavedData: () => localStorage.removeItem(STORAGE_KEY),
  };
}