import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ErrorBoundary } from '@/components/ui/error-boundary/error-boundary';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

// Fallback component in case the section fails to load
const FallbackComponent = () => (
  <div className="p-6 border-2 border-orange-200 bg-orange-50 rounded-md">
    <h3 className="text-lg font-medium text-orange-800 mb-2">Section Loading Error: Medical History</h3>
    <p className="text-orange-700">This section encountered an error while loading.</p>
    <p className="mt-2 text-orange-600">Try accessing this section through the full assessment page instead.</p>
  </div>
);

// Import the Medical History component directly
let MedicalHistoryComponent;
try {
  // First try the integrated.final version
  try {
    const MedicalHistoryMod = require('../sections/3-MedicalHistory/components/MedicalHistory.integrated.final.tsx');
    MedicalHistoryComponent = MedicalHistoryMod.MedicalHistoryIntegratedFinal;
  } catch (e) {
    // If that fails, try alternate versions
    try {
      const MedicalHistoryMod = require('../sections/3-MedicalHistory/components/MedicalHistory.integrated.tsx');
      MedicalHistoryComponent = MedicalHistoryMod.MedicalHistoryIntegrated || MedicalHistoryMod.default;
    } catch (e2) {
      // If that fails, try the direct access version
      const MedicalHistoryMod = require('../sections/3-MedicalHistory/components/MedicalHistory.direct-access.tsx');
      MedicalHistoryComponent = MedicalHistoryMod.default || MedicalHistoryMod;
    }
  }
} catch (error) {
  console.error("Failed to load MedicalHistoryComponent:", error);
  MedicalHistoryComponent = () => <FallbackComponent />;
}

export default function MedicalHistoryPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Medical History</h1>
        <div className="flex space-x-2">
          <Link href="/full-assessment">
            <Button variant="outline">Full Assessment</Button>
          </Link>
          <Link href="/">
            <Button variant="outline">Return to Home</Button>
          </Link>
        </div>
      </div>
      
      <Alert className="mb-6 bg-blue-50 border-blue-200">
        <InfoIcon className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-800">Direct Section Access</AlertTitle>
        <AlertDescription className="text-blue-700">
          You are viewing the Medical History section directly. This section is fully integrated with 
          the assessment context and any changes will be saved.
        </AlertDescription>
      </Alert>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Medical History</CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorBoundary>
            {MedicalHistoryComponent ? <MedicalHistoryComponent /> : <FallbackComponent />}
          </ErrorBoundary>
        </CardContent>
      </Card>
    </div>
  );
}
