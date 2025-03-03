'use client';

import React, { useEffect, useCallback, useMemo } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogContent, 
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { attendantCareSchema, type AttendantCareFormData } from "../schema";
import { Level1Care } from "./Level1Care";
import { Level2Care } from "./Level2Care";
import { Level3Care } from "./Level3Care";
import { CostCalculation } from "./CostCalculation";
import { calculateSummary } from "../utils/calculations";
import { CARE_RATES, careCategories, DEFAULT_ACTIVITY } from "../constants";
import { useAssessment } from '@/contexts/AssessmentContext';
import _ from 'lodash';

interface AttendantCareSectionProps {
  initialData?: AttendantCareFormData;
  onDataChange?: (data: AttendantCareFormData) => void;
}

export function AttendantCareSectionIntegrated({ initialData, onDataChange }: AttendantCareSectionProps) {
  const { data, updateSection } = useAssessment();
  const contextData = data.attendantCare || {};
  
  const [showSummary, setShowSummary] = React.useState(false);
  const [currentCalculations, setCurrentCalculations] = React.useState<any>(null);
  const [dataLoaded, setDataLoaded] = React.useState(false);

  console.log("Initial attendant care context data:", contextData);
  
  // Helper functions to analyze descriptions and estimate reasonable values
  
  // Estimate minutes based on description complexity and default value
  const estimateMinutesFromDescription = useCallback((description: string, defaultMinutes: number): number => {
    try {
      if (!description) return defaultMinutes;
      
      const text = description.toLowerCase();
      
      // Check for complexity indicators that would increase minutes
      if (text.includes('maximum') || 
          text.includes('complete') || 
          text.includes('total assist') ||
          text.includes('dependent')) {
        return defaultMinutes * 1.5;
      }
      
      if (text.includes('moderate') || 
          text.includes('partial')) {
        return defaultMinutes * 1.2;
      }
      
      if (text.includes('minimal') || 
          text.includes('setup') || 
          text.includes('standby')) {
        return defaultMinutes * 0.8;
      }
      
      if (text.includes('independent')) {
        return 0;
      }
      
      return defaultMinutes;
    } catch (error) {
      console.error("Error estimating minutes:", error);
      return defaultMinutes;
    }
  }, []);
  
  // Estimate times per week based on description frequency terms and default value
  const estimateTimesPerWeekFromDescription = useCallback((description: string, defaultTimes: number): number => {
    try {
      if (!description) return defaultTimes;
      
      const text = description.toLowerCase();
      
      // Check for frequency indicators
      if (text.includes('daily') && text.includes('twice')) {
        return 14;
      }
      
      if (text.includes('daily') && text.includes('three')) {
        return 21;
      }
      
      if (text.includes('daily')) {
        return 7;
      }
      
      if (text.includes('weekly') && text.includes('twice')) {
        return 2;
      }
      
      if (text.includes('weekly') && text.includes('three')) {
        return 3;
      }
      
      if (text.includes('weekly')) {
        return 1;
      }
      
      return defaultTimes;
    } catch (error) {
      console.error("Error estimating times per week:", error);
      return defaultTimes;
    }
  }, []);
  
  // Enhanced mapping function with comprehensive error handling
  const mapContextDataToForm = useCallback((): AttendantCareFormData => {
    try {
      // Create a basic form data structure to populate
      const mappedData: Partial<AttendantCareFormData> = {
        level1: {},
        level2: {},
        level3: {},
        summary: {}
      };
      
      if (!contextData || Object.keys(contextData).length === 0) {
        console.log("No attendant care context data available");
        return initialData || {} as AttendantCareFormData;
      }
      
      // Map personal care data (Level 1)
      if (contextData.personalCare) {
        try {
          mappedData.level1 = mappedData.level1 || {};
          
          // Initialize personal care category if not exists
          if (!mappedData.level1.personalCare) {
            mappedData.level1.personalCare = {};
          }
          
          // Map bathing assistance
          if (contextData.personalCare.bathing) {
            mappedData.level1.personalCare.bathing = {
              ...DEFAULT_ACTIVITY,
              minutes: estimateMinutesFromDescription(contextData.personalCare.bathing, 15),
              timesPerWeek: estimateTimesPerWeekFromDescription(contextData.personalCare.bathing, 7),
              notes: contextData.personalCare.bathing
            };
          }
          
          // Map dressing assistance
          if (contextData.personalCare.dressing) {
            mappedData.level1.personalCare.dressing = {
              ...DEFAULT_ACTIVITY,
              minutes: estimateMinutesFromDescription(contextData.personalCare.dressing, 10),
              timesPerWeek: estimateTimesPerWeekFromDescription(contextData.personalCare.dressing, 14), // Twice daily
              notes: contextData.personalCare.dressing
            };
          }
          
          // Map grooming assistance
          if (contextData.personalCare.grooming) {
            mappedData.level1.personalCare.grooming = {
              ...DEFAULT_ACTIVITY,
              minutes: estimateMinutesFromDescription(contextData.personalCare.grooming, 10),
              timesPerWeek: estimateTimesPerWeekFromDescription(contextData.personalCare.grooming, 7),
              notes: contextData.personalCare.grooming
            };
          }
          
          // Map toileting assistance
          if (contextData.personalCare.toileting) {
            mappedData.level1.personalCare.toileting = {
              ...DEFAULT_ACTIVITY,
              minutes: estimateMinutesFromDescription(contextData.personalCare.toileting, 5),
              timesPerWeek: estimateTimesPerWeekFromDescription(contextData.personalCare.toileting, 28), // 4 times daily
              notes: contextData.personalCare.toileting
            };
          }
        } catch (error) {
          console.error("Error mapping personal care data:", error);
        }
      }
      
      // Map home management data (Level 2)
      if (contextData.homeManagement) {
        try {
          mappedData.level2 = mappedData.level2 || {};
          
          // Initialize household management category if not exists
          if (!mappedData.level2.householdManagement) {
            mappedData.level2.householdManagement = {};
          }
          
          // Map meal preparation assistance
          if (contextData.homeManagement.mealPreparation) {
            mappedData.level2.householdManagement.mealPreparation = {
              ...DEFAULT_ACTIVITY,
              minutes: estimateMinutesFromDescription(contextData.homeManagement.mealPreparation, 20),
              timesPerWeek: estimateTimesPerWeekFromDescription(contextData.homeManagement.mealPreparation, 21), // 3 times daily
              notes: contextData.homeManagement.mealPreparation
            };
          }
          
          // Map cleaning assistance
          if (contextData.homeManagement.cleaning) {
            mappedData.level2.householdManagement.cleaning = {
              ...DEFAULT_ACTIVITY,
              minutes: estimateMinutesFromDescription(contextData.homeManagement.cleaning, 30),
              timesPerWeek: estimateTimesPerWeekFromDescription(contextData.homeManagement.cleaning, 3),
              notes: contextData.homeManagement.cleaning
            };
          }
          
          // Map laundry assistance
          if (contextData.homeManagement.laundry) {
            mappedData.level2.householdManagement.laundry = {
              ...DEFAULT_ACTIVITY,
              minutes: estimateMinutesFromDescription(contextData.homeManagement.laundry, 20),
              timesPerWeek: estimateTimesPerWeekFromDescription(contextData.homeManagement.laundry, 2),
              notes: contextData.homeManagement.laundry
            };
          }
        } catch (error) {
          console.error("Error mapping home management data:", error);
        }
      }
      
      // Map community access data (Level 3)
      if (contextData.communityAccess) {
        try {
          mappedData.level3 = mappedData.level3 || {};
          
          // Initialize community access category if not exists
          if (!mappedData.level3.communityAccess) {
            mappedData.level3.communityAccess = {};
          }
          
          // Map transportation assistance
          if (contextData.communityAccess.transportation) {
            mappedData.level3.communityAccess.transportation = {
              ...DEFAULT_ACTIVITY,
              minutes: estimateMinutesFromDescription(contextData.communityAccess.transportation, 60),
              timesPerWeek: estimateTimesPerWeekFromDescription(contextData.communityAccess.transportation, 2),
              notes: contextData.communityAccess.transportation
            };
          }
          
          // Map shopping assistance
          if (contextData.communityAccess.shopping) {
            mappedData.level3.communityAccess.shopping = {
              ...DEFAULT_ACTIVITY,
              minutes: estimateMinutesFromDescription(contextData.communityAccess.shopping, 45),
              timesPerWeek: estimateTimesPerWeekFromDescription(contextData.communityAccess.shopping, 1),
              notes: contextData.communityAccess.shopping
            };
          }
        } catch (error) {
          console.error("Error mapping community access data:", error);
        }
      }
      
      // Map recommended hours data to form fields
      if (contextData.recommendedHours) {
        try {
          // Use recommended hours to estimate times and minutes
          const mapHoursToActivities = (
            totalHours: number | undefined, 
            level: string, 
            category: string, 
            activities: string[]
          ) => {
            if (!totalHours) return;
            
            // Convert monthly hours to weekly
            const weeklyHours = totalHours / 4;
            
            // Distribute hours equally among activities
            const hoursPerActivity = weeklyHours / activities.length;
            
            // Estimate reasonable values for each activity
            activities.forEach(activity => {
              try {
                // Default to 20 minutes per session
                const minutes = 20;
                
                // Calculate times per week based on total hours
                const timesPerWeek = Math.round((hoursPerActivity * 60) / minutes);
                
                // Ensure the mappedData structure is initialized
                if (!mappedData[level]) mappedData[level] = {};
                if (!mappedData[level][category]) mappedData[level][category] = {};
                
                // Set the values
                mappedData[level][category][activity] = {
                  ...DEFAULT_ACTIVITY,
                  minutes,
                  timesPerWeek,
                  totalMinutes: minutes * timesPerWeek,
                  notes: `Estimated from recommended ${category} hours: ${totalHours} hours per month`
                };
              } catch (error) {
                console.error(`Error mapping hours for ${level}.${category}.${activity}:`, error);
              }
            });
          };
          
          // Map personal care hours (Level 1)
          if (contextData.recommendedHours.personalCare) {
            const personalCareActivities = ['bathing', 'dressing', 'grooming', 'toileting'];
            mapHoursToActivities(
              contextData.recommendedHours.personalCare,
              'level1',
              'personalCare',
              personalCareActivities
            );
          }
          
          // Map home management hours (Level 2)
          if (contextData.recommendedHours.homeManagement) {
            const homeManagementActivities = ['mealPreparation', 'cleaning', 'laundry'];
            mapHoursToActivities(
              contextData.recommendedHours.homeManagement,
              'level2',
              'householdManagement',
              homeManagementActivities
            );
          }
          
          // Map community access hours (Level 3)
          if (contextData.recommendedHours.communityAccess) {
            const communityAccessActivities = ['transportation', 'shopping'];
            mapHoursToActivities(
              contextData.recommendedHours.communityAccess,
              'level3',
              'communityAccess',
              communityAccessActivities
            );
          }
        } catch (error) {
          console.error("Error mapping recommended hours:", error);
        }
      }
      
      // Initialize summary section
      mappedData.summary = {
        notes: "Form populated from client assessment data. Please review and adjust as necessary.",
        reviewDate: new Date().toISOString().split('T')[0],
        rateFramework: 'current'
      };
      
      console.log("Mapped attendant care form data:", mappedData);
      
      // Return the merged form data with defaults
      return _.merge({}, initialData || {}, mappedData);
    } catch (error) {
      console.error("Error in mapContextDataToForm:", error);
      return initialData || {} as AttendantCareFormData;
    }
  }, [contextData, initialData, estimateMinutesFromDescription, estimateTimesPerWeekFromDescription]);
  
  // Create default values only once when the component mounts or when context changes
  const defaultValues = useMemo(() => {
    if (contextData && Object.keys(contextData).length > 0) {
      try {
        const mappedData = mapContextDataToForm();
        return mappedData;
      } catch (error) {
        console.error("Error computing default values:", error);
        return initialData || {} as AttendantCareFormData;
      }
    }
    return initialData || {} as AttendantCareFormData;
  }, [contextData, initialData, mapContextDataToForm]);
  
  // Initialize form with mapped context data if available
  const form = useForm<AttendantCareFormData>({
    resolver: zodResolver(attendantCareSchema),
    defaultValues,
  });
  
  // Update form when context data changes - but only when it's loaded first time
  useEffect(() => {
    if (contextData && Object.keys(contextData).length > 0 && !dataLoaded) {
      try {
        console.log("Attendant care context data loaded, updating form");
        const formData = mapContextDataToForm();
        form.reset(formData);
        setDataLoaded(true);
      } catch (error) {
        console.error("Error updating form from context:", error);
      }
    }
  }, [contextData, dataLoaded, form, mapContextDataToForm]);

  // Memoize calculations to prevent unnecessary updates
  const updateCalculations = useCallback((formData: AttendantCareFormData) => {
    const calculations = calculateSummary(formData);
    setCurrentCalculations(calculations);
    
    if (onDataChange) {
      onDataChange({
        ...formData,
        calculations,
      });
    }
  }, [onDataChange]);

  // Subscribe to form changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value) {
        updateCalculations(value as AttendantCareFormData);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form, updateCalculations]);
  
  // Handle form submission with enhanced context mapping
  const onSubmit = useCallback((formData: AttendantCareFormData) => {
    try {
      console.log('Form data:', formData);
      
      // Calculate summary data for reference
      const calculations = calculateSummary(formData);
      
      // Convert form data to the structure expected by the context
      const attendantCareData = {
        personalCare: {
          bathing: formData.level1?.personalCare?.bathing?.notes || "Setup assistance and standby supervision",
          dressing: formData.level1?.personalCare?.dressing?.notes || "Minimal assistance with upper body clothing",
          grooming: formData.level1?.personalCare?.grooming?.notes || "Setup for shaving and hair care",
          toileting: formData.level1?.personalCare?.toileting?.notes || "Independent"
        },
        homeManagement: {
          mealPreparation: formData.level2?.householdManagement?.mealPreparation?.notes || "Assistance with complex meals and meal planning",
          cleaning: formData.level2?.householdManagement?.cleaning?.notes || "Moderate assistance with heavy cleaning tasks",
          laundry: formData.level2?.householdManagement?.laundry?.notes || "Assistance with carrying laundry baskets"
        },
        communityAccess: {
          transportation: formData.level3?.communityAccess?.transportation?.notes || "Accompaniment to medical appointments",
          shopping: formData.level3?.communityAccess?.shopping?.notes || "Assistance with grocery shopping"
        },
        recommendedHours: {
          personalCare: Math.round(calculations.level1.monthlyHours),
          homeManagement: Math.round(calculations.level2.monthlyHours), 
          communityAccess: Math.round(calculations.level3.monthlyHours),
          total: Math.round(calculations.summary.totalMonthlyHours)
        },
        assessment: {
          date: formData.summary?.reviewDate || new Date().toISOString().split('T')[0],
          notes: formData.summary?.notes || "",
          rateFramework: formData.summary?.rateFramework || 'current',
          totalCost: calculations.summary.totalMonthlyCost
        }
      };
      
      // Update the context with the form data
      updateSection('attendantCare', attendantCareData);
    } catch (error) {
      console.error("Error preparing data for context update:", error);
    }
  }, [updateSection]);

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-slate-800">Assessment of Attendant Care Needs</h2>
        <p className="text-sm text-muted-foreground mt-1">
          This form assesses the future needs for attendant care required by the applicant as a result of an automobile accident.
        </p>
      </div>

      {dataLoaded && (
        <Alert className="mb-6 bg-blue-50 text-blue-800 border-blue-200">
          <InfoIcon className="h-4 w-4 text-blue-800" />
          <AlertTitle>Data Loaded From Assessment Context</AlertTitle>
          <AlertDescription>
            Care requirements have been pre-populated from previous assessments. Please review and adjust as needed.
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Tabs defaultValue="level1" className="w-full border rounded-md">
          <TabsList className="grid w-full grid-cols-4 p-0 h-auto border-b">
            <TabsTrigger 
              className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
              value="level1"
            >
              Level 1 Care
            </TabsTrigger>
            <TabsTrigger 
              className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
              value="level2"
            >
              Level 2 Care
            </TabsTrigger>
            <TabsTrigger 
              className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
              value="level3"
            >
              Level 3 Care
            </TabsTrigger>
            <TabsTrigger 
              className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
              value="calculation"
            >
              Cost Calculation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="level1" className="p-6">
            <Level1Care form={form} />
          </TabsContent>

          <TabsContent value="level2" className="p-6">
            <Level2Care form={form} />
          </TabsContent>

          <TabsContent value="level3" className="p-6">
            <Level3Care form={form} />
          </TabsContent>

          <TabsContent value="calculation" className="p-6">
            <CostCalculation form={form} />
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-4 border-t mt-4">
          <Button 
            type="button"
            onClick={() => setShowSummary(true)}
            variant="outline"
          >
            View Summary
          </Button>
          
          <Button type="submit">
            Save Attendant Care Assessment
          </Button>
        </div>
      </form>

      {/* Summary Dialog */}
      <AlertDialog open={showSummary} onOpenChange={setShowSummary}>
        <AlertDialogContent className="max-w-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Attendant Care Summary</AlertDialogTitle>
            <AlertDialogDescription>
              Monthly care requirements and cost estimates
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-6 py-4">
            {currentCalculations && (
              <>
                {/* Level 1 Summary */}
                <Card className="p-4">
                  <h4 className="font-medium mb-2">Level 1 - Routine Personal Care</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>Weekly Hours: {currentCalculations.level1.weeklyHours}</div>
                    <div>Monthly Hours: {currentCalculations.level1.monthlyHours}</div>
                    <div>Rate: ${CARE_RATES.LEVEL_1}/hr</div>
                    <div>Monthly Cost: ${currentCalculations.level1.monthlyCost}</div>
                  </div>
                </Card>

                {/* Level 2 Summary */}
                <Card className="p-4">
                  <h4 className="font-medium mb-2">Level 2 - Basic Supervision</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>Weekly Hours: {currentCalculations.level2.weeklyHours}</div>
                    <div>Monthly Hours: {currentCalculations.level2.monthlyHours}</div>
                    <div>Rate: ${CARE_RATES.LEVEL_2}/hr</div>
                    <div>Monthly Cost: ${currentCalculations.level2.monthlyCost}</div>
                  </div>
                </Card>

                {/* Level 3 Summary */}
                <Card className="p-4">
                  <h4 className="font-medium mb-2">Level 3 - Complex Care</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>Weekly Hours: {currentCalculations.level3.weeklyHours}</div>
                    <div>Monthly Hours: {currentCalculations.level3.monthlyHours}</div>
                    <div>Rate: ${CARE_RATES.LEVEL_3}/hr</div>
                    <div>Monthly Cost: ${currentCalculations.level3.monthlyCost}</div>
                  </div>
                </Card>

                {/* Total Summary */}
                <Card className="p-4 border-t-2 border-blue-600">
                  <h4 className="font-medium mb-2">Total Care Requirements</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>Total Monthly Hours: {currentCalculations.summary.totalMonthlyHours}</div>
                    <div>Total Monthly Cost: ${currentCalculations.summary.totalMonthlyCost}</div>
                    <div className="col-span-2 pt-2 border-t">
                      <strong>Annual Cost Estimate: ${currentCalculations.summary.annualCost}</strong>
                    </div>
                  </div>
                </Card>
              </>
            )}
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}