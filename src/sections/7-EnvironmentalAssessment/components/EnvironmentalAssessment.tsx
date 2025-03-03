'use client';

import React, { useEffect } from 'react';
import { Form } from '@/components/ui/form';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DwellingInfo } from './DwellingInfo';
import { InteriorEnvironment } from './InteriorEnvironment';
import { AccessibilityIssues } from './AccessibilityIssues';
import { AdaptiveEquipment } from './AdaptiveEquipment';
import { OutdoorAccess } from './OutdoorAccess';
import { SafetyAssessment } from './SafetyAssessment';
import { environmentalAssessmentSchema, defaultFormState } from '../schema';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import { useAssessment } from '@/contexts/AssessmentContext';
import type { FormState } from '../types';

export function EnvironmentalAssessment() {
  const { data, updateSection } = useAssessment();
  const contextData = data.environmentalAssessment || {};
  
  const form = useForm<FormState>({
    resolver: zodResolver(environmentalAssessmentSchema),
    defaultValues: defaultFormState,
    mode: "onChange"
  });

  // Map context data to form structure if available
  useEffect(() => {
    if (contextData && Object.keys(contextData).length > 0) {
      console.log("Environmental assessment context data:", contextData);
      
      try {
        const updatedFormData = { ...form.getValues() };
        
        if (contextData.homeLayout) {
          // Update dwelling info based on homeLayout
          if (contextData.homeLayout.typeOfResidence) {
            updatedFormData.dwelling.type = contextData.homeLayout.typeOfResidence;
          }
          
          // Make sure outdoorAccess object exists before setting properties
          if (!updatedFormData.outdoorAccess) {
            updatedFormData.outdoorAccess = {};
          }
          
          if (contextData.homeLayout.entryAccess) {
            // Use the correct path from schema - it should be outdoor.access.entryAccess
            if (!updatedFormData.outdoor) {
              updatedFormData.outdoor = { ...defaultFormState.outdoor };
            }
            
            // Setting barriers rather than entryAccess (which doesn't exist in the schema)
            updatedFormData.outdoor.access.barriers = contextData.homeLayout.entryAccess;
            updatedFormData.outdoor.access.isAccessible = !contextData.homeLayout.entryAccess.toLowerCase().includes('difficult');
          }
          
          if (contextData.homeLayout.bedroomLocation) {
            if (!updatedFormData.interior) {
              updatedFormData.interior = { bedroom: {}, bathroom: {}, kitchen: {} };
            }
            
            if (!updatedFormData.interior.bedroom) {
              updatedFormData.interior.bedroom = {};
            }
            
            updatedFormData.interior.bedroom.location = contextData.homeLayout.bedroomLocation;
          }
          
          if (contextData.homeLayout.bathroomLocation) {
            if (!updatedFormData.interior) {
              updatedFormData.interior = { bedroom: {}, bathroom: {}, kitchen: {} };
            }
            
            if (!updatedFormData.interior.bathroom) {
              updatedFormData.interior.bathroom = {};
            }
            
            updatedFormData.interior.bathroom.location = contextData.homeLayout.bathroomLocation;
          }
          
          if (contextData.homeLayout.kitchenAccess) {
            if (!updatedFormData.interior) {
              updatedFormData.interior = { bedroom: {}, bathroom: {}, kitchen: {} };
            }
            
            if (!updatedFormData.interior.kitchen) {
              updatedFormData.interior.kitchen = {};
            }
            
            updatedFormData.interior.kitchen.layout = contextData.homeLayout.kitchenAccess;
          }
        }
        
        if (contextData.safetyAssessment) {
          // Update safety assessment
          if (!updatedFormData.safety) {
            updatedFormData.safety = { ...defaultFormState.safety };
          }
          
          if (contextData.safetyAssessment.trippingHazards) {
            updatedFormData.safety.trippingHazards = contextData.safetyAssessment.trippingHazards;
          }
          
          if (contextData.safetyAssessment.lightingAdequacy) {
            updatedFormData.safety.lighting = contextData.safetyAssessment.lightingAdequacy;
          }
          
          if (contextData.safetyAssessment.bathroomSafety) {
            updatedFormData.safety.bathroomSafety = contextData.safetyAssessment.bathroomSafety;
          }
          
          if (contextData.safetyAssessment.smokeDetectors) {
            updatedFormData.safety.smokeDetectors = contextData.safetyAssessment.smokeDetectors === "Present and functional" ? "Yes" : "No";
          }
          
          if (contextData.safetyAssessment.emergencyPlan) {
            updatedFormData.safety.emergencyPlan = contextData.safetyAssessment.emergencyPlan;
          }
        }
        
        form.reset(updatedFormData);
      } catch (error) {
        console.error("Error mapping environmental assessment context data:", error);
      }
    }
  }, [contextData, form]);

  useFormPersistence(form, 'environmental-assessment');

  const onSubmit = (formData: FormState) => {
    console.log('Form data:', formData);
    
    // Convert form data to the structure expected by the context
    const environmentalAssessmentData = {
      homeLayout: {
        typeOfResidence: formData.dwelling.type,
        entryAccess: formData.outdoor.access.barriers || 'Accessible',
        bedroomLocation: formData.interior?.bedroom?.location || 'Main floor',
        bathroomLocation: formData.interior?.bathroom?.location || 'Main floor',
        kitchenAccess: formData.interior?.kitchen?.layout || 'Accessible'
      },
      safetyAssessment: {
        trippingHazards: formData.safety.trippingHazards || 'None identified',
        lightingAdequacy: formData.safety.lighting || 'Adequate',
        bathroomSafety: formData.safety.bathroomSafety || 'No concerns',
        smokeDetectors: formData.safety.smokeDetectors === "Yes" ? "Present and functional" : "Needs attention",
        emergencyPlan: formData.safety.emergencyPlan || 'Not established'
      }
    };
    
    // Update the context with the form data
    updateSection('environmentalAssessment', environmentalAssessmentData);
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-slate-800">Environmental Assessment</h2>
        <p className="text-sm text-muted-foreground mt-1">Evaluate the client's living environment and identify any issues</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <FormProvider {...form}>
            <Tabs defaultValue="dwelling" className="w-full border rounded-md">
              <TabsList className="grid w-full grid-cols-6 p-0 h-auto border-b">
                <TabsTrigger 
                  className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
                  value="dwelling"
                >
                  Dwelling
                </TabsTrigger>
                <TabsTrigger 
                  className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
                  value="interior"
                >
                  Interior
                </TabsTrigger>
                <TabsTrigger 
                  className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
                  value="accessibility"
                >
                  Accessibility
                </TabsTrigger>
                <TabsTrigger 
                  className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
                  value="equipment"
                >
                  Equipment
                </TabsTrigger>
                <TabsTrigger 
                  className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
                  value="outdoor"
                >
                  Outdoor
                </TabsTrigger>
                <TabsTrigger 
                  className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
                  value="safety"
                >
                  Safety
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dwelling" className="p-6">
                <DwellingInfo />
              </TabsContent>
              
              <TabsContent value="interior" className="p-6">
                <InteriorEnvironment />
              </TabsContent>
              
              <TabsContent value="accessibility" className="p-6">
                <AccessibilityIssues />
              </TabsContent>
              
              <TabsContent value="equipment" className="p-6">
                <AdaptiveEquipment />
              </TabsContent>
              
              <TabsContent value="outdoor" className="p-6">
                <OutdoorAccess />
              </TabsContent>
              
              <TabsContent value="safety" className="p-6">
                <SafetyAssessment />
              </TabsContent>
            </Tabs>
          </FormProvider>

          <div className="flex justify-end space-x-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => form.reset()}
              type="button"
            >
              Reset
            </Button>
            <Button 
              type="submit"
            >
              Save Environmental Assessment
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}