import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import { AssessmentProvider } from '@/contexts/AssessmentContext';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import dynamic from 'next/dynamic';
import Head from 'next/head';

// Dynamic import with fallback to SimpleTypicalDay if EnhancedTypicalDay fails
const EnhancedTypicalDay = dynamic(
  () => import('@/sections/6-TypicalDay/EnhancedTypicalDay').catch(() => {
    console.error('Failed to load EnhancedTypicalDay, falling back to SimpleTypicalDay');
    return import('@/sections/6-TypicalDay/SimpleTypicalDay');
  }),
  {
    loading: () => <div className="p-4 text-center">Loading Typical Day component...</div>,
    ssr: false
  }
);

const FallbackComponent = () => (
  <div className="p-6 border-2 border-orange-200 bg-orange-50 rounded-md">
    <h3 className="text-lg font-medium text-orange-800 mb-2">Component Loading Error</h3>
    <p className="text-orange-700">The Typical Day component could not be loaded properly.</p>
    <p className="text-orange-700 mt-2">You may try refreshing the page or checking the console for errors.</p>
  </div>
);

export default function TypicalDayPage() {
  return (
    <>
      <Head>
        <title>Typical Day Assessment | Delilah V3.0</title>
      </Head>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Typical Day</h1>
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
            The Typical Day section now supports both regular and irregular sleep schedules.
            This implementation uses a standard schema and improved UI components.
          </AlertDescription>
        </Alert>
        
        <Card className="mb-6 overflow-hidden">
          <AssessmentProvider>
            <ErrorBoundary fallback={<FallbackComponent />}>
              <EnhancedTypicalDay />
            </ErrorBoundary>
          </AssessmentProvider>
        </Card>
        
        <Toaster />
      </div>
    </>
  );
}