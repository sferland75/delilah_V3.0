'use client';

import React from 'react';
import { Form } from '@/components/ui/form';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReferralInfoSection } from './ReferralInfoSection';
import { AssessmentObjectivesSection } from './AssessmentObjectivesSection';
import { MethodologySection } from './MethodologySection';
import { AdditionalRequirementsSection } from './AdditionalRequirementsSection';
import { purposeSchema } from '../schema';
import type { Purpose } from '../schema';

export function PurposeAndMethodology() {
  const form = useForm<Purpose>({
    resolver: zodResolver(purposeSchema),
    mode: "onChange",
    defaultValues: {
      referralInfo: {
        referralSource: '',
        referralOrganization: '',
        referralContact: '',
        referralDate: '',
        caseNumber: '',
        referralPurpose: ''
      },
      assessmentObjectives: {
        primaryFocus: [],
        concernAreas: '',
        expectedOutcomes: ''
      },
      methodology: {
        assessmentType: '',
        expectedDuration: '',
        assessmentLocation: '',
        interpreterRequired: false,
        interpreterDetails: '',
        specialAccommodations: ''
      },
      additionalRequirements: {
        housekeepingCalc: false,
        amaGuides: false,
        docRequirements: '',
        reportingPreferences: '',
        timelineRequirements: ''
      }
    }
  });

  const onSubmit = (data: Purpose) => {
    console.log('Form data:', data);
    // Save data and navigate to next section
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-slate-800">Purpose & Methodology</h2>
        <p className="text-sm text-muted-foreground mt-1">Define assessment objectives and methodology based on referral source</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <FormProvider {...form}>
            <Tabs defaultValue="referral" className="w-full border rounded-md">
              <TabsList className="grid w-full grid-cols-4 p-0 h-auto border-b">
                <TabsTrigger 
                  className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
                  value="referral"
                >
                  Referral Information
                </TabsTrigger>
                <TabsTrigger 
                  className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
                  value="objectives"
                >
                  Assessment Objectives
                </TabsTrigger>
                <TabsTrigger 
                  className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
                  value="methodology"
                >
                  Methodology
                </TabsTrigger>
                <TabsTrigger 
                  className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
                  value="additional"
                >
                  Additional Requirements
                </TabsTrigger>
              </TabsList>

              <TabsContent value="referral" className="p-6">
                <ReferralInfoSection />
              </TabsContent>
              
              <TabsContent value="objectives" className="p-6">
                <AssessmentObjectivesSection />
              </TabsContent>
              
              <TabsContent value="methodology" className="p-6">
                <MethodologySection />
              </TabsContent>
              
              <TabsContent value="additional" className="p-6">
                <AdditionalRequirementsSection />
              </TabsContent>
            </Tabs>
          </FormProvider>

          <div className="flex justify-end space-x-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => form.reset()}
              type="button"
            >
              Reset
            </Button>
            <Button 
              type="submit"
            >
              Save Purpose & Methodology
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}