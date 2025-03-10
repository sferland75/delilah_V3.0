'use client';

import React from 'react';
import { SimpleRangeOfMotion } from './SimpleRangeOfMotion.fixed';
import { ErrorBoundary } from "@/components/ui/error-boundary";

export function RangeOfMotion() {
  return (
    <ErrorBoundary>
      <SimpleRangeOfMotion />
    </ErrorBoundary>
  );
}

export default RangeOfMotion;