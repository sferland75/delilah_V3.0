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

export const Legal = () => {
  const { control } = useFormContext();

  return (
    <div className="w-full max-w-4xl">
      <div className="grid grid-cols-2 gap-6">
        <FormField
          control={control}
          name="legal.name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Legal Representative Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter representative name" 
                  {...field} 
                  className="w-full" 
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="legal.firm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Law Firm</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter law firm" 
                  {...field} 
                  className="w-full" 
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="legal.phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter phone number" 
                  {...field} 
                  className="w-full" 
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="legal.email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter email"
                  type="email" 
                  {...field} 
                  className="w-full" 
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="legal.address"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter address" 
                  {...field} 
                  className="w-full" 
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="legal.fileNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>File Number</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter file number" 
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