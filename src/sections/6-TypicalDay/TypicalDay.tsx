import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TypicalDayFormData } from './types';
import { TypicalDayForm } from './components/TypicalDayForm';
import { useFormPersistence } from '@/hooks/useFormPersistence';

// Define the schema
const activitySchema = z.object({
  specificTime: z.string().optional(),
  description: z.string().optional(),
  assistance: z.string().optional(),
  limitations: z.string().optional(),
});

const dailyRoutineSchema = z.object({
  earlyMorning: z.array(activitySchema).optional().default([]),
  morning: z.array(activitySchema).optional().default([]),
  afternoon: z.array(activitySchema).optional().default([]),
  evening: z.array(activitySchema).optional().default([]),
  night: z.array(activitySchema).optional().default([]),
});

const sleepScheduleSchema = z.object({
  wakeTime: z.string().optional(),
  bedTime: z.string().optional(),
  sleepQuality: z.string().optional(),
});

const typicalDayDataSchema = z.object({
  dailyRoutine: dailyRoutineSchema,
  sleepSchedule: sleepScheduleSchema.optional().default({}),
});

const typicalDaySchema = z.object({
  typicalDay: z.object({
    preAccident: typicalDayDataSchema.optional().default({
      dailyRoutine: {
        earlyMorning: [],
        morning: [],
        afternoon: [],
        evening: [],
        night: [],
      },
      sleepSchedule: {},
    }),
    postAccident: typicalDayDataSchema.optional().default({
      dailyRoutine: {
        earlyMorning: [],
        morning: [],
        afternoon: [],
        evening: [],
        night: [],
      },
      sleepSchedule: {},
    }),
  }),
});

const emptyRoutineData = {
  earlyMorning: [{ specificTime: '', description: '' }],
  morning: [{ specificTime: '', description: '' }],
  afternoon: [{ specificTime: '', description: '' }],
  evening: [{ specificTime: '', description: '' }],
  night: [{ specificTime: '', description: '' }],
};

const emptyPostRoutineData = {
  earlyMorning: [{ specificTime: '', description: '', assistance: '', limitations: '' }],
  morning: [{ specificTime: '', description: '', assistance: '', limitations: '' }],
  afternoon: [{ specificTime: '', description: '', assistance: '', limitations: '' }],
  evening: [{ specificTime: '', description: '', assistance: '', limitations: '' }],
  night: [{ specificTime: '', description: '', assistance: '', limitations: '' }],
};

const defaultValues: TypicalDayFormData = {
  typicalDay: {
    preAccident: {
      dailyRoutine: emptyRoutineData,
      sleepSchedule: {
        wakeTime: '',
        bedTime: '',
        sleepQuality: '',
      },
    },
    postAccident: {
      dailyRoutine: emptyPostRoutineData,
      sleepSchedule: {
        wakeTime: '',
        bedTime: '',
        sleepQuality: '',
      },
    },
  },
};

const TypicalDay: React.FC = () => {
  const methods = useForm<TypicalDayFormData>({
    resolver: zodResolver(typicalDaySchema),
    defaultValues,
    mode: 'onChange',
  });

  // Use the form persistence hook to keep form state
  useFormPersistence(methods, 'typicalDay');

  return (
    <FormProvider {...methods}>
      <form>
        <TypicalDayForm />
      </form>
    </FormProvider>
  );
};

export { TypicalDay };
export default TypicalDay;