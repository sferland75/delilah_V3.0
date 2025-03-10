'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { PlusCircle, MinusCircle } from 'lucide-react';

export const TreatmentSectionFixed = () => {
  const { register, watch, setValue, getValues } = useFormContext();
  
  // Use watch to reactively update UI when treatments change
  const treatments = watch('currentTreatments') || [];
  
  const addTreatment = () => {
    try {
      const currentTreatments = getValues('currentTreatments') || [];
      setValue('currentTreatments', [
        ...currentTreatments,
        { type: '', provider: '', facility: '', startDate: '', frequency: '', status: 'ongoing', notes: '' }
      ], { shouldValidate: true });
    } catch (error) {
      console.error("Error adding treatment:", error);
    }
  };
  
  const removeTreatment = (index) => {
    try {
      const updatedTreatments = [...treatments];
      updatedTreatments.splice(index, 1);
      setValue('currentTreatments', updatedTreatments, { shouldValidate: true });
    } catch (error) {
      console.error("Error removing treatment:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Current Treatments</h3>
        <Button 
          type="button" 
          variant="outline" 
          onClick={addTreatment}
          className="flex items-center gap-1"
        >
          <PlusCircle className="h-4 w-4" />
          Add Treatment
        </Button>
      </div>

      {treatments.length === 0 && (
        <div className="text-center py-8 text-gray-500 border border-dashed rounded-md">
          No treatments added. Click "Add Treatment" to begin.
        </div>
      )}

      {treatments.map((_, index) => (
        <div 
          key={index} 
          className="border rounded-md p-4 space-y-4 relative"
        >
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => removeTreatment(index)}
            className="absolute right-2 top-2 text-gray-500 hover:text-red-500"
            size="sm"
          >
            <MinusCircle className="h-4 w-4" />
          </Button>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Treatment Type *</label>
              <input
                {...register(`currentTreatments.${index}.type`)}
                placeholder="E.g., Physical Therapy, Surgery"
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Provider</label>
              <input
                {...register(`currentTreatments.${index}.provider`)}
                placeholder="Name of healthcare provider"
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Facility</label>
              <input
                {...register(`currentTreatments.${index}.facility`)}
                placeholder="Name of hospital or clinic"
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                {...register(`currentTreatments.${index}.status`)}
                className="w-full p-2 border rounded-md"
              >
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="planned">Planned</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input
                {...register(`currentTreatments.${index}.startDate`)}
                type="date"
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Frequency</label>
              <input
                {...register(`currentTreatments.${index}.frequency`)}
                placeholder="E.g., Weekly, Monthly"
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              {...register(`currentTreatments.${index}.notes`)}
              placeholder="Additional details about this treatment"
              className="min-h-[80px] w-full p-2 border rounded-md"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// Export both as default and named export
export default TreatmentSectionFixed;