'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Sun, Clock, Moon, History, Check, InfoIcon } from 'lucide-react';
import { useAssessment } from '@/contexts/AssessmentContext';
import { typicalDaySchema, defaultFormState } from '../schema';
import { TimeBlock } from './TimeBlock';
import SleepSchedule from './SleepSchedule';
import { mapContextToForm, mapFormToContext } from '@/services/typicalDayMapper';
import { ErrorBoundary } from "@/components/ui/error-boundary";
import type { TypicalDay as TypicalDayType } from '../schema';

// For debugging
console.log("[TypicalDay.integrated.tsx] Component loaded");

export function TypicalDayIntegrated() {
  console.log("[TypicalDayIntegrated] Component rendering");
  
  const { data, updateSection } = useAssessment();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  
  // Log what we have
  console.log("[TypicalDayIntegrated] Assessment context data:", data);
  console.log("[TypicalDayIntegrated] typicalDay data:", data?.typicalDay);
  
  // Initialize form with schema validation
  const methods = useForm<TypicalDayType>({
    resolver: zodResolver(typicalDaySchema),
    defaultValues: defaultFormState
  });

  // Log form state
  console.log("[TypicalDayIntegrated] Form methods:", methods);

  // Load data from context when component mounts or context data changes
  useEffect(() => {
    try {
      console.log("[TypicalDayIntegrated] useEffect for data loading");
      const contextData = data?.typicalDay || {};
      
      if (contextData && Object.keys(contextData).length > 0) {
        console.log("[TypicalDayIntegrated] Loading typical day data:", contextData);
        const { formData, hasData } = mapContextToForm(contextData);
        
        console.log("[TypicalDayIntegrated] Mapped form data:", formData);
        console.log("[TypicalDayIntegrated] Has data:", hasData);
        
        if (hasData) {
          methods.reset(formData);
          setDataLoaded(true);
        }
      }
    } catch (error) {
      console.error("[TypicalDayIntegrated] Error loading typical day data:", error);
    }
  }, [data?.typicalDay, methods]);

  const { formState: { errors, isDirty } } = methods;
  
  console.log("[TypicalDayIntegrated] Form errors:", errors);
  console.log("[TypicalDayIntegrated] Form isDirty:", isDirty);
  
  // Form submission handler with proper context update
  const onSubmit = useCallback((formData: TypicalDayType) => {
    try {
      console.log('[TypicalDayIntegrated] Submitting form data:', formData);
      
      // Convert form data to the structure expected by the context
      const contextData = mapFormToContext(formData);
      console.log('[TypicalDayIntegrated] Mapped to context data:', contextData);
      
      // Update the context with the form data
      updateSection('typicalDay', contextData);
      
      // Show success message
      setSaveSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("[TypicalDayIntegrated] Error saving typical day data:", error);
    }
  }, [updateSection]);

  console.log("[TypicalDayIntegrated] Rendering component UI");

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-slate-800">Typical Day</h2>
          <p className="text-sm text-muted-foreground mt-1">Compare pre and post-accident daily activities</p>
        </div>
        
        {/* Data loaded notification */}
        {dataLoaded && (
          <Alert className="mb-6 bg-blue-50 text-blue-800 border-blue-200">
            <InfoIcon className="h-4 w-4 text-blue-800" />
            <AlertTitle>Data Loaded From Assessment</AlertTitle>
            <AlertDescription>
              Typical day information has been pre-populated from existing data. Please review and adjust as needed.
            </AlertDescription>
          </Alert>
        )}

        {/* Success notification */}
        {saveSuccess && (
          <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
            <Check className="h-4 w-4 text-green-800" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Typical day information has been saved successfully.
            </AlertDescription>
          </Alert>
        )}

        {/* Instruction box */}
        <Alert className="mb-6 bg-slate-50 border-slate-200">
          <AlertDescription className="text-slate-700">
            Document typical daily activities including:
            <ul className="list-disc pl-5 mt-2">
              <li>Morning routines and activities</li>
              <li>Afternoon tasks and responsibilities</li>
              <li>Evening activities and habits</li>
              <li>Night time routines</li>
              <li>Sleep schedule (regular or irregular)</li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* Form */}
        <FormProvider {...methods}>
          <form className="space-y-6" onSubmit={methods.handleSubmit(onSubmit)}>
            {isDirty && (
              <Alert className="bg-yellow-50 border-yellow-200">
                <AlertDescription className="text-yellow-800">
                  You have unsaved changes
                </AlertDescription>
              </Alert>
            )}

            {/* Pre/Post Accident Tabs */}
            <Tabs 
              defaultValue={methods.getValues("config.activeTab")} 
              onValueChange={(value) => {
                console.log("[TypicalDayIntegrated] Tab changed to:", value);
                methods.setValue("config.activeTab", value as "preAccident" | "postAccident");
              }}
              className="w-full border rounded-md"
            >
              <TabsList className="grid w-full grid-cols-2 p-0 h-auto border-b">
                <TabsTrigger 
                  value="preAccident"
                  className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600"
                >
                  <div className="flex items-center gap-2">
                    <History className="h-4 w-4" />
                    <span>Pre-Accident</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="postAccident"
                  className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600"
                >
                  <div className="flex items-center gap-2">
                    <History className="h-4 w-4" />
                    <span>Post-Accident</span>
                  </div>
                </TabsTrigger>
              </TabsList>

              {/* Tab Content for Pre and Post Accident */}
              {['preAccident', 'postAccident'].map((timeframe) => (
                <TabsContent key={timeframe} value={timeframe} className="p-6">
                  {/* Sleep Schedule */}
                  <ErrorBoundary>
                    <SleepSchedule timeframe={timeframe as 'preAccident' | 'postAccident'} />
                  </ErrorBoundary>
                  
                  {/* Daily Activities */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <ErrorBoundary>
                      <TimeBlock
                        title="Morning"
                        period="morning"
                        timeframe={timeframe as 'preAccident' | 'postAccident'}
                        icon={<Sun className="h-5 w-5" />}
                      />
                    </ErrorBoundary>
                    
                    <ErrorBoundary>
                      <TimeBlock
                        title="Afternoon"
                        period="afternoon"
                        timeframe={timeframe as 'preAccident' | 'postAccident'}
                        icon={<Clock className="h-5 w-5" />}
                      />
                    </ErrorBoundary>

                    <ErrorBoundary>
                      <TimeBlock
                        title="Evening"
                        period="evening"
                        timeframe={timeframe as 'preAccident' | 'postAccident'}
                        icon={<Sun className="h-5 w-5 rotate-180" />}
                      />
                    </ErrorBoundary>

                    <ErrorBoundary>
                      <TimeBlock
                        title="Night"
                        period="night"
                        timeframe={timeframe as 'preAccident' | 'postAccident'}
                        icon={<Moon className="h-5 w-5" />}
                      />
                    </ErrorBoundary>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
            
            {/* Form Action Buttons */}
            <div className="flex justify-end space-x-2 mt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  console.log("[TypicalDayIntegrated] Reset button clicked");
                  methods.reset(defaultFormState);
                }}
                type="button"
              >
                Reset
              </Button>
              <Button 
                type="submit"
                disabled={!isDirty}
              >
                Save Typical Day
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </ErrorBoundary>
  );
}

// Add default export
export default TypicalDayIntegrated;