'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import type { Symptoms } from '../schema';

export function GeneralNotesSection() {
  const { control } = useFormContext<Symptoms>();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium mb-4">General Notes</h3>
      
      <FormField
        control={control}
        name="general.notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Additional Observations</FormLabel>
            <FormDescription className="text-xs text-gray-500 mb-2">
              Use this space to document any patterns, additional observations, or notes that don't fit into the other categories.
            </FormDescription>
            <FormControl>
              <Textarea
                {...field}
                id={field.name}
                placeholder="Document observations, patterns, or additional notes about symptoms..."
                className="min-h-[250px] w-full p-2 border rounded-md"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}