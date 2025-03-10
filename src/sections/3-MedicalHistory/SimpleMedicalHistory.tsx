'use client';

import React, { useState, useEffect } from 'react';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAssessment } from '@/contexts/AssessmentContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { medicalHistorySchema, defaultFormState } from './schema';

export function SimpleMedicalHistory() {
  const { data, updateSection, saveCurrentAssessment } = useAssessment();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Initialize form with schema validation
  const methods = useForm({
    resolver: zodResolver(medicalHistorySchema),
    defaultValues: defaultFormState
  });

  // Set up field arrays for dynamic data
  const conditionsArray = useFieldArray({
    control: methods.control,
    name: "preExistingConditions"
  });

  const treatmentsArray = useFieldArray({
    control: methods.control,
    name: "currentTreatments"
  });

  const medicationsArray = useFieldArray({
    control: methods.control,
    name: "currentMedications"
  });

  // Load data from context when available
  useEffect(() => {
    if (data?.medicalHistory) {
      try {
        console.log('Loading medical history data from context');
        const formValues = {
          preExistingConditions: data.medicalHistory.preExistingConditions || [],
          injury: data.medicalHistory.injury || defaultFormState.injury,
          currentTreatments: data.medicalHistory.currentTreatments || [],
          currentMedications: data.medicalHistory.currentMedications || []
        };
        methods.reset(formValues);
      } catch (error) {
        console.error('Error loading medical history data:', error);
        toast({
          title: 'Error loading data',
          description: 'There was a problem loading the medical history data.',
          variant: 'destructive',
        });
      }
    }
    setLoading(false);
  }, [data?.medicalHistory, methods]);

  const onSubmit = async (formData) => {
    try {
      setSaving(true);
      console.log('Form submitted:', formData);
      
      // Update context
      updateSection('medicalHistory', formData);
      
      // Save current assessment
      const success = saveCurrentAssessment();
      
      if (success) {
        toast({
          title: 'Saved successfully',
          description: 'Medical history information has been saved.',
        });
      } else {
        toast({
          title: 'Save failed',
          description: 'There was a problem saving the medical history information.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error saving medical history data:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while saving.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  // Add a new pre-existing condition
  const addCondition = () => {
    conditionsArray.append({
      condition: '',
      status: '',
      diagnosisDate: '',
      details: ''
    });
  };

  // Add a new treatment
  const addTreatment = () => {
    treatmentsArray.append({
      type: '',
      provider: '',
      facility: '',
      startDate: '',
      frequency: '',
      status: '',
      notes: ''
    });
  };

  // Add a new medication
  const addMedication = () => {
    medicationsArray.append({
      name: '',
      dosage: '',
      frequency: '',
      prescribedFor: '',
      prescribedBy: '',
      status: ''
    });
  };

  if (loading) {
    return <div className="p-4 text-center">Loading medical history data...</div>;
  }

  return (
    <ErrorBoundary>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Medical History</h2>
        
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Tabs defaultValue="preExisting" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="preExisting">Pre-Existing Conditions</TabsTrigger>
                <TabsTrigger value="injury">Injury Details</TabsTrigger>
                <TabsTrigger value="treatments">Current Treatments</TabsTrigger>
                <TabsTrigger value="medications">Medications</TabsTrigger>
              </TabsList>
              
              <TabsContent value="preExisting" className="mt-4">
                <Card className="p-4">
                  <h3 className="text-lg font-medium mb-4">Pre-Existing Conditions</h3>
                  
                  {conditionsArray.fields.length === 0 && (
                    <div className="text-center text-gray-500 my-4">
                      No pre-existing conditions added. Click "Add Condition" below to add one.
                    </div>
                  )}
                  
                  {conditionsArray.fields.map((field, index) => (
                    <div key={field.id} className="mb-6 p-4 border rounded-md bg-gray-50">
                      <div className="flex justify-between mb-2">
                        <h4 className="font-medium">Condition #{index + 1}</h4>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => conditionsArray.remove(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`preExistingConditions.${index}.condition`}>
                            Condition Name*
                          </Label>
                          <Input
                            id={`preExistingConditions.${index}.condition`}
                            {...methods.register(`preExistingConditions.${index}.condition`)}
                            placeholder="e.g., Diabetes, Hypertension"
                          />
                          {methods.formState.errors.preExistingConditions?.[index]?.condition && (
                            <p className="text-red-500 text-sm mt-1">
                              {methods.formState.errors.preExistingConditions[index].condition.message}
                            </p>
                          )}
                        </div>
                        
                        <div>
                          <Label htmlFor={`preExistingConditions.${index}.status`}>
                            Current Status
                          </Label>
                          <Input
                            id={`preExistingConditions.${index}.status`}
                            {...methods.register(`preExistingConditions.${index}.status`)}
                            placeholder="e.g., Stable, Improving"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`preExistingConditions.${index}.diagnosisDate`}>
                            Diagnosis Date
                          </Label>
                          <Input
                            id={`preExistingConditions.${index}.diagnosisDate`}
                            type="date"
                            {...methods.register(`preExistingConditions.${index}.diagnosisDate`)}
                          />
                        </div>
                        
                        <div className="md:col-span-2">
                          <Label htmlFor={`preExistingConditions.${index}.details`}>
                            Additional Details
                          </Label>
                          <Textarea
                            id={`preExistingConditions.${index}.details`}
                            {...methods.register(`preExistingConditions.${index}.details`)}
                            placeholder="Any additional information about this condition"
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={addCondition}
                    className="mt-2"
                  >
                    Add Condition
                  </Button>
                </Card>
              </TabsContent>
              
              <TabsContent value="injury" className="mt-4">
                <Card className="p-4">
                  <h3 className="text-lg font-medium mb-4">Injury Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="injury.date">Date of Injury*</Label>
                      <Input
                        id="injury.date"
                        type="date"
                        {...methods.register('injury.date')}
                      />
                      {methods.formState.errors.injury?.date && (
                        <p className="text-red-500 text-sm mt-1">
                          {methods.formState.errors.injury.date.message}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="injury.time">Time of Injury</Label>
                      <Input
                        id="injury.time"
                        type="time"
                        {...methods.register('injury.time')}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="injury.position">Position/Location</Label>
                      <Input
                        id="injury.position"
                        {...methods.register('injury.position')}
                        placeholder="e.g., Vehicle driver's seat, At home"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="injury.impactType">Mechanism of Injury*</Label>
                      <Input
                        id="injury.impactType"
                        {...methods.register('injury.impactType')}
                        placeholder="e.g., Rear-end collision, Fall"
                      />
                      {methods.formState.errors.injury?.impactType && (
                        <p className="text-red-500 text-sm mt-1">
                          {methods.formState.errors.injury.impactType.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="md:col-span-2">
                      <Label htmlFor="injury.circumstance">Circumstances</Label>
                      <Textarea
                        id="injury.circumstance"
                        {...methods.register('injury.circumstance')}
                        placeholder="Describe what happened during the incident"
                        rows={3}
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <Label htmlFor="injury.immediateSymptoms">Immediate Symptoms*</Label>
                      <Textarea
                        id="injury.immediateSymptoms"
                        {...methods.register('injury.immediateSymptoms')}
                        placeholder="Describe the symptoms that appeared immediately after the injury"
                        rows={3}
                      />
                      {methods.formState.errors.injury?.immediateSymptoms && (
                        <p className="text-red-500 text-sm mt-1">
                          {methods.formState.errors.injury.immediateSymptoms.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="md:col-span-2">
                      <Label htmlFor="injury.initialTreatment">Initial Treatment</Label>
                      <Textarea
                        id="injury.initialTreatment"
                        {...methods.register('injury.initialTreatment')}
                        placeholder="Describe the initial treatment received after the injury"
                        rows={3}
                      />
                    </div>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="treatments" className="mt-4">
                <Card className="p-4">
                  <h3 className="text-lg font-medium mb-4">Current Treatments</h3>
                  
                  {treatmentsArray.fields.length === 0 && (
                    <div className="text-center text-gray-500 my-4">
                      No treatments added. Click "Add Treatment" below to add one.
                    </div>
                  )}
                  
                  {treatmentsArray.fields.map((field, index) => (
                    <div key={field.id} className="mb-6 p-4 border rounded-md bg-gray-50">
                      <div className="flex justify-between mb-2">
                        <h4 className="font-medium">Treatment #{index + 1}</h4>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => treatmentsArray.remove(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`currentTreatments.${index}.type`}>
                            Treatment Type*
                          </Label>
                          <Input
                            id={`currentTreatments.${index}.type`}
                            {...methods.register(`currentTreatments.${index}.type`)}
                            placeholder="e.g., Physiotherapy, Chiropractic"
                          />
                          {methods.formState.errors.currentTreatments?.[index]?.type && (
                            <p className="text-red-500 text-sm mt-1">
                              {methods.formState.errors.currentTreatments[index].type.message}
                            </p>
                          )}
                        </div>
                        
                        <div>
                          <Label htmlFor={`currentTreatments.${index}.provider`}>
                            Provider Name
                          </Label>
                          <Input
                            id={`currentTreatments.${index}.provider`}
                            {...methods.register(`currentTreatments.${index}.provider`)}
                            placeholder="Name of treating professional"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`currentTreatments.${index}.facility`}>
                            Facility
                          </Label>
                          <Input
                            id={`currentTreatments.${index}.facility`}
                            {...methods.register(`currentTreatments.${index}.facility`)}
                            placeholder="Name of clinic or facility"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`currentTreatments.${index}.startDate`}>
                            Start Date
                          </Label>
                          <Input
                            id={`currentTreatments.${index}.startDate`}
                            type="date"
                            {...methods.register(`currentTreatments.${index}.startDate`)}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`currentTreatments.${index}.frequency`}>
                            Frequency
                          </Label>
                          <Input
                            id={`currentTreatments.${index}.frequency`}
                            {...methods.register(`currentTreatments.${index}.frequency`)}
                            placeholder="e.g., Weekly, Twice monthly"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`currentTreatments.${index}.status`}>
                            Status
                          </Label>
                          <Input
                            id={`currentTreatments.${index}.status`}
                            {...methods.register(`currentTreatments.${index}.status`)}
                            placeholder="e.g., Ongoing, Completed"
                          />
                        </div>
                        
                        <div className="md:col-span-2">
                          <Label htmlFor={`currentTreatments.${index}.notes`}>
                            Treatment Notes
                          </Label>
                          <Textarea
                            id={`currentTreatments.${index}.notes`}
                            {...methods.register(`currentTreatments.${index}.notes`)}
                            placeholder="Additional information about this treatment"
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={addTreatment}
                    className="mt-2"
                  >
                    Add Treatment
                  </Button>
                </Card>
              </TabsContent>
              
              <TabsContent value="medications" className="mt-4">
                <Card className="p-4">
                  <h3 className="text-lg font-medium mb-4">Current Medications</h3>
                  
                  {medicationsArray.fields.length === 0 && (
                    <div className="text-center text-gray-500 my-4">
                      No medications added. Click "Add Medication" below to add one.
                    </div>
                  )}
                  
                  {medicationsArray.fields.map((field, index) => (
                    <div key={field.id} className="mb-6 p-4 border rounded-md bg-gray-50">
                      <div className="flex justify-between mb-2">
                        <h4 className="font-medium">Medication #{index + 1}</h4>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => medicationsArray.remove(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`currentMedications.${index}.name`}>
                            Medication Name*
                          </Label>
                          <Input
                            id={`currentMedications.${index}.name`}
                            {...methods.register(`currentMedications.${index}.name`)}
                            placeholder="Medication name"
                          />
                          {methods.formState.errors.currentMedications?.[index]?.name && (
                            <p className="text-red-500 text-sm mt-1">
                              {methods.formState.errors.currentMedications[index].name.message}
                            </p>
                          )}
                        </div>
                        
                        <div>
                          <Label htmlFor={`currentMedications.${index}.dosage`}>
                            Dosage
                          </Label>
                          <Input
                            id={`currentMedications.${index}.dosage`}
                            {...methods.register(`currentMedications.${index}.dosage`)}
                            placeholder="e.g., 10mg, 50ml"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`currentMedications.${index}.frequency`}>
                            Frequency
                          </Label>
                          <Input
                            id={`currentMedications.${index}.frequency`}
                            {...methods.register(`currentMedications.${index}.frequency`)}
                            placeholder="e.g., Twice daily, As needed"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`currentMedications.${index}.prescribedFor`}>
                            Prescribed For
                          </Label>
                          <Input
                            id={`currentMedications.${index}.prescribedFor`}
                            {...methods.register(`currentMedications.${index}.prescribedFor`)}
                            placeholder="e.g., Pain, Inflammation"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`currentMedications.${index}.prescribedBy`}>
                            Prescribed By
                          </Label>
                          <Input
                            id={`currentMedications.${index}.prescribedBy`}
                            {...methods.register(`currentMedications.${index}.prescribedBy`)}
                            placeholder="Name of prescribing doctor"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`currentMedications.${index}.status`}>
                            Status
                          </Label>
                          <Input
                            id={`currentMedications.${index}.status`}
                            {...methods.register(`currentMedications.${index}.status`)}
                            placeholder="e.g., Current, Discontinued"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={addMedication}
                    className="mt-2"
                  >
                    Add Medication
                  </Button>
                </Card>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 flex justify-end">
              <Button 
                type="submit" 
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Medical History'}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </ErrorBoundary>
  );
}

export default SimpleMedicalHistory;