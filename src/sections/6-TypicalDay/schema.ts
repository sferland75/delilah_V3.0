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

// Sleep schedule schema to support both regular and irregular patterns
const sleepScheduleSchema = z.object({
  type: z.enum(['regular', 'irregular']),
  regularSchedule: z.object({
    wakeTime: z.string().optional(),
    bedTime: z.string().optional(),
    sleepQuality: z.string().optional()
  }).optional(),
  irregularScheduleDetails: z.string().optional()
}).refine(data => {
  // Validation logic to ensure either regular or irregular data is provided
  if (data.type === 'regular') {
    return !!data.regularSchedule?.wakeTime || !!data.regularSchedule?.bedTime;
  } else {
    return !!data.irregularScheduleDetails;
  }
}, {
  message: "Please provide either regular sleep schedule details or irregular schedule information"
});

export const typicalDaySchema = z.object({
  config: z.object({
    activeTab: z.enum(['preAccident', 'postAccident']),
    mode: z.enum(['view', 'edit'])
  }),
  data: z.object({
    preAccident: z.object({
      dailyRoutine: dailyRoutineSchema,
      sleepSchedule: sleepScheduleSchema.optional()
    }),
    postAccident: z.object({
      dailyRoutine: dailyRoutineSchema,
      sleepSchedule: sleepScheduleSchema.optional()
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
      },
      sleepSchedule: {
        type: 'regular',
        regularSchedule: {
          wakeTime: '',
          bedTime: '',
          sleepQuality: ''
        }
      }
    },
    postAccident: {
      dailyRoutine: {
        morning: [],
        afternoon: [],
        evening: [],
        night: []
      },
      sleepSchedule: {
        type: 'regular',
        regularSchedule: {
          wakeTime: '',
          bedTime: '',
          sleepQuality: ''
        }
      }
    }
  }
} as const;

export type TypicalDay = z.infer<typeof typicalDaySchema>;