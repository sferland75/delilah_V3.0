'use client';

import React from 'react';
import { MedicalHistoryIntegrated } from '@/sections/3-MedicalHistory';
import TestMedicalHistoryData from '@/components/TestMedicalHistoryData';

export default function MedicalHistory() {
  return (
    <div className="w-full">
      <TestMedicalHistoryData />
      <MedicalHistoryIntegrated />
    </div>
  );
}