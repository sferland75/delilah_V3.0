import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Demographics } from '../types';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { EmergencyContactForm } from './EmergencyContactForm';
import { FamilyInfoForm } from './FamilyInfoForm';

export function DemographicsForm() {
  const { control, formState: { errors } } = useFormContext<{ demographics: Demographics }>();

  return (
    <Tabs defaultValue="client" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="client">Client Information</TabsTrigger>
        <TabsTrigger value="insurer">Insurance Details</TabsTrigger>
        <TabsTrigger value="legal">Legal Representative</TabsTrigger>
        <TabsTrigger value="additional">Additional Info</TabsTrigger>
      </TabsList>

      {/* Client Information Tab */}
      <TabsContent value="client">
        <Card className="p-6">
          <div className="space-y-8">
            {/* Basic Information Section */}
            <div>
              <h3 className="text-lg font-medium mb-4">Basic Information</h3>
              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={control}
                  name="demographics.firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="First name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={control}
                  name="demographics.lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Last name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="demographics.dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="demographics.gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="demographics.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="(000) 000-0000" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="demographics.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="Email address" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="demographics.address"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Street address" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </Card>
      </TabsContent>

      {/* Insurance Information Tab */}
      <TabsContent value="insurer">
        <Card className="p-6">
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-4">Insurance Details</h3>
              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={control}
                  name="demographics.insuranceProvider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Insurance Provider</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Insurance company name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="demographics.claimNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Claim Number</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Claim/Policy number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="demographics.adjustorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Claims Adjustor</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Adjustor name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="demographics.adjustorPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adjustor Phone</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Adjustor phone" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </Card>
      </TabsContent>

      {/* Legal Representative Tab */}
      <TabsContent value="legal">
        <Card className="p-6">
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-4">Legal Representative Information</h3>
              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={control}
                  name="demographics.legalRepName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Legal Representative Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Representative name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="demographics.legalFirm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Law Firm</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Law firm name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="demographics.legalPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Legal contact phone" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="demographics.legalEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="Legal contact email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="demographics.legalAddress"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Office Address</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Legal office address" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="demographics.fileNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>File Number</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Legal file number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </Card>
      </TabsContent>

      {/* Additional Information Tab */}
      <TabsContent value="additional">
        <Card className="p-6">
          <div className="space-y-8">
            <EmergencyContactForm control={control} />
            <FamilyInfoForm control={control} />
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  );
}