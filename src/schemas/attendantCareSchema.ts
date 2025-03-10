import { z } from 'zod';

// Helper functions for calculating totals
const calculateTotalMinutes = (data: any) => {
  let total = 0;
  
  // Process personal care
  if (data?.personalCare) {
    Object.values(data.personalCare).forEach((activity: any) => {
      if (activity && typeof activity === 'object') {
        const minutes = Number(activity.minutes) || 0;
        const timesPerWeek = Number(activity.timesPerWeek) || 0;
        total += minutes * timesPerWeek;
      }
    });
  }
  
  // Process house keeping
  if (data?.houseKeeping) {
    Object.values(data.houseKeeping).forEach((activity: any) => {
      if (activity && typeof activity === 'object') {
        const minutes = Number(activity.minutes) || 0;
        const timesPerWeek = Number(activity.timesPerWeek) || 0;
        total += minutes * timesPerWeek;
      }
    });
  }
  
  return total;
};

// Schema for an individual activity
const activitySchema = z.object({
  minutes: z.number()
    .min(1, "Minutes must be at least 1")
    .max(480, "Minutes should not exceed 8 hours (480 minutes)"),
  timesPerWeek: z.number()
    .min(0, "Times per week cannot be negative")
    .max(28, "Times per week should not exceed 28"),
  notes: z.string().optional()
}).refine((data) => {
  // Individual activity cannot exceed 7 hours per week
  return (data.minutes * data.timesPerWeek) <= 420;
}, {
  message: "Total time for this activity exceeds 7 hours (420 minutes) per week",
  path: ["minutes"]
});

// Schema for personal care activities
const personalCareSchema = z.object({
  bathing: activitySchema.optional(),
  grooming: activitySchema.optional(),
  dressing: activitySchema.optional(),
  toileting: activitySchema.optional(),
  feeding: activitySchema.optional(),
  mobility: activitySchema.optional(),
  transfers: activitySchema.optional(),
}).optional();

// Schema for housekeeping activities
const houseKeepingSchema = z.object({
  cleaning: activitySchema.optional(),
  laundry: activitySchema.optional(),
  mealPreparation: activitySchema.optional(),
  shopping: activitySchema.optional(),
  homeManagement: activitySchema.optional(),
}).optional();

// Schema for Level 1 care
const level1Schema = z.object({
  personalCare: personalCareSchema,
  houseKeeping: houseKeepingSchema,
}).refine((data) => {
  // Total level 1 care cannot exceed 28 hours per week (1680 minutes)
  const totalMinutes = calculateTotalMinutes(data);
  return totalMinutes <= 1680;
}, {
  message: "Total Level 1 care exceeds maximum allowed (28 hours per week)",
  path: ["personalCare"]
});

// Schema for Level 2 care (supervision)
const level2Schema = z.object({
  hours: z.number()
    .min(0, "Hours cannot be negative")
    .max(168, "Hours cannot exceed 24 hours per day (168 hours per week)"),
  description: z.string()
    .min(10, "Please provide a more detailed description")
    .max(1000, "Description is too long"),
}).optional();

// Schema for Level 3 care (professional services)
const level3Schema = z.object({
  services: z.array(z.object({
    serviceType: z.string()
      .min(3, "Service type name is too short")
      .max(100, "Service type name is too long"),
    frequency: z.string()
      .min(3, "Frequency description is too short")
      .max(100, "Frequency description is too long"),
    provider: z.string()
      .min(3, "Provider name is too short")
      .max(100, "Provider name is too long"),
    notes: z.string().optional(),
  })).optional(),
}).optional();

// Complete Attendant Care Schema
export const attendantCareSchema = z.object({
  level1: level1Schema,
  level2: level2Schema,
  level3: level3Schema,
  summary: z.string().optional(),
  recommendations: z.string().optional(),
});

// Type for the schema
export type AttendantCareFormData = z.infer<typeof attendantCareSchema>;
