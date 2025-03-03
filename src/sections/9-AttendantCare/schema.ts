import { z } from "zod";
import { careCategories } from "./constants";

// Base schema for individual activities
const activitySchema = z.object({
  minutes: z.number().min(0).default(0),
  timesPerWeek: z.number().min(0).default(0),
  totalMinutes: z.number().min(0).default(0),
  notes: z.string().optional(),
});

// Partial activity schema for draft/incomplete forms
const partialActivitySchema = z.object({
  minutes: z.number().min(0).nullish().optional(),
  timesPerWeek: z.number().min(0).nullish().optional(),
  totalMinutes: z.number().min(0).nullish().optional(),
  notes: z.string().nullish().optional(),
}).partial();

// Helper function to create category schemas
function createCategorySchema(category: any, schema: z.ZodType = activitySchema) {
  const fields = category.items.reduce((acc: any, item: any) => {
    acc[item.id] = schema;
    return acc;
  }, {});
  return z.object(fields);
}

// Create schemas for each level based on the careCategories constant
const level1Schema = z.object(
  Object.entries(careCategories.level1).reduce((acc: any, [key, category]) => {
    acc[key] = createCategorySchema(category);
    return acc;
  }, {})
);

const level2Schema = z.object(
  Object.entries(careCategories.level2).reduce((acc: any, [key, category]) => {
    acc[key] = createCategorySchema(category);
    return acc;
  }, {})
);

const level3Schema = z.object(
  Object.entries(careCategories.level3).reduce((acc: any, [key, category]) => {
    acc[key] = createCategorySchema(category);
    return acc;
  }, {})
);

// List of valid categories for each level
const validLevel1Categories = Object.keys(careCategories.level1);
const validLevel2Categories = Object.keys(careCategories.level2);
const validLevel3Categories = Object.keys(careCategories.level3);

// Create partial schemas for each level with more flexible validation
const partialLevel1Schema = z.object(
  Object.entries(careCategories.level1).reduce((acc: any, [key, category]) => {
    acc[key] = createCategorySchema(category, partialActivitySchema).partial();
    return acc;
  }, {})
).partial().and(
  z.record(z.string(), z.any()).refine(
    (data) => Object.keys(data).every(key => validLevel1Categories.includes(key)),
    { message: "Invalid category found in level 1" }
  )
);

const partialLevel2Schema = z.object(
  Object.entries(careCategories.level2).reduce((acc: any, [key, category]) => {
    acc[key] = createCategorySchema(category, partialActivitySchema).partial();
    return acc;
  }, {})
).partial().and(
  z.record(z.string(), z.any()).refine(
    (data) => Object.keys(data).every(key => validLevel2Categories.includes(key)),
    { message: "Invalid category found in level 2" }
  )
);

const partialLevel3Schema = z.object(
  Object.entries(careCategories.level3).reduce((acc: any, [key, category]) => {
    acc[key] = createCategorySchema(category, partialActivitySchema).partial();
    return acc;
  }, {})
).partial().and(
  z.record(z.string(), z.any()).refine(
    (data) => Object.keys(data).every(key => validLevel3Categories.includes(key)),
    { message: "Invalid category found in level 3" }
  )
);

// Schema for custom rates
const customRatesSchema = z.object({
  LEVEL_1: z.number().min(0).optional(),
  LEVEL_2: z.number().min(0).optional(),
  LEVEL_3: z.number().min(0).optional(),
});

// Complete form schema
export const attendantCareSchema = z.object({
  level1: level1Schema,
  level2: level2Schema,
  level3: level3Schema,
  summary: z.object({
    notes: z.string().optional(),
    reviewedBy: z.string().optional(),
    reviewDate: z.string().optional(),
    hasAttachments: z.boolean().optional(),
    attachmentCount: z.number().min(0).optional(),
    rateFramework: z.enum(['current', '2010-2016', 'pre-2010', 'custom']).optional(),
    customRates: customRatesSchema.optional(),
  }).optional(),
});

// Partial form schema with more flexibility
export const partialAttendantCareSchema = z.object({
  level1: partialLevel1Schema.optional(),
  level2: partialLevel2Schema.optional(),
  level3: partialLevel3Schema.optional(),
  summary: z.object({
    notes: z.string().nullish().optional(),
    reviewedBy: z.string().nullish().optional(),
    reviewDate: z.string().nullish().optional(),
    hasAttachments: z.boolean().nullish().optional(),
    attachmentCount: z.number().min(0).nullish().optional(),
    rateFramework: z.enum(['current', '2010-2016', 'pre-2010', 'custom']).nullish().optional(),
    customRates: customRatesSchema.optional(),
  }).partial().optional(),
}).partial();

export type AttendantCareFormData = z.infer<typeof attendantCareSchema>;
export type PartialAttendantCareFormData = z.infer<typeof partialAttendantCareSchema>;