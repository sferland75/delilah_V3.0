'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

// The simplest possible component with no external dependencies
export function SymptomsAssessmentUltraSimple() {
  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-slate-800">Symptoms Assessment</h2>
        <p className="text-sm text-muted-foreground mt-1">Comprehensive evaluation of symptoms and their impact</p>
      </div>
      
      <Tabs defaultValue="physical" className="w-full border rounded-md">
        <TabsList className="grid w-full grid-cols-4 p-0 h-auto border-b">
          <TabsTrigger 
            className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
            value="physical"
          >
            Physical
          </TabsTrigger>
          <TabsTrigger 
            className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
            value="cognitive"
          >
            Cognitive
          </TabsTrigger>
          <TabsTrigger 
            className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
            value="emotional"
          >
            Emotional
          </TabsTrigger>
          <TabsTrigger 
            className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
            value="general"
          >
            General
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="physical" className="p-6">
          <Card>
            <CardContent className="pt-6">
              <p>Physical symptoms content placeholder</p>
              <p>Pain, mobility issues, and other physical symptoms.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cognitive" className="p-6">
          <Card>
            <CardContent className="pt-6">
              <p>Cognitive symptoms content placeholder</p>
              <p>Memory, concentration, processing, and other cognitive symptoms.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="emotional" className="p-6">
          <Card>
            <CardContent className="pt-6">
              <p>Emotional symptoms content placeholder</p>
              <p>Anxiety, depression, irritability, and other emotional symptoms.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="general" className="p-6">
          <Card>
            <CardContent className="pt-6">
              <p>General notes content placeholder</p>
              <p>Overall symptom patterns and additional notes.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}