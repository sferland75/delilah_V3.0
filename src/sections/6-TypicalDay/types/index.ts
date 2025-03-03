export interface SleepSchedule {
  wakeTime: string;
  bedTime: string;
  sleepQuality?: string;
  sleepDisturbances?: string[];
}

export interface RoutineActivity {
  timeBlock: string;     // e.g. "7:00 AM - 8:00 AM"
  description: string;
  assistance?: string;   // Level of assistance needed
  limitations?: string;  // Specific limitations or challenges
}

export interface DailyRoutine {
  morning: RoutineActivity[];
  afternoon: RoutineActivity[];
  evening: RoutineActivity[];
  night: RoutineActivity[];
}

export interface TypicalDayData {
  preAccident: {
    sleepSchedule: SleepSchedule;
    dailyRoutine: DailyRoutine;
    independence: string;        // General independence level
    workSchedule?: string;      // If applicable
    socialActivities?: string;  // Regular social engagements
  };
  postAccident: {
    sleepSchedule: SleepSchedule;
    dailyRoutine: DailyRoutine;
    independence: string;
    assistanceNeeded: string[];  // Specific assistance requirements
    adaptations: string[];      // Adaptations made to routine
    limitations: string[];      // New limitations affecting routine
  };
  impactSummary: {
    sleepImpact: string;
    routineChanges: string[];
    socialImpact: string;
    workImpact?: string;
  };
}

export interface TypicalDayFormData {
  typicalDay: TypicalDayData;
  metadata: {
    lastUpdated: string;
    completedBy: string;
  };
}