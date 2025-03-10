'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { PlusCircle, MinusCircle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import type { Symptoms } from '../schema';

// Define symptom-specific characteristics
const symptomSpecificCharacteristics = {
  anxiety: [
    "Excessive worry",
    "Restlessness",
    "Fatigue",
    "Difficulty concentrating",
    "Irritability",
    "Muscle tension",
    "Sleep disturbance",
    "Panic attacks"
  ],
  depression: [
    "Depressed mood",
    "Loss of interest/pleasure",
    "Weight change",
    "Sleep disturbance",
    "Fatigue/loss of energy",
    "Feelings of worthlessness",
    "Difficulty concentrating",
    "Suicidal thoughts"
  ],
  frustration: [
    "Short temper",
    "Feeling overwhelmed",
    "Impatience",
    "Raised voice/yelling",
    "Increased heart rate",
    "Difficulty focusing"
  ],
  irritability: [
    "Angry outbursts",
    "Low frustration tolerance",
    "Easily annoyed",
    "Tension/discomfort",
    "Headaches",
    "Difficulty sleeping"
  ],
  mood_swings: [
    "Rapid mood changes",
    "Emotional instability",
    "Unpredictable reactions",
    "Heightened sensitivity",
    "Periods of elation",
    "Periods of low mood"
  ],
  grief: [
    "Sadness",
    "Numbness",
    "Yearning",
    "Anger",
    "Guilt",
    "Difficulty accepting loss",
    "Social withdrawal",
    "Loss of meaning"
  ],
  other: []
};

export function EmotionalSymptomsSection() {
  const { control, watch, setValue } = useFormContext<Symptoms>();
  const emotional = watch('emotional') || [];

  // Add a new state to track the selected characteristics for each symptom
  const [selectedCharacteristics, setSelectedCharacteristics] = React.useState<{[key: string]: string[]}>({});

  const addEmotionalSymptom = () => {
    const newSymptom = {
      type: '',
      severity: '',
      frequency: '',
      impact: '',
      management: ''
    };
    
    setValue('emotional', [
      ...emotional,
      newSymptom
    ], { shouldValidate: true });
  };

  const removeEmotionalSymptom = (index: number) => {
    const updatedSymptoms = [...emotional];
    updatedSymptoms.splice(index, 1);
    setValue('emotional', updatedSymptoms, { shouldValidate: true });
    
    // Clean up selected characteristics for the removed symptom
    const updatedCharacteristics = {...selectedCharacteristics};
    delete updatedCharacteristics[`symptom-${index}`];
    setSelectedCharacteristics(updatedCharacteristics);
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
        <h3 className="text-lg font-medium">Emotional Symptoms</h3>
        <Button 
          type="button" 
          variant="outline" 
          onClick={addEmotionalSymptom}
          className="flex items-center gap-1"
        >
          <PlusCircle className="h-4 w-4" />
          Add Symptom
        </Button>
      </div>

      {emotional.length === 0 && (
        <div className="text-center py-8 text-gray-500 border border-dashed rounded-md">
          No emotional symptoms added. Click "Add Symptom" to begin.
        </div>
      )}

      {emotional.map((symptom, index) => (
        <div 
          key={index} 
          className="border rounded-md p-4 space-y-4 relative"
        >
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => removeEmotionalSymptom(index)}
            className="absolute right-2 top-2 text-gray-500 hover:text-red-500"
            size="sm"
          >
            <MinusCircle className="h-4 w-4" />
          </Button>

          <div className="grid grid-cols-2 gap-6 pt-4">
            <FormField
              control={control}
              name={`emotional.${index}.type`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger id={field.name} className="w-full p-2 border rounded-md">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="anxiety">Anxiety</SelectItem>
                      <SelectItem value="depression">Depression</SelectItem>
                      <SelectItem value="frustration">Frustration</SelectItem>
                      <SelectItem value="irritability">Irritability</SelectItem>
                      <SelectItem value="mood_swings">Mood Swings</SelectItem>
                      <SelectItem value="grief">Grief</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`emotional.${index}.severity`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Severity</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger id={field.name} className="w-full p-2 border rounded-md">
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="mild">Mild</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="severe">Severe</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`emotional.${index}.frequency`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Frequency</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger id={field.name} className="w-full p-2 border rounded-md">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
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
          </div>

          {/* Symptom-specific characteristics */}
          {symptom.type && symptomSpecificCharacteristics[symptom.type] && symptomSpecificCharacteristics[symptom.type].length > 0 && (
            <div className="border-t pt-4 mt-4">
              <FormLabel className="text-sm font-medium mb-3 block">Characteristics of {symptom.type.charAt(0).toUpperCase() + symptom.type.slice(1)}</FormLabel>
              <div className="grid grid-cols-2 gap-3">
                {symptomSpecificCharacteristics[symptom.type].map((characteristic, charIndex) => (
                  <div key={charIndex} className="flex items-start space-x-2">
                    <Checkbox 
                      id={`symptom-${index}-char-${charIndex}`}
                      checked={(selectedCharacteristics[`symptom-${index}`] || []).includes(characteristic)}
                      onCheckedChange={() => toggleCharacteristic(index, characteristic)}
                    />
                    <label 
                      htmlFor={`symptom-${index}-char-${charIndex}`} 
                      className="text-sm font-normal cursor-pointer"
                    >
                      {characteristic}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <FormField
            control={control}
            name={`emotional.${index}.impact`}
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Impact on Daily Life</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    id={field.name}
                    placeholder="Describe how this affects daily activities..."
                    className="min-h-[100px] w-full p-2 border rounded-md"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`emotional.${index}.management`}
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Management Strategies</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    id={field.name}
                    placeholder="Current coping strategies and management techniques..."
                    className="min-h-[100px] w-full p-2 border rounded-md"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ))}
    </div>
  );
}