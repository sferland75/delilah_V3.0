'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function Transfers() {
  const { control } = useFormContext();

  const transferTypes = {
    bedMobility: {
      title: 'Bed Mobility',
      description: 'Ability to move in bed including rolling, supine to sit, etc.'
    },
    toileting: {
      title: 'Toileting',
      description: 'Ability to transfer to/from toilet or commode'
    }
  };

  const independenceLevels = [
    { value: 'independent', label: 'Independent - No assistance required' },
    { value: 'modified', label: 'Modified Independent - Uses device, takes more time' },
    { value: 'supervised', label: 'Supervised - Requires someone to watch/cue' },
    { value: 'dependent', label: 'Dependent - Requires physical assistance' }
  ];

  return (
    <div className="space-y-6">
      {Object.entries(transferTypes).map(([transfer, { title, description }]) => (
        <Card key={transfer}>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <FormDescription>{description}</FormDescription>

              <FormField
                control={control}
                name={`data.transfers.${transfer}.independence`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Level of Independence</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {independenceLevels.map(level => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`data.transfers.${transfer}.notes`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Add details about technique, assistance needed, or safety concerns..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}