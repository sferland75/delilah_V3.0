'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Purpose } from '../schema';

export function ReferralInfoSection() {
  const { control } = useFormContext<Purpose>();

  return (
    <div>
      <div className="grid grid-cols-2 gap-6 mb-6">
        <FormField
          control={control}
          name="referralInfo.referralSource"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Referral Source *</FormLabel>
              <Select 
                onValueChange={field.onChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger id={field.name} className="w-full p-2 border rounded-md">
                    <SelectValue placeholder="Select referral source" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="insurance">Insurance</SelectItem>
                  <SelectItem value="legal">Legal</SelectItem>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="self">Self</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="referralInfo.referralOrganization"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Organization/Company *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="Organization name"
                  className="w-full p-2 border rounded-md"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="referralInfo.referralContact"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Contact Person</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="Contact name"
                  className="w-full p-2 border rounded-md"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="referralInfo.referralDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Referral Date *</FormLabel>
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
          name="referralInfo.caseNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Case/File Number</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="Case or file number"
                  className="w-full p-2 border rounded-md"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div>
        <FormField
          control={control}
          name="referralInfo.referralPurpose"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Referral Purpose *</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  id={field.name}
                  placeholder="Describe the purpose of this referral..."
                  className="min-h-[100px] w-full p-2 border rounded-md"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}