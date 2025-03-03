'use client';

import React, { useState } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import type { Symptoms } from '../schema';

// Define symptom-specific characteristics
const symptomSpecificCharacteristics = {
  memory: [
    "Short-term memory loss",
    "Long-term memory loss",
    "Difficulty recalling names",
    "Difficulty recalling events",
    "Difficulty learning new information",
    "Lose train of thought mid-conversation",
    "Forget appointments/important dates",
    "Lose items/belongings frequently"
  ],
  attention: [
    "Difficulty focusing",
    "Easily distracted",
    "Difficulty completing tasks",
    "Difficulty with multi-tasking",
    "Difficulty following conversations",
    "Difficulty following instructions",
    "Attention span issues",
    "Mental fatigue"
  ],
  processing: [
    "Slowness in thinking",
    "Delayed response to questions",
    "Need more time to understand information",
    "Difficulty keeping up with conversations",
    "Slowed reaction times",
    "Difficulty processing multiple inputs",
    "Need information repeated"
  ],
  executive: [
    "Difficulty planning",
    "Difficulty organizing",
    "Difficulty prioritizing",
    "Poor decision making",
    "Difficulty starting tasks",
    "Impulsive behavior",
    "Difficulty with abstract concepts",
    "Difficulty with problem solving"
  ],
  language: [
    "Word-finding difficulties",
    "Difficulty understanding complex language",
    "Difficulty expressing thoughts",
    "Misuse of words",
    "Difficulty writing",
    "Difficulty reading",
    "Reduced comprehension",
    "Impaired conversation skills"
  ],
  other: []
};

