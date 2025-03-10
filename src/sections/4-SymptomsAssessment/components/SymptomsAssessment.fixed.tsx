'use client';

import React, { useEffect } from 'react';
import { Form } from '@/components/ui/form';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { symptomsSchema } from '../schema';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import { useAssessment } from '@/contexts/AssessmentContext';
import type { Symptoms } from '../schema';

// Import fixed component versions
import { PhysicalSymptomsSection } from './PhysicalSymptomsSection.fixed';
import { CognitiveSymptomsSection } from './CognitiveSymptomsSection';
import { EmotionalSymptomsSection } from './EmotionalSymptomsSection.fixed';
import { GeneralNotesSection } from './GeneralNotesSection.fixed';

const defaultValues: Symptoms = {
  general: {
    notes: ''
  },
  physical: {
    location: '',
    intensity: '',
    description: '',
    frequency: '',
    duration: '',
    aggravating: [],
    alleviating: []
  },
  cognitive: {
    type: '',
    impact: '',
    management: '',
    frequency: '',
    triggers: [],
    coping: []
  },
  emotional: []
};

export function SymptomsAssessment() {
  const { data, updateSection } = useAssessment();
  const contextData = data.symptomsAssessment || {};
  
  // Map the context data to the form structure
  const mapContextDataToForm = () => {
    const formData = { ...defaultValues };
    
    // Map physical symptoms if they exist
    if (contextData.physicalSymptoms && contextData.physicalSymptoms.length > 0) {
      const symptom = contextData.physicalSymptoms[0];
      formData.physical = {
        location: symptom.symptom || '',
        intensity: symptom.intensity || '',
        description: symptom.description || '',
        frequency: symptom.aggravatingFactors ? 'frequent' : 'occasional', // Estimated
        duration: 'varies', // Estimated
        aggravating: symptom.aggravatingFactors ? [symptom.aggravatingFactors] : [],
        alleviating: symptom.alleviatingFactors ? [symptom.alleviatingFactors] : []
      };
    }
    
    // Map cognitive symptoms if they exist
    if (contextData.cognitiveSymptoms && contextData.cognitiveSymptoms.length > 0) {
      const symptom = contextData.cognitiveSymptoms[0];
      formData.cognitive = {
        type: symptom.symptom || '',
        impact: symptom.impactOnFunction || '',
        management: '',
        frequency: symptom.frequency || '',
        triggers: [],
        coping: []
      };
    }
    
    console.log("Mapped symptoms form data:", formData);
    return formData;
  };
  
  const form = useForm<Symptoms>({
    resolver: zodResolver(symptomsSchema),
    defaultValues: contextData && Object.keys(contextData).length > 0 
      ? mapContextDataToForm() 
      : defaultValues,
    mode: "onChange"
  });

  // Update form when context data changes
  useEffect(() => {
    if (contextData && Object.keys(contextData).length > 0) {
      console.log("Symptoms context data changed:", contextData);
      const formData = mapContextDataToForm();
      form.reset(formData);
    }
  }, [contextData]);

  useFormPersistence(form, 'symptoms');

  const onSubmit = (formData: Symptoms) => {
    console.log('Form data:', formData);
    
    // Convert form data to the structure expected by the context
    const symptomsData = {
      physicalSymptoms: [
        {
          symptom: formData.physical.location,
          intensity: formData.physical.intensity,
          description: formData.physical.description,
          aggravatingFactors: formData.physical.aggravating.join(', '),
          alleviatingFactors: formData.physical.alleviating.join(', '),
          impactOnFunction: "Impact on daily activities"
        }
      ],
      cognitiveSymptoms: [
        {
          symptom: formData.cognitive.type,
          severity: "Moderate",
          description: formData.cognitive.impact,
          frequency: formData.cognitive.frequency,
          impactOnFunction: formData.cognitive.impact
        }
      ]
    };
    
    // Update the context with the form data
    updateSection('symptomsAssessment', symptomsData);
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-slate-800">Symptoms Assessment</h2>
        <p className="text-sm text-muted-foreground mt-1">Comprehensive evaluation of symptoms and their impact</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <FormProvider {...form}>
            <Tabs defaultValue="physical" className="w-full border rounded-md">
              <TabsList className="grid w-full grid-cols-4 p-0 h-auto border-b">
                <TabsTrigger 
                  className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
                  value="physical"
                >
                  Physical
                </TabsTrigger>
                <TabsTrigger 
                  className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
                  value="cognitive"
                >
                  Cognitive
                </TabsTrigger>
                <TabsTrigger 
                  className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
                  value="emotional"
                >
                  Emotional
                </TabsTrigger>
                <TabsTrigger 
                  className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
                  value="general"
                >
                  General
                </TabsTrigger>
              </TabsList>

              <TabsContent value="physical" className="p-6">
                <PhysicalSymptomsSection />
              </TabsContent>
              
              <TabsContent value="cognitive" className="p-6">
                <CognitiveSymptomsSection />
              </TabsContent>
              
              <TabsContent value="emotional" className="p-6">
                <EmotionalSymptomsSection />
              </TabsContent>
              
              <TabsContent value="general" className="p-6">
                <GeneralNotesSection />
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
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save Symptoms Assessment
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}