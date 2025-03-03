import { z } from "zod";

export const demographicsSchema = z.object({
  personal: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
  }),
  contact: z.object({
    phone: z.string().min(10, "Valid phone number required"),
    email: z.string().email("Valid email required"),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    province: z.string().min(1, "Province is required"),
    postalCode: z.string().min(6, "Valid postal code required"),
  }),
  insurance: z.object({
    provider: z.string().min(1, "Insurance provider is required"),
    claimNumber: z.string().min(1, "Claim number is required"),
    adjustorName: z.string().min(1, "Adjustor name is required"),
    adjustorPhone: z.string().min(10, "Valid adjustor phone required"),
    adjustorEmail: z.string().email("Valid adjustor email required"),
  }),
  legal: z.object({
    name: z.string().optional(),
    firm: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email("Valid email required").optional(),
    address: z.string().optional(),
    fileNumber: z.string().optional(),
  }),
});

export type Demographics = z.infer<typeof demographicsSchema>;