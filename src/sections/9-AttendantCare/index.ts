// Export main component and types
export { AttendantCareSection, AttendantCareSectionIntegrated } from './components';
export type { AttendantCareFormData } from './schema';

// Export utility functions
export { 
  calculateTotalMinutes,
  calculateWeeklyHours,
  calculateMonthlyHours,
  calculateMonthlyCost,
  calculateSummary
} from './utils/calculations';

// Export constants
export { CARE_RATES, WEEKLY_TO_MONTHLY } from './constants';
