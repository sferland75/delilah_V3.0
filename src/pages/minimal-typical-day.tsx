'use client';

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';

// Simple component to demonstrate rendering
const MinimalTypicalDay = () => {
  const methods = useForm({
    defaultValues: {
      timeBlocks: {
        morning: [],
        afternoon: [],
        evening: [],
        night: []
      }
    }
  });

  const onSubmit = (data: any) => {
    console.log("Form submitted:", data);
    window.alert("Form data saved to console");
  };

  const addActivity = (timeBlock: string) => {
    const currentActivities = methods.getValues(`timeBlocks.${timeBlock}`) || [];
    methods.setValue(`timeBlocks.${timeBlock}`, [
      ...currentActivities, 
      { id: Date.now(), description: "", time: "" }
    ]);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Minimal Typical Day Component</h1>
      
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
          {/* Time Blocks */}
          {['morning', 'afternoon', 'evening', 'night'].map((timeBlock) => (
            <div key={timeBlock} className="border p-4 rounded-md">
              <h2 className="text-xl font-semibold capitalize mb-3">{timeBlock}</h2>
              
              {/* Activities */}
              {methods.watch(`timeBlocks.${timeBlock}`)?.map((activity: any, index: number) => (
                <div key={activity.id || index} className="mb-3 p-3 border rounded-md">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm mb-1">Time</label>
                      <input
                        type="text"
                        {...methods.register(`timeBlocks.${timeBlock}.${index}.time`)}
                        className="w-full border p-2 rounded"
                        placeholder="e.g., 8:00 AM"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Activity</label>
                      <input
                        type="text"
                        {...methods.register(`timeBlocks.${timeBlock}.${index}.description`)}
                        className="w-full border p-2 rounded"
                        placeholder="Describe the activity"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => addActivity(timeBlock)}
              >
                Add Activity
              </button>
            </div>
          ))}
          
          <div className="mt-6 flex justify-end">
            <button 
              type="submit" 
              className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Save
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default MinimalTypicalDay;