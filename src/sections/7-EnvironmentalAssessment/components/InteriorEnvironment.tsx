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
import { flooringTypes } from '../schema';
import type { FormState } from '../types';

export function InteriorEnvironment() {
  const { control } = useFormContext<FormState>();

  return (
    <div className="space-y-6">
      <div className="border rounded-md p-5">
        <h2 className="text-lg font-semibold mb-4">Interior Environment</h2>
        
        <div className="space-y-6">
          <div className="border rounded-md p-4">
            <h3 className="font-medium mb-4">Flooring</h3>
            <div className="space-y-4">
              <div>
                <FormLabel className="mb-2 block">Flooring Types</FormLabel>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {flooringTypes.map(floorType => (
                    <FormField
                      key={floorType}
                      control={control}
                      name="interiorEnvironment.flooring.types"
                      render={({ field }) => (
                        <FormItem key={floorType} className="flex flex-row items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(floorType)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...field.value, floorType]);
                                } else {
                                  field.onChange(field.value?.filter(value => value !== floorType));
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {floorType.charAt(0).toUpperCase() + floorType.slice(1).replace('_', ' ')}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>

              <FormField
                control={control}
                name="interiorEnvironment.flooring.concerns"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Flooring Concerns</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe any concerns related to flooring (e.g., slippery surfaces, trip hazards)"
                        className="min-h-[80px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-4">Lighting</h3>
              <div className="space-y-4">
                <FormField
                  control={control}
                  name="interiorEnvironment.lighting.isAdequate"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">Adequate Lighting</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="interiorEnvironment.lighting.concerns"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lighting Concerns</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe any concerns related to lighting"
                          className="min-h-[80px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-4">Temperature Control</h3>
              <div className="space-y-4">
                <FormField
                  control={control}
                  name="interiorEnvironment.temperature.isControlled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">Adequate Temperature Control</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="interiorEnvironment.temperature.concerns"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Temperature Concerns</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe any concerns related to temperature"
                          className="min-h-[80px] resize-none"
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

          <div className="border rounded-md p-4">
            <h3 className="font-medium mb-4">Noise</h3>
            <div className="space-y-4">
              <FormField
                control={control}
                name="interiorEnvironment.noise.isDisruptive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Disruptive Noise Present</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="interiorEnvironment.noise.concerns"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Noise Concerns</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe any concerns related to noise"
                        className="min-h-[80px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={control}
            name="interiorEnvironment.generalNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>General Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter any additional information about the interior environment"
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