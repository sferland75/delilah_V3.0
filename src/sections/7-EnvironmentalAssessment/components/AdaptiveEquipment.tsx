'use client';

import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { FormState } from '../types';
import { PlusCircle, MinusCircle } from 'lucide-react';

export function AdaptiveEquipment() {
  const { control } = useFormContext<FormState>();
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "adaptiveEquipment.equipment",
  });

  const equipmentTypes = [
    "Mobility Device",
    "Bathroom Equipment",
    "Kitchen Aid",
    "Communication Device",
    "Home Modification",
    "Safety Equipment",
    "Other"
  ];

  const effectivenessLevels = [
    "Very Effective",
    "Moderately Effective",
    "Minimally Effective",
    "Not Effective",
    "Not Used",
    "Unknown"
  ];

  const addNewEquipment = () => {
    append({
      id: `equipment-${Date.now()}`,
      name: '',
      type: 'Mobility Device',
      location: '',
      purpose: '',
      effectiveness: 'Moderately Effective',
      isOwned: true,
      isRecommended: false,
      notes: ''
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center mb-5">
        <div className="w-full"></div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addNewEquipment}
          className="flex items-center gap-1"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add Equipment</span>
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center p-6 border border-dashed rounded-md">
          <p className="text-muted-foreground">No adaptive equipment added yet. Click "Add Equipment" to begin.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {fields.map((field, index) => (
            <div key={field.id} className="border rounded-md p-5">
              <div className="flex justify-end mb-5">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  className="h-8 w-8 p-0"
                >
                  <MinusCircle className="h-4 w-4 text-red-500" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
                <FormField
                  control={control}
                  name={`adaptiveEquipment.equipment.${index}.name`}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <label className="text-sm font-medium block mb-2">Equipment Name</label>
                      <Input
                        placeholder="e.g., Shower Chair, Walker"
                        {...field}
                      />
                    </div>
                  )}
                />

                <FormField
                  control={control}
                  name={`adaptiveEquipment.equipment.${index}.type`}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <label className="text-sm font-medium block mb-2">Equipment Type</label>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {equipmentTypes.map(type => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
                <FormField
                  control={control}
                  name={`adaptiveEquipment.equipment.${index}.location`}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <label className="text-sm font-medium block mb-2">Location</label>
                      <Input
                        placeholder="Where is this equipment used?"
                        {...field}
                      />
                    </div>
                  )}
                />

                <FormField
                  control={control}
                  name={`adaptiveEquipment.equipment.${index}.effectiveness`}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <label className="text-sm font-medium block mb-2">Effectiveness</label>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select effectiveness" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {effectivenessLevels.map(level => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />
              </div>

              <div className="space-y-2 mb-5">
                <label className="text-sm font-medium block mb-2">Purpose</label>
                <Textarea
                  placeholder="What is the purpose of this equipment?"
                  className="min-h-[80px] resize-none"
                  {...field.purpose}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={field.isOwned}
                    onCheckedChange={(checked) => {
                      // Handle checkbox change
                    }}
                  />
                  <label className="text-sm font-normal">Currently Owned/Used</label>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={field.isRecommended}
                    onCheckedChange={(checked) => {
                      // Handle checkbox change
                    }}
                  />
                  <label className="text-sm font-normal">Recommended (New)</label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium block mb-2">Notes</label>
                <Textarea
                  placeholder="Additional notes about this equipment"
                  className="min-h-[80px] resize-none"
                  {...field.notes}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <FormField
        control={control}
        name="adaptiveEquipment.generalNotes"
        render={({ field }) => (
          <div className="space-y-2">
            <label className="text-sm font-medium block mb-2">General Notes</label>
            <Textarea
              placeholder="Enter any additional information about adaptive equipment"
              className="min-h-[100px] resize-none"
              {...field}
            />
          </div>
        )}
      />
    </div>
  );
}