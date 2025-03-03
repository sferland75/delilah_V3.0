import { z } from 'zod';

const activitySchema = z.object({
  timeBlock: z.string().min(1, "Time block is required"),
  description: z.string().min(1, "Activity description is required"),
  assistance: z.string().optional(),
  limitations: z.string().optional()
});

const dailyRoutineSchema = z.object({
  morning: z.array(activitySchema).default([]),
  afternoon: z.array(activitySchema).default([]),
  evening: z.array(activitySchema).default([]),
  night: z.array(activitySchema).default([])
});

export const typicalDaySchema = z.object({
  config: z.object({
    activeTab: z.enum(['preAccident', 'postAccident']).default('preAccident'),
    mode: z.enum(['view', 'edit']).default('edit')
  }),
  data: z.object({
    preAccident: z.object({
      dailyRoutine: dailyRoutineSchema.default({
        morning: [],
        afternoon: [],
        evening: [],
        night: []
      })
    }),
    postAccident: z.object({
      dailyRoutine: dailyRoutineSchema.default({
        morning: [],
        afternoon: [],
        evening: [],
        night: []
      })
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
};

export type TypicalDay = z.infer<typeof typicalDaySchema>;
export type Activity = z.infer<typeof activitySchema>;
export type DailyRoutine = z.infer<typeof dailyRoutineSchema>;