import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { PlusCircle, MinusCircle } from 'lucide-react';

// Simple component without TypeScript interfaces
export function SimplePreExisting() {
  const form = useFormContext();
  const { control } = form;
  
  // Safely get the array of conditions
  const formValues = form.getValues();
  const conditions = formValues?.data?.preExistingConditions || [];
  
  // Add a new condition
  const addCondition = () => {
    try {
      console.log("Adding condition");
      const newConditions = [
        ...conditions,
        { condition: '', status: 'active', details: '', diagnosisDate: '' }
      ];
      
      // Set the value in the form
      form.setValue('data.preExistingConditions', newConditions);
      console.log("New conditions:", newConditions);
    } catch (error) {
      console.error("Error adding condition:", error);
      alert("Error adding condition: " + error.message);
    }
  };
  
  // Remove a condition
  const removeCondition = (index) => {
    try {
      const updatedConditions = [...conditions];
      updatedConditions.splice(index, 1);
      form.setValue('data.preExistingConditions', updatedConditions);
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

      {conditions.length === 0 && (
        <div className="text-center py-8 text-gray-500 border border-dashed rounded-md">
          No pre-existing conditions added. Click "Add Condition" to begin.
        </div>
      )}

      {conditions.map((condition, index) => (
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
            <FormField
              control={control}
              name={`data.preExistingConditions.${index}.condition`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Condition *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="Enter condition name"
                      className="w-full p-2 border rounded-md"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`data.preExistingConditions.${index}.status`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Status</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      id={field.name}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="active">Active</option>
                      <option value="managed">Managed</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`data.preExistingConditions.${index}.diagnosisDate`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Diagnosis Date</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id={field.name}
                      type="date"
                      className="w-full p-2 border rounded-md"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name={`data.preExistingConditions.${index}.details`}
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Details</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    id={field.name}
                    placeholder="Add additional details about this condition"
                    className="min-h-[80px] w-full p-2 border rounded-md"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      ))}
    </div>
  );
}