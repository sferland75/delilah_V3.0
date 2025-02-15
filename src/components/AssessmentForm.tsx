import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AssessmentContext } from '@/contexts/AssessmentContext';

// Import all section schemas
import { demographicsSchema } from '@/sections/1-DemographicsAndHeader/types';

// Combined schema for entire assessment
const assessmentSchema = z.object({
  demographics: demographicsSchema,
  // Add other section schemas as we build them
});

type AssessmentData = z.infer<typeof assessmentSchema>;

export function AssessmentForm() {
  const methods = useForm<AssessmentData>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      demographics: {
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        // Add other default values
      },
      // Add other section defaults
    },
  });

  const onSubmit = async (data: AssessmentData) => {
    console.log('Assessment data:', data);
    // Handle submission
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Occupational Therapy Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="demographics" className="w-full">
              <TabsList className="grid w-full grid-cols- gap-2">
                <TabsTrigger value="demographics">Demographics</TabsTrigger>
                {/* Add other section tabs as we build them */}
              </TabsList>

              <TabsContent value="demographics">
                {/* Import and use the Demographics section component */}
              </TabsContent>
              {/* Add other section content as we build them */}
            </Tabs>

            <div className="flex justify-end gap-4 mt-6">
              <Button type="button" variant="outline">
                Save Draft
              </Button>
              <Button type="submit">
                Complete Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </FormProvider>
  );
}