'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { SimpleActivity } from './SimpleActivity';
import { useWatch } from 'react-hook-form';
import type { TypicalDay } from '../schema';

interface TimeBlockProps {
  title: string;
  period: 'morning' | 'afternoon' | 'evening' | 'night';
  timeframe: 'preAccident' | 'postAccident';
  icon: React.ReactNode;
}

export function TimeBlock({ title, period, timeframe, icon }: TimeBlockProps) {
  const { getValues, setValue, control } = useFormContext<TypicalDay>();
  
  // Use watch to react to changes in the activities array
  const activities = useWatch({
    control,
    name: `data.${timeframe}.dailyRoutine.${period}`,
    defaultValue: []
  });
  
  // Add a new activity to the current time period
  const addActivity = () => {
    // Get current activities
    const currentActivities = getValues(`data.${timeframe}.dailyRoutine.${period}`) || [];
    
    // Create a new activity with default values
    const newActivity = { 
      timeBlock: '', 
      description: '', 
      assistance: timeframe === 'postAccident' ? '' : undefined, 
      limitations: timeframe === 'postAccident' ? '' : undefined 
    };
    
    // Update the form with the new activity added to the array
    setValue(`data.${timeframe}.dailyRoutine.${period}`, [
      ...currentActivities,
      newActivity
    ], { shouldDirty: true });
  };

  // Remove an activity at the specified index
  const removeActivity = (index: number) => {
    const currentActivities = getValues(`data.${timeframe}.dailyRoutine.${period}`) || [];
    const newActivities = currentActivities.filter((_, i) => i !== index);
    setValue(`data.${timeframe}.dailyRoutine.${period}`, newActivities, { shouldDirty: true });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          {icon}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities && activities.length > 0 ? (
          activities.map((_, index) => (
            <SimpleActivity
              key={`${timeframe}-${period}-${index}`}
              period={period}
              timeframe={timeframe}
              index={index}
              onRemove={() => removeActivity(index)}
            />
          ))
        ) : (
          <p className="text-gray-500 italic text-center py-6">
            No activities added yet. Click "Add Activity" to start documenting the routine.
          </p>
        )}

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={addActivity}
          data-testid={`add-${timeframe}-${period}-activity`}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Activity
        </Button>
      </CardContent>
    </Card>
  );
}