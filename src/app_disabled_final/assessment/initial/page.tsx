'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AssessmentLayout } from '@/components/assessment-layout';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';

// Define form schema
const formSchema = z.object({
  // Demographics tab
  fullName: z.string().min(1, 'Name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.string().optional(),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  
  // Referral tab
  referralSource: z.string().optional(),
  referralDate: z.string().optional(),
  
  // Insurance tab
  insuranceProvider: z.string().optional(),
  policyNumber: z.string().optional(),
  
  // Medical tab
  primaryPhysician: z.string().optional(),
  emergencyContact: z.string().optional(),
  
  // Notes tab
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function InitialAssessment() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isImportedData, setIsImportedData] = useState(false);
  const [activeTab, setActiveTab] = useState('demographics');
  
  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      dateOfBirth: '',
      gender: '',
      address: '',
      phoneNumber: '',
      email: '',
      referralSource: '',
      referralDate: '',
      insuranceProvider: '',
      policyNumber: '',
      primaryPhysician: '',
      emergencyContact: '',
      notes: '',
    }
  });
  
  // Check for imported data
  useEffect(() => {
    const fromImport = searchParams.get('from') === 'import';
    
    if (fromImport) {
      try {
        const importedData = localStorage.getItem('importedAssessmentData');
        
        if (importedData) {
          const parsedData = JSON.parse(importedData);
          const demographicsData = parsedData.demographics || {};
          
          // Map imported data to form values
          const mappedData: Partial<FormValues> = {
            fullName: demographicsData.fullName?.value || '',
            dateOfBirth: demographicsData.dateOfBirth?.value || '',
            gender: demographicsData.gender?.value || '',
            address: demographicsData.address?.value || '',
            phoneNumber: demographicsData.phoneNumber?.value || '',
            email: demographicsData.email?.value || '',
          };
          
          // Update form values
          form.reset(mappedData);
          setIsImportedData(true);
        }
      } catch (error) {
        console.error('Error loading imported data:', error);
      }
    }
  }, [searchParams, form]);
  
  const onSubmit = async (data: FormValues) => {
    console.log('Form submitted:', data);
    // In a real app, you would save this data to your backend
    // For now, we'll just simulate a save
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('Data saved successfully!');
  };
  
  return (
    <AssessmentLayout completionPercentage={0}>
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold">Initial Assessment <span className="text-sm font-normal text-slate-500">Section 1</span></h1>
            <div className="flex items-center mt-1">
              <div className="h-1 w-40 bg-slate-200 rounded-full">
                <div className="h-full bg-slate-400 rounded-full" style={{ width: '0%' }}></div>
              </div>
              <span className="ml-2 text-xs text-slate-500">0%</span>
            </div>
          </div>
        </div>
        
        {isImportedData && (
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <p className="text-blue-700">
                This form has been pre-populated with data extracted from your imported documents.
                Please review and edit the information as needed.
              </p>
            </CardContent>
          </Card>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8 bg-background border-b w-full rounded-none p-0">
            <TabsTrigger
              value="demographics"
              className={cn(
                "rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary data-[state=active]:text-primary",
                "px-4 py-2"
              )}
            >
              Demographics
            </TabsTrigger>
            <TabsTrigger
              value="referral"
              className={cn(
                "rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary data-[state=active]:text-primary",
                "px-4 py-2"
              )}
            >
              Referral
            </TabsTrigger>
            <TabsTrigger
              value="insurance"
              className={cn(
                "rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary data-[state=active]:text-primary",
                "px-4 py-2"
              )}
            >
              Insurance
            </TabsTrigger>
            <TabsTrigger
              value="medical"
              className={cn(
                "rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary data-[state=active]:text-primary",
                "px-4 py-2"
              )}
            >
              Medical
            </TabsTrigger>
            <TabsTrigger
              value="notes"
              className={cn(
                "rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary data-[state=active]:text-primary",
                "px-4 py-2"
              )}
            >
              Notes
            </TabsTrigger>
          </TabsList>
          
          <Form {...form}>
            <form className="space-y-6">
              <TabsContent value="demographics">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="yyyy-mm-dd" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="referral">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="referralSource"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Referral Source</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="referralDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Referral Date</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="yyyy-mm-dd" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="insurance">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="insuranceProvider"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Insurance Provider</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="policyNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Policy Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="medical">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="primaryPhysician"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Physician</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="emergencyContact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Emergency Contact</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="notes">
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          rows={5}
                          placeholder="Enter any additional information about the client that might be relevant..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <div className="flex justify-between pt-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={form.handleSubmit(onSubmit)}
                >
                  Save
                </Button>
                <Button 
                  type="button"
                  onClick={() => {
                    form.handleSubmit(onSubmit)();
                    router.push('/assessment/purpose');
                  }}
                >
                  Next Section
                </Button>
              </div>
            </form>
          </Form>
        </Tabs>
      </div>
    </AssessmentLayout>
  );
}
