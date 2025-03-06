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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';

const rangeOptions = [
  { value: 'WNL', label: 'Within Normal Limits (90-100%)' },
  { value: '75', label: 'Mild Restriction (70-85%)' },
  { value: '50', label: 'Moderate Restriction (40-65%)' },
  { value: '25', label: 'Severe Restriction (15-35%)' },
  { value: '10', label: 'Minimal Movement (0-10%)' },
];

const jointRegions = [
  {
    region: 'cervical',
    title: 'Cervical Spine',
    movements: [
      { name: 'flexion', label: 'Flexion' },
      { name: 'extension', label: 'Extension' },
      { name: 'rotation', label: 'Rotation (L/R)' },
      { name: 'lateralFlexion', label: 'Lateral Flexion (L/R)' }
    ]
  },
  {
    region: 'thoracolumbar',
    title: 'Thoracolumbar Spine',
    movements: [
      { name: 'flexion', label: 'Flexion' },
      { name: 'extension', label: 'Extension' },
      { name: 'rotation', label: 'Rotation (L/R)' },
      { name: 'lateralFlexion', label: 'Lateral Flexion (L/R)' }
    ]
  },
  {
    region: 'upperExtremity',
    title: 'Upper Extremity',
    movements: [
      { name: 'shoulderFlexion', label: 'Shoulder Flexion (L/R)' },
      { name: 'shoulderAbduction', label: 'Shoulder Abduction (L/R)' },
      { name: 'elbowFlexion', label: 'Elbow Flexion (L/R)' },
      { name: 'wristFlexion', label: 'Wrist Flexion/Extension (L/R)' }
    ]
  },
  {
    region: 'lowerExtremity',
    title: 'Lower Extremity',
    movements: [
      { name: 'hipFlexion', label: 'Hip Flexion (L/R)' },
      { name: 'kneeFlexion', label: 'Knee Flexion (L/R)' },
      { name: 'ankleDorsiflexion', label: 'Ankle Dorsi/Plantar Flexion (L/R)' }
    ]
  }
];

export function SimpleROM() {
  const form = useFormContext();
  
  if (!form) {
    return (
      <div className="p-4 border rounded-md bg-red-50 text-red-500">
        Form context is missing. Please ensure this component is used within a FormProvider.
      </div>
    );
  }
  
  const { control } = form;

  return (
    <div className="space-y-4">
      <div className="p-4 border rounded-md bg-blue-50">
        <h3 className="font-medium text-blue-800">Range of Motion Assessment</h3>
        <p className="text-sm text-blue-700 mt-1">
          Select the joint regions to assess and choose the appropriate range of motion values.
          Range estimates are approximate and should be considered clinical estimates only.
        </p>
      </div>

      <Accordion type="multiple" className="w-full">
        {jointRegions.map((region) => (
          <AccordionItem key={region.region} value={region.region}>
            <AccordionTrigger className="text-lg font-medium py-2">
              {region.title}
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
                {region.movements.map((movement) => {
                  const fieldPath = `data.rangeOfMotion.${region.region}.${movement.name}`;
                  
                  return (
                    <div key={movement.name} className="border rounded-md p-3 bg-white">
                      <FormField
                        control={control}
                        name={`${fieldPath}.range`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium">{movement.label}</FormLabel>
                            <Select
                              value={field.value || 'WNL'}
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select range" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {rangeOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="mt-2 flex space-x-4">
                        <FormField
                          control={control}
                          name={`${fieldPath}.painLimited`}
                          render={({ field }) => (
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                checked={field.value || false}
                                onCheckedChange={field.onChange}
                                id={`${fieldPath}.painLimited`}
                              />
                              <label 
                                htmlFor={`${fieldPath}.painLimited`}
                                className="text-sm font-medium cursor-pointer"
                              >
                                Pain Limited
                              </label>
                            </div>
                          )}
                        />
                        
                        <FormField
                          control={control}
                          name={`${fieldPath}.weakness`}
                          render={({ field }) => (
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                checked={field.value || false}
                                onCheckedChange={field.onChange}
                                id={`${fieldPath}.weakness`}
                              />
                              <label 
                                htmlFor={`${fieldPath}.weakness`}
                                className="text-sm font-medium cursor-pointer"
                              >
                                Weakness
                              </label>
                            </div>
                          )}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <FormField
                control={control}
                name={`data.rangeOfMotion.${region.region}.notes`}
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value || ''}
                        placeholder="Add clinical observations, special tests, or clarifications..."
                        className="min-h-[80px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      
      <FormField
        control={control}
        name="data.rangeOfMotion.generalNotes"
        render={({ field }) => (
          <FormItem className="mt-6 border-t pt-4">
            <FormLabel className="text-lg font-medium">General ROM Assessment Notes</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                value={field.value || ''}
                placeholder="Enter overall findings, patterns, or compensatory movements observed..."
                className="min-h-[120px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

export default SimpleROM;