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
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { type FormState } from '../../types';

export function Medications() {
  const { control } = useFormContext<FormState>();
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'data.currentMedications'
  });

  const addMedication = () => {
    append({
      name: '',
      dosage: '',
      frequency: '',
      prescribedFor: '',
      prescribedBy: '',
      startDate: '',
      endDate: '',
      status: 'current'
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-slate-800">Current Medications</h3>
        <p className="text-sm text-slate-600 mb-4">Document all current medications and prescriptions</p>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="bg-white rounded-lg border shadow-sm p-4 space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name={`data.currentMedications.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medication Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter medication name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`data.currentMedications.${index}.dosage`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dosage</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter dosage" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name={`data.currentMedications.${index}.frequency`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequency</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="How often taken" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`data.currentMedications.${index}.prescribedFor`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prescribed For</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Reason for prescription" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={control}
                  name={`data.currentMedications.${index}.prescribedBy`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prescribed By</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Prescribing physician" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`data.currentMedications.${index}.startDate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`data.currentMedications.${index}.status`}
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
                          <SelectItem value="current">Current</SelectItem>
                          <SelectItem value="discontinued">Discontinued</SelectItem>
                          <SelectItem value="as-needed">As Needed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
        onClick={addMedication}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Medication
      </Button>
    </div>
  );
}