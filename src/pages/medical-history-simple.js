import React from 'react';
import { MedicalHistorySimplified } from '@/sections/3-MedicalHistory/components/MedicalHistory.simplified';
import { AssessmentProvider } from '@/contexts/AssessmentContext';

export default function MedicalHistorySimplePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <AssessmentProvider>
        <MedicalHistorySimplified />
      </AssessmentProvider>
    </div>
  );
}