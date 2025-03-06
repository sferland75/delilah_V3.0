'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm, FormProvider } from 'react-hook-form';
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
import { useToast } from "@/components/ui/use-toast";
import { getAllAssessments } from '@/services/assessment-storage-service';

export const Demographics = () => {
  const router = useRouter();
  const { data, updateSection, saveCurrentAssessment, currentAssessmentId } = useAssessment();
  const { toast } = useToast();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Extract demographics data from the context if available
  const contextData = data.demographics || {};
  
  const methods = useForm<DemographicsType>({
    resolver: zodResolver(demographicsSchema),
    mode: "onChange",
    defaultValues: {
      personal: {
        firstName: '',
        lastName: '',
        dateOfBirth: '',
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
    }
  });

  // Load form data from context when the component mounts or when context data changes
  useEffect(() => {
    console.log("Demographics context data changed, updating form", data.demographics);
    try {
      // Only update if we have data in the context
      if (data.demographics) {
        const formValues = {
          personal: {
            firstName: data.demographics.personalInfo?.firstName || '',
            lastName: data.demographics.personalInfo?.lastName || '',
            dateOfBirth: data.demographics.personalInfo?.dateOfBirth || '',
          },
          contact: {
            phone: data.demographics.personalInfo?.phone || '',
            email: data.demographics.personalInfo?.email || '',
            address: data.demographics.personalInfo?.address || '',
            city: data.demographics.contactInfo?.city || '',
            province: data.demographics.contactInfo?.province || '',
            postalCode: data.demographics.contactInfo?.postalCode || '',
          },
          insurance: {
            provider: data.demographics.insuranceInfo?.provider || '',
            claimNumber: data.demographics.insuranceInfo?.claimNumber || '',
            adjustorName: data.demographics.insuranceInfo?.adjustorName || '',
            adjustorPhone: data.demographics.insuranceInfo?.adjustorPhone || '',
            adjustorEmail: data.demographics.insuranceInfo?.adjustorEmail || '',
          },
          legal: {
            name: data.demographics.legalInfo?.name || '',
            firm: data.demographics.legalInfo?.firm || '',
            phone: data.demographics.legalInfo?.phone || '',
            email: data.demographics.legalInfo?.email || '',
            address: data.demographics.legalInfo?.address || '',
            fileNumber: data.demographics.legalInfo?.fileNumber || '',
          }
        };
        
        console.log("Setting form values:", formValues);
        methods.reset(formValues);
        setIsLoaded(true);
      }
    } catch (error) {
      console.error("Error loading form data from context:", error);
    }
  }, [data, data.demographics, methods]);

  // Function to auto-save form data to context when values change
  useEffect(() => {
    // Only start auto-saving after initial load
    if (!isLoaded) return;
    
    // Get the current form values
    const currentValues = methods.getValues();
    console.log("Form values changed, auto-saving:", currentValues);
    
    // Save form data to context without forcing a full save
    const demographicsData = {
      personalInfo: {
        firstName: currentValues.personal.firstName,
        lastName: currentValues.personal.lastName,
        dateOfBirth: currentValues.personal.dateOfBirth,
        phone: currentValues.contact.phone,
        email: currentValues.contact.email,
        address: currentValues.contact.address,
      },
      contactInfo: {
        city: currentValues.contact.city,
        province: currentValues.contact.province,
        postalCode: currentValues.contact.postalCode,
      },
      insuranceInfo: {
        provider: currentValues.insurance.provider,
        claimNumber: currentValues.insurance.claimNumber,
        adjustorName: currentValues.insurance.adjustorName,
        adjustorPhone: currentValues.insurance.adjustorPhone,
        adjustorEmail: currentValues.insurance.adjustorEmail,
      },
      legalInfo: {
        name: currentValues.legal.name,
        firm: currentValues.legal.firm,
        phone: currentValues.legal.phone,
        email: currentValues.legal.email,
        address: currentValues.legal.address,
        fileNumber: currentValues.legal.fileNumber,
      }
    };
    
    // Update context without triggering a full save
    updateSection('demographics', demographicsData);
    
    // Setup the subscription to watch for form changes
    const subscription = methods.watch(() => {
      const updatedValues = methods.getValues();
      
      const updatedDemographicsData = {
        personalInfo: {
          firstName: updatedValues.personal.firstName,
          lastName: updatedValues.personal.lastName,
          dateOfBirth: updatedValues.personal.dateOfBirth,
          phone: updatedValues.contact.phone,
          email: updatedValues.contact.email,
          address: updatedValues.contact.address,
        },
        contactInfo: {
          city: updatedValues.contact.city,
          province: updatedValues.contact.province,
          postalCode: updatedValues.contact.postalCode,
        },
        insuranceInfo: {
          provider: updatedValues.insurance.provider,
          claimNumber: updatedValues.insurance.claimNumber,
          adjustorName: updatedValues.insurance.adjustorName,
          adjustorPhone: updatedValues.insurance.adjustorPhone,
          adjustorEmail: updatedValues.insurance.adjustorEmail,
        },
        legalInfo: {
          name: updatedValues.legal.name,
          firm: updatedValues.legal.firm,
          phone: updatedValues.legal.phone,
          email: updatedValues.legal.email,
          address: updatedValues.legal.address,
          fileNumber: updatedValues.legal.fileNumber,
        }
      };
      
      // Update the context on each form change
      updateSection('demographics', updatedDemographicsData);
    });
    
    // Clean up subscription on unmount
    return () => subscription.unsubscribe();
  }, [methods, updateSection, isLoaded]);

  const onSubmit = async (formData: DemographicsType) => {
    try {
      setIsSaving(true);
      console.log('Form submitted:', formData);
      
      // Convert form data to the structure expected by the context
      const demographicsData = {
        personalInfo: {
          firstName: formData.personal.firstName,
          lastName: formData.personal.lastName,
          dateOfBirth: formData.personal.dateOfBirth,
          phone: formData.contact.phone,
          email: formData.contact.email,
          address: formData.contact.address,
        },
        contactInfo: {
          city: formData.contact.city,
          province: formData.contact.province,
          postalCode: formData.contact.postalCode,
        },
        insuranceInfo: {
          provider: formData.insurance.provider,
          claimNumber: formData.insurance.claimNumber,
          adjustorName: formData.insurance.adjustorName,
          adjustorPhone: formData.insurance.adjustorPhone,
          adjustorEmail: formData.insurance.adjustorEmail,
        },
        legalInfo: {
          name: formData.legal.name,
          firm: formData.legal.firm,
          phone: formData.legal.phone,
          email: formData.legal.email,
          address: formData.legal.address,
          fileNumber: formData.legal.fileNumber,
        }
      };
      
      // Update the assessment date in the metadata
      if (data.metadata) {
        const updatedMetadata = {
          ...data.metadata,
          assessmentDate: data.metadata.assessmentDate || new Date().toISOString()
        };
        updateSection('metadata', updatedMetadata);
      }
      
      // Update the context with the form data
      updateSection('demographics', demographicsData);
      
      // Explicitly save the assessment - this is very important
      const success = saveCurrentAssessment();
      
      if (success) {
        toast({
          title: "Demographics Saved",
          description: "Your demographics information has been saved successfully.",
          variant: "success"
        });
        
        // Force a hard reload to ensure all components see the updated data
        window.location.href = `/full-assessment?section=${router.query.section || 'initial'}&id=${currentAssessmentId}`;
      } else {
        toast({
          title: "Save Failed",
          description: "There was an error saving demographics. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error Saving Demographics",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-slate-800">Demographics</h2>
        <p className="text-sm text-muted-foreground mt-1">Personal information and assessment details</p>
      </div>

      <FormProvider {...methods}>
        {/* Remove Form component and use div wrapper */}
        <div className="w-full">
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
              onClick={() => methods.reset()}
              type="button"
            >
              Reset
            </Button>
            <Button 
              type="button"
              onClick={methods.handleSubmit(onSubmit)}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Demographics'}
            </Button>
          </div>
        </div>
      </FormProvider>
    </div>
  );
};