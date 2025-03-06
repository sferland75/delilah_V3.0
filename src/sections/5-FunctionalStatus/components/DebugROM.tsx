'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';

// Define range options
const rangeOptions = [
  { value: 'WNL', label: 'Within Normal Limits (90-100%)' },
  { value: '75', label: 'Mild Restriction (70-85%)' },
  { value: '50', label: 'Moderate Restriction (40-65%)' },
  { value: '25', label: 'Severe Restriction (15-35%)' },
  { value: '10', label: 'Minimal Movement (0-10%)' },
];

// Define regions with more movements
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

export function DebugROM() {
  const form = useFormContext();
  
  if (!form) {
    return <div>Form context missing</div>;
  }
  
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
                {region.movements.map((movement) => (
                  <div key={movement.name} className="border rounded-md p-3 bg-white">
                    <div>
                      <label className="block font-medium mb-1">{movement.label}</label>
                      <select 
                        className="w-full p-2 border rounded-md"
                        onChange={(e) => {
                          form.setValue(`data.rangeOfMotion.${region.region}.${movement.name}.range`, e.target.value);
                        }}
                        value={form.watch(`data.rangeOfMotion.${region.region}.${movement.name}.range`) || 'WNL'}
                      >
                        {rangeOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                      
                    <div className="mt-2 flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`${region.region}-${movement.name}-pain`}
                          checked={form.watch(`data.rangeOfMotion.${region.region}.${movement.name}.painLimited`) || false}
                          onChange={(e) => {
                            form.setValue(`data.rangeOfMotion.${region.region}.${movement.name}.painLimited`, e.target.checked);
                          }}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor={`${region.region}-${movement.name}-pain`} className="text-sm font-medium">
                          Pain Limited
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`${region.region}-${movement.name}-weakness`}
                          checked={form.watch(`data.rangeOfMotion.${region.region}.${movement.name}.weakness`) || false}
                          onChange={(e) => {
                            form.setValue(`data.rangeOfMotion.${region.region}.${movement.name}.weakness`, e.target.checked);
                          }}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor={`${region.region}-${movement.name}-weakness`} className="text-sm font-medium">
                          Weakness
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4">
                <label className="block font-medium mb-1">Additional Notes</label>
                <textarea
                  className="w-full p-2 border rounded-md min-h-[80px]"
                  value={form.watch(`data.rangeOfMotion.${region.region}.notes`) || ''}
                  onChange={(e) => {
                    form.setValue(`data.rangeOfMotion.${region.region}.notes`, e.target.value);
                  }}
                  placeholder="Add clinical observations, special tests, or clarifications..."
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      
      <div className="mt-6 border-t pt-4">
        <label className="block text-lg font-medium mb-1">General ROM Assessment Notes</label>
        <textarea
          className="w-full p-2 border rounded-md min-h-[120px]"
          value={form.watch('data.rangeOfMotion.generalNotes') || ''}
          onChange={(e) => {
            form.setValue('data.rangeOfMotion.generalNotes', e.target.value);
          }}
          placeholder="Enter overall findings, patterns, or compensatory movements observed..."
        />
      </div>
    </div>
  );
}

export default DebugROM;