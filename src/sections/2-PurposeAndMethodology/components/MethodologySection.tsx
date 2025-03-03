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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import type { Purpose } from '../schema';

export function MethodologySection() {
  const { control, watch } = useFormContext<Purpose>();
  const interpreterRequired = watch('methodology.interpreterRequired');

  return (
    <div>
      <div className="grid grid-cols-2 gap-6 mb-6">
        <FormField
          control={control}
          name="methodology.assessmentType"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Assessment Type *</FormLabel>
              <Select 
                onValueChange={field.onChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger id={field.name} className="w-full p-2 border rounded-md">
                    <SelectValue placeholder="Select assessment type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="in-person">In-Person Assessment</SelectItem>
                  <SelectItem value="remote">Remote Assessment</SelectItem>
                  <SelectItem value="hybrid">Hybrid Assessment</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="methodology.expectedDuration"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Expected Duration *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="e.g., 2 hours, 3 sessions"
                  className="w-full p-2 border rounded-md"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="mb-6">
        <FormField
          control={control}
          name="methodology.assessmentLocation"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Assessment Location *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="Address or description of assessment location"
                  className="w-full p-2 border rounded-md"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="border-t pt-6 mb-6">
        <FormField
          control={control}
          name="methodology.interpreterRequired"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mb-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1">
                <FormLabel className="text-sm font-medium">
                  Interpreter Required
                </FormLabel>
                <FormDescription className="text-xs text-gray-500">
                  Is an interpreter needed for this assessment?
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>

      {interpreterRequired && (
        <div className="mb-6">
          <FormField
            control={control}
            name="methodology.interpreterDetails"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Interpreter Details</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    id={field.name}
                    placeholder="Language required, any specific dialect, etc."
                    className="min-h-[80px] w-full p-2 border rounded-md"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}

      <div>
        <FormField
          control={control}
          name="methodology.specialAccommodations"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Special Accommodations</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  id={field.name}
                  placeholder="Any special accommodations needed for this assessment..."
                  className="min-h-[80px] w-full p-2 border rounded-md"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}