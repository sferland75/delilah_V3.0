'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export function ManualMuscle() {
  const form = useFormContext();
  
  if (!form) {
    return (
      <div className="p-4 border rounded-md bg-red-50 text-red-500">
        Form context is missing. Please ensure this component is used within a FormProvider.
      </div>
    );
  }
  
  const { setValue, watch } = form;
  
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

      <Accordion type="multiple" className="w-full space-y-4">
        {muscleGroups.map((muscleGroup) => {
          const groupKey = `data.manualMuscle.${muscleGroup.group}`;
          const isExpanded = watch(`${groupKey}.isExpanded`) || false;
          const checkboxId = `${groupKey}.isExpanded`;
          
          return (
            <AccordionItem key={muscleGroup.group} value={muscleGroup.group} className="border rounded-md p-4">
              <div className="flex items-center space-x-2 mb-4">
                <input 
                  type="checkbox"
                  id={checkboxId}
                  checked={isExpanded}
                  onChange={(e) => setValue(`${groupKey}.isExpanded`, e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="space-y-0.5">
                  <label htmlFor={checkboxId} className="text-lg font-semibold cursor-pointer">
                    {muscleGroup.title}
                  </label>
                  <p className="text-sm text-gray-500">
                    Check to assess this muscle group
                  </p>
                </div>
              </div>

              {isExpanded && (
                <div className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {muscleGroup.muscles.map((muscle) => {
                      const musclePath = `${groupKey}.${muscle.name}`;
                      
                      return (
                        <div key={muscle.name} className="border rounded-md p-3">
                          <h4 className="font-medium mb-3">{muscle.label}</h4>
                          
                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <div>
                              <label className="text-sm block mb-2">Right Side</label>
                              <select 
                                value={watch(`${musclePath}.right`) || '5'}
                                onChange={(e) => setValue(`${musclePath}.right`, e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                              >
                                {mmtGrades.map((grade) => (
                                  <option key={grade.value} value={grade.value}>
                                    {grade.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                            
                            <div>
                              <label className="text-sm block mb-2">Left Side</label>
                              <select 
                                value={watch(`${musclePath}.left`) || '5'}
                                onChange={(e) => setValue(`${musclePath}.left`, e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                              >
                                {mmtGrades.map((grade) => (
                                  <option key={grade.value} value={grade.value}>
                                    {grade.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 mb-2">
                            <input
                              type="checkbox"
                              id={`${musclePath}.painWithResistance`}
                              checked={watch(`${musclePath}.painWithResistance`) || false}
                              onChange={(e) => setValue(`${musclePath}.painWithResistance`, e.target.checked)}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor={`${musclePath}.painWithResistance`} className="text-sm font-normal">
                              Pain With Resistance
                            </label>
                          </div>
                          
                          <div>
                            <label htmlFor={`${musclePath}.notes`} className="text-sm block mb-2">Notes</label>
                            <textarea
                              id={`${musclePath}.notes`}
                              value={watch(`${musclePath}.notes`) || ''}
                              onChange={(e) => setValue(`${musclePath}.notes`, e.target.value)}
                              placeholder="Additional observations..."
                              className="min-h-[60px] text-sm w-full p-2 border border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-4">
                    <label htmlFor={`${groupKey}.generalNotes`} className="font-medium block mb-2">
                      General Notes for {muscleGroup.title}
                    </label>
                    <textarea
                      id={`${groupKey}.generalNotes`}
                      value={watch(`${groupKey}.generalNotes`) || ''}
                      onChange={(e) => setValue(`${groupKey}.generalNotes`, e.target.value)}
                      placeholder={`Add general observations for this muscle group...`}
                      className="min-h-[100px] w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              )}
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}