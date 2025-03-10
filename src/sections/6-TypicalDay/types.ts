export interface ActivityData {
  timeBlock: string;
  description: string;
  assistance?: string;
  limitations?: string;
}

export interface DailyRoutine {
  morning: ActivityData[];
  afternoon: ActivityData[];
  evening: ActivityData[];
  night: ActivityData[];
}

export interface RegularSleepSchedule {
  wakeTime?: string;
  bedTime?: string;
  sleepQuality?: string;
}

export interface SleepScheduleData {
  type: 'regular' | 'irregular';
  regularSchedule?: RegularSleepSchedule;
  irregularScheduleDetails?: string;
}

export interface TypicalDayData {
  dailyRoutine: DailyRoutine;
  sleepSchedule?: SleepScheduleData;
}

export interface TypicalDayFormData {
  config: {
    activeTab: 'preAccident' | 'postAccident';
    mode: 'view' | 'edit';
  };
  data: {
    preAccident: TypicalDayData;
    postAccident: TypicalDayData;
  };
}

// Context data structures (used for integration with AssessmentContext)
export interface ContextSleepScheduleData {
  type?: 'regular' | 'irregular';
  wakeTime?: string;
  bedTime?: string;
  sleepQuality?: string;
  irregularScheduleDetails?: string;
}

export interface ContextDailyRoutineData {
  morningActivities?: string;
  afternoonActivities?: string;
  eveningActivities?: string;
  nightActivities?: string;
  sleepSchedule?: ContextSleepScheduleData;
  assistanceRequirements?: string;
  limitations?: string;
}

export interface ContextTypicalDayData {
  preAccident?: {
    dailyRoutine?: ContextDailyRoutineData;
  };
  postAccident?: {
    dailyRoutine?: ContextDailyRoutineData;
  };
  config?: {
    activeTab?: 'preAccident' | 'postAccident';
  };
}