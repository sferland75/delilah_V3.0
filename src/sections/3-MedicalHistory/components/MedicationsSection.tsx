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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { PlusCircle, MinusCircle } from 'lucide-react';
import type { FormState } from '../original/types';

export function MedicationsSection() {
  const { control, watch, setValue } = useFormContext<FormState>();
  
  const currentMedications = watch('data.currentMedications') || [];
  
  const addMedication = () => {
    setValue('data.currentMedications', [
      ...currentMedications,
      { name: '', dosage: '', frequency: '', prescribedFor: '', prescribedBy: '', status: '' }
    ], { shouldValidate: true });
  };
  
  const removeMedication = (index: number) => {
    const updatedMedications = [...currentMedications];
    updatedMedications.splice(index, 1);
    setValue('data.currentMedications', updatedMedications, { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Current Medications</h3>
        <Button 
          type="button" 
          variant="outline" 
          onClick={addMedication}
          className="flex items-center gap-1"
        >
          <PlusCircle className="h-4 w-4" />
          Add Medication
        </Button>
      </div>

      {currentMedications.length === 0 && (
        <div className="text-center py-8 text-gray-500 border border-dashed rounded-md">
          No medications added. Click "Add Medication" to begin.
        </div>
      )}

      {currentMedications.map((_, index) => (
        <div 
          key={index} 
          className="border rounded-md p-4 space-y-4 relative"
        >
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => removeMedication(index)}
            className="absolute right-2 top-2 text-gray-500 hover:text-red-500"
            size="sm"
          >
            <MinusCircle className="h-4 w-4" />
          </Button>

          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={control}
              name={`data.currentMedications.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Medication Name *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="Enter medication name"
                      className="w-full p-2 border rounded-md"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`data.currentMedications.${index}.dosage`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Dosage</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="E.g., 10mg, 500mg"
                      className="w-full p-2 border rounded-md"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`data.currentMedications.${index}.frequency`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Frequency</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="E.g., Once daily, Twice daily"
                      className="w-full p-2 border rounded-md"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`data.currentMedications.${index}.status`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Status</FormLabel>
                  <Select 
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger id={field.name} className="w-full p-2 border rounded-md">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="current">Current</SelectItem>
                      <SelectItem value="discontinued">Discontinued</SelectItem>
                      <SelectItem value="as-needed">As Needed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`data.currentMedications.${index}.prescribedFor`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Prescribed For</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="Reason for prescription"
                      className="w-full p-2 border rounded-md"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`data.currentMedications.${index}.prescribedBy`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Prescribed By</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="Name of prescriber"
                      className="w-full p-2 border rounded-md"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      ))}
    </div>
  );
}