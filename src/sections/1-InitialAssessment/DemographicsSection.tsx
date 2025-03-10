import React from 'react';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import dynamic from 'next/dynamic';

// Dynamic import with fallback
const DynamicDemographics = dynamic(
  () => import('./SimpleDemographics'),
  {
    loading: () => <div className="p-4 text-center">Loading Demographics section...</div>,
    ssr: false
  }
);

// Fallback component if loading fails
const FallbackComponent = () => (
  <div className="p-6 border-2 border-orange-200 bg-orange-50 rounded-md">
    <h3 className="text-lg font-medium text-orange-800 mb-2">Section Unavailable</h3>
    <p className="text-orange-700">
      The Demographics section encountered an error and cannot be displayed.
    </p>
    <p className="text-orange-700 mt-2">
      Please try refreshing the page or contact technical support if the problem persists.
    </p>
  </div>
);

export function DemographicsSection() {
  return (
    <ErrorBoundary fallback={<FallbackComponent />}>
      <DynamicDemographics />
    </ErrorBoundary>
  );
}

export default DemographicsSection;