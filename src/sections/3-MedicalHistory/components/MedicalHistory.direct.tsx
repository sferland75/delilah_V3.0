'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Form } from '@/components/ui/form';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon, Download, Upload, PlusCircle, MinusCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { medicalHistorySchema, defaultFormState } from '../original/schema';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import { useAssessment } from '@/contexts/AssessmentContext';
import { 
  mapContextToForm, 
  mapFormToContext,
  exportMedicalHistoryToJson,
  importMedicalHistoryFromJson
} from '@/services/medicalHistoryMapper';
import type { FormState } from '../original/types';

// Create initial form state outside component to prevent recreation on each render
const initialFormState = JSON.parse(JSON.stringify(defaultFormState));

// Properly initialize all required fields in the form to prevent null pointer issues
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
  initialTreatment: ''
};

// Initialize empty arrays for other sections
initialFormState.data.preExistingConditions = [];
initialFormState.data.surgeries = [];
initialFormState.data.currentMedications = [];
initialFormState.data.currentTreatments = [];

// Inline component definitions to avoid import issues
function PreExistingConditionsSectionDirect() {
  const { control, watch, setValue } = useForm<FormState>();
  
  const preExistingConditions = watch('data.preExistingConditions') || [];
  
  const addCondition = () => {
    setValue('data.preExistingConditions', [
      ...preExistingConditions,
      { condition: '', status: '', details: '', diagnosisDate: '' }
    ], { shouldValidate: true });
  };
  
  const removeCondition = (index: number) => {
    const updatedConditions = [...preExistingConditions];
    updatedConditions.splice(index, 1);
    setValue('data.preExistingConditions', updatedConditions, { shouldValidate: true });
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

      {preExistingConditions.length === 0 && (
        <div className="text-center py-8 text-gray-500 border border-dashed rounded-md">
          No pre-existing conditions added. Click "Add Condition" to begin.
        </div>
      )}

      {preExistingConditions.map((_, index) => (
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
            <FormField
              control={control}
              name={`data.preExistingConditions.${index}.condition`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Condition *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="Enter condition name"
                      className="w-full p-2 border rounded-md"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`data.preExistingConditions.${index}.status`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Status</FormLabel>
                  <Select 
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger id={field.name} className="w-full p-2 border rounded-md">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="managed">Managed</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`data.preExistingConditions.${index}.diagnosisDate`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Diagnosis Date</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id={field.name}
                      type="date"
                      className="w-full p-2 border rounded-md"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name={`data.preExistingConditions.${index}.details`}
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Details</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    id={field.name}
                    placeholder="Add additional details about this condition"
                    className="min-h-[80px] w-full p-2 border rounded-md"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ))}
    </div>
  );
}

function InjuryDetailsSectionDirect() {
  const { control } = useForm<FormState>();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium mb-4">Injury Details</h3>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <FormField
          control={control}
          name="data.injury.date"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Date of Injury *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  id={field.name}
                  type="date"
                  className="w-full p-2 border rounded-md"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="data.injury.time"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Time of Injury</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  id={field.name}
                  type="time"
                  className="w-full p-2 border rounded-md"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-6">
        <FormField
          control={control}
          name="data.injury.impactType"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Mechanism of Injury *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="Describe how the injury occurred (e.g., fall, collision)"
                  className="w-full p-2 border rounded-md"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="data.injury.circumstance"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Circumstances</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  id={field.name}
                  placeholder="Provide additional details about how the injury occurred"
                  className="min-h-[100px] w-full p-2 border rounded-md"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

function TreatmentSectionDirect() {
  const { control, watch, setValue } = useForm<FormState>();
  
  const currentTreatments = watch('data.currentTreatments') || [];
  
  const addTreatment = () => {
    setValue('data.currentTreatments', [
      ...currentTreatments,
      { type: '', provider: '', facility: '', status: '', notes: '', startDate: '', frequency: '' }
    ], { shouldValidate: true });
  };
  
  const removeTreatment = (index: number) => {
    const updatedTreatments = [...currentTreatments];
    updatedTreatments.splice(index, 1);
    setValue('data.currentTreatments', updatedTreatments, { shouldValidate: true });
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

      {currentTreatments.length === 0 && (
        <div className="text-center py-8 text-gray-500 border border-dashed rounded-md">
          No treatments added. Click "Add Treatment" to begin.
        </div>
      )}

      {currentTreatments.map((_, index) => (
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
            <FormField
              control={control}
              name={`data.currentTreatments.${index}.type`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Treatment Type *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="E.g., Physical Therapy, Surgery"
                      className="w-full p-2 border rounded-md"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`data.currentTreatments.${index}.provider`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Provider</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="Name of healthcare provider"
                      className="w-full p-2 border rounded-md"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function MedicationsSectionDirect() {
  const { control, watch, setValue } = useForm<FormState>();
  
  const currentMedications = watch('data.currentMedications') || [];
  
  const addMedication = () => {
    setValue('data.currentMedications', [
      ...currentMedications,
      { name: '', dosage: '', frequency: '', prescribedFor: '', prescribedBy: '', status: '' }
    ], { shouldValidate: true });
  };
  
  const removeMedication = (index: number) => {
    const updatedMedications = [...currentMedications];
    updatedMedications.splice(index, 1);
    setValue('data.currentMedications', updatedMedications, { shouldValidate: true });
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

      {currentMedications.length === 0 && (
        <div className="text-center py-8 text-gray-500 border border-dashed rounded-md">
          No medications added. Click "Add Medication" to begin.
        </div>
      )}

      {currentMedications.map((_, index) => (
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
            <FormField
              control={control}
              name={`data.currentMedications.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Medication Name *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="Enter medication name"
                      className="w-full p-2 border rounded-md"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`data.currentMedications.${index}.dosage`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Dosage</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="E.g., 10mg, 500mg"
                      className="w-full p-2 border rounded-md"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function MedicalHistoryDirect() {
  const { data, updateSection } = useAssessment();
  const [dataLoaded, setDataLoaded] = useState(false);
  const fileInputRef = useRef(null);
  const contextDataRef = useRef({});
  const initialLoadRef = useRef(false);
  
  // Define form with the schema
  const form = useForm({
    resolver: zodResolver(medicalHistorySchema),
    defaultValues: initialFormState,
    mode: "onChange"
  });
  
  // Map context data to form and update the form only once on initial load
  useEffect(() => {
    // Get the medical history data from context
    const medicalHistoryData = data?.medicalHistory || {};
    
    // Check if data has changed to avoid unnecessary re-renders
    const dataChanged = JSON.stringify(medicalHistoryData) !== JSON.stringify(contextDataRef.current);
    
    if (dataChanged && !initialLoadRef.current && Object.keys(medicalHistoryData).length > 0) {
      try {
        console.log("MedicalHistory - Context data detected, mapping to form");
        const { formData, hasData } = mapContextToForm(medicalHistoryData, initialFormState);
        form.reset(formData);
        setDataLoaded(hasData);
        
        // Update the ref to track the latest data
        contextDataRef.current = { ...medicalHistoryData };
        initialLoadRef.current = true;
      } catch (error) {
        console.error("MedicalHistory - Error updating form from context:", error);
      }
    } else if (!initialLoadRef.current) {
      console.log("MedicalHistory - No context data or empty object");
      // Still mark as initialized to prevent further checks
      initialLoadRef.current = true;
    }
  }, [data?.medicalHistory]); // Only depend on medical history changes
  
  // For form persistence
  const { persistForm } = useFormPersistence(form, 'medical-history');
  
  // Handle form submission
  const onSubmit = (formData) => {
    try {
      console.log('MedicalHistory - Form data being submitted:', formData);
      
      // Map form data to context structure
      const medicalHistoryData = mapFormToContext(formData, contextDataRef.current);
      
      // Update the context with the mapped data
      updateSection('medicalHistory', medicalHistoryData);
      
      // Update our reference to the data
      contextDataRef.current = { ...medicalHistoryData };
      
      // Also persist the form data
      persistForm(formData);
      
      // Show success message
      alert("Medical History saved successfully!");
      
    } catch (error) {
      console.error("MedicalHistory - Error preparing data for context update:", error);
      alert("Error saving Medical History. Please try again.");
    }
  };
  
  // Handle import from JSON
  const handleImportJson = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonString = e.target.result;
        const importedData = importMedicalHistoryFromJson(jsonString);
        if (importedData) {
          const { formData, hasData } = mapContextToForm(importedData, initialFormState);
          form.reset(formData);
          setDataLoaded(hasData);
          
          // Update context with imported data
          updateSection('medicalHistory', importedData);
          
          // Update our reference
          contextDataRef.current = { ...importedData };
          
          alert("Medical History data imported successfully!");
        }
      } catch (error) {
        console.error("Error importing JSON:", error);
        alert("Error importing JSON. Please check the file format.");
      }
    };
    reader.readAsText(file);
  };
  
  // Handle export of form data to a downloadable file
  const handleDownloadJson = () => {
    const formData = form.getValues();
    const contextFormattedData = mapFormToContext(formData, contextDataRef.current);
    const jsonString = exportMedicalHistoryToJson(contextFormattedData);
    
    // Create a blob and download link
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'medical_history_export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revoObjectURL(url);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">Medical History</h2>
          <p className="text-sm text-muted-foreground mt-1">Pre-existing conditions, injury details, and current treatments</p>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadJson}
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            Export JSON
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4" />
            Import JSON
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportJson}
            className="hidden"
          />
        </div>
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
                <PreExistingConditionsSectionDirect />
              </TabsContent>
              
              <TabsContent value="injury" className="p-6">
                <InjuryDetailsSectionDirect />
              </TabsContent>
              
              <TabsContent value="treatment" className="p-6">
                <TreatmentSectionDirect />
              </TabsContent>
              
              <TabsContent value="medications" className="p-6">
                <MedicationsSectionDirect />
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