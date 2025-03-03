import { z } from "zod";
import { careCategories } from "./constants";

// Base schema for individual activities
const activitySchema = z.object({
  minutes: z.number().min(0).default(0),
  timesPerWeek: z.number().min(0).default(0),
  totalMinutes: z.number().min(0).default(0),
  notes: z.string().optional(),
});

// Helper function to create category schemas - with all fields optional
function createPartialCategorySchema(category: any) {
  const fields = category.items.reduce((acc: any, item: any) => {
    acc[item.id] = activitySchema.optional();
    return acc;
  }, {});
  return z.object(fields).partial();
}

// Create schemas for each level based on the careCategories constant - with all categories optional
const level1PartialSchema = z.object(
  Object.entries(careCategories.level1).reduce((acc: any, [key, category]) => {
    acc[key] = createPartialCategorySchema(category);
    return acc;
  }, {})
).partial();

const level2PartialSchema = z.object(
  Object.entries(careCategories.level2).reduce((acc: any, [key, category]) => {
    acc[key] = createPartialCategorySchema(category);
    return acc;
  }, {})
).partial();

const level3PartialSchema = z.object(
  Object.entries(careCategories.level3).reduce((acc: any, [key, category]) => {
    acc[key] = createPartialCategorySchema(category);
    return acc;
  }, {})
).partial();

// Complete form schema with partial support
export const attendantCarePartialSchema = z.object({
  level1: level1PartialSchema.optional(),
  level2: level2PartialSchema.optional(),
  level3: level3PartialSchema.optional(),
  summary: z.object({
    notes: z.string().optional(),
    reviewedBy: z.string().optional(),
    reviewDate: z.string().optional(),
  }).optional(),
});

export type AttendantCarePartialFormData = z.infer<typeof attendantCarePartialSchema>;