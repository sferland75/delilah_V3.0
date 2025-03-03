import {
  calculateTotalMinutes,
  calculateWeeklyHours,
  calculateMonthlyHours,
  calculateMonthlyCost,
  calculateTotalCostForCategory,
  calculateSummary
} from '../utils/calculations';
import { CARE_RATES, WEEKLY_TO_MONTHLY } from '../constants';

describe('Attendant Care Calculations', () => {
  describe('calculateTotalMinutes', () => {
    it('should calculate total minutes correctly', () => {
      expect(calculateTotalMinutes(30, 7)).toBe(210);
      expect(calculateTotalMinutes(45, 3)).toBe(135);
      expect(calculateTotalMinutes(0, 5)).toBe(0);
    });
  });

  describe('calculateWeeklyHours', () => {
    it('should convert minutes to hours correctly', () => {
      expect(calculateWeeklyHours(120)).toBe(2);
      expect(calculateWeeklyHours(90)).toBe(1.5);
      expect(calculateWeeklyHours(0)).toBe(0);
    });
  });

  describe('calculateMonthlyHours', () => {
    it('should convert weekly to monthly hours correctly', () => {
      expect(calculateMonthlyHours(10)).toBe(43);
      expect(calculateMonthlyHours(5)).toBe(21.5);
      expect(calculateMonthlyHours(0)).toBe(0);
    });
  });

  describe('calculateMonthlyCost', () => {
    it('should calculate monthly cost correctly for each level', () => {
      expect(calculateMonthlyCost(10, 'LEVEL_1')).toBe(149);
      expect(calculateMonthlyCost(10, 'LEVEL_2')).toBe(140);
      expect(calculateMonthlyCost(10, 'LEVEL_3')).toBe(211.1);
    });
  });

  describe('calculateTotalCostForCategory', () => {
    it('should calculate total cost for a category correctly', () => {
      const activities = {
        activity1: { totalMinutes: 120 }, // 2 hours
        activity2: { totalMinutes: 180 }, // 3 hours
      };
      
      const expectedMonthlyHours = (5 * WEEKLY_TO_MONTHLY); // 5 weekly hours * 4.3
      const expectedCost = expectedMonthlyHours * CARE_RATES.LEVEL_1;
      
      expect(calculateTotalCostForCategory(activities, 'LEVEL_1')).toBe(Number(expectedCost.toFixed(2)));
    });

    it('should handle empty or invalid activities', () => {
      expect(calculateTotalCostForCategory({}, 'LEVEL_1')).toBe(0);
      expect(calculateTotalCostForCategory({ invalid: {} }, 'LEVEL_1')).toBe(0);
    });
  });

  describe('calculateSummary', () => {
    it('should calculate complete summary correctly', () => {
      const mockFormData = {
        level1: {
          category1: {
            activity1: { totalMinutes: 60 }, // 1 hour
            activity2: { totalMinutes: 120 }  // 2 hours
          }
        },
        level2: {
          category1: {
            activity1: { totalMinutes: 90 } // 1.5 hours
          }
        },
        level3: {
          category1: {
            activity1: { totalMinutes: 30 } // 0.5 hours
          }
        }
      };

      const summary = calculateSummary(mockFormData);

      // Level 1: 3 weekly hours
      const level1MonthlyHours = 3 * WEEKLY_TO_MONTHLY;
      const level1Cost = level1MonthlyHours * CARE_RATES.LEVEL_1;

      // Level 2: 1.5 weekly hours
      const level2MonthlyHours = 1.5 * WEEKLY_TO_MONTHLY;
      const level2Cost = level2MonthlyHours * CARE_RATES.LEVEL_2;

      // Level 3: 0.5 weekly hours
      const level3MonthlyHours = 0.5 * WEEKLY_TO_MONTHLY;
      const level3Cost = level3MonthlyHours * CARE_RATES.LEVEL_3;

      // Validate level-specific calculations
      expect(summary.level1.weeklyHours).toBe(3);
      // Use toFixed(1) to compare with the same precision
      expect(Number(summary.level1.monthlyHours.toFixed(1))).toBe(Number(level1MonthlyHours.toFixed(1)));
      expect(summary.level1.monthlyCost).toBe(Number(level1Cost.toFixed(2)));

      expect(summary.level2.weeklyHours).toBe(1.5);
      expect(Number(summary.level2.monthlyHours.toFixed(1))).toBe(Number(level2MonthlyHours.toFixed(1)));
      expect(summary.level2.monthlyCost).toBe(Number(level2Cost.toFixed(2)));

      expect(summary.level3.weeklyHours).toBe(0.5);
      expect(Number(summary.level3.monthlyHours.toFixed(1))).toBe(Number(level3MonthlyHours.toFixed(1)));
      expect(summary.level3.monthlyCost).toBe(Number(level3Cost.toFixed(2)));

      // Validate summary totals
      const totalMonthlyHours = level1MonthlyHours + level2MonthlyHours + level3MonthlyHours;
      const totalMonthlyCost = level1Cost + level2Cost + level3Cost;

      expect(Number(summary.summary.totalMonthlyHours.toFixed(1))).toBe(Number(totalMonthlyHours.toFixed(1)));
      expect(summary.summary.totalMonthlyCost).toBe(Number(totalMonthlyCost.toFixed(2)));
      expect(summary.summary.annualCost).toBe(Number((totalMonthlyCost * 12).toFixed(2)));
    });

    it('should handle empty form data', () => {
      const summary = calculateSummary({});
      
      expect(summary.level1.weeklyHours).toBe(0);
      expect(summary.level2.weeklyHours).toBe(0);
      expect(summary.level3.weeklyHours).toBe(0);
      expect(summary.summary.totalMonthlyHours).toBe(0);
      expect(summary.summary.totalMonthlyCost).toBe(0);
      expect(summary.summary.annualCost).toBe(0);
    });
  });
});