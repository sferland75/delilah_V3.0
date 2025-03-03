'use client';

import React, { useEffect, useCallback, useState } from 'react';
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

// Create initial form state outside component to prevent recreation on each render
const initialFormState = JSON.parse(JSON.stringify(defaultFormState));

// Properly initialize all required fields in the form
initialFormState.data.injury = {
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
  initialTreatment: '' // Add this field as it's referenced in InjuryDetailsSection
};

// Initialize empty arrays for other sections
initialFormState.data.preExistingConditions = [];
initialFormState.data.surgeries = [];
initialFormState.data.currentMedications = [];
initialFormState.data.currentTreatments = [];

export function MedicalHistoryFixed() {
  const { data, updateSection } = useAssessment();
  const contextData = data || {}; // Ensure contextData is at least an empty object
  const [dataLoaded, setDataLoaded] = useState(false);
  const [formInitialized, setFormInitialized] = useState(false);
  
  // Define form with the schema - use useMemo to prevent recreation
  const form = useForm({
    resolver: zodResolver(medicalHistorySchema),
    defaultValues: initialFormState,
    mode: "onChange"
  });
  
  // Map context data to form when available - use useEffect with proper dependencies
  useEffect(() => {
    // Skip if already initialized to prevent loops
    if (formInitialized) return;
    
    if (contextData && contextData.medicalHistory) {
      try {
        // Extract data from context
        const { medicalHistory } = contextData;
        
        // Create form data structure based on the initial form state
        const formData = JSON.parse(JSON.stringify(initialFormState));
        let hasData = false;
        
        // 1. Map pre-existing conditions
        if (medicalHistory.pastMedicalHistory?.conditions && Array.isArray(medicalHistory.pastMedicalHistory.conditions)) {
          formData.data.preExistingConditions = medicalHistory.pastMedicalHistory.conditions.map(c => ({
            condition: c.condition || '',
            diagnosisDate: c.diagnosisDate || '',
            status: 'active', // Default value
            details: c.treatment || ''
          }));
          hasData = true;
        }
        
        // 2. Map surgeries if available
        if (medicalHistory.pastMedicalHistory?.surgeries && Array.isArray(medicalHistory.pastMedicalHistory.surgeries)) {
          formData.data.surgeries = medicalHistory.pastMedicalHistory.surgeries.map(s => ({
            procedure: s.procedure || '',
            date: s.date || '',
            outcome: 'Completed', // Default value
            surgeon: s.surgeon || '',
            facility: ''
          }));
          hasData = true;
        }
        
        // 3. Map allergies
        if (medicalHistory.pastMedicalHistory?.allergies) {
          // Split allergies string into array if it's a string
          if (typeof medicalHistory.pastMedicalHistory.allergies === 'string') {
            formData.data.allergies = medicalHistory.pastMedicalHistory.allergies
              .split(',')
              .map(a => a.trim())
              .filter(a => a.length > 0);
          } else {
            formData.data.allergies = [medicalHistory.pastMedicalHistory.allergies];
          }
          hasData = true;
        }
        
        // 4. Map injury details - CRITICAL: Ensure all fields exist that InjuryDetailsSection is looking for
        if (medicalHistory.injuryDetails) {
          formData.data.injury = {
            date: medicalHistory.injuryDetails.diagnosisDate || '',
            time: '',
            position: '',
            impactType: medicalHistory.injuryDetails.mechanism || '',
            circumstance: '',
            preparedForImpact: '',
            immediateSymptoms: '',
            immediateResponse: '',
            vehicleDamage: '',
            subsequentCare: '',
            initialTreatment: ''  // This field is used in InjuryDetailsSection
          };
          hasData = true;
        } else {
          // Ensure injury object exists with all required fields
          formData.data.injury = {
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
            initialTreatment: ''
          };
        }
        
        // 5. Map medications
        if (medicalHistory.pastMedicalHistory?.medications && Array.isArray(medicalHistory.pastMedicalHistory.medications)) {
          formData.data.currentMedications = medicalHistory.pastMedicalHistory.medications.map(m => ({
            name: m.name || '',
            dosage: m.dosage || '',
            frequency: m.frequency || '',
            prescribedFor: m.reason || '',
            prescribedBy: '',
            startDate: '',
            endDate: '',
            status: 'current' // Default value
          }));
          hasData = true;
        }
        
        // 6. Map treatments - Initialize even if no data exists to prevent null errors
        if (medicalHistory.treatmentHistory?.rehabilitationServices && 
            Array.isArray(medicalHistory.treatmentHistory.rehabilitationServices)) {
          formData.data.currentTreatments = medicalHistory.treatmentHistory.rehabilitationServices.map(t => ({
            provider: t.provider || '',
            type: t.type || '',
            facility: '',
            startDate: t.startDate || '',
            frequency: t.frequency || '',
            status: 'ongoing', // Default value
            notes: t.goals?.join(', ') || '',
            endDate: t.endDate || '' // Include endDate field as it's used in the component
          }));
          hasData = true;
        } else {
          // Ensure the currentTreatments array exists, even if empty
          formData.data.currentTreatments = [];
        }
        
        // Reset form with mapped data once
        form.reset(formData);
        setDataLoaded(hasData);
        setFormInitialized(true);
        
      } catch (error) {
        console.error("Error mapping medical history data:", error);
        setFormInitialized(true); // Mark as initialized even on error to prevent loops
      }
    } else {
      setFormInitialized(true); // Mark as initialized even without data
    }
  }, [contextData, form, formInitialized]);
  
  useFormPersistence(form, 'medical-history');
  
  const onSubmit = (formData) => {
    try {
      // Convert form data to the structure expected by the context
      const medicalHistoryData = {
        pastMedicalHistory: {
          conditions: (formData.data.preExistingConditions || []).map(condition => ({
            condition: condition.condition,
            diagnosisDate: condition.diagnosisDate,
            treatment: condition.details
          })),
          surgeries: (formData.data.surgeries || []).map(surgery => ({
            procedure: surgery.procedure,
            date: surgery.date,
            surgeon: surgery.surgeon
          })),
          allergies: (formData.data.allergies || []).join(', '),
          medications: (formData.data.currentMedications || []).map(med => ({
            name: med.name,
            dosage: med.dosage,
            frequency: med.frequency,
            reason: med.prescribedFor
          }))
        },
        functionalHistory: {
          priorLevelOfFunction: '',
          recentChanges: '',
          priorLivingArrangement: '',
          priorMobilityStatus: ''
        },
        injuryDetails: {
          diagnosisDate: formData.data.injury?.date || '',
          mechanism: formData.data.injury?.impactType || '',
          primaryDiagnosis: '',
          secondaryDiagnoses: [],
          complications: []
        },
        treatmentHistory: {
          hospitalizations: [],
          rehabilitationServices: (formData.data.currentTreatments || []).map(therapy => ({
            type: therapy.type,
            provider: therapy.provider,
            frequency: therapy.frequency,
            startDate: therapy.startDate,
            endDate: therapy.endDate || '',
            goals: therapy.notes ? [therapy.notes] : []
          }))
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
              onClick={() => form.reset(initialFormState)}
              type="button"
            >
              Reset
            </Button>
            <Button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save Medical History
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

// Add direct component export for use in the medical-fixed page
export function MedicalHistoryFixedDirect() {
  return <MedicalHistoryFixed />;
}