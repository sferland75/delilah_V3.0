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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { PlusCircle, MinusCircle } from 'lucide-react';
import type { SymptomsUpdated, PhysicalSymptom } from '../schema.updated';

export function PhysicalSymptomsSectionUpdated() {
  const { control, watch, setValue } = useFormContext<SymptomsUpdated>();
  
  // Helper function to add a new empty symptom
  const addSymptom = () => {
    const currentSymptoms = watch('physical') || [];
    const newSymptom: PhysicalSymptom = {
      id: Date.now().toString(),
      location: '',
      intensity: '',
      description: '',
      frequency: '',
      duration: '',
      aggravating: [],
      alleviating: []
    };
    
    setValue('physical', [...currentSymptoms, newSymptom], { shouldValidate: true });
  };
  
  // Helper function to remove a symptom by index
  const removeSymptom = (index: number) => {
    const currentSymptoms = watch('physical') || [];
    if (currentSymptoms.length > 1) {
      const updatedSymptoms = [...currentSymptoms];
      updatedSymptoms.splice(index, 1);
      setValue('physical', updatedSymptoms, { shouldValidate: true });
    }
  };
  
  // Helper function to add an aggravating factor for a specific symptom
  const addAggravatingFactor = (symptomIndex: number) => {
    const currentSymptoms = watch('physical') || [];
    if (currentSymptoms[symptomIndex]) {
      const updatedSymptoms = [...currentSymptoms];
      updatedSymptoms[symptomIndex] = {
        ...updatedSymptoms[symptomIndex],
        aggravating: [...(updatedSymptoms[symptomIndex].aggravating || []), '']
      };
      setValue('physical', updatedSymptoms, { shouldValidate: true });
    }
  };
  
  // Helper function to remove an aggravating factor for a specific symptom
  const removeAggravatingFactor = (symptomIndex: number, factorIndex: number) => {
    const currentSymptoms = watch('physical') || [];
    if (currentSymptoms[symptomIndex]) {
      const updatedSymptoms = [...currentSymptoms];
      const updatedFactors = [...updatedSymptoms[symptomIndex].aggravating];
      updatedFactors.splice(factorIndex, 1);
      updatedSymptoms[symptomIndex] = {
        ...updatedSymptoms[symptomIndex],
        aggravating: updatedFactors
      };
      setValue('physical', updatedSymptoms, { shouldValidate: true });
    }
  };
  
  // Helper function to add an alleviating factor for a specific symptom
  const addAlleviatingFactor = (symptomIndex: number) => {
    const currentSymptoms = watch('physical') || [];
    if (currentSymptoms[symptomIndex]) {
      const updatedSymptoms = [...currentSymptoms];
      updatedSymptoms[symptomIndex] = {
        ...updatedSymptoms[symptomIndex],
        alleviating: [...(updatedSymptoms[symptomIndex].alleviating || []), '']
      };
      setValue('physical', updatedSymptoms, { shouldValidate: true });
    }
  };
  
  // Helper function to remove an alleviating factor for a specific symptom
  const removeAlleviatingFactor = (symptomIndex: number, factorIndex: number) => {
    const currentSymptoms = watch('physical') || [];
    if (currentSymptoms[symptomIndex]) {
      const updatedSymptoms = [...currentSymptoms];
      const updatedFactors = [...updatedSymptoms[symptomIndex].alleviating];
      updatedFactors.splice(factorIndex, 1);
      updatedSymptoms[symptomIndex] = {
        ...updatedSymptoms[symptomIndex],
        alleviating: updatedFactors
      };
      setValue('physical', updatedSymptoms, { shouldValidate: true });
    }
  };

  // Get the physical symptoms from the form context
  const physicalSymptoms = watch('physical') || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Physical Symptoms</h3>
        <Button 
          type="button" 
          variant="outline" 
          onClick={addSymptom}
          className="flex items-center gap-1"
        >
          <PlusCircle className="h-4 w-4" />
          Add Symptom
        </Button>
      </div>

      {physicalSymptoms.map((_, symptomIndex) => (
        <FormField
          key={`physical.${symptomIndex}`}
          control={control}
          name={`physical.${symptomIndex}`}
          render={({ field }) => (
            <div className="border rounded-md p-4 space-y-4 relative">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => removeSymptom(symptomIndex)}
                className="absolute right-2 top-2 text-gray-500 hover:text-red-500"
                size="sm"
                disabled={physicalSymptoms.length <= 1}
              >
                <MinusCircle className="h-4 w-4" />
              </Button>

              <div className="grid grid-cols-2 gap-6 pt-4">
                <FormField
                  control={control}
                  name={`physical.${symptomIndex}.location`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Where is the symptom located?" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`physical.${symptomIndex}.intensity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Intensity (1-10)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select intensity" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[...Array(10)].map((_, i) => (
                            <SelectItem key={i + 1} value={String(i + 1)}>
                              {i + 1} - {i < 3 ? 'Mild' : i < 6 ? 'Moderate' : 'Severe'}
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
                  name={`physical.${symptomIndex}.frequency`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequency</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="constant">Constant</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="intermittent">Intermittent</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`physical.${symptomIndex}.duration`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="How long do symptoms last?" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`physical.${symptomIndex}.description`}
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Describe the symptoms in detail..."
                          className="min-h-[100px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Aggravating Factors */}
              <div className="border-t pt-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-md font-medium">Aggravating Factors</h4>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addAggravatingFactor(symptomIndex)}
                    className="flex items-center gap-1"
                    size="sm"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Add Factor
                  </Button>
                </div>

                {(!physicalSymptoms[symptomIndex]?.aggravating || physicalSymptoms[symptomIndex]?.aggravating.length === 0) && (
                  <div className="text-center py-4 text-gray-500 border border-dashed rounded-md mb-4">
                    No aggravating factors added. Click "Add Factor" to begin.
                  </div>
                )}

                {physicalSymptoms[symptomIndex]?.aggravating?.map((_, factorIndex) => (
                  <div key={factorIndex} className="flex items-center gap-2 mb-3">
                    <FormField
                      control={control}
                      name={`physical.${symptomIndex}.aggravating.${factorIndex}`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="What makes the symptoms worse?"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => removeAggravatingFactor(symptomIndex, factorIndex)}
                      className="text-gray-500 hover:text-red-500"
                      size="sm"
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Alleviating Factors */}
              <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-md font-medium">Alleviating Factors</h4>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addAlleviatingFactor(symptomIndex)}
                    className="flex items-center gap-1"
                    size="sm"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Add Factor
                  </Button>
                </div>

                {(!physicalSymptoms[symptomIndex]?.alleviating || physicalSymptoms[symptomIndex]?.alleviating.length === 0) && (
                  <div className="text-center py-4 text-gray-500 border border-dashed rounded-md mb-4">
                    No alleviating factors added. Click "Add Factor" to begin.
                  </div>
                )}

                {physicalSymptoms[symptomIndex]?.alleviating?.map((_, factorIndex) => (
                  <div key={factorIndex} className="flex items-center gap-2 mb-3">
                    <FormField
                      control={control}
                      name={`physical.${symptomIndex}.alleviating.${factorIndex}`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="What makes the symptoms better?"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => removeAlleviatingFactor(symptomIndex, factorIndex)}
                      className="text-gray-500 hover:text-red-500"
                      size="sm"
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        />
      ))}
    </div>
  );
}
