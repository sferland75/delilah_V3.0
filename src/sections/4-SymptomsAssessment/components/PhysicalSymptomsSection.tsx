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
import { Button } from '@/components/ui/button';
import { PlusCircle, MinusCircle } from 'lucide-react';
import type { Symptoms } from '../schema';

// We'll need to update the schema structure to support multiple physical symptoms
// For now, let's create a version that matches the current schema but supports multiple items

export function PhysicalSymptomsSection() {
  const { control, watch, setValue } = useFormContext<Symptoms>();
  
  // Create an array structure for physical symptoms
  // Since the schema might be using a single object, we'll need to adapt this
  const [physicalSymptoms, setPhysicalSymptoms] = React.useState([
    {
      id: "1", // Add an id to track each symptom
      location: watch('physical.location') || '',
      intensity: watch('physical.intensity') || '',
      description: watch('physical.description') || '',
      frequency: watch('physical.frequency') || '',
      duration: watch('physical.duration') || '',
      aggravating: watch('physical.aggravating') || [],
      alleviating: watch('physical.alleviating') || []
    }
  ]);
  
  // Add a new physical symptom
  const addPhysicalSymptom = () => {
    const newSymptom = {
      id: Date.now().toString(),
      location: '',
      intensity: '',
      description: '',
      frequency: '',
      duration: '',
      aggravating: [],
      alleviating: []
    };
    setPhysicalSymptoms([...physicalSymptoms, newSymptom]);
  };
  
  // Remove a physical symptom
  const removePhysicalSymptom = (index: number) => {
    if (physicalSymptoms.length > 1) {
      const updatedSymptoms = [...physicalSymptoms];
      updatedSymptoms.splice(index, 1);
      setPhysicalSymptoms(updatedSymptoms);
      
      // Update the form values with the first symptom's data
      if (updatedSymptoms.length > 0) {
        setValue('physical.location', updatedSymptoms[0].location);
        setValue('physical.intensity', updatedSymptoms[0].intensity);
        setValue('physical.description', updatedSymptoms[0].description);
        setValue('physical.frequency', updatedSymptoms[0].frequency);
        setValue('physical.duration', updatedSymptoms[0].duration);
        setValue('physical.aggravating', updatedSymptoms[0].aggravating);
        setValue('physical.alleviating', updatedSymptoms[0].alleviating);
      }
    }
  };
  
  // Helper function to add an aggravating factor for a specific symptom
  const addAggravatingFactor = (symptomIndex: number) => {
    const updatedSymptoms = [...physicalSymptoms];
    updatedSymptoms[symptomIndex].aggravating = [...(updatedSymptoms[symptomIndex].aggravating || []), ''];
    setPhysicalSymptoms(updatedSymptoms);
    
    if (symptomIndex === 0) {
      setValue('physical.aggravating', updatedSymptoms[0].aggravating);
    }
  };
  
  // Helper function to remove an aggravating factor for a specific symptom
  const removeAggravatingFactor = (symptomIndex: number, factorIndex: number) => {
    const updatedSymptoms = [...physicalSymptoms];
    const updatedFactors = [...updatedSymptoms[symptomIndex].aggravating];
    updatedFactors.splice(factorIndex, 1);
    updatedSymptoms[symptomIndex].aggravating = updatedFactors;
    setPhysicalSymptoms(updatedSymptoms);
    
    if (symptomIndex === 0) {
      setValue('physical.aggravating', updatedFactors);
    }
  };
  
  // Helper function to add an alleviating factor for a specific symptom
  const addAlleviatingFactor = (symptomIndex: number) => {
    const updatedSymptoms = [...physicalSymptoms];
    updatedSymptoms[symptomIndex].alleviating = [...(updatedSymptoms[symptomIndex].alleviating || []), ''];
    setPhysicalSymptoms(updatedSymptoms);
    
    if (symptomIndex === 0) {
      setValue('physical.alleviating', updatedSymptoms[0].alleviating);
    }
  };
  
  // Helper function to remove an alleviating factor for a specific symptom
  const removeAlleviatingFactor = (symptomIndex: number, factorIndex: number) => {
    const updatedSymptoms = [...physicalSymptoms];
    const updatedFactors = [...updatedSymptoms[symptomIndex].alleviating];
    updatedFactors.splice(factorIndex, 1);
    updatedSymptoms[symptomIndex].alleviating = updatedFactors;
    setPhysicalSymptoms(updatedSymptoms);
    
    if (symptomIndex === 0) {
      setValue('physical.alleviating', updatedFactors);
    }
  };
  
  // Update the form values when a symptom field changes
  const updateSymptomField = (symptomIndex: number, field: string, value: any) => {
    const updatedSymptoms = [...physicalSymptoms];
    updatedSymptoms[symptomIndex][field] = value;
    setPhysicalSymptoms(updatedSymptoms);
    
    if (symptomIndex === 0) {
      setValue(`physical.${field}`, value);
    }
  };
  
  // Update a factor value
  const updateFactorField = (symptomIndex: number, factorType: 'aggravating' | 'alleviating', factorIndex: number, value: string) => {
    const updatedSymptoms = [...physicalSymptoms];
    updatedSymptoms[symptomIndex][factorType][factorIndex] = value;
    setPhysicalSymptoms(updatedSymptoms);
    
    if (symptomIndex === 0) {
      const updatedFactors = [...updatedSymptoms[0][factorType]];
      setValue(`physical.${factorType}`, updatedFactors);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Physical Symptoms</h3>
        <Button 
          type="button" 
          variant="outline" 
          onClick={addPhysicalSymptom}
          className="flex items-center gap-1"
        >
          <PlusCircle className="h-4 w-4" />
          Add Symptom
        </Button>
      </div>

      {physicalSymptoms.map((symptom, symptomIndex) => (
        <div 
          key={symptom.id} 
          className="border rounded-md p-4 space-y-4 relative"
        >
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => removePhysicalSymptom(symptomIndex)}
            className="absolute right-2 top-2 text-gray-500 hover:text-red-500"
            size="sm"
            disabled={physicalSymptoms.length <= 1}
          >
            <MinusCircle className="h-4 w-4" />
          </Button>

          <div className="grid grid-cols-2 gap-6 pt-4">
            {symptomIndex === 0 ? (
              // For the first item, use the form controller to bind to the schema
              <>
                <FormField
                  control={control}
                  name="physical.location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Location *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          id={field.name}
                          placeholder="Where is the symptom located?"
                          className="w-full p-2 border rounded-md"
                          onChange={(e) => {
                            field.onChange(e);
                            updateSymptomField(symptomIndex, 'location', e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="physical.intensity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Intensity (1-10) *</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          updateSymptomField(symptomIndex, 'intensity', value);
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger id={field.name} className="w-full p-2 border rounded-md">
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
                  name="physical.frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Frequency *</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          updateSymptomField(symptomIndex, 'frequency', value);
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger id={field.name} className="w-full p-2 border rounded-md">
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
                  name="physical.duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Duration *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          id={field.name}
                          placeholder="How long do symptoms last?"
                          className="w-full p-2 border rounded-md"
                          onChange={(e) => {
                            field.onChange(e);
                            updateSymptomField(symptomIndex, 'duration', e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ) : (
              // For additional items, use local state
              <>
                <FormItem>
                  <FormLabel className="text-sm font-medium mb-1">Location *</FormLabel>
                  <Input
                    value={symptom.location}
                    placeholder="Where is the symptom located?"
                    className="w-full p-2 border rounded-md"
                    onChange={(e) => updateSymptomField(symptomIndex, 'location', e.target.value)}
                  />
                </FormItem>

                <FormItem>
                  <FormLabel className="text-sm font-medium mb-1">Intensity (1-10) *</FormLabel>
                  <Select
                    onValueChange={(value) => updateSymptomField(symptomIndex, 'intensity', value)}
                    value={symptom.intensity}
                  >
                    <SelectTrigger className="w-full p-2 border rounded-md">
                      <SelectValue placeholder="Select intensity" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(10)].map((_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1)}>
                          {i + 1} - {i < 3 ? 'Mild' : i < 6 ? 'Moderate' : 'Severe'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>

                <FormItem>
                  <FormLabel className="text-sm font-medium mb-1">Frequency *</FormLabel>
                  <Select
                    onValueChange={(value) => updateSymptomField(symptomIndex, 'frequency', value)}
                    value={symptom.frequency}
                  >
                    <SelectTrigger className="w-full p-2 border rounded-md">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="constant">Constant</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="intermittent">Intermittent</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>

                <FormItem>
                  <FormLabel className="text-sm font-medium mb-1">Duration *</FormLabel>
                  <Input
                    value={symptom.duration}
                    placeholder="How long do symptoms last?"
                    className="w-full p-2 border rounded-md"
                    onChange={(e) => updateSymptomField(symptomIndex, 'duration', e.target.value)}
                  />
                </FormItem>
              </>
            )}
          </div>

          {symptomIndex === 0 ? (
            <FormField
              control={control}
              name="physical.description"
              render={({ field }) => (
                <FormItem className="mb-6">
                  <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      id={field.name}
                      placeholder="Describe the symptoms in detail..."
                      className="min-h-[100px] w-full p-2 border rounded-md"
                      onChange={(e) => {
                        field.onChange(e);
                        updateSymptomField(symptomIndex, 'description', e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <FormItem className="mb-6">
              <FormLabel className="text-sm font-medium mb-1">Description *</FormLabel>
              <Textarea
                value={symptom.description}
                placeholder="Describe the symptoms in detail..."
                className="min-h-[100px] w-full p-2 border rounded-md"
                onChange={(e) => updateSymptomField(symptomIndex, 'description', e.target.value)}
              />
            </FormItem>
          )}

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

            {(!symptom.aggravating || symptom.aggravating.length === 0) && (
              <div className="text-center py-4 text-gray-500 border border-dashed rounded-md mb-4">
                No aggravating factors added. Click "Add Factor" to begin.
              </div>
            )}

            {symptom.aggravating && symptom.aggravating.map((factor, factorIndex) => (
              <div key={factorIndex} className="flex items-center gap-2 mb-3">
                {symptomIndex === 0 && factorIndex === 0 ? (
                  <FormField
                    control={control}
                    name={`physical.aggravating.${factorIndex}`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            {...field}
                            id={field.name}
                            placeholder="What makes the symptoms worse?"
                            className="w-full p-2 border rounded-md"
                            onChange={(e) => {
                              field.onChange(e);
                              updateFactorField(symptomIndex, 'aggravating', factorIndex, e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <FormItem className="flex-1">
                    <Input
                      value={factor}
                      placeholder="What makes the symptoms worse?"
                      className="w-full p-2 border rounded-md"
                      onChange={(e) => updateFactorField(symptomIndex, 'aggravating', factorIndex, e.target.value)}
                    />
                  </FormItem>
                )}
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

            {(!symptom.alleviating || symptom.alleviating.length === 0) && (
              <div className="text-center py-4 text-gray-500 border border-dashed rounded-md mb-4">
                No alleviating factors added. Click "Add Factor" to begin.
              </div>
            )}

            {symptom.alleviating && symptom.alleviating.map((factor, factorIndex) => (
              <div key={factorIndex} className="flex items-center gap-2 mb-3">
                {symptomIndex === 0 && factorIndex === 0 ? (
                  <FormField
                    control={control}
                    name={`physical.alleviating.${factorIndex}`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            {...field}
                            id={field.name}
                            placeholder="What makes the symptoms better?"
                            className="w-full p-2 border rounded-md"
                            onChange={(e) => {
                              field.onChange(e);
                              updateFactorField(symptomIndex, 'alleviating', factorIndex, e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <FormItem className="flex-1">
                    <Input
                      value={factor}
                      placeholder="What makes the symptoms better?"
                      className="w-full p-2 border rounded-md"
                      onChange={(e) => updateFactorField(symptomIndex, 'alleviating', factorIndex, e.target.value)}
                    />
                  </FormItem>
                )}
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
      ))}
    </div>
  );
}