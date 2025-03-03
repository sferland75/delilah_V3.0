'use client';

import React, { useEffect } from 'react';
import { Form } from '@/components/ui/form';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { adlSchema, defaultFormState } from '../schema';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import { useAssessment } from '@/contexts/AssessmentContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ADLField } from './ADLField';
import { adlCategories, iadlCategories, healthCategories, workCategories, leisureCategories } from '../constants';
import type { ADLData } from '../types';

export function ActivitiesOfDailyLiving() {
  const { data, updateSection } = useAssessment();
  const contextData = data.activitiesDailyLiving || {};
  
  const form = useForm<ADLData>({
    resolver: zodResolver(adlSchema),
    defaultValues: defaultFormState,
    mode: "onChange"
  });

  // Map context data to form structure if available
  useEffect(() => {
    if (contextData && Object.keys(contextData).length > 0) {
      console.log("ADL context data:", contextData);
      
      try {
        const updatedFormData = { ...form.getValues() };
        
        // Map basic ADLs
        if (contextData.basicADLs) {
          if (contextData.basicADLs.feeding) {
            updatedFormData.basic.selfCare.feeding.status = contextData.basicADLs.feeding;
          }
          
          if (contextData.basicADLs.bathing) {
            updatedFormData.basic.selfCare.bathing.status = contextData.basicADLs.bathing;
          }
          
          if (contextData.basicADLs.grooming) {
            updatedFormData.basic.selfCare.grooming.status = contextData.basicADLs.grooming;
          }
          
          if (contextData.basicADLs.dressing) {
            updatedFormData.basic.selfCare.dressing.status = contextData.basicADLs.dressing;
          }
          
          if (contextData.basicADLs.toileting) {
            updatedFormData.basic.selfCare.toileting.status = contextData.basicADLs.toileting;
          }
        }
        
        // Map instrumental ADLs
        if (contextData.instrumentalADLs) {
          if (contextData.instrumentalADLs.mealPreparation) {
            updatedFormData.iadl.household.mealPreparation.status = contextData.instrumentalADLs.mealPreparation;
          }
          
          if (contextData.instrumentalADLs.householdManagement) {
            updatedFormData.iadl.household.housekeeping.status = contextData.instrumentalADLs.householdManagement;
          }
          
          if (contextData.instrumentalADLs.financialManagement) {
            updatedFormData.iadl.community.financialManagement.status = contextData.instrumentalADLs.financialManagement;
          }
          
          if (contextData.instrumentalADLs.medicationManagement) {
            updatedFormData.health.medication.medicationManagement.status = contextData.instrumentalADLs.medicationManagement;
          }
          
          if (contextData.instrumentalADLs.communityMobility) {
            updatedFormData.iadl.mobility.communityMobility.status = contextData.instrumentalADLs.communityMobility;
          }
        }
        
        // Map leisure activities
        if (contextData.leisureRecreation) {
          if (contextData.leisureRecreation.physicalActivities) {
            updatedFormData.leisure.activities.physicalActivities.status = contextData.leisureRecreation.physicalActivities;
          }
          
          if (contextData.leisureRecreation.socialActivities) {
            updatedFormData.leisure.social.socialParticipation.status = contextData.leisureRecreation.socialActivities;
          }
          
          if (contextData.leisureRecreation.hobbiesInterests) {
            updatedFormData.leisure.activities.hobbies.status = contextData.leisureRecreation.hobbiesInterests;
          }
        }
        
        form.reset(updatedFormData);
      } catch (error) {
        console.error("Error mapping ADL context data:", error);
      }
    }
  }, [contextData, form]);

  useFormPersistence(form, 'activities-of-daily-living');

  const onSubmit = (formData: ADLData) => {
    console.log('Form data:', formData);
    
    // Convert form data to the structure expected by the context
    const adlData = {
      basicADLs: {
        feeding: formData.basic.selfCare.feeding.status,
        bathing: formData.basic.selfCare.bathing.status,
        grooming: formData.basic.selfCare.grooming.status,
        dressing: formData.basic.selfCare.dressing.status,
        toileting: formData.basic.selfCare.toileting.status
      },
      instrumentalADLs: {
        mealPreparation: formData.iadl.household.mealPreparation.status,
        householdManagement: formData.iadl.household.housekeeping.status,
        financialManagement: formData.iadl.community.financialManagement.status,
        medicationManagement: formData.health.medication.medicationManagement.status,
        communityMobility: formData.iadl.mobility.communityMobility.status
      },
      leisureRecreation: {
        physicalActivities: formData.leisure.activities.physicalActivities.status,
        socialActivities: formData.leisure.social.socialParticipation.status,
        hobbiesInterests: formData.leisure.activities.hobbies.status
      }
    };
    
    // Update the context with the form data
    updateSection('activitiesDailyLiving', adlData);
  };

  const renderBasicContent = () => (
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
  );

  const renderIADLContent = () => (
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
  );

  const renderHealthContent = () => (
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
  );

  const renderWorkContent = () => (
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
  );

  const renderLeisureContent = () => (
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
  );

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-slate-800">Activities of Daily Living</h2>
        <p className="text-sm text-muted-foreground mt-1">
          This section assesses the client's ability to perform activities of daily living before and after the accident.
        </p>
      </div>

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
                {renderBasicContent()}
              </TabsContent>
              
              <TabsContent value="iadl" className="p-6">
                {renderIADLContent()}
              </TabsContent>
              
              <TabsContent value="leisure" className="p-6">
                {renderLeisureContent()}
              </TabsContent>
              
              <TabsContent value="health" className="p-6">
                {renderHealthContent()}
              </TabsContent>
              
              <TabsContent value="work" className="p-6">
                {renderWorkContent()}
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
              Save Activities of Daily Living
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}