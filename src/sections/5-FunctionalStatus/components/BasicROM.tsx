'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';

export function BasicROM() {
  const form = useFormContext();
  
  if (!form) {
    return <div>Form context missing</div>;
  }
  
  const { control } = form;
  
  const regions = [
    { id: 'cervical', name: 'Cervical Spine' },
    { id: 'thoracolumbar', name: 'Thoracolumbar Spine' },
    { id: 'upperExtremity', name: 'Upper Extremity' },
    { id: 'lowerExtremity', name: 'Lower Extremity' },
  ];

  return (
    <div className="p-4 border rounded-md">
      <h3 className="text-lg font-semibold mb-4">Range of Motion Assessment</h3>
      <p className="mb-4 text-sm text-slate-600">
        Select the joint regions to assess and choose the appropriate range of motion values.
        Range estimates are approximate and should be considered clinical estimates only.
      </p>
      
      <div className="space-y-4">
        {regions.map(region => (
          <div key={region.id} className="border p-4 rounded-md">
            <h4 className="font-medium text-lg mb-2">{region.name}</h4>
            <p className="text-sm text-slate-500">Select "Within Normal Limits" if no restrictions noted</p>
            
            <div className="mt-4">
              <select 
                className="w-full p-2 border rounded-md"
                onChange={(e) => {
                  form.setValue(`data.rangeOfMotion.${region.id}.status`, e.target.value);
                }}
                value={form.watch(`data.rangeOfMotion.${region.id}.status`) || 'WNL'}
              >
                <option value="WNL">Within Normal Limits (90-100%)</option>
                <option value="Mild">Mild Restriction (70-85%)</option>
                <option value="Moderate">Moderate Restriction (40-65%)</option>
                <option value="Severe">Severe Restriction (15-35%)</option>
                <option value="Minimal">Minimal Movement (0-10%)</option>
              </select>
            </div>
            
            <div className="mt-2 flex space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`${region.id}-pain`}
                  checked={form.watch(`data.rangeOfMotion.${region.id}.painLimited`) || false}
                  onChange={(e) => {
                    form.setValue(`data.rangeOfMotion.${region.id}.painLimited`, e.target.checked);
                  }}
                />
                <label htmlFor={`${region.id}-pain`}>Pain Limited</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`${region.id}-weakness`}
                  checked={form.watch(`data.rangeOfMotion.${region.id}.weakness`) || false}
                  onChange={(e) => {
                    form.setValue(`data.rangeOfMotion.${region.id}.weakness`, e.target.checked);
                  }}
                />
                <label htmlFor={`${region.id}-weakness`}>Weakness</label>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block mb-1">Notes</label>
              <textarea
                className="w-full p-2 border rounded-md"
                rows={3}
                value={form.watch(`data.rangeOfMotion.${region.id}.notes`) || ''}
                onChange={(e) => {
                  form.setValue(`data.rangeOfMotion.${region.id}.notes`, e.target.value);
                }}
                placeholder="Add clinical observations..."
              />
            </div>
          </div>
        ))}
        
        <div className="mt-6 border-t pt-4">
          <label className="block mb-1 font-medium">General ROM Assessment Notes</label>
          <textarea
            className="w-full p-2 border rounded-md"
            rows={4}
            value={form.watch(`data.rangeOfMotion.generalNotes`) || ''}
            onChange={(e) => {
              form.setValue(`data.rangeOfMotion.generalNotes`, e.target.value);
            }}
            placeholder="Enter overall findings, patterns, or compensatory movements observed..."
          />
        </div>
      </div>
    </div>
  );
}

export default BasicROM;