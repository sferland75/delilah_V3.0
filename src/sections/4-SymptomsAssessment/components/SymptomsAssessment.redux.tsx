'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Form } from '@/components/ui/form';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, InfoIcon, Download, Upload } from 'lucide-react';
import { PhysicalSymptomsSectionUpdated } from './PhysicalSymptomsSection.updated';
import { CognitiveSymptomsSectionUpdated } from './CognitiveSymptomsSection.updated';
import { EmotionalSymptomsSection } from './EmotionalSymptomsSection';
import { GeneralNotesSection } from './GeneralNotesSection';
import { 
  symptomsSchemaUpdated, 
  SymptomsUpdated,
} from '../schema.updated';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateSectionThunk, saveCurrentAssessmentThunk } from '@/store/slices/assessmentSlice';
import { addToast } from '@/store/slices/uiSlice';
import { 
  mapContextToForm, 
  mapFormToContext,
  exportSymptomsToJson,
  importSymptomsFromJson,
  defaultValues as defaultValuesUpdated
} from '@/services/symptomsAssessmentMapper';

export function SymptomsAssessmentRedux() {
  const dispatch = useAppDispatch();
  const currentData = useAppSelector(state => state.assessments.currentData);
  const saveStatus = useAppSelector(state => state.assessments.loading.save);
  
  const [dataLoaded, setDataLoaded] = useState(false);
  const fileInputRef = useRef(null);
  const initialLoadRef = useRef(false);
  
  // Access the symptoms assessment data from Redux store
  const contextData = currentData?.symptomsAssessment || {};
  
  // Create mapContextToForm callback to prevent re-renders
  const mapContextToFormCallback = useCallback((data) => {
    try {
      return mapContextToForm(data);
    } catch (error) {
      console.error("SymptomsAssessment Redux - Error mapping context to form:", error);
      return { formData: defaultValuesUpdated, hasData: false };
    }
  }, []);
  
  // Define form with static default values
  const form = useForm<SymptomsUpdated>({
    resolver: zodResolver(symptomsSchemaUpdated),
    defaultValues: defaultValuesUpdated,
    mode: "onChange"
  });

  // For form persistence
  const { persistForm } = useFormPersistence(form, 'symptoms-updated');

  // Update form when Redux state changes
  useEffect(() => {
    if (contextData && Object.keys(contextData).length > 0 && !initialLoadRef.current) {
      try {
        console.log("SymptomsAssessment Redux - Context data detected, mapping to form");
        const { formData, hasData } = mapContextToFormCallback(contextData);
        form.reset(formData);
        setDataLoaded(hasData);
        initialLoadRef.current = true;
      } catch (error) {
        console.error("SymptomsAssessment Redux - Error updating form from Redux state:", error);
      }
    } else if (!initialLoadRef.current) {
      console.log("SymptomsAssessment Redux - No data or empty object");
      initialLoadRef.current = true;
    }
  }, [contextData, form, mapContextToFormCallback]);

  const onSubmit = async (formData: SymptomsUpdated) => {
    try {
      console.log('SymptomsAssessment Redux - Form data being submitted:', formData);
      
      // Map form data to context structure
      const symptomsData = mapFormToContext(formData);
      
      // Update the Redux store with the form data
      await dispatch(updateSectionThunk({
        sectionName: 'symptomsAssessment',
        sectionData: symptomsData
      }));
      
      // Save the assessment
      const saveResult = await dispatch(saveCurrentAssessmentThunk());
      
      // Also persist the form data
      persistForm(formData);
      
      if (saveCurrentAssessmentThunk.fulfilled.match(saveResult)) {
        dispatch(addToast({
          title: "Symptoms Assessment Saved",
          description: "Symptoms assessment has been saved successfully.",
          type: "success"
        }));
      } else {
        dispatch(addToast({
          title: "Save Failed",
          description: "There was an error saving the symptoms assessment.",
          type: "error"
        }));
      }
    } catch (error) {
      console.error("SymptomsAssessment Redux - Error preparing data for Redux update:", error);
      dispatch(addToast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        type: "error"
      }));
    }
  };
  
  // Handle import from JSON
  const handleImportJson = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const jsonString = e.target.result;
        const importedData = importSymptomsFromJson(jsonString);
        if (importedData) {
          const { formData, hasData } = mapContextToFormCallback(importedData);
          form.reset(formData);
          setDataLoaded(hasData);
          
          // Update Redux with imported data
          await dispatch(updateSectionThunk({
            sectionName: 'symptomsAssessment',
            sectionData: importedData
          }));
          
          dispatch(addToast({
            title: "Import Successful",
            description: "Symptoms Assessment data imported successfully!",
            type: "success"
          }));
        }
      } catch (error) {
        console.error("Error importing JSON:", error);
        dispatch(addToast({
          title: "Import Failed",
          description: "Error importing JSON. Please check the file format.",
          type: "error"
        }));
      }
    };
    reader.readAsText(file);
  };
  
  // Handle export of form data to a downloadable file
  const handleDownloadJson = () => {
    const formData = form.getValues();
    const contextFormattedData = mapFormToContext(formData);
    const jsonString = exportSymptomsToJson(contextFormattedData);
    
    // Create a blob and download link
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'symptoms_assessment_export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    dispatch(addToast({
      title: "Export Successful",
      description: "Symptoms Assessment data exported successfully!",
      type: "success"
    }));
  };

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-800">Symptoms Assessment</h2>
            <p className="text-sm text-muted-foreground mt-1">Comprehensive evaluation of symptoms and their impact</p>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadJson}
              className="flex items-center gap-1"
              disabled={saveStatus === 'loading'}
            >
              <Download className="h-4 w-4" />
              Export JSON
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => fileInputRef.current?.click()}
              disabled={saveStatus === 'loading'}
            >
              <Upload className="h-4 w-4" />
              Import JSON
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportJson}
              className="hidden"
            />
          </div>
        </div>

        {dataLoaded && (
          <Alert className="mb-6 bg-blue-50 text-blue-800 border-blue-200">
            <InfoIcon className="h-4 w-4 text-blue-800" />
            <AlertTitle>Data Loaded From Assessment</AlertTitle>
            <AlertDescription>
              Symptoms information has been pre-populated from previous assessments. Please review and adjust as needed.
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
            <FormProvider {...form}>
              <Tabs defaultValue="physical" className="w-full border rounded-md">
                <TabsList className="grid w-full grid-cols-4 p-0 h-auto border-b">
                  <TabsTrigger 
                    className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
                    value="physical"
                  >
                    Physical
                  </TabsTrigger>
                  <TabsTrigger 
                    className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
                    value="cognitive"
                  >
                    Cognitive
                  </TabsTrigger>
                  <TabsTrigger 
                    className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
                    value="emotional"
                  >
                    Emotional
                  </TabsTrigger>
                  <TabsTrigger 
                    className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
                    value="general"
                  >
                    General
                  </TabsTrigger>
                </TabsList>

                <ErrorBoundary>
                  <TabsContent value="physical" className="p-6">
                    <PhysicalSymptomsSectionUpdated />
                  </TabsContent>
                </ErrorBoundary>
                
                <ErrorBoundary>
                  <TabsContent value="cognitive" className="p-6">
                    <CognitiveSymptomsSectionUpdated />
                  </TabsContent>
                </ErrorBoundary>
                
                <ErrorBoundary>
                  <TabsContent value="emotional" className="p-6">
                    <EmotionalSymptomsSection />
                  </TabsContent>
                </ErrorBoundary>
                
                <ErrorBoundary>
                  <TabsContent value="general" className="p-6">
                    <GeneralNotesSection />
                  </TabsContent>
                </ErrorBoundary>
              </Tabs>
            </FormProvider>

            <div className="flex justify-end space-x-2 mt-4">
              <Button 
                variant="outline" 
                onClick={() => form.reset(defaultValuesUpdated)}
                type="button"
                disabled={saveStatus === 'loading'}
              >
                Reset
              </Button>
              <Button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={saveStatus === 'loading'}
              >
                {saveStatus === 'loading' ? 'Saving...' : 'Save Symptoms Assessment'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </ErrorBoundary>
  );
}