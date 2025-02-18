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
                <FormLabel htmlFor="legalRep-name">Legal Representative Name</FormLabel>
                <FormControl>
                  <Input {...field} id="legalRep-name" placeholder="Representative name" />
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
                <FormLabel htmlFor="legalRep-firm">Law Firm</FormLabel>
                <FormControl>
                  <Input {...field} id="legalRep-firm" placeholder="Law firm name" />
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
                <FormLabel htmlFor="legalRep-phone">Phone Number</FormLabel>
                <FormControl>
                  <Input {...field} id="legalRep-phone" placeholder="Legal contact phone" />
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
                <FormLabel htmlFor="legalRep-email">Email</FormLabel>
                <FormControl>
                  <Input {...field} id="legalRep-email" type="email" placeholder="Legal contact email" />
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
                <FormLabel htmlFor="legalRep-address">Office Address</FormLabel>
                <FormControl>
                  <Input {...field} id="legalRep-address" placeholder="Legal office address" />
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
                <FormLabel htmlFor="legalRep-fileNumber">File Number</FormLabel>
                <FormControl>
                  <Input {...field} id="legalRep-fileNumber" placeholder="Legal file number" />
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