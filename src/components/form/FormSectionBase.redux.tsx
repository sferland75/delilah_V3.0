'use client';

import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SectionWrapper } from '@/components/assessment/SectionWrapper';
import { Button } from '@/components/ui/button';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { Loader } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateSectionThunk } from '@/store/slices/assessmentSlice';
import { addToast } from '@/store/slices/uiSlice';

interface FormSectionBaseProps<T> {
  title: string;
  sectionId: string;
  schema: any;
  defaultValues: T;
  mapContextToForm: (contextData: any) => { formData: T; hasData: boolean };
  mapFormToContext: (formData: T) => any;
  formContent: (form: any, dataLoaded: boolean, isSaving: boolean) => React.ReactNode;
  nextSection?: string;
  previousSection?: string;
}

export function FormSectionBaseRedux<T>({
  title,
  sectionId,
  schema,
  defaultValues,
  mapContextToForm,
  mapFormToContext,
  formContent,
  nextSection,
  previousSection
}: FormSectionBaseProps<T>) {
  const dispatch = useAppDispatch();
  const currentData = useAppSelector(state => state.assessments.currentData);
  const saveStatus = useAppSelector(state => state.assessments.loading.save);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  
  // Initialize form with schema validation
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onChange"
  });
  
  // Map context data to form using useCallback to prevent recreation
  const mapContextToFormCallback = useCallback((contextData) => {
    try {
      return mapContextToForm(contextData);
    } catch (error) {
      console.error(`Error mapping context to form in ${sectionId}:`, error);
      return { formData: defaultValues, hasData: false };
    }
  }, [mapContextToForm, defaultValues, sectionId]);
  
  // Load data from Redux when component mounts
  useEffect(() => {
    setIsLoading(true);
    
    const sectionData = currentData[sectionId] || {};
    
    if (sectionData && Object.keys(sectionData).length > 0) {
      try {
        const { formData, hasData } = mapContextToFormCallback(sectionData);
        form.reset(formData);
        setDataLoaded(hasData);
      } catch (error) {
        console.error(`Error loading data for ${sectionId}:`, error);
        form.reset(defaultValues);
        setDataLoaded(false);
      }
    } else {
      form.reset(defaultValues);
      setDataLoaded(false);
    }
    
    setIsLoading(false);
  }, [currentData, sectionId, form, mapContextToFormCallback, defaultValues]);
  
  // Save form data to Redux
  const handleSave = async () => {
    try {
      setSaveError(null);
      setIsSaving(true);
      const formData = form.getValues();
      const contextData = mapFormToContext(formData);
      
      // Dispatch section update action
      await dispatch(updateSectionThunk({
        sectionName: sectionId,
        sectionData: contextData
      }));
      
      // Mark form as pristine after saving
      form.reset(formData);
      
      // Show success toast
      dispatch(addToast({
        title: "Saved Successfully",
        description: `${title} has been saved.`,
        type: "success"
      }));
      
      return true;
    } catch (error) {
      console.error(`Error saving data for ${sectionId}:`, error);
      setSaveError("Failed to save data. Please try again.");
      
      // Show error toast
      dispatch(addToast({
        title: "Save Failed",
        description: `Failed to save ${title}. Please try again.`,
        type: "error"
      }));
      
      return false;
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader className="h-6 w-6 animate-spin mr-2" />
        <span>Loading {title}...</span>
      </div>
    );
  }
  
  return (
    <ErrorBoundary>
      <SectionWrapper
        title={title}
        sectionId={sectionId}
        nextSection={nextSection}
        previousSection={previousSection}
        onSave={handleSave}
      >
        <div className="relative">
          {saveError && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{saveError}</AlertDescription>
            </Alert>
          )}
          
          {formContent(form, dataLoaded, isSaving || saveStatus === 'loading')}
          
          <div className="mt-6 flex justify-end">
            <Button 
              onClick={form.handleSubmit(handleSave)} 
              disabled={isSaving || saveStatus === 'loading' || !form.formState.isDirty}
              className="flex items-center gap-2"
            >
              {isSaving || saveStatus === 'loading' ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>Save {title}</>
              )}
            </Button>
          </div>
        </div>
      </SectionWrapper>
    </ErrorBoundary>
  );
}
