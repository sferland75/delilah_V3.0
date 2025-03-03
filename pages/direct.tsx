import React, { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import { ErrorBoundary } from '@/components/ui/error-boundary/error-boundary';

// Use dynamic imports with named exports
const SymptomsAssessment = dynamic(() => 
  import('@/sections/4-SymptomsAssessment/components/SymptomsAssessment.integrated').then(mod => ({ default: mod.SymptomsAssessmentIntegrated })),
  {
    loading: () => <p>Loading Symptoms Assessment...</p>,
    ssr: false
  }
);

const MedicalHistory = dynamic(() => 
  import('@/sections/3-MedicalHistory/components/MedicalHistory.integrated').then(mod => ({ default: mod.MedicalHistoryIntegrated })),
  {
    loading: () => <p>Loading Medical History...</p>,
    ssr: false
  }
);

const TypicalDay = dynamic(() => 
  import('@/sections/6-TypicalDay/components/TypicalDay.integrated').then(mod => ({ default: mod.TypicalDayIntegrated })),
  {
    loading: () => <p>Loading Typical Day...</p>,
    ssr: false
  }
);

export default function DirectAccess() {
  const [activeTab, setActiveTab] = useState('symptoms');
  
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Direct Component Access</h1>
        <Link href="/">
          <Button variant="outline">Return to Home</Button>
        </Link>
      </div>
      
      <Alert className="mb-6">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Dynamic Component Loading</AlertTitle>
        <AlertDescription>
          This page uses Next.js dynamic imports to load components. Select a tab to view that section.
        </AlertDescription>
      </Alert>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Assessment Sections</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 gap-2 mb-6">
              <TabsTrigger value="symptoms">4. Symptoms</TabsTrigger>
              <TabsTrigger value="medical">3. Medical History</TabsTrigger>
              <TabsTrigger value="typical-day">6. Typical Day</TabsTrigger>
            </TabsList>
            
            <TabsContent value="symptoms" className="pt-2">
              <ErrorBoundary>
                <div className="p-1 border border-blue-200 rounded-md">
                  <SymptomsAssessment />
                </div>
              </ErrorBoundary>
            </TabsContent>
            
            <TabsContent value="medical" className="pt-2">
              <ErrorBoundary>
                <div className="p-1 border border-blue-200 rounded-md">
                  <MedicalHistory />
                </div>
              </ErrorBoundary>
            </TabsContent>
            
            <TabsContent value="typical-day" className="pt-2">
              <ErrorBoundary>
                <div className="p-1 border border-blue-200 rounded-md">
                  <TypicalDay />
                </div>
              </ErrorBoundary>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}