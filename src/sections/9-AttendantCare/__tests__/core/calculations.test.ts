import {
  calculateTotalMinutes,
  calculateWeeklyHours,
  calculateMonthlyHours,
  calculateMonthlyCost,
  calculateTotalCostForCategory,
  calculateSummary
} from '../../utils/calculations';
import { CARE_RATES, WEEKLY_TO_MONTHLY } from '../../constants';
import { mockFormData } from '../utils/test-utils';

describe('Attendant Care Core Calculations', () => {
  describe('calculateTotalMinutes - Core', () => {
    it('calculates basic minute totals correctly', () => {
      expect(calculateTotalMinutes(30, 7)).toBe(210);    // Daily care
      expect(calculateTotalMinutes(60, 3)).toBe(180);    // Thrice weekly
      expect(calculateTotalMinutes(15, 14)).toBe(210);   // Twice daily
    });

    it('handles edge cases properly', () => {
      expect(calculateTotalMinutes(0, 7)).toBe(0);       // Zero minutes
      expect(calculateTotalMinutes(30, 0)).toBe(0);      // Zero frequency
      expect(calculateTotalMinutes(0, 0)).toBe(0);       // Both zero
    });
  });

  describe('calculateWeeklyHours - Core', () => {
    it('converts minutes to hours correctly', () => {
      expect(calculateWeeklyHours(60)).toBe(1);        // 1 hour
      expect(calculateWeeklyHours(90)).toBe(1.5);      // 1.5 hours
      expect(calculateWeeklyHours(30)).toBe(0.5);      // 30 minutes
    });

    it('handles edge cases for weekly hours', () => {
      expect(calculateWeeklyHours(0)).toBe(0);         // Zero minutes
      expect(calculateWeeklyHours(1)).toBeCloseTo(0.02, 2); // 1 minute
    });
  });

  describe('calculateMonthlyHours - Core', () => {
    it('converts weekly to monthly hours correctly', () => {
      expect(calculateMonthlyHours(7)).toBe(30.1);     // Weekly to monthly
      expect(calculateMonthlyHours(14)).toBe(60.2);    // Bi-weekly to monthly
      expect(calculateMonthlyHours(28)).toBe(120.4);   // 4x weekly to monthly
    });

    it('preserves precision in monthly calculations', () => {
      expect(calculateMonthlyHours(1.5)).toBe(6.45);   // Fractional hours
      expect(calculateMonthlyHours(0.5)).toBe(2.15);   // Small fractional hours
    });
  });

  describe('calculateMonthlyCost - Core', () => {
    it('calculates basic monthly costs correctly', () => {
      // Level 1 calculations
      expect(calculateMonthlyCost(10, 'LEVEL_1')).toBe(149);     // 10 hours at level 1
      expect(calculateMonthlyCost(20, 'LEVEL_1')).toBe(298);     // 20 hours at level 1

      // Level 2 calculations
      expect(calculateMonthlyCost(10, 'LEVEL_2')).toBe(140);     // 10 hours at level 2
      expect(calculateMonthlyCost(20, 'LEVEL_2')).toBe(280);     // 20 hours at level 2

      // Level 3 calculations
      expect(calculateMonthlyCost(10, 'LEVEL_3')).toBe(211.1);   // 10 hours at level 3
      expect(calculateMonthlyCost(20, 'LEVEL_3')).toBe(422.2);   // 20 hours at level 3
    });

    it('handles fractional hours correctly', () => {
      // Test with fractional hours
      expect(calculateMonthlyCost(1.5, 'LEVEL_1')).toBe(22.35);  // 1.5 hours
      expect(calculateMonthlyCost(0.5, 'LEVEL_2')).toBe(7);      // 30 minutes
      expect(calculateMonthlyCost(2.75, 'LEVEL_3')).toBe(58.05); // 2.75 hours
    });
  });

  describe('calculateTotalCostForCategory - Core', () => {
    it('calculates total cost for basic category data', () => {
      const basicCategory = {
        activity1: { totalMinutes: 60 },    // 1 hour
        activity2: { totalMinutes: 120 },   // 2 hours
        activity3: { totalMinutes: 30 }     // 0.5 hours
      };

      // Total: 3.5 weekly hours
      // Monthly: 3.5 * 4.3 = 15.05 hours
      
      const expectedLevel1Cost = 15.05 * CARE_RATES.LEVEL_1;
      const expectedLevel2Cost = 15.05 * CARE_RATES.LEVEL_2;
      const expectedLevel3Cost = 15.05 * CARE_RATES.LEVEL_3;

      expect(calculateTotalCostForCategory(basicCategory, 'LEVEL_1')).toBe(Number(expectedLevel1Cost.toFixed(2)));
      expect(calculateTotalCostForCategory(basicCategory, 'LEVEL_2')).toBe(Number(expectedLevel2Cost.toFixed(2)));
      expect(calculateTotalCostForCategory(basicCategory, 'LEVEL_3')).toBe(Number(expectedLevel3Cost.toFixed(2)));
    });

    it('handles empty and invalid category data', () => {
      expect(calculateTotalCostForCategory({}, 'LEVEL_1')).toBe(0);
      expect(calculateTotalCostForCategory({ invalid: {} }, 'LEVEL_1')).toBe(0);
      expect(calculateTotalCostForCategory({ activity: { totalMinutes: null } }, 'LEVEL_1')).toBe(0);
    });
  });

  describe('calculateSummary - Core', () => {
    it('calculates complete summary for basic form data', () => {
      const summary = calculateSummary(mockFormData);

      // Verify structure
      expect(summary).toHaveProperty('level1');
      expect(summary).toHaveProperty('level2');
      expect(summary).toHaveProperty('level3');
      expect(summary).toHaveProperty('summary');

      // Verify calculated properties exist
      expect(summary.level1).toHaveProperty('weeklyHours');
      expect(summary.level1).toHaveProperty('monthlyHours');
      expect(summary.level1).toHaveProperty('monthlyCost');

      // Values should be positive numbers
      expect(summary.level1.weeklyHours).toBeGreaterThan(0);
      expect(summary.summary.totalMonthlyHours).toBeGreaterThan(0);
      expect(summary.summary.totalMonthlyCost).toBeGreaterThan(0);
    });

    it('handles empty form data correctly', () => {
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