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
import { Demographics } from '../schema';

export function Legal() {
  const { control } = useFormContext<Demographics>();

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Legal Representative Information</h3>
        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={control}
            name="legalRep.name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Legal Representative Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Representative name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="legalRep.firm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Law Firm</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Law firm name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="legalRep.phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Legal contact phone" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="legalRep.email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" placeholder="Legal contact email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="legalRep.address"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Office Address</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Legal office address" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="legalRep.fileNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>File Number</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Legal file number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}