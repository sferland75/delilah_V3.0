'use client';

import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Sun, Clock, Moon, History, History2 } from 'lucide-react';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import { useAssessment } from '@/contexts/AssessmentContext';
import { typicalDaySchema, defaultFormState } from '../schema';
import { TimeBlock } from './TimeBlock';
import type { TypicalDay as TypicalDayType } from '../schema';

export function TypicalDay() {
  const { data, updateSection } = useAssessment();
  const contextData = data.typicalDay || {};
  
  const methods = useForm<TypicalDayType>({
    resolver: zodResolver(typicalDaySchema),
    defaultValues: defaultFormState
  });

  // Map context data to form structure if available
  useEffect(() => {
    if (contextData && Object.keys(contextData).length > 0) {
      console.log("Typical day context data:", contextData);
      
      const updatedFormData = { ...methods.getValues() };
      
      // Map morning routine to the post-accident morning section
      if (contextData.morningRoutine) {
        updatedFormData.postAccident.morning.activities = contextData.morningRoutine;
      }
      
      // Map daytime activities to the post-accident afternoon section
      if (contextData.daytimeActivities) {
        updatedFormData.postAccident.afternoon.activities = contextData.daytimeActivities;
      }
      
      // Map evening routine to the post-accident evening section
      if (contextData.eveningRoutine) {
        updatedFormData.postAccident.evening.activities = contextData.eveningRoutine;
      }
      
      methods.reset(updatedFormData);
    }
  }, [contextData, methods]);

  useFormPersistence(methods, 'typical-day');

  const { formState: { errors, isDirty } } = methods;
  
  const onSubmit = (formData: TypicalDayType) => {
    console.log('Form data:', formData);
    
    // Convert form data to the structure expected by the context
    const typicalDayData = {
      morningRoutine: formData.postAccident.morning.activities,
      daytimeActivities: formData.postAccident.afternoon.activities,
      eveningRoutine: formData.postAccident.evening.activities
    };
    
    // Update the context with the form data
    updateSection('typicalDay', typicalDayData);
  };

  return (
    <Card className="p-6 bg-slate-50">
      <h2 className="text-2xl font-semibold mb-2 text-slate-800">Typical Day</h2>
      <p className="text-sm text-slate-600 mb-6">Compare pre and post-accident daily activities</p>

      <Alert className="mb-6 bg-blue-50 border-blue-200">
        <AlertDescription className="text-slate-700">
          Document typical daily activities including:
          - Morning routines and activities
          - Afternoon tasks and responsibilities
          - Evening activities and habits
          - Night time routines
        </AlertDescription>
      </Alert>

      <FormProvider {...methods}>
        <form className="space-y-6" onSubmit={methods.handleSubmit(onSubmit)}>
          {isDirty && (
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertDescription className="text-yellow-800">
                You have unsaved changes
              </AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="preAccident" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger 
                value="preAccident"
                className="bg-white/50 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-blue-50"
              >
                <div className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  <span>Pre-Accident</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="postAccident"
                className="bg-white/50 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-blue-50"
              >
                <div className="flex items-center gap-2">
                  <History2 className="h-4 w-4" />
                  <span>Post-Accident</span>
                </div>
              </TabsTrigger>
            </TabsList>

            {['preAccident', 'postAccident'].map((timeframe) => (
              <TabsContent key={timeframe} value={timeframe}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TimeBlock
                    title="Morning"
                    period="morning"
                    timeframe={timeframe as 'preAccident' | 'postAccident'}
                    icon={<Sun className="h-5 w-5" />}
                  />
                  
                  <TimeBlock
                    title="Afternoon"
                    period="afternoon"
                    timeframe={timeframe as 'preAccident' | 'postAccident'}
                    icon={<Clock className="h-5 w-5" />}
                  />

                  <TimeBlock
                    title="Evening"
                    period="evening"
                    timeframe={timeframe as 'preAccident' | 'postAccident'}
                    icon={<Sun className="h-5 w-5 rotate-180" />}
                  />

                  <TimeBlock
                    title="Night"
                    period="night"
                    timeframe={timeframe as 'preAccident' | 'postAccident'}
                    icon={<Moon className="h-5 w-5" />}
                  />
                </div>
              </TabsContent>
            ))}
          </Tabs>
          
          <div className="flex justify-end space-x-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => methods.reset()}
              type="button"
            >
              Reset
            </Button>
            <Button 
              type="submit"
            >
              Save Typical Day
            </Button>
          </div>
        </form>
      </FormProvider>
    </Card>
  );
}