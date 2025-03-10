'use client';

import React from 'react';
import { ErrorBoundary } from "@/components/ui/error-boundary";
import ManualMuscleContent from './ManualMuscleContent';

export function ManualMuscle() {
  return (
    <ErrorBoundary>
      <ManualMuscleContent />
    </ErrorBoundary>
  );
}

export default ManualMuscle;