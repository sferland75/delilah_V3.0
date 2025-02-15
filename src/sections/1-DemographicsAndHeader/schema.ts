import { z } from 'zod';

// Contact Information Schema
const contactSchema = z.object({
  phone: z.string().optional(),
  email: z.string().email('Invalid email address').optional(),
  address: z.string().optional(),
});

// Emergency Contact Schema
const emergencyContactSchema = z.object({
  name: z.string().min(1, 'Emergency contact name is required'),
  relationship: z.string().optional(),
  phone: z.string().optional(),
});

// Child Schema
const childSchema = z.object({
  name: z.string().min(1, 'Child name is required'),
  age: z.number().min(0, 'Age must be positive').optional(),
  notes: z.string().optional(),
});

// Household Member Schema
const householdMemberSchema = z.object({
  name: z.string().min(1, 'Member name is required'),
  relationship: z.string().min(1, 'Relationship is required'),
  notes: z.string().optional(),
});

// Insurance Information Schema
const insuranceSchema = z.object({
  provider: z.string().min(1, 'Insurance provider is required'),
  claimNumber: z.string().min(1, 'Claim number is required'),
  adjustorName: z.string().min(1, 'Adjustor name is required'),
  adjustorPhone: z.string().optional(),
  adjustorEmail: z.string().email('Invalid email address').optional(),
});

// Legal Representative Schema
const legalRepSchema = z.object({
  name: z.string().min(1, 'Legal representative name is required'),
  firm: z.string().min(1, 'Law firm name is required'),
  phone: z.string().optional(),
  email: z.string().email('Invalid email address').optional(),
  address: z.string().optional(),
  fileNumber: z.string().min(1, 'File number is required'),
});

// Main Demographics Schema
export const demographicsSchema = z.object({
  // Personal Information
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say']),
  maritalStatus: z.enum(['single', 'married', 'commonLaw', 'divorced', 'separated', 'widowed']).optional(),
  
  // Contact Information
  contact: contactSchema,
  emergencyContact: emergencyContactSchema.optional(),
  
  // Family Information
  children: z.array(childSchema).optional(),
  householdMembers: z.array(householdMemberSchema).optional(),
  
  // Insurance Information
  insurance: insuranceSchema,
  
  // Legal Information
  legalRep: legalRepSchema,
});

// Infer TypeScript types from schema
export type Demographics = z.infer<typeof demographicsSchema>;
export type Contact = z.infer<typeof contactSchema>;
export type EmergencyContact = z.infer<typeof emergencyContactSchema>;
export type Child = z.infer<typeof childSchema>;
export type HouseholdMember = z.infer<typeof householdMemberSchema>;
export type Insurance = z.infer<typeof insuranceSchema>;
export type LegalRep = z.infer<typeof legalRepSchema>;