'use client';

import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAssessment } from '@/contexts/AssessmentContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { demographicsSchema } from './schema';
import { ErrorBoundary } from '@/components/ui/error-boundary';

export function SimpleDemographics() {
  const { data, updateSection, saveCurrentAssessment } = useAssessment();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Initialize form with schema validation
  const methods = useForm({
    resolver: zodResolver(demographicsSchema),
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

  // Load data from context when available
  useEffect(() => {
    if (data?.demographics) {
      try {
        console.log('Loading demographics data from context');
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
        methods.reset(formValues);
      } catch (error) {
        console.error('Error loading demographics data:', error);
        toast({
          title: 'Error loading data',
          description: 'There was a problem loading the demographics data.',
          variant: 'destructive',
        });
      }
    }
    setLoading(false);
  }, [data?.demographics, methods]);

  const onSubmit = async (formData) => {
    try {
      setSaving(true);
      console.log('Form submitted:', formData);
      
      // Map form data to context format
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
      
      // Update context
      updateSection('demographics', demographicsData);
      
      // Save current assessment
      const success = saveCurrentAssessment();
      
      if (success) {
        toast({
          title: 'Saved successfully',
          description: 'Demographics information has been saved.',
        });
      } else {
        toast({
          title: 'Save failed',
          description: 'There was a problem saving the demographics information.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error saving demographics data:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while saving.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading demographics data...</div>;
  }

  return (
    <ErrorBoundary>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Demographics Information</h2>
        
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="insurance">Insurance</TabsTrigger>
                <TabsTrigger value="legal">Legal</TabsTrigger>
              </TabsList>
              
              <TabsContent value="personal" className="mt-4">
                <Card className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        {...methods.register('personal.firstName')}
                        placeholder="First Name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        {...methods.register('personal.lastName')}
                        placeholder="Last Name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        {...methods.register('personal.dateOfBirth')}
                      />
                    </div>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="contact" className="mt-4">
                <Card className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        {...methods.register('contact.phone')}
                        placeholder="Phone Number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        {...methods.register('contact.email')}
                        placeholder="Email Address"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        {...methods.register('contact.address')}
                        placeholder="Street Address"
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        {...methods.register('contact.city')}
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <Label htmlFor="province">Province/State</Label>
                      <Input
                        id="province"
                        {...methods.register('contact.province')}
                        placeholder="Province/State"
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Postal/Zip Code</Label>
                      <Input
                        id="postalCode"
                        {...methods.register('contact.postalCode')}
                        placeholder="Postal/Zip Code"
                      />
                    </div>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="insurance" className="mt-4">
                <Card className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="provider">Insurance Provider</Label>
                      <Input
                        id="provider"
                        {...methods.register('insurance.provider')}
                        placeholder="Provider Name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="claimNumber">Claim Number</Label>
                      <Input
                        id="claimNumber"
                        {...methods.register('insurance.claimNumber')}
                        placeholder="Claim Number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="adjustorName">Adjustor Name</Label>
                      <Input
                        id="adjustorName"
                        {...methods.register('insurance.adjustorName')}
                        placeholder="Adjustor Name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="adjustorPhone">Adjustor Phone</Label>
                      <Input
                        id="adjustorPhone"
                        {...methods.register('insurance.adjustorPhone')}
                        placeholder="Adjustor Phone"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="adjustorEmail">Adjustor Email</Label>
                      <Input
                        id="adjustorEmail"
                        type="email"
                        {...methods.register('insurance.adjustorEmail')}
                        placeholder="Adjustor Email"
                      />
                    </div>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="legal" className="mt-4">
                <Card className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="legalName">Lawyer Name</Label>
                      <Input
                        id="legalName"
                        {...methods.register('legal.name')}
                        placeholder="Lawyer Name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="firm">Law Firm</Label>
                      <Input
                        id="firm"
                        {...methods.register('legal.firm')}
                        placeholder="Law Firm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="legalPhone">Phone</Label>
                      <Input
                        id="legalPhone"
                        {...methods.register('legal.phone')}
                        placeholder="Phone Number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="legalEmail">Email</Label>
                      <Input
                        id="legalEmail"
                        type="email"
                        {...methods.register('legal.email')}
                        placeholder="Email Address"
                      />
                    </div>
                    <div>
                      <Label htmlFor="legalAddress">Address</Label>
                      <Input
                        id="legalAddress"
                        {...methods.register('legal.address')}
                        placeholder="Office Address"
                      />
                    </div>
                    <div>
                      <Label htmlFor="fileNumber">File Number</Label>
                      <Input
                        id="fileNumber"
                        {...methods.register('legal.fileNumber')}
                        placeholder="File Number"
                      />
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 flex justify-end">
              <Button 
                type="submit" 
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Demographics'}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </ErrorBoundary>
  );
}

export default SimpleDemographics;