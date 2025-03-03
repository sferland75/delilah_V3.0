import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { type MedicalHistory } from '../../types';

export function CurrentTreatment() {
  const { control } = useFormContext<{ data: MedicalHistory }>();

  return (
    <Card>
      <CardContent className="space-y-4">
        <FormField
          control={control}
          name="data.currentTreatments.0.type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Treatment Type</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  data-testid="input-currentTreatments.0.type"
                  placeholder="Enter treatment type"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="data.currentTreatments.0.provider"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Provider</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  data-testid="input-currentTreatments.0.provider"
                  placeholder="Enter provider name"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="data.currentTreatments.0.facility"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Facility</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  data-testid="input-currentTreatments.0.facility"
                  placeholder="Enter facility name"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="data.currentTreatments.0.status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Select
                  {...field}
                  data-testid="select-currentTreatments.0.status"
                  options={[
                    { value: 'ongoing', label: 'Ongoing' },
                    { value: 'completed', label: 'Completed' },
                    { value: 'planned', label: 'Planned' }
                  ]}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="data.currentTreatments.0.notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  data-testid="textarea-currentTreatments.0.notes"
                  placeholder="Enter treatment notes"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}