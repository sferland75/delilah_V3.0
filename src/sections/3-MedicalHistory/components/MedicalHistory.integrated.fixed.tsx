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

export function MedicalHistoryIntegratedFixed() {
  const { data, updateSection } = useAssessment();
  const contextData = data || {}; // Ensure contextData is at least an empty object
  const [dataLoaded, setDataLoaded] = useState(false);
  
  // Create a function to map the context data to form structure with proper error handling
  const mapContextDataToForm = () => {
    // Create a deep copy of the default form state to avoid mutation issues
    const formData = JSON.parse(JSON.stringify(defaultFormState));
    
    // Safely check if medicalHistory exists in contextData
    if (!contextData.medicalHistory) {
      console.log("No medical history data found in context");
      return formData;
    }
    
    const medicalHistory = contextData.medicalHistory;
    console.log("Mapping medical history data:", medicalHistory);
    
    try {
      // Map the conditions array if it exists
      if (medicalHistory.pastMedicalHistory?.conditions && Array.isArray(medicalHistory.pastMedicalHistory.conditions)) {
        console.log("Found conditions:", medicalHistory.pastMedicalHistory.conditions);
        // Initialize the conditions array if it doesn't exist
        if (!formData.preExistingConditions) {
          formData.preExistingConditions = {};
        }
        
        formData.preExistingConditions.conditions = 
          medicalHistory.pastMedicalHistory.conditions.map((condition) => ({
            name: condition.condition || '',
            diagnosisDate: condition.diagnosisDate || '',
            treatment: condition.treatment || ''
          }));
        
        // Flag that we found and loaded data
        setDataLoaded(true);
      }
      
      // Map the surgeries array if it exists
      if (medicalHistory.pastMedicalHistory?.surgeries && Array.isArray(medicalHistory.pastMedicalHistory.surgeries)) {
        console.log("Found surgeries:", medicalHistory.pastMedicalHistory.surgeries);
        // Initialize the conditions object if it doesn't exist
        if (!formData.preExistingConditions) {
          formData.preExistingConditions = {};
        }
        
        formData.preExistingConditions.surgeries = 
          medicalHistory.pastMedicalHistory.surgeries.map((surgery) => ({
            procedure: surgery.procedure || '',
            date: surgery.date || '',
            surgeon: surgery.surgeon || ''
          }));
        
        // Flag that we found and loaded data
        setDataLoaded(true);
      }
      
      // Map allergies
      if (medicalHistory.pastMedicalHistory?.allergies) {
        console.log("Found allergies:", medicalHistory.pastMedicalHistory.allergies);
        // Initialize the conditions object if it doesn't exist
        if (!formData.preExistingConditions) {
          formData.preExistingConditions = {};
        }
        
        formData.preExistingConditions.allergies = medicalHistory.pastMedicalHistory.allergies;
        
        // Flag that we found and loaded data
        setDataLoaded(true);
      }
      
      // Map medications if they exist
      if (medicalHistory.pastMedicalHistory?.medications && Array.isArray(medicalHistory.pastMedicalHistory.medications)) {
        console.log("Found medications:", medicalHistory.pastMedicalHistory.medications);
        // Initialize the medications object if it doesn't exist
        if (!formData.medications) {
          formData.medications = {};
        }
        
        formData.medications.current = 
          medicalHistory.pastMedicalHistory.medications.map((med) => ({
            name: med.name || '',
            dosage: med.dosage || '',
            frequency: med.frequency || '',
            reason: med.reason || ''
          }));
        
        // Flag that we found and loaded data
        setDataLoaded(true);
      }
      
      // Map functional history if it exists
      if (medicalHistory.functionalHistory) {
        console.log("Found functional history:", medicalHistory.functionalHistory);
        // Initialize the conditions object if it doesn't exist
        if (!formData.preExistingConditions) {
          formData.preExistingConditions = {};
        }
        
        formData.preExistingConditions.functionalStatus = medicalHistory.functionalHistory.priorLevelOfFunction || '';
        formData.preExistingConditions.recentChanges = medicalHistory.functionalHistory.recentChanges || '';
        
        // Map prior living arrangement and mobility status if they exist
        if (medicalHistory.functionalHistory.priorLivingArrangement) {
          formData.preExistingConditions.livingArrangement = medicalHistory.functionalHistory.priorLivingArrangement;
        }
        
        if (medicalHistory.functionalHistory.priorMobilityStatus) {
          formData.preExistingConditions.mobilityStatus = medicalHistory.functionalHistory.priorMobilityStatus;
        }
        
        // Flag that we found and loaded data
        setDataLoaded(true);
      }
      
      // Map injury details if they exist
      if (medicalHistory.injuryDetails) {
        console.log("Found injury details:", medicalHistory.injuryDetails);
        if (!formData.injuryDetails) {
          formData.injuryDetails = {};
        }
        
        formData.injuryDetails.diagnosisDate = medicalHistory.injuryDetails.diagnosisDate || '';
        formData.injuryDetails.mechanism = medicalHistory.injuryDetails.mechanism || '';
        formData.injuryDetails.primaryDiagnosis = medicalHistory.injuryDetails.primaryDiagnosis || '';
        formData.injuryDetails.secondaryDiagnoses = medicalHistory.injuryDetails.secondaryDiagnoses || [];
        formData.injuryDetails.complications = medicalHistory.injuryDetails.complications || [];
        
        // Flag that we found and loaded data
        setDataLoaded(true);
      }
      
      // Map treatment information if it exists
      if (medicalHistory.treatmentHistory) {
        console.log("Found treatment history:", medicalHistory.treatmentHistory);
        if (!formData.treatment) {
          formData.treatment = {};
        }
        
        if (medicalHistory.treatmentHistory.hospitalizations && Array.isArray(medicalHistory.treatmentHistory.hospitalizations)) {
          formData.treatment.hospitalizations = medicalHistory.treatmentHistory.hospitalizations.map(hosp => ({
            facility: hosp.facility || '',
            admissionDate: hosp.admissionDate || '',
            dischargeDate: hosp.dischargeDate || '',
            reason: hosp.reason || '',
            procedures: hosp.procedures || []
          }));
        }
        
        if (medicalHistory.treatmentHistory.rehabilitationServices && Array.isArray(medicalHistory.treatmentHistory.rehabilitationServices)) {
          formData.treatment.therapies = medicalHistory.treatmentHistory.rehabilitationServices.map(therapy => ({
            type: therapy.type || '',
            provider: therapy.provider || '',
            frequency: therapy.frequency || '',
            startDate: therapy.startDate || '',
            endDate: therapy.endDate || '',
            goals: therapy.goals || []
          }));
        }
        
        // Flag that we found and loaded data
        setDataLoaded(true);
      }
      
      console.log("Mapped form data:", formData);
      return formData;
    } catch (error) {
      console.error("Error mapping medical history data:", error);
      return defaultFormState;
    }
  };
  
  // Create the form defaultValues using useMemo to prevent recomputation
  const defaultValues = useMemo(() => {
    try {
      if (contextData && contextData.medicalHistory && Object.keys(contextData.medicalHistory).length > 0) {
        const mappedData = mapContextDataToForm();
        return mappedData;
      }
      return defaultFormState;
    } catch (error) {
      console.error("Error computing default values:", error);
      return defaultFormState;
    }
  }, [contextData]);
  
  // Define form with proper error handling for defaultValues
  const form = useForm<FormState>({
    resolver: zodResolver(medicalHistorySchema),
    defaultValues,
    mode: "onChange"
  });

  // Update form when context data changes with proper error handling
  useEffect(() => {
    try {
      if (contextData && contextData.medicalHistory && Object.keys(contextData.medicalHistory).length > 0) {
        console.log("Medical history context data changed:", contextData.medicalHistory);
        const formData = mapContextDataToForm();
        form.reset(formData);
      }
    } catch (error) {
      console.error("Error updating form from context:", error);
    }
  }, [contextData]);

  useFormPersistence(form, 'medical-history');

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