export function CognitiveSymptomsSection() {
  const { control, watch, setValue } = useFormContext<Symptoms>();
  
  // State to track if cognitive symptoms form should be shown
  const [showCognitiveSymptoms, setShowCognitiveSymptoms] = useState(false);
  
  // Create an array structure for cognitive symptoms
  // Since the schema might be using a single object, we'll need to adapt this
  const [cognitiveSymptoms, setCognitiveSymptoms] = useState([
    {
      id: "1", // Add an id to track each symptom
      type: watch('cognitive.type') || '',
      impact: watch('cognitive.impact') || '',
      management: watch('cognitive.management') || '',
      frequency: watch('cognitive.frequency') || '',
      triggers: watch('cognitive.triggers') || [],
      coping: watch('cognitive.coping') || []
    }
  ]);

  // Add a new state to track the selected characteristics for each symptom
  const [selectedCharacteristics, setSelectedCharacteristics] = useState<{[key: string]: string[]}>({});
  
  // Add a new cognitive symptom
  const addCognitiveSymptom = () => {
    if (!showCognitiveSymptoms) {
      setShowCognitiveSymptoms(true);
      return;
    }
    
    const newSymptom = {
      id: Date.now().toString(),
      type: '',
      impact: '',
      management: '',
      frequency: '',
      triggers: [],
      coping: []
    };
    setCognitiveSymptoms([...cognitiveSymptoms, newSymptom]);
  };
  
  // Remove a cognitive symptom
  const removeCognitiveSymptom = (index: number) => {
    if (cognitiveSymptoms.length > 1) {
      const updatedSymptoms = [...cognitiveSymptoms];
      updatedSymptoms.splice(index, 1);
      setCognitiveSymptoms(updatedSymptoms);
      
      // Update the form values with the first symptom's data
      if (updatedSymptoms.length > 0) {
        setValue('cognitive.type', updatedSymptoms[0].type);
        setValue('cognitive.impact', updatedSymptoms[0].impact);
        setValue('cognitive.management', updatedSymptoms[0].management);
        setValue('cognitive.frequency', updatedSymptoms[0].frequency);
        setValue('cognitive.triggers', updatedSymptoms[0].triggers);
        setValue('cognitive.coping', updatedSymptoms[0].coping);
      }
      
      // Clean up selected characteristics for the removed symptom
      const updatedCharacteristics = {...selectedCharacteristics};
      delete updatedCharacteristics[`symptom-${index}`];
      setSelectedCharacteristics(updatedCharacteristics);
    }
    
    // If this is the last symptom, hide the form
    if (cognitiveSymptoms.length <= 1) {
      setShowCognitiveSymptoms(false);
    }
  };
  
  // Helper function to add a trigger for a specific symptom
  const addTrigger = (symptomIndex: number) => {
    const updatedSymptoms = [...cognitiveSymptoms];
    updatedSymptoms[symptomIndex].triggers = [...(updatedSymptoms[symptomIndex].triggers || []), ''];
    setCognitiveSymptoms(updatedSymptoms);
    
    if (symptomIndex === 0) {
      setValue('cognitive.triggers', updatedSymptoms[0].triggers);
    }
  };
  
  // Helper function to remove a trigger for a specific symptom
  const removeTrigger = (symptomIndex: number, triggerIndex: number) => {
    const updatedSymptoms = [...cognitiveSymptoms];
    const updatedTriggers = [...updatedSymptoms[symptomIndex].triggers];
    updatedTriggers.splice(triggerIndex, 1);
    updatedSymptoms[symptomIndex].triggers = updatedTriggers;
    setCognitiveSymptoms(updatedSymptoms);
    
    if (symptomIndex === 0) {
      setValue('cognitive.triggers', updatedTriggers);
    }
  };
  
  // Helper function to add a coping strategy for a specific symptom
  const addCopingStrategy = (symptomIndex: number) => {
    const updatedSymptoms = [...cognitiveSymptoms];
    updatedSymptoms[symptomIndex].coping = [...(updatedSymptoms[symptomIndex].coping || []), ''];
    setCognitiveSymptoms(updatedSymptoms);
    
    if (symptomIndex === 0) {
      setValue('cognitive.coping', updatedSymptoms[0].coping);
    }
  };
  
  // Helper function to remove a coping strategy for a specific symptom
  const removeCopingStrategy = (symptomIndex: number, strategyIndex: number) => {
    const updatedSymptoms = [...cognitiveSymptoms];
    const updatedStrategies = [...updatedSymptoms[symptomIndex].coping];
    updatedStrategies.splice(strategyIndex, 1);
    updatedSymptoms[symptomIndex].coping = updatedStrategies;
    setCognitiveSymptoms(updatedSymptoms);
    
    if (symptomIndex === 0) {
      setValue('cognitive.coping', updatedStrategies);
    }
  };
  
  // Update the form values when a symptom field changes
  const updateSymptomField = (symptomIndex: number, field: string, value: any) => {
    const updatedSymptoms = [...cognitiveSymptoms];
    updatedSymptoms[symptomIndex][field] = value;
    setCognitiveSymptoms(updatedSymptoms);
    
    if (symptomIndex === 0) {
      setValue(`cognitive.${field}`, value);
    }
  };
  
  // Update a list item value (trigger or coping strategy)
  const updateListItem = (symptomIndex: number, listType: 'triggers' | 'coping', itemIndex: number, value: string) => {
    const updatedSymptoms = [...cognitiveSymptoms];
    updatedSymptoms[symptomIndex][listType][itemIndex] = value;
    setCognitiveSymptoms(updatedSymptoms);
    
    if (symptomIndex === 0) {
      const updatedItems = [...updatedSymptoms[0][listType]];
      setValue(`cognitive.${listType}`, updatedItems);
    }
  };

  // Helper function to toggle a characteristic
  const toggleCharacteristic = (symptomIndex: number, characteristic: string) => {
    const symptomKey = `symptom-${symptomIndex}`;
    const currentCharacteristics = selectedCharacteristics[symptomKey] || [];
    
    // Check if already selected
    if (currentCharacteristics.includes(characteristic)) {
      // Remove it
      const updatedCharacteristics = currentCharacteristics.filter(c => c !== characteristic);
      setSelectedCharacteristics({
        ...selectedCharacteristics,
        [symptomKey]: updatedCharacteristics
      });
    } else {
      // Add it
      setSelectedCharacteristics({
        ...selectedCharacteristics,
        [symptomKey]: [...currentCharacteristics, characteristic]
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Cognitive Symptoms</h3>
        <Button 
          type="button" 
          variant="outline" 
          onClick={addCognitiveSymptom}
          className="flex items-center gap-1"
        >
          <PlusCircle className="h-4 w-4" />
          {showCognitiveSymptoms ? "Add Another Symptom" : "Add Symptom"}
        </Button>
      </div>
      
      {!showCognitiveSymptoms && (
        <div className="text-center py-8 text-gray-500 border border-dashed rounded-md">
          No cognitive symptoms added. Click "Add Symptom" to begin documenting cognitive symptoms.
        </div>
      )}

      {showCognitiveSymptoms && cognitiveSymptoms.map((symptom, symptomIndex) => (
        <div 
          key={symptom.id} 
          className="border rounded-md p-4 space-y-4 relative"
        >
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => removeCognitiveSymptom(symptomIndex)}
            className="absolute right-2 top-2 text-gray-500 hover:text-red-500"
            size="sm"
          >
            <MinusCircle className="h-4 w-4" />
          </Button>

          <div className="grid grid-cols-2 gap-6 pt-4">
            {symptomIndex === 0 ? (
              // For the first item, use the form controller to bind to the schema
              <>
                <FormField
                  control={control}
                  name="cognitive.type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Type of Issue *</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          updateSymptomField(symptomIndex, 'type', value);
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger id={field.name} className="w-full p-2 border rounded-md">
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
                  name="cognitive.frequency"
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
                          <SelectItem value="situational">Situational</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ) : (
              // For additional items, use local state
              <>
                <FormItem>
                  <FormLabel className="text-sm font-medium mb-1">Type of Issue *</FormLabel>
                  <Select
                    onValueChange={(value) => updateSymptomField(symptomIndex, 'type', value)}
                    value={symptom.type}
                  >
                    <SelectTrigger className="w-full p-2 border rounded-md">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="memory">Memory</SelectItem>
                      <SelectItem value="attention">Attention/Concentration</SelectItem>
                      <SelectItem value="processing">Processing Speed</SelectItem>
                      <SelectItem value="executive">Executive Function</SelectItem>
                      <SelectItem value="language">Language/Communication</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
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
                      <SelectItem value="situational">Situational</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              </>
            )}
          </div>

          {/* Symptom-specific characteristics - Not expanded by default */}
          {symptom.type && symptomSpecificCharacteristics[symptom.type] && symptomSpecificCharacteristics[symptom.type].length > 0 && (
            <details className="border-t pt-4 mt-4">
              <summary className="text-sm font-medium mb-3 cursor-pointer">
                {symptom.type === 'memory' ? 'Memory Issues' :
                 symptom.type === 'attention' ? 'Attention/Concentration Issues' :
                 symptom.type === 'processing' ? 'Processing Speed Issues' :
                 symptom.type === 'executive' ? 'Executive Function Issues' :
                 symptom.type === 'language' ? 'Language/Communication Issues' : 
                 'Characteristics'}
              </summary>
              <div className="grid grid-cols-2 gap-3 mt-3">
                {symptomSpecificCharacteristics[symptom.type].map((characteristic, charIndex) => (
                  <div key={charIndex} className="flex items-start space-x-2">
                    <Checkbox 
                      id={`symptom-${symptomIndex}-char-${charIndex}`}
                      checked={(selectedCharacteristics[`symptom-${symptomIndex}`] || []).includes(characteristic)}
                      onCheckedChange={() => toggleCharacteristic(symptomIndex, characteristic)}
                    />
                    <label 
                      htmlFor={`symptom-${symptomIndex}-char-${charIndex}`} 
                      className="text-sm font-normal cursor-pointer"
                    >
                      {characteristic}
                    </label>
                  </div>
                ))}
              </div>
            </details>
          )}

          {symptomIndex === 0 ? (
            <>
              <FormField
                control={control}
                name="cognitive.impact"
                render={({ field }) => (
                  <FormItem className="mb-6">
                    <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Impact on Daily Life *</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        id={field.name}
                        placeholder="Describe how these issues affect daily activities..."
                        className="min-h-[100px] w-full p-2 border rounded-md"
                        onChange={(e) => {
                          field.onChange(e);
                          updateSymptomField(symptomIndex, 'impact', e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="cognitive.management"
                render={({ field }) => (
                  <FormItem className="mb-6">
                    <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Management Strategies</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        id={field.name}
                        placeholder="Current coping strategies and management techniques..."
                        className="min-h-[100px] w-full p-2 border rounded-md"
                        onChange={(e) => {
                          field.onChange(e);
                          updateSymptomField(symptomIndex, 'management', e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          ) : (
            <>
              <FormItem className="mb-6">
                <FormLabel className="text-sm font-medium mb-1">Impact on Daily Life *</FormLabel>
                <Textarea
                  value={symptom.impact}
                  placeholder="Describe how these issues affect daily activities..."
                  className="min-h-[100px] w-full p-2 border rounded-md"
                  onChange={(e) => updateSymptomField(symptomIndex, 'impact', e.target.value)}
                />
              </FormItem>

              <FormItem className="mb-6">
                <FormLabel className="text-sm font-medium mb-1">Management Strategies</FormLabel>
                <Textarea
                  value={symptom.management}
                  placeholder="Current coping strategies and management techniques..."
                  className="min-h-[100px] w-full p-2 border rounded-md"
                  onChange={(e) => updateSymptomField(symptomIndex, 'management', e.target.value)}
                />
              </FormItem>
            </>
          )}

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

            {(!symptom.triggers || symptom.triggers.length === 0) && (
              <div className="text-center py-4 text-gray-500 border border-dashed rounded-md mb-4">
                No triggers added. Click "Add Trigger" to begin.
              </div>
            )}

            {symptom.triggers && symptom.triggers.map((trigger, triggerIndex) => (
              <div key={triggerIndex} className="flex items-center gap-2 mb-3">
                {symptomIndex === 0 ? (
                  <FormField
                    control={control}
                    name={`cognitive.triggers.${triggerIndex}`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            {...field}
                            id={field.name}
                            placeholder="What triggers cognitive symptoms?"
                            className="w-full p-2 border rounded-md"
                            onChange={(e) => {
                              field.onChange(e);
                              updateListItem(symptomIndex, 'triggers', triggerIndex, e.target.value);
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
                      value={trigger}
                      placeholder="What triggers cognitive symptoms?"
                      className="w-full p-2 border rounded-md"
                      onChange={(e) => updateListItem(symptomIndex, 'triggers', triggerIndex, e.target.value)}
                    />
                  </FormItem>
                )}
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
                onClick={() => addCopingStrategy(symptomIndex)}
                className="flex items-center gap-1"
                size="sm"
              >
                <PlusCircle className="h-4 w-4" />
                Add Strategy
              </Button>
            </div>

            {(!symptom.coping || symptom.coping.length === 0) && (
              <div className="text-center py-4 text-gray-500 border border-dashed rounded-md mb-4">
                No coping strategies added. Click "Add Strategy" to begin.
              </div>
            )}

            {symptom.coping && symptom.coping.map((strategy, strategyIndex) => (
              <div key={strategyIndex} className="flex items-center gap-2 mb-3">
                {symptomIndex === 0 ? (
                  <FormField
                    control={control}
                    name={`cognitive.coping.${strategyIndex}`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            {...field}
                            id={field.name}
                            placeholder="What helps you cope with cognitive symptoms?"
                            className="w-full p-2 border rounded-md"
                            onChange={(e) => {
                              field.onChange(e);
                              updateListItem(symptomIndex, 'coping', strategyIndex, e.target.value);
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
                      value={strategy}
                      placeholder="What helps you cope with cognitive symptoms?"
                      className="w-full p-2 border rounded-md"
                      onChange={(e) => updateListItem(symptomIndex, 'coping', strategyIndex, e.target.value)}
                    />
                  </FormItem>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => removeCopingStrategy(symptomIndex, strategyIndex)}
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