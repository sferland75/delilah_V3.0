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
import { Textarea } from '@/components/ui/textarea';
import type { Symptoms } from '../schema';

export function GeneralNotesSection() {
  const { control } = useFormContext<Symptoms>();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">General Notes</h3>
      
      <FormField
        control={control}
        name="general.notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Additional Notes</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                id={field.name}
                placeholder="Add any additional information about symptoms, context, or other relevant details..."
                className="min-h-[200px] w-full p-2 border rounded-md"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}