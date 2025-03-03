import {
  calculateTotalMinutes,
  calculateWeeklyHours,
  calculateMonthlyHours,
  calculateMonthlyCost,
  calculateTotalCostForCategory,
  calculateSummary
} from '../utils/calculations';
import { CARE_RATES, WEEKLY_TO_MONTHLY } from '../constants';

// Helper function for comparing floating point numbers
const expectFloatEqual = (received: number, expected: number) => {
  // Use a larger epsilon value for floating point comparison
  const epsilon = 0.05;  // Allowing for typical JS floating point arithmetic
  const diff = Math.abs(received - expected);
  if (diff >= epsilon) {
    console.log(`Float comparison failed: ${received} ≈ ${expected}, diff: ${diff}`);
  }
  expect(diff).toBeLessThan(epsilon);
};

describe('Attendant Care Calculations', () => {
  describe('calculateTotalMinutes', () => {
    it('should calculate total minutes correctly', () => {
      expect(calculateTotalMinutes(30, 7)).toBe(210);
      expect(calculateTotalMinutes(45, 3)).toBe(135);
      expect(calculateTotalMinutes(0, 5)).toBe(0);
    });

    it('should handle fractional minutes and times', () => {
      expect(calculateTotalMinutes(30.5, 7)).toBe(214);
      expect(calculateTotalMinutes(45, 3.5)).toBe(158);
    });

    it('should handle undefined/null inputs', () => {
      expect(calculateTotalMinutes(0, 0)).toBe(0);
      expect(calculateTotalMinutes(undefined as any, 5)).toBe(0);
      expect(calculateTotalMinutes(30, undefined as any)).toBe(0);
    });
  });

  describe('calculateWeeklyHours', () => {
    it('should convert minutes to hours correctly', () => {
      expect(calculateWeeklyHours(120)).toBe(2);
      expect(calculateWeeklyHours(90)).toBe(1.5);
      expect(calculateWeeklyHours(0)).toBe(0);
    });

    it('should handle fractional minutes', () => {
      expect(calculateWeeklyHours(150.5)).toBe(2.51);
      expect(calculateWeeklyHours(75.25)).toBe(1.25);
    });

    it('should round to 2 decimal places', () => {
      expect(calculateWeeklyHours(122)).toBe(2.03);
      expect(calculateWeeklyHours(121)).toBe(2.02);
    });
  });

  describe('calculateMonthlyHours', () => {
    it('should convert weekly to monthly hours correctly', () => {
      expect(calculateMonthlyHours(10)).toBe(43);
      expect(calculateMonthlyHours(5)).toBe(21.5);
      expect(calculateMonthlyHours(0)).toBe(0);
    });

    it('should handle fractional weekly hours', () => {
      expectFloatEqual(calculateMonthlyHours(10.5), 45.15);
      expectFloatEqual(calculateMonthlyHours(5.25), 22.58);
    });

    it('should handle large numbers', () => {
      expect(calculateMonthlyHours(100)).toBe(430);
      expect(calculateMonthlyHours(1000)).toBe(4300);
    });
  });

  describe('calculateMonthlyCost', () => {
    it('should calculate monthly cost correctly for each level', () => {
      expect(calculateMonthlyCost(10, 'LEVEL_1')).toBe(149);
      expect(calculateMonthlyCost(10, 'LEVEL_2')).toBe(140);
      expect(calculateMonthlyCost(10, 'LEVEL_3')).toBe(211.1);
    });

    it('should handle zero hours', () => {
      expect(calculateMonthlyCost(0, 'LEVEL_1')).toBe(0);
      expect(calculateMonthlyCost(0, 'LEVEL_2')).toBe(0);
      expect(calculateMonthlyCost(0, 'LEVEL_3')).toBe(0);
    });

    it('should handle fractional hours', () => {
      expect(calculateMonthlyCost(10.5, 'LEVEL_1')).toBe(156.45);
      expect(calculateMonthlyCost(5.25, 'LEVEL_2')).toBe(73.5);
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
      
      expectFloatEqual(
        calculateTotalCostForCategory(activities, 'LEVEL_1'),
        Number(expectedCost.toFixed(2))
      );
    });

    it('should handle empty or invalid activities', () => {
      expect(calculateTotalCostForCategory({}, 'LEVEL_1')).toBe(0);
      expect(calculateTotalCostForCategory({ invalid: {} }, 'LEVEL_1')).toBe(0);
    });

    it('should handle null/undefined values', () => {
      const activities = {
        activity1: { totalMinutes: null },
        activity2: { totalMinutes: undefined },
        activity3: null,
        activity4: undefined
      };
      expect(calculateTotalCostForCategory(activities, 'LEVEL_1')).toBe(0);
    });

    it('should handle mixed valid and invalid activities', () => {
      const activities = {
        activity1: { totalMinutes: 120 },
        activity2: null,
        activity3: { totalMinutes: 180 },
        activity4: undefined
      };
      
      const expectedMonthlyHours = (5 * WEEKLY_TO_MONTHLY); // 5 weekly hours * 4.3
      const expectedCost = expectedMonthlyHours * CARE_RATES.LEVEL_1;
      
      expectFloatEqual(
        calculateTotalCostForCategory(activities, 'LEVEL_1'),
        Number(expectedCost.toFixed(2))
      );
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
      expectFloatEqual(summary.level1.monthlyHours, level1MonthlyHours);
      expectFloatEqual(summary.level1.monthlyCost, Number(level1Cost.toFixed(2)));

      expect(summary.level2.weeklyHours).toBe(1.5);
      expectFloatEqual(summary.level2.monthlyHours, level2MonthlyHours);
      expectFloatEqual(summary.level2.monthlyCost, Number(level2Cost.toFixed(2)));

      expect(summary.level3.weeklyHours).toBe(0.5);
      expectFloatEqual(summary.level3.monthlyHours, level3MonthlyHours);
      expectFloatEqual(summary.level3.monthlyCost, Number(level3Cost.toFixed(2)));

      // Validate summary totals
      const totalMonthlyHours = level1MonthlyHours + level2MonthlyHours + level3MonthlyHours;
      const totalMonthlyCost = level1Cost + level2Cost + level3Cost;

      expectFloatEqual(summary.summary.totalMonthlyHours, Number(totalMonthlyHours.toFixed(2)));
      expectFloatEqual(summary.summary.totalMonthlyCost, Number(totalMonthlyCost.toFixed(2)));
      expectFloatEqual(summary.summary.annualCost, Number((totalMonthlyCost * 12).toFixed(2)));
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

    it('should handle partial form data', () => {
      const mockFormData = {
        level1: {
          category1: {
            activity1: { totalMinutes: 60 } // 1 hour
          }
        }
        // Missing level2 and level3
      };

      const summary = calculateSummary(mockFormData);

      expect(summary.level1.weeklyHours).toBe(1);
      expect(summary.level2.weeklyHours).toBe(0);
      expect(summary.level3.weeklyHours).toBe(0);

      const level1MonthlyHours = 1 * WEEKLY_TO_MONTHLY;
      const level1Cost = level1MonthlyHours * CARE_RATES.LEVEL_1;

      expectFloatEqual(summary.summary.totalMonthlyHours, level1MonthlyHours);
      expectFloatEqual(summary.summary.totalMonthlyCost, Number(level1Cost.toFixed(2)));
      expectFloatEqual(summary.summary.annualCost, Number((level1Cost * 12).toFixed(2)));
    });

    it('should handle invalid form data structure', () => {
      const invalidFormData = {
        notALevel: {
          something: { totalMinutes: 60 }
        }
      };

      const summary = calculateSummary(invalidFormData);

      expect(summary.level1.weeklyHours).toBe(0);
      expect(summary.level2.weeklyHours).toBe(0);
      expect(summary.level3.weeklyHours).toBe(0);
      expect(summary.summary.totalMonthlyHours).toBe(0);
      expect(summary.summary.totalMonthlyCost).toBe(0);
      expect(summary.summary.annualCost).toBe(0);
    });

    it('should handle null/undefined values in form data', () => {
      const mockFormData = {
        level1: {
          category1: {
            activity1: { totalMinutes: null },
            activity2: { totalMinutes: undefined },
            activity3: null,
            activity4: undefined
          }
        },
        level2: null,
        level3: undefined
      };

      const summary = calculateSummary(mockFormData);

      expect(summary.level1.weeklyHours).toBe(0);
      expect(summary.level2.weeklyHours).toBe(0);
      expect(summary.level3.weeklyHours).toBe(0);
      expect(summary.summary.totalMonthlyHours).toBe(0);
      expect(summary.summary.totalMonthlyCost).toBe(0);
      expect(summary.summary.annualCost).toBe(0);
    });
  });
});