'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X } from 'lucide-react';
import type { TypicalDay } from '../schema';

interface ActivityBlockProps {
  period: 'morning' | 'afternoon' | 'evening' | 'night';
  timeframe: 'preAccident' | 'postAccident';
  index: number;
  onRemove: () => void;
}

export function ActivityBlock({ period, timeframe, index, onRemove }: ActivityBlockProps) {
  const { register, formState: { errors } } = useFormContext<TypicalDay>();
  const basePath = `data.${timeframe}.dailyRoutine.${period}.${index}`;
  
  return (
    <Card className="relative p-4">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute right-2 top-2"
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
      </Button>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Time</label>
          <Input 
            {...register(`${basePath}.timeBlock`)} 
            placeholder="e.g., 8:00 AM" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Activity</label>
          <Input 
            {...register(`${basePath}.description`)} 
            placeholder="Describe the activity" 
          />
        </div>

        {timeframe === 'postAccident' && (
          <>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Assistance Needed</label>
              <Textarea
                {...register(`${basePath}.assistance`)}
                placeholder="Describe any assistance required..."
                className="resize-none"
                rows={2}
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Limitations/Challenges</label>
              <Textarea
                {...register(`${basePath}.limitations`)}
                placeholder="Describe any limitations or challenges..."
                className="resize-none"
                rows={2}
              />
            </div>
          </>
        )}
      </div>
    </Card>
  );
}