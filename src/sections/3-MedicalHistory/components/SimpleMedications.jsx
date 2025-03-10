import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle, MinusCircle } from 'lucide-react';

export function SimpleMedications() {
  const form = useFormContext();
  const { control } = form;
  
  // Safely get the array of medications
  const formValues = form.getValues();
  const medications = formValues?.data?.currentMedications || [];
  
  // Add a new medication
  const addMedication = () => {
    try {
      console.log("Adding medication");
      const newMedications = [
        ...medications,
        { 
          name: '', 
          dosage: '', 
          frequency: '', 
          prescribedFor: '', 
          prescribedBy: '', 
          status: 'current' 
        }
      ];
      
      // Set the value in the form
      form.setValue('data.currentMedications', newMedications);
      console.log("New medications:", newMedications);
    } catch (error) {
      console.error("Error adding medication:", error);
      alert("Error adding medication: " + error.message);
    }
  };
  
  // Remove a medication
  const removeMedication = (index) => {
    try {
      const updatedMedications = [...medications];
      updatedMedications.splice(index, 1);
      form.setValue('data.currentMedications', updatedMedications);
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

      {medications.map((medication, index) => (
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
            <FormField
              control={control}
              name={`data.currentMedications.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Medication Name *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="Enter medication name"
                      className="w-full p-2 border rounded-md"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`data.currentMedications.${index}.dosage`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Dosage</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="E.g., 10mg, 500mg"
                      className="w-full p-2 border rounded-md"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`data.currentMedications.${index}.frequency`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Frequency</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="E.g., Once daily, Twice daily"
                      className="w-full p-2 border rounded-md"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`data.currentMedications.${index}.status`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Status</FormLabel>
                  <FormControl>
                    <select 
                      {...field}
                      id={field.name}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="current">Current</option>
                      <option value="discontinued">Discontinued</option>
                      <option value="as-needed">As Needed</option>
                    </select>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`data.currentMedications.${index}.prescribedFor`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Prescribed For</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="Reason for prescription"
                      className="w-full p-2 border rounded-md"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`data.currentMedications.${index}.prescribedBy`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Prescribed By</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="Name of prescriber"
                      className="w-full p-2 border rounded-md"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
      ))}
    </div>
  );
}