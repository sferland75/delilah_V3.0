import React, { Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ErrorBoundary from '@/components/ErrorBoundary';

// Simplified version of the component
const SimpleFunctionalStatus = React.lazy(() => import('./SimpleFunctionalStatus'));

// Fallback component for error states
const FallbackComponent = () => (
  <div className="p-6 border-2 border-orange-200 bg-orange-50 rounded-md">
    <h3 className="text-lg font-medium text-orange-800 mb-2">Loading Error</h3>
    <p className="text-orange-700">The Functional Status section encountered an error while loading. Please try refreshing the page.</p>
  </div>
);

// Loading component
const LoadingComponent = () => (
  <div className="p-6">
    <div className="flex items-center justify-center h-40">
      <p className="text-muted-foreground">Loading Functional Status assessment...</p>
    </div>
  </div>
);

export function FunctionalStatusSection() {
  return (
    <Card className="mb-6">
      <CardContent className="p-0 sm:p-6">
        <ErrorBoundary fallback={<FallbackComponent />}>
          <Suspense fallback={<LoadingComponent />}>
            <SimpleFunctionalStatus />
          </Suspense>
        </ErrorBoundary>
      </CardContent>
    </Card>
  );
}

export default FunctionalStatusSection;