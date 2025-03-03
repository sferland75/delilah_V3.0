export interface ActivityData {
  specificTime: string;
  description: string;
  assistance?: string;
  limitations?: string;
}

export interface DailyRoutine {
  earlyMorning: ActivityData[];
  morning: ActivityData[];
  afternoon: ActivityData[];
  evening: ActivityData[];
  night: ActivityData[];
}

export interface SleepScheduleData {
  wakeTime?: string;
  bedTime?: string;
  sleepQuality?: string;
}

export interface TypicalDayData {
  dailyRoutine: DailyRoutine;
  sleepSchedule?: SleepScheduleData;
}

export interface TypicalDayFormData {
  typicalDay: {
    preAccident: TypicalDayData;
    postAccident: TypicalDayData;
  };
}