'use client';

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useAssessment } from '@/contexts/AssessmentContext';

// A very simplified version of the Typical Day component
export function SimpleTypicalDay() {
  const [activeTab, setActiveTab] = useState('preAccident');
  const { updateSection } = useAssessment();
  
  // Simple form with minimal schema
  const methods = useForm({
    defaultValues: {
      preAccident: {
        morning: [],
        afternoon: [],
        evening: [],
        night: []
      },
      postAccident: {
        morning: [],
        afternoon: [],
        evening: [], 
        night: []
      }
    }
  });
  
  const onSubmit = (data) => {
    console.log('Form submitted:', data);
    
    // Map form data to context format
    const contextData = {
      preAccident: {
        dailyRoutine: {
          morningActivities: formatActivitiesToText(data.preAccident.morning),
          afternoonActivities: formatActivitiesToText(data.preAccident.afternoon),
          eveningActivities: formatActivitiesToText(data.preAccident.evening),
          nightActivities: formatActivitiesToText(data.preAccident.night)
        }
      },
      postAccident: {
        dailyRoutine: {
          morningActivities: formatActivitiesToText(data.postAccident.morning),
          afternoonActivities: formatActivitiesToText(data.postAccident.afternoon),
          eveningActivities: formatActivitiesToText(data.postAccident.evening),
          nightActivities: formatActivitiesToText(data.postAccident.night)
        }
      }
    };
    
    // Update context
    updateSection('typicalDay', contextData);
    alert('Typical day information saved!');
  };
  
  // Helper function to convert activity array to text
  const formatActivitiesToText = (activities) => {
    if (!activities || activities.length === 0) return '';
    
    return activities.map(activity => {
      let text = '';
      if (activity.timeBlock) text += `${activity.timeBlock}: `;
      text += activity.description || '';
      return text;
    }).join('\n');
  };
  
  // Add a new activity to a specific time period
  const addActivity = (timeframe, period) => {
    const currentActivities = methods.getValues(`${timeframe}.${period}`) || [];
    methods.setValue(`${timeframe}.${period}`, [
      ...currentActivities,
      { timeBlock: '', description: '' }
    ], { shouldDirty: true });
  };
  
  // Render a time block section (morning, afternoon, etc.)
  const renderTimeBlock = (title, period, timeframe) => {
    const activities = methods.watch(`${timeframe}.${period}`) || [];
    
    return (
      <div className="border p-4 rounded-md mb-4">
        <h3 className="font-medium text-lg mb-2 capitalize">{title}</h3>
        
        {activities.map((_, index) => (
          <div key={index} className="mb-3 p-3 border rounded-md">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1">Time</label>
                <input
                  type="text"
                  {...methods.register(`${timeframe}.${period}.${index}.timeBlock`)}
                  className="w-full border p-2 rounded"
                  placeholder="e.g., 8:00 AM"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Activity</label>
                <input
                  type="text"
                  {...methods.register(`${timeframe}.${period}.${index}.description`)}
                  className="w-full border p-2 rounded"
                  placeholder="Describe the activity"
                />
              </div>
            </div>
          </div>
        ))}
        
        <button
          type="button"
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
          onClick={() => addActivity(timeframe, period)}
        >
          Add Activity
        </button>
      </div>
    );
  };
  
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Typical Day</h2>
      
      {/* Simple tabs */}
      <div className="mb-6 border-b">
        <div className="flex">
          <button
            className={`px-4 py-2 ${activeTab === 'preAccident' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
            onClick={() => setActiveTab('preAccident')}
            type="button"
          >
            Pre-Accident
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'postAccident' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
            onClick={() => setActiveTab('postAccident')}
            type="button"
          >
            Post-Accident
          </button>
        </div>
      </div>
      
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className={activeTab === 'preAccident' ? 'block' : 'hidden'}>
            <h3 className="text-lg font-medium mb-3">Pre-Accident Daily Activities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderTimeBlock('Morning', 'morning', 'preAccident')}
              {renderTimeBlock('Afternoon', 'afternoon', 'preAccident')}
              {renderTimeBlock('Evening', 'evening', 'preAccident')}
              {renderTimeBlock('Night', 'night', 'preAccident')}
            </div>
          </div>
          
          <div className={activeTab === 'postAccident' ? 'block' : 'hidden'}>
            <h3 className="text-lg font-medium mb-3">Post-Accident Daily Activities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderTimeBlock('Morning', 'morning', 'postAccident')}
              {renderTimeBlock('Afternoon', 'afternoon', 'postAccident')}
              {renderTimeBlock('Evening', 'evening', 'postAccident')}
              {renderTimeBlock('Night', 'night', 'postAccident')}
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button 
              type="submit" 
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

export default SimpleTypicalDay;