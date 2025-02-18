import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Demographics } from '../schema';

export function Personal() {
  const { control, formState: { errors } } = useFormContext<Demographics>();

  return (
    <div className="grid grid-cols-2 gap-6">
      <FormField
        control={control}
        name="firstName"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor={field.name}>First Name</FormLabel>
            <FormControl>
              <Input 
                {...field}
                id={field.name}
                aria-label="First Name"
                aria-describedby={errors.firstName ? "firstName-error" : undefined}
              />
            </FormControl>
            {errors.firstName && (
              <FormMessage id="firstName-error" role="alert">
                {errors.firstName.message}
              </FormMessage>
            )}
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="lastName"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor={field.name}>Last Name</FormLabel>
            <FormControl>
              <Input 
                {...field}
                id={field.name}
                aria-label="Last Name"
                aria-describedby={errors.lastName ? "lastName-error" : undefined}
              />
            </FormControl>
            {errors.lastName && (
              <FormMessage id="lastName-error" role="alert">
                {errors.lastName.message}
              </FormMessage>
            )}
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="dateOfBirth"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor={field.name}>Date of Birth</FormLabel>
            <FormControl>
              <Input 
                {...field}
                id={field.name}
                type="date"
                aria-label="Date of Birth"
                aria-describedby={errors.dateOfBirth ? "dateOfBirth-error" : undefined}
              />
            </FormControl>
            {errors.dateOfBirth && (
              <FormMessage id="dateOfBirth-error" role="alert">
                {errors.dateOfBirth.message}
              </FormMessage>
            )}
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="gender"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor={field.name}>Gender</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              value={field.value || ''}
            >
              <FormControl>
                <SelectTrigger 
                  id={field.name}
                  aria-label="Gender"
                >
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
            {errors.gender && (
              <FormMessage role="alert">{errors.gender.message}</FormMessage>
            )}
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="maritalStatus"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor={field.name}>Marital Status</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              value={field.value || ''}
            >
              <FormControl>
                <SelectTrigger 
                  id={field.name}
                  aria-label="Marital Status"
                >
                  <SelectValue placeholder="Select marital status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="married">Married</SelectItem>
                <SelectItem value="commonLaw">Common Law</SelectItem>
                <SelectItem value="divorced">Divorced</SelectItem>
                <SelectItem value="separated">Separated</SelectItem>
                <SelectItem value="widowed">Widowed</SelectItem>
              </SelectContent>
            </Select>
            {errors.maritalStatus && (
              <FormMessage role="alert">{errors.maritalStatus.message}</FormMessage>
            )}
          </FormItem>
        )}
      />
    </div>
  );
}