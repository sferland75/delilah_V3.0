import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '../../../src/components/ui/form';
import { Textarea } from '../../../src/components/ui/textarea';
import type { Symptoms } from './schema';

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
            <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Notes</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                id={field.name}
                placeholder="Add any additional notes about the symptoms assessment here..."
                className="min-h-[200px] w-full p-2 border rounded-md"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="text-gray-700 text-sm mt-4">
        <p>
          Use this section to add any relevant information that doesn't fit in the other categories,
          such as patterns over time, changes in symptoms, or other contextual information.
        </p>
      </div>
    </div>
  );
}