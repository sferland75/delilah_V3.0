import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { AttendantCareSection } from '../../components/AttendantCareSection';
import { renderWithForm, mockFormData, createTestActivity } from '../utils/test-utils';

// Mock AssessmentContext
jest.mock('@/contexts/AssessmentContext', () => ({
  useAssessment: () => ({
    data: { attendantCare: {} },
    updateSection: jest.fn()
  })
}));

describe('Attendant Care Form State Integration', () => {
  it('integrates form validation across all levels', async () => {
    const { user } = renderWithForm(<AttendantCareSection />);

    // Try to enter invalid data in each level
    // Level 1
    await user.click(screen.getByRole('tab', { name: /Level 1/i }));
    const level1Categories = screen.getAllByRole('button');
    await user.click(level1Categories[0]); // First category
    const level1Minutes = screen.getAllByLabelText(/Minutes per Activity/i)[0];
    await user.type(level1Minutes, '-30');

    // Level 2
    await user.click(screen.getByRole('tab', { name: /Level 2/i }));
    const level2Categories = screen.getAllByRole('button');
    await user.click(level2Categories[0]); // First category
    const level2Minutes = screen.getAllByLabelText(/Minutes per Activity/i)[0];
    await user.type(level2Minutes, '-45');

    // Level 3
    await user.click(screen.getByRole('tab', { name: /Level 3/i }));
    const level3Categories = screen.getAllByRole('button');
    await user.click(level3Categories[0]); // First category
    const level3Minutes = screen.getAllByLabelText(/Minutes per Activity/i)[0];
    await user.type(level3Minutes, '-60');

    // Verify no negative values were accepted
    await user.click(screen.getByRole('tab', { name: /Level 1/i }));
    await user.click(level1Categories[0]); // First category
    expect(screen.getAllByLabelText(/Minutes per Activity/i)[0]).not.toHaveValue(-30);

    await user.click(screen.getByRole('tab', { name: /Level 2/i }));
    await user.click(level2Categories[0]); // First category
    expect(screen.getAllByLabelText(/Minutes per Activity/i)[0]).not.toHaveValue(-45);

    await user.click(screen.getByRole('tab', { name: /Level 3/i }));
    await user.click(level3Categories[0]); // First category
    expect(screen.getAllByLabelText(/Minutes per Activity/i)[0]).not.toHaveValue(-60);
  });

  it('handles concurrent form updates across levels', async () => {
    const onDataChange = jest.fn();
    const { user } = renderWithForm(
      <AttendantCareSection onDataChange={onDataChange} />
    );

    // Rapidly enter data across different levels
    // Level 1
    await user.click(screen.getByRole('tab', { name: /Level 1/i }));
    const level1Categories = screen.getAllByRole('button');
    await user.click(level1Categories[0]); // First category
    await user.type(screen.getAllByLabelText(/Minutes per Activity/i)[0], '30');
    await user.type(screen.getAllByLabelText(/Times per Week/i)[0], '7');

    // Quick switch to Level 2
    await user.click(screen.getByRole('tab', { name: /Level 2/i }));
    const level2Categories = screen.getAllByRole('button');
    await user.click(level2Categories[0]); // First category
    await user.type(screen.getAllByLabelText(/Minutes per Activity/i)[0], '45');
    await user.type(screen.getAllByLabelText(/Times per Week/i)[0], '7');

    // Quick switch to Level 3
    await user.click(screen.getByRole('tab', { name: /Level 3/i }));
    const level3Categories = screen.getAllByRole('button');
    await user.click(level3Categories[0]); // First category
    await user.type(screen.getAllByLabelText(/Minutes per Activity/i)[0], '60');
    await user.type(screen.getAllByLabelText(/Times per Week/i)[0], '7');

    // Verify all data was captured correctly
    await waitFor(() => {
      const lastCall = onDataChange.mock.calls[onDataChange.mock.calls.length - 1][0];
      expect(lastCall.level1).toBeDefined();
      expect(lastCall.level2).toBeDefined();
      expect(lastCall.level3).toBeDefined();
    });
  });

  it('integrates notes across care levels', async () => {
    const { user } = renderWithForm(<AttendantCareSection />);

    // Enter notes in each level
    // Level 1
    await user.click(screen.getByRole('tab', { name: /Level 1/i }));
    const level1Categories = screen.getAllByRole('button');
    await user.click(level1Categories[0]); // First category
    await user.type(
      screen.getAllByPlaceholderText(/Enter details about assistance/i)[0],
      'Level 1 note'
    );

    // Level 2
    await user.click(screen.getByRole('tab', { name: /Level 2/i }));
    const level2Categories = screen.getAllByRole('button');
    await user.click(level2Categories[0]); // First category
    await user.type(
      screen.getAllByPlaceholderText(/Enter details about assistance/i)[0],
      'Level 2 note'
    );

    // Level 3
    await user.click(screen.getByRole('tab', { name: /Level 3/i }));
    const level3Categories = screen.getAllByRole('button');
    await user.click(level3Categories[0]); // First category
    await user.type(
      screen.getAllByPlaceholderText(/Enter details about assistance/i)[0],
      'Level 3 note'
    );

    // Verify notes persist after switching
    await user.click(screen.getByRole('tab', { name: /Level 1/i }));
    await user.click(level1Categories[0]); // First category
    expect(screen.getAllByPlaceholderText(/Enter details about assistance/i)[0]).toHaveValue('Level 1 note');

    await user.click(screen.getByRole('tab', { name: /Level 2/i }));
    await user.click(level2Categories[0]); // First category
    expect(screen.getAllByPlaceholderText(/Enter details about assistance/i)[0]).toHaveValue('Level 2 note');

    await user.click(screen.getByRole('tab', { name: /Level 3/i }));
    await user.click(level3Categories[0]); // First category
    expect(screen.getAllByPlaceholderText(/Enter details about assistance/i)[0]).toHaveValue('Level 3 note');
  });

  it('maintains summary calculations during form updates', async () => {
    const { user } = renderWithForm(<AttendantCareSection />);

    // Enter initial data and open summary
    await user.click(screen.getByRole('tab', { name: /Level 1/i }));
    const level1Categories = screen.getAllByRole('button');
    await user.click(level1Categories[0]); // First category
    await user.type(screen.getAllByLabelText(/Minutes per Activity/i)[0], '30');
    await user.type(screen.getAllByLabelText(/Times per Week/i)[0], '7');
    await user.click(screen.getByText(/View Summary/i));

    // Get initial total
    const initialTotal = screen.getByText(/Total Monthly Cost/i).textContent;

    // Update data with summary open
    await user.click(screen.getByRole('tab', { name: /Level 2/i }));
    const level2Categories = screen.getAllByRole('button');
    await user.click(level2Categories[0]); // First category
    await user.type(screen.getAllByLabelText(/Minutes per Activity/i)[0], '45');
    await user.type(screen.getAllByLabelText(/Times per Week/i)[0], '7');

    // Verify summary updates
    await waitFor(() => {
      const newTotal = screen.getByText(/Total Monthly Cost/i).textContent;
      expect(newTotal).not.toBe(initialTotal);
    });
  });

  it('loads and processes complex initial data correctly', async () => {
    const onDataChange = jest.fn();
    renderWithForm(
      <AttendantCareSection initialData={mockFormData} onDataChange={onDataChange} />
    );

    // Verify callback receives correctly calculated data
    await waitFor(() => {
      const lastCall = onDataChange.mock.calls[onDataChange.mock.calls.length - 1][0];
      
      // Verify calculations structure
      expect(lastCall.calculations).toBeDefined();
      expect(lastCall.calculations.level1).toBeDefined();
      expect(lastCall.calculations.level2).toBeDefined();
      expect(lastCall.calculations.level3).toBeDefined();
      expect(lastCall.calculations.summary).toBeDefined();
      
      // Verify calculations are non-zero
      expect(lastCall.calculations.level1.weeklyHours).toBeGreaterThan(0);
      expect(lastCall.calculations.level2.weeklyHours).toBeGreaterThan(0);
      expect(lastCall.calculations.level3.weeklyHours).toBeGreaterThan(0);
      expect(lastCall.calculations.summary.totalMonthlyHours).toBeGreaterThan(0);
      expect(lastCall.calculations.summary.totalMonthlyCost).toBeGreaterThan(0);
      expect(lastCall.calculations.summary.annualCost).toBeGreaterThan(0);
    });
  });

  it('integrates activity totals across categories', async () => {
    const { user } = renderWithForm(<AttendantCareSection />);

    // Add data to multiple activities in Level 1
    await user.click(screen.getByRole('tab', { name: /Level 1/i }));
    
    // Expand first category
    const level1Categories = screen.getAllByRole('button');
    await user.click(level1Categories[0]); // First category
    
    // Add data to multiple activities
    const minutesInputs = screen.getAllByLabelText(/Minutes per Activity/i);
    const timesInputs = screen.getAllByLabelText(/Times per Week/i);
    
    // First activity
    await user.type(minutesInputs[0], '30');
    await user.type(timesInputs[0], '7');
    
    // Second activity if available
    if (minutesInputs.length > 1) {
      await user.type(minutesInputs[1], '15');
      await user.type(timesInputs[1], '14');
    }

    // View summary and check values
    await user.click(screen.getByText(/View Summary/i));
    
    await waitFor(() => {
      // If two activities were entered:
      // Activity 1: 30 mins × 7 = 210 mins
      // Activity 2: 15 mins × 14 = 210 mins
      // Total: 420 mins = 7 hours per week
      // Monthly: 7 * 4.3 = 30.1 hours
      // Cost: 30.1 * CARE_RATES.LEVEL_1
      
      const monthlyHoursElement = screen.getByText(/Monthly Hours:/i);
      expect(monthlyHoursElement).toBeInTheDocument();
      
      // Check that hours are calculated and greater than zero
      expect(parseFloat(monthlyHoursElement.textContent?.match(/\d+\.\d+/)?.[0] || '0')).toBeGreaterThan(0);
    });
  });

  it('handles form reset and recalculation', async () => {
    const onDataChange = jest.fn();
    const { user, rerender } = renderWithForm(
      <AttendantCareSection onDataChange={onDataChange} />
    );

    // Enter initial data
    await user.click(screen.getByRole('tab', { name: /Level 1/i }));
    const level1Categories = screen.getAllByRole('button');
    await user.click(level1Categories[0]); // First category
    await user.type(screen.getAllByLabelText(/Minutes per Activity/i)[0], '30');
    await user.type(screen.getAllByLabelText(/Times per Week/i)[0], '7');

    // Check initial calculations
    let initialCalculations;
    await waitFor(() => {
      const lastCall = onDataChange.mock.calls[onDataChange.mock.calls.length - 1][0];
      initialCalculations = lastCall.calculations;
      expect(initialCalculations.level1.weeklyHours).toBeGreaterThan(0);
    });

    // Reset form with new data
    const newData = {
      level1: {
        personalCare: {
          bathing: createTestActivity(60, 7), // Different values
        }
      }
    };

    // Rerender with new data
    rerender(<AttendantCareSection initialData={newData} onDataChange={onDataChange} />);

    // Verify calculations updated
    await waitFor(() => {
      const lastCall = onDataChange.mock.calls[onDataChange.mock.calls.length - 1][0];
      const newCalculations = lastCall.calculations;
      
      // Calculations should be different
      expect(newCalculations.level1.weeklyHours).not.toBe(initialCalculations.level1.weeklyHours);
      expect(newCalculations.summary.totalMonthlyCost).not.toBe(initialCalculations.summary.totalMonthlyCost);
    });
  });
});