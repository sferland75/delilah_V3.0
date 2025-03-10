'use client';

import React, { useEffect, useState } from 'react';
import { Form } from '@/components/ui/form';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RangeOfMotion } from './RangeOfMotion';
import { ManualMuscle } from './ManualMuscle';
import { BergBalance } from './BergBalance';
import { PosturalTolerances } from './PosturalTolerances';
import { TransfersAssessment } from './TransfersAssessment';
import { functionalStatusSchema, defaultFormState } from '../schema';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import { useAssessment } from '@/contexts/AssessmentContext';
import type { FormState } from '../types';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, CheckCircle } from "lucide-react";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { mapAndPrepareContextData, prepareDataForContext } from '../helpers/functionalStatusDataMapper';

export function FunctionalStatusIntegrated() {
  try {
    // Safe context access with error handling
    const { data, updateSection } = useAssessment();
    const contextData = data?.functionalStatus || {};
    const [dataLoaded, setDataLoaded] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
    
    console.log("[FunctionalStatusIntegrated] Component rendering");
    console.log("[FunctionalStatusIntegrated] Initial context data:", contextData);

    // Form setup with error handling
    const form = useForm<FormState>({
      resolver: zodResolver(functionalStatusSchema),
      defaultValues: defaultFormState,
      mode: "onChange"
    });

    // Update form when context data changes
    useEffect(() => {
      try {
        console.log("[FunctionalStatusIntegrated] useEffect for data loading");
        if (contextData && Object.keys(contextData).length > 0) {
          console.log("[FunctionalStatusIntegrated] Loading data from context");
          const { formData, hasData } = mapAndPrepareContextData(contextData);
          
          if (hasData) {
            console.log("[FunctionalStatusIntegrated] Setting form data:", formData);
            form.reset(formData);
            setDataLoaded(true);
          }
        }
      } catch (error) {
        console.error("[FunctionalStatusIntegrated] Error loading context data:", error);
      }
    }, [contextData]);

    // Use form persistence
    try {
      useFormPersistence(form, 'functional-status');
    } catch (error) {
      console.error("[FunctionalStatusIntegrated] Error with form persistence:", error);
    }

    // Form submission handler
    const onSubmit = (formData: FormState) => {
      try {
        console.log('[FunctionalStatusIntegrated] Submitting form data:', formData);
        
        // Convert form data to context structure
        const contextData = prepareDataForContext(formData);
        console.log('[FunctionalStatusIntegrated] Prepared context data:', contextData);
        
        // Update the context
        updateSection('functionalStatus', contextData);
        
        // Show success message
        setSaveSuccess(true);
        
        // Hide after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } catch (error) {
        console.error("[FunctionalStatusIntegrated] Error saving data:", error);
      }
    };

    const { formState: { isDirty } } = form;

    return (
      <ErrorBoundary>
        <div className="space-y-6">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold text-slate-800">Functional Status Assessment</h2>
            <p className="text-sm text-muted-foreground mt-1">Comprehensive evaluation of functional abilities and limitations</p>
          </div>
          
          {dataLoaded && (
            <Alert className="mb-6 bg-blue-50 text-blue-800 border-blue-200">
              <InfoIcon className="h-4 w-4 text-blue-800" />
              <AlertTitle>Data Loaded</AlertTitle>
              <AlertDescription>
                Form fields have been pre-populated with data from the assessment context.
              </AlertDescription>
            </Alert>
          )}
          
          {saveSuccess && (
            <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-800" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                Functional status information has been saved successfully.
              </AlertDescription>
            </Alert>
          )}
          
          {isDirty && (
            <Alert className="mb-6 bg-yellow-50 border-yellow-200">
              <AlertDescription className="text-yellow-800">
                You have unsaved changes
              </AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
              <FormProvider {...form}>
                <Tabs defaultValue="rom" className="w-full border rounded-md">
                  <TabsList className="grid w-full grid-cols-5 p-0 h-auto border-b">
                    <TabsTrigger 
                      className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
                      value="rom"
                    >
                      Range of Motion
                    </TabsTrigger>
                    <TabsTrigger 
                      className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
                      value="mmt"
                    >
                      Manual Muscle
                    </TabsTrigger>
                    <TabsTrigger 
                      className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
                      value="berg"
                    >
                      Berg Balance
                    </TabsTrigger>
                    <TabsTrigger 
                      className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
                      value="postural"
                    >
                      Postural Tolerances
                    </TabsTrigger>
                    <TabsTrigger 
                      className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
                      value="transfers"
                    >
                      Transfers
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="rom" className="p-6">
                    <ErrorBoundary>
                      <RangeOfMotion />
                    </ErrorBoundary>
                  </TabsContent>
                  
                  <TabsContent value="mmt" className="p-6">
                    <ErrorBoundary>
                      <ManualMuscle />
                    </ErrorBoundary>
                  </TabsContent>
                  
                  <TabsContent value="berg" className="p-6">
                    <ErrorBoundary>
                      <BergBalance />
                    </ErrorBoundary>
                  </TabsContent>
                  
                  <TabsContent value="postural" className="p-6">
                    <ErrorBoundary>
                      <PosturalTolerances />
                    </ErrorBoundary>
                  </TabsContent>
                  
                  <TabsContent value="transfers" className="p-6">
                    <ErrorBoundary>
                      <TransfersAssessment />
                    </ErrorBoundary>
                  </TabsContent>
                </Tabs>
              </FormProvider>

              <div className="flex justify-end space-x-2 mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    console.log("[FunctionalStatusIntegrated] Reset button clicked");
                    form.reset(defaultFormState);
                  }}
                  type="button"
                >
                  Reset
                </Button>
                <Button 
                  type="submit"
                  disabled={!isDirty}
                >
                  Save Functional Status
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error("[FunctionalStatusIntegrated] Error rendering component:", error);
    return (
      <Alert className="mb-6 bg-red-50 text-red-800 border-red-200">
        <InfoIcon className="h-4 w-4 text-red-800" />
        <AlertDescription>
          An error occurred while rendering the Functional Status component. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }
}

export default FunctionalStatusIntegrated;