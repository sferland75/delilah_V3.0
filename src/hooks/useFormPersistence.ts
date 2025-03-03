import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useAssessment } from '@/contexts/AssessmentContext';

export function useFormPersistence<T>(methods: UseFormReturn<T>, sectionKey: string) {
  const { data, updateSection } = useAssessment();

  // Load initial data
  useEffect(() => {
    const sectionData = data[sectionKey];
    if (sectionData) {
      Object.keys(sectionData).forEach(field => {
        methods.setValue(field as any, sectionData[field]);
      });
    }
  }, []);

  // Subscribe to form changes - debounce update to avoid infinite loops
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const subscription = methods.watch((value) => {
      // Clear previous timeout
      if (timeout) clearTimeout(timeout);
      
      // Set a new timeout to debounce updates
      timeout = setTimeout(() => {
        updateSection(sectionKey, value);
      }, 500); // 500ms debounce
    });
    
    // Cleanup
    return () => {
      subscription.unsubscribe();
      if (timeout) clearTimeout(timeout);
    };
  }, [methods.watch, updateSection, sectionKey]);

  return {
    persistForm: (data: T) => updateSection(sectionKey, data)
  };
}