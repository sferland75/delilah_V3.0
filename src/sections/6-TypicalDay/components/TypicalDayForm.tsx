import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TypicalDayFormData } from '../types';
import { SleepScheduleForm } from './SleepScheduleForm';
import { RoutineForm } from './RoutineForm';

export const TypicalDayForm = () => {
  const { register, formState: { errors }, watch, setValue } = useFormContext<TypicalDayFormData>();
  const activeTab = watch('config.activeTab') || 'preAccident';

  const handleTabChange = (value: string) => {
    setValue('config.activeTab', value);
  };

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full border rounded-md">
        <TabsList className="grid w-full grid-cols-2 p-0 h-auto border-b">
          <TabsTrigger 
            className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
            value="preAccident"
            data-testid="pre-accident-tab"
          >
            Pre-Accident Routine
          </TabsTrigger>
          <TabsTrigger 
            className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
            value="postAccident"
            data-testid="post-accident-tab"
          >
            Post-Accident Routine
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preAccident" className="p-6" data-testid="preAccident-content">
          <div className="space-y-6">
            <div className="border rounded-md p-6">
              <h3 className="text-lg font-semibold mb-4">Sleep Schedule</h3>
              <SleepScheduleForm routineType="preAccident" />
            </div>
            
            <RoutineForm routineType="preAccident" />
          </div>
        </TabsContent>
        
        <TabsContent value="postAccident" className="p-6" data-testid="postAccident-content">
          <div className="space-y-6">
            <div className="border rounded-md p-6">
              <h3 className="text-lg font-semibold mb-4">Sleep Schedule</h3>
              <SleepScheduleForm routineType="postAccident" />
            </div>
            
            <RoutineForm routineType="postAccident" />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TypicalDayForm;