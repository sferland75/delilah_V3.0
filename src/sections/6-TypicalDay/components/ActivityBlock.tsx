'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
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
  const { control } = useFormContext<TypicalDay>();
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
        <FormField
          control={control}
          name={`${basePath}.timeBlock`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., 8:00 AM" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`${basePath}.description`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Activity</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Describe the activity" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`${basePath}.assistance`}
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Assistance Needed</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Describe any assistance required..."
                  className="resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`${basePath}.limitations`}
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Limitations/Challenges</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Describe any limitations or challenges..."
                  className="resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Card>
  );
}