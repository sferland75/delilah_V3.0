import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import the enhanced symptoms components
import EnhancedPhysicalSymptoms from './EnhancedPhysicalSymptoms';
import EnhancedCognitiveSymptoms from './EnhancedCognitiveSymptoms';
import EnhancedEmotionalSymptoms from './EnhancedEmotionalSymptoms';

// Import the advanced symptoms assessment component
let SymptomsAssessmentIntegratedFinal;
try {
  const mod = require('@/sections/4-SymptomsAssessment/components/SymptomsAssessment.integrated.final.tsx');
  SymptomsAssessmentIntegratedFinal = mod.SymptomsAssessmentIntegratedFinal;
} catch (error) {
  console.error("Failed to load SymptomsAssessmentIntegratedFinal:", error);
  SymptomsAssessmentIntegratedFinal = () => (
    <div className="p-6 border-2 border-orange-200 bg-orange-50 rounded-md">
      <h3 className="text-lg font-medium text-orange-800 mb-2">Component Loading Error</h3>
      <p className="text-orange-700">The advanced Symptoms Assessment component could not be loaded.</p>
    </div>
  );
}

// Fallback component in case the section fails to load
const FallbackComponent = () => (
  <div className="p-6 border-2 border-orange-200 bg-orange-50 rounded-md">
    <h3 className="text-lg font-medium text-orange-800 mb-2">Component Loading Error</h3>
    <p className="text-orange-700">The Symptoms Assessment component could not be loaded properly.</p>
    <p className="text-orange-700 mt-2">You may try refreshing the page or checking the console for errors.</p>
  </div>
);

export default function AdvancedSymptomsComponent() {
  // Initialize formData from localStorage if available
  const [formData, setFormData] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('symptomsFormData');
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          console.log("Loaded symptoms data from localStorage:", parsedData);
          return parsedData;
        } catch (error) {
          console.error("Error parsing saved symptoms data:", error);
          return {
            physical: { symptoms: [] },
            cognitive: { symptoms: [] },
            emotional: { symptoms: [] }
          };
        }
      }
    }
    return {
      physical: { symptoms: [] },
      cognitive: { symptoms: [] },
      emotional: { symptoms: [] }
    };
  });

  // Save formData to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log("Saving symptoms data to localStorage:", formData);
      localStorage.setItem('symptomsFormData', JSON.stringify(formData));
    }
  }, [formData]);

  // Function to update form data for a specific section
  const updateFormData = (section, data) => {
    console.log(`Updating ${section} section with:`, data);
    setFormData(prevData => {
      const newData = {
        ...prevData,
        [section]: data
      };
      return newData;
    });
  };

  return (
    <div className="space-y-6">
      <Alert className="bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-800">Advanced Symptoms Assessment</AlertTitle>
        <AlertDescription className="text-blue-700">
          This comprehensive assessment allows you to document physical, cognitive, and emotional symptoms. 
          Select the appropriate tab to enter symptoms for each category.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="physical" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="physical">
            Physical Symptoms {formData.physical?.symptoms?.length > 0 && `(${formData.physical.symptoms.length})`}
          </TabsTrigger>
          <TabsTrigger value="cognitive">
            Cognitive Symptoms {formData.cognitive?.symptoms?.length > 0 && `(${formData.cognitive.symptoms.length})`}
          </TabsTrigger>
          <TabsTrigger value="emotional">
            Emotional Symptoms {formData.emotional?.symptoms?.length > 0 && `(${formData.emotional.symptoms.length})`}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="physical" className="mt-4">
          <ErrorBoundary fallback={<FallbackComponent />}>
            <EnhancedPhysicalSymptoms 
              formData={formData} 
              updateFormData={updateFormData} 
            />
          </ErrorBoundary>
        </TabsContent>
        
        <TabsContent value="cognitive" className="mt-4">
          <ErrorBoundary fallback={<FallbackComponent />}>
            <EnhancedCognitiveSymptoms 
              formData={formData} 
              updateFormData={updateFormData} 
            />
          </ErrorBoundary>
        </TabsContent>
        
        <TabsContent value="emotional" className="mt-4">
          <ErrorBoundary fallback={<FallbackComponent />}>
            <EnhancedEmotionalSymptoms 
              formData={formData} 
              updateFormData={updateFormData} 
            />
          </ErrorBoundary>
        </TabsContent>
      </Tabs>
    </div>
  );
} 