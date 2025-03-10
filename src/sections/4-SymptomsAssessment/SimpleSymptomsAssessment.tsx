'use client';

import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAssessment } from '@/contexts/AssessmentContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { z } from 'zod';

// Define a simpler schema for our simplified component
const simpleSymptomsSchema = z.object({
  primarySymptoms: z.array(z.string()).default([]),
  secondarySymptoms: z.array(z.string()).default([]),
  painRating: z.string().default('0'),
  symptomDetails: z.string().default(''),
  symptomsHistory: z.string().default(''),
  currentTreatments: z.string().default(''),
  symptomTriggers: z.string().default(''),
  symptomImpact: z.string().default(''),
  additionalNotes: z.string().default('')
});

export function SimpleSymptomsAssessment() {
  const { data, updateSection, saveCurrentAssessment } = useAssessment();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Common symptom types
  const painSymptoms = [
    'Headache', 
    'Neck Pain', 
    'Back Pain', 
    'Joint Pain', 
    'Muscle Pain'
  ];
  
  const neurologicalSymptoms = [
    'Dizziness',
    'Fatigue',
    'Memory Issues',
    'Concentration Problems',
    'Sleep Disturbances'
  ];
  
  const emotionalSymptoms = [
    'Anxiety',
    'Depression',
    'Irritability',
    'Mood Changes',
    'Stress'
  ];

  // Initialize form with schema validation
  const methods = useForm({
    resolver: zodResolver(simpleSymptomsSchema),
    defaultValues: {
      primarySymptoms: [],
      secondarySymptoms: [],
      painRating: '0',
      symptomDetails: '',
      symptomsHistory: '',
      currentTreatments: '',
      symptomTriggers: '',
      symptomImpact: '',
      additionalNotes: ''
    }
  });

  // Load data from context when available
  useEffect(() => {
    if (data?.symptomsAssessment) {
      try {
        console.log('Loading symptoms data from context');
        methods.reset({
          primarySymptoms: data.symptomsAssessment.primarySymptoms || [],
          secondarySymptoms: data.symptomsAssessment.secondarySymptoms || [],
          painRating: data.symptomsAssessment.painRating?.toString() || '0',
          symptomDetails: data.symptomsAssessment.symptomDetails || '',
          symptomsHistory: data.symptomsAssessment.symptomsHistory || '',
          currentTreatments: data.symptomsAssessment.currentTreatments || '',
          symptomTriggers: data.symptomsAssessment.symptomTriggers || '',
          symptomImpact: data.symptomsAssessment.symptomImpact || '',
          additionalNotes: data.symptomsAssessment.additionalNotes || ''
        });
      } catch (error) {
        console.error('Error loading symptoms data:', error);
        toast({
          title: 'Error loading data',
          description: 'There was a problem loading the symptoms data.',
          variant: 'destructive',
        });
      }
    }
    setLoading(false);
  }, [data?.symptomsAssessment, methods]);

  const onSubmit = async (formData) => {
    try {
      setSaving(true);
      console.log('Form submitted:', formData);
      
      // Convert pain rating to number
      const symptomsData = {
        ...formData,
        painRating: parseInt(formData.painRating, 10)
      };
      
      // Update context
      updateSection('symptomsAssessment', symptomsData);
      
      // Save current assessment
      const success = saveCurrentAssessment();
      
      if (success) {
        toast({
          title: 'Saved successfully',
          description: 'Symptoms information has been saved.',
        });
      } else {
        toast({
          title: 'Save failed',
          description: 'There was a problem saving the symptoms information.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error saving symptoms data:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while saving.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading symptoms data...</div>;
  }

  return (
    <ErrorBoundary>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Symptoms Assessment</h2>
        
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Tabs defaultValue="symptoms" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="symptoms">Primary Symptoms</TabsTrigger>
                <TabsTrigger value="details">Details & History</TabsTrigger>
                <TabsTrigger value="impact">Impact & Treatment</TabsTrigger>
              </TabsList>
              
              <TabsContent value="symptoms" className="mt-4">
                <Card className="p-4">
                  <h3 className="text-lg font-medium mb-4">Symptom Selection</h3>
                  
                  <div className="mb-6">
                    <Label className="text-base font-medium mb-2 block">Pain Symptoms</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {painSymptoms.map(symptom => (
                        <div key={symptom} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`pain-${symptom}`} 
                            value={symptom}
                            {...methods.register('primarySymptoms')}
                          />
                          <Label htmlFor={`pain-${symptom}`}>{symptom}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <Label className="text-base font-medium mb-2 block">Neurological Symptoms</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {neurologicalSymptoms.map(symptom => (
                        <div key={symptom} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`neuro-${symptom}`} 
                            value={symptom}
                            {...methods.register('primarySymptoms')}
                          />
                          <Label htmlFor={`neuro-${symptom}`}>{symptom}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <Label className="text-base font-medium mb-2 block">Emotional Symptoms</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {emotionalSymptoms.map(symptom => (
                        <div key={symptom} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`emotional-${symptom}`} 
                            value={symptom}
                            {...methods.register('secondarySymptoms')}
                          />
                          <Label htmlFor={`emotional-${symptom}`}>{symptom}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <Label htmlFor="painRating" className="text-base font-medium mb-2 block">
                      Pain Rating (0-10)
                    </Label>
                    <Input
                      id="painRating"
                      type="range"
                      min="0"
                      max="10"
                      step="1"
                      {...methods.register('painRating')}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>0 - No Pain</span>
                      <span>5 - Moderate</span>
                      <span>10 - Severe</span>
                    </div>
                    <div className="text-center font-medium mt-2">
                      Current Rating: {methods.watch('painRating')}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="symptomDetails" className="text-base font-medium mb-2 block">
                      Symptom Details
                    </Label>
                    <Textarea
                      id="symptomDetails"
                      placeholder="Describe your symptoms in detail..."
                      rows={4}
                      {...methods.register('symptomDetails')}
                    />
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="details" className="mt-4">
                <Card className="p-4">
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="symptomsHistory" className="text-base font-medium mb-2 block">
                        Symptoms History
                      </Label>
                      <Textarea
                        id="symptomsHistory"
                        placeholder="When did your symptoms begin? How have they changed over time?"
                        rows={4}
                        {...methods.register('symptomsHistory')}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="currentTreatments" className="text-base font-medium mb-2 block">
                        Current Treatments
                      </Label>
                      <Textarea
                        id="currentTreatments"
                        placeholder="What treatments are you currently receiving for these symptoms?"
                        rows={4}
                        {...methods.register('currentTreatments')}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="symptomTriggers" className="text-base font-medium mb-2 block">
                        Symptom Triggers
                      </Label>
                      <Textarea
                        id="symptomTriggers"
                        placeholder="What makes your symptoms worse? What triggers them?"
                        rows={4}
                        {...methods.register('symptomTriggers')}
                      />
                    </div>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="impact" className="mt-4">
                <Card className="p-4">
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="symptomImpact" className="text-base font-medium mb-2 block">
                        Symptom Impact
                      </Label>
                      <Textarea
                        id="symptomImpact"
                        placeholder="How do these symptoms impact your daily life, work, and relationships?"
                        rows={4}
                        {...methods.register('symptomImpact')}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="additionalNotes" className="text-base font-medium mb-2 block">
                        Additional Notes
                      </Label>
                      <Textarea
                        id="additionalNotes"
                        placeholder="Any other information about your symptoms that would be helpful for us to know?"
                        rows={4}
                        {...methods.register('additionalNotes')}
                      />
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 flex justify-end">
              <Button 
                type="submit" 
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Symptoms Information'}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </ErrorBoundary>
  );
}

export default SimpleSymptomsAssessment;