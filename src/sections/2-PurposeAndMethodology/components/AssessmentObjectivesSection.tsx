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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { InfoIcon } from 'lucide-react';
import type { Purpose } from '../schema';

export function AssessmentObjectivesSection() {
  const { control } = useFormContext<Purpose>();

  const focusAreas = [
    { id: 'mobility', label: 'Mobility & Transfers' },
    { id: 'selfCare', label: 'Self-Care & ADLs' },
    { id: 'cognition', label: 'Cognition & Communication' },
    { id: 'pain', label: 'Pain Management' },
    { id: 'home', label: 'Home Accessibility' },
    { id: 'community', label: 'Community Integration' },
    { id: 'equipment', label: 'Assistive Equipment Needs' },
    { id: 'attendant', label: 'Attendant Care Requirements' },
  ];

  return (
    <div className="space-y-6">
      <Alert className="bg-blue-50 border-blue-200 text-blue-800">
        <InfoIcon className="h-4 w-4 text-blue-600" />
        <AlertDescription>
          All core assessment sections (1-9) will be completed as standard practice.
        </AlertDescription>
      </Alert>

      <div>
        <FormLabel className="text-sm font-medium">Primary Focus Areas *</FormLabel>
        <FormDescription className="text-xs text-gray-500 mt-1 mb-3">
          Select the primary areas of focus for this assessment
        </FormDescription>
        <div className="grid grid-cols-2 gap-3 mt-2">
          {focusAreas.map((area) => (
            <FormField
              key={area.id}
              control={control}
              name="assessmentObjectives.primaryFocus"
              render={({ field }) => (
                <FormItem 
                  key={area.id}
                  className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-3 border"
                >
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes(area.id)}
                      onCheckedChange={(checked) => {
                        const updatedValue = checked
                          ? [...field.value, area.id]
                          : field.value?.filter((value) => value !== area.id);
                        field.onChange(updatedValue);
                      }}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal cursor-pointer">
                    {area.label}
                  </FormLabel>
                </FormItem>
              )}
            />
          ))}
        </div>
        <FormField
          control={control}
          name="assessmentObjectives.primaryFocus"
          render={({ field }) => (
            <FormMessage />
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <FormField
          control={control}
          name="assessmentObjectives.concernAreas"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Specific Areas of Concern</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  id={field.name}
                  placeholder="Describe any specific areas of concern..."
                  className="min-h-[100px] w-full p-2 border rounded-md"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="assessmentObjectives.expectedOutcomes"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Expected Outcomes *</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  id={field.name}
                  placeholder="Describe the expected outcomes of this assessment..."
                  className="min-h-[100px] w-full p-2 border rounded-md"
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