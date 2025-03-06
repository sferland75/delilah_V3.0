'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormItem,
  FormLabel,
  FormControl,
} from '@/components/ui/form';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';

export const Insurance = () => {
  const { control } = useFormContext();

  return (
    <div className="w-full max-w-4xl">
      <div className="grid grid-cols-2 gap-6">
        <FormField
          control={control}
          name="insurance.provider"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Insurance Provider</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter insurance provider" 
                  {...field} 
                  className="w-full" 
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="insurance.claimNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Claim Number</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter claim number" 
                  {...field} 
                  className="w-full" 
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="insurance.adjustorName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adjustor Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter adjustor name" 
                  {...field} 
                  className="w-full" 
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="insurance.adjustorPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adjustor Phone</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter adjustor phone" 
                  {...field} 
                  className="w-full" 
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="insurance.adjustorEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adjustor Email</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter adjustor email"
                  type="email" 
                  {...field} 
                  className="w-full" 
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};