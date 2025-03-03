import { LucideIcon } from 'lucide-react';

export interface CareActivity {
  minutes: number;
  timesPerWeek: number;
  totalMinutes: number;
  notes: string;
}

export interface CareItem {
  id: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
}

export interface CareCategory {
  title: string;
  icon: LucideIcon;
  items: CareItem[];
}

export interface CareLevel {
  [key: string]: CareCategory;
}

export interface CareCalculations {
  part1: LevelCalculation;
  part2: LevelCalculation;
  part3: LevelCalculation;
  totalAssessedMonthlyCost: number;
}

export interface LevelCalculation {
  totalMinutesPerWeek: number;
  weeklyHours: number;
  monthlyHours: number;
  monthlyCost: number;
}

export interface AttendantCareData {
  level1: {
    dress: {
      upperBody: CareActivity;
      lowerBody: CareActivity;
    };
    hygiene: {
      bathing: CareActivity;
      toileting: CareActivity;
      grooming: CareActivity;
    };
    mobility: {
      transfers: CareActivity;
      positioning: CareActivity;
      walking: CareActivity;
    };
  };
  level2: {
    supervision: {
      medication: CareActivity;
      safety: CareActivity;
      direction: CareActivity;
    };
  };
  level3: {
    complexCare: {
      woundCare: CareActivity;
      catheter: CareActivity;
      feeding: CareActivity;
    };
  };
  calculations?: CareCalculations;
}