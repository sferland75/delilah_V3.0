import React from 'react';
import Link from 'next/link';
import { SymptomsAssessmentIntegrated } from '@/sections/4-SymptomsAssessment';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ErrorBoundary } from '@/components/ui/error-boundary/error-boundary';

// Simple wrapper that only loads the SymptomsAssessmentIntegrated component
export default function SymptomsFullPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Symptoms Assessment Full Form</h1>
        <Link href="/">
          <Button variant="outline">Return to Home</Button>
        </Link>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <ErrorBoundary>
            <SymptomsAssessmentIntegrated />
          </ErrorBoundary>
        </CardContent>
      </Card>
    </div>
  );
}