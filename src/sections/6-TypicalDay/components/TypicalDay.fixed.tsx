'use client';

import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Sun, Clock, Moon, History, History2, InfoIcon } from 'lucide-react';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import { useAssessment } from '@/contexts/AssessmentContext';
import { typicalDaySchema, defaultFormState } from '../schema';
import { TimeBlock } from './TimeBlock';
import type { TypicalDay as TypicalDayType } from '../schema';

export function TypicalDayFixedDirect() {
  const { data } = useAssessment();
  console.log("SIMPLIFIED Direct access check - Entire data object:", data);
  console.log("SIMPLIFIED Direct access check - Typical day data:", data.typicalDay);
  
  // Log all keys to see structure
  if (data) {
    console.log("SIMPLIFIED Direct access check - All top-level keys:", Object.keys(data));
  }
  
  // If there's a nested typicalDay object, check that too
  if (data && data.typicalDay && typeof data.typicalDay === 'object') {
    console.log("SIMPLIFIED Direct access check - typicalDay keys:", Object.keys(data.typicalDay));
    
    // Log crucial properties for morning routine
    console.log("SIMPLIFIED Morning routine direct:", data.typicalDay.morningRoutine);
    console.log("SIMPLIFIED Daytime activities direct:", data.typicalDay.daytimeActivities);
    console.log("SIMPLIFIED Evening routine direct:", data.typicalDay.eveningRoutine);
  }
  
  const [hasData, setHasData] = useState(false);
  
  useEffect(() => {
    // Simple check if we have usable data
    if (data && data.typicalDay) {
      const { morningRoutine, daytimeActivities, eveningRoutine } = data.typicalDay;
      
      if (morningRoutine || daytimeActivities || eveningRoutine) {
        console.log("SIMPLIFIED Got usable data!");
        setHasData(true);
      }
    }
  }, [data]);
  
  // Simple display
  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-semibold">Typical Day - Direct Data Display</h2>
      
      {hasData ? (
        <Alert className="bg-green-50 border-green-200">
          <AlertTitle className="text-green-800">Data Found!</AlertTitle>
          <AlertDescription className="text-green-700">
            Found Typical Day data in context. Check console for details.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertTitle className="text-amber-800">No Data Found</AlertTitle>
          <AlertDescription className="text-amber-700">
            No usable Typical Day data found in context. Check console for details.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="border rounded-md p-4">
        <h3 className="font-medium mb-2">Morning Routine</h3>
        <pre className="bg-gray-100 p-2 rounded text-xs whitespace-pre-wrap">
          {data?.typicalDay?.morningRoutine || "No data found"}
        </pre>
      </div>
      
      <div className="border rounded-md p-4">
        <h3 className="font-medium mb-2">Daytime Activities</h3>
        <pre className="bg-gray-100 p-2 rounded text-xs whitespace-pre-wrap">
          {data?.typicalDay?.daytimeActivities || "No data found"}
        </pre>
      </div>
      
      <div className="border rounded-md p-4">
        <h3 className="font-medium mb-2">Evening Routine</h3>
        <pre className="bg-gray-100 p-2 rounded text-xs whitespace-pre-wrap">
          {data?.typicalDay?.eveningRoutine || "No data found"}
        </pre>
      </div>
    </div>
  );
}