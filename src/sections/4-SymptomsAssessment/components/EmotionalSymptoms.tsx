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
import { Plus, X } from 'lucide-react';
import type { Symptoms } from '../schema';

export function EmotionalSymptoms() {
  const { control, watch, setValue } = useFormContext<Symptoms>();
  const emotional = watch('emotional') || [];

  const addEmotionalSymptom = () => {
    setValue('emotional', [
      ...emotional,
      { type: '', severity: '', frequency: '', impact: '', management: '' }
    ]);
  };

  const removeEmotionalSymptom = (index: number) => {
    setValue('emotional', emotional.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {emotional.map((_, index) => (
        <div key={index} className="relative border rounded-lg p-4 bg-white">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2"
            onClick={() => removeEmotionalSymptom(index)}
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={control}
              name={`emotional.${index}.type`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="anxiety">Anxiety</SelectItem>
                      <SelectItem value="depression">Depression</SelectItem>
                      <SelectItem value="frustration">Frustration</SelectItem>
                      <SelectItem value="irritability">Irritability</SelectItem>
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
                  <FormLabel>Severity</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
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
                  <FormLabel>Frequency</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
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

            <FormField
              control={control}
              name={`emotional.${index}.impact`}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Impact on Daily Life</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Describe how this affects daily activities..."
                      className="min-h-[100px]"
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
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={addEmotionalSymptom}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Emotional Symptom
      </Button>
    </div>
  );
}