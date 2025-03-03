'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ActivityBlock } from './ActivityBlock';
import type { TypicalDay } from '../schema';

interface TimeBlockProps {
  title: string;
  period: 'morning' | 'afternoon' | 'evening' | 'night';
  timeframe: 'preAccident' | 'postAccident';
  icon: React.ReactNode;
}

export function TimeBlock({ title, period, timeframe, icon }: TimeBlockProps) {
  const { watch, setValue } = useFormContext<TypicalDay>();
  const activities = watch(`data.${timeframe}.dailyRoutine.${period}`) || [];

  const addActivity = () => {
    setValue(`data.${timeframe}.dailyRoutine.${period}`, [
      ...activities,
      { timeBlock: '', description: '', assistance: '', limitations: '' }
    ]);
  };

  const removeActivity = (index: number) => {
    const newActivities = activities.filter((_, i) => i !== index);
    setValue(`data.${timeframe}.dailyRoutine.${period}`, newActivities);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((_, index) => (
          <ActivityBlock
            key={index}
            period={period}
            timeframe={timeframe}
            index={index}
            onRemove={() => removeActivity(index)}
          />
        ))}

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={addActivity}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Activity
        </Button>
      </CardContent>
    </Card>
  );
}