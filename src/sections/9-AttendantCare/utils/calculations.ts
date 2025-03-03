import { CARE_RATES, WEEKLY_TO_MONTHLY } from '../constants';

export function calculateTotalMinutes(minutes: number | undefined | null, timesPerWeek: number | undefined | null): number {
  if (minutes === undefined || minutes === null || timesPerWeek === undefined || timesPerWeek === null) {
    return 0;
  }
  return Math.round(minutes * timesPerWeek);
}

export function calculateWeeklyHours(totalMinutes: number): number {
  if (!totalMinutes) return 0;
  return Number((totalMinutes / 60).toFixed(2));
}

export function calculateMonthlyHours(weeklyHours: number): number {
  if (!weeklyHours) return 0;
  // Use more precise calculation method
  return parseFloat((weeklyHours * WEEKLY_TO_MONTHLY).toFixed(2));
}

export function calculateMonthlyCost(monthlyHours: number, level: keyof typeof CARE_RATES, customRates?: Record<string, number>): number {
  if (!monthlyHours) return 0;
  
  // Use custom rates if provided, otherwise use default rates
  const rateToUse = customRates && customRates[level] ? customRates[level] : CARE_RATES[level];
  return parseFloat((monthlyHours * rateToUse).toFixed(2));
}

export function calculateTotalCostForCategory(activities: Record<string, any>, level: keyof typeof CARE_RATES, customRates?: Record<string, number>): number {
  const totalMinutes = Object.values(activities).reduce((sum, activity: any) => {
    if (!activity?.totalMinutes) return sum;
    return sum + (parseFloat(activity.totalMinutes) || 0);
  }, 0);

  const weeklyHours = calculateWeeklyHours(totalMinutes);
  const monthlyHours = calculateMonthlyHours(weeklyHours);
  return calculateMonthlyCost(monthlyHours, level, customRates);
}

export function calculateSummary(formData: any) {
  // Get custom rates if they exist
  const customRates = formData.customRates || formData.summary?.customRates;
  
  // Helper function to calculate total minutes for a level
  const calculateLevelMinutes = (levelData: any) => {
    if (!levelData) return 0;
    return Object.values(levelData).reduce((sum: number, category: any) => {
      if (!category) return sum;
      return sum + Object.values(category).reduce((catSum: number, activity: any) => {
        if (!activity?.totalMinutes) return catSum;
        return catSum + (parseFloat(activity.totalMinutes) || 0);
      }, 0);
    }, 0);
  };

  // Calculate total minutes per week for each level
  const level1Minutes = calculateLevelMinutes(formData.level1);
  const level2Minutes = calculateLevelMinutes(formData.level2);
  const level3Minutes = calculateLevelMinutes(formData.level3);

  // Calculate weekly hours for each level
  const level1Hours = calculateWeeklyHours(level1Minutes);
  const level2Hours = calculateWeeklyHours(level2Minutes);
  const level3Hours = calculateWeeklyHours(level3Minutes);

  // Monthly conversions (maintaining precision)
  const monthlyLevel1Hours = calculateMonthlyHours(level1Hours);
  const monthlyLevel2Hours = calculateMonthlyHours(level2Hours);
  const monthlyLevel3Hours = calculateMonthlyHours(level3Hours);

  // Cost calculations (maintaining precision)
  const monthlyLevel1Cost = calculateMonthlyCost(monthlyLevel1Hours, 'LEVEL_1', customRates);
  const monthlyLevel2Cost = calculateMonthlyCost(monthlyLevel2Hours, 'LEVEL_2', customRates);
  const monthlyLevel3Cost = calculateMonthlyCost(monthlyLevel3Hours, 'LEVEL_3', customRates);

  // Calculate totals with precise rounding
  const totalMonthlyHours = parseFloat((monthlyLevel1Hours + monthlyLevel2Hours + monthlyLevel3Hours).toFixed(2));
  const totalMonthlyCost = parseFloat((monthlyLevel1Cost + monthlyLevel2Cost + monthlyLevel3Cost).toFixed(2));
  const annualCost = parseFloat((totalMonthlyCost * 12).toFixed(2));

  return {
    level1: {
      minutesPerWeek: level1Minutes,
      weeklyHours: level1Hours,
      monthlyHours: monthlyLevel1Hours,
      monthlyCost: monthlyLevel1Cost
    },
    level2: {
      minutesPerWeek: level2Minutes,
      weeklyHours: level2Hours,
      monthlyHours: monthlyLevel2Hours,
      monthlyCost: monthlyLevel2Cost
    },
    level3: {
      minutesPerWeek: level3Minutes,
      weeklyHours: level3Hours,
      monthlyHours: monthlyLevel3Hours,
      monthlyCost: monthlyLevel3Cost
    },
    summary: {
      totalMonthlyHours,
      totalMonthlyCost,
      annualCost
    }
  };
}