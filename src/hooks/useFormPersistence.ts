import { useState, useCallback } from 'react';
import type { UseFormReturn } from 'react-hook-form';

export interface FormPersistenceReturn {
  persist: (data: any) => Promise<void>;
  loading: boolean;
  error: Error | null;
}

export const useFormPersistence = (form: UseFormReturn<any>): FormPersistenceReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const persist = useCallback(async (data: any) => {
    try {
      setLoading(true);
      setError(null);
      // Persistence logic would go here
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { persist, loading, error };
};

export default useFormPersistence;