'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Sun, Clock, Moon, History, ClipboardCheck, InfoIcon } from 'lucide-react';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import { useAssessment } from '@/contexts/AssessmentContext';
import { typicalDaySchema, defaultFormState } from '../schema';
import { TimeBlock } from './TimeBlock';
import type { TypicalDay as TypicalDayType } from '../schema';

export function TypicalDayIntegratedFinal() {
  // Fix: Use useAssessment which is the correct hook for this context
  const { data, updateSection } = useAssessment();
  const contextData = data.typicalDay || {};
  const [dataLoaded, setDataLoaded] = useState(false);
  
  console.log("Initial typical day context data:", contextData);
  
  // Map context data to form structure with error handling - MOVED TO USECALLBACK TO PREVENT RENDER ISSUES
  const mapContextDataToForm = useCallback((): { formData: TypicalDayType, hasData: boolean } => {
    try {
      // Start with default form state
      const formData = JSON.parse(JSON.stringify(defaultFormState));
      let hasData = false;
      
      if (!contextData || Object.keys(contextData).length === 0) {
        return { formData, hasData };
      }
      
      console.log("Mapping typical day context data:", contextData);
      
      // Map morning routine to post-accident morning activities
      if (contextData.morningRoutine) {
        try {
          console.log("Mapping morning routine:", contextData.morningRoutine);
          // If morningRoutine is a string, convert it to an activity array format
          const activities = formatTextToActivities(contextData.morningRoutine, "morning");
          formData.data.postAccident.dailyRoutine.morning = activities;
          hasData = true;
        } catch (error) {
          console.error("Error mapping morning routine:", error);
        }
      }
      
      // Map daytime activities to post-accident afternoon activities
      if (contextData.daytimeActivities) {
        try {
          console.log("Mapping daytime activities:", contextData.daytimeActivities);
          // If daytimeActivities is a string, convert it to an activity array format
          const activities = formatTextToActivities(contextData.daytimeActivities, "afternoon");
          formData.data.postAccident.dailyRoutine.afternoon = activities;
          hasData = true;
        } catch (error) {
          console.error("Error mapping daytime activities:", error);
        }
      }
      
      // Map evening routine to post-accident evening activities
      if (contextData.eveningRoutine) {
        try {
          console.log("Mapping evening routine:", contextData.eveningRoutine);
          // If eveningRoutine is a string, convert it to an activity array format
          const activities = formatTextToActivities(contextData.eveningRoutine, "evening");
          formData.data.postAccident.dailyRoutine.evening = activities;
          hasData = true;
        } catch (error) {
          console.error("Error mapping evening routine:", error);
        }
      }
      
      // Map night routine if it exists
      if (contextData.nightRoutine) {
        try {
          console.log("Mapping night routine:", contextData.nightRoutine);
          // If nightRoutine is a string, convert it to an activity array format
          const activities = formatTextToActivities(contextData.nightRoutine, "night");
          formData.data.postAccident.dailyRoutine.night = activities;
          hasData = true;
        } catch (error) {
          console.error("Error mapping night routine:", error);
        }
      }
      
      // Map pre-accident routines if they exist
      if (contextData.preAccidentRoutine) {
        try {
          // Morning routine
          if (contextData.preAccidentRoutine.morning) {
            const activities = formatTextToActivities(contextData.preAccidentRoutine.morning, "morning");
            formData.data.preAccident.dailyRoutine.morning = activities;
            hasData = true;
          }
          
          // Afternoon routine
          if (contextData.preAccidentRoutine.afternoon) {
            const activities = formatTextToActivities(contextData.preAccidentRoutine.afternoon, "afternoon");
            formData.data.preAccident.dailyRoutine.afternoon = activities;
            hasData = true;
          }
          
          // Evening routine
          if (contextData.preAccidentRoutine.evening) {
            const activities = formatTextToActivities(contextData.preAccidentRoutine.evening, "evening");
            formData.data.preAccident.dailyRoutine.evening = activities;
            hasData = true;
          }
          
          // Night routine
          if (contextData.preAccidentRoutine.night) {
            const activities = formatTextToActivities(contextData.preAccidentRoutine.night, "night");
            formData.data.preAccident.dailyRoutine.night = activities;
            hasData = true;
          }
        } catch (error) {
          console.error("Error mapping pre-accident routines:", error);
        }
      }
      
      console.log("Mapped typical day form data:", formData);
      return { formData, hasData };
    } catch (error) {
      console.error("Error in mapContextDataToForm:", error);
      return { formData: defaultFormState, hasData: false };
    }
  }, [contextData]);
  
  // Helper function to convert text descriptions to activity array format
  const formatTextToActivities = (text: string, period: string): Array<{ timeBlock: string; description: string; assistance?: string; limitations?: string }> => {
    if (!text || typeof text !== 'string') {
      console.warn(`Invalid text value for ${period}:`, text);
      return [];
    }
    
    // Split the text by new lines, periods, or bullet points
    const lines = text.split(/(?:\r\n|\r|\n|•|\. )/g)
      .filter(line => line.trim().length > 0)
      .map(line => line.trim())
      .filter(line => line !== '.');
    
    console.log(`Parsed ${lines.length} activities from ${period} text`);
    
    // Generate time blocks based on period
    let startTime = 0;
    switch (period) {
      case 'morning':
        startTime = 6;
        break;
      case 'afternoon':
        startTime = 12;
        break;
      case 'evening':
        startTime = 17;
        break;
      case 'night':
        startTime = 21;
        break;
    }
    
    // If no lines parsed, create a single entry with the entire text
    if (lines.length === 0) {
      return [{
        timeBlock: `${startTime}:00 - ${startTime + 3}:00`,
        description: text
      }];
    }
    
    // Convert each line to an activity object
    return lines.map((line, index) => {
      // Adjust time blocks to prevent too many entries
      const timeBlockSize = Math.max(1, Math.ceil(4 / lines.length));
      const timeBlockStart = startTime + (index * timeBlockSize);
      const timeBlockEnd = timeBlockStart + timeBlockSize;
      const timeBlock = `${timeBlockStart}:00 - ${timeBlockEnd}:00`;
      
      // Check if the line has assistance or limitation info
      let description = line.trim();
      let assistance = '';
      let limitations = '';
      
      // Look for assistance information
      if (description.includes('Assistance:')) {
        const parts = description.split('Assistance:');
        description = parts[0].trim();
        assistance = parts[1].trim();
      } else if (description.toLowerCase().includes('requires assistance')) {
        assistance = 'Requires assistance';
      } else if (description.toLowerCase().includes('with assistance')) {
        assistance = 'With assistance';
      }
      
      // Look for limitations information
      if (description.includes('Limitations:')) {
        const parts = description.split('Limitations:');
        description = parts[0].trim();
        limitations = parts[1].trim();
      } else if (description.toLowerCase().includes('limited by')) {
        const parts = description.split(/limited by/i);
        if (parts.length > 1) {
          limitations = 'Limited by ' + parts[1].trim();
        }
      }
      
      return {
        timeBlock,
        description,
        assistance,
        limitations
      };
    });
  };
  
  const methods = useForm<TypicalDayType>({
    resolver: zodResolver(typicalDaySchema),
    defaultValues: defaultFormState
  });

  // Update form when context data changes with proper error handling
  useEffect(() => {
    try {
      if (contextData && Object.keys(contextData).length > 0) {
        console.log("Typical day context data changed:", contextData);
        const { formData, hasData } = mapContextDataToForm();
        methods.reset(formData);
        
        // Set dataLoaded flag in useEffect, not during render
        setDataLoaded(hasData);
      }
    } catch (error) {
      console.error("Error updating form from context:", error);
    }
  }, [contextData, mapContextDataToForm, methods]);

  useFormPersistence(methods, 'typical-day');

  const { formState: { errors, isDirty } } = methods;
  
  const onSubmit = (formData: TypicalDayType) => {
    try {
      console.log('Form data:', formData);
      
      // Convert form data to the structure expected by the context
      const typicalDayData = {
        morningRoutine: formatActivitiesToText(formData.data.postAccident.dailyRoutine.morning),
        daytimeActivities: formatActivitiesToText(formData.data.postAccident.dailyRoutine.afternoon),
        eveningRoutine: formatActivitiesToText(formData.data.postAccident.dailyRoutine.evening),
        nightRoutine: formatActivitiesToText(formData.data.postAccident.dailyRoutine.night),
        preAccidentRoutine: {
          morning: formatActivitiesToText(formData.data.preAccident.dailyRoutine.morning),
          afternoon: formatActivitiesToText(formData.data.preAccident.dailyRoutine.afternoon),
          evening: formatActivitiesToText(formData.data.preAccident.dailyRoutine.evening),
          night: formatActivitiesToText(formData.data.preAccident.dailyRoutine.night)
        }
      };
      
      // Update the context with the form data - Fix: use updateSection function
      updateSection('typicalDay', typicalDayData);
    } catch (error) {
      console.error("Error preparing data for context update:", error);
    }
  };
  
  // Helper function to convert activity array to text format
  const formatActivitiesToText = (activities: Array<{ timeBlock: string; description: string; assistance?: string; limitations?: string }>): string => {
    if (!activities || activities.length === 0) return '';
    
    return activities.map(activity => {
      let text = `${activity.timeBlock}: ${activity.description}`;
      
      if (activity.assistance) {
        text += ` Assistance: ${activity.assistance}`;
      }
      
      if (activity.limitations) {
        text += ` Limitations: ${activity.limitations}`;
      }
      
      return text;
    }).join('\n');
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-slate-800">Typical Day</h2>
        <p className="text-sm text-muted-foreground mt-1">Compare pre and post-accident daily activities</p>
      </div>
      
      {dataLoaded && (
        <Alert className="mb-6 bg-blue-50 text-blue-800 border-blue-200">
          <InfoIcon className="h-4 w-4 text-blue-800" />
          <AlertTitle>Data Loaded From Assessment Context</AlertTitle>
          <AlertDescription>
            Typical day information has been pre-populated from previous assessments. Please review and adjust as needed.
          </AlertDescription>
        </Alert>
      )}

      <Alert className="mb-6 bg-slate-50 border-slate-200">
        <AlertDescription className="text-slate-700">
          Document typical daily activities including:
          <ul className="list-disc pl-5 mt-2">
            <li>Morning routines and activities</li>
            <li>Afternoon tasks and responsibilities</li>
            <li>Evening activities and habits</li>
            <li>Night time routines</li>
          </ul>
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

          <Tabs defaultValue="preAccident" className="w-full border rounded-md">
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
                  <ClipboardCheck className="h-4 w-4" />
                  <span>Post-Accident</span>
                </div>
              </TabsTrigger>
            </TabsList>

            {['preAccident', 'postAccident'].map((timeframe) => (
              <TabsContent key={timeframe} value={timeframe} className="p-6">
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
              onClick={() => methods.reset(defaultFormState)}
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
    </div>
  );
}