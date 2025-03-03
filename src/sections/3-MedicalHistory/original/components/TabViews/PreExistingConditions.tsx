import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { type MedicalHistory } from '../../types';

export function PreExistingConditions() {
  const { control } = useFormContext<{ data: MedicalHistory }>();

  return (
    <Card>
      <CardContent>
        <FormField
          control={control}
          name="data.preExistingConditions.0.condition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Condition</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  data-testid="input-preExistingConditions.0.condition"
                  placeholder="Enter condition"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="data.preExistingConditions.0.status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Select
                  {...field}
                  data-testid="select-preExistingConditions.0.status"
                  options={[
                    { value: 'managed', label: 'Managed' },
                    { value: 'active', label: 'Active' },
                    { value: 'resolved', label: 'Resolved' }
                  ]}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="data.preExistingConditions.0.details"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Details</FormLabel>
              <FormControl>
                <Textarea 
                  {...field}
                  data-testid="textarea-preExistingConditions.0.details"
                  placeholder="Enter details"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}