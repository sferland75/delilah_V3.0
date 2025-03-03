import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ErrorBoundary } from '@/components/ui/error-boundary/error-boundary';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

// These direct imports will force the browser to load the actual components
import MHIntegrated from '@/sections/3-MedicalHistory/components/MedicalHistory.integrated.final.tsx';
import SAIntegrated from '@/sections/4-SymptomsAssessment/components/SymptomsAssessment.integrated.final.tsx';

export default function DirectSections() {
  const [activeTab, setActiveTab] = useState('symptoms');
  
  // These functions directly load the components to avoid any export issues
  const renderSymptomsAssessment = () => {
    return <SAIntegrated />;
  };
  
  const renderMedicalHistory = () => {
    return <MHIntegrated />;
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Direct Section Access</h1>
        <Link href="/">
          <Button variant="outline">Return to Home</Button>
        </Link>
      </div>
      
      <Alert className="mb-6">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Direct Component Loading</AlertTitle>
        <AlertDescription>
          This page directly loads the components, bypassing any export issues that might be occurring in the regular app routes.
        </AlertDescription>
      </Alert>
      
      <Card>
        <CardHeader>
          <CardTitle>Assessment Sections</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-6">
              <TabsTrigger value="symptoms">Symptoms Assessment</TabsTrigger>
              <TabsTrigger value="medical">Medical History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="symptoms">
              <ErrorBoundary>
                {renderSymptomsAssessment()}
              </ErrorBoundary>
            </TabsContent>
            
            <TabsContent value="medical">
              <ErrorBoundary>
                {renderMedicalHistory()}
              </ErrorBoundary>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}