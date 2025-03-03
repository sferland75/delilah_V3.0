'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AssessmentLayout } from '@/components/assessment-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Define form schema
const formSchema = z.object({
  purposeOfAssessment: z.string().min(1, 'Purpose is required'),
  methodologyUsed: z.string().min(1, 'Methodology is required'),
  assessmentLocation: z.string().optional(),
  assessmentDate: z.string().optional(),
  assessmentDuration: z.string().optional(),
  clientPresent: z.boolean().default(true),
  caregiverPresent: z.boolean().default(false),
  caregiverName: z.string().optional(),
  caregiverRelationship: z.string().optional(),
  additionalParticipants: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function PurposeAndMethodology() {
  const router = useRouter();
  const [showCaregiverFields, setShowCaregiverFields] = useState(false);
  
  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      purposeOfAssessment: '',
      methodologyUsed: '',
      assessmentLocation: '',
      assessmentDate: '',
      assessmentDuration: '',
      clientPresent: true,
      caregiverPresent: false,
      caregiverName: '',
      caregiverRelationship: '',
      additionalParticipants: '',
      notes: '',
    }
  });
  
  // Watch for caregiver present state to show/hide fields
  const caregiverPresent = form.watch('caregiverPresent');
  
  // Update visibility when the value changes
  useEffect(() => {
    setShowCaregiverFields(caregiverPresent);
  }, [caregiverPresent]);
  
  const onSubmit = async (data: FormValues) => {
    console.log('Form submitted:', data);
    // In a real app, you would save this data to your backend
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('Data saved successfully!');
  };
  
  return (
    <AssessmentLayout completionPercentage={10}>
      <div className="space-y-6">
        {/* Secondary Navigation */}
        <div className="flex space-x-4 mb-6">
          <Button variant="ghost" className="text-primary hover:bg-primary/10 hover:text-primary" size="sm">
            Dashboard
          </Button>
          <Button variant="ghost" className="bg-primary/10 text-primary hover:bg-primary/20" size="sm">
            Assessment
          </Button>
        </div>
        
        {/* Main Content */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold">Purpose & Methodology <span className="text-sm font-normal text-slate-500">Section 2</span></h1>
              <div className="flex items-center mt-1">
                <div className="h-1 w-40 bg-slate-200 rounded-full">
                  <div className="h-full bg-slate-400 rounded-full" style={{ width: '0%' }}></div>
                </div>
                <span className="ml-2 text-xs text-slate-500">0%</span>
              </div>
            </div>
          </div>
          
          <Form {...form}>
            <form className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <FormField
                  control={form.control}
                  name="purposeOfAssessment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purpose of Assessment</FormLabel>
                      <FormDescription>
                        Describe the primary purpose and goals of this assessment
                      </FormDescription>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          rows={3}
                          placeholder="e.g., To assess functional abilities for home care needs..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="methodologyUsed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Methodology Used</FormLabel>
                      <FormDescription>
                        Describe the assessment approach, tools, and methods used
                      </FormDescription>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          rows={3}
                          placeholder="e.g., In-person interview, functional testing, home environment assessment..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="assessmentLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assessment Location</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Client's home" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="assessmentDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assessment Date</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="yyyy-mm-dd" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="assessmentDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assessment Duration</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., 2 hours" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="clientPresent"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Client was present during assessment</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="caregiverPresent"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Caregiver/family member was present</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              
              {showCaregiverFields && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="caregiverName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Caregiver Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="caregiverRelationship"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Relationship to Client</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Spouse, Child, Sibling" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              
              <FormField
                control={form.control}
                name="additionalParticipants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Participants</FormLabel>
                    <FormDescription>
                      List any other individuals who participated in the assessment
                    </FormDescription>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Case manager, Translator" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        rows={4}
                        placeholder="Any additional relevant information about the assessment methodology..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-between pt-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={form.handleSubmit(onSubmit)}
                >
                  Save
                </Button>
                <div className="flex gap-2">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/assessment/initial')}
                  >
                    Previous Section
                  </Button>
                  <Button 
                    type="button"
                    onClick={() => {
                      form.handleSubmit(onSubmit)();
                      router.push('/assessment/medical-history');
                    }}
                  >
                    Next Section
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </AssessmentLayout>
  );
}
