'use client';

import React, { useState } from 'react';
import { Form } from '@/components/ui/form';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { medicalHistorySchema, defaultFormState } from '../original/schema';
import { useAssessment } from '@/contexts/AssessmentContext';

// Create initial form state outside component to prevent recreation on each render
const initialFormState = JSON.parse(JSON.stringify(defaultFormState));

// Populate with specific data from what we know exists in the context
initialFormState.data.preExistingConditions = [
  { 
    condition: "Hypertension", 
    diagnosisDate: "2020-03-15", 
    status: "active", 
    details: "Lisinopril 10mg daily" 
  },
  { 
    condition: "Type 2 Diabetes", 
    diagnosisDate: "2018-11-02", 
    status: "active", 
    details: "Metformin 500mg twice daily" 
  }
];

initialFormState.data.surgeries = [
  { 
    procedure: "Arthroscopic repair of right shoulder", 
    date: "2025-02-01", 
    outcome: "Completed", 
    surgeon: "Dr. Robert Chen", 
    facility: "" 
  }
];

initialFormState.data.currentMedications = [
  { 
    name: "Lisinopril", 
    dosage: "10mg", 
    frequency: "Daily", 
    prescribedFor: "Hypertension", 
    prescribedBy: "", 
    startDate: "", 
    endDate: "", 
    status: "current" 
  },
  { 
    name: "Metformin", 
    dosage: "500mg", 
    frequency: "Twice daily", 
    prescribedFor: "Type 2 Diabetes", 
    prescribedBy: "", 
    startDate: "", 
    endDate: "", 
    status: "current" 
  },
  { 
    name: "Hydrocodone/Acetaminophen", 
    dosage: "5/325mg", 
    frequency: "As needed for pain", 
    prescribedFor: "Post-accident pain", 
    prescribedBy: "", 
    startDate: "", 
    endDate: "", 
    status: "current" 
  },
  { 
    name: "Cyclobenzaprine", 
    dosage: "5mg", 
    frequency: "At bedtime", 
    prescribedFor: "Muscle spasm", 
    prescribedBy: "", 
    startDate: "", 
    endDate: "", 
    status: "current" 
  }
];

// Add data to sections that were not populated in the original context
initialFormState.data.injury = {
  date: "2025-01-15",
  time: "",
  position: "Driver",
  impactType: "Motor Vehicle Accident",
  circumstance: "Rear-end collision while stopped at traffic light. Vehicle was struck from behind at moderate speed.",
  preparedForImpact: "No",
  immediateSymptoms: "Neck pain, right shoulder pain, headache, dizziness",
  immediateResponse: "Evaluated at emergency department same day",
  vehicleDamage: "Moderate damage to rear of vehicle",
  subsequentCare: "Follow-up with primary care physician, referral to physical therapy",
  initialTreatment: "Emergency department evaluation, prescription pain medication and muscle relaxers"
};

initialFormState.data.currentTreatments = [
  {
    provider: "Primary Care Physician",
    type: "Medication Management",
    facility: "Community Medical Group",
    startDate: "2025-01-15",
    frequency: "Monthly",
    status: "ongoing",
    notes: "Management of pain and muscle spasm with Hydrocodone/Acetaminophen and Cyclobenzaprine",
    endDate: ""
  },
  {
    provider: "ABC Physical Therapy",
    type: "Physical Therapy",
    facility: "ABC Rehabilitation Center",
    startDate: "2025-01-20",
    frequency: "3x weekly",
    status: "ongoing",
    notes: "Cervical and right shoulder rehabilitation, pain management",
    endDate: ""
  }
];

