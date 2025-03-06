'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
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
import { useToast } from "@/components/ui/use-toast";
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateSectionThunk, saveCurrentAssessmentThunk } from '@/store/slices/assessmentSlice';
import { addToast } from '@/store/slices/uiSlice';

export const DemographicsRedux = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const currentId = useAppSelector(state => state.assessments.currentId);
  const currentData = useAppSelector(state => state.assessments.currentData);
  const saveStatus = useAppSelector(state => state.assessments.loading.save);
  
  // Extract demographics data from Redux state
  const demographicsData = currentData.demographics || {};
  
  const form = useForm<DemographicsType>({
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

  // Load form data from Redux when the component mounts or when data changes
  useEffect(() => {
    console.log("Demographics Redux data changed, updating form", demographicsData);
    try {
      // Only update if we have data
      if (demographicsData) {
        const formValues = {
          personal: {
            firstName: demographicsData.personalInfo?.firstName || '',
            lastName: demographicsData.personalInfo?.lastName || '',
            dateOfBirth: demographicsData.personalInfo?.dateOfBirth || '',
          },
          contact: {
            phone: demographicsData.personalInfo?.phone || '',
            email: demographicsData.personalInfo?.email || '',
            address: demographicsData.personalInfo?.address || '',
            city: demographicsData.contactInfo?.city || '',
            province: demographicsData.contactInfo?.province || '',
            postalCode: demographicsData.contactInfo?.postalCode || '',
          },
          insurance: {
            provider: demographicsData.insuranceInfo?.provider || '',
            claimNumber: demographicsData.insuranceInfo?.claimNumber || '',
            adjustorName: demographicsData.insuranceInfo?.adjustorName || '',
            adjustorPhone: demographicsData.insuranceInfo?.adjustorPhone || '',
            adjustorEmail: demographicsData.insuranceInfo?.adjustorEmail || '',
          },
          legal: {
            name: demographicsData.legalInfo?.name || '',
            firm: demographicsData.legalInfo?.firm || '',
            phone: demographicsData.legalInfo?.phone || '',
            email: demographicsData.legalInfo?.email || '',
            address: demographicsData.legalInfo?.address || '',
            fileNumber: demographicsData.legalInfo?.fileNumber || '',
          }
        };
        
        console.log("Setting form values:", formValues);
        form.reset(formValues);
        setIsLoaded(true);
      }
    } catch (error) {
      console.error("Error loading form data from Redux:", error);
    }
  }, [demographicsData, form]);

  // Function to auto-save form data to Redux when values change
  useEffect(() => {
    // Only start auto-saving after initial load
    if (!isLoaded) return;
    
    // Get the current form values
    const currentValues = form.getValues();
    console.log("Form values changed, auto-saving:", currentValues);
    
    // Save form data without forcing a full save
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
    
    // Update Redux without triggering a full save
    dispatch(updateSectionThunk({ 
      sectionName: 'demographics', 
      sectionData: demographicsData 
    }));
    
    // Setup the subscription to watch for form changes
    const subscription = form.watch(() => {
      const updatedValues = form.getValues();
      
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
      dispatch(updateSectionThunk({ 
        sectionName: 'demographics', 
        sectionData: updatedDemographicsData 
      }));
    });
    
    // Clean up subscription on unmount
    return () => subscription.unsubscribe();
  }, [form, dispatch, isLoaded]);

  const onSubmit = async (formData: DemographicsType) => {
    try {
      setIsSaving(true);
      console.log('Redux: Form submitted:', formData);
      
      // Convert form data to the structure expected by the store
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
      
      // Update the Redux store
      await dispatch(updateSectionThunk({ 
        sectionName: 'demographics', 
        sectionData: demographicsData 
      }));
      
      // Save the assessment
      const resultAction = await dispatch(saveCurrentAssessmentThunk());
      
      if (saveCurrentAssessmentThunk.fulfilled.match(resultAction)) {
        toast({
          title: "Demographics Saved",
          description: "Your demographics information has been saved successfully.",
          variant: "success"
        });
        
        // Force a hard reload to ensure all components see the updated data
        window.location.href = `/full-assessment?section=${router.query.section || 'initial'}&id=${currentId}`;
      } else {
        toast({
          title: "Save Failed",
          description: "There was an error saving demographics. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error submitting form with Redux:', error);
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
              disabled={isSaving || saveStatus === 'loading'}
            >
              {isSaving || saveStatus === 'loading' ? 'Saving...' : 'Save Demographics'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};