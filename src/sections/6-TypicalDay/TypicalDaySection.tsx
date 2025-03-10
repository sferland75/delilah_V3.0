import React from 'react';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import dynamic from 'next/dynamic';

// Dynamic import for EnhancedTypicalDay with fallback
const EnhancedTypicalDay = dynamic(
  () => import('./EnhancedTypicalDay').catch(() => {
    console.error('Failed to load EnhancedTypicalDay, falling back to SimpleTypicalDay');
    return import('./SimpleTypicalDay');
  }),
  {
    loading: () => <div className="p-4 text-center">Loading Typical Day section...</div>,
    ssr: false
  }
);

// Fallback component if both enhanced and simple versions fail
const FallbackComponent = () => (
  <div className="p-6 border-2 border-orange-200 bg-orange-50 rounded-md">
    <h3 className="text-lg font-medium text-orange-800 mb-2">Section Unavailable</h3>
    <p className="text-orange-700">
      The Typical Day section encountered an error and cannot be displayed.
    </p>
    <p className="text-orange-700 mt-2">
      Please try another section or contact technical support if the problem persists.
    </p>
  </div>
);

export function TypicalDaySection() {
  return (
    <ErrorBoundary fallback={<FallbackComponent />}>
      <EnhancedTypicalDay />
    </ErrorBoundary>
  );
}

export default TypicalDaySection;