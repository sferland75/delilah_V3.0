import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { type MedicalHistory } from '../../types';

export function Medications() {
  const { control } = useFormContext<{ data: MedicalHistory }>();

  return (
    <Card>
      <CardContent className="space-y-4">
        <FormField
          control={control}
          name="data.currentMedications.0.name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Medication Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  data-testid="input-currentMedications.0.name"
                  placeholder="Enter medication name"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="data.currentMedications.0.dosage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dosage</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  data-testid="input-currentMedications.0.dosage"
                  placeholder="Enter dosage"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="data.currentMedications.0.frequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Frequency</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  data-testid="input-currentMedications.0.frequency"
                  placeholder="Enter frequency"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="data.currentMedications.0.prescribedFor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prescribed For</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  data-testid="input-currentMedications.0.prescribedFor"
                  placeholder="Enter reason for prescription"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="data.currentMedications.0.prescribedBy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prescribed By</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  data-testid="input-currentMedications.0.prescribedBy"
                  placeholder="Enter prescriber name"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="data.currentMedications.0.status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Select
                  {...field}
                  data-testid="select-currentMedications.0.status"
                  options={[
                    { value: 'current', label: 'Current' },
                    { value: 'discontinued', label: 'Discontinued' },
                    { value: 'as-needed', label: 'As Needed' }
                  ]}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}