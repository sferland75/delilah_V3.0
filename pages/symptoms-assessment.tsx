import React from 'react';
import Link from 'next/link';
import { Card } from '../src/components/ui/card';
import { Button } from '../src/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '../src/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import { AssessmentProvider } from '../src/contexts/AssessmentContext';
import { Toaster } from '../src/components/ui/toaster';
import { ErrorBoundary } from '../src/components/ui/error-boundary';
import dynamic from 'next/dynamic';
import Head from 'next/head';

// Import directly from the pages/direct-components directory
import SymptomsComponent from './direct-components/SymptomsComponent';

const FallbackComponent = () => (
  <div className="p-6 border-2 border-orange-200 bg-orange-50 rounded-md">
    <h3 className="text-lg font-medium text-orange-800 mb-2">Component Loading Error</h3>
    <p className="text-orange-700">The Symptoms Assessment component could not be loaded properly.</p>
    <p className="text-orange-700 mt-2">You may try refreshing the page or checking the console for errors.</p>
  </div>
);

export default function SymptomsAssessmentPage() {
  return (
    <>
      <Head>
        <title>Symptoms Assessment | Delilah V3.0</title>
      </Head>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Symptoms Assessment</h1>
          <div className="flex space-x-2">
            <Link href="/full-assessment" passHref>
              <Button variant="outline">Full Assessment</Button>
            </Link>
            <Link href="/" passHref>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Dashboard</Button>
            </Link>
          </div>
        </div>
        
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <InfoIcon className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">Updated Section</AlertTitle>
          <AlertDescription className="text-blue-700">
            The Symptoms Assessment section has been improved for better stability.
            Use the tabs to navigate between different parts of the assessment.
          </AlertDescription>
        </Alert>
        
        <Card className="mb-6 overflow-hidden">
          <AssessmentProvider>
            <ErrorBoundary fallback={<FallbackComponent />}>
              <SymptomsComponent />
            </ErrorBoundary>
          </AssessmentProvider>
        </Card>
        
        <Toaster />
      </div>
    </>
  );
}