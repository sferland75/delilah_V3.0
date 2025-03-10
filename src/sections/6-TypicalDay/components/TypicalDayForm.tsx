import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TypicalDayFormData } from '../types';
import { RoutineForm } from './RoutineForm';
import { Moon, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const TypicalDayForm: React.FC = () => {
  const { register, formState: { errors }, watch, setValue } = useFormContext<TypicalDayFormData>();
  const activeTab = watch('config.activeTab') || 'preAccident';
  const [showModal, setShowModal] = useState(false);

  const handleTabChange = (value: string) => {
    setValue('config.activeTab', value);
  };

  // Current active route's sleep schedule
  const currentPath = `typicalDay.${activeTab}.sleepSchedule`;
  const irregularDetails = watch(`${currentPath}.irregularScheduleDetails`) || '';
  const hasIrregularSchedule = irregularDetails.trim() !== '';
  
  // Handle irregular schedule button click
  const toggleIrregularSchedule = () => {
    if (!hasIrregularSchedule) {
      // Show prompt for details when enabling irregular schedule
      const details = window.prompt("Enter details about the irregular sleep schedule (shift work, varying patterns, etc.):");
      if (details) {
        setValue(`${currentPath}.irregularScheduleDetails`, details);
        // Clear regular schedule fields
        setValue(`${currentPath}.wakeTime`, '');
        setValue(`${currentPath}.bedTime`, '');
      }
    } else {
      // Clear irregular schedule details when disabling
      setValue(`${currentPath}.irregularScheduleDetails`, '');
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">Typical Day Information</h2>
      
      <div className="bg-blue-50 p-4 mb-6 rounded-lg border border-blue-200 flex items-center justify-between">
        <div>
          <p className="text-sm text-blue-700 mb-1">The sleep schedule feature has been enhanced!</p>
          <p className="text-sm text-blue-600">You can now document irregular sleep patterns like shift work.</p>
        </div>
        <Button 
          onClick={toggleIrregularSchedule}
          className={`px-4 py-2 rounded ${
            hasIrregularSchedule 
              ? 'bg-amber-500 hover:bg-amber-600 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <Moon className="h-4 w-4 mr-2" />
          {hasIrregularSchedule ? 'Change Irregular Sleep Details' : 'Add Irregular Sleep Schedule'}
        </Button>
      </div>
      
      {hasIrregularSchedule && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-amber-800 font-medium">Irregular Sleep Schedule:</h3>
              <p className="text-amber-700">{irregularDetails}</p>
              <button 
                onClick={toggleIrregularSchedule} 
                className="text-amber-600 hover:text-amber-800 text-sm underline mt-2"
              >
                Clear irregular schedule
              </button>
            </div>
          </div>
        </div>
      )}
      
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
            <RoutineForm routineType="preAccident" />
          </div>
        </TabsContent>
        
        <TabsContent value="postAccident" className="p-6" data-testid="postAccident-content">
          <div className="space-y-6">
            <RoutineForm routineType="postAccident" />
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-4 text-sm text-gray-500">
        <p>Complete both tabs to provide a comprehensive view of how the patient's daily routine has changed since the accident.</p>
      </div>
    </div>
  );
};

export default TypicalDayForm;