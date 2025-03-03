'use client';

import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { safetyHazardTypes } from '../schema';
import type { FormState } from '../types';
import { PlusCircle, MinusCircle } from 'lucide-react';

export function SafetyAssessment() {
  const { control } = useFormContext<FormState>();
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "safety.hazards",
  });

  const riskLevels = ["Low", "Moderate", "High", "Critical"];

  const addNewHazard = () => {
    append({
      id: `hazard-${Date.now()}`,
      type: 'tripping',
      location: '',
      description: '',
      riskLevel: 'Moderate',
      mitigationPlan: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="border rounded-md p-5">
        <h2 className="text-lg font-semibold mb-5">Safety Assessment</h2>
        
        <div className="space-y-6">
          <div className="border rounded-md p-4">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-medium">Safety Hazards</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addNewHazard}
                className="flex items-center gap-1"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Add Hazard</span>
              </Button>
            </div>

            {fields.length === 0 ? (
              <div className="text-center p-6 border border-dashed rounded-md">
                <p className="text-muted-foreground">No safety hazards added yet. Click "Add Hazard" to begin.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {fields.map((field, index) => (
                  <div key={field.id} className="border rounded-md p-4">
                    <div className="flex justify-between items-center mb-5">
                      <h4 className="font-medium">Safety Hazard</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="h-8 w-8 p-0"
                      >
                        <MinusCircle className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
                      <FormField
                        control={control}
                        name={`safety.hazards.${index}.type`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block mb-2">Hazard Type</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {safetyHazardTypes.map(type => (
                                  <SelectItem key={type} value={type}>
                                    {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name={`safety.hazards.${index}.location`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block mb-2">Location</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Where is this hazard located?"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={control}
                      name={`safety.hazards.${index}.description`}
                      render={({ field }) => (
                        <FormItem className="mb-5">
                          <FormLabel className="block mb-2">Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe the safety hazard"
                              className="min-h-[80px] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
                      <FormField
                        control={control}
                        name={`safety.hazards.${index}.riskLevel`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block mb-2">Risk Level</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select risk level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {riskLevels.map(level => (
                                  <SelectItem key={level} value={level}>
                                    {level}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={control}
                      name={`safety.hazards.${index}.mitigationPlan`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block mb-2">Mitigation Plan</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe how this hazard can be mitigated"
                              className="min-h-[80px] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border rounded-md p-4">
            <h3 className="font-medium mb-5">Emergency Planning</h3>
            <div className="space-y-5">
              <FormField
                control={control}
                name="safety.emergencyPlan.exists"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Emergency plan exists</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="safety.emergencyPlan.isAdequate"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Emergency plan is adequate</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="safety.emergencyPlan.improvements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block mb-2">Recommended Improvements</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Suggest improvements to the emergency plan"
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
            name="safety.generalNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block mb-2">General Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter any additional information about safety"
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