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
import { injurySchema } from '@/sections/2-Injuries/types';
import { InjuriesSection } from '@/sections/2-Injuries/InjuriesSection';

// Combined schema for entire assessment
const assessmentSchema = z.object({
  demographics: demographicsSchema,
  injuries: injurySchema,
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
      },
      injuries: {
        date: '',
        injuries: []
      },
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
              <TabsList className="grid w-full grid-cols-2 gap-2">
                <TabsTrigger value="demographics">Demographics</TabsTrigger>
                <TabsTrigger value="injuries">Injuries</TabsTrigger>
              </TabsList>

              <TabsContent value="demographics">
                {/* Demographics section component */}
              </TabsContent>
              
              <TabsContent value="injuries">
                <InjuriesSection />
              </TabsContent>
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