import { z } from 'zod';

const activitySchema = z.object({
  timeBlock: z.string().min(1, "Time block is required"),
  description: z.string().min(1, "Activity description is required"),
  assistance: z.string().optional(),
  limitations: z.string().optional()
});

const dailyRoutineSchema = z.object({
  morning: z.array(activitySchema),
  afternoon: z.array(activitySchema),
  evening: z.array(activitySchema),
  night: z.array(activitySchema)
});

export const typicalDaySchema = z.object({
  config: z.object({
    activeTab: z.enum(['preAccident', 'postAccident']),
    mode: z.enum(['view', 'edit'])
  }),
  data: z.object({
    preAccident: z.object({
      dailyRoutine: dailyRoutineSchema
    }),
    postAccident: z.object({
      dailyRoutine: dailyRoutineSchema
    })
  })
});

export const defaultFormState = {
  config: {
    activeTab: 'preAccident',
    mode: 'edit'
  },
  data: {
    preAccident: {
      dailyRoutine: {
        morning: [],
        afternoon: [],
        evening: [],
        night: []
      }
    },
    postAccident: {
      dailyRoutine: {
        morning: [],
        afternoon: [],
        evening: [],
        night: []
      }
    }
  }
} as const;

export type TypicalDay = z.infer<typeof typicalDaySchema>;