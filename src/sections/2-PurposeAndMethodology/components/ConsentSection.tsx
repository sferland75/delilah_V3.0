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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import type { Purpose } from '../schema';

export function ConsentSection() {
  const { control, watch } = useFormContext<Purpose>();
  const consentObtained = watch('consent.consentObtained');

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="consent.consentObtained"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                Consent Obtained
              </FormLabel>
              <FormDescription>
                Confirm that informed consent was obtained from the client
              </FormDescription>
            </div>
          </FormItem>
        )}
      />

      {consentObtained && (
        <>
          <FormField
            control={control}
            name="consent.consentDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor={field.name}>Date of Consent</FormLabel>
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

          <FormField
            control={control}
            name="consent.consentNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor={field.name}>Consent Notes</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    id={field.name}
                    placeholder="Additional notes about consent..."
                    className="min-h-[100px]"
                  />
                </FormControl>
                <FormDescription>
                  Document any specific conditions or limitations of consent
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
    </div>
  );
}