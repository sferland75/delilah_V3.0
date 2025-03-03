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
import type { Purpose } from '../schema';

export function PurposeSection() {
  const { control } = useFormContext<Purpose>();

  return (
    <div className="grid grid-cols-2 gap-6">
      <FormField
        control={control}
        name="purpose.primaryObjective"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel htmlFor={field.name}>Primary Objective</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                id={field.name}
                placeholder="Main purpose of the assessment..."
                className="min-h-[100px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="purpose.requestedBy"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor={field.name}>Requested By</FormLabel>
            <FormControl>
              <Input
                {...field}
                id={field.name}
                placeholder="Name of requester"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="purpose.referralDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor={field.name}>Referral Date</FormLabel>
            <FormControl>
              <Input
                {...field}
                id={field.name}
                type="date"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}