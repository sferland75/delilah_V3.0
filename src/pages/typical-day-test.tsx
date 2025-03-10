'use client';

import React from 'react';
import { AssessmentProvider } from '@/contexts/AssessmentContext';
import { TypicalDayIntegrated } from '@/sections/6-TypicalDay/components';

export default function TypicalDayTestPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Typical Day Component Test</h1>
      
      <AssessmentProvider>
        <div className="bg-white rounded-lg shadow-md">
          <TypicalDayIntegrated />
        </div>
      </AssessmentProvider>
    </div>
  );
}
