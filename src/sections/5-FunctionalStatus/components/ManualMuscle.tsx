'use client';

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
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function ManualMuscle() {
  const { control, watch } = useFormContext();
  
  const muscleGroups = [
    {
      group: 'shoulder',
      title: 'Shoulder',
      muscles: [
        { name: 'flexion', label: 'Flexion' },
        { name: 'extension', label: 'Extension' },
        { name: 'abduction', label: 'Abduction' },
        { name: 'adduction', label: 'Adduction' },
        { name: 'internalRotation', label: 'Internal Rotation' },
        { name: 'externalRotation', label: 'External Rotation' }
      ]
    },
    {
      group: 'elbow',
      title: 'Elbow',
      muscles: [
        { name: 'flexion', label: 'Flexion' },
        { name: 'extension', label: 'Extension' },
        { name: 'pronation', label: 'Pronation' },
        { name: 'supination', label: 'Supination' }
      ]
    },
    {
      group: 'wrist',
      title: 'Wrist',
      muscles: [
        { name: 'flexion', label: 'Flexion' },
        { name: 'extension', label: 'Extension' },
        { name: 'radialDeviation', label: 'Radial Deviation' },
        { name: 'ulnarDeviation', label: 'Ulnar Deviation' }
      ]
    },
    {
      group: 'hand',
      title: 'Hand & Fingers',
      muscles: [
        { name: 'gripStrength', label: 'Grip Strength' },
        { name: 'pinchStrength', label: 'Pinch Strength' },
        { name: 'fingerFlexion', label: 'Finger Flexion' },
        { name: 'fingerExtension', label: 'Finger Extension' },
        { name: 'thumbOpposition', label: 'Thumb Opposition' }
      ]
    },
    {
      group: 'hip',
      title: 'Hip',
      muscles: [
        { name: 'flexion', label: 'Flexion' },
        { name: 'extension', label: 'Extension' },
        { name: 'abduction', label: 'Abduction' },
        { name: 'adduction', label: 'Adduction' },
        { name: 'internalRotation', label: 'Internal Rotation' },
        { name: 'externalRotation', label: 'External Rotation' }
      ]
    },
    {
      group: 'knee',
      title: 'Knee',
      muscles: [
        { name: 'flexion', label: 'Flexion' },
        { name: 'extension', label: 'Extension' }
      ]
    },
    {
      group: 'ankle',
      title: 'Ankle & Foot',
      muscles: [
        { name: 'dorsiflexion', label: 'Dorsiflexion' },
        { name: 'plantarflexion', label: 'Plantarflexion' },
        { name: 'inversion', label: 'Inversion' },
        { name: 'eversion', label: 'Eversion' },
        { name: 'toeFlexion', label: 'Toe Flexion' },
        { name: 'toeExtension', label: 'Toe Extension' }
      ]
    },
    {
      group: 'trunk',
      title: 'Trunk & Core',
      muscles: [
        { name: 'flexion', label: 'Trunk Flexion' },
        { name: 'extension', label: 'Trunk Extension' },
        { name: 'rotation', label: 'Trunk Rotation' },
        { name: 'lateralFlexion', label: 'Lateral Flexion' }
      ]
    }
  ];

  // Manual muscle test grading scale
  const mmtGrades = [
    { value: '0', label: '0 - No contraction' },
    { value: '1', label: '1 - Trace contraction' },
    { value: '2-', label: '2- - Partial movement with gravity eliminated' },
    { value: '2', label: '2 - Full movement with gravity eliminated' },
    { value: '2+', label: '2+ - Partial movement against gravity' },
    { value: '3-', label: '3- - Moves against gravity, partial range' },
    { value: '3', label: '3 - Moves against gravity, full range' },
    { value: '3+', label: '3+ - Completes range against mild resistance' },
    { value: '4-', label: '4- - Completes range against moderate resistance' },
    { value: '4', label: '4 - Completes range against strong resistance' },
    { value: '4+', label: '4+ - Completes range against very strong resistance' },
    { value: '5', label: '5 - Normal strength' }
  ];

  return (
    <div className="space-y-8">
      <div className="bg-blue-50 rounded-md p-4 mb-6">
        <h3 className="font-semibold text-lg mb-2">Manual Muscle Testing Grade Scale</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1 text-sm">
          {mmtGrades.map((grade) => (
            <li key={grade.value} className="flex items-center space-x-1">
              <span className="font-semibold">{grade.value}:</span>
              <span>{grade.label.substring(grade.label.indexOf('-') + 2)}</span>
            </li>
          ))}
        </ul>
      </div>

      {muscleGroups.map((muscleGroup) => {
        const groupKey = `data.manualMuscle.${muscleGroup.group}`;
        const isExpanded = watch(`${groupKey}.isExpanded`);
        
        return (
          <div key={muscleGroup.group} className="border rounded-md p-4">
            <div className="flex items-center space-x-2 mb-4">
              <FormField
                control={control}
                name={`${groupKey}.isExpanded`}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-0.5">
                      <FormLabel className="text-lg font-semibold">
                        {muscleGroup.title}
                      </FormLabel>
                      <FormDescription>
                        Check to assess this muscle group
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {isExpanded && (
              <div className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {muscleGroup.muscles.map((muscle) => (
                    <div key={muscle.name} className="border rounded-md p-3">
                      <h4 className="font-medium mb-3">{muscle.label}</h4>
                      
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <FormField
                          control={control}
                          name={`${groupKey}.${muscle.name}.right`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">Right Side</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select grade" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {mmtGrades.map((grade) => (
                                    <SelectItem key={grade.value} value={grade.value}>
                                      {grade.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={control}
                          name={`${groupKey}.${muscle.name}.left`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">Left Side</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select grade" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {mmtGrades.map((grade) => (
                                    <SelectItem key={grade.value} value={grade.value}>
                                      {grade.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={control}
                        name={`${groupKey}.${muscle.name}.painWithResistance`}
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2 mb-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              Pain With Resistance
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={control}
                        name={`${groupKey}.${muscle.name}.notes`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">Notes</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Additional observations..."
                                className="min-h-[60px] text-sm"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </div>
                
                <FormField
                  control={control}
                  name={`${groupKey}.generalNotes`}
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel className="font-medium">General Notes for {muscleGroup.title}</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Add general observations for this muscle group..."
                          className="min-h-[100px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}