import {
  calculateTotalMinutes,
  calculateWeeklyHours,
  calculateMonthlyHours,
  calculateMonthlyCost
} from '../utils/calculations';
import { CARE_RATES, WEEKLY_TO_MONTHLY } from '../constants';

describe('Attendant Care Basic Calculations', () => {
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
});
