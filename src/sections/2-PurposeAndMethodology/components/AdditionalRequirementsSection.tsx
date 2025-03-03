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
import { Checkbox } from '@/components/ui/checkbox';
import type { Purpose } from '../schema';

export function AdditionalRequirementsSection() {
  const { control } = useFormContext<Purpose>();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Add-on Assessments</h3>
        <p className="text-sm text-gray-500 mb-4">
          Select any additional assessment components needed beyond the core sections
        </p>
        
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={control}
            name="additionalRequirements.housekeepingCalc"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1">
                  <FormLabel className="text-sm font-medium">
                    Housekeeping Services Replacement Calculation
                  </FormLabel>
                  <FormDescription className="text-xs text-gray-500">
                    Detailed calculation of replacement costs for housekeeping services
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="additionalRequirements.amaGuides"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1">
                  <FormLabel className="text-sm font-medium">
                    AMA Guides Assessment
                  </FormLabel>
                  <FormDescription className="text-xs text-gray-500">
                    Assessment using American Medical Association Guides to the Evaluation of Permanent Impairment
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="border-t pt-6 mt-6">
        <h3 className="text-lg font-medium mb-4">Documentation & Reporting</h3>
        
        <div className="grid grid-cols-1 gap-6">
          <FormField
            control={control}
            name="additionalRequirements.docRequirements"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Documentation Requirements</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    id={field.name}
                    placeholder="Any specific documentation requirements..."
                    className="min-h-[80px] w-full p-2 border rounded-md"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="additionalRequirements.reportingPreferences"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Reporting Preferences</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    id={field.name}
                    placeholder="Specific format, structure, or content for reports..."
                    className="min-h-[80px] w-full p-2 border rounded-md"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="additionalRequirements.timelineRequirements"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Timeline Requirements</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    id={field.name}
                    placeholder="Specific deadlines or timeline requirements..."
                    className="min-h-[80px] w-full p-2 border rounded-md"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}