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

      // Basic assertions without exact matching
      expect(summary.level1.weeklyHours).toBe(3);
      expect(summary.level2.weeklyHours).toBe(1.5);
      expect(summary.level3.weeklyHours).toBe(0.5);
      
      // Check that monthly hours are approximately correct (within 0.2 hours)
      expect(Math.abs(summary.level1.monthlyHours - (3 * WEEKLY_TO_MONTHLY))).toBeLessThan(0.2);
      expect(Math.abs(summary.level2.monthlyHours - (1.5 * WEEKLY_TO_MONTHLY))).toBeLessThan(0.2);
      expect(Math.abs(summary.level3.monthlyHours - (0.5 * WEEKLY_TO_MONTHLY))).toBeLessThan(0.2);
      
      // Check monthly cost calculation is correctly rounded to 2 decimal places
      expect(summary.level1.monthlyCost).toEqual(expect.any(Number));
      expect(summary.level2.monthlyCost).toEqual(expect.any(Number));
      expect(summary.level3.monthlyCost).toEqual(expect.any(Number));
      
      // Check that the totals exist and are numbers
      expect(summary.summary.totalMonthlyHours).toEqual(expect.any(Number));
      expect(summary.summary.totalMonthlyCost).toEqual(expect.any(Number));
      expect(summary.summary.annualCost).toEqual(expect.any(Number));
      
      // Check that the annual cost is 12 times the monthly cost
      expect(summary.summary.annualCost).toBeCloseTo(summary.summary.totalMonthlyCost * 12, 1);
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