import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
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
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { type FormState, type PreExistingCondition } from '../../types';

export function PreExistingConditions() {
  const { control } = useFormContext<FormState>();
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'data.preExistingConditions'
  });

  const addCondition = () => {
    append({
      condition: '',
      diagnosisDate: '',
      status: 'active',
      details: ''
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-slate-800">Pre-Existing Conditions</h3>
        <p className="text-sm text-slate-600 mb-4">Document medical conditions prior to the incident</p>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="bg-white rounded-lg border shadow-sm p-4 space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name={`data.preExistingConditions.${index}.condition`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Condition</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter condition" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`data.preExistingConditions.${index}.diagnosisDate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diagnosis Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={control}
                name={`data.preExistingConditions.${index}.status`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="managed">Managed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`data.preExistingConditions.${index}.details`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Details</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Enter condition details" className="min-h-[100px]" />
                    </FormControl>
                    <FormDescription>
                      Include treatment history and impact on daily activities
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-600 hover:text-red-700"
              onClick={() => remove(index)}
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={addCondition}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Condition
      </Button>
    </div>
  );
}