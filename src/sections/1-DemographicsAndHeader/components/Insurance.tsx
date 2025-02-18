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

export function Insurance() {
  const { control } = useFormContext<Demographics>();

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Insurance Information</h3>
        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={control}
            name="insurance.provider"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="insurance-provider">Insurance Provider</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="insurance-provider"
                    placeholder="Insurance company name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="insurance.claimNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="insurance-claimNumber">Claim Number</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="insurance-claimNumber"
                    placeholder="Claim/Policy number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="insurance.adjustorName"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="insurance-adjustorName">Claims Adjustor</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="insurance-adjustorName"
                    placeholder="Adjustor name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="insurance.adjustorPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="insurance-adjustorPhone">Adjustor Phone</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="insurance-adjustorPhone"
                    placeholder="Adjustor phone"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="insurance.adjustorEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="insurance-adjustorEmail">Adjustor Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="insurance-adjustorEmail"
                    type="email"
                    placeholder="Adjustor email"
                  />
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