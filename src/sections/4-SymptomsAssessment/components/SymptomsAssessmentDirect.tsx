'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAssessment } from '@/contexts/AssessmentContext';

export function SymptomsAssessmentDirect() {
  const { data } = useAssessment();
  const [jsonDisplay, setJsonDisplay] = useState('');
  
  useEffect(() => {
    // Format the data as a nice JSON string for display
    try {
      setJsonDisplay(JSON.stringify(data?.symptomsAssessment || {}, null, 2));
    } catch (e) {
      setJsonDisplay(`Error formatting data: ${e}`);
    }
  }, [data]);
  
  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-slate-800">Symptoms Assessment - Direct Data Viewer</h2>
        <p className="text-sm text-muted-foreground mt-1">
          This component directly displays the data from the Assessment Context
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Raw symptomsAssessment Data from Context</CardTitle>
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
            <p className="font-semibold mb-2">Physical Symptoms:</p>
            <pre className="bg-gray-100 p-2 rounded-md text-xs">
              {JSON.stringify(data?.symptomsAssessment?.physicalSymptoms || [], null, 2)}
            </pre>
          </div>
          
          <div className="border p-4 rounded-md">
            <p className="font-semibold mb-2">Cognitive Symptoms:</p>
            <pre className="bg-gray-100 p-2 rounded-md text-xs">
              {JSON.stringify(data?.symptomsAssessment?.cognitiveSymptoms || [], null, 2)}
            </pre>
          </div>
          
          <div className="border p-4 rounded-md">
            <p className="font-semibold mb-2">Emotional Symptoms:</p>
            <pre className="bg-gray-100 p-2 rounded-md text-xs">
              {JSON.stringify(data?.symptomsAssessment?.emotionalSymptoms || [], null, 2)}
            </pre>
          </div>
          
          <div className="border p-4 rounded-md">
            <p className="font-semibold mb-2">Direct 'emotional' property check:</p>
            <pre className="bg-gray-100 p-2 rounded-md text-xs">
              {JSON.stringify(data?.symptomsAssessment?.emotional || "Not found", null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}