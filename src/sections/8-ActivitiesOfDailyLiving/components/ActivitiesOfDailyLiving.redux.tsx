'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Form } from '@/components/ui/form';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import { adlSchema, defaultFormState } from '../schema';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ADLField } from './ADLField';
import { adlCategories, iadlCategories, healthCategories, workCategories, leisureCategories } from '../constants';
import type { ADLData, ADLCategoryData, ADLItemData } from '../types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateSectionThunk, saveCurrentAssessmentThunk } from '@/store/slices/assessmentSlice';
import { addToast } from '@/store/slices/uiSlice';

// Import helper functions
import { 
  mapIndependenceLevelToValue, 
  extractNotesFromIndependenceText,
  determineIndependenceFromText,
  extractEntertainmentFromHobbies,
  extractSleepInfoFromText,
  getStatusAndNotesForADL
} from './ADLIntegrationPart1';

export function ActivitiesOfDailyLivingRedux() {
  const dispatch = useAppDispatch();
  const currentData = useAppSelector(state => state.assessments.currentData);
  const saveStatus = useAppSelector(state => state.assessments.loading.save);
  
  const contextData = currentData.activitiesDailyLiving || {};
  const [dataLoaded, setDataLoaded] = useState(false);
  const initialLoadRef = useRef(false);
  
  console.log("Initial ADL Redux data:", contextData);
  
  // Map context data to form structure with comprehensive error handling
  const mapContextDataToForm = (): ADLData => {
    try {
      // Start with default form state
      const formData = JSON.parse(JSON.stringify(defaultFormState));
      
      if (!contextData || Object.keys(contextData).length === 0) {
        return formData;
      }
      
      console.log("Mapping ADL Redux data:", contextData);
      
      // Map basic ADLs with error handling
      if (contextData.basicADLs) {
        try {
          // Mapping feeding
          if (contextData.basicADLs.feeding) {
            const independenceValue = mapIndependenceLevelToValue(contextData.basicADLs.feeding);
            const notes = extractNotesFromIndependenceText(contextData.basicADLs.feeding);
            
            if (formData.basic.feeding.eating) {
              formData.basic.feeding.eating.independence = independenceValue;
              formData.basic.feeding.eating.notes = notes;
            }
          }
          
          // Mapping bathing
          if (contextData.basicADLs.bathing) {
            const independenceValue = mapIndependenceLevelToValue(contextData.basicADLs.bathing);
            const notes = extractNotesFromIndependenceText(contextData.basicADLs.bathing);
            
            if (formData.basic.bathing.shower) {
              formData.basic.bathing.shower.independence = independenceValue;
              formData.basic.bathing.shower.notes = notes;
            }
          }
          
          // Mapping grooming
          if (contextData.basicADLs.grooming) {
            const independenceValue = mapIndependenceLevelToValue(contextData.basicADLs.grooming);
            const notes = extractNotesFromIndependenceText(contextData.basicADLs.grooming);
            
            if (formData.basic.bathing.grooming) {
              formData.basic.bathing.grooming.independence = independenceValue;
              formData.basic.bathing.grooming.notes = notes;
            }
          }
          
          // Mapping dressing
          if (contextData.basicADLs.dressing) {
            const independenceValue = mapIndependenceLevelToValue(contextData.basicADLs.dressing);
            const notes = extractNotesFromIndependenceText(contextData.basicADLs.dressing);
            
            // Map to both upper and lower body dressing if not specified
            if (formData.basic.dressing.upper_body) {
              formData.basic.dressing.upper_body.independence = independenceValue;
              formData.basic.dressing.upper_body.notes = notes;
            }
            
            if (formData.basic.dressing.lower_body) {
              formData.basic.dressing.lower_body.independence = independenceValue;
              formData.basic.dressing.lower_body.notes = notes;
            }
          }
          
          // Mapping toileting
          if (contextData.basicADLs.toileting) {
            const independenceValue = mapIndependenceLevelToValue(contextData.basicADLs.toileting);
            const notes = extractNotesFromIndependenceText(contextData.basicADLs.toileting);
            
            if (formData.basic.bathing.toileting) {
              formData.basic.bathing.toileting.independence = independenceValue;
              formData.basic.bathing.toileting.notes = notes;
            }
          }
        } catch (error) {
          console.error("Error mapping basic ADLs:", error);
        }
      }
      
      // Map instrumental ADLs with error handling
      if (contextData.instrumentalADLs) {
        try {
          // Mapping meal preparation
          if (contextData.instrumentalADLs.mealPreparation) {
            const independenceValue = mapIndependenceLevelToValue(contextData.instrumentalADLs.mealPreparation);
            const notes = extractNotesFromIndependenceText(contextData.instrumentalADLs.mealPreparation);
            
            if (formData.iadl.household.meal_prep) {
              formData.iadl.household.meal_prep.independence = independenceValue;
              formData.iadl.household.meal_prep.notes = notes;
            }
          }
          
          // Mapping household management
          if (contextData.instrumentalADLs.householdManagement) {
            const independenceValue = mapIndependenceLevelToValue(contextData.instrumentalADLs.householdManagement);
            const notes = extractNotesFromIndependenceText(contextData.instrumentalADLs.householdManagement);
            
            // Map to cleaning and home maintenance
            if (formData.iadl.household.cleaning) {
              formData.iadl.household.cleaning.independence = independenceValue;
              formData.iadl.household.cleaning.notes = notes;
            }
            
            if (formData.iadl.household.home_maintenance) {
              formData.iadl.household.home_maintenance.independence = independenceValue;
              formData.iadl.household.home_maintenance.notes = 
                `From household management assessment: ${notes}`;
            }
          }
          
          // Mapping financial management
          if (contextData.instrumentalADLs.financialManagement) {
            const independenceValue = mapIndependenceLevelToValue(contextData.instrumentalADLs.financialManagement);
            const notes = extractNotesFromIndependenceText(contextData.instrumentalADLs.financialManagement);
            
            if (formData.iadl.community.money_management) {
              formData.iadl.community.money_management.independence = independenceValue;
              formData.iadl.community.money_management.notes = notes;
            }
          }
          
          // Mapping medication management
          if (contextData.instrumentalADLs.medicationManagement) {
            const independenceValue = mapIndependenceLevelToValue(contextData.instrumentalADLs.medicationManagement);
            const notes = extractNotesFromIndependenceText(contextData.instrumentalADLs.medicationManagement);
            
            if (formData.health.management.medications) {
              formData.health.management.medications.independence = independenceValue;
              formData.health.management.medications.notes = notes;
            }
          }
          
          // Mapping community mobility
          if (contextData.instrumentalADLs.communityMobility) {
            const independenceValue = mapIndependenceLevelToValue(contextData.instrumentalADLs.communityMobility);
            const notes = extractNotesFromIndependenceText(contextData.instrumentalADLs.communityMobility);
            
            if (formData.iadl.community.transportation) {
              formData.iadl.community.transportation.independence = independenceValue;
              formData.iadl.community.transportation.notes = notes;
            }
          }
          
          // Mapping shopping if available
          if (contextData.instrumentalADLs.shopping) {
            const independenceValue = mapIndependenceLevelToValue(contextData.instrumentalADLs.shopping);
            const notes = extractNotesFromIndependenceText(contextData.instrumentalADLs.shopping);
            
            if (formData.iadl.community.shopping) {
              formData.iadl.community.shopping.independence = independenceValue;
              formData.iadl.community.shopping.notes = notes;
            }
          }
        } catch (error) {
          console.error("Error mapping instrumental ADLs:", error);
        }
      }
      
      // Map leisure and recreation with error handling
      if (contextData.leisureRecreation) {
        try {
          // Mapping physical activities
          if (contextData.leisureRecreation.physicalActivities) {
            const activitiesText = contextData.leisureRecreation.physicalActivities;
            
            // Map to sports categories based on content
            if (activitiesText.toLowerCase().includes('fitness') || 
                activitiesText.toLowerCase().includes('gym') ||
                activitiesText.toLowerCase().includes('exercise')) {
              if (formData.leisure.sports.fitness) {
                formData.leisure.sports.fitness.independence = determineIndependenceFromText(activitiesText);
                formData.leisure.sports.fitness.notes = activitiesText;
              }
            }
            
            if (activitiesText.toLowerCase().includes('team') || 
                activitiesText.toLowerCase().includes('basketball') ||
                activitiesText.toLowerCase().includes('soccer') ||
                activitiesText.toLowerCase().includes('volleyball') ||
                activitiesText.toLowerCase().includes('hockey')) {
              if (formData.leisure.sports.team_sports) {
                formData.leisure.sports.team_sports.independence = determineIndependenceFromText(activitiesText);
                formData.leisure.sports.team_sports.notes = activitiesText;
              }
            }
            
            if (activitiesText.toLowerCase().includes('individual') || 
                activitiesText.toLowerCase().includes('tennis') ||
                activitiesText.toLowerCase().includes('golf') ||
                activitiesText.toLowerCase().includes('cycling') ||
                activitiesText.toLowerCase().includes('swimming')) {
              if (formData.leisure.sports.individual_sports) {
                formData.leisure.sports.individual_sports.independence = determineIndependenceFromText(activitiesText);
                formData.leisure.sports.individual_sports.notes = activitiesText;
              }
            }
            
            if (activitiesText.toLowerCase().includes('outdoor') || 
                activitiesText.toLowerCase().includes('hiking') ||
                activitiesText.toLowerCase().includes('fishing') ||
                activitiesText.toLowerCase().includes('gardening')) {
              if (formData.leisure.sports.outdoor) {
                formData.leisure.sports.outdoor.independence = determineIndependenceFromText(activitiesText);
                formData.leisure.sports.outdoor.notes = activitiesText;
              }
            }
          }
          
          // Mapping social activities
          if (contextData.leisureRecreation.socialActivities) {
            const socialText = contextData.leisureRecreation.socialActivities;
            
            // Map to social categories based on content
            if (formData.leisure.social.family) {
              formData.leisure.social.family.independence = determineIndependenceFromText(socialText);
              formData.leisure.social.family.notes = socialText;
            }
            
            if (formData.leisure.social.friends) {
              formData.leisure.social.friends.independence = determineIndependenceFromText(socialText);
              formData.leisure.social.friends.notes = socialText;
            }
          }
          
          // Mapping hobbies and interests
          if (contextData.leisureRecreation.hobbiesInterests) {
            const hobbiesText = contextData.leisureRecreation.hobbiesInterests;
            
            if (formData.leisure.social.hobbies) {
              formData.leisure.social.hobbies.independence = determineIndependenceFromText(hobbiesText);
              formData.leisure.social.hobbies.notes = hobbiesText;
            }
            
            // Also check if any hobbies are entertainment related
            if (hobbiesText.toLowerCase().includes('movie') ||
                hobbiesText.toLowerCase().includes('concert') ||
                hobbiesText.toLowerCase().includes('theater') ||
                hobbiesText.toLowerCase().includes('shows')) {
              if (formData.leisure.social.entertainment) {
                formData.leisure.social.entertainment.independence = determineIndependenceFromText(hobbiesText);
                formData.leisure.social.entertainment.notes = 
                  `Entertainment-related interests: ${extractEntertainmentFromHobbies(hobbiesText)}`;
              }
            }
          }
        } catch (error) {
          console.error("Error mapping leisure and recreation:", error);
        }
      }
      
      console.log("Mapped ADL form data:", formData);
      return formData;
    } catch (error) {
      console.error("Error in mapContextDataToForm:", error);
      return defaultFormState;
    }
  };
  
  // Initialize form with context data if available
  const form = useForm<ADLData>({
    resolver: zodResolver(adlSchema),
    defaultValues: defaultFormState,
    mode: "onChange"
  });

  // Update form when context data changes
  useEffect(() => {
    try {
      if (contextData && Object.keys(contextData).length > 0 && !initialLoadRef.current) {
        console.log("ADL Redux data detected, mapping to form");
        const formData = mapContextDataToForm();
        form.reset(formData);
        setDataLoaded(true);
        initialLoadRef.current = true;
      }
    } catch (error) {
      console.error("Error updating form from Redux:", error);
    }
  }, [contextData]);

  const { persistForm } = useFormPersistence(form, 'activities-of-daily-living');

  const onSubmit = async (formData: ADLData) => {
    try {
      console.log('Form data:', formData);
      
      // Convert form data to the structure expected by Redux
      const adlData = {
        basicADLs: {
          feeding: getStatusAndNotesForADL(formData.basic.feeding, 'eating'),
          bathing: getStatusAndNotesForADL(formData.basic.bathing, 'shower'),
          grooming: getStatusAndNotesForADL(formData.basic.bathing, 'grooming'),
          dressing: formData.basic.dressing.upper_body?.independence 
            ? `${formData.basic.dressing.upper_body.independence} - ${formData.basic.dressing.upper_body.notes || 'No specific observations'}`
            : "Not assessed",
          toileting: getStatusAndNotesForADL(formData.basic.bathing, 'toileting')
        },
        instrumentalADLs: {
          mealPreparation: getStatusAndNotesForADL(formData.iadl.household, 'meal_prep'),
          householdManagement: getStatusAndNotesForADL(formData.iadl.household, 'cleaning'),
          financialManagement: getStatusAndNotesForADL(formData.iadl.community, 'money_management'),
          medicationManagement: getStatusAndNotesForADL(formData.health.management, 'medications'),
          communityMobility: getStatusAndNotesForADL(formData.iadl.community, 'transportation'),
          shopping: getStatusAndNotesForADL(formData.iadl.community, 'shopping')
        },
        leisureRecreation: {
          physicalActivities: formData.leisure.sports.fitness?.independence 
            ? `${formData.leisure.sports.fitness.independence} - ${formData.leisure.sports.fitness.notes || 'No specific observations'}`
            : "Not assessed",
          socialActivities: formData.leisure.social.friends?.independence 
            ? `${formData.leisure.social.friends.independence} - ${formData.leisure.social.friends.notes || 'No specific observations'}`
            : "Not assessed",
          hobbiesInterests: formData.leisure.social.hobbies?.independence 
            ? `${formData.leisure.social.hobbies.independence} - ${formData.leisure.social.hobbies.notes || 'No specific observations'}`
            : "Not assessed"
        },
        workStatus: formData.work.status.current_status?.notes || "Not assessed",
        healthManagement: formData.health.management.medications?.independence 
          ? `Medication management: ${formData.health.management.medications.independence} - ${formData.health.management.medications.notes || 'No specific observations'}. `
          : "" +
          formData.health.routine.sleep?.independence 
          ? `Sleep management: ${formData.health.routine.sleep.independence} - ${formData.health.routine.sleep.notes || 'No specific observations'}`
          : "Health management not specifically assessed."
      };
      
      // Update the Redux store
      await dispatch(updateSectionThunk({
        sectionName: 'activitiesDailyLiving',
        sectionData: adlData
      }));
      
      // Save the assessment
      const saveResult = await dispatch(saveCurrentAssessmentThunk());
      
      // Also persist the form data
      persistForm(formData);
      
      if (saveCurrentAssessmentThunk.fulfilled.match(saveResult)) {
        dispatch(addToast({
          title: "Activities of Daily Living Saved",
          description: "Activities of Daily Living assessment has been saved successfully.",
          type: "success"
        }));
      } else {
        dispatch(addToast({
          title: "Save Failed",
          description: "There was an error saving the Activities of Daily Living assessment.",
          type: "error"
        }));
      }
    } catch (error) {
      console.error("Error preparing data for Redux update:", error);
      dispatch(addToast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        type: "error"
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-slate-800">Activities of Daily Living</h2>
        <p className="text-sm text-muted-foreground mt-1">
          This section assesses the client's ability to perform activities of daily living before and after the accident.
        </p>
      </div>

      {dataLoaded && (
        <Alert className="mb-6 bg-blue-50 text-blue-800 border-blue-200">
          <InfoIcon className="h-4 w-4 text-blue-800" />
          <AlertTitle>Data Loaded From Assessment</AlertTitle>
          <AlertDescription>
            Some form fields have been pre-populated with data from the assessment. You can review and modify the data as needed.
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <FormProvider {...form}>
            <Tabs defaultValue="basic" className="w-full border rounded-md">
              <TabsList className="grid w-full grid-cols-5 p-0 h-auto border-b">
                <TabsTrigger 
                  className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
                  value="basic"
                >
                  Basic ADLs
                </TabsTrigger>
                <TabsTrigger 
                  className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
                  value="iadl"
                >
                  IADLs
                </TabsTrigger>
                <TabsTrigger 
                  className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
                  value="leisure"
                >
                  Leisure & Recreation
                </TabsTrigger>
                <TabsTrigger 
                  className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
                  value="health"
                >
                  Health Management
                </TabsTrigger>
                <TabsTrigger 
                  className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
                  value="work"
                >
                  Work Status
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="p-6">
                <div className="space-y-4">
                  <Accordion type="multiple" defaultValue={Object.keys(adlCategories)} className="space-y-4">
                    {Object.entries(adlCategories).map(([category, { title, items }]) => (
                      <AccordionItem key={category} value={category} className="border rounded-md overflow-hidden">
                        <AccordionTrigger className="hover:no-underline py-3 px-4">
                          <div className="flex-1 text-left">
                            <div className="font-medium">{title}</div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 py-4 space-y-4">
                          {items.map((item) => (
                            <ADLField
                              key={item.id}
                              basePath={`basic.${category}.${item.id}`}
                              title={item.title}
                              subtitle={item.subtitle}
                            />
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </TabsContent>
              
              <TabsContent value="iadl" className="p-6">
                <div className="space-y-4">
                  <Accordion type="multiple" defaultValue={Object.keys(iadlCategories)} className="space-y-4">
                    {Object.entries(iadlCategories).map(([category, { title, items }]) => (
                      <AccordionItem key={category} value={category} className="border rounded-md overflow-hidden">
                        <AccordionTrigger className="hover:no-underline py-3 px-4">
                          <div className="flex-1 text-left">
                            <div className="font-medium">{title}</div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 py-4 space-y-4">
                          {items.map((item) => (
                            <ADLField
                              key={item.id}
                              basePath={`iadl.${category}.${item.id}`}
                              title={item.title}
                              subtitle={item.subtitle}
                            />
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </TabsContent>
              
              <TabsContent value="leisure" className="p-6">
                <div className="space-y-4">
                  <Accordion type="multiple" defaultValue={Object.keys(leisureCategories)} className="space-y-4">
                    {Object.entries(leisureCategories).map(([category, { title, items }]) => (
                      <AccordionItem key={category} value={category} className="border rounded-md overflow-hidden">
                        <AccordionTrigger className="hover:no-underline py-3 px-4">
                          <div className="flex-1 text-left">
                            <div className="font-medium">{title}</div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 py-4 space-y-4">
                          {items.map((item) => (
                            <ADLField
                              key={item.id}
                              basePath={`leisure.${category}.${item.id}`}
                              title={item.title}
                              subtitle={item.subtitle}
                            />
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </TabsContent>
              
              <TabsContent value="health" className="p-6">
                <div className="space-y-4">
                  <Accordion type="multiple" defaultValue={Object.keys(healthCategories)} className="space-y-4">
                    {Object.entries(healthCategories).map(([category, { title, items }]) => (
                      <AccordionItem key={category} value={category} className="border rounded-md overflow-hidden">
                        <AccordionTrigger className="hover:no-underline py-3 px-4">
                          <div className="flex-1 text-left">
                            <div className="font-medium">{title}</div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 py-4 space-y-4">
                          {items.map((item) => (
                            <ADLField
                              key={item.id}
                              basePath={`health.${category}.${item.id}`}
                              title={item.title}
                              subtitle={item.subtitle}
                            />
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </TabsContent>
              
              <TabsContent value="work" className="p-6">
                <div className="space-y-4">
                  <Accordion type="multiple" defaultValue={Object.keys(workCategories)} className="space-y-4">
                    {Object.entries(workCategories).map(([category, { title, items }]) => (
                      <AccordionItem key={category} value={category} className="border rounded-md overflow-hidden">
                        <AccordionTrigger className="hover:no-underline py-3 px-4">
                          <div className="flex-1 text-left">
                            <div className="font-medium">{title}</div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 py-4 space-y-4">
                          {items.map((item) => (
                            <ADLField
                              key={item.id}
                              basePath={`work.${category}.${item.id}`}
                              title={item.title}
                              subtitle={item.subtitle}
                            />
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </TabsContent>
            </Tabs>
          </FormProvider>

          <div className="flex justify-end space-x-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => form.reset(defaultFormState)}
              type="button"
              disabled={saveStatus === 'loading'}
            >
              Reset
            </Button>
            <Button 
              type="submit"
              disabled={saveStatus === 'loading'}
            >
              {saveStatus === 'loading' ? 'Saving...' : 'Save Activities of Daily Living'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}