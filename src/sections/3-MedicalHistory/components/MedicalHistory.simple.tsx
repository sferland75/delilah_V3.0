'use client';

import React, { useEffect, useState } from 'react';
import { Form } from '@/components/ui/form';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import { PreExistingConditionsSection } from './PreExistingConditionsSection';
import { InjuryDetailsSection } from './InjuryDetailsSection';
import { TreatmentSection } from './TreatmentSection';
import { MedicationsSection } from './MedicationsSection';
import { medicalHistorySchema } from '../original/schema';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import { useAssessment } from '@/contexts/AssessmentContext';
import type { FormState } from '../original/types';

export function MedicalHistorySimple() {
  const { data, updateSection } = useAssessment();
  const contextData = data || {}; // Ensure contextData is at least an empty object
  const [dataLoaded, setDataLoaded] = useState(false);
  
  // Create a basic initial form state
  const initialFormState = {
    data: {
      preExistingConditions: [],
      surgeries: [],
      familyHistory: '',
      allergies: [],
      injury: {
        date: '',
        time: '',
        position: '',
        impactType: '',
        circumstance: '',
        preparedForImpact: '',
        immediateSymptoms: '',
        immediateResponse: '',
        vehicleDamage: '',
        subsequentCare: '',
        initialTreatment: '' // Extra field needed by InjuryDetailsSection
      },
      currentMedications: [],
      currentTreatments: []
    },
    config: {
      mode: 'edit' as const,
      activeTab: 'preExisting' as const
    },
    isDirty: false,
    isValid: false
  };
  
  // Define form with the schema
  const form = useForm<FormState>({
    resolver: zodResolver(medicalHistorySchema),
    defaultValues: initialFormState
  });
  
  // Map context data to form when available
  useEffect(() => {
    if (!contextData.medicalHistory) return;
    
    try {
      // Extract data from context
      const { medicalHistory } = contextData;
      
      // Create form data structure
      const formData = JSON.parse(JSON.stringify(initialFormState));
      let hasData = false;
      
      // 1. Map pre-existing conditions
      if (medicalHistory.pastMedicalHistory?.conditions && Array.isArray(medicalHistory.pastMedicalHistory.conditions)) {
        formData.data.preExistingConditions = medicalHistory.pastMedicalHistory.conditions.map(c => ({
          condition: c.condition || '',
          diagnosisDate: c.diagnosisDate || '',
          status: 'active' as const,
          details: c.treatment || ''
        }));
        hasData = true;
      }
      
      // 2. Map medications
      if (medicalHistory.pastMedicalHistory?.medications && Array.isArray(medicalHistory.pastMedicalHistory.medications)) {
        formData.data.currentMedications = medicalHistory.pastMedicalHistory.medications.map(m => ({
          name: m.name || '',
          dosage: m.dosage || '',
          frequency: m.frequency || '',
          prescribedFor: m.reason || '',
          prescribedBy: '',
          status: 'current' as const
        }));
        hasData = true;
      }
      
      // Reset form with mapped data
      form.reset(formData);
      setDataLoaded(hasData);
    } catch (error) {
      console.error("Error mapping medical history data:", error);
    }
  }, [contextData, form]);
  
  useFormPersistence(form, 'medical-history-simple');
  
  const onSubmit = (formData: FormState) => {
    try {
      // Update the context with the form data
      updateSection('medicalHistory', {
        pastMedicalHistory: {
          conditions: formData.data.preExistingConditions.map(c => ({
            condition: c.condition,
            diagnosisDate: c.diagnosisDate,
            treatment: c.details
          }))
        }
      });
    } catch (error) {
      console.error("Error preparing data for context update:", error);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-slate-800">Medical History</h2>
        <p className="text-sm text-muted-foreground mt-1">Pre-existing conditions, injury details, and current treatments</p>
      </div>
      
      {dataLoaded && (
        <Alert className="mb-6 bg-blue-50 text-blue-800 border-blue-200">
          <InfoIcon className="h-4 w-4 text-blue-800" />
          <AlertTitle>Data Loaded From Assessment Context</AlertTitle>
          <AlertDescription>
            Medical history information has been pre-populated from previous assessments. Please review and adjust as needed.
          </AlertDescription>
        </Alert>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <FormProvider {...form}>
            <Tabs defaultValue="preExisting" className="w-full border rounded-md">
              <TabsList className="grid w-full grid-cols-4 p-0 h-auto border-b">
                <TabsTrigger 
                  className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
                  value="preExisting"
                >
                  Pre-Existing
                </TabsTrigger>
                <TabsTrigger 
                  className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
                  value="injury"
                >
                  Injury Details
                </TabsTrigger>
                <TabsTrigger 
                  className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
                  value="treatment"
                >
                  Treatment
                </TabsTrigger>
                <TabsTrigger 
                  className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
                  value="medications"
                >
                  Medications
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="preExisting" className="p-6">
                <PreExistingConditionsSection />
              </TabsContent>
              
              <TabsContent value="injury" className="p-6">
                <InjuryDetailsSection />
              </TabsContent>
              
              <TabsContent value="treatment" className="p-6">
                <TreatmentSection />
              </TabsContent>
              
              <TabsContent value="medications" className="p-6">
                <MedicationsSection />
              </TabsContent>
            </Tabs>
          </FormProvider>
          
          <div className="flex justify-end space-x-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => form.reset(initialFormState)}
              type="button"
            >
              Reset
            </Button>
            <Button 
              type="submit"
            >
              Save Medical History
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}