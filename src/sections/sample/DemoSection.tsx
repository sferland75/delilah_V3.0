import React from 'react';
import { z } from 'zod';
import { FormSectionBase } from '@/components/form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// Form validation schema
const demoSchema = z.object({
  clientName: z.string().min(1, 'Client name is required'),
  age: z.string().refine((val) => !isNaN(Number(val)), {
    message: 'Age must be a number',
  }),
  observations: z.string().optional(),
});

// Default values
const defaultValues = {
  clientName: '',
  age: '',
  observations: '',
};

// Map context data to form
const mapContextToForm = (contextData) => {
  const hasData = contextData && Object.keys(contextData).length > 0;
  
  if (hasData) {
    return {
      formData: {
        clientName: contextData.clientName || '',
        age: contextData.age || '',
        observations: contextData.observations || '',
      },
      hasData,
    };
  }
  
  return { formData: defaultValues, hasData: false };
};

// Map form data to context
const mapFormToContext = (formData) => {
  return {
    clientName: formData.clientName,
    age: formData.age,
    observations: formData.observations,
  };
};

export default function DemoSection() {
  // Form content renderer - receives form instance and dataLoaded flag
  const formContent = (form, dataLoaded, isSaving) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
        <FormField
          control={form.control}
          name="clientName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client Name</FormLabel>
              <FormControl>
                <Input {...field} disabled={isSaving} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Input {...field} disabled={isSaving} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="observations"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Observations</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                className="min-h-[150px]"
                disabled={isSaving}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
  
  return (
    <FormSectionBase
      title="Demo Section"
      sectionId="demoSection"
      schema={demoSchema}
      defaultValues={defaultValues}
      mapContextToForm={mapContextToForm}
      mapFormToContext={mapFormToContext}
      formContent={formContent}
      nextSection="/full-assessment?section=medical"
      previousSection={null}
    />
  );
}
