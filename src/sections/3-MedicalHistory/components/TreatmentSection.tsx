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
import type { FormState } from '../original/types';

export function TreatmentSection() {
  const { control, watch, setValue } = useFormContext<FormState>();
  
  const currentTreatments = watch('data.currentTreatments') || [];
  
  const addTreatment = () => {
    setValue('data.currentTreatments', [
      ...currentTreatments,
      { type: '', provider: '', facility: '', status: '', notes: '', startDate: '', endDate: '' }
    ], { shouldValidate: true });
  };
  
  const removeTreatment = (index: number) => {
    const updatedTreatments = [...currentTreatments];
    updatedTreatments.splice(index, 1);
    setValue('data.currentTreatments', updatedTreatments, { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Current Treatments</h3>
        <Button 
          type="button" 
          variant="outline" 
          onClick={addTreatment}
          className="flex items-center gap-1"
        >
          <PlusCircle className="h-4 w-4" />
          Add Treatment
        </Button>
      </div>

      {currentTreatments.length === 0 && (
        <div className="text-center py-8 text-gray-500 border border-dashed rounded-md">
          No treatments added. Click "Add Treatment" to begin.
        </div>
      )}

      {currentTreatments.map((_, index) => (
        <div 
          key={index} 
          className="border rounded-md p-4 space-y-4 relative"
        >
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => removeTreatment(index)}
            className="absolute right-2 top-2 text-gray-500 hover:text-red-500"
            size="sm"
          >
            <MinusCircle className="h-4 w-4" />
          </Button>

          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={control}
              name={`data.currentTreatments.${index}.type`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Treatment Type *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="E.g., Physical Therapy, Surgery"
                      className="w-full p-2 border rounded-md"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`data.currentTreatments.${index}.provider`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Provider</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="Name of healthcare provider"
                      className="w-full p-2 border rounded-md"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`data.currentTreatments.${index}.facility`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Facility</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="Name of hospital or clinic"
                      className="w-full p-2 border rounded-md"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`data.currentTreatments.${index}.status`}
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
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="planned">Planned</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`data.currentTreatments.${index}.startDate`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Start Date</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id={field.name}
                      type="date"
                      className="w-full p-2 border rounded-md"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`data.currentTreatments.${index}.endDate`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">End Date</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id={field.name}
                      type="date"
                      className="w-full p-2 border rounded-md"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name={`data.currentTreatments.${index}.notes`}
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Notes</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    id={field.name}
                    placeholder="Additional details about this treatment"
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