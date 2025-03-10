'use client';

import React, { useEffect, useCallback } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { CARE_RATES, DEFAULT_ACTIVITY } from "../constants";
import { useAssessment } from '@/contexts/AssessmentContext';
import _ from 'lodash';

interface AttendantCareSectionProps {
  initialData?: AttendantCareFormData;
  onDataChange?: (data: AttendantCareFormData) => void;
}

export function AttendantCareSection({ initialData, onDataChange }: AttendantCareSectionProps) {
  const { data, updateSection } = useAssessment();
  const contextData = data.attendantCare || {};
  
  const [showSummary, setShowSummary] = React.useState(false);
  const [currentCalculations, setCurrentCalculations] = React.useState<any>(null);

  // Map context data to initial form values if available
  const getInitialFormData = (): AttendantCareFormData => {
    if (contextData && Object.keys(contextData).length > 0) {
      try {
        console.log("Mapping attendant care context data:", contextData);
        
        // Create a basic mapping from context data to form data
        // This uses the actual schema structure with minutes, timesPerWeek, etc.
        const mappedData: Partial<AttendantCareFormData> = {
          level1: {
            personalCare: {
              bathing: {
                ...DEFAULT_ACTIVITY,
                minutes: 15,
                timesPerWeek: 7,
                notes: contextData.personalCare?.bathing || "No data"
              },
              dressing: {
                ...DEFAULT_ACTIVITY,
                minutes: 10,
                timesPerWeek: 14,
                notes: contextData.personalCare?.dressing || "No data"
              },
              grooming: {
                ...DEFAULT_ACTIVITY,
                minutes: 10,
                timesPerWeek: 7,
                notes: contextData.personalCare?.grooming || "No data"
              },
              toileting: {
                ...DEFAULT_ACTIVITY,
                minutes: 5,
                timesPerWeek: 21,
                notes: contextData.personalCare?.toileting || "No data"
              }
            }
          },
          level2: {
            householdManagement: {
              mealPreparation: {
                ...DEFAULT_ACTIVITY,
                minutes: 20,
                timesPerWeek: 21,
                notes: contextData.homeManagement?.mealPreparation || "No data"
              },
              cleaning: {
                ...DEFAULT_ACTIVITY,
                minutes: 30,
                timesPerWeek: 3,
                notes: contextData.homeManagement?.cleaning || "No data"
              },
              laundry: {
                ...DEFAULT_ACTIVITY,
                minutes: 45,
                timesPerWeek: 2,
                notes: contextData.homeManagement?.laundry || "No data"
              }
            }
          },
          level3: {
            communityAccess: {
              transportation: {
                ...DEFAULT_ACTIVITY,
                minutes: 60,
                timesPerWeek: 2,
                notes: contextData.communityAccess?.transportation || "No data"
              },
              shopping: {
                ...DEFAULT_ACTIVITY,
                minutes: 45,
                timesPerWeek: 1,
                notes: contextData.communityAccess?.shopping || "No data"
              }
            }
          },
          summary: {
            notes: "Assessment data loaded from context",
            reviewDate: new Date().toISOString().split('T')[0]
          }
        };
        
        // Return the merged form data with defaults
        return _.merge({}, initialData || {}, mappedData);
      } catch (error) {
        console.error("Error mapping attendant care context data:", error);
        return initialData || {};
      }
    }
    
    return initialData || {};
  };

  const form = useForm<AttendantCareFormData>({
    resolver: zodResolver(attendantCareSchema),
    defaultValues: getInitialFormData(),
  });
  
  // Update form when context data changes
  useEffect(() => {
    if (contextData && Object.keys(contextData).length > 0) {
      console.log("Attendant care context data:", contextData);
      form.reset(getInitialFormData());
    }
  }, [contextData]);

  // Debounce the watch function to prevent too many updates
  const debouncedWatch = useCallback(
    _.debounce(() => form.watch(), 300),
    [form]
  );

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
  
  // Handle form submission
  const onSubmit = (formData: AttendantCareFormData) => {
    console.log('Form data:', formData);
    
    // Calculate the totals to get monthly hours
    const calculations = calculateSummary(formData);
    
    // Convert form data to the structure expected by the context
    const attendantCareData = {
      personalCare: {
        bathing: formData.level1?.personalCare?.bathing?.notes || "No data provided",
        dressing: formData.level1?.personalCare?.dressing?.notes || "No data provided",
        grooming: formData.level1?.personalCare?.grooming?.notes || "No data provided",
        toileting: formData.level1?.personalCare?.toileting?.notes || "No data provided"
      },
      homeManagement: {
        mealPreparation: formData.level2?.householdManagement?.mealPreparation?.notes || "No data provided",
        cleaning: formData.level2?.householdManagement?.cleaning?.notes || "No data provided",
        laundry: formData.level2?.householdManagement?.laundry?.notes || "No data provided"
      },
      communityAccess: {
        transportation: formData.level3?.communityAccess?.transportation?.notes || "No data provided",
        shopping: formData.level3?.communityAccess?.shopping?.notes || "No data provided"
      },
      recommendedHours: {
        personalCare: Math.round(calculations.level1.monthlyHours),
        homeManagement: Math.round(calculations.level2.monthlyHours), 
        communityAccess: Math.round(calculations.level3.monthlyHours),
        total: Math.round(calculations.summary.totalMonthlyHours)
      },
      assessment: {
        date: formData.summary?.reviewDate,
        notes: formData.summary?.notes,
        totalCost: calculations.summary.totalMonthlyCost
      }
    };
    
    // Update the context with the form data
    updateSection('attendantCare', attendantCareData);
  };
  
  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-slate-800">Assessment of Attendant Care Needs</h2>
        <p className="text-sm text-muted-foreground mt-1">
          This form assesses the future needs for attendant care required by the applicant as a result of an automobile accident.
        </p>
      </div>

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