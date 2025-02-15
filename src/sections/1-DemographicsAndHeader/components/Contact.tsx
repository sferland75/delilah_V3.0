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
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { Demographics } from '../schema';

export function Contact() {
  const { control, watch } = useFormContext<Demographics>();
  
  return (
    <div className="space-y-8">
      {/* Primary Contact Information */}
      <div>
        <h3 className="text-lg font-medium mb-4">Primary Contact</h3>
        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={control}
            name="contact.phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="(555) 555-5555" />
                </FormControl>
                <FormMessage />
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
                  <Input {...field} type="email" placeholder="email@example.com" />
                </FormControl>
                <FormMessage />
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
                  <Input {...field} placeholder="Street address" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Emergency Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Emergency Contact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={control}
              name="emergencyContact.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Contact name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="emergencyContact.relationship"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relationship</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Spouse, Parent" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="emergencyContact.phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="(555) 555-5555" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Additional Notes */}
      <FormDescription className="text-sm text-muted-foreground">
        Please ensure all contact information is current and accurate. The emergency contact should be someone who can be reached in case we cannot reach you directly.
      </FormDescription>
    </div>
  );
}