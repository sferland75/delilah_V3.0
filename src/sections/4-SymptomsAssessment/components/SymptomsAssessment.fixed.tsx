'use client';

import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAssessment } from '@/contexts/AssessmentContext';

export function SymptomsAssessmentFixedDirect() {
  const { data } = useAssessment();
  console.log("SIMPLIFIED Direct access check - Entire data object:", data);
  console.log("SIMPLIFIED Direct access check - Symptoms assessment data:", data.symptomsAssessment);
  
  // Log all keys to see structure
  if (data) {
    console.log("SIMPLIFIED Direct access check - All top-level keys:", Object.keys(data));
  }
  
  // If there's a nested symptomsAssessment object, check that too
  if (data && data.symptomsAssessment && typeof data.symptomsAssessment === 'object') {
    console.log("SIMPLIFIED Direct access check - symptomsAssessment keys:", Object.keys(data.symptomsAssessment));
    
    // Log crucial properties
    console.log("SIMPLIFIED Emotional symptoms direct:", data.symptomsAssessment.emotionalSymptoms);
    console.log("SIMPLIFIED Physical symptoms direct:", data.symptomsAssessment.physicalSymptoms);
    console.log("SIMPLIFIED Cognitive symptoms direct:", data.symptomsAssessment.cognitiveSymptoms);
    
    // Also check if there's an "emotional" property directly
    if ('emotional' in data.symptomsAssessment) {
      console.log("SIMPLIFIED Direct 'emotional' property:", data.symptomsAssessment.emotional);
    }
  }
  
  const [hasData, setHasData] = useState(false);
  
  useEffect(() => {
    // Simple check if we have usable data
    if (data && data.symptomsAssessment) {
      const { emotionalSymptoms, physicalSymptoms, cognitiveSymptoms } = data.symptomsAssessment;
      
      if (Array.isArray(emotionalSymptoms) || Array.isArray(physicalSymptoms) || Array.isArray(cognitiveSymptoms)) {
        console.log("SIMPLIFIED Got usable data!");
        setHasData(true);
      }
    }
  }, [data]);
  
  // Simple display
  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-semibold">Symptoms Assessment - Direct Data Display</h2>
      
      {hasData ? (
        <Alert className="bg-green-50 border-green-200">
          <AlertTitle className="text-green-800">Data Found!</AlertTitle>
          <AlertDescription className="text-green-700">
            Found Symptoms Assessment data in context. Check console for details.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertTitle className="text-amber-800">No Data Found</AlertTitle>
          <AlertDescription className="text-amber-700">
            No usable Symptoms Assessment data found in context. Check console for details.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="border rounded-md p-4">
        <h3 className="font-medium mb-2">Emotional Symptoms</h3>
        <pre className="bg-gray-100 p-2 rounded text-xs whitespace-pre-wrap">
          {data?.symptomsAssessment?.emotionalSymptoms ? 
            JSON.stringify(data.symptomsAssessment.emotionalSymptoms, null, 2) : 
            "No emotional symptoms found"}
        </pre>
      </div>
      
      <div className="border rounded-md p-4">
        <h3 className="font-medium mb-2">Physical Symptoms</h3>
        <pre className="bg-gray-100 p-2 rounded text-xs whitespace-pre-wrap">
          {data?.symptomsAssessment?.physicalSymptoms ? 
            JSON.stringify(data.symptomsAssessment.physicalSymptoms, null, 2) : 
            "No physical symptoms found"}
        </pre>
      </div>
      
      <div className="border rounded-md p-4">
        <h3 className="font-medium mb-2">Cognitive Symptoms</h3>
        <pre className="bg-gray-100 p-2 rounded text-xs whitespace-pre-wrap">
          {data?.symptomsAssessment?.cognitiveSymptoms ? 
            JSON.stringify(data.symptomsAssessment.cognitiveSymptoms, null, 2) : 
            "No cognitive symptoms found"}
        </pre>
      </div>
    </div>
  );
}