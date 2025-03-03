import { z } from 'zod';

export const injurySchema = z.object({
  date: z.string().min(1, "Date of injury is required"),
  injuries: z.array(z.object({
    type: z.string().min(1, "Injury type is required"),
    description: z.string().min(1, "Description is required"),
    sequelae: z.array(z.string()).optional(),
    category: z.enum(["physical", "psychological"]),
    resolved: z.boolean().optional(),
    resolutionDate: z.string().optional()
  }))
});

export type InjuryData = z.infer<typeof injurySchema>;