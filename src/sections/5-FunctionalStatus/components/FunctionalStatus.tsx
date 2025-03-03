'use client';

import React, { useEffect } from 'react';
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

export function FunctionalStatus() {
  const { data, updateSection } = useAssessment();
  const contextData = data.functionalStatus || {};
  
  // Initial form setup
  const form = useForm<FormState>({
    resolver: zodResolver(functionalStatusSchema),
    defaultValues: defaultFormState,
    mode: "onChange"
  });

  // Map context data to form structure if available
  useEffect(() => {
    if (contextData && Object.keys(contextData).length > 0) {
      console.log("Functional status context data:", contextData);
      
      // This is a simplified mapping since the form structure is complex
      // For a real implementation, you would need more detailed mapping
      
      try {
        if (contextData.mobilityAssessment) {
          // Map to transfers section
          const updatedFormData = { ...form.getValues() };
          
          // Update basic transfers based on mobilityAssessment
          const basicTransfers = updatedFormData.data.transfers.basic;
          
          if (contextData.mobilityAssessment.bedMobility) {
            basicTransfers.bedMobility.independence = mapMobilityToIndependence(contextData.mobilityAssessment.bedMobility);
            basicTransfers.bedMobility.notes = `Context data: ${contextData.mobilityAssessment.bedMobility}`;
          }
          
          if (contextData.mobilityAssessment.transfers) {
            basicTransfers.sitToStand.independence = mapMobilityToIndependence(contextData.mobilityAssessment.transfers);
            basicTransfers.sitToStand.notes = `Context data: ${contextData.mobilityAssessment.transfers}`;
          }
          
          if (contextData.mobilityAssessment.ambulation) {
            updatedFormData.data.posturalTolerances.dynamic.walking.notes = 
              `Context data: ${contextData.mobilityAssessment.ambulation}`;
          }
          
          if (contextData.mobilityAssessment.balance) {
            updatedFormData.data.bergBalance.generalNotes = 
              `Context data balance assessment: ${contextData.mobilityAssessment.balance}`;
          }
          
          if (contextData.mobilityAssessment.endurance) {
            updatedFormData.data.posturalTolerances.dynamic.generalNotes = 
              `Context data endurance assessment: ${contextData.mobilityAssessment.endurance}`;
          }
          
          form.reset(updatedFormData);
        }
        
        if (contextData.upperExtremityFunction) {
          // Map to range of motion and manual muscle testing
          const updatedFormData = { ...form.getValues() };
          
          // Update notes fields with context data
          if (contextData.upperExtremityFunction.rightShoulderROM) {
            updatedFormData.data.rangeOfMotion.shoulder.generalNotes = 
              `Right shoulder ROM: ${contextData.upperExtremityFunction.rightShoulderROM}`;
          }
          
          if (contextData.upperExtremityFunction.leftShoulderROM) {
            updatedFormData.data.rangeOfMotion.shoulder.generalNotes += 
              `\nLeft shoulder ROM: ${contextData.upperExtremityFunction.leftShoulderROM}`;
          }
          
          if (contextData.upperExtremityFunction.rightGripStrength || contextData.upperExtremityFunction.leftGripStrength) {
            updatedFormData.data.manualMuscle.hand.generalNotes = 
              `Grip strength assessment - Right: ${contextData.upperExtremityFunction.rightGripStrength || 'N/A'}, ` +
              `Left: ${contextData.upperExtremityFunction.leftGripStrength || 'N/A'}`;
          }
          
          if (contextData.upperExtremityFunction.fineMotorSkills) {
            updatedFormData.data.manualMuscle.hand.generalNotes += 
              `\nFine motor skills: ${contextData.upperExtremityFunction.fineMotorSkills}`;
          }
          
          form.reset(updatedFormData);
        }
      } catch (error) {
        console.error("Error mapping functional status context data:", error);
      }
    }
  }, [contextData, form]);

  // Helper function to map mobility descriptions to independence levels
  const mapMobilityToIndependence = (mobilityDescription: string): "independent" | "supervision" | "minimalAssist" | "moderateAssist" | "maximalAssist" | "dependent" | "setup" | "notAssessed" => {
    const lowerDesc = mobilityDescription.toLowerCase();
    
    if (lowerDesc.includes('independent')) return 'independent';
    if (lowerDesc.includes('supervision')) return 'supervision';
    if (lowerDesc.includes('minimal')) return 'minimalAssist';
    if (lowerDesc.includes('moderate')) return 'moderateAssist';
    if (lowerDesc.includes('maximal')) return 'maximalAssist';
    if (lowerDesc.includes('dependent')) return 'dependent';
    if (lowerDesc.includes('setup')) return 'setup';
    
    return 'independent'; // Default
  };

  useFormPersistence(form, 'functional-status');

  const onSubmit = (formData: FormState) => {
    console.log('Form data:', formData);
    
    // Convert form data to the structure expected by the context
    const functionalStatusData = {
      mobilityAssessment: {
        bedMobility: getBedMobilityFromForm(formData),
        transfers: getTransfersFromForm(formData),
        ambulation: getAmbulationFromForm(formData),
        balance: getBalanceFromForm(formData),
        endurance: getEnduranceFromForm(formData),
        assistiveDevices: getAssistiveDevicesFromForm(formData)
      },
      upperExtremityFunction: {
        dominance: "Right-handed", // Hard-coded for now
        rightShoulderROM: getRightShoulderROMFromForm(formData),
        leftShoulderROM: getLeftShoulderROMFromForm(formData),
        rightGripStrength: getRightGripStrengthFromForm(formData),
        leftGripStrength: getLeftGripStrengthFromForm(formData),
        fineMotorSkills: getFineMotorSkillsFromForm(formData)
      }
    };
    
    // Update the context with the form data
    updateSection('functionalStatus', functionalStatusData);
  };
  
  // Helper functions to extract data from the form structure
  const getBedMobilityFromForm = (formData: FormState): string => {
    const bedMobility = formData.data.transfers.basic.bedMobility;
    return `${bedMobility.independence}${bedMobility.notes ? ': ' + bedMobility.notes : ''}`;
  };
  
  const getTransfersFromForm = (formData: FormState): string => {
    const sitToStand = formData.data.transfers.basic.sitToStand;
    return `${sitToStand.independence}${sitToStand.notes ? ': ' + sitToStand.notes : ''}`;
  };
  
  const getAmbulationFromForm = (formData: FormState): string => {
    const walking = formData.data.posturalTolerances.dynamic.walking;
    return `${walking.toleranceLevel}${walking.notes ? ': ' + walking.notes : ''}`;
  };
  
  const getBalanceFromForm = (formData: FormState): string => {
    return formData.data.bergBalance.generalNotes || 'Not specifically assessed';
  };
  
  const getEnduranceFromForm = (formData: FormState): string => {
    return formData.data.posturalTolerances.dynamic.generalNotes || 'Not specifically assessed';
  };
  
  const getAssistiveDevicesFromForm = (formData: FormState): string => {
    const devices = [];
    
    // Check for assistive devices in transfers
    Object.entries(formData.data.transfers.basic).forEach(([key, value]) => {
      if (typeof value === 'object' && value.assistiveDevice) {
        devices.push(value.assistiveDevice);
      }
    });
    
    Object.entries(formData.data.transfers.functional).forEach(([key, value]) => {
      if (typeof value === 'object' && value.assistiveDevice) {
        devices.push(value.assistiveDevice);
      }
    });
    
    // Check for assistive devices in postural tolerances
    Object.entries(formData.data.posturalTolerances.dynamic).forEach(([key, value]) => {
      if (typeof value === 'object' && value.assistiveDevice) {
        devices.push(value.assistiveDevice);
      }
    });
    
    return devices.length > 0 ? devices.join(', ') : 'None currently';
  };
  
  const getRightShoulderROMFromForm = (formData: FormState): string => {
    const shoulderROM = formData.data.rangeOfMotion.shoulder;
    return `Flexion: ${shoulderROM.rightFlexion.value || 'WNL'}°, Abduction: ${shoulderROM.rightAbduction.value || 'WNL'}°, External rotation: ${shoulderROM.rightExternalRotation.value || 'WNL'}°`;
  };
  
  const getLeftShoulderROMFromForm = (formData: FormState): string => {
    const shoulderROM = formData.data.rangeOfMotion.shoulder;
    return `Flexion: ${shoulderROM.leftFlexion.value || 'WNL'}°, Abduction: ${shoulderROM.leftAbduction.value || 'WNL'}°, External rotation: ${shoulderROM.leftExternalRotation.value || 'WNL'}°`;
  };
  
  const getRightGripStrengthFromForm = (formData: FormState): string => {
    const gripStrength = formData.data.manualMuscle.hand.gripStrength;
    return gripStrength.right || 'Normal';
  };
  
  const getLeftGripStrengthFromForm = (formData: FormState): string => {
    const gripStrength = formData.data.manualMuscle.hand.gripStrength;
    return gripStrength.left || 'Normal';
  };
  
  const getFineMotorSkillsFromForm = (formData: FormState): string => {
    return formData.data.manualMuscle.hand.generalNotes || 'Intact bilaterally';
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-slate-800">Functional Status Assessment</h2>
        <p className="text-sm text-muted-foreground mt-1">Comprehensive evaluation of functional abilities and limitations</p>
      </div>

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
                <RangeOfMotion />
              </TabsContent>
              
              <TabsContent value="mmt" className="p-6">
                <ManualMuscle />
              </TabsContent>
              
              <TabsContent value="berg" className="p-6">
                <BergBalance />
              </TabsContent>
              
              <TabsContent value="postural" className="p-6">
                <PosturalTolerances />
              </TabsContent>
              
              <TabsContent value="transfers" className="p-6">
                <TransfersAssessment />
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
              Save Functional Status
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}