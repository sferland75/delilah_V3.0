import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { PlusCircle, MinusCircle } from 'lucide-react';

export function SimpleTreatment() {
  const form = useFormContext();
  const { control } = form;
  
  // Safely get the array of treatments
  const formValues = form.getValues();
  const treatments = formValues?.data?.currentTreatments || [];
  
  // Add a new treatment
  const addTreatment = () => {
    try {
      console.log("Adding treatment");
      const newTreatments = [
        ...treatments,
        { 
          type: '', 
          provider: '', 
          facility: '', 
          status: 'ongoing', 
          notes: '', 
          startDate: '', 
          frequency: '' 
        }
      ];
      
      // Set the value in the form
      form.setValue('data.currentTreatments', newTreatments);
      console.log("New treatments:", newTreatments);
    } catch (error) {
      console.error("Error adding treatment:", error);
      alert("Error adding treatment: " + error.message);
    }
  };
  
  // Remove a treatment
  const removeTreatment = (index) => {
    try {
      const updatedTreatments = [...treatments];
      updatedTreatments.splice(index, 1);
      form.setValue('data.currentTreatments', updatedTreatments);
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

      {treatments.map((treatment, index) => (
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
            <FormField
              control={control}
              name={`data.currentTreatments.${index}.type`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Treatment Type *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="E.g., Physical Therapy, Surgery"
                      className="w-full p-2 border rounded-md"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`data.currentTreatments.${index}.provider`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Provider</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="Name of healthcare provider"
                      className="w-full p-2 border rounded-md"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`data.currentTreatments.${index}.facility`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Facility</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="Name of hospital or clinic"
                      className="w-full p-2 border rounded-md"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`data.currentTreatments.${index}.status`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Status</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      id={field.name}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                      <option value="planned">Planned</option>
                    </select>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`data.currentTreatments.${index}.startDate`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Start Date</FormLabel>
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

            <FormField
              control={control}
              name={`data.currentTreatments.${index}.frequency`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Frequency</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="E.g., Weekly, Monthly"
                      className="w-full p-2 border rounded-md"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name={`data.currentTreatments.${index}.notes`}
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor={field.name} className="text-sm font-medium mb-1">Notes</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    id={field.name}
                    placeholder="Additional details about this treatment"
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