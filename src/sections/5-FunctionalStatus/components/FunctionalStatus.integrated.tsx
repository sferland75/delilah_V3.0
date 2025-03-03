'use client';

import React, { useEffect, useState } from 'react';
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

export function FunctionalStatusIntegrated() {
  const { data, updateSection } = useAssessment();
  const contextData = data.functionalStatus || {};
  const [dataLoaded, setDataLoaded] = useState(false);
  
  console.log("Initial functional status context data:", contextData);
  
  // Map context data to form structure with error handling
  const mapContextDataToForm = (): FormState => {
    try {
      // Start with default form state
      const formData = JSON.parse(JSON.stringify(defaultFormState));
      
      if (!contextData || Object.keys(contextData).length === 0) {
        return formData;
      }
      
      console.log("Mapping functional status context data:", contextData);
      
      // Map mobility assessment if it exists
      if (contextData.mobilityAssessment) {
        // Map bed mobility
        if (contextData.mobilityAssessment.bedMobility) {
          try {
            formData.data.transfers.basic.bedMobility.independence = 
              mapMobilityToIndependence(contextData.mobilityAssessment.bedMobility);
            formData.data.transfers.basic.bedMobility.notes = 
              `Context: ${contextData.mobilityAssessment.bedMobility}`;
          } catch (error) {
            console.error("Error mapping bed mobility:", error);
          }
        }
        
        // Map transfers
        if (contextData.mobilityAssessment.transfers) {
          try {
            formData.data.transfers.basic.sitToStand.independence = 
              mapMobilityToIndependence(contextData.mobilityAssessment.transfers);
            formData.data.transfers.basic.sitToStand.notes = 
              `Context: ${contextData.mobilityAssessment.transfers}`;
          } catch (error) {
            console.error("Error mapping transfers:", error);
          }
        }
        
        // Map ambulation
        if (contextData.mobilityAssessment.ambulation) {
          try {
            formData.data.posturalTolerances.dynamic.walking.toleranceLevel = 
              contextData.mobilityAssessment.ambulation.includes('limited') ? 'moderatelyLimited' : 'normal';
            formData.data.posturalTolerances.dynamic.walking.notes = 
              `Context: ${contextData.mobilityAssessment.ambulation}`;
          } catch (error) {
            console.error("Error mapping ambulation:", error);
          }
        }
        
        // Map balance
        if (contextData.mobilityAssessment.balance) {
          try {
            formData.data.bergBalance.generalNotes = 
              `Context balance assessment: ${contextData.mobilityAssessment.balance}`;
          } catch (error) {
            console.error("Error mapping balance:", error);
          }
        }
        
        // Map endurance
        if (contextData.mobilityAssessment.endurance) {
          try {
            formData.data.posturalTolerances.dynamic.generalNotes = 
              `Context endurance assessment: ${contextData.mobilityAssessment.endurance}`;
          } catch (error) {
            console.error("Error mapping endurance:", error);
          }
        }
        
        // Map assistive devices
        if (contextData.mobilityAssessment.assistiveDevices) {
          try {
            const devices = contextData.mobilityAssessment.assistiveDevices;
            
            // Apply to various transfer and mobility items
            formData.data.transfers.basic.sitToStand.assistiveDevice = devices;
            formData.data.posturalTolerances.dynamic.walking.assistiveDevice = devices;
          } catch (error) {
            console.error("Error mapping assistive devices:", error);
          }
        }
      }
      
      // Map upper extremity function if it exists
      if (contextData.upperExtremityFunction) {
        // Map shoulder ROM
        try {
          if (contextData.upperExtremityFunction.rightShoulderROM) {
            formData.data.rangeOfMotion.shoulder.generalNotes = 
              `Right shoulder ROM: ${contextData.upperExtremityFunction.rightShoulderROM}`;
            
            // Try to extract values if they exist in the string
            const flexionMatch = contextData.upperExtremityFunction.rightShoulderROM.match(/Flexion:\s*(\d+)/i);
            if (flexionMatch && flexionMatch[1]) {
              formData.data.rangeOfMotion.shoulder.rightFlexion.value = parseInt(flexionMatch[1]);
            }
            
            const abductionMatch = contextData.upperExtremityFunction.rightShoulderROM.match(/Abduction:\s*(\d+)/i);
            if (abductionMatch && abductionMatch[1]) {
              formData.data.rangeOfMotion.shoulder.rightAbduction.value = parseInt(abductionMatch[1]);
            }
          }
          
          if (contextData.upperExtremityFunction.leftShoulderROM) {
            formData.data.rangeOfMotion.shoulder.generalNotes += 
              `\nLeft shoulder ROM: ${contextData.upperExtremityFunction.leftShoulderROM}`;
            
            // Try to extract values if they exist in the string
            const flexionMatch = contextData.upperExtremityFunction.leftShoulderROM.match(/Flexion:\s*(\d+)/i);
            if (flexionMatch && flexionMatch[1]) {
              formData.data.rangeOfMotion.shoulder.leftFlexion.value = parseInt(flexionMatch[1]);
            }
            
            const abductionMatch = contextData.upperExtremityFunction.leftShoulderROM.match(/Abduction:\s*(\d+)/i);
            if (abductionMatch && abductionMatch[1]) {
              formData.data.rangeOfMotion.shoulder.leftAbduction.value = parseInt(abductionMatch[1]);
            }
          }
        } catch (error) {
          console.error("Error mapping shoulder ROM:", error);
        }
        
        // Map grip strength
        try {
          if (contextData.upperExtremityFunction.rightGripStrength || contextData.upperExtremityFunction.leftGripStrength) {
            formData.data.manualMuscle.hand.generalNotes = 
              `Grip strength assessment - Right: ${contextData.upperExtremityFunction.rightGripStrength || 'N/A'}, ` +
              `Left: ${contextData.upperExtremityFunction.leftGripStrength || 'N/A'}`;
              
            // Map to actual fields if they contain numbers
            if (contextData.upperExtremityFunction.rightGripStrength) {
              const rightMatch = contextData.upperExtremityFunction.rightGripStrength.match(/(\d+)/);
              if (rightMatch && rightMatch[1]) {
                formData.data.manualMuscle.hand.gripStrength.right = rightMatch[1];
              }
            }
            
            if (contextData.upperExtremityFunction.leftGripStrength) {
              const leftMatch = contextData.upperExtremityFunction.leftGripStrength.match(/(\d+)/);
              if (leftMatch && leftMatch[1]) {
                formData.data.manualMuscle.hand.gripStrength.left = leftMatch[1];
              }
            }
          }
        } catch (error) {
          console.error("Error mapping grip strength:", error);
        }
        
        // Map fine motor skills
        try {
          if (contextData.upperExtremityFunction.fineMotorSkills) {
            if (!formData.data.manualMuscle.hand.generalNotes) {
              formData.data.manualMuscle.hand.generalNotes = '';
            }
            formData.data.manualMuscle.hand.generalNotes += 
              `\nFine motor skills: ${contextData.upperExtremityFunction.fineMotorSkills}`;
          }
        } catch (error) {
          console.error("Error mapping fine motor skills:", error);
        }
      }
      
      console.log("Mapped functional status form data:", formData);
      return formData;
    } catch (error) {
      console.error("Error in mapContextDataToForm:", error);
      return defaultFormState;
    }
  };
  
  // Helper function to map mobility descriptions to independence levels
  const mapMobilityToIndependence = (mobilityDescription: string): "independent" | "supervision" | "minimalAssist" | "moderateAssist" | "maximalAssist" | "dependent" | "setup" | "notAssessed" => {
    try {
      const lowerDesc = mobilityDescription.toLowerCase();
      
      if (lowerDesc.includes('independent')) return 'independent';
      if (lowerDesc.includes('supervision')) return 'supervision';
      if (lowerDesc.includes('minimal')) return 'minimalAssist';
      if (lowerDesc.includes('moderate')) return 'moderateAssist';
      if (lowerDesc.includes('maximal')) return 'maximalAssist';
      if (lowerDesc.includes('dependent')) return 'dependent';
      if (lowerDesc.includes('setup')) return 'setup';
      
      return 'independent'; // Default
    } catch (error) {
      console.error("Error in mapMobilityToIndependence:", error);
      return 'independent';
    }
  };

  // Initial form setup with proper error handling
  const form = useForm<FormState>({
    resolver: zodResolver(functionalStatusSchema),
    defaultValues: defaultFormState,
    mode: "onChange"
  });

  // Update form when context data changes with proper error handling
  useEffect(() => {
    try {
      if (contextData && Object.keys(contextData).length > 0) {
        console.log("Functional status context data loaded, updating form");
        const formData = mapContextDataToForm();
        form.reset(formData);
        setDataLoaded(true);
      }
    } catch (error) {
      console.error("Error updating form from context:", error);
    }
  }, [contextData]);

  useFormPersistence(form, 'functional-status');

  const onSubmit = (formData: FormState) => {
    try {
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
        },
        posturalTolerances: {
          sitting: getSittingToleranceFromForm(formData),
          standing: getStandingToleranceFromForm(formData),
          walking: getWalkingToleranceFromForm(formData)
        },
        balanceAssessment: {
          bergBalanceScore: getBergBalanceScoreFromForm(formData),
          standingBalance: getStandingBalanceFromForm(formData),
          sittingBalance: getSittingBalanceFromForm(formData),
          dynamicBalance: getDynamicBalanceFromForm(formData)
        }
      };
      
      // Update the context with the form data
      updateSection('functionalStatus', functionalStatusData);
    } catch (error) {
      console.error("Error preparing data for context update:", error);
    }
  };
  
  // Helper functions to extract data from the form structure
  const getBedMobilityFromForm = (formData: FormState): string => {
    try {
      const bedMobility = formData.data.transfers.basic.bedMobility;
      return `${bedMobility.independence}${bedMobility.notes ? ': ' + bedMobility.notes : ''}`;
    } catch (error) {
      console.error("Error in getBedMobilityFromForm:", error);
      return "Not assessed";
    }
  };
  
  const getTransfersFromForm = (formData: FormState): string => {
    try {
      const sitToStand = formData.data.transfers.basic.sitToStand;
      return `${sitToStand.independence}${sitToStand.notes ? ': ' + sitToStand.notes : ''}`;
    } catch (error) {
      console.error("Error in getTransfersFromForm:", error);
      return "Not assessed";
    }
  };
  
  const getAmbulationFromForm = (formData: FormState): string => {
    try {
      const walking = formData.data.posturalTolerances.dynamic.walking;
      return `${walking.toleranceLevel}${walking.notes ? ': ' + walking.notes : ''}`;
    } catch (error) {
      console.error("Error in getAmbulationFromForm:", error);
      return "Not assessed";
    }
  };
  
  const getBalanceFromForm = (formData: FormState): string => {
    try {
      return formData.data.bergBalance.generalNotes || 'Not specifically assessed';
    } catch (error) {
      console.error("Error in getBalanceFromForm:", error);
      return "Not assessed";
    }
  };
  
  const getEnduranceFromForm = (formData: FormState): string => {
    try {
      return formData.data.posturalTolerances.dynamic.generalNotes || 'Not specifically assessed';
    } catch (error) {
      console.error("Error in getEnduranceFromForm:", error);
      return "Not assessed";
    }
  };
  
  const getAssistiveDevicesFromForm = (formData: FormState): string => {
    try {
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
      
      return devices.length > 0 ? [...new Set(devices)].join(', ') : 'None currently';
    } catch (error) {
      console.error("Error in getAssistiveDevicesFromForm:", error);
      return "Not documented";
    }
  };
  
  const getRightShoulderROMFromForm = (formData: FormState): string => {
    try {
      const shoulderROM = formData.data.rangeOfMotion.shoulder;
      return `Flexion: ${shoulderROM.rightFlexion.value || 'WNL'}°, Abduction: ${shoulderROM.rightAbduction.value || 'WNL'}°, External rotation: ${shoulderROM.rightExternalRotation.value || 'WNL'}°`;
    } catch (error) {
      console.error("Error in getRightShoulderROMFromForm:", error);
      return "WNL";
    }
  };
  
  const getLeftShoulderROMFromForm = (formData: FormState): string => {
    try {
      const shoulderROM = formData.data.rangeOfMotion.shoulder;
      return `Flexion: ${shoulderROM.leftFlexion.value || 'WNL'}°, Abduction: ${shoulderROM.leftAbduction.value || 'WNL'}°, External rotation: ${shoulderROM.leftExternalRotation.value || 'WNL'}°`;
    } catch (error) {
      console.error("Error in getLeftShoulderROMFromForm:", error);
      return "WNL";
    }
  };
  
  const getRightGripStrengthFromForm = (formData: FormState): string => {
    try {
      const gripStrength = formData.data.manualMuscle.hand.gripStrength;
      return gripStrength.right || 'Normal';
    } catch (error) {
      console.error("Error in getRightGripStrengthFromForm:", error);
      return "Normal";
    }
  };
  
  const getLeftGripStrengthFromForm = (formData: FormState): string => {
    try {
      const gripStrength = formData.data.manualMuscle.hand.gripStrength;
      return gripStrength.left || 'Normal';
    } catch (error) {
      console.error("Error in getLeftGripStrengthFromForm:", error);
      return "Normal";
    }
  };
  
  const getFineMotorSkillsFromForm = (formData: FormState): string => {
    try {
      return formData.data.manualMuscle.hand.generalNotes || 'Intact bilaterally';
    } catch (error) {
      console.error("Error in getFineMotorSkillsFromForm:", error);
      return "Intact bilaterally";
    }
  };
  
  const getSittingToleranceFromForm = (formData: FormState): string => {
    try {
      const sitting = formData.data.posturalTolerances.static.sitting;
      return `${sitting.toleranceLevel}${sitting.duration ? ', ' + sitting.duration + ' ' + sitting.unit : ''}`;
    } catch (error) {
      console.error("Error in getSittingToleranceFromForm:", error);
      return "Not assessed";
    }
  };
  
  const getStandingToleranceFromForm = (formData: FormState): string => {
    try {
      const standing = formData.data.posturalTolerances.static.standing;
      return `${standing.toleranceLevel}${standing.duration ? ', ' + standing.duration + ' ' + standing.unit : ''}`;
    } catch (error) {
      console.error("Error in getStandingToleranceFromForm:", error);
      return "Not assessed";
    }
  };
  
  const getWalkingToleranceFromForm = (formData: FormState): string => {
    try {
      const walking = formData.data.posturalTolerances.dynamic.walking;
      return `${walking.toleranceLevel}${walking.duration ? ', ' + walking.duration + ' ' + walking.unit : ''}`;
    } catch (error) {
      console.error("Error in getWalkingToleranceFromForm:", error);
      return "Not assessed";
    }
  };
  
  const getBergBalanceScoreFromForm = (formData: FormState): number => {
    try {
      // Calculate total Berg Balance score
      let totalScore = 0;
      const berg = formData.data.bergBalance;
      
      // Add up all item scores
      if (berg.sittingToStanding) totalScore += berg.sittingToStanding.score;
      if (berg.standingUnsupported) totalScore += berg.standingUnsupported.score;
      if (berg.sittingUnsupported) totalScore += berg.sittingUnsupported.score;
      if (berg.standingToSitting) totalScore += berg.standingToSitting.score;
      if (berg.transfers) totalScore += berg.transfers.score;
      if (berg.standingWithEyesClosed) totalScore += berg.standingWithEyesClosed.score;
      if (berg.standingWithFeetTogether) totalScore += berg.standingWithFeetTogether.score;
      if (berg.reachingForwardWithOutstretchedArm) totalScore += berg.reachingForwardWithOutstretchedArm.score;
      if (berg.pickingUpObject) totalScore += berg.pickingUpObject.score;
      if (berg.turningToLookBehind) totalScore += berg.turningToLookBehind.score;
      if (berg.turning360Degrees) totalScore += berg.turning360Degrees.score;
      if (berg.placingAlternateFoot) totalScore += berg.placingAlternateFoot.score;
      if (berg.standingWithOneFootAhead) totalScore += berg.standingWithOneFootAhead.score;
      if (berg.standingOnOneLeg) totalScore += berg.standingOnOneLeg.score;
      
      return totalScore;
    } catch (error) {
      console.error("Error in getBergBalanceScoreFromForm:", error);
      return 0;
    }
  };
  
  const getStandingBalanceFromForm = (formData: FormState): string => {
    try {
      // Get relevant Berg Balance items
      const berg = formData.data.bergBalance;
      
      if (berg.standingUnsupported.score === 4) {
        return "Good";
      } else if (berg.standingUnsupported.score === 3) {
        return "Fair";
      } else if (berg.standingUnsupported.score <= 2) {
        return "Poor";
      }
      
      return "Not assessed";
    } catch (error) {
      console.error("Error in getStandingBalanceFromForm:", error);
      return "Not assessed";
    }
  };
  
  const getSittingBalanceFromForm = (formData: FormState): string => {
    try {
      // Get relevant Berg Balance items
      const berg = formData.data.bergBalance;
      
      if (berg.sittingUnsupported.score === 4) {
        return "Good";
      } else if (berg.sittingUnsupported.score === 3) {
        return "Fair";
      } else if (berg.sittingUnsupported.score <= 2) {
        return "Poor";
      }
      
      return "Not assessed";
    } catch (error) {
      console.error("Error in getSittingBalanceFromForm:", error);
      return "Not assessed";
    }
  };
  
  const getDynamicBalanceFromForm = (formData: FormState): string => {
    try {
      // Get relevant Berg Balance items
      const berg = formData.data.bergBalance;
      
      // Average scores from dynamic balance tasks
      const items = [
        berg.turning360Degrees,
        berg.placingAlternateFoot,
        berg.standingWithOneFootAhead
      ];
      
      const validItems = items.filter(item => typeof item.score === 'number');
      if (validItems.length === 0) return "Not assessed";
      
      const average = validItems.reduce((sum, item) => sum + item.score, 0) / validItems.length;
      
      if (average >= 3.5) {
        return "Good";
      } else if (average >= 2) {
        return "Fair";
      } else {
        return "Poor";
      }
    } catch (error) {
      console.error("Error in getDynamicBalanceFromForm:", error);
      return "Not assessed";
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-slate-800">Functional Status Assessment</h2>
        <p className="text-sm text-muted-foreground mt-1">Comprehensive evaluation of functional abilities and limitations</p>
      </div>
      
      {dataLoaded && (
        <Alert className="mb-6 bg-blue-50 text-blue-800 border-blue-200">
          <InfoIcon className="h-4 w-4 text-blue-800" />
          <AlertTitle>Data Loaded From Assessment Context</AlertTitle>
          <AlertDescription>
            Some form fields have been pre-populated with data from the assessment context. You can review and modify the data as needed.
          </AlertDescription>
        </Alert>
      )}

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
              onClick={() => form.reset(defaultFormState)}
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