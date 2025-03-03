import { z } from 'zod';

export const purposeSchema = z.object({
  referralInfo: z.object({
    referralSource: z.string().min(1, "Referral source is required"),
    referralOrganization: z.string().min(1, "Organization name is required"),
    referralContact: z.string().optional(),
    referralDate: z.string().min(1, "Referral date is required"),
    caseNumber: z.string().optional(),
    referralPurpose: z.string().min(1, "Referral purpose is required"),
  }),
  assessmentObjectives: z.object({
    primaryFocus: z.array(z.string()).min(1, "At least one focus area is required"),
    concernAreas: z.string().optional(),
    expectedOutcomes: z.string().min(1, "Expected outcomes are required"),
  }),
  methodology: z.object({
    assessmentType: z.string().min(1, "Assessment type is required"),
    expectedDuration: z.string().min(1, "Expected duration is required"),
    assessmentLocation: z.string().min(1, "Assessment location is required"),
    interpreterRequired: z.boolean(),
    interpreterDetails: z.string().optional(),
    specialAccommodations: z.string().optional(),
  }),
  additionalRequirements: z.object({
    housekeepingCalc: z.boolean(),
    amaGuides: z.boolean(),
    docRequirements: z.string().optional(),
    reportingPreferences: z.string().optional(),
    timelineRequirements: z.string().optional(),
  })
});

export type Purpose = z.infer<typeof purposeSchema>;