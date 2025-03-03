'use client';

import React, { useEffect, useState } from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAssessment } from '@/contexts/AssessmentContext';

export function MedicalHistoryDirect() {
  const { data } = useAssessment();
  const [jsonDisplay, setJsonDisplay] = useState('');
  
  useEffect(() => {
    // Format the data as a nice JSON string for display
    try {
      setJsonDisplay(JSON.stringify(data?.medicalHistory || {}, null, 2));
    } catch (e) {
      setJsonDisplay(`Error formatting data: ${e}`);
    }
  }, [data]);
  
  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-slate-800">Medical History - Direct Data Viewer</h2>
        <p className="text-sm text-muted-foreground mt-1">
          This component directly displays the data from the Assessment Context
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Raw medicalHistory Data from Context</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-[600px] text-xs">
            {jsonDisplay || "No data found in context"}
          </pre>
        </CardContent>
      </Card>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Data Path Verification</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border p-4 rounded-md">
            <p className="font-semibold mb-2">Medical Conditions:</p>
            <pre className="bg-gray-100 p-2 rounded-md text-xs">
              {JSON.stringify(data?.medicalHistory?.pastMedicalHistory?.conditions || [], null, 2)}
            </pre>
          </div>
          
          <div className="border p-4 rounded-md">
            <p className="font-semibold mb-2">Surgeries:</p>
            <pre className="bg-gray-100 p-2 rounded-md text-xs">
              {JSON.stringify(data?.medicalHistory?.pastMedicalHistory?.surgeries || [], null, 2)}
            </pre>
          </div>
          
          <div className="border p-4 rounded-md">
            <p className="font-semibold mb-2">Allergies:</p>
            <pre className="bg-gray-100 p-2 rounded-md text-xs">
              {JSON.stringify(data?.medicalHistory?.pastMedicalHistory?.allergies || "", null, 2)}
            </pre>
          </div>
          
          <div className="border p-4 rounded-md">
            <p className="font-semibold mb-2">Medications:</p>
            <pre className="bg-gray-100 p-2 rounded-md text-xs">
              {JSON.stringify(data?.medicalHistory?.pastMedicalHistory?.medications || [], null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}