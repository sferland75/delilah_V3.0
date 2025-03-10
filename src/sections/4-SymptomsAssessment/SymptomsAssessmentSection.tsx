import React from 'react';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import dynamic from 'next/dynamic';

// Dynamic import with fallback
const SymptomsComponent = dynamic(
  () => import('./SimpleSymptomsAssessment'),
  {
    loading: () => <div className="p-4 text-center">Loading Symptoms Assessment section...</div>,
    ssr: false
  }
);

// Fallback component if loading fails
const FallbackComponent = () => (
  <div className="p-6 border-2 border-orange-200 bg-orange-50 rounded-md">
    <h3 className="text-lg font-medium text-orange-800 mb-2">Section Unavailable</h3>
    <p className="text-orange-700">
      The Symptoms Assessment section encountered an error and cannot be displayed.
    </p>
    <p className="text-orange-700 mt-2">
      Please try refreshing the page or contact technical support if the problem persists.
    </p>
  </div>
);

export function SymptomsAssessmentSection() {
  return (
    <ErrorBoundary fallback={<FallbackComponent />}>
      <SymptomsComponent />
    </ErrorBoundary>
  );
}

export default SymptomsAssessmentSection;