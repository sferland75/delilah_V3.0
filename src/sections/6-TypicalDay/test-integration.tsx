'use client';

import React from 'react';
import { AssessmentProvider } from '@/contexts/AssessmentContext';
import { TypicalDayIntegrated } from './components/TypicalDay.integrated';

export default function TestIntegration() {
  return (
    <AssessmentProvider>
      <div className="p-6">
        <TypicalDayIntegrated />
      </div>
    </AssessmentProvider>
  );
}
