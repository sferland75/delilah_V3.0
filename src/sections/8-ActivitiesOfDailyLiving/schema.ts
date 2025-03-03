import { z } from 'zod';
import type { ADLData, ADLItemData, ADLCategoryData } from './types';

// Validation schema for individual ADL items
const adlItemSchema = z.object({
  independence: z.string().optional(),
  notes: z.string().optional()
});

// Schema for ADL categories
const adlCategorySchema = z.record(adlItemSchema);

// Schema for the complete ADL form
export const adlSchema = z.object({
  basic: z.object({
    bathing: adlCategorySchema,
    dressing: adlCategorySchema,
    feeding: adlCategorySchema,
    transfers: adlCategorySchema
  }),
  iadl: z.object({
    household: adlCategorySchema,
    community: adlCategorySchema
  }),
  health: z.object({
    management: adlCategorySchema,
    routine: adlCategorySchema
  }),
  work: z.object({
    status: adlCategorySchema
  }),
  leisure: z.object({
    sports: adlCategorySchema,
    social: adlCategorySchema,
    travel: adlCategorySchema,
    community: adlCategorySchema
  })
});

// Create default values based on the constants.ts structure
import { 
  adlCategories, 
  iadlCategories, 
  healthCategories, 
  workCategories,
  leisureCategories
} from './constants';

// Helper function to create empty ADL items
const createEmptyItems = (items: readonly any[]): ADLCategoryData => {
  return items.reduce((acc, item) => {
    acc[item.id] = { independence: '', notes: '' };
    return acc;
  }, {} as ADLCategoryData);
};

// Generate default form state
export const defaultFormState: ADLData = {
  basic: {
    bathing: createEmptyItems(adlCategories.bathing.items),
    dressing: createEmptyItems(adlCategories.dressing.items),
    feeding: createEmptyItems(adlCategories.feeding.items),
    transfers: createEmptyItems(adlCategories.transfers.items)
  },
  iadl: {
    household: createEmptyItems(iadlCategories.household.items),
    community: createEmptyItems(iadlCategories.community.items)
  },
  health: {
    management: createEmptyItems(healthCategories.management.items),
    routine: createEmptyItems(healthCategories.routine.items)
  },
  work: {
    status: createEmptyItems(workCategories.status.items)
  },
  leisure: {
    sports: createEmptyItems(leisureCategories.sports.items),
    social: createEmptyItems(leisureCategories.social.items),
    travel: createEmptyItems(leisureCategories.travel.items),
    community: createEmptyItems(leisureCategories.community.items)
  }
};