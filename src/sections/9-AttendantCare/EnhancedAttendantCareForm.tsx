import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { attendantCareSchema, AttendantCareFormData } from '@/schemas/attendantCareSchema';
import { useEnhancedAssessment } from '@/contexts/EnhancedAssessmentContext';
import { FormErrorSummary } from '@/components/FormErrorSummary';
import { SaveStatusIndicator } from '@/components/SaveStatusIndicator';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { trackFormInteraction } from '@/services/analytics-service';

/**
 * Enhanced Attendant Care Form component with robust validation
 * for field trial implementation
 */
export function EnhancedAttendantCareForm() {
  const { data, updateSection } = useEnhancedAssessment();
  
  // Initialize form with zodResolver for validation
  const methods = useForm<AttendantCareFormData>({
    resolver: zodResolver(attendantCareSchema),
    defaultValues: data.attendantCare || {
      level1: {
        personalCare: {},
        houseKeeping: {}
      },
      level2: {
        hours: 0,
        description: ''
      },
      level3: {
        services: []
      },
      summary: '',
      recommendations: ''
    }
  });
  
  const { handleSubmit, formState, reset, watch } = methods;
  
  // Watch for form changes to calculate totals
  const watchLevel1 = watch('level1');
  
  // Effect to reset form when data changes
  useEffect(() => {
    if (data.attendantCare) {
      reset(data.attendantCare);
    }
  }, [data.attendantCare, reset]);
  
  // Calculate total minutes per week for Level 1 care
  const calculateTotalMinutes = () => {
    let total = 0;
    
    // Process personal care
    if (watchLevel1?.personalCare) {
      Object.values(watchLevel1.personalCare).forEach((activity: any) => {
        if (activity && typeof activity === 'object') {
          const minutes = Number(activity.minutes) || 0;
          const timesPerWeek = Number(activity.timesPerWeek) || 0;
          total += minutes * timesPerWeek;
        }
      });
    }
    
    // Process house keeping
    if (watchLevel1?.houseKeeping) {
      Object.values(watchLevel1.houseKeeping).forEach((activity: any) => {
        if (activity && typeof activity === 'object') {
          const minutes = Number(activity.minutes) || 0;
          const timesPerWeek = Number(activity.timesPerWeek) || 0;
          total += minutes * timesPerWeek;
        }
      });
    }
    
    return total;
  };
  
  // Convert minutes to hours and minutes for display
  const formatTime = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };
  
  // Handle form submission
  const onSubmit = (data: AttendantCareFormData) => {
    updateSection('attendantCare', data);
    trackFormInteraction('attendantCare', 'submit');
  };
  
  // Activity input component
  const ActivityInput = ({ 
    label, 
    path 
  }: { 
    label: string; 
    path: string;
  }) => {
    const registerPath = `${path}.minutes` as const;
    const registerTimesPath = `${path}.timesPerWeek` as const;
    const registerNotesPath = `${path}.notes` as const;
    
    return (
      <div className="space-y-2 mb-4 p-3 border rounded-md bg-gray-50">
        <Label className="font-medium">{label}</Label>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor={registerPath}>Minutes per session</Label>
            <Input
              id={registerPath}
              type="number"
              {...methods.register(registerPath, { valueAsNumber: true })}
              onFocus={() => trackFormInteraction('attendantCare', 'focus', registerPath)}
              onBlur={() => trackFormInteraction('attendantCare', 'blur', registerPath)}
            />
            {formState.errors[path]?.minutes && (
              <p className="text-red-500 text-xs mt-1">
                {formState.errors[path]?.minutes?.message as string}
              </p>
            )}
          </div>
          
          <div>
            <Label htmlFor={registerTimesPath}>Times per week</Label>
            <Input
              id={registerTimesPath}
              type="number"
              {...methods.register(registerTimesPath, { valueAsNumber: true })}
              onFocus={() => trackFormInteraction('attendantCare', 'focus', registerTimesPath)}
              onBlur={() => trackFormInteraction('attendantCare', 'blur', registerTimesPath)}
            />
            {formState.errors[path]?.timesPerWeek && (
              <p className="text-red-500 text-xs mt-1">
                {formState.errors[path]?.timesPerWeek?.message as string}
              </p>
            )}
          </div>
        </div>
        
        <div>
          <Label htmlFor={registerNotesPath}>Notes</Label>
          <Textarea
            id={registerNotesPath}
            {...methods.register(registerNotesPath)}
            onFocus={() => trackFormInteraction('attendantCare', 'focus', registerNotesPath)}
            onBlur={() => trackFormInteraction('attendantCare', 'blur', registerNotesPath)}
          />
        </div>
      </div>
    );
  };
  
  // Calculate total minutes
  const totalMinutes = calculateTotalMinutes();
  
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Attendant Care Assessment</CardTitle>
          </CardHeader>
          
          <CardContent>
            <FormErrorSummary />
            
            <Tabs defaultValue="level1">
              <TabsList className="mb-4">
                <TabsTrigger value="level1">Level 1 Care</TabsTrigger>
                <TabsTrigger value="level2">Level 2 Care</TabsTrigger>
                <TabsTrigger value="level3">Level 3 Care</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
              </TabsList>
              
              <TabsContent value="level1">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-2">Personal Care</h3>
                  
                  <ActivityInput label="Bathing" path="level1.personalCare.bathing" />
                  <ActivityInput label="Grooming" path="level1.personalCare.grooming" />
                  <ActivityInput label="Dressing" path="level1.personalCare.dressing" />
                  <ActivityInput label="Toileting" path="level1.personalCare.toileting" />
                  <ActivityInput label="Feeding" path="level1.personalCare.feeding" />
                  <ActivityInput label="Mobility" path="level1.personalCare.mobility" />
                  <ActivityInput label="Transfers" path="level1.personalCare.transfers" />
                  
                  <h3 className="text-lg font-semibold mt-6 mb-2">Housekeeping</h3>
                  
                  <ActivityInput label="Cleaning" path="level1.houseKeeping.cleaning" />
                  <ActivityInput label="Laundry" path="level1.houseKeeping.laundry" />
                  <ActivityInput label="Meal Preparation" path="level1.houseKeeping.mealPreparation" />
                  <ActivityInput label="Shopping" path="level1.houseKeeping.shopping" />
                  <ActivityInput label="Home Management" path="level1.houseKeeping.homeManagement" />
                  
                  <div className="bg-blue-50 p-4 rounded-md mt-6">
                    <h4 className="font-medium">Level 1 Care Summary</h4>
                    <p className="text-sm mt-1">
                      Total time per week: <strong>{formatTime(totalMinutes)}</strong> 
                      ({totalMinutes} minutes)
                    </p>
                    <p className="text-sm mt-1">
                      Percentage of maximum allowed: <strong>
                        {Math.round((totalMinutes / 1680) * 100)}%
                      </strong> 
                      (Maximum: 28 hours per week)
                    </p>
                    
                    {totalMinutes > 1680 && (
                      <p className="text-red-500 text-sm mt-2">
                        Warning: Total time exceeds the maximum allowed 28 hours (1680 minutes) per week.
                      </p>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="level2">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-2">Level 2 Care (Supervision)</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="level2.hours">Hours per week</Label>
                    <Input
                      id="level2.hours"
                      type="number"
                      {...methods.register('level2.hours', { valueAsNumber: true })}
                    />
                    {formState.errors.level2?.hours && (
                      <p className="text-red-500 text-xs mt-1">
                        {formState.errors.level2.hours.message}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="level2.description">Description of supervision needs</Label>
                    <Textarea
                      id="level2.description"
                      {...methods.register('level2.description')}
                      className="min-h-[150px]"
                    />
                    {formState.errors.level2?.description && (
                      <p className="text-red-500 text-xs mt-1">
                        {formState.errors.level2.description.message}
                      </p>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="level3">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-2">Level 3 Care (Professional Services)</h3>
                  
                  {/* Services would go here - simplified for this example */}
                  <p className="text-sm text-gray-500">
                    Level 3 care includes professional services like nursing, therapy, or other specialized care.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="summary">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-2">Assessment Summary</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="summary">Summary of attendant care needs</Label>
                    <Textarea
                      id="summary"
                      {...methods.register('summary')}
                      className="min-h-[150px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="recommendations">Recommendations</Label>
                    <Textarea
                      id="recommendations"
                      {...methods.register('recommendations')}
                      className="min-h-[150px]"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button
              type="submit"
              disabled={formState.isSubmitting}
            >
              {formState.isSubmitting ? 'Saving...' : 'Save Assessment'}
            </Button>
            
            <SaveStatusIndicator />
          </CardFooter>
        </Card>
      </form>
    </FormProvider>
  );
}
