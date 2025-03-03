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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

export function RangeOfMotion() {
  const { control, watch } = useFormContext();
  
  const bodyRegions = [
    {
      region: 'cervical',
      title: 'Cervical Spine',
      movements: [
        { name: 'flexion', label: 'Flexion' },
        { name: 'extension', label: 'Extension' },
        { name: 'leftLateralFlexion', label: 'Left Lateral Flexion' },
        { name: 'rightLateralFlexion', label: 'Right Lateral Flexion' },
        { name: 'leftRotation', label: 'Left Rotation' },
        { name: 'rightRotation', label: 'Right Rotation' }
      ]
    },
    {
      region: 'shoulder',
      title: 'Shoulder',
      movements: [
        { name: 'leftFlexion', label: 'Left Flexion' },
        { name: 'rightFlexion', label: 'Right Flexion' },
        { name: 'leftExtension', label: 'Left Extension' },
        { name: 'rightExtension', label: 'Right Extension' },
        { name: 'leftAbduction', label: 'Left Abduction' },
        { name: 'rightAbduction', label: 'Right Abduction' },
        { name: 'leftAdduction', label: 'Left Adduction' },
        { name: 'rightAdduction', label: 'Right Adduction' },
        { name: 'leftInternalRotation', label: 'Left Internal Rotation' },
        { name: 'rightInternalRotation', label: 'Right Internal Rotation' },
        { name: 'leftExternalRotation', label: 'Left External Rotation' },
        { name: 'rightExternalRotation', label: 'Right External Rotation' }
      ]
    },
    {
      region: 'elbow',
      title: 'Elbow',
      movements: [
        { name: 'leftFlexion', label: 'Left Flexion' },
        { name: 'rightFlexion', label: 'Right Flexion' },
        { name: 'leftExtension', label: 'Left Extension' },
        { name: 'rightExtension', label: 'Right Extension' },
        { name: 'leftPronation', label: 'Left Pronation' },
        { name: 'rightPronation', label: 'Right Pronation' },
        { name: 'leftSupination', label: 'Left Supination' },
        { name: 'rightSupination', label: 'Right Supination' }
      ]
    },
    {
      region: 'wrist',
      title: 'Wrist',
      movements: [
        { name: 'leftFlexion', label: 'Left Flexion' },
        { name: 'rightFlexion', label: 'Right Flexion' },
        { name: 'leftExtension', label: 'Left Extension' },
        { name: 'rightExtension', label: 'Right Extension' },
        { name: 'leftRadialDeviation', label: 'Left Radial Deviation' },
        { name: 'rightRadialDeviation', label: 'Right Radial Deviation' },
        { name: 'leftUlnarDeviation', label: 'Left Ulnar Deviation' },
        { name: 'rightUlnarDeviation', label: 'Right Ulnar Deviation' }
      ]
    },
    {
      region: 'thoracicAndLumbar',
      title: 'Thoracic & Lumbar Spine',
      movements: [
        { name: 'flexion', label: 'Flexion' },
        { name: 'extension', label: 'Extension' },
        { name: 'leftLateralFlexion', label: 'Left Lateral Flexion' },
        { name: 'rightLateralFlexion', label: 'Right Lateral Flexion' },
        { name: 'leftRotation', label: 'Left Rotation' },
        { name: 'rightRotation', label: 'Right Rotation' }
      ]
    },
    {
      region: 'hip',
      title: 'Hip',
      movements: [
        { name: 'leftFlexion', label: 'Left Flexion' },
        { name: 'rightFlexion', label: 'Right Flexion' },
        { name: 'leftExtension', label: 'Left Extension' },
        { name: 'rightExtension', label: 'Right Extension' },
        { name: 'leftAbduction', label: 'Left Abduction' },
        { name: 'rightAbduction', label: 'Right Abduction' },
        { name: 'leftAdduction', label: 'Left Adduction' },
        { name: 'rightAdduction', label: 'Right Adduction' },
        { name: 'leftInternalRotation', label: 'Left Internal Rotation' },
        { name: 'rightInternalRotation', label: 'Right Internal Rotation' },
        { name: 'leftExternalRotation', label: 'Left External Rotation' },
        { name: 'rightExternalRotation', label: 'Right External Rotation' }
      ]
    },
    {
      region: 'knee',
      title: 'Knee',
      movements: [
        { name: 'leftFlexion', label: 'Left Flexion' },
        { name: 'rightFlexion', label: 'Right Flexion' },
        { name: 'leftExtension', label: 'Left Extension' },
        { name: 'rightExtension', label: 'Right Extension' }
      ]
    },
    {
      region: 'ankle',
      title: 'Ankle',
      movements: [
        { name: 'leftDorsiflexion', label: 'Left Dorsiflexion' },
        { name: 'rightDorsiflexion', label: 'Right Dorsiflexion' },
        { name: 'leftPlantarflexion', label: 'Left Plantarflexion' },
        { name: 'rightPlantarflexion', label: 'Right Plantarflexion' },
        { name: 'leftInversion', label: 'Left Inversion' },
        { name: 'rightInversion', label: 'Right Inversion' },
        { name: 'leftEversion', label: 'Left Eversion' },
        { name: 'rightEversion', label: 'Right Eversion' }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {bodyRegions.map((region) => {
        const regionKey = `data.rangeOfMotion.${region.region}`;
        const isExpanded = watch(`${regionKey}.isExpanded`);
        
        return (
          <div key={region.region} className="border rounded-md p-4">
            <div className="flex items-center space-x-2 mb-4">
              <FormField
                control={control}
                name={`${regionKey}.isExpanded`}
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
                        {region.title}
                      </FormLabel>
                      <FormDescription>
                        Check to record measurements for this region
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {isExpanded && (
              <div className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {region.movements.map((movement) => (
                    <div key={movement.name} className="space-y-3 border rounded-md p-3">
                      <FormField
                        control={control}
                        name={`${regionKey}.${movement.name}.value`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium">
                              {movement.label}
                            </FormLabel>
                            <div className="flex items-center space-x-2">
                              <FormControl>
                                <Input
                                  {...field}
                                  type="number"
                                  placeholder="Degrees"
                                  min={0}
                                  max={180}
                                  onChange={e => field.onChange(e.target.value ? Number(e.target.value) : null)}
                                  className="w-full"
                                />
                              </FormControl>
                              <span className="text-sm">°</span>
                            </div>
                            <FormDescription className="text-xs">
                              Normal: {getNormalROM(region.region, movement.name)}°
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={control}
                        name={`${regionKey}.${movement.name}.limitationType`}
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel className="text-sm font-medium">Limitation Type</FormLabel>
                            <select
                              {...field}
                              className="w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                            >
                              <option value="">Select type</option>
                              <option value="pain">Pain Limited</option>
                              <option value="mechanical">Mechanically Limited</option>
                              <option value="weakness">Weakness Limited</option>
                              <option value="apprehension">Apprehension Limited</option>
                            </select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name={`${regionKey}.${movement.name}.notes`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Notes</FormLabel>
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
                  name={`${regionKey}.generalNotes`}
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel className="font-medium">General Notes for {region.title}</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Add general observations for this region..."
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

// Helper function to get normal ROM values
function getNormalROM(region, movement) {
  const normalValues = {
    cervical: {
      flexion: '45-50',
      extension: '55-70',
      leftLateralFlexion: '40-45',
      rightLateralFlexion: '40-45',
      leftRotation: '70-80',
      rightRotation: '70-80'
    },
    shoulder: {
      leftFlexion: '160-180',
      rightFlexion: '160-180',
      leftExtension: '50-60',
      rightExtension: '50-60',
      leftAbduction: '170-180',
      rightAbduction: '170-180',
      leftAdduction: '50-75',
      rightAdduction: '50-75',
      leftInternalRotation: '60-80',
      rightInternalRotation: '60-80',
      leftExternalRotation: '80-90',
      rightExternalRotation: '80-90'
    },
    elbow: {
      leftFlexion: '140-150',
      rightFlexion: '140-150',
      leftExtension: '0-10',
      rightExtension: '0-10',
      leftPronation: '80-90',
      rightPronation: '80-90',
      leftSupination: '80-90',
      rightSupination: '80-90'
    },
    wrist: {
      leftFlexion: '80-90',
      rightFlexion: '80-90',
      leftExtension: '70-80',
      rightExtension: '70-80',
      leftRadialDeviation: '15-20',
      rightRadialDeviation: '15-20',
      leftUlnarDeviation: '30-35',
      rightUlnarDeviation: '30-35'
    },
    thoracicAndLumbar: {
      flexion: '60-90',
      extension: '20-30',
      leftLateralFlexion: '25-35',
      rightLateralFlexion: '25-35',
      leftRotation: '30-45',
      rightRotation: '30-45'
    },
    hip: {
      leftFlexion: '110-120',
      rightFlexion: '110-120',
      leftExtension: '10-20',
      rightExtension: '10-20',
      leftAbduction: '40-45',
      rightAbduction: '40-45',
      leftAdduction: '20-30',
      rightAdduction: '20-30',
      leftInternalRotation: '30-40',
      rightInternalRotation: '30-40',
      leftExternalRotation: '40-50',
      rightExternalRotation: '40-50'
    },
    knee: {
      leftFlexion: '130-140',
      rightFlexion: '130-140',
      leftExtension: '0-10',
      rightExtension: '0-10'
    },
    ankle: {
      leftDorsiflexion: '15-20',
      rightDorsiflexion: '15-20',
      leftPlantarflexion: '40-50',
      rightPlantarflexion: '40-50',
      leftInversion: '30-35',
      rightInversion: '30-35',
      leftEversion: '15-20',
      rightEversion: '15-20'
    }
  };

  return normalValues[region]?.[movement] || 'N/A';
}