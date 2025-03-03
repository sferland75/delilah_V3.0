'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { Personal } from './Personal';
import { Contact } from './Contact';
import { Insurance } from './Insurance';
import { Legal } from './Legal';
import { demographicsSchema } from '../schema';
import type { Demographics as DemographicsType } from '../schema';
import { useAssessment } from '@/contexts/AssessmentContext';
import { ErrorBoundary } from "@/components/ui/error-boundary";

// Create default values outside the component to prevent re-creation on render
const defaultFormValues: DemographicsType = {
  personal: {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    healthCardNumber: '',
  },
  contact: {
    phone: '',
    email: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
  },
  insurance: {
    provider: '',
    claimNumber: '',
    adjustorName: '',
    adjustorPhone: '',
    adjustorEmail: '',
  },
  legal: {
    name: '',
    firm: '',
    phone: '',
    email: '',
    address: '',
    fileNumber: '',
  }
};

// Export both as named export and default export
export const DemographicsIntegrated = () => {
  const { data, updateSection } = useAssessment();
  const [dataLoaded, setDataLoaded] = useState(false);
  
  // Extract demographics data from the context if available
  const contextData = data?.demographics || {};
  
  // Map context data to form structure with comprehensive error handling - moved to useCallback
  const mapContextDataToForm = useCallback((): DemographicsType => {
    try {
      // If no context data, return defaults
      if (!contextData || Object.keys(contextData).length === 0) {
        return defaultFormValues;
      }

      console.log("Mapping demographics data from context:", contextData);
      
      // Create a copy of the default values to populate
      const formData = { ...defaultFormValues };
      
      // Map personal information
      if (contextData.personalInfo) {
        formData.personal = {
          firstName: contextData.personalInfo.firstName || '',
          lastName: contextData.personalInfo.lastName || '',
          dateOfBirth: contextData.personalInfo.dateOfBirth || '',
          gender: contextData.personalInfo.gender || '',
          healthCardNumber: contextData.personalInfo.healthCardNumber || '',
        };
        
        // Map contact information if available
        formData.contact = {
          phone: contextData.personalInfo.phone || '',
          email: contextData.personalInfo.email || '',
          address: contextData.personalInfo.address || '',
          city: contextData.personalInfo.city || '',
          province: contextData.personalInfo.province || '',
          postalCode: contextData.personalInfo.postalCode || '',
        };
      }
      
      // Map insurance information if available
      if (contextData.referralInfo?.insurance) {
        formData.insurance = {
          provider: contextData.referralInfo.insurance.provider || '',
          claimNumber: contextData.referralInfo.insurance.claimNumber || '',
          adjustorName: contextData.referralInfo.insurance.adjustorName || '',
          adjustorPhone: contextData.referralInfo.insurance.adjustorPhone || '',
          adjustorEmail: contextData.referralInfo.insurance.adjustorEmail || '',
        };
      }
      
      // Map legal information if available
      if (contextData.referralInfo?.legal) {
        formData.legal = {
          name: contextData.referralInfo.legal.name || '',
          firm: contextData.referralInfo.legal.firm || '',
          phone: contextData.referralInfo.legal.phone || '',
          email: contextData.referralInfo.legal.email || '',
          address: contextData.referralInfo.legal.address || '',
          fileNumber: contextData.referralInfo.legal.fileNumber || '',
        };
      }
      
      return formData;
    } catch (error) {
      console.error("Error mapping demographics data:", error);
      // Return empty form data in case of error
      return defaultFormValues;
    }
  }, [contextData]);
  
  // Define form with static default values
  const form = useForm<DemographicsType>({
    resolver: zodResolver(demographicsSchema),
    mode: "onChange",
    defaultValues: defaultFormValues
  });

  // Update form when context data changes - FIXED: Now properly in useEffect
  useEffect(() => {
    try {
      if (contextData && Object.keys(contextData).length > 0) {
        console.log("Demographics context data changed:", contextData);
        const formData = mapContextDataToForm();
        form.reset(formData);
        setDataLoaded(true);
      }
    } catch (error) {
      console.error("Error updating form from context:", error);
    }
  }, [contextData, form, mapContextDataToForm]);

  const onSubmit = async (formData: DemographicsType) => {
    try {
      console.log('Form submitted:', formData);
      
      // Convert form data to the structure expected by the context
      const demographicsData = {
        personalInfo: {
          firstName: formData.personal.firstName,
          lastName: formData.personal.lastName,
          dateOfBirth: formData.personal.dateOfBirth,
          gender: formData.personal.gender,
          healthCardNumber: formData.personal.healthCardNumber,
          // Add contact information
          phone: formData.contact.phone,
          email: formData.contact.email,
          address: formData.contact.address,
          city: formData.contact.city,
          province: formData.contact.province,
          postalCode: formData.contact.postalCode,
        },
        referralInfo: {
          insurance: {
            provider: formData.insurance.provider,
            claimNumber: formData.insurance.claimNumber,
            adjustorName: formData.insurance.adjustorName,
            adjustorPhone: formData.insurance.adjustorPhone,
            adjustorEmail: formData.insurance.adjustorEmail,
          },
          legal: {
            name: formData.legal.name,
            firm: formData.legal.firm,
            phone: formData.legal.phone,
            email: formData.legal.email,
            address: formData.legal.address,
            fileNumber: formData.legal.fileNumber,
          }
        }
      };
      
      // Update the context with the form data
      updateSection('demographics', demographicsData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-slate-800">Demographics</h2>
          <p className="text-sm text-muted-foreground mt-1">Personal information and assessment details</p>
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
            <Tabs defaultValue="personal" className="w-full border rounded-md">
              <TabsList className="grid w-full grid-cols-4 p-0 h-auto border-b">
                <TabsTrigger 
                  className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
                  value="personal"
                >
                  Personal
                </TabsTrigger>
                <TabsTrigger 
                  className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
                  value="contact"
                >
                  Contact
                </TabsTrigger>
                <TabsTrigger 
                  className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
                  value="insurance"
                >
                  Insurance
                </TabsTrigger>
                <TabsTrigger 
                  className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
                  value="legal"
                >
                  Legal
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="p-6">
                <ErrorBoundary>
                  <Personal />
                </ErrorBoundary>
              </TabsContent>
              
              <TabsContent value="contact" className="p-6">
                <ErrorBoundary>
                  <Contact />
                </ErrorBoundary>
              </TabsContent>
              
              <TabsContent value="insurance" className="p-6">
                <ErrorBoundary>
                  <Insurance />
                </ErrorBoundary>
              </TabsContent>
              
              <TabsContent value="legal" className="p-6">
                <ErrorBoundary>
                  <Legal />
                </ErrorBoundary>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-2 mt-4">
              <Button 
                variant="outline" 
                onClick={() => form.reset(defaultFormValues)}
                type="button"
              >
                Reset
              </Button>
              <Button 
                type="submit"
              >
                Save Demographics
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </ErrorBoundary>
  );
};

// Add default export
export default DemographicsIntegrated;
export const Demographics = DemographicsIntegrated;