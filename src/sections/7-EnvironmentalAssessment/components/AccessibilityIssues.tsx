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
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { accessibilityAreaTypes } from '../schema';
import type { FormState } from '../types';
import { PlusCircle, MinusCircle } from 'lucide-react';

export function AccessibilityIssues() {
  const { control } = useFormContext<FormState>();
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "accessibilityIssues.issues",
  });

  const impactLevels = ["Low", "Moderate", "Significant", "Severe"];

  const addNewIssue = () => {
    append({
      id: `issue-${Date.now()}`,
      area: 'entrance',
      description: '',
      impactLevel: 'Moderate',
      currentSolutions: '',
      recommendations: '',
      isResolvedWithAssistance: false
    });
  };

  return (
    <div className="space-y-6">
      <div className="border rounded-md p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Accessibility Issues</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addNewIssue}
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add Issue</span>
          </Button>
        </div>

        {fields.length === 0 ? (
          <div className="text-center p-6 border border-dashed rounded-md mb-4">
            <p className="text-muted-foreground">No accessibility issues added yet. Click "Add Issue" to begin.</p>
          </div>
        ) : (
          <div className="space-y-6 mb-4">
            {fields.map((field, index) => (
              <div key={field.id} className="border rounded-md p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Accessibility Issue {index + 1}</h3>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <FormField
                    control={control}
                    name={`accessibilityIssues.issues.${index}.area`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Area</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select area" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {accessibilityAreaTypes.map(area => (
                              <SelectItem key={area} value={area}>
                                {area.charAt(0).toUpperCase() + area.slice(1).replace('_', ' ')}
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
                    name={`accessibilityIssues.issues.${index}.impactLevel`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Impact Level</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select impact level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {impactLevels.map(level => (
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
                  name={`accessibilityIssues.issues.${index}.description`}
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the accessibility issue"
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
                  name={`accessibilityIssues.issues.${index}.currentSolutions`}
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Current Solutions</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe any current solutions or adaptations"
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
                  name={`accessibilityIssues.issues.${index}.recommendations`}
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Recommendations</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Provide recommendations for addressing this issue"
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
                  name={`accessibilityIssues.issues.${index}.isResolvedWithAssistance`}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">Can be resolved with assistance</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>
        )}

        <FormField
          control={control}
          name="accessibilityIssues.generalNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>General Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter any additional information about accessibility issues"
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
  );
}