import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import { AssessmentProvider } from '@/contexts/AssessmentContext';
import { Toaster } from '@/components/ui/toaster';
import Head from 'next/head';

// Import the Advanced Symptoms Component directly from pages/direct-components
import AdvancedSymptomsComponent from './direct-components/AdvancedSymptomsComponent';

// Fallback component in case the section fails to load
const FallbackComponent = () => (
  <div className="p-6 border-2 border-orange-200 bg-orange-50 rounded-md">
    <h3 className="text-lg font-medium text-orange-800 mb-2">Section Loading Error: Symptoms Assessment</h3>
    <p className="text-orange-700">This section encountered an error while loading.</p>
    <p className="mt-2 text-orange-600">Try accessing this section through the full assessment page instead.</p>
  </div>
);

export default function EmergencySymptoms() {
  return (
    <>
      <Head>
        <title>Advanced Symptoms Assessment | Delilah V3.0</title>
      </Head>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Advanced Symptoms Assessment</h1>
          <div className="flex space-x-2">
            <Link href="/full-assessment">
              <Button variant="outline">Full Assessment</Button>
            </Link>
            <Link href="/">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Return to Home</Button>
            </Link>
          </div>
        </div>
        
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <InfoIcon className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">Advanced Assessment</AlertTitle>
          <AlertDescription className="text-blue-700">
            You are viewing the advanced Symptoms Assessment section with comprehensive features.
            This section has been migrated to the pages directory structure.
          </AlertDescription>
        </Alert>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Advanced Symptoms Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <AssessmentProvider>
              <ErrorBoundary fallback={<FallbackComponent />}>
                <AdvancedSymptomsComponent />
              </ErrorBoundary>
            </AssessmentProvider>
          </CardContent>
        </Card>
        
        <Toaster />
      </div>
    </>
  );
}
