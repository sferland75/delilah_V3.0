'use client';

import React from 'react';
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { SimpleADL } from './SimpleADL';

export function ActivitiesOfDailyLiving() {
  return (
    <ErrorBoundary>
      <SimpleADL />
    </ErrorBoundary>
  );
}

export default ActivitiesOfDailyLiving;