import React, { useEffect } from 'react';
import { Form } from '../../../src/components/ui/form';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../../src/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../src/components/ui/tabs';
import { symptomsSchema } from './schema';
import { useAssessment } from '../../../src/contexts/AssessmentContext';
import type { Symptoms } from './schema';

// Import components
import { PhysicalSymptomsSimple } from './PhysicalSymptomsSimple';
import { CognitiveSymptoms } from './CognitiveSymptoms';
import { EmotionalSymptoms } from './EmotionalSymptoms';
import { GeneralNotesSection } from './GeneralNotesSection';

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
        frequency: symptom.aggravatingFactors ? 'frequent' : 'occasional',
        duration: 'varies',
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
      const formData = mapContextDataToForm();
      form.reset(formData);
    }
  }, [contextData]);

  const onSubmit = (formData: Symptoms) => {
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
    alert('Symptoms Assessment saved successfully!');
  };

  return (
    <div className="space-y-6 p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-slate-800">Symptoms Assessment</h2>
        <p className="text-sm text-muted-foreground mt-1">Comprehensive evaluation of symptoms and their impact</p>
      </div>

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <Tabs defaultValue="physical" className="w-full border rounded-md">
            <TabsList className="w-full grid grid-cols-4 p-0 h-auto border-b">
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
              <PhysicalSymptomsSimple />
            </TabsContent>
            
            <TabsContent value="cognitive" className="p-6">
              <CognitiveSymptoms />
            </TabsContent>
            
            <TabsContent value="emotional" className="p-6">
              <EmotionalSymptoms />
            </TabsContent>
            
            <TabsContent value="general" className="p-6">
              <GeneralNotesSection />
            </TabsContent>
          </Tabs>

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
      </FormProvider>
    </div>
  );
}

export default SymptomsAssessment;