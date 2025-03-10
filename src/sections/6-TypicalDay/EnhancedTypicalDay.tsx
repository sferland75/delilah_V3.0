'use client';

import React, { useState, useEffect } from 'react';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAssessment } from '@/contexts/AssessmentContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { typicalDaySchema, defaultFormState, Activity } from './schema.updated';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { toast } from '@/components/ui/use-toast';

export function EnhancedTypicalDay() {
  const { data: assessmentData, updateSection } = useAssessment();
  const [loading, setLoading] = useState(true);

  // Initialize form with resolved schema
  const methods = useForm({
    resolver: zodResolver(typicalDaySchema),
    defaultValues: defaultFormState,
  });

  const { control, setValue, handleSubmit, reset, watch } = methods;
  const activeTab = watch('config.activeTab');
  
  // Watch sleep schedule type to toggle UI
  const preAccidentSleepType = watch('data.preAccident.sleepSchedule.type');
  const postAccidentSleepType = watch('data.postAccident.sleepSchedule.type');

  // Load data from context when available
  useEffect(() => {
    if (assessmentData?.typicalDay) {
      try {
        console.log('Loading data from context:', assessmentData.typicalDay);
        
        // Handle proper data mapping from context
        const contextData = assessmentData.typicalDay;
        
        // Map daily routine data if available
        if (contextData.preAccident?.dailyRoutine) {
          // Convert text-format activities to array format if needed
          const preAccidentRoutine = mapTextToActivityArray(contextData.preAccident.dailyRoutine);
          setValue('data.preAccident.dailyRoutine', preAccidentRoutine);
        }
        
        if (contextData.postAccident?.dailyRoutine) {
          const postAccidentRoutine = mapTextToActivityArray(contextData.postAccident.dailyRoutine);
          setValue('data.postAccident.dailyRoutine', postAccidentRoutine);
        }
        
        // Map sleep schedule data if available
        if (contextData.preAccident?.sleepSchedule) {
          setValue('data.preAccident.sleepSchedule', contextData.preAccident.sleepSchedule);
        }
        
        if (contextData.postAccident?.sleepSchedule) {
          setValue('data.postAccident.sleepSchedule', contextData.postAccident.sleepSchedule);
        }
        
        // Set active tab if specified
        if (contextData.config?.activeTab) {
          setValue('config.activeTab', contextData.config.activeTab);
        }
      } catch (error) {
        console.error('Error loading typical day data:', error);
        toast({
          title: 'Error loading data',
          description: 'There was a problem loading your typical day data.',
          variant: 'destructive',
        });
      }
    }
    
    setLoading(false);
  }, [assessmentData?.typicalDay, setValue]);

  // Convert text format activities to array format for form
  const mapTextToActivityArray = (routineData) => {
    const result = {
      morning: [],
      afternoon: [],
      evening: [],
      night: []
    };
    
    // Process each time period if data exists
    if (routineData.morningActivities) {
      result.morning = convertTextToActivities(routineData.morningActivities);
    }
    
    if (routineData.afternoonActivities) {
      result.afternoon = convertTextToActivities(routineData.afternoonActivities);
    }
    
    if (routineData.eveningActivities) {
      result.evening = convertTextToActivities(routineData.eveningActivities);
    }
    
    if (routineData.nightActivities) {
      result.night = convertTextToActivities(routineData.nightActivities);
    }
    
    return result;
  };
  
  // Convert text to activity array
  const convertTextToActivities = (text) => {
    if (!text) return [];
    
    return text.split('\n')
      .filter(line => line.trim())
      .map(line => {
        // Try to extract time block from format "9:00 AM: Activity description"
        const match = line.match(/^(.*?):(.*)$/);
        if (match) {
          return {
            timeBlock: match[1].trim(),
            description: match[2].trim(),
          };
        }
        
        return {
          timeBlock: '',
          description: line.trim(),
        };
      });
  };

  // Add a new activity to a specific time period
  const addActivity = (timeframe, period) => {
    const currentActivities = methods.getValues(`data.${timeframe}.dailyRoutine.${period}`) || [];
    setValue(`data.${timeframe}.dailyRoutine.${period}`, [
      ...currentActivities,
      { timeBlock: '', description: '' }
    ], { shouldDirty: true });
  };
  
  // Remove an activity from a specific time period
  const removeActivity = (timeframe, period, index) => {
    const currentActivities = [...methods.getValues(`data.${timeframe}.dailyRoutine.${period}`)];
    currentActivities.splice(index, 1);
    setValue(`data.${timeframe}.dailyRoutine.${period}`, currentActivities, { shouldDirty: true });
  };

  // Format activities back to text for context
  const formatActivitiesToText = (activities) => {
    if (!activities || activities.length === 0) return '';
    
    return activities.map(activity => {
      let text = '';
      if (activity.timeBlock) text += `${activity.timeBlock}: `;
      text += activity.description || '';
      return text;
    }).join('\n');
  };

  // Submit form data to context
  const onSubmit = (formData) => {
    try {
      console.log('Form submitted:', formData);
      
      // Map form data to context format
      const contextData = {
        config: formData.config,
        preAccident: {
          dailyRoutine: {
            morningActivities: formatActivitiesToText(formData.data.preAccident.dailyRoutine.morning),
            afternoonActivities: formatActivitiesToText(formData.data.preAccident.dailyRoutine.afternoon),
            eveningActivities: formatActivitiesToText(formData.data.preAccident.dailyRoutine.evening),
            nightActivities: formatActivitiesToText(formData.data.preAccident.dailyRoutine.night)
          },
          sleepSchedule: formData.data.preAccident.sleepSchedule
        },
        postAccident: {
          dailyRoutine: {
            morningActivities: formatActivitiesToText(formData.data.postAccident.dailyRoutine.morning),
            afternoonActivities: formatActivitiesToText(formData.data.postAccident.dailyRoutine.afternoon),
            eveningActivities: formatActivitiesToText(formData.data.postAccident.dailyRoutine.evening),
            nightActivities: formatActivitiesToText(formData.data.postAccident.dailyRoutine.night)
          },
          sleepSchedule: formData.data.postAccident.sleepSchedule
        }
      };
      
      // Update context
      updateSection('typicalDay', contextData);
      
      toast({
        title: 'Saved successfully',
        description: 'Your typical day information has been saved.',
      });
    } catch (error) {
      console.error('Error saving typical day data:', error);
      toast({
        title: 'Error saving data',
        description: 'There was a problem saving your typical day information.',
        variant: 'destructive',
      });
    }
  };

  // Handle tab change
  const handleTabChange = (value) => {
    setValue('config.activeTab', value);
  };

  // Render a time block section (morning, afternoon, etc.)
  const renderTimeBlock = (title, period, timeframe) => {
    const activities = watch(`data.${timeframe}.dailyRoutine.${period}`) || [];
    
    return (
      <div className="border p-4 rounded-md mb-4">
        <h3 className="font-medium text-lg mb-2 capitalize">{title}</h3>
        
        {activities.length === 0 && (
          <div className="text-sm text-gray-500 italic mb-2">No activities added yet</div>
        )}
        
        {activities.map((_, index) => (
          <div key={index} className="mb-3 p-3 border rounded-md bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-3">
                <Label htmlFor={`${timeframe}.${period}.${index}.timeBlock`} className="mb-1">Time</Label>
                <Input
                  id={`${timeframe}.${period}.${index}.timeBlock`}
                  {...methods.register(`data.${timeframe}.dailyRoutine.${period}.${index}.timeBlock`)}
                  placeholder="e.g., 8:00 AM"
                />
              </div>
              <div className="md:col-span-8">
                <Label htmlFor={`${timeframe}.${period}.${index}.description`} className="mb-1">Activity</Label>
                <Input
                  id={`${timeframe}.${period}.${index}.description`}
                  {...methods.register(`data.${timeframe}.dailyRoutine.${period}.${index}.description`)}
                  placeholder="Describe the activity"
                />
              </div>
              <div className="md:col-span-1 flex items-end">
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="sm"
                  onClick={() => removeActivity(timeframe, period, index)}
                >
                  ✕
                </Button>
              </div>
            </div>
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addActivity(timeframe, period)}
        >
          Add Activity
        </Button>
      </div>
    );
  };

  // Render sleep schedule section
  const renderSleepSchedule = (timeframe) => {
    const sleepType = timeframe === 'preAccident' ? preAccidentSleepType : postAccidentSleepType;
    
    return (
      <div className="border p-4 rounded-md mb-4">
        <h3 className="font-medium text-lg mb-4">Sleep Schedule</h3>
        
        <div className="mb-4">
          <Label className="block text-sm font-medium mb-2">Schedule Type</Label>
          <RadioGroup 
            value={sleepType} 
            onValueChange={(value) => setValue(`data.${timeframe}.sleepSchedule.type`, value)}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="regular" id={`${timeframe}-regular`} />
              <Label htmlFor={`${timeframe}-regular`}>Regular Schedule</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="irregular" id={`${timeframe}-irregular`} />
              <Label htmlFor={`${timeframe}-irregular`}>Irregular Schedule</Label>
            </div>
          </RadioGroup>
        </div>
        
        {sleepType === 'regular' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`${timeframe}-bedTime`} className="mb-1">Typical Bedtime</Label>
              <Input
                id={`${timeframe}-bedTime`}
                {...methods.register(`data.${timeframe}.sleepSchedule.regularSchedule.bedTime`)}
                placeholder="e.g., 10:30 PM"
              />
            </div>
            <div>
              <Label htmlFor={`${timeframe}-wakeTime`} className="mb-1">Typical Wake Time</Label>
              <Input
                id={`${timeframe}-wakeTime`}
                {...methods.register(`data.${timeframe}.sleepSchedule.regularSchedule.wakeTime`)}
                placeholder="e.g., 6:30 AM"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor={`${timeframe}-sleepQuality`} className="mb-1">Sleep Quality</Label>
              <select
                id={`${timeframe}-sleepQuality`}
                {...methods.register(`data.${timeframe}.sleepSchedule.regularSchedule.sleepQuality`)}
                className="w-full border p-2 rounded"
              >
                <option value="">Select quality...</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
                <option value="Very Poor">Very Poor</option>
              </select>
            </div>
          </div>
        ) : (
          <div>
            <Label htmlFor={`${timeframe}-irregular-details`} className="mb-1">
              Please describe your sleep pattern
            </Label>
            <Textarea
              id={`${timeframe}-irregular-details`}
              {...methods.register(`data.${timeframe}.sleepSchedule.irregularScheduleDetails`)}
              placeholder="Describe your irregular sleep pattern, including when you typically sleep, how long, and any variations."
              rows={4}
            />
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return <div className="p-4 text-center">Loading Typical Day data...</div>;
  }

  return (
    <ErrorBoundary
      fallback={
        <div className="p-6 border-2 border-orange-200 bg-orange-50 rounded-md">
          <h3 className="text-lg font-medium text-orange-800 mb-2">Error Loading Component</h3>
          <p className="text-orange-700">There was a problem loading the Typical Day component.</p>
          <Button 
            variant="outline" 
            className="mt-2" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      }
    >
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Typical Day Assessment</h2>
        
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6">
              <TabsList className="w-full border-b p-0 h-auto">
                <TabsTrigger 
                  value="preAccident" 
                  className="py-2 rounded-none flex-1 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600"
                >
                  Pre-Accident
                </TabsTrigger>
                <TabsTrigger 
                  value="postAccident" 
                  className="py-2 rounded-none flex-1 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600"
                >
                  Post-Accident
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="preAccident" className="pt-4">
                <h3 className="text-lg font-medium mb-3">Pre-Accident Daily Activities</h3>
                <div className="grid grid-cols-1 gap-4">
                  {renderTimeBlock('Morning', 'morning', 'preAccident')}
                  {renderTimeBlock('Afternoon', 'afternoon', 'preAccident')}
                  {renderTimeBlock('Evening', 'evening', 'preAccident')}
                  {renderTimeBlock('Night', 'night', 'preAccident')}
                  {renderSleepSchedule('preAccident')}
                </div>
              </TabsContent>
              
              <TabsContent value="postAccident" className="pt-4">
                <h3 className="text-lg font-medium mb-3">Post-Accident Daily Activities</h3>
                <div className="grid grid-cols-1 gap-4">
                  {renderTimeBlock('Morning', 'morning', 'postAccident')}
                  {renderTimeBlock('Afternoon', 'afternoon', 'postAccident')}
                  {renderTimeBlock('Evening', 'evening', 'postAccident')}
                  {renderTimeBlock('Night', 'night', 'postAccident')}
                  {renderSleepSchedule('postAccident')}
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 flex justify-end">
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Save Typical Day Information
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </ErrorBoundary>
  );
}

export default EnhancedTypicalDay;