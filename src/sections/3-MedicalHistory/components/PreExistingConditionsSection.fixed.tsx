'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { PlusCircle, MinusCircle } from 'lucide-react';

export const PreExistingConditionsSectionFixed = () => {
  const { register, watch, setValue, getValues } = useFormContext();
  
  // Use watch to reactively update UI when preExistingConditions changes
  const preExistingConditions = watch('preExistingConditions') || [];
  
  const addCondition = () => {
    try {
      const currentConditions = getValues('preExistingConditions') || [];
      setValue('preExistingConditions', [
        ...currentConditions,
        { condition: '', status: 'active', details: '', diagnosisDate: '' }
      ], { shouldValidate: true });
    } catch (error) {
      console.error("Error adding condition:", error);
    }
  };
  
  const removeCondition = (index) => {
    try {
      const updatedConditions = [...preExistingConditions];
      updatedConditions.splice(index, 1);
      setValue('preExistingConditions', updatedConditions, { shouldValidate: true });
    } catch (error) {
      console.error("Error removing condition:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Pre-Existing Conditions</h3>
        <Button 
          type="button" 
          variant="outline" 
          onClick={addCondition}
          className="flex items-center gap-1"
        >
          <PlusCircle className="h-4 w-4" />
          Add Condition
        </Button>
      </div>

      {preExistingConditions.length === 0 && (
        <div className="text-center py-8 text-gray-500 border border-dashed rounded-md">
          No pre-existing conditions added. Click "Add Condition" to begin.
        </div>
      )}

      {preExistingConditions.map((_, index) => (
        <div 
          key={index} 
          className="border rounded-md p-4 space-y-4 relative"
        >
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => removeCondition(index)}
            className="absolute right-2 top-2 text-gray-500 hover:text-red-500"
            size="sm"
          >
            <MinusCircle className="h-4 w-4" />
          </Button>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Condition *</label>
              <input
                {...register(`preExistingConditions.${index}.condition`)}
                placeholder="Enter condition name"
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select 
                {...register(`preExistingConditions.${index}.status`)}
                className="w-full p-2 border rounded-md"
              >
                <option value="managed">Managed</option>
                <option value="active">Active</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Diagnosis Date</label>
              <input
                {...register(`preExistingConditions.${index}.diagnosisDate`)}
                type="date"
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Details</label>
            <textarea
              {...register(`preExistingConditions.${index}.details`)}
              placeholder="Add additional details about this condition"
              className="min-h-[80px] w-full p-2 border rounded-md"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// Export both as default and named export
export default PreExistingConditionsSectionFixed;