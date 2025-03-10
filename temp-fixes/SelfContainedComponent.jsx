'use client';

import React, { useEffect, useState } from 'react';
import { Form } from '@/components/ui/form';
import { useForm, FormProvider } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon, PlusCircle, MinusCircle } from 'lucide-react';
import { useAssessment } from '@/contexts/AssessmentContext';

// Simple schema validation - can be expanded as needed
const validateForm = (data) => {
  // Basic validation logic here
  return true;
};

export function MedicalHistorySelfContained() {
  const { data, updateSection } = useAssessment();
  const [dataLoaded, setDataLoaded] = useState(false);
  
  // Create default form state
  const defaultFormState = {
    data: {
      preExistingConditions: [],
      surgeries: [],
      injury: {
        date: '',
        time: '',
        position: '',
        impactType: '',
        circumstance: '',
        immediateSymptoms: '',
        initialTreatment: ''
      },
      currentMedications: [],
      currentTreatments: []
    }
  };
  
  // Simple form without zod validation
  const form = useForm({
    defaultValues: defaultFormState
  });
  
  // Update form from context data
  useEffect(() => {
    if (data?.medicalHistory) {
      try {
        const formData = { ...defaultFormState };
        
        // Map context data to form fields here
        if (data.medicalHistory.pastMedicalHistory?.conditions) {
          formData.data.preExistingConditions = data.medicalHistory.pastMedicalHistory.conditions.map(c => ({
            condition: c.condition || '',
            status: 'active',
            diagnosisDate: c.diagnosisDate || '',
            details: c.treatment || ''
          }));
        }
        
        if (data.medicalHistory.injuryDetails) {
          formData.data.injury = {
            date: data.medicalHistory.injuryDetails.diagnosisDate || '',
            impactType: data.medicalHistory.injuryDetails.mechanism || '',
            circumstance: data.medicalHistory.injuryDetails.description || '',
            initialTreatment: data.medicalHistory.injuryDetails.initialTreatment || '',
            immediateSymptoms: Array.isArray(data.medicalHistory.injuryDetails.complications) ? 
              data.medicalHistory.injuryDetails.complications.join(', ') : '',
            time: '',
            position: ''
          };
        }
        
        // Set form data
        form.reset(formData);
        setDataLoaded(true);
      } catch (error) {
        console.error("Error mapping context data to form:", error);
      }
    }
  }, [data?.medicalHistory]);
  
  // Handle form submission
  const onSubmit = (formData) => {
    try {
      // Map form data to context structure
      const medicalHistoryData = {
        pastMedicalHistory: {
          conditions: formData.data.preExistingConditions.map(c => ({
            condition: c.condition,
            diagnosisDate: c.diagnosisDate,
            treatment: c.details
          })),
          allergies: []
        },
        injuryDetails: {
          diagnosisDate: formData.data.injury.date,
          mechanism: formData.data.injury.impactType,
          description: formData.data.injury.circumstance,
          initialTreatment: formData.data.injury.initialTreatment,
          complications: formData.data.injury.immediateSymptoms ? 
            formData.data.injury.immediateSymptoms.split(',').map(s => s.trim()) : []
        },
        treatmentHistory: {
          rehabilitationServices: formData.data.currentTreatments.map(t => ({
            type: t.type,
            provider: t.provider,
            frequency: t.frequency,
            startDate: t.startDate,
            notes: t.notes
          }))
        }
      };
      
      // Update context
      updateSection('medicalHistory', medicalHistoryData);
      alert('Medical History saved successfully!');
    } catch (error) {
      console.error("Error saving medical history:", error);
      alert('Error saving Medical History: ' + error.message);
    }
  };
  
  // Pre-existing conditions section
  const PreExistingConditionsSection = () => {
    const conditions = form.watch('data.preExistingConditions') || [];
    
    const addCondition = () => {
      try {
        const currentConditions = form.getValues('data.preExistingConditions') || [];
        form.setValue('data.preExistingConditions', [
          ...currentConditions,
          { condition: '', status: 'active', details: '', diagnosisDate: '' }
        ]);
      } catch (error) {
        console.error("Error adding condition:", error);
      }
    };
    
    const removeCondition = (index) => {
      try {
        const currentConditions = [...form.getValues('data.preExistingConditions')];
        currentConditions.splice(index, 1);
        form.setValue('data.preExistingConditions', currentConditions);
      } catch (error) {
        console.error("Error removing condition:", error);
      }
    };
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Pre-Existing Conditions</h3>
          <Button 
            type="button" 
            variant="outline" 
            onClick={addCondition}
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            Add Condition
          </Button>
        </div>

        {conditions.length === 0 && (
          <div className="text-center py-8 text-gray-500 border border-dashed rounded-md">
            No pre-existing conditions added. Click "Add Condition" to begin.
          </div>
        )}

        {conditions.map((_, index) => (
          <div 
            key={index} 
            className="border rounded-md p-4 space-y-4 relative"
          >
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => removeCondition(index)}
              className="absolute right-2 top-2 text-gray-500 hover:text-red-500"
              size="sm"
            >
              <MinusCircle className="h-4 w-4" />
            </Button>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Condition *</label>
                <input
                  {...form.register(`data.preExistingConditions.${index}.condition`)}
                  placeholder="Enter condition name"
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select 
                  {...form.register(`data.preExistingConditions.${index}.status`)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="managed">Managed</option>
                  <option value="active">Active</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Diagnosis Date</label>
                <input
                  {...form.register(`data.preExistingConditions.${index}.diagnosisDate`)}
                  type="date"
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Details</label>
              <textarea
                {...form.register(`data.preExistingConditions.${index}.details`)}
                placeholder="Add additional details about this condition"
                className="min-h-[80px] w-full p-2 border rounded-md"
              />
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  // Injury details section
  const InjuryDetailsSection = () => {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium mb-4">Injury Details</h3>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Date of Injury *</label>
            <input
              {...form.register('data.injury.date')}
              type="date"
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Time of Injury</label>
            <input
              {...form.register('data.injury.time')}
              type="time"
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Mechanism of Injury *</label>
            <input
              {...form.register('data.injury.impactType')}
              placeholder="Describe how the injury occurred (e.g., fall, collision)"
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Circumstances</label>
            <textarea
              {...form.register('data.injury.circumstance')}
              placeholder="Provide additional details about how the injury occurred"
              className="min-h-[100px] w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Immediate Symptoms *</label>
            <textarea
              {...form.register('data.injury.immediateSymptoms')}
              placeholder="Describe symptoms experienced immediately after injury"
              className="min-h-[100px] w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Initial Treatment</label>
            <textarea
              {...form.register('data.injury.initialTreatment')}
              placeholder="Describe any immediate medical attention or first aid received"
              className="min-h-[100px] w-full p-2 border rounded-md"
            />
          </div>
        </div>
      </div>
    );
  };
  
  // Treatment section
  const TreatmentSection = () => {
    const treatments = form.watch('data.currentTreatments') || [];
    
    const addTreatment = () => {
      try {
        const currentTreatments = form.getValues('data.currentTreatments') || [];
        form.setValue('data.currentTreatments', [
          ...currentTreatments,
          { type: '', provider: '', facility: '', startDate: '', frequency: '', status: 'ongoing', notes: '' }
        ]);
      } catch (error) {
        console.error("Error adding treatment:", error);
      }
    };
    
    const removeTreatment = (index) => {
      try {
        const currentTreatments = [...form.getValues('data.currentTreatments')];
        currentTreatments.splice(index, 1);
        form.setValue('data.currentTreatments', currentTreatments);
      } catch (error) {
        console.error("Error removing treatment:", error);
      }
    };
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Current Treatments</h3>
          <Button 
            type="button" 
            variant="outline" 
            onClick={addTreatment}
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            Add Treatment
          </Button>
        </div>

        {treatments.length === 0 && (
          <div className="text-center py-8 text-gray-500 border border-dashed rounded-md">
            No treatments added. Click "Add Treatment" to begin.
          </div>
        )}

        {treatments.map((_, index) => (
          <div 
            key={index} 
            className="border rounded-md p-4 space-y-4 relative"
          >
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => removeTreatment(index)}
              className="absolute right-2 top-2 text-gray-500 hover:text-red-500"
              size="sm"
            >
              <MinusCircle className="h-4 w-4" />
            </Button>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Treatment Type *</label>
                <input
                  {...form.register(`data.currentTreatments.${index}.type`)}
                  placeholder="E.g., Physical Therapy, Surgery"
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Provider</label>
                <input
                  {...form.register(`data.currentTreatments.${index}.provider`)}
                  placeholder="Name of healthcare provider"
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Facility</label>
                <input
                  {...form.register(`data.currentTreatments.${index}.facility`)}
                  placeholder="Name of hospital or clinic"
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  {...form.register(`data.currentTreatments.${index}.status`)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="planned">Planned</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <input
                  {...form.register(`data.currentTreatments.${index}.startDate`)}
                  type="date"
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Frequency</label>
                <input
                  {...form.register(`data.currentTreatments.${index}.frequency`)}
                  placeholder="E.g., Weekly, Monthly"
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea
                {...form.register(`data.currentTreatments.${index}.notes`)}
                placeholder="Additional details about this treatment"
                className="min-h-[80px] w-full p-2 border rounded-md"
              />
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  // Medications section
  const MedicationsSection = () => {
    const medications = form.watch('data.currentMedications') || [];
    
    const addMedication = () => {
      try {
        const currentMedications = form.getValues('data.currentMedications') || [];
        form.setValue('data.currentMedications', [
          ...currentMedications,
          { name: '', dosage: '', frequency: '', prescribedFor: '', prescribedBy: '', status: 'current' }
        ]);
      } catch (error) {
        console.error("Error adding medication:", error);
      }
    };
    
    const removeMedication = (index) => {
      try {
        const currentMedications = [...form.getValues('data.currentMedications')];
        currentMedications.splice(index, 1);
        form.setValue('data.currentMedications', currentMedications);
      } catch (error) {
        console.error("Error removing medication:", error);
      }
    };
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Current Medications</h3>
          <Button 
            type="button" 
            variant="outline" 
            onClick={addMedication}
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            Add Medication
          </Button>
        </div>

        {medications.length === 0 && (
          <div className="text-center py-8 text-gray-500 border border-dashed rounded-md">
            No medications added. Click "Add Medication" to begin.
          </div>
        )}

        {medications.map((_, index) => (
          <div 
            key={index} 
            className="border rounded-md p-4 space-y-4 relative"
          >
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => removeMedication(index)}
              className="absolute right-2 top-2 text-gray-500 hover:text-red-500"
              size="sm"
            >
              <MinusCircle className="h-4 w-4" />
            </Button>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Medication Name *</label>
                <input
                  {...form.register(`data.currentMedications.${index}.name`)}
                  placeholder="Enter medication name"
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Dosage</label>
                <input
                  {...form.register(`data.currentMedications.${index}.dosage`)}
                  placeholder="E.g., 10mg, 500mg"
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Frequency</label>
                <input
                  {...form.register(`data.currentMedications.${index}.frequency`)}
                  placeholder="E.g., Once daily, Twice daily"
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select 
                  {...form.register(`data.currentMedications.${index}.status`)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="current">Current</option>
                  <option value="discontinued">Discontinued</option>
                  <option value="as-needed">As Needed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Prescribed For</label>
                <input
                  {...form.register(`data.currentMedications.${index}.prescribedFor`)}
                  placeholder="Reason for prescription"
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Prescribed By</label>
                <input
                  {...form.register(`data.currentMedications.${index}.prescribedBy`)}
                  placeholder="Name of prescriber"
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
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
}