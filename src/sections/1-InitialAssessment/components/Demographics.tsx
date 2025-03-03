'use client';

import React, { useEffect } from 'react';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Personal } from './Personal';
import { Contact } from './Contact';
import { Insurance } from './Insurance';
import { Legal } from './Legal';
import { demographicsSchema } from '../schema';
import type { Demographics as DemographicsType } from '../schema';
import { useAssessment } from '@/contexts/AssessmentContext';

export const Demographics = () => {
  const { data, updateSection } = useAssessment();
  
  // Extract demographics data from the context if available
  const contextData = data.demographics || {};
  
  const form = useForm<DemographicsType>({
    resolver: zodResolver(demographicsSchema),
    mode: "onChange",
    defaultValues: {
      personal: {
        firstName: contextData.personalInfo?.firstName || '',
        lastName: contextData.personalInfo?.lastName || '',
        dateOfBirth: contextData.personalInfo?.dateOfBirth || '',
      },
      contact: {
        phone: contextData.personalInfo?.phone || '',
        email: contextData.personalInfo?.email || '',
        address: contextData.personalInfo?.address || '',
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
    }
  });

  // Log context data for debugging
  useEffect(() => {
    console.log("Assessment context data:", data);
    if (data.demographics) {
      console.log("Demographics data from context:", data.demographics);
      // Reset form with the latest data from context
      form.reset({
        personal: {
          firstName: data.demographics.personalInfo?.firstName || '',
          lastName: data.demographics.personalInfo?.lastName || '',
          dateOfBirth: data.demographics.personalInfo?.dateOfBirth || '',
        },
        contact: {
          phone: data.demographics.personalInfo?.phone || '',
          email: data.demographics.personalInfo?.email || '',
          address: data.demographics.personalInfo?.address || '',
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
      });
    }
  }, [data, form]);

  const onSubmit = async (formData: DemographicsType) => {
    try {
      console.log('Form submitted:', formData);
      
      // Convert form data to the structure expected by the context
      const demographicsData = {
        personalInfo: {
          firstName: formData.personal.firstName,
          lastName: formData.personal.lastName,
          dateOfBirth: formData.personal.dateOfBirth,
          // Add other fields as needed
        },
        // Add other sections as needed
      };
      
      // Update the context with the form data
      updateSection('demographics', demographicsData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-slate-800">Demographics</h2>
        <p className="text-sm text-muted-foreground mt-1">Personal information and assessment details</p>
      </div>

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
              <Personal />
            </TabsContent>
            
            <TabsContent value="contact" className="p-6">
              <Contact />
            </TabsContent>
            
            <TabsContent value="insurance" className="p-6">
              <Insurance />
            </TabsContent>
            
            <TabsContent value="legal" className="p-6">
              <Legal />
            </TabsContent>
          </Tabs>

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
              Save Demographics
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};