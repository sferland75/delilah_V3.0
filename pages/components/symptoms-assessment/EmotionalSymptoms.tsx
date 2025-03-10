import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '../../../src/components/ui/button';
import { PlusCircle, MinusCircle } from 'lucide-react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '../../../src/components/ui/form';
import { Input } from '../../../src/components/ui/input';
import { Textarea } from '../../../src/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../src/components/ui/select';
import type { Symptoms } from './schema';

export function EmotionalSymptoms() {
  const { control, getValues, setValue, watch } = useFormContext<Symptoms>();
  const emotional = watch('emotional') || [];

  const addEmotionalSymptom = () => {
    const currentEmotional = getValues('emotional') || [];
    setValue('emotional', [
      ...currentEmotional, 
      { type: '', severity: 'moderate', frequency: 'daily', impact: '', management: '' }
    ]);
  };

  const removeEmotionalSymptom = (index: number) => {
    const currentEmotional = getValues('emotional') || [];
    setValue('emotional', currentEmotional.filter((_, i) => i !== index));
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

      {emotional.map((_, index) => (
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <SelectValue placeholder="Select symptom type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="anxiety">Anxiety</SelectItem>
                      <SelectItem value="depression">Depression</SelectItem>
                      <SelectItem value="irritability">Irritability</SelectItem>
                      <SelectItem value="mood-swings">Mood Swings</SelectItem>
                      <SelectItem value="grief">Grief</SelectItem>
                      <SelectItem value="ptsd">PTSD Symptoms</SelectItem>
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
                      <SelectItem value="situational">Situational</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name={`emotional.${index}.impact`}
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Impact</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    id={field.name}
                    placeholder="Describe how this affects daily life..."
                    className="min-h-[80px] w-full p-2 border rounded-md"
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