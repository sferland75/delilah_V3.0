'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export const Contact = () => {
  const { control } = useFormContext();

  return (
    <div className="w-full max-w-4xl">
      <div className="grid grid-cols-2 gap-6">
        <FormField
          control={control}
          name="contact.phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
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
          name="contact.email"
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
          name="contact.address"
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
          name="contact.city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter city" 
                  {...field} 
                  className="w-full" 
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="contact.province"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Province</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter province" 
                  {...field} 
                  className="w-full" 
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="contact.postalCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postal Code</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter postal code" 
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