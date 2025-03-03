import { z } from 'zod';

// Zod Schema
export const demographicsSchema = z.object({
  // Client Information
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
  
  // Insurance Information
  insuranceProvider: z.string().optional(),
  claimNumber: z.string().optional(),
  insuranceContact: z.string().optional(),
  insurancePhone: z.string().optional(),
  adjustorName: z.string().optional(),
  adjustorPhone: z.string().optional(),
  
  // Legal Representative Information
  legalRepName: z.string().optional(),
  legalFirm: z.string().optional(),
  legalPhone: z.string().optional(),
  legalEmail: z.string().email().optional(),
  legalAddress: z.string().optional(),
  fileNumber: z.string().optional(),
  
  // Additional Information
  emergencyContact: z.object({
    name: z.string(),
    phone: z.string().optional(),
    relationship: z.string().optional()
  }).optional(),
  
  maritalStatus: z.enum(['married', 'single', 'divorced', 'widowed', 'commonLaw', 'separated']).optional(),
  
  children: z.array(z.object({
    name: z.string().optional(),
    age: z.number().optional(),
    notes: z.string().optional()
  })).optional(),
  
  householdMembers: z.array(z.object({
    name: z.string(),
    relationship: z.string(),
    notes: z.string().optional()
  })).optional()
});

// TypeScript Types
export type Demographics = z.infer<typeof demographicsSchema>;

export interface EmergencyContact {
  name: string;
  phone?: string;
  relationship?: string;
}

export interface Child {
  name?: string;
  age?: number;
  notes?: string;
}

export interface HouseholdMember {
  name: string;
  relationship: string;
  notes?: string;
}

// Narrative Types
export interface ProcessedDemographics {
  valid: boolean;
  fullName: string;
  age: number;
  contact: {
    phone?: string;
    email?: string;
    address?: string;
  };
  insurance: {
    provider?: string;
    claimNumber?: string;
    adjustor?: {
      name?: string;
      phone?: string;
    };
  };
  legal: {
    representative?: string;
    firm?: string;
    fileNumber?: string;
  };
  family: {
    maritalStatus?: string;
    children?: Child[];
    householdMembers?: HouseholdMember[];
  };
}