'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

// The simplest possible component with no external dependencies
export function MedicalHistoryUltraSimple() {
  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-slate-800">Medical History</h2>
        <p className="text-sm text-muted-foreground mt-1">Pre-existing conditions, injury details, and current treatments</p>
      </div>
      
      <Tabs defaultValue="preExisting" className="w-full border rounded-md">
        <TabsList className="grid w-full grid-cols-4 p-0 h-auto border-b">
          <TabsTrigger 
            className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
            value="preExisting"
          >
            Pre-Existing
          </TabsTrigger>
          <TabsTrigger 
            className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
            value="injury"
          >
            Injury Details
          </TabsTrigger>
          <TabsTrigger 
            className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
            value="treatment"
          >
            Treatment
          </TabsTrigger>
          <TabsTrigger 
            className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
            value="medications"
          >
            Medications
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="preExisting" className="p-6">
          <Card>
            <CardContent className="pt-6">
              <p>Pre-existing conditions content placeholder</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="injury" className="p-6">
          <Card>
            <CardContent className="pt-6">
              <p>Injury details content placeholder</p>
              <p>Date, mechanism, and symptoms of injury.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="treatment" className="p-6">
          <Card>
            <CardContent className="pt-6">
              <p>Treatment content placeholder</p>
              <p>Current and past treatments for the injury.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="medications" className="p-6">
          <Card>
            <CardContent className="pt-6">
              <p>Medications content placeholder</p>
              <p>Current medications and dosages.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}