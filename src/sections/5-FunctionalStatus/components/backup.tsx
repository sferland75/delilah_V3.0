'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';

export function ROMBackup() {
  const form = useFormContext();
  
  if (!form) {
    return <div>Form context missing</div>;
  }
  
  return (
    <div className="p-4 border rounded-md">
      <h3 className="text-lg font-semibold mb-4">Range of Motion Assessment</h3>
      <p>This component has been temporarily simplified for debugging purposes.</p>
    </div>
  );
}

export default ROMBackup;