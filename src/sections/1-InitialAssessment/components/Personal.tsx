'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';

export const Personal = () => {
  const { control } = useFormContext();

  return (
    <div className="w-full max-w-4xl">
      <div className="grid grid-cols-2 gap-6">
        <FormField
          control={control}
          name="personal.firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name<span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter first name" 
                  {...field} 
                  className="w-full" 
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="personal.lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name<span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter last name" 
                  {...field} 
                  className="w-full" 
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="personal.dateOfBirth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth</FormLabel>
              <FormControl>
                <Input 
                  placeholder="yyyy-mm-dd" 
                  {...field} 
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};