'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Form } from '@/components/ui/form';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon, Download, Upload } from 'lucide-react';
// Import the simplified component
import { SimplePreExisting } from './SimplePreExisting';
import { InjuryDetailsSection } from './InjuryDetailsSection';
import { TreatmentSection } from './TreatmentSection';
import { MedicationsSection } from './MedicationsSection';
import { medicalHistorySchema, defaultFormState } from '../original/schema';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import { useAssessment } from '@/contexts/AssessmentContext';
import { 
  mapContextToForm, 
  mapFormToContext,
  exportMedicalHistoryToJson,
  importMedicalHistoryFromJson
} from '@/services/medicalHistoryMapper';

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

export function MedicalHistoryIntegrated() {
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
                <SimplePreExisting />
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