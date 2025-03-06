'use client';

import React, { useEffect, useState, useCallback } from 'react';
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
  Symptoms
} from '../schema.updated';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import { useAssessment } from '@/contexts/AssessmentContext';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, InfoIcon } from "lucide-react";
import { nanoid } from 'nanoid';

// Default values for the updated schema
const defaultValuesUpdated: SymptomsUpdated = {
  general: {
    notes: ''
  },
  physical: [
    {
      id: nanoid(),
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
      id: nanoid(),
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

export function SymptomsAssessmentIntegratedFinal() {
  const { data, updateSection } = useAssessment();
  const contextData = data.symptomsAssessment || {};
  const [dataLoaded, setDataLoaded] = useState(false);
  
  // Map context data to form structure with error handling - MOVED TO USECALLBACK TO PREVENT RENDER ISSUES
  const mapContextDataToForm = useCallback((): SymptomsUpdated => {
    try {
      // Start with default values
      const formData = JSON.parse(JSON.stringify(defaultValuesUpdated));
      
      console.log("Mapping symptoms assessment context data:", contextData);
      
      let hasData = false;
      
      // Map general notes if they exist
      if (contextData.generalNotes) {
        formData.general.notes = contextData.generalNotes;
        hasData = true;
      }
      
      // Map physical symptoms if they exist
      if (contextData.physicalSymptoms && Array.isArray(contextData.physicalSymptoms) && contextData.physicalSymptoms.length > 0) {
        formData.physical = contextData.physicalSymptoms.map(symptom => ({
          id: symptom.id || nanoid(),
          location: symptom.symptom || '',
          intensity: symptom.intensity || '',
          description: symptom.description || '',
          frequency: symptom.frequency || '',
          duration: symptom.duration || '',
          aggravating: symptom.aggravatingFactors ? 
            (typeof symptom.aggravatingFactors === 'string' ? 
              symptom.aggravatingFactors.split(',').map(s => s.trim()) : 
              [symptom.aggravatingFactors]) : 
            [],
          alleviating: symptom.alleviatingFactors ? 
            (typeof symptom.alleviatingFactors === 'string' ? 
              symptom.alleviatingFactors.split(',').map(s => s.trim()) : 
              [symptom.alleviatingFactors]) : 
            []
        }));
        hasData = true;
      }
      
      // Map cognitive symptoms if they exist
      if (contextData.cognitiveSymptoms && Array.isArray(contextData.cognitiveSymptoms) && contextData.cognitiveSymptoms.length > 0) {
        formData.cognitive = contextData.cognitiveSymptoms.map(symptom => ({
          id: symptom.id || nanoid(),
          type: symptom.symptom || '',
          impact: symptom.impactOnFunction || '',
          management: symptom.management || '',
          frequency: symptom.frequency || '',
          triggers: symptom.triggers ? 
            (typeof symptom.triggers === 'string' ? 
              symptom.triggers.split(',').map(s => s.trim()) : 
              Array.isArray(symptom.triggers) ? symptom.triggers : []) : 
            [],
          coping: symptom.coping ? 
            (typeof symptom.coping === 'string' ? 
              symptom.coping.split(',').map(s => s.trim()) : 
              Array.isArray(symptom.coping) ? symptom.coping : []) : 
            []
        }));
        hasData = true;
      }
      
      // Map emotional symptoms if they exist - FIXED VERSION
      if (contextData.emotionalSymptoms && Array.isArray(contextData.emotionalSymptoms)) {
        formData.emotional = contextData.emotionalSymptoms.map(symptom => {
          // Handle legacy data structure or possibly missing fields
          return {
            type: symptom.type || symptom.symptom || '',
            severity: symptom.severity || 'moderate',
            frequency: symptom.frequency || 'daily',
            impact: symptom.impact || symptom.impactOnFunction || '',
            management: symptom.management || ''
          };
        });
        hasData = true;
      } else if (Array.isArray(contextData.emotional)) {
        // Handle direct emotional array format
        formData.emotional = contextData.emotional;
        hasData = true;
      } else {
        // If no emotional symptoms, set as empty array
        formData.emotional = [];
      }
      
      console.log("Mapped symptoms form data:", formData);
      return { formData, hasData };
    } catch (error) {
      console.error("Error mapping symptoms context data:", error);
      return { formData: defaultValuesUpdated, hasData: false };
    }
  }, [contextData]);

  // Use the updated schema with the new form
  const form = useForm<SymptomsUpdated>({
    resolver: zodResolver(symptomsSchemaUpdated),
    defaultValues: defaultValuesUpdated,
    mode: "onChange"
  });

  // For form persistence
  const { persistForm } = useFormPersistence(form, 'symptoms-updated');

  // Update form when context data changes - CRITICAL FIX: useEffect will handle setDataLoaded
  useEffect(() => {
    try {
      if (contextData && Object.keys(contextData).length > 0) {
        console.log("Symptoms context data changed:", contextData);
        const { formData, hasData } = mapContextDataToForm();
        form.reset(formData);
        
        // Set dataLoaded flag in useEffect, not during render
        setDataLoaded(hasData);
      }
    } catch (error) {
      console.error("Error updating form from context:", error);
    }
  }, [contextData, mapContextDataToForm, form]);

  const onSubmit = (formData: SymptomsUpdated) => {
    try {
      console.log('Form data:', formData);
      
      // Convert form data to the structure expected by the context
      const symptomsData = {
        generalNotes: formData.general.notes,
        
        physicalSymptoms: formData.physical.map(symptom => ({
          id: symptom.id,
          symptom: symptom.location,
          intensity: symptom.intensity,
          description: symptom.description,
          frequency: symptom.frequency,
          duration: symptom.duration,
          aggravatingFactors: symptom.aggravating.join(', '),
          alleviatingFactors: symptom.alleviating.join(', '),
          impactOnFunction: symptom.description // Using description as impact
        })),
        
        cognitiveSymptoms: formData.cognitive.map(symptom => ({
          id: symptom.id,
          symptom: symptom.type,
          severity: "Moderate", // Default value
          description: symptom.impact,
          frequency: symptom.frequency,
          impactOnFunction: symptom.impact,
          management: symptom.management,
          triggers: symptom.triggers,
          coping: symptom.coping
        })),
        
        emotionalSymptoms: formData.emotional
      };
      
      // Update the context with the form data
      updateSection('symptomsAssessment', symptomsData);
      
      // Also persist the form data
      persistForm(formData);
      
    } catch (error) {
      console.error("Error preparing data for context update:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-slate-800">Symptoms Assessment</h2>
        <p className="text-sm text-muted-foreground mt-1">Comprehensive evaluation of symptoms and their impact</p>
      </div>

      {dataLoaded && (
        <Alert className="mb-6 bg-blue-50 text-blue-800 border-blue-200">
          <InfoIcon className="h-4 w-4 text-blue-800" />
          <AlertTitle>Data Loaded From Assessment Context</AlertTitle>
          <AlertDescription>
            Symptoms information has been pre-populated from previous assessments. Please review and adjust as needed.
          </AlertDescription>
        </Alert>
      )}

      <Alert className="mb-6 bg-amber-50 text-amber-800 border-amber-200">
        <AlertCircle className="h-4 w-4 text-amber-800" />
        <AlertTitle>Multiple Symptoms Support</AlertTitle>
        <AlertDescription>
          This section now supports recording multiple physical and cognitive symptoms. Use the "Add Symptom" button to add additional symptoms.
        </AlertDescription>
      </Alert>

      {/* Using FormProvider directly instead of nesting forms */}
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
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
      </FormProvider>
    </div>
  );
}
