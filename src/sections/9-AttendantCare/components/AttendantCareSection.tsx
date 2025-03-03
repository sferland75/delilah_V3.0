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
import { CARE_RATES } from "../constants";
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
        // Create a basic mapping from context data to form data
        // This is a simplified version - a complete implementation would map all fields
        const mappedData: Partial<AttendantCareFormData> = {
          level1: {
            personalCare: {
              bathing: {
                assistance: mapAssistanceLevel(contextData.personalCare?.bathing),
                hoursPerWeek: getHoursFromContext(contextData.recommendedHours?.personalCare, 7),
                notes: `Context data: ${contextData.personalCare?.bathing}`
              },
              dressing: {
                assistance: mapAssistanceLevel(contextData.personalCare?.dressing),
                hoursPerWeek: getHoursFromContext(contextData.recommendedHours?.personalCare, 7),
                notes: `Context data: ${contextData.personalCare?.dressing}`
              },
              grooming: {
                assistance: mapAssistanceLevel(contextData.personalCare?.grooming),
                hoursPerWeek: getHoursFromContext(contextData.recommendedHours?.personalCare, 7),
                notes: `Context data: ${contextData.personalCare?.grooming}`
              },
              toileting: {
                assistance: mapAssistanceLevel(contextData.personalCare?.toileting),
                hoursPerWeek: getHoursFromContext(contextData.recommendedHours?.personalCare, 7),
                notes: `Context data: ${contextData.personalCare?.toileting}`
              }
            }
          },
          level2: {
            householdManagement: {
              mealPreparation: {
                assistance: mapAssistanceLevel(contextData.homeManagement?.mealPreparation),
                hoursPerWeek: getHoursFromContext(contextData.recommendedHours?.homeManagement, 4),
                notes: `Context data: ${contextData.homeManagement?.mealPreparation}`
              },
              cleaning: {
                assistance: mapAssistanceLevel(contextData.homeManagement?.cleaning),
                hoursPerWeek: getHoursFromContext(contextData.recommendedHours?.homeManagement, 4),
                notes: `Context data: ${contextData.homeManagement?.cleaning}`
              },
              laundry: {
                assistance: mapAssistanceLevel(contextData.homeManagement?.laundry),
                hoursPerWeek: getHoursFromContext(contextData.recommendedHours?.homeManagement, 4),
                notes: `Context data: ${contextData.homeManagement?.laundry}`
              }
            }
          },
          level3: {
            communityAccess: {
              transportation: {
                assistance: mapAssistanceLevel(contextData.communityAccess?.transportation),
                hoursPerWeek: getHoursFromContext(contextData.recommendedHours?.communityAccess, 2),
                notes: `Context data: ${contextData.communityAccess?.transportation}`
              },
              shopping: {
                assistance: mapAssistanceLevel(contextData.communityAccess?.shopping),
                hoursPerWeek: getHoursFromContext(contextData.recommendedHours?.communityAccess, 2),
                notes: `Context data: ${contextData.communityAccess?.shopping}`
              }
            }
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
  
  // Helper functions to map context data to form format
  const mapAssistanceLevel = (assistanceText: string | undefined): string => {
    if (!assistanceText) return "none";
    
    const text = assistanceText.toLowerCase();
    if (text.includes("moderate")) return "moderate";
    if (text.includes("minimal")) return "minimal";
    if (text.includes("maximal") || text.includes("maximum")) return "maximal";
    if (text.includes("setup")) return "setup";
    if (text.includes("standby")) return "standby";
    if (text.includes("independent")) return "none";
    
    return "minimal"; // Default value
  };
  
  const getHoursFromContext = (totalHours: number | undefined, defaultHours: number): number => {
    if (!totalHours) return defaultHours;
    
    // Convert monthly hours to weekly
    return Math.round((totalHours / 4) * 10) / 10;
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
        personalCare: getTotalHoursForLevel("level1", formData),
        homeManagement: getTotalHoursForLevel("level2", formData), 
        communityAccess: getTotalHoursForLevel("level3", formData),
        total: getTotalHoursForLevel("level1", formData) + 
               getTotalHoursForLevel("level2", formData) + 
               getTotalHoursForLevel("level3", formData)
      }
    };
    
    // Update the context with the form data
    updateSection('attendantCare', attendantCareData);
  };
  
  // Helper function to calculate total hours for a level
  const getTotalHoursForLevel = (level: "level1" | "level2" | "level3", formData: AttendantCareFormData): number => {
    const calculations = calculateSummary(formData);
    
    // Convert weekly hours to monthly (approximately 4 weeks per month)
    const monthlyHours = calculations[level]?.monthlyHours || 0;
    
    // Round to nearest whole number
    return Math.round(monthlyHours);
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