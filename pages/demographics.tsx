import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import { AssessmentProvider } from '@/contexts/AssessmentContext';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { SimpleDemographics } from '@/sections/1-InitialAssessment';

const FallbackComponent = () => (
  <div className="p-6 border-2 border-orange-200 bg-orange-50 rounded-md">
    <h3 className="text-lg font-medium text-orange-800 mb-2">Component Loading Error</h3>
    <p className="text-orange-700">The Demographics component could not be loaded properly.</p>
    <p className="text-orange-700 mt-2">You may try refreshing the page or checking the console for errors.</p>
  </div>
);

export default function DemographicsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Demographics</h1>
        <div className="flex space-x-2">
          <Link href="/full-assessment" passHref>
            <Button variant="outline">Full Assessment</Button>
          </Link>
          <Link href="/" passHref>
            <Button variant="outline">Return to Home</Button>
          </Link>
        </div>
      </div>
      
      <Alert className="mb-6 bg-blue-50 border-blue-200">
        <InfoIcon className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-800">Updated Section</AlertTitle>
        <AlertDescription className="text-blue-700">
          The Demographics section has been updated with improved validation and error handling.
          Information is automatically saved to the assessment record.
        </AlertDescription>
      </Alert>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Demographics Information</CardTitle>
        </CardHeader>
        <CardContent>
          <AssessmentProvider>
            <ErrorBoundary fallback={<FallbackComponent />}>
              <SimpleDemographics />
            </ErrorBoundary>
          </AssessmentProvider>
        </CardContent>
      </Card>
      
      <Toaster />
    </div>
  );
}