import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function SimpleInjuryDetails() {
  const { control } = useFormContext();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium mb-4">Injury Details</h3>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <FormField
          control={control}
          name="data.injury.date"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Date of Injury *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  id={field.name}
                  type="date"
                  className="w-full p-2 border rounded-md"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="data.injury.time"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Time of Injury</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  id={field.name}
                  type="time"
                  className="w-full p-2 border rounded-md"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-6">
        <FormField
          control={control}
          name="data.injury.impactType"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Mechanism of Injury *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="Describe how the injury occurred (e.g., fall, collision)"
                  className="w-full p-2 border rounded-md"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="data.injury.circumstance"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Circumstances</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  id={field.name}
                  placeholder="Provide additional details about how the injury occurred"
                  className="min-h-[100px] w-full p-2 border rounded-md"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="data.injury.immediateSymptoms"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Immediate Symptoms *</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  id={field.name}
                  placeholder="Describe symptoms experienced immediately after injury"
                  className="min-h-[100px] w-full p-2 border rounded-md"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="data.injury.initialTreatment"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Initial Treatment</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  id={field.name}
                  placeholder="Describe any immediate medical attention or first aid received"
                  className="min-h-[100px] w-full p-2 border rounded-md"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}