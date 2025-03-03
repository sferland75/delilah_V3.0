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
import { Checkbox } from '@/components/ui/checkbox';
import { outdoorSpaceTypes } from '../schema';
import type { FormState } from '../types';

export function OutdoorAccess() {
  const { control, watch } = useFormContext<FormState>();
  const hasSpace = watch('outdoor.hasSpace');

  return (
    <div className="space-y-6">
      <div className="border rounded-md p-5">
        <h2 className="text-lg font-semibold mb-4">Outdoor Access</h2>
        
        <div className="space-y-6">
          <FormField
            control={control}
            name="outdoor.hasSpace"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">Has Outdoor Space</FormLabel>
              </FormItem>
            )}
          />

          {hasSpace && (
            <div className="border rounded-md p-4 space-y-4">
              <div>
                <FormLabel className="mb-2 block">Outdoor Space Types</FormLabel>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {outdoorSpaceTypes.map(spaceType => (
                    <FormField
                      key={spaceType}
                      control={control}
                      name="outdoor.types"
                      render={({ field }) => (
                        <FormItem key={spaceType} className="flex flex-row items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(spaceType)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...field.value, spaceType]);
                                } else {
                                  field.onChange(field.value?.filter(value => value !== spaceType));
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {spaceType.charAt(0).toUpperCase() + spaceType.slice(1).replace('_', ' ')}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>

              <FormField
                control={control}
                name="outdoor.access.isAccessible"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Outdoor space is accessible</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="outdoor.access.barriers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Access Barriers</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe any barriers to outdoor access"
                        className="min-h-[80px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="outdoor.access.recommendations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recommendations</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Recommend modifications for improved outdoor access"
                        className="min-h-[80px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          <FormField
            control={control}
            name="outdoor.generalNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>General Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter any additional information about outdoor access"
                    className="min-h-[100px] resize-none"
                    {...field}
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