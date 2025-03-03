import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RangeOfMotion } from './components/RangeOfMotion';
import { ManualMuscle } from './components/ManualMuscle'; 
import { BergBalance } from './components/BergBalance';
import { PosturalTolerances } from './components/PosturalTolerances';
import { TransfersAssessment } from './components/TransfersAssessment';
import { useFormContext } from 'react-hook-form';
import { FormState } from './types';

export function FunctionalStatus() {
  const { watch, setValue } = useFormContext<FormState>();
  const activeTab = watch('config.activeTab');

  const handleTabChange = (value: string) => {
    setValue('config.activeTab', value);
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-slate-800">Functional Status Assessment</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Comprehensive assessment of the client's physical function and mobility
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full border rounded-md">
        <TabsList className="grid w-full grid-cols-5 p-0 h-auto border-b">
          <TabsTrigger 
            className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
            value="rom"
          >
            Range of Motion
          </TabsTrigger>
          <TabsTrigger 
            className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
            value="mmt"
          >
            Manual Muscle
          </TabsTrigger>
          <TabsTrigger 
            className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
            value="berg"
          >
            Berg Balance
          </TabsTrigger>
          <TabsTrigger 
            className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
            value="postural"
          >
            Postural Tolerances
          </TabsTrigger>
          <TabsTrigger 
            className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
            value="transfers"
          >
            Transfers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rom" className="p-6">
          <RangeOfMotion />
        </TabsContent>
        
        <TabsContent value="mmt" className="p-6">
          <ManualMuscle />
        </TabsContent>
        
        <TabsContent value="berg" className="p-6">
          <BergBalance />
        </TabsContent>
        
        <TabsContent value="postural" className="p-6">
          <PosturalTolerances />
        </TabsContent>
        
        <TabsContent value="transfers" className="p-6">
          <TransfersAssessment />
        </TabsContent>
      </Tabs>
    </div>
  );
}