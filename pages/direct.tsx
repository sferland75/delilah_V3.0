import React, { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import { ErrorBoundary } from '@/components/ui/error-boundary/error-boundary';
import { AssessmentProvider } from '@/contexts/AssessmentContext';
import Head from 'next/head';

// Use dynamic imports with fallbacks
const SymptomsAssessment = dynamic(() => 
  import('@/sections/4-SymptomsAssessment').then(mod => mod.SymptomsAssessment).catch(() => {
    console.error('Failed to load SymptomsAssessment, falling back to SimpleSymptomsAssessment');
    return import('@/sections/4-SymptomsAssessment').then(mod => mod.SimpleSymptomsAssessment);
  }),
  {
    loading: () => <p>Loading Symptoms Assessment...</p>,
    ssr: false
  }
);

const MedicalHistory = dynamic(() => 
  import('@/sections/3-MedicalHistory').then(mod => mod.MedicalHistory).catch(() => {
    console.error('Failed to load MedicalHistory, falling back to SimpleMedicalHistory');
    return import('@/sections/3-MedicalHistory').then(mod => mod.SimpleMedicalHistory);
  }),
  {
    loading: () => <p>Loading Medical History...</p>,
    ssr: false
  }
);

const TypicalDay = dynamic(() => 
  import('@/sections/6-TypicalDay/EnhancedTypicalDay').catch(() => {
    console.error('Failed to load EnhancedTypicalDay, falling back to SimpleTypicalDay');
    return import('@/sections/6-TypicalDay/SimpleTypicalDay');
  }),
  {
    loading: () => <p>Loading Typical Day...</p>,
    ssr: false
  }
);

const FunctionalStatus = dynamic(() => 
  import('@/sections/5-FunctionalStatus/components/FunctionalStatus.redux').then(mod => mod.FunctionalStatusRedux),
  {
    loading: () => <p>Loading Functional Status...</p>,
    ssr: false
  }
);

export default function DirectAccess() {
  const [activeTab, setActiveTab] = useState('symptoms');
  
  return (
    <>
      <Head>
        <title>Direct Component Access | Delilah V3.0</title>
      </Head>
      <div className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Direct Component Access</h1>
          <Link href="/">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Return to Home</Button>
          </Link>
        </div>
        
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <InfoIcon className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">Enhanced Component Loading</AlertTitle>
          <AlertDescription className="text-blue-700">
            This page loads the fully enhanced components directly. Select a tab to view different assessment sections.
          </AlertDescription>
        </Alert>
        
        <Card className="mb-6 overflow-hidden">
          <CardHeader>
            <CardTitle>Assessment Sections</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-4 gap-2 p-4 bg-gray-50">
                <TabsTrigger value="symptoms" className={activeTab === 'symptoms' ? 'bg-blue-600 text-white' : ''}>Symptoms</TabsTrigger>
                <TabsTrigger value="medical" className={activeTab === 'medical' ? 'bg-blue-600 text-white' : ''}>Medical History</TabsTrigger>
                <TabsTrigger value="typical-day" className={activeTab === 'typical-day' ? 'bg-blue-600 text-white' : ''}>Typical Day</TabsTrigger>
                <TabsTrigger value="functional" className={activeTab === 'functional' ? 'bg-blue-600 text-white' : ''}>Functional Status</TabsTrigger>
              </TabsList>
              
              <AssessmentProvider>
                <TabsContent value="symptoms">
                  <ErrorBoundary fallback={<div className="p-6 bg-red-50 text-red-800 border border-red-200 rounded-md">Failed to load Symptoms Assessment</div>}>
                    <SymptomsAssessment />
                  </ErrorBoundary>
                </TabsContent>
                
                <TabsContent value="medical">
                  <ErrorBoundary fallback={<div className="p-6 bg-red-50 text-red-800 border border-red-200 rounded-md">Failed to load Medical History</div>}>
                    <MedicalHistory />
                  </ErrorBoundary>
                </TabsContent>
                
                <TabsContent value="typical-day">
                  <ErrorBoundary fallback={<div className="p-6 bg-red-50 text-red-800 border border-red-200 rounded-md">Failed to load Typical Day</div>}>
                    <TypicalDay />
                  </ErrorBoundary>
                </TabsContent>
                
                <TabsContent value="functional">
                  <ErrorBoundary fallback={<div className="p-6 bg-red-50 text-red-800 border border-red-200 rounded-md">Failed to load Functional Status</div>}>
                    <FunctionalStatus />
                  </ErrorBoundary>
                </TabsContent>
              </AssessmentProvider>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  );
}