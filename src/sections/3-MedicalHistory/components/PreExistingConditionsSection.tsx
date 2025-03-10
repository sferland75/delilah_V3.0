import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { PlusCircle, MinusCircle } from 'lucide-react';

// Directly define component without exports or imports
const PreExistingConditionsSection = () => {
  const { control, watch, setValue } = useFormContext();
  
  const preExistingConditions = watch('data.preExistingConditions') || [];
  
  const addCondition = () => {
    setValue('data.preExistingConditions', [
      ...preExistingConditions,
      { condition: '', status: '', details: '', diagnosisDate: '' }
    ], { shouldValidate: true });
  };
  
  const removeCondition = (index) => {
    const updatedConditions = [...preExistingConditions];
    updatedConditions.splice(index, 1);
    setValue('data.preExistingConditions', updatedConditions, { shouldValidate: true });
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`data.preExistingConditions.${index}.status`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Status</FormLabel>
                  <Select 
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger id={field.name} className="w-full p-2 border rounded-md">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="managed">Managed</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
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
                  <FormMessage />
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
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ))}
    </div>
  );
};

// Export both as default and named export
export { PreExistingConditionsSection };
export default PreExistingConditionsSection;