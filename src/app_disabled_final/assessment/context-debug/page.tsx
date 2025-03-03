'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAssessment } from '@/contexts/AssessmentContext';

export default function ContextDebugPage() {
  const { data } = useAssessment();
  const [jsonDisplay, setJsonDisplay] = useState('');
  
  useEffect(() => {
    // Format the data as a nice JSON string for display
    try {
      setJsonDisplay(JSON.stringify(data || {}, null, 2));
    } catch (e) {
      setJsonDisplay(`Error formatting data: ${e}`);
    }
  }, [data]);
  
  return (
    <div className="space-y-6 p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-slate-800">Assessment Context - Debug Viewer</h2>
        <p className="text-sm text-muted-foreground mt-1">
          This component displays the entire Assessment Context data structure
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Raw Assessment Context Data</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-[800px] text-xs">
            {jsonDisplay || "No data found in context"}
          </pre>
        </CardContent>
      </Card>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Available Sections</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.keys(data || {}).map(key => (
            <div key={key} className="border p-4 rounded-md">
              <p className="font-semibold">{key}</p>
              <p className="text-xs text-gray-500">
                {typeof data[key] === 'object' && data[key] !== null 
                  ? `${Object.keys(data[key]).length} properties` 
                  : typeof data[key]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}