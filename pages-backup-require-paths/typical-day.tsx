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
    <h3 className="text-lg font-medium text-orange-800 mb-2">Section Loading Error: Typical Day</h3>
    <p className="text-orange-700">This section encountered an error while loading.</p>
    <p className="mt-2 text-orange-600">Try accessing this section through the full assessment page instead.</p>
  </div>
);

// Import the Typical Day component directly
let TypicalDayComponent;
try {
  // Import the fixed TypicalDay component
  const TypicalDayMod = require('../sections/6-TypicalDay/components/TypicalDay.integrated.final.tsx');
  TypicalDayComponent = TypicalDayMod.TypicalDayIntegratedFinal || TypicalDayMod.default;
} catch (error) {
  console.error("Failed to load TypicalDayComponent:", error);
  TypicalDayComponent = () => <FallbackComponent />;
}

export default function TypicalDayPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Typical Day</h1>
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
          You are viewing the Typical Day section directly. This section now uses the fixed component 
          that integrates with the assessment context properly.
        </AlertDescription>
      </Alert>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Typical Day</CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorBoundary>
            {TypicalDayComponent ? <TypicalDayComponent /> : <FallbackComponent />}
          </ErrorBoundary>
        </CardContent>
      </Card>
    </div>
  );
}
