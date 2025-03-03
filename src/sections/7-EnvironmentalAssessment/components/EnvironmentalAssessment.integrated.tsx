'use client';

import React, { useEffect } from 'react';
import { Form } from '@/components/ui/form';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react'; 
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

export function EnvironmentalAssessmentIntegrated() {
  const { data, updateSection } = useAssessment();
  const contextData = data.environmentalAssessment || {};
  
  // Map context data to form structure with comprehensive error handling
  const mapContextDataToForm = (): FormState => {
    try {
      // Start with default form state
      const formData = JSON.parse(JSON.stringify(defaultFormState));
      
      if (!contextData || Object.keys(contextData).length === 0) {
        return formData;
      }
      
      // Map home layout if it exists
      if (contextData.homeLayout) {
        try {
          // Map dwelling type
          if (contextData.homeLayout.typeOfResidence) {
            const typeMapping = {
              'Single-family home': 'house',
              'Apartment': 'apartment',
              'Condominium': 'condo',
              'Townhouse': 'townhouse',
              'Mobile home': 'mobile_home'
            };
            
            const dwellingType = typeMapping[contextData.homeLayout.typeOfResidence] || 'other';
            formData.dwelling.type = dwellingType;
            
            // If type is other, add a note
            if (dwellingType === 'other') {
              formData.dwelling.generalNotes = `Original dwelling type: ${contextData.homeLayout.typeOfResidence}`;
            }
          }
          
          // Map entry access to outdoor section
          if (contextData.homeLayout.entryAccess) {
            formData.outdoor.access.isAccessible = !contextData.homeLayout.entryAccess.toLowerCase().includes('barrier') && 
                                                 !contextData.homeLayout.entryAccess.toLowerCase().includes('difficult');
            
            if (!formData.outdoor.access.isAccessible) {
              formData.outdoor.access.barriers = contextData.homeLayout.entryAccess;
            }
          }
          
          // Map bedroom location
          if (contextData.homeLayout.bedroomLocation) {
            // Count bedrooms based on description
            if (contextData.homeLayout.bedroomLocation.includes('multiple')) {
              formData.dwelling.rooms.bedrooms = 2;
            } else {
              formData.dwelling.rooms.bedrooms = 1;
            }
            
            // Add to accessibility issues if there's a location problem
            if (contextData.homeLayout.bedroomLocation.toLowerCase().includes('difficult') || 
                contextData.homeLayout.bedroomLocation.toLowerCase().includes('problem')) {
              formData.accessibilityIssues.issues.push({
                id: Date.now().toString(),
                area: 'bedroom',
                description: `Bedroom location issue: ${contextData.homeLayout.bedroomLocation}`,
                impactLevel: 'moderate',
                currentSolutions: '',
                recommendations: '',
                isResolvedWithAssistance: false
              });
            }
          }
          
          // Map bathroom location
          if (contextData.homeLayout.bathroomLocation) {
            // Count bathrooms based on description
            if (contextData.homeLayout.bathroomLocation.includes('multiple')) {
              formData.dwelling.rooms.bathrooms = 2;
            } else {
              formData.dwelling.rooms.bathrooms = 1;
            }
            
            // Add to accessibility issues if there's a location problem
            if (contextData.homeLayout.bathroomLocation.toLowerCase().includes('difficult') || 
                contextData.homeLayout.bathroomLocation.toLowerCase().includes('problem')) {
              formData.accessibilityIssues.issues.push({
                id: Date.now().toString() + 1,
                area: 'bathroom',
                description: `Bathroom location issue: ${contextData.homeLayout.bathroomLocation}`,
                impactLevel: 'moderate',
                currentSolutions: '',
                recommendations: '',
                isResolvedWithAssistance: false
              });
            }
          }
          
          // Map kitchen access
          if (contextData.homeLayout.kitchenAccess) {
            formData.dwelling.rooms.kitchen = true;
            
            // Add to accessibility issues if there's an access problem
            if (contextData.homeLayout.kitchenAccess.toLowerCase().includes('difficult') || 
                contextData.homeLayout.kitchenAccess.toLowerCase().includes('problem') ||
                contextData.homeLayout.kitchenAccess.toLowerCase().includes('limited')) {
              formData.accessibilityIssues.issues.push({
                id: Date.now().toString() + 2,
                area: 'kitchen',
                description: `Kitchen access issue: ${contextData.homeLayout.kitchenAccess}`,
                impactLevel: 'moderate',
                currentSolutions: '',
                recommendations: '',
                isResolvedWithAssistance: false
              });
            }
          }
        } catch (error) {
          console.error("Error mapping home layout:", error);
        }
      }
      
      // Map safety assessment if it exists
      if (contextData.safetyAssessment) {
        try {
          // Map tripping hazards
          if (contextData.safetyAssessment.trippingHazards) {
            const hazardText = contextData.safetyAssessment.trippingHazards;
            
            if (hazardText !== 'None identified' && hazardText !== 'No hazards identified') {
              formData.safety.hazards.push({
                id: Date.now().toString() + 3,
                type: 'tripping',
                location: 'Multiple areas',
                description: hazardText,
                riskLevel: hazardText.toLowerCase().includes('high') ? 'high' : 'moderate',
                mitigationPlan: ''
              });
            }
          }
          
          // Map lighting adequacy
          if (contextData.safetyAssessment.lightingAdequacy) {
            formData.interiorEnvironment.lighting.isAdequate = 
              contextData.safetyAssessment.lightingAdequacy.toLowerCase().includes('adequate') || 
              contextData.safetyAssessment.lightingAdequacy.toLowerCase().includes('good');
            
            if (!formData.interiorEnvironment.lighting.isAdequate) {
              formData.interiorEnvironment.lighting.concerns = contextData.safetyAssessment.lightingAdequacy;
            }
          }
          
          // Map bathroom safety
          if (contextData.safetyAssessment.bathroomSafety) {
            const bathroomSafetyText = contextData.safetyAssessment.bathroomSafety;
            
            if (!bathroomSafetyText.toLowerCase().includes('adequate') && 
                !bathroomSafetyText.toLowerCase().includes('good')) {
              formData.safety.hazards.push({
                id: Date.now().toString() + 4,
                type: 'falling',
                location: 'Bathroom',
                description: bathroomSafetyText,
                riskLevel: 'high',
                mitigationPlan: ''
              });
            }
            
            // If there are grab bars or equipment mentioned, add them to adaptive equipment
            if (bathroomSafetyText.toLowerCase().includes('grab bar') || 
                bathroomSafetyText.toLowerCase().includes('shower seat') ||
                bathroomSafetyText.toLowerCase().includes('bath seat')) {
              formData.adaptiveEquipment.equipment.push({
                id: Date.now().toString() + 5,
                name: bathroomSafetyText.toLowerCase().includes('grab bar') ? 'Grab bars' : 'Shower/bath seat',
                type: 'Bathroom safety equipment',
                location: 'Bathroom',
                purpose: 'Improve bathroom safety and independence',
                effectiveness: bathroomSafetyText.toLowerCase().includes('inadequate') ? 'Poor' : 'Good',
                isOwned: bathroomSafetyText.toLowerCase().includes('needs') ? false : true,
                isRecommended: true,
                notes: bathroomSafetyText
              });
            }
          }
          
          // Map smoke detectors
          if (contextData.safetyAssessment.smokeDetectors) {
            const smokeDetectorStatus = contextData.safetyAssessment.smokeDetectors;
            
            if (smokeDetectorStatus !== 'Present and functional') {
              formData.safety.hazards.push({
                id: Date.now().toString() + 6,
                type: 'fire',
                location: 'Whole home',
                description: `Smoke detector issue: ${smokeDetectorStatus}`,
                riskLevel: 'high',
                mitigationPlan: 'Install functional smoke detectors'
              });
              
              formData.safety.recommendations.push('Install functional smoke detectors in appropriate locations');
            }
          }
          
          // Map emergency plan
          if (contextData.safetyAssessment.emergencyPlan) {
            const emergencyPlanText = contextData.safetyAssessment.emergencyPlan;
            
            formData.safety.emergencyPlan.exists = !emergencyPlanText.toLowerCase().includes('none') && 
                                                 !emergencyPlanText.toLowerCase().includes('not established');
            
            formData.safety.emergencyPlan.isAdequate = emergencyPlanText.toLowerCase().includes('adequate') || 
                                                     emergencyPlanText.toLowerCase().includes('good');
            
            if (!formData.safety.emergencyPlan.exists || !formData.safety.emergencyPlan.isAdequate) {
              formData.safety.emergencyPlan.improvements = 'Develop a comprehensive emergency plan with the client';
              formData.safety.recommendations.push('Develop and document a clear emergency plan');
            }
          }
          
          // If there are modifications mentioned, add them to the modifications array
          if (contextData.safetyAssessment.modifications) {
            const modificationsText = contextData.safetyAssessment.modifications;
            
            if (modificationsText && typeof modificationsText === 'string') {
              const modifications = modificationsText.split(',').map(item => item.trim());
              
              formData.safety.modifications = [
                ...formData.safety.modifications,
                ...modifications
              ];
            }
          }
        } catch (error) {
          console.error("Error mapping safety assessment:", error);
        }
      }
      
      // Map accessibility information if it exists
      if (contextData.accessibilityIssues && Array.isArray(contextData.accessibilityIssues)) {
        try {
          contextData.accessibilityIssues.forEach((issue, index) => {
            formData.accessibilityIssues.issues.push({
              id: Date.now().toString() + (10 + index),
              area: issue.area || 'other',
              description: issue.description || 'Accessibility issue identified',
              impactLevel: issue.impactLevel || 'moderate',
              currentSolutions: issue.currentSolutions || '',
              recommendations: issue.recommendations || '',
              isResolvedWithAssistance: issue.isResolved || false
            });
          });
        } catch (error) {
          console.error("Error mapping accessibility issues:", error);
        }
      }
      
      // Map adaptive equipment if it exists
      if (contextData.adaptiveEquipment && Array.isArray(contextData.adaptiveEquipment)) {
        try {
          contextData.adaptiveEquipment.forEach((equipment, index) => {
            formData.adaptiveEquipment.equipment.push({
              id: Date.now().toString() + (20 + index),
              name: equipment.name || 'Adaptive equipment',
              type: equipment.type || 'Other',
              location: equipment.location || 'Home',
              purpose: equipment.purpose || 'Assist with daily activities',
              effectiveness: equipment.effectiveness || 'Moderate',
              isOwned: equipment.isOwned || false,
              isRecommended: equipment.isRecommended || true,
              notes: equipment.notes || ''
            });
          });
        } catch (error) {
          console.error("Error mapping adaptive equipment:", error);
        }
      }
      
      return formData;
    } catch (error) {
      console.error("Error in mapContextDataToForm:", error);
      return defaultFormState;
    }
  };
  
  // Initialize form with context data if available
  const form = useForm<FormState>({
    resolver: zodResolver(environmentalAssessmentSchema),
    defaultValues: (() => {
      try {
        if (contextData && Object.keys(contextData).length > 0) {
          return mapContextDataToForm();
        }
        return defaultFormState;
      } catch (error) {
        console.error("Error setting default values:", error);
        return defaultFormState;
      }
    })(),
    mode: "onChange"
  });

  // Update form when context data changes
  useEffect(() => {
    try {
      if (contextData && Object.keys(contextData).length > 0) {
        const formData = mapContextDataToForm();
        form.reset(formData);
      }
    } catch (error) {
      console.error("Error updating form from context:", error);
    }
  }, [contextData]);

  useFormPersistence(form, 'environmental-assessment');

  const onSubmit = (formData: FormState) => {
    try {
      // Convert form data to the structure expected by the context
      const environmentalAssessmentData = {
        homeLayout: {
          typeOfResidence: mapDwellingTypeToString(formData.dwelling.type),
          entryAccess: getEntryAccessFromForm(formData),
          bedroomLocation: getBedroomLocationFromForm(formData),
          bathroomLocation: getBathroomLocationFromForm(formData),
          kitchenAccess: getKitchenAccessFromForm(formData),
          numberOfFloors: formData.dwelling.floors
        },
        safetyAssessment: {
          trippingHazards: getTrippingHazardsFromForm(formData),
          lightingAdequacy: getLightingAdequacyFromForm(formData),
          bathroomSafety: getBathroomSafetyFromForm(formData),
          smokeDetectors: getSmokeDetectorsFromForm(formData),
          emergencyPlan: getEmergencyPlanFromForm(formData),
          modifications: formData.safety.modifications.join(", ")
        },
        accessibilityIssues: formData.accessibilityIssues.issues.map(issue => ({
          area: issue.area,
          description: issue.description,
          impactLevel: issue.impactLevel,
          currentSolutions: issue.currentSolutions || '',
          recommendations: issue.recommendations || '',
          isResolved: issue.isResolvedWithAssistance
        })),
        adaptiveEquipment: formData.adaptiveEquipment.equipment.map(equipment => ({
          name: equipment.name,
          type: equipment.type,
          location: equipment.location,
          purpose: equipment.purpose,
          effectiveness: equipment.effectiveness,
          isOwned: equipment.isOwned,
          isRecommended: equipment.isRecommended,
          notes: equipment.notes || ''
        })),
        interiorDetails: {
          flooring: formData.interiorEnvironment.flooring.types.join(", "),
          flooringConcerns: formData.interiorEnvironment.flooring.concerns || 'None',
          lighting: formData.interiorEnvironment.lighting.isAdequate ? 'Adequate' : 'Inadequate',
          lightingConcerns: formData.interiorEnvironment.lighting.concerns || 'None',
          temperatureControl: formData.interiorEnvironment.temperature.isControlled ? 'Adequate' : 'Inadequate'
        },
        outdoorAccess: {
          hasSpace: formData.outdoor.hasSpace,
          spaceTypes: formData.outdoor.types.join(", "),
          isAccessible: formData.outdoor.access.isAccessible,
          accessBarriers: formData.outdoor.access.barriers || 'None'
        }
      };
      
      // Update the context with the form data
      updateSection('environmentalAssessment', environmentalAssessmentData);
    } catch (error) {
      console.error("Error preparing data for context update:", error);
    }
  };
  
  // Helper functions to transform form data to context format
  
  const mapDwellingTypeToString = (type: string): string => {
    const typeMapping = {
      'house': 'Single-family home',
      'apartment': 'Apartment',
      'condo': 'Condominium',
      'townhouse': 'Townhouse',
      'mobile_home': 'Mobile home',
      'other': 'Other'
    };
    
    return typeMapping[type] || 'Other residence';
  };
  
  const getEntryAccessFromForm = (formData: FormState): string => {
    if (!formData.outdoor.access.isAccessible) {
      return `Difficult access: ${formData.outdoor.access.barriers}`;
    }
    
    return 'Accessible entry';
  };
  
  const getBedroomLocationFromForm = (formData: FormState): string => {
    const bedroomIssue = formData.accessibilityIssues.issues.find(issue => 
      issue.area === 'bedroom'
    );
    
    if (bedroomIssue) {
      return bedroomIssue.description;
    }
    
    return formData.dwelling.floors > 1 ? 'Bedroom on upper floor' : 'Bedroom on main floor';
  };
  
  const getBathroomLocationFromForm = (formData: FormState): string => {
    const bathroomIssue = formData.accessibilityIssues.issues.find(issue => 
      issue.area === 'bathroom'
    );
    
    if (bathroomIssue) {
      return bathroomIssue.description;
    }
    
    return formData.dwelling.floors > 1 
      ? `${formData.dwelling.rooms.bathrooms} bathroom(s), including on main floor`
      : `${formData.dwelling.rooms.bathrooms} bathroom(s) on main floor`;
  };
  
  const getKitchenAccessFromForm = (formData: FormState): string => {
    const kitchenIssue = formData.accessibilityIssues.issues.find(issue => 
      issue.area === 'kitchen'
    );
    
    if (kitchenIssue) {
      return kitchenIssue.description;
    }
    
    return 'Kitchen accessible on main floor';
  };
  
  const getTrippingHazardsFromForm = (formData: FormState): string => {
    const trippingHazards = formData.safety.hazards.filter(hazard => 
      hazard.type === 'tripping'
    );
    
    if (trippingHazards.length === 0) {
      return 'None identified';
    }
    
    return trippingHazards.map(hazard => hazard.description).join('; ');
  };
  
  const getLightingAdequacyFromForm = (formData: FormState): string => {
    if (formData.interiorEnvironment.lighting.isAdequate) {
      return 'Adequate throughout home';
    }
    
    return `Inadequate: ${formData.interiorEnvironment.lighting.concerns}`;
  };
  
  const getBathroomSafetyFromForm = (formData: FormState): string => {
    const bathroomHazards = formData.safety.hazards.filter(hazard => 
      hazard.location.toLowerCase().includes('bathroom')
    );
    
    const bathroomEquipment = formData.adaptiveEquipment.equipment.filter(equipment => 
      equipment.location.toLowerCase().includes('bathroom')
    );
    
    if (bathroomHazards.length === 0 && bathroomEquipment.length === 0) {
      return 'No concerns identified';
    }
    
    let safetyText = '';
    
    if (bathroomHazards.length > 0) {
      safetyText += `Hazards: ${bathroomHazards.map(h => h.description).join('; ')}. `;
    }
    
    if (bathroomEquipment.length > 0) {
      safetyText += `Equipment: ${bathroomEquipment.map(e => e.name).join(', ')}.`;
    }
    
    return safetyText || 'Bathroom safety assessment completed';
  };
  
  const getSmokeDetectorsFromForm = (formData: FormState): string => {
    const smokeDetectorHazards = formData.safety.hazards.filter(hazard => 
      hazard.type === 'fire' && hazard.description.toLowerCase().includes('smoke')
    );
    
    if (smokeDetectorHazards.length > 0) {
      return smokeDetectorHazards[0].description;
    }
    
    return 'Present and functional';
  };
  
  const getEmergencyPlanFromForm = (formData: FormState): string => {
    if (!formData.safety.emergencyPlan.exists) {
      return 'None established';
    }
    
    if (!formData.safety.emergencyPlan.isAdequate) {
      return `Established but inadequate: ${formData.safety.emergencyPlan.improvements}`;
    }
    
    return 'Established and adequate';
  };

  return (
    <div className="space-y-6">
      {contextData && Object.keys(contextData).length > 0 && (
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
              onClick={() => form.reset(defaultFormState)}
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