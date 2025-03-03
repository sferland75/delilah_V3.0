'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Form } from '@/components/ui/form';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useAssessment } from '@/contexts/AssessmentContext';

export function MedicalHistoryDebug() {
  const { data } = useAssessment();
  const contextData = data?.medicalHistory || {};
  
  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-slate-800">Medical History Data Debug</h2>
        <p className="text-sm text-muted-foreground mt-1">Raw data from AssessmentContext</p>
      </div>
      
      <Tabs defaultValue="raw" className="w-full border rounded-md">
        <TabsList className="grid w-full grid-cols-4 p-0 h-auto border-b">
          <TabsTrigger 
            className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
            value="raw"
          >
            Raw Data
          </TabsTrigger>
          <TabsTrigger 
            className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
            value="injury"
          >
            Injury Data
          </TabsTrigger>
          <TabsTrigger 
            className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
            value="treatment"
          >
            Treatment Data
          </TabsTrigger>
          <TabsTrigger 
            className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
            value="structure"
          >
            Data Structure
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="raw" className="p-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Raw Medical History Data</h3>
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-[500px] text-sm">
                {JSON.stringify(contextData, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="injury" className="p-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Injury Details Data</h3>
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-[500px] text-sm">
                {JSON.stringify(contextData.injuryDetails, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="treatment" className="p-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Treatment History Data</h3>
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-[500px] text-sm">
                {JSON.stringify(contextData.treatmentHistory, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="structure" className="p-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Expected Data Structure</h3>
              <p className="mb-4">For Injury Details Data:</p>
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-[200px] text-sm">
{`{
  "injuryDetails": {
    "diagnosisDate": "2023-08-15",
    "mechanism": "Motor vehicle accident",
    "description": "Rear-end collision at moderate speed",
    "initialTreatment": "Emergency department evaluation",
    "primaryDiagnosis": "Cervical strain",
    "secondaryDiagnoses": ["Lumbar strain", "Post-concussive syndrome"],
    "complications": ["Headache", "Nausea", "Dizziness"]
  }
}`}
              </pre>
              
              <p className="mt-6 mb-4">For Treatment History Data:</p>
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-[200px] text-sm">
{`{
  "treatmentHistory": {
    "hospitalizations": [
      {
        "facility": "Memorial Hospital",
        "admissionDate": "2023-08-15",
        "dischargeDate": "2023-08-17",
        "reason": "Initial evaluation post-MVA",
        "provider": "Dr. Smith"
      }
    ],
    "rehabilitationServices": [
      {
        "type": "Physical Therapy",
        "provider": "ABC Rehabilitation",
        "facility": "ABC Clinic Downtown",
        "frequency": "3x weekly",
        "startDate": "2023-08-22",
        "endDate": "2023-11-15",
        "goals": ["Improve cervical ROM", "Reduce pain"]
      }
    ]
  }
}`}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Alert className="mt-6 bg-amber-50 text-amber-800 border-amber-200">
        <InfoIcon className="h-4 w-4 text-amber-800" />
        <AlertTitle>Debug Component</AlertTitle>
        <AlertDescription>
          This is a debugging component to show the raw data available in the context. 
          Use this information to diagnose why data isn't showing in the form.
        </AlertDescription>
      </Alert>
    </div>
  );
}