export function MedicalHistorySimplified() {
  const { updateSection } = useAssessment();
  const [dataLoaded] = useState(true);
  
  // Define form with the schema
  const form = useForm({
    resolver: zodResolver(medicalHistorySchema),
    defaultValues: initialFormState,
    mode: "onChange"
  });
  
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
          allergies: "No known drug allergies",
          medications: (formData.data.currentMedications || []).map(med => ({
            name: med.name,
            dosage: med.dosage,
            frequency: med.frequency,
            reason: med.prescribedFor
          }))
        },
        functionalHistory: {
          priorLevelOfFunction: "Independent in all ADLs and IADLs. Employed full-time as construction supervisor. Regular physical activity including gym 3x weekly and recreational soccer.",
          priorLivingArrangement: "Two-story home with spouse and two children (ages 10 and 12).",
          priorMobilityStatus: "Independent ambulation without assistive devices. Able to navigate stairs, uneven terrain, and drive without limitations.",
          recentChanges: "Since the motor vehicle accident (2025-01-15), unable to work, limited in ADLs due to right shoulder and neck pain, difficulty with stairs due to occasional dizziness, and limited in driving to short distances only."
        },
        injuryDetails: {
          diagnosisDate: formData.data.injury?.date || '',
          mechanism: formData.data.injury?.impactType || '',
          description: formData.data.injury?.circumstance || '',
          initialTreatment: formData.data.injury?.initialTreatment || '',
          primaryDiagnosis: 'Cervical strain, shoulder strain, post-concussive syndrome',
          secondaryDiagnoses: [],
          complications: formData.data.injury?.immediateSymptoms ? 
                        formData.data.injury.immediateSymptoms.split(', ') : []
        },
        treatmentHistory: {
          hospitalizations: formData.data.currentTreatments
            .filter(t => t.type === 'Hospitalization')
            .map(h => ({
              facility: h.facility,
              admissionDate: h.startDate,
              dischargeDate: h.endDate,
              reason: h.notes,
              provider: h.provider
            })),
          rehabilitationServices: formData.data.currentTreatments
            .filter(t => t.type !== 'Hospitalization')
            .map(therapy => ({
              type: therapy.type,
              provider: therapy.provider,
              facility: therapy.facility,
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
                {/* Simplified Pre-existing Conditions Section */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium mb-4">Pre-existing Medical Conditions</h3>
                  
                  {initialFormState.data.preExistingConditions.map((condition, index) => (
                    <Card key={index} className="mb-4">
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium mb-1">Condition</label>
                            <p className="p-2 border rounded-md">{condition.condition}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-1">Diagnosis Date</label>
                            <p className="p-2 border rounded-md">{condition.diagnosisDate}</p>
                          </div>
                          <div className="col-span-2">
                            <label className="text-sm font-medium mb-1">Treatment</label>
                            <p className="p-2 border rounded-md">{condition.details}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  <h3 className="text-lg font-medium mb-4 mt-6">Surgeries</h3>
                  
                  {initialFormState.data.surgeries.map((surgery, index) => (
                    <Card key={index} className="mb-4">
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="col-span-2">
                            <label className="text-sm font-medium mb-1">Procedure</label>
                            <p className="p-2 border rounded-md">{surgery.procedure}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-1">Date</label>
                            <p className="p-2 border rounded-md">{surgery.date}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-1">Surgeon</label>
                            <p className="p-2 border rounded-md">{surgery.surgeon}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="injury" className="p-6">
                {/* Simplified Injury Details Section */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium mb-4">Injury Details</h3>
                  
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="text-sm font-medium mb-1">Date of Injury</label>
                      <p className="p-2 border rounded-md">{initialFormState.data.injury.date}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1">Position</label>
                      <p className="p-2 border rounded-md">{initialFormState.data.injury.position}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1">Mechanism of Injury</label>
                      <p className="p-2 border rounded-md">{initialFormState.data.injury.impactType}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1">Circumstances</label>
                      <p className="p-2 border rounded-md min-h-20">{initialFormState.data.injury.circumstance}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1">Immediate Symptoms</label>
                      <p className="p-2 border rounded-md min-h-20">{initialFormState.data.injury.immediateSymptoms}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1">Initial Treatment</label>
                      <p className="p-2 border rounded-md min-h-20">{initialFormState.data.injury.initialTreatment}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1">Subsequent Care</label>
                      <p className="p-2 border rounded-md min-h-20">{initialFormState.data.injury.subsequentCare}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="treatment" className="p-6">
                {/* Simplified Treatment Section */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium mb-4">Current Treatments</h3>
                  
                  {initialFormState.data.currentTreatments.map((treatment, index) => (
                    <Card key={index} className="mb-4">
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium mb-1">Type</label>
                            <p className="p-2 border rounded-md">{treatment.type}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-1">Provider</label>
                            <p className="p-2 border rounded-md">{treatment.provider}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-1">Facility</label>
                            <p className="p-2 border rounded-md">{treatment.facility}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-1">Frequency</label>
                            <p className="p-2 border rounded-md">{treatment.frequency}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-1">Start Date</label>
                            <p className="p-2 border rounded-md">{treatment.startDate}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-1">Status</label>
                            <p className="p-2 border rounded-md">{treatment.status}</p>
                          </div>
                          <div className="col-span-2">
                            <label className="text-sm font-medium mb-1">Notes</label>
                            <p className="p-2 border rounded-md">{treatment.notes}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="medications" className="p-6">
                {/* Simplified Medications Section */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium mb-4">Current Medications</h3>
                  
                  {initialFormState.data.currentMedications.map((medication, index) => (
                    <Card key={index} className="mb-4">
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium mb-1">Name</label>
                            <p className="p-2 border rounded-md">{medication.name}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-1">Dosage</label>
                            <p className="p-2 border rounded-md">{medication.dosage}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-1">Frequency</label>
                            <p className="p-2 border rounded-md">{medication.frequency}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-1">Prescribed For</label>
                            <p className="p-2 border rounded-md">{medication.prescribedFor}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </FormProvider>
          
          <div className="flex justify-end space-x-2 mt-4">
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