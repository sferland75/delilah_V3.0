'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Form } from '@/components/ui/form';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { useAssessment } from '@/contexts/AssessmentContext';

// Import section components directly to avoid circular dependencies
import { PreExistingConditionsSectionFixed } from './PreExistingConditionsSection.fixed';
import { InjuryDetailsSectionFixed } from './InjuryDetailsSection.fixed';
import { TreatmentSectionFixed } from './TreatmentSection.fixed';
import { MedicationsSectionFixed } from './MedicationsSection.fixed';

// Import schema (assuming it exists, otherwise we'll need to create it)
import { medicalHistorySchema, defaultFormState } from '../schema';
import type { FormState } from '../schema';

export const MedicalHistory = () => {
  const { data, updateSection } = useAssessment();
  const [dataLoaded, setDataLoaded] = useState(false);
  
  // Create a function to map the context data to form structure with proper error handling
  const mapContextDataToForm = useCallback(() => {
    try {
      // Ensure contextData is at least an empty object
      const contextData = data || {};
      
      // If no medical history data, return defaults
      if (!contextData.medicalHistory) {
        console.log("No medical history data found in context");
        return defaultFormState;
      }
      
      const medicalHistory = contextData.medicalHistory;
      console.log("Mapping medical history data:", medicalHistory);
      
      // Create a deep copy of the default form state to avoid mutation issues
      const formData = JSON.parse(JSON.stringify(defaultFormState));
      
      // Map the conditions array if it exists
      if (medicalHistory.pastMedicalHistory?.conditions) {
        formData.preExistingConditions = formData.preExistingConditions || [];
        
        formData.preExistingConditions = 
          medicalHistory.pastMedicalHistory.conditions.map((condition) => ({
            condition: condition.condition || '',
            status: condition.status || 'active',
            diagnosisDate: condition.diagnosisDate || '',
            details: condition.treatment || ''
          }));
      }
      
      // Map injury details if they exist
      if (medicalHistory.injuryDetails) {
        formData.injury = {
          date: medicalHistory.injuryDetails.diagnosisDate || '',
          time: medicalHistory.injuryDetails.time || '',
          position: medicalHistory.injuryDetails.position || '',
          impactType: medicalHistory.injuryDetails.mechanism || '',
          circumstance: medicalHistory.injuryDetails.description || '',
          immediateSymptoms: Array.isArray(medicalHistory.injuryDetails.complications) ? 
            medicalHistory.injuryDetails.complications.join(', ') : '',
          initialTreatment: medicalHistory.injuryDetails.initialTreatment || ''
        };
      }
      
      // Map treatments if they exist
      if (medicalHistory.treatmentHistory?.rehabilitationServices) {
        formData.currentTreatments = 
          medicalHistory.treatmentHistory.rehabilitationServices.map((treatment) => ({
            type: treatment.type || '',
            provider: treatment.provider || '',
            facility: treatment.facility || '',
            startDate: treatment.startDate || '',
            frequency: treatment.frequency || '',
            status: treatment.status || 'ongoing',
            notes: treatment.notes || ''
          }));
      }
      
      // Map medications if they exist
      if (medicalHistory.pastMedicalHistory?.medications) {
        formData.currentMedications = 
          medicalHistory.pastMedicalHistory.medications.map((med) => ({
            name: med.name || '',
            dosage: med.dosage || '',
            frequency: med.frequency || '',
            prescribedFor: med.reason || '',
            prescribedBy: med.prescriber || '',
            status: med.status || 'current'
          }));
      }
      
      console.log("Mapped form data:", formData);
      return formData;
    } catch (error) {
      console.error("Error mapping medical history data:", error);
      return defaultFormState;
    }
  }, [data]);
  
  // Define form with proper error handling for defaultValues
  const form = useForm({
    resolver: zodResolver(medicalHistorySchema),
    defaultValues: defaultFormState,
    mode: "onChange"
  });

  // Update form when context data changes with proper error handling
  useEffect(() => {
    try {
      if (data?.medicalHistory && Object.keys(data.medicalHistory).length > 0) {
        console.log("Medical history context data changed:", data.medicalHistory);
        const formData = mapContextDataToForm();
        form.reset(formData);
        setDataLoaded(true);
      }
    } catch (error) {
      console.error("Error updating form from context:", error);
    }
  }, [data, mapContextDataToForm, form]);

  const onSubmit = (formData) => {
    console.log('Form data:', formData);
    
    try {
      // Convert form data to the structure expected by the context
      const medicalHistoryData = {
        pastMedicalHistory: {
          conditions: formData.preExistingConditions?.map(condition => ({
            condition: condition.condition,
            status: condition.status,
            diagnosisDate: condition.diagnosisDate,
            treatment: condition.details
          })) || [],
          medications: formData.currentMedications?.map(med => ({
            name: med.name,
            dosage: med.dosage,
            frequency: med.frequency,
            reason: med.prescribedFor,
            prescriber: med.prescribedBy,
            status: med.status
          })) || []
        },
        injuryDetails: {
          diagnosisDate: formData.injury?.date,
          time: formData.injury?.time,
          position: formData.injury?.position,
          mechanism: formData.injury?.impactType,
          description: formData.injury?.circumstance,
          complications: formData.injury?.immediateSymptoms ? 
            formData.injury.immediateSymptoms.split(',').map(s => s.trim()) : [],
          initialTreatment: formData.injury?.initialTreatment
        },
        treatmentHistory: {
          rehabilitationServices: formData.currentTreatments?.map(treatment => ({
            type: treatment.type,
            provider: treatment.provider,
            facility: treatment.facility,
            startDate: treatment.startDate,
            frequency: treatment.frequency,
            status: treatment.status,
            notes: treatment.notes
          })) || []
        }
      };
      
      // Update the context with the form data
      updateSection('medicalHistory', medicalHistoryData);
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
                <ErrorBoundary>
                  <PreExistingConditionsSectionFixed />
                </ErrorBoundary>
              </TabsContent>
              
              <TabsContent value="injury" className="p-6">
                <ErrorBoundary>
                  <InjuryDetailsSectionFixed />
                </ErrorBoundary>
              </TabsContent>
              
              <TabsContent value="treatment" className="p-6">
                <ErrorBoundary>
                  <TreatmentSectionFixed />
                </ErrorBoundary>
              </TabsContent>
              
              <TabsContent value="medications" className="p-6">
                <ErrorBoundary>
                  <MedicationsSectionFixed />
                </ErrorBoundary>
              </TabsContent>
            </Tabs>
          </FormProvider>

          <div className="flex justify-end space-x-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => form.reset(defaultFormState)}
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
};

// Add default export
export default MedicalHistory;