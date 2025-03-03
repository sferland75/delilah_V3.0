'use client';

import React, { useEffect } from 'react';
import { Form } from '@/components/ui/form';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PhysicalSymptomsSectionUpdated } from './PhysicalSymptomsSection.updated';
import { CognitiveSymptomsSectionUpdated } from './CognitiveSymptomsSection.updated';
import { EmotionalSymptomsSection } from './EmotionalSymptomsSection';
import { GeneralNotesSection } from './GeneralNotesSection';
import { 
  symptomsSchemaUpdated, 
  migrateToUpdatedSchema, 
  migrateToLegacySchema,
  SymptomsUpdated,
  Symptoms,
  symptomsSchema
} from '../schema.updated';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// Default values for the updated schema
const defaultValuesUpdated: SymptomsUpdated = {
  general: {
    notes: ''
  },
  physical: [
    {
      id: '1',
      location: '',
      intensity: '',
      description: '',
      frequency: '',
      duration: '',
      aggravating: [],
      alleviating: []
    }
  ],
  cognitive: [
    {
      id: '1',
      type: '',
      impact: '',
      management: '',
      frequency: '',
      triggers: [],
      coping: []
    }
  ],
  emotional: []
};

// Legacy default values for backward compatibility
const defaultValuesLegacy: Symptoms = {
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

export function SymptomsAssessmentUpdated() {
  // Use the updated schema with the new form
  const form = useForm<SymptomsUpdated>({
    resolver: zodResolver(symptomsSchemaUpdated),
    defaultValues: defaultValuesUpdated,
    mode: "onChange"
  });

  // For backward compatibility, also create a legacy form
  const legacyForm = useForm<Symptoms>({
    resolver: zodResolver(symptomsSchema),
    defaultValues: defaultValuesLegacy,
    mode: "onChange"
  });

  // For form persistence, we'll use the legacy schema for now
  // but convert data between formats as needed
  const { storedData, persistForm } = useFormPersistence(legacyForm, 'symptoms');

  // When the component loads, if there's stored data in the legacy format,
  // convert it to the new format for our updated form
  useEffect(() => {
    if (storedData) {
      const updatedData = migrateToUpdatedSchema(storedData);
      form.reset(updatedData);
    }
  }, [storedData, form]);

  // When the form data changes, convert it back to legacy format for persistence
  const onSubmit = (data: SymptomsUpdated) => {
    // Convert to legacy format for backward compatibility
    const legacyData = migrateToLegacySchema(data);
    
    // Use the persistForm function to save legacy data
    persistForm(legacyData);
    
    console.log('Updated form data:', data);
    console.log('Legacy format for persistence:', legacyData);
    // Additional save logic or navigation here
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-slate-800">Symptoms Assessment</h2>
        <p className="text-sm text-muted-foreground mt-1">Comprehensive evaluation of symptoms and their impact</p>
      </div>

      <Alert className="mb-6 bg-amber-50 text-amber-800 border-amber-200">
        <AlertCircle className="h-4 w-4 text-amber-800" />
        <AlertTitle>Multiple Symptoms Support</AlertTitle>
        <AlertDescription>
          This section now supports recording multiple physical and cognitive symptoms. Use the "Add Symptom" button to add additional symptoms.
        </AlertDescription>
      </Alert>

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
                <PhysicalSymptomsSectionUpdated />
              </TabsContent>
              
              <TabsContent value="cognitive" className="p-6">
                <CognitiveSymptomsSectionUpdated />
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
              onClick={() => form.reset(defaultValuesUpdated)}
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
