import { z } from 'zod';

const timeBlockPattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]\s*(?:AM|PM)\s*-\s*([0-1]?[0-9]|2[0-3]):[0-5][0-9]\s*(?:AM|PM)$/i;

const routineActivitySchema = z.object({
  timeBlock: z.string().regex(timeBlockPattern, 'Time block must be in format "HH:MM AM/PM - HH:MM AM/PM"'),
  description: z.string().min(1, 'Activity description is required'),
  assistance: z.string().optional(),
  limitations: z.string().optional()
});

const dailyRoutineSchema = z.object({
  morning: z.array(routineActivitySchema).min(1, 'At least one morning activity is required'),
  afternoon: z.array(routineActivitySchema).min(1, 'At least one afternoon activity is required'),
  evening: z.array(routineActivitySchema).min(1, 'At least one evening activity is required'),
  night: z.array(routineActivitySchema).optional()
});

const sleepScheduleSchema = z.object({
  wakeTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  bedTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  sleepQuality: z.string().optional(),
  sleepDisturbances: z.array(z.string()).optional()
});

export const typicalDaySchema = z.object({
  typicalDay: z.object({
    preAccident: z.object({
      sleepSchedule: sleepScheduleSchema,
      dailyRoutine: dailyRoutineSchema,
      independence: z.string().min(1, 'Pre-accident independence level is required'),
      workSchedule: z.string().optional(),
      socialActivities: z.string().optional()
    }),
    postAccident: z.object({
      sleepSchedule: sleepScheduleSchema,
      dailyRoutine: dailyRoutineSchema,
      independence: z.string().min(1, 'Post-accident independence level is required'),
      assistanceNeeded: z.array(z.string()).min(1, 'Post-accident assistance requirements must be specified'),
      adaptations: z.array(z.string()).min(1, 'Post-accident adaptations must be specified'),
      limitations: z.array(z.string()).min(1, 'Post-accident limitations must be specified')
    }),
    impactSummary: z.object({
      sleepImpact: z.string().min(1, 'Sleep impact summary is required'),
      routineChanges: z.array(z.string()).min(1, 'Routine changes must be specified'),
      socialImpact: z.string().min(1, 'Social impact summary is required'),
      workImpact: z.string().optional()
    })
  }),
  metadata: z.object({
    lastUpdated: z.string(),
    completedBy: z.string().min(1, 'Form completion attribution is required')
  })
});