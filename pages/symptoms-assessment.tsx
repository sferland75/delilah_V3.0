import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import { AssessmentProvider } from '@/contexts/AssessmentContext';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import Head from 'next/head';

// Import directly from the pages/direct-components directory
import AdvancedSymptomsComponent from './direct-components/AdvancedSymptomsComponent';

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
        <title>Advanced Symptoms Assessment | Delilah V3.0</title>
      </Head>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Advanced Symptoms Assessment</h1>
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
          <AlertTitle className="text-blue-800">Advanced Assessment</AlertTitle>
          <AlertDescription className="text-blue-700">
            This is the advanced version of the Symptoms Assessment with comprehensive features.
            Use the tabs to navigate between physical, cognitive, and emotional symptoms.
          </AlertDescription>
        </Alert>
        
        <Card className="mb-6 overflow-hidden">
          <AssessmentProvider>
            <ErrorBoundary fallback={<FallbackComponent />}>
              <AdvancedSymptomsComponent />
            </ErrorBoundary>
          </AssessmentProvider>
        </Card>
        
        <Toaster />
      </div>
    </>
  );
}