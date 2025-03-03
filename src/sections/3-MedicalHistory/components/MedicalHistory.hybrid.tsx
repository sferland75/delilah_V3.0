'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import { useAssessment } from '@/contexts/AssessmentContext';
import { PreExistingConditionsSection } from './PreExistingConditionsSection';
import { MedicationsSection } from './MedicationsSection';
import { SimpleInjuryDetails } from './SimpleInjuryDetails';
import { SimpleTreatment } from './SimpleTreatment';

// A hybrid component that uses both original and simplified components
export function MedicalHistoryHybrid() {
  const { data } = useAssessment();
  const [activeTab, setActiveTab] = useState('preExisting');

  const handleTabClick = (tab) => {
    console.log(`Tab clicked: ${tab}`);
    setActiveTab(tab);
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-slate-800">Medical History</h2>
        <p className="text-sm text-muted-foreground mt-1">Pre-existing conditions, injury details, and current treatments</p>
      </div>
      
      <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
        <InfoIcon className="h-4 w-4 text-green-800" />
        <AlertTitle>Hybrid Mode Active</AlertTitle>
        <AlertDescription>
          Using simplified components for Injury Details and Treatment tabs.
        </AlertDescription>
      </Alert>
      
      <Tabs defaultValue="preExisting" className="w-full border rounded-md">
        <TabsList className="grid w-full grid-cols-4 p-0 h-auto border-b">
          <TabsTrigger 
            className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
            value="preExisting"
            onClick={() => console.log("Pre-Existing tab clicked")}
          >
            Pre-Existing
          </TabsTrigger>
          <TabsTrigger 
            className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
            value="injury"
            onClick={() => console.log("Injury Details tab clicked")}
          >
            Injury Details
          </TabsTrigger>
          <TabsTrigger 
            className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
            value="treatment"
            onClick={() => console.log("Treatment tab clicked")}
          >
            Treatment
          </TabsTrigger>
          <TabsTrigger 
            className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
            value="medications"
            onClick={() => console.log("Medications tab clicked")}
          >
            Medications
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="preExisting" className="p-6">
          <PreExistingConditionsSection />
        </TabsContent>
        
        <TabsContent value="injury" className="p-6">
          <SimpleInjuryDetails />
        </TabsContent>
        
        <TabsContent value="treatment" className="p-6">
          <SimpleTreatment />
        </TabsContent>
        
        <TabsContent value="medications" className="p-6">
          <MedicationsSection />
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end space-x-2 mt-4">
        <Button variant="outline" type="button">
          Reset
        </Button>
        <Button type="button">
          Save Medical History
        </Button>
      </div>
    </div>
  );
}