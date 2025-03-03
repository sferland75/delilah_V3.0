'use client';

import React, { useEffect, useMemo, useState } from 'react';
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
import { medicalHistorySchema, defaultFormState } from '../original/schema';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import { useAssessment } from '@/contexts/AssessmentContext';
import type { FormState } from '../original/types';

export function MedicalHistoryDirectAccess() {
  const { data, updateSection } = useAssessment();
  
  // Log the entire data to see what's available
  console.log("DIRECT-ACCESS COMPONENT: Full context data:", data);
  
  // Create a deep copy of defaultFormState
  const initialData = JSON.parse(JSON.stringify(defaultFormState));
  
  // Extract medical history data directly
  if (data?.medicalHistory?.pastMedicalHistory?.conditions) {
    console.log("DIRECT-ACCESS COMPONENT: Found conditions:", data.medicalHistory.pastMedicalHistory.conditions);
    
    // Directly set conditions
    initialData.preExistingConditions = initialData.preExistingConditions || {};
    initialData.preExistingConditions.conditions = data.medicalHistory.pastMedicalHistory.conditions.map(condition => ({
      name: condition.condition || '',
      diagnosisDate: condition.diagnosisDate || '',
      treatment: condition.treatment || ''
    }));
  }
  
  // Directly set surgeries
  if (data?.medicalHistory?.pastMedicalHistory?.surgeries) {
    console.log("DIRECT-ACCESS COMPONENT: Found surgeries:", data.medicalHistory.pastMedicalHistory.surgeries);
    
    initialData.preExistingConditions = initialData.preExistingConditions || {};
    initialData.preExistingConditions.surgeries = data.medicalHistory.pastMedicalHistory.surgeries.map(surgery => ({
      procedure: surgery.procedure || '',
      date: surgery.date || '',
      surgeon: surgery.surgeon || ''
    }));
  }
  
  // Directly set allergies
  if (data?.medicalHistory?.pastMedicalHistory?.allergies) {
    console.log("DIRECT-ACCESS COMPONENT: Found allergies:", data.medicalHistory.pastMedicalHistory.allergies);
    
    initialData.preExistingConditions = initialData.preExistingConditions || {};
    initialData.preExistingConditions.allergies = data.medicalHistory.pastMedicalHistory.allergies;
  }
  
  // Directly set medications
  if (data?.medicalHistory?.pastMedicalHistory?.medications) {
    console.log("DIRECT-ACCESS COMPONENT: Found medications:", data.medicalHistory.pastMedicalHistory.medications);
    
    initialData.medications = initialData.medications || {};
    initialData.medications.current = data.medicalHistory.pastMedicalHistory.medications.map(med => ({
      name: med.name || '',
      dosage: med.dosage || '',
      frequency: med.frequency || '',
      reason: med.reason || ''
    }));
  }
  
  // Directly set functional history
  if (data?.medicalHistory?.functionalHistory) {
    console.log("DIRECT-ACCESS COMPONENT: Found functional history:", data.medicalHistory.functionalHistory);
    
    initialData.preExistingConditions = initialData.preExistingConditions || {};
    initialData.preExistingConditions.functionalStatus = data.medicalHistory.functionalHistory.priorLevelOfFunction || '';
    initialData.preExistingConditions.recentChanges = data.medicalHistory.functionalHistory.recentChanges || '';
    
    if (data.medicalHistory.functionalHistory.priorLivingArrangement) {
      initialData.preExistingConditions.livingArrangement = data.medicalHistory.functionalHistory.priorLivingArrangement;
    }
    
    if (data.medicalHistory.functionalHistory.priorMobilityStatus) {
      initialData.preExistingConditions.mobilityStatus = data.medicalHistory.functionalHistory.priorMobilityStatus;
    }
  }
  
  // Directly set injury details
  if (data?.medicalHistory?.injuryDetails) {
    console.log("DIRECT-ACCESS COMPONENT: Found injury details:", data.medicalHistory.injuryDetails);
    
    initialData.injuryDetails = initialData.injuryDetails || {};
    initialData.injuryDetails.diagnosisDate = data.medicalHistory.injuryDetails.diagnosisDate || '';
    initialData.injuryDetails.mechanism = data.medicalHistory.injuryDetails.mechanism || '';
    initialData.injuryDetails.primaryDiagnosis = data.medicalHistory.injuryDetails.primaryDiagnosis || '';
    initialData.injuryDetails.secondaryDiagnoses = data.medicalHistory.injuryDetails.secondaryDiagnoses || [];
    initialData.injuryDetails.complications = data.medicalHistory.injuryDetails.complications || [];
  }
  
  // Directly set treatment history
  if (data?.medicalHistory?.treatmentHistory) {
    console.log("DIRECT-ACCESS COMPONENT: Found treatment history:", data.medicalHistory.treatmentHistory);
    
    initialData.treatment = initialData.treatment || {};
    
    if (data.medicalHistory.treatmentHistory.hospitalizations) {
      initialData.treatment.hospitalizations = data.medicalHistory.treatmentHistory.hospitalizations.map(hosp => ({
        facility: hosp.facility || '',
        admissionDate: hosp.admissionDate || '',
        dischargeDate: hosp.dischargeDate || '',
        reason: hosp.reason || '',
        procedures: hosp.procedures || []
      }));
    }
    
    if (data.medicalHistory.treatmentHistory.rehabilitationServices) {
      initialData.treatment.therapies = data.medicalHistory.treatmentHistory.rehabilitationServices.map(therapy => ({
        type: therapy.type || '',
        provider: therapy.provider || '',
        frequency: therapy.frequency || '',
        startDate: therapy.startDate || '',
        endDate: therapy.endDate || '',
        goals: therapy.goals || []
      }));
    }
  }
  
  console.log("DIRECT-ACCESS COMPONENT: Initial data prepared:", initialData);
  
  // Check for data
  const [dataFound, setDataFound] = useState(false);
  
  // Create form with directly accessed data
  const form = useForm<FormState>({
    resolver: zodResolver(medicalHistorySchema),
    defaultValues: initialData,
    mode: "onChange"
  });
  
  // Check if we've successfully loaded data
  useEffect(() => {
    if (data?.medicalHistory) {
      const hasConditions = data.medicalHistory.pastMedicalHistory?.conditions?.length > 0;
      const hasSurgeries = data.medicalHistory.pastMedicalHistory?.surgeries?.length > 0;
      const hasAllergies = !!data.medicalHistory.pastMedicalHistory?.allergies;
      const hasMedications = data.medicalHistory.pastMedicalHistory?.medications?.length > 0;
      
      if (hasConditions || hasSurgeries || hasAllergies || hasMedications) {
        setDataFound(true);
      }
    }
  }, [data]);

  useFormPersistence(form, 'medical-history-direct');

  const onSubmit = (formData: FormState) => {
    console.log('Form data:', formData);
    
    try {
      // Convert form data to the structure expected by the context
      const medicalHistoryData = {
        pastMedicalHistory: {
          conditions: formData.preExistingConditions?.conditions?.map(condition => ({
            condition: condition.name,
            diagnosisDate: condition.diagnosisDate,
            treatment: condition.treatment
          })) || [],
          surgeries: formData.preExistingConditions?.surgeries?.map(surgery => ({
            procedure: surgery.procedure,
            date: surgery.date,
            surgeon: surgery.surgeon
          })) || [],
          allergies: formData.preExistingConditions?.allergies || [],
          medications: formData.medications?.current?.map(med => ({
            name: med.name,
            dosage: med.dosage,
            frequency: med.frequency,
            reason: med.reason
          })) || []
        },
        functionalHistory: {
          priorLevelOfFunction: formData.preExistingConditions?.functionalStatus || '',
          recentChanges: formData.preExistingConditions?.recentChanges || '',
          priorLivingArrangement: formData.preExistingConditions?.livingArrangement || '',
          priorMobilityStatus: formData.preExistingConditions?.mobilityStatus || ''
        },
        injuryDetails: {
          diagnosisDate: formData.injuryDetails?.diagnosisDate || '',
          mechanism: formData.injuryDetails?.mechanism || '',
          primaryDiagnosis: formData.injuryDetails?.primaryDiagnosis || '',
          secondaryDiagnoses: formData.injuryDetails?.secondaryDiagnoses || [],
          complications: formData.injuryDetails?.complications || []
        },
        treatmentHistory: {
          hospitalizations: formData.treatment?.hospitalizations?.map(hosp => ({
            facility: hosp.facility,
            admissionDate: hosp.admissionDate,
            dischargeDate: hosp.dischargeDate,
            reason: hosp.reason,
            procedures: hosp.procedures
          })) || [],
          rehabilitationServices: formData.treatment?.therapies?.map(therapy => ({
            type: therapy.type,
            provider: therapy.provider,
            frequency: therapy.frequency,
            startDate: therapy.startDate,
            endDate: therapy.endDate,
            goals: therapy.goals
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
        <h2 className="text-2xl font-semibold text-slate-800">Medical History (Direct Access)</h2>
        <p className="text-sm text-muted-foreground mt-1">Pre-existing conditions, injury details, and current treatments</p>
      </div>
      
      {dataFound && (
        <Alert className="mb-6 bg-blue-50 text-blue-800 border-blue-200">
          <InfoIcon className="h-4 w-4 text-blue-800" />
          <AlertTitle>Data Loaded From Assessment Context</AlertTitle>
          <AlertDescription>
            Medical history information has been pre-populated using direct access method. Please review and adjust as needed.
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
              onClick={() => form.reset()}
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