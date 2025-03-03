'use client';

import React, { useEffect, useState } from 'react';
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
  SymptomsUpdated
} from '../schema.updated';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import { useAssessment } from '@/contexts/AssessmentContext';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, InfoIcon } from "lucide-react";
import { nanoid } from 'nanoid';

export function SymptomsAssessmentDirectAccess() {
  const { data, updateSection } = useAssessment();
  const [dataFound, setDataFound] = useState(false);
  
  // Log the entire data to see what's available
  console.log("DIRECT-ACCESS COMPONENT: Full context data:", data);
  
  // Create default values for the form
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
  
  // Directly access and map the data
  const initialData = { ...defaultValuesUpdated };
  
  // Map general notes
  if (data?.symptomsAssessment?.generalNotes) {
    console.log("DIRECT-ACCESS COMPONENT: Found general notes:", data.symptomsAssessment.generalNotes);
    initialData.general.notes = data.symptomsAssessment.generalNotes;
  }
  
  // Map physical symptoms
  if (data?.symptomsAssessment?.physicalSymptoms && Array.isArray(data.symptomsAssessment.physicalSymptoms)) {
    console.log("DIRECT-ACCESS COMPONENT: Found physical symptoms:", data.symptomsAssessment.physicalSymptoms);
    
    initialData.physical = data.symptomsAssessment.physicalSymptoms.map(symptom => ({
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
  }
  
  // Map cognitive symptoms
  if (data?.symptomsAssessment?.cognitiveSymptoms && Array.isArray(data.symptomsAssessment.cognitiveSymptoms)) {
    console.log("DIRECT-ACCESS COMPONENT: Found cognitive symptoms:", data.symptomsAssessment.cognitiveSymptoms);
    
    initialData.cognitive = data.symptomsAssessment.cognitiveSymptoms.map(symptom => ({
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
  }
  
  // Map emotional symptoms - try both formats
  if (data?.symptomsAssessment?.emotionalSymptoms && Array.isArray(data.symptomsAssessment.emotionalSymptoms)) {
    console.log("DIRECT-ACCESS COMPONENT: Found emotional symptoms:", data.symptomsAssessment.emotionalSymptoms);
    
    initialData.emotional = data.symptomsAssessment.emotionalSymptoms.map(symptom => ({
      type: symptom.type || symptom.symptom || '',
      severity: symptom.severity || 'moderate',
      frequency: symptom.frequency || 'daily',
      impact: symptom.impact || symptom.impactOnFunction || '',
      management: symptom.management || ''
    }));
  } else if (data?.symptomsAssessment?.emotional && Array.isArray(data.symptomsAssessment.emotional)) {
    console.log("DIRECT-ACCESS COMPONENT: Found emotional array directly:", data.symptomsAssessment.emotional);
    initialData.emotional = data.symptomsAssessment.emotional;
  }
  
  console.log("DIRECT-ACCESS COMPONENT: Initial data prepared:", initialData);
  
  // Create the form with the directly accessed data
  const form = useForm<SymptomsUpdated>({
    resolver: zodResolver(symptomsSchemaUpdated),
    defaultValues: initialData,
    mode: "onChange"
  });

  // For form persistence
  const { persistForm } = useFormPersistence(form, 'symptoms-direct-access');

  // Check if we've successfully loaded data
  useEffect(() => {
    if (data?.symptomsAssessment) {
      const hasPhysical = Array.isArray(data.symptomsAssessment.physicalSymptoms) && data.symptomsAssessment.physicalSymptoms.length > 0;
      const hasCognitive = Array.isArray(data.symptomsAssessment.cognitiveSymptoms) && data.symptomsAssessment.cognitiveSymptoms.length > 0;
      const hasEmotional = Array.isArray(data.symptomsAssessment.emotionalSymptoms) && data.symptomsAssessment.emotionalSymptoms.length > 0;
      
      if (hasPhysical || hasCognitive || hasEmotional) {
        setDataFound(true);
      }
    }
  }, [data]);

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
        <h2 className="text-2xl font-semibold text-slate-800">Symptoms Assessment (Direct Access)</h2>
        <p className="text-sm text-muted-foreground mt-1">Comprehensive evaluation of symptoms and their impact</p>
      </div>

      {dataFound && (
        <Alert className="mb-6 bg-blue-50 text-blue-800 border-blue-200">
          <InfoIcon className="h-4 w-4 text-blue-800" />
          <AlertTitle>Data Loaded From Assessment Context</AlertTitle>
          <AlertDescription>
            Symptoms information has been pre-populated using direct access method. Please review and adjust as needed.
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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <FormProvider {...form}>
            <Tabs defaultValue="emotional" className="w-full border rounded-md">
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
              onClick={() => form.reset(initialData)}
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