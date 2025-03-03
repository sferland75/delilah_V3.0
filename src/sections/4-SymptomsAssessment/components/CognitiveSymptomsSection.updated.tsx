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
import type { SymptomsUpdated, CognitiveSymptom } from '../schema.updated';

export function CognitiveSymptomsSectionUpdated() {
  const { control, watch, setValue } = useFormContext<SymptomsUpdated>();
  
  // Helper function to add a new empty symptom
  const addSymptom = () => {
    const currentSymptoms = watch('cognitive') || [];
    const newSymptom: CognitiveSymptom = {
      id: Date.now().toString(),
      type: '',
      impact: '',
      management: '',
      frequency: '',
      triggers: [],
      coping: []
    };
    
    setValue('cognitive', [...currentSymptoms, newSymptom], { shouldValidate: true });
  };
  
  // Helper function to remove a symptom by index
  const removeSymptom = (index: number) => {
    const currentSymptoms = watch('cognitive') || [];
    if (currentSymptoms.length > 1) {
      const updatedSymptoms = [...currentSymptoms];
      updatedSymptoms.splice(index, 1);
      setValue('cognitive', updatedSymptoms, { shouldValidate: true });
    }
  };
  
  // Helper function to add a trigger for a specific symptom
  const addTrigger = (symptomIndex: number) => {
    const currentSymptoms = watch('cognitive') || [];
    if (currentSymptoms[symptomIndex]) {
      const updatedSymptoms = [...currentSymptoms];
      updatedSymptoms[symptomIndex] = {
        ...updatedSymptoms[symptomIndex],
        triggers: [...(updatedSymptoms[symptomIndex].triggers || []), '']
      };
      setValue('cognitive', updatedSymptoms, { shouldValidate: true });
    }
  };
  
  // Helper function to remove a trigger for a specific symptom
  const removeTrigger = (symptomIndex: number, triggerIndex: number) => {
    const currentSymptoms = watch('cognitive') || [];
    if (currentSymptoms[symptomIndex]) {
      const updatedSymptoms = [...currentSymptoms];
      const updatedTriggers = [...updatedSymptoms[symptomIndex].triggers];
      updatedTriggers.splice(triggerIndex, 1);
      updatedSymptoms[symptomIndex] = {
        ...updatedSymptoms[symptomIndex],
        triggers: updatedTriggers
      };
      setValue('cognitive', updatedSymptoms, { shouldValidate: true });
    }
  };
  
  // Helper function to add a coping strategy for a specific symptom
  const addCoping = (symptomIndex: number) => {
    const currentSymptoms = watch('cognitive') || [];
    if (currentSymptoms[symptomIndex]) {
      const updatedSymptoms = [...currentSymptoms];
      updatedSymptoms[symptomIndex] = {
        ...updatedSymptoms[symptomIndex],
        coping: [...(updatedSymptoms[symptomIndex].coping || []), '']
      };
      setValue('cognitive', updatedSymptoms, { shouldValidate: true });
    }
  };
  
  // Helper function to remove a coping strategy for a specific symptom
  const removeCoping = (symptomIndex: number, copingIndex: number) => {
    const currentSymptoms = watch('cognitive') || [];
    if (currentSymptoms[symptomIndex]) {
      const updatedSymptoms = [...currentSymptoms];
      const updatedCoping = [...updatedSymptoms[symptomIndex].coping];
      updatedCoping.splice(copingIndex, 1);
      updatedSymptoms[symptomIndex] = {
        ...updatedSymptoms[symptomIndex],
        coping: updatedCoping
      };
      setValue('cognitive', updatedSymptoms, { shouldValidate: true });
    }
  };

  // Get the cognitive symptoms from the form context
  const cognitiveSymptoms = watch('cognitive') || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Cognitive Symptoms</h3>
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

      {cognitiveSymptoms.map((_, symptomIndex) => (
        <FormField
          key={`cognitive.${symptomIndex}`}
          control={control}
          name={`cognitive.${symptomIndex}`}
          render={({ field }) => (
            <div className="border rounded-md p-4 space-y-4 relative">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => removeSymptom(symptomIndex)}
                className="absolute right-2 top-2 text-gray-500 hover:text-red-500"
                size="sm"
                disabled={cognitiveSymptoms.length <= 1}
              >
                <MinusCircle className="h-4 w-4" />
              </Button>

              <div className="grid grid-cols-2 gap-6 pt-4">
                <FormField
                  control={control}
                  name={`cognitive.${symptomIndex}.type`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type of Issue</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="memory">Memory</SelectItem>
                          <SelectItem value="attention">Attention/Concentration</SelectItem>
                          <SelectItem value="processing">Processing Speed</SelectItem>
                          <SelectItem value="executive">Executive Function</SelectItem>
                          <SelectItem value="language">Language/Communication</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`cognitive.${symptomIndex}.frequency`}
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
                          <SelectItem value="situational">Situational</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`cognitive.${symptomIndex}.impact`}
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Impact on Daily Life</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Describe how these issues affect daily activities..."
                          className="min-h-[100px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`cognitive.${symptomIndex}.management`}
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Management Strategies</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Current coping strategies and management techniques..."
                          className="min-h-[100px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Triggers */}
              <div className="border-t pt-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-md font-medium">Triggers</h4>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addTrigger(symptomIndex)}
                    className="flex items-center gap-1"
                    size="sm"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Add Trigger
                  </Button>
                </div>

                {(!cognitiveSymptoms[symptomIndex]?.triggers || cognitiveSymptoms[symptomIndex]?.triggers.length === 0) && (
                  <div className="text-center py-4 text-gray-500 border border-dashed rounded-md mb-4">
                    No triggers added. Click "Add Trigger" to begin.
                  </div>
                )}

                {cognitiveSymptoms[symptomIndex]?.triggers?.map((_, triggerIndex) => (
                  <div key={triggerIndex} className="flex items-center gap-2 mb-3">
                    <FormField
                      control={control}
                      name={`cognitive.${symptomIndex}.triggers.${triggerIndex}`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="What triggers these cognitive issues?"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => removeTrigger(symptomIndex, triggerIndex)}
                      className="text-gray-500 hover:text-red-500"
                      size="sm"
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Coping Strategies */}
              <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-md font-medium">Coping Strategies</h4>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addCoping(symptomIndex)}
                    className="flex items-center gap-1"
                    size="sm"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Add Strategy
                  </Button>
                </div>

                {(!cognitiveSymptoms[symptomIndex]?.coping || cognitiveSymptoms[symptomIndex]?.coping.length === 0) && (
                  <div className="text-center py-4 text-gray-500 border border-dashed rounded-md mb-4">
                    No coping strategies added. Click "Add Strategy" to begin.
                  </div>
                )}

                {cognitiveSymptoms[symptomIndex]?.coping?.map((_, copingIndex) => (
                  <div key={copingIndex} className="flex items-center gap-2 mb-3">
                    <FormField
                      control={control}
                      name={`cognitive.${symptomIndex}.coping.${copingIndex}`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Strategies used to cope with these issues"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => removeCoping(symptomIndex, copingIndex)}
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
