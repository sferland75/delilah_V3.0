'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';

export const InjuryDetailsSectionFixed = () => {
  const { register } = useFormContext();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium mb-4">Injury Details</h3>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Date of Injury *</label>
          <input
            {...register('injury.date')}
            type="date"
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Time of Injury</label>
          <input
            {...register('injury.time')}
            type="time"
            className="w-full p-2 border rounded-md"
          />
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Position during injury</label>
          <input
            {...register('injury.position')}
            placeholder="E.g., sitting, standing, lying down"
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Mechanism of Injury *</label>
          <input
            {...register('injury.impactType')}
            placeholder="Describe how the injury occurred (e.g., fall, collision)"
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Circumstances</label>
          <textarea
            {...register('injury.circumstance')}
            placeholder="Provide additional details about how the injury occurred"
            className="min-h-[100px] w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Immediate Symptoms *</label>
          <textarea
            {...register('injury.immediateSymptoms')}
            placeholder="Describe symptoms experienced immediately after injury"
            className="min-h-[100px] w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Initial Treatment</label>
          <textarea
            {...register('injury.initialTreatment')}
            placeholder="Describe any immediate medical attention or first aid received"
            className="min-h-[100px] w-full p-2 border rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

// Export both as default and named export
export default InjuryDetailsSectionFixed;