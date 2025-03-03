'use client';

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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Symptoms } from '../schema';

export function CognitiveSymptoms() {
  const { control } = useFormContext<Symptoms>();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <FormField
          control={control}
          name="cognitive.type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type of Issue</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="memory">Memory</SelectItem>
                  <SelectItem value="attention">Attention/Concentration</SelectItem>
                  <SelectItem value="processing">Processing Speed</SelectItem>
                  <SelectItem value="executive">Executive Function</SelectItem>
                  <SelectItem value="language">Language/Communication</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="cognitive.frequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Frequency</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="constant">Constant</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="situational">Situational</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="cognitive.impact"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Impact on Daily Life</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Describe how these issues affect daily activities..."
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="cognitive.management"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Management Strategies</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Current coping strategies and management techniques..."
                  className="min-h-[100px]"
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