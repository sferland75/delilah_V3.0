import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { type MedicalHistory } from '../../types';

export function InjuryMechanism() {
  const { control } = useFormContext<{ data: MedicalHistory }>();

  return (
    <Card>
      <CardContent className="space-y-4">
        <FormField
          control={control}
          name="data.injury.date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Injury</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="date"
                  id="injury.date"
                  data-testid="input-injury.date"
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
              <FormLabel>Time of Injury</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="time"
                  id="injury.time"
                  data-testid="input-injury.time"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="data.injury.impactType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mechanism of Injury</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  id="injury.impactType"
                  data-testid="input-injury.impactType"
                  placeholder="Describe how the injury occurred"
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
              <FormLabel>Circumstances</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  id="injury.circumstance"
                  data-testid="textarea-injury.circumstance"
                  placeholder="Describe circumstances of injury"
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
              <FormLabel>Immediate Symptoms</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  id="injury.immediateSymptoms"
                  data-testid="textarea-injury.immediateSymptoms"
                  placeholder="Describe symptoms after injury"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}