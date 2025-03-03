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
  migrateToUpdatedSchema, 
  migrateToLegacySchema,
  SymptomsUpdated,
  Symptoms
} from '../schema.updated';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import { useAssessment } from '@/contexts/AssessmentContext';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, InfoIcon, Bug } from "lucide-react";
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

export function SymptomsAssessmentDebug() {
  const { data, updateSection } = useAssessment();
  const contextData = data?.symptomsAssessment || {};
  const [dataLoaded, setDataLoaded] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>({});
  
  // Log the entire assessment context data to help debug
  console.log("SYMPTOMS DEBUG - Full Assessment Context Data:", data);
  console.log("SYMPTOMS DEBUG - Symptoms Assessment Data:", contextData);
  
  // Map context data to form structure with debug logs
  const mapContextDataToForm = (): SymptomsUpdated => {
    try {
      // Start with default values
      const formData = JSON.parse(JSON.stringify(defaultValuesUpdated));
      const debugData: any = {
        rawData: contextData,
        mappedSections: []
      };
      
      // Check if we have any contextData
      if (!contextData || Object.keys(contextData).length === 0) {
        debugData.error = "No symptoms assessment data found in context";
        console.error(debugData.error);
        setDebugInfo(debugData);
        return formData;
      }
      
      // Map general notes if they exist
      if (contextData.generalNotes) {
        formData.general.notes = contextData.generalNotes;
        debugData.mappedSections.push("generalNotes");
        setDataLoaded(true);
      }
      
      // Map physical symptoms if they exist
      if (contextData.physicalSymptoms && Array.isArray(contextData.physicalSymptoms) && contextData.physicalSymptoms.length > 0) {
        console.log("DEBUG: Found physical symptoms:", contextData.physicalSymptoms);
        
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
        
        debugData.mappedSections.push("physicalSymptoms");
        debugData.physicalMapped = formData.physical;
        setDataLoaded(true);
      }
      
      // Map cognitive symptoms if they exist
      if (contextData.cognitiveSymptoms && Array.isArray(contextData.cognitiveSymptoms) && contextData.cognitiveSymptoms.length > 0) {
        console.log("DEBUG: Found cognitive symptoms:", contextData.cognitiveSymptoms);
        
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
        
        debugData.mappedSections.push("cognitiveSymptoms");
        debugData.cognitiveMapped = formData.cognitive;
        setDataLoaded(true);
      }
      
      // Enhanced debugging for emotional symptoms
      console.log("DEBUG: Checking emotional symptoms...");
      console.log("DEBUG: emotionalSymptoms property:", contextData.emotionalSymptoms);
      console.log("DEBUG: emotional property:", contextData.emotional);
      
      // Map emotional symptoms with detailed logging
      if (contextData.emotionalSymptoms && Array.isArray(contextData.emotionalSymptoms)) {
        console.log("DEBUG: Found emotionalSymptoms array:", contextData.emotionalSymptoms);
        
        formData.emotional = contextData.emotionalSymptoms.map(symptom => {
          const mappedSymptom = {
            type: symptom.type || symptom.symptom || '',
            severity: symptom.severity || 'moderate',
            frequency: symptom.frequency || 'daily',
            impact: symptom.impact || symptom.impactOnFunction || '',
            management: symptom.management || ''
          };
          console.log("DEBUG: Mapped emotional symptom:", mappedSymptom);
          return mappedSymptom;
        });
        
        debugData.mappedSections.push("emotionalSymptoms");
        debugData.emotionalMapped = formData.emotional;
        setDataLoaded(true);
      } else if (Array.isArray(contextData.emotional)) {
        console.log("DEBUG: Found direct emotional array:", contextData.emotional);
        
        // Handle direct emotional array format
        formData.emotional = contextData.emotional;
        debugData.mappedSections.push("emotional");
        debugData.emotionalMapped = formData.emotional;
        setDataLoaded(true);
      } else {
        console.log("DEBUG: No emotional symptoms found in either format");
        formData.emotional = [];
      }
      
      // Try to extract emotional symptoms from raw data
      if (data && data.symptomsAssessment) {
        if (data.symptomsAssessment.emotionalSymptoms && Array.isArray(data.symptomsAssessment.emotionalSymptoms)) {
          console.log("DEBUG: Found emotionalSymptoms in raw data:", data.symptomsAssessment.emotionalSymptoms);
          debugData.rawEmotionalSymptoms = data.symptomsAssessment.emotionalSymptoms;
        }
        
        // Check if there are any fields that could contain emotional data
        const possibleEmotionalKeys = Object.keys(data.symptomsAssessment).filter(
          key => key.toLowerCase().includes('emotion')
        );
        debugData.possibleEmotionalKeys = possibleEmotionalKeys;
      }
      
      // Update debug info
      debugData.dataLoaded = dataLoaded;
      debugData.mappedFormData = formData;
      setDebugInfo(debugData);
      
      console.log("DEBUG: Mapped sections:", debugData.mappedSections);
      console.log("DEBUG: Final mapped form data:", formData);
      
      return formData;
    } catch (error) {
      console.error("Error mapping symptoms context data:", error);
      setDebugInfo({
        error: String(error),
        rawData: contextData
      });
      return defaultValuesUpdated;
    }
  };

  // Use the updated schema with the new form
  const form = useForm<SymptomsUpdated>({
    resolver: zodResolver(symptomsSchemaUpdated),
    defaultValues: (() => {
      try {
        return mapContextDataToForm();
      } catch (error) {
        console.error("Error setting default values:", error);
        return defaultValuesUpdated;
      }
    })(),
    mode: "onChange"
  });

  // For form persistence
  const { persistForm } = useFormPersistence(form, 'symptoms-debug');

  // Update form when context data changes with proper error handling
  useEffect(() => {
    console.log("Symptoms useEffect triggered, data changed:", data);
    try {
      const formData = mapContextDataToForm();
      form.reset(formData);
    } catch (error) {
      console.error("Error updating form from context:", error);
    }
  }, [data]);

  const onSubmit = (formData: SymptomsUpdated) => {
    try {
      console.log('Form data on submit:', formData);
      
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
      
      console.log("Submitting symptoms data to context:", symptomsData);
      
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
        <h2 className="text-2xl font-semibold text-slate-800">Symptoms Assessment (Debug)</h2>
        <p className="text-sm text-muted-foreground mt-1">Comprehensive evaluation of symptoms and their impact</p>
      </div>
      
      <Alert className="mb-6 bg-red-50 text-red-800 border-red-200">
        <Bug className="h-4 w-4 text-red-800" />
        <AlertTitle>Debug Mode Active</AlertTitle>
        <AlertDescription>
          This component is in debug mode. Check the console for detailed information.
        </AlertDescription>
      </Alert>
      
      <div className="mb-6 p-4 bg-gray-50 border rounded-md overflow-auto max-h-60">
        <h3 className="font-semibold mb-2">Debug Information:</h3>
        <div>
          <p><strong>Data Loaded:</strong> {dataLoaded ? "Yes" : "No"}</p>
          <p><strong>Mapped Sections:</strong> {debugInfo.mappedSections ? debugInfo.mappedSections.join(", ") : "None"}</p>
          
          {debugInfo.error && (
            <p className="text-red-600"><strong>Error:</strong> {String(debugInfo.error)}</p>
          )}
          
          <div className="mt-2">
            <p><strong>Emotional Symptoms Debug:</strong></p>
            <p><strong>Possible Emotional Keys:</strong> {debugInfo.possibleEmotionalKeys ? debugInfo.possibleEmotionalKeys.join(", ") : "None"}</p>
            <p><strong>Emotional Symptoms Mapped:</strong> {debugInfo.emotionalMapped ? debugInfo.emotionalMapped.length : 0} items</p>
            
            <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto mt-2">
              {JSON.stringify(debugInfo.emotionalMapped || [], null, 2)}
            </pre>
            
            <p className="mt-2"><strong>Raw Emotional Data:</strong></p>
            <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify(debugInfo.rawEmotionalSymptoms || 
                (contextData.emotionalSymptoms ? contextData.emotionalSymptoms : "No emotionalSymptoms found"), null, 2)}
            </pre>
          </div>
        </div>
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