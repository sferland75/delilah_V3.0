import React from 'react';
import { Control } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Demographics } from '../types';

interface EmergencyContactFormProps {
  control: Control<{ demographics: Demographics }>;
}

export function EmergencyContactForm({ control }: EmergencyContactFormProps) {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Emergency Contact</h3>
      <div className="grid grid-cols-2 gap-6">
        <FormField
          control={control}
          name="demographics.emergencyContact.name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Contact name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="demographics.emergencyContact.phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Phone</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Contact phone" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="demographics.emergencyContact.relationship"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Relationship</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Relationship to client" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}