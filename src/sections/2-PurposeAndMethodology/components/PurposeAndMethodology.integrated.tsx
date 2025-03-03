'use client';

import React, { useEffect, useState } from 'react';
import { Form } from '@/components/ui/form';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import { ReferralInfoSection } from './ReferralInfoSection';
import { AssessmentObjectivesSection } from './AssessmentObjectivesSection';
import { MethodologySection } from './MethodologySection';
import { AdditionalRequirementsSection } from './AdditionalRequirementsSection';
import { purposeSchema } from '../schema';
import type { Purpose } from '../schema';
import { useAssessment } from '@/contexts/AssessmentContext';

export function PurposeAndMethodologyIntegrated() {
  const { data, updateSection } = useAssessment();
  const contextData = data.purpose || {};
  const [dataLoaded, setDataLoaded] = useState(false);

  // Map context data to form structure with error handling
  const mapContextDataToForm = (): Purpose => {
    try {
      // Default form values
      const defaultFormValues: Purpose = {
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
      };

      // If no context data, return defaults
      if (!contextData || Object.keys(contextData).length === 0) {
        return defaultFormValues;
      }

      console.log("Mapping purpose and methodology data from context:", contextData);
      
      // Map referral information if available
      if (contextData.referralInfo) {
        defaultFormValues.referralInfo = {
          referralSource: contextData.referralInfo.referralSource || '',
          referralOrganization: contextData.referralInfo.referralOrganization || '',
          referralContact: contextData.referralInfo.referralContact || '',
          referralDate: contextData.referralInfo.referralDate || '',
          caseNumber: contextData.referralInfo.caseNumber || '',
          referralPurpose: contextData.referralInfo.referralPurpose || ''
        };
      }
      
      // Map assessment objectives if available
      if (contextData.assessmentObjectives) {
        defaultFormValues.assessmentObjectives = {
          primaryFocus: contextData.assessmentObjectives.primaryFocus || [],
          concernAreas: contextData.assessmentObjectives.concernAreas || '',
          expectedOutcomes: contextData.assessmentObjectives.expectedOutcomes || ''
        };
      }
      
      // Map methodology if available
      if (contextData.methodology) {
        defaultFormValues.methodology = {
          assessmentType: contextData.methodology.assessmentType || '',
          expectedDuration: contextData.methodology.expectedDuration || '',
          assessmentLocation: contextData.methodology.assessmentLocation || '',
          interpreterRequired: contextData.methodology.interpreterRequired || false,
          interpreterDetails: contextData.methodology.interpreterDetails || '',
          specialAccommodations: contextData.methodology.specialAccommodations || ''
        };
      }
      
      // Map additional requirements if available
      if (contextData.additionalRequirements) {
        defaultFormValues.additionalRequirements = {
          housekeepingCalc: contextData.additionalRequirements.housekeepingCalc || false,
          amaGuides: contextData.additionalRequirements.amaGuides || false,
          docRequirements: contextData.additionalRequirements.docRequirements || '',
          reportingPreferences: contextData.additionalRequirements.reportingPreferences || '',
          timelineRequirements: contextData.additionalRequirements.timelineRequirements || ''
        };
      }
      
      return defaultFormValues;
    } catch (error) {
      console.error("Error mapping purpose data:", error);
      // Return empty form data in case of error
      return {
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
      };
    }
  };
  
  const form = useForm<Purpose>({
    resolver: zodResolver(purposeSchema),
    mode: "onChange",
    defaultValues: mapContextDataToForm()
  });

  // Update form when context data changes
  useEffect(() => {
    try {
      if (contextData && Object.keys(contextData).length > 0) {
        console.log("Purpose and methodology context data changed:", contextData);
        const formData = mapContextDataToForm();
        form.reset(formData);
        setDataLoaded(true);
      }
    } catch (error) {
      console.error("Error updating form from context:", error);
    }
  }, [contextData]);

  const onSubmit = (formData: Purpose) => {
    try {
      console.log('Form submitted:', formData);
      
      // Update the context with the form data
      updateSection('purpose', formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-slate-800">Purpose & Methodology</h2>
        <p className="text-sm text-muted-foreground mt-1">Define assessment objectives and methodology based on referral source</p>
      </div>
      
      {dataLoaded && (
        <Alert className="mb-6 bg-blue-50 text-blue-800 border-blue-200">
          <InfoIcon className="h-4 w-4 text-blue-800" />
          <AlertTitle>Data Loaded From Assessment Context</AlertTitle>
          <AlertDescription>
            Some form fields have been pre-populated with data from the assessment context. You can review and modify the data as needed.
          </AlertDescription>
        </Alert>
      )}

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