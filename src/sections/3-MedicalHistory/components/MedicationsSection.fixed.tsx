'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { PlusCircle, MinusCircle } from 'lucide-react';

export const MedicationsSectionFixed = () => {
  const { register, watch, setValue, getValues } = useFormContext();
  
  // Use watch to reactively update UI when medications change
  const medications = watch('currentMedications') || [];
  
  const addMedication = () => {
    try {
      const currentMedications = getValues('currentMedications') || [];
      setValue('currentMedications', [
        ...currentMedications,
        { name: '', dosage: '', frequency: '', prescribedFor: '', prescribedBy: '', status: 'current' }
      ], { shouldValidate: true });
    } catch (error) {
      console.error("Error adding medication:", error);
    }
  };
  
  const removeMedication = (index) => {
    try {
      const updatedMedications = [...medications];
      updatedMedications.splice(index, 1);
      setValue('currentMedications', updatedMedications, { shouldValidate: true });
    } catch (error) {
      console.error("Error removing medication:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Current Medications</h3>
        <Button 
          type="button" 
          variant="outline" 
          onClick={addMedication}
          className="flex items-center gap-1"
        >
          <PlusCircle className="h-4 w-4" />
          Add Medication
        </Button>
      </div>

      {medications.length === 0 && (
        <div className="text-center py-8 text-gray-500 border border-dashed rounded-md">
          No medications added. Click "Add Medication" to begin.
        </div>
      )}

      {medications.map((_, index) => (
        <div 
          key={index} 
          className="border rounded-md p-4 space-y-4 relative"
        >
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => removeMedication(index)}
            className="absolute right-2 top-2 text-gray-500 hover:text-red-500"
            size="sm"
          >
            <MinusCircle className="h-4 w-4" />
          </Button>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Medication Name *</label>
              <input
                {...register(`currentMedications.${index}.name`)}
                placeholder="Enter medication name"
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Dosage</label>
              <input
                {...register(`currentMedications.${index}.dosage`)}
                placeholder="E.g., 10mg, 500mg"
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Frequency</label>
              <input
                {...register(`currentMedications.${index}.frequency`)}
                placeholder="E.g., Once daily, Twice daily"
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select 
                {...register(`currentMedications.${index}.status`)}
                className="w-full p-2 border rounded-md"
              >
                <option value="current">Current</option>
                <option value="discontinued">Discontinued</option>
                <option value="as-needed">As Needed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Prescribed For</label>
              <input
                {...register(`currentMedications.${index}.prescribedFor`)}
                placeholder="Reason for prescription"
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Prescribed By</label>
              <input
                {...register(`currentMedications.${index}.prescribedBy`)}
                placeholder="Name of prescriber"
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Export both as default and named export
export default MedicationsSectionFixed;