import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { AttendantCareSection } from '../../components/AttendantCareSection';
import { renderWithForm } from '../utils/test-utils';
import { CARE_RATES, WEEKLY_TO_MONTHLY } from '../../constants';

// Mock AssessmentContext
jest.mock('@/contexts/AssessmentContext', () => ({
  useAssessment: () => ({
    data: { attendantCare: {} },
    updateSection: jest.fn()
  })
}));

describe('Attendant Care Calculation Flow Integration', () => {
  it('flows calculations from activities to summary correctly', async () => {
    const onDataChange = jest.fn();
    const { user } = renderWithForm(
      <AttendantCareSection onDataChange={onDataChange} />
    );

    // Set up known test data for precise calculation verification
    await user.click(screen.getByRole('tab', { name: /Level 1/i }));
    
    // Expand first category
    const level1Categories = screen.getAllByRole('button');
    await user.click(level1Categories[0]);
    
    // Enter exact test values
    const minutesInput = screen.getAllByLabelText(/Minutes per Activity/i)[0];
    const timesInput = screen.getAllByLabelText(/Times per Week/i)[0];
    
    await user.type(minutesInput, '60'); // 1 hour per time
    await user.type(timesInput, '7');    // 7 times per week
    
    // Expected calculations:
    // - Total minutes: 60 * 7 = 420 minutes per week
    // - Weekly hours: 420 / 60 = 7 hours per week
    // - Monthly hours: 7 * 4.3 = 30.1 hours per month
    // - Monthly cost: 30.1 * 14.90 = 448.49
    
    // Open summary
    await user.click(screen.getByText(/View Summary/i));
    
    // Verify calculations in summary
    await waitFor(() => {
      // Check Level 1 calculations
      expect(screen.getByText(/Weekly Hours: 7/)).toBeInTheDocument();
      expect(screen.getByText(/Monthly Hours: 30.1/)).toBeInTheDocument();
      expect(screen.getByText(/Rate: \$14.9\/hr/)).toBeInTheDocument();
      expect(screen.getByText(/Monthly Cost: \$448.49/)).toBeInTheDocument();
      
      // Check Total calculations
      expect(screen.getByText(/Total Monthly Hours: 30.1/)).toBeInTheDocument();
      expect(screen.getByText(/Total Monthly Cost: \$448.49/)).toBeInTheDocument();
      expect(screen.getByText(/Annual Cost Estimate: \$5,381.88/)).toBeInTheDocument();
    });
    
    // Verify calculations in callback data
    await waitFor(() => {
      const lastCall = onDataChange.mock.calls[onDataChange.mock.calls.length - 1][0];
      const calculations = lastCall.calculations;
      
      expect(calculations.level1.weeklyHours).toBe(7);
      expect(calculations.level1.monthlyHours).toBe(30.1);
      expect(calculations.level1.monthlyCost).toBe(448.49);
      
      expect(calculations.summary.totalMonthlyHours).toBe(30.1);
      expect(calculations.summary.totalMonthlyCost).toBe(448.49);
      expect(calculations.summary.annualCost).toBe(5381.88);
    });
  });

  it('calculates multi-level totals with precision', async () => {
    const { user } = renderWithForm(<AttendantCareSection />);

    // Add data to all three levels with consistent test values
    
    // Level 1: 60 mins × 7 = 420 mins/week = 7 hours/week
    await user.click(screen.getByRole('tab', { name: /Level 1/i }));
    await user.click(screen.getAllByRole('button')[0]); // First category
    await user.type(screen.getAllByLabelText(/Minutes per Activity/i)[0], '60');
    await user.type(screen.getAllByLabelText(/Times per Week/i)[0], '7');

    // Level 2: 30 mins × 14 = 420 mins/week = 7 hours/week
    await user.click(screen.getByRole('tab', { name: /Level 2/i }));
    await user.click(screen.getAllByRole('button')[0]); // First category
    await user.type(screen.getAllByLabelText(/Minutes per Activity/i)[0], '30');
    await user.type(screen.getAllByLabelText(/Times per Week/i)[0], '14');

    // Level 3: 20 mins × 21 = 420 mins/week = 7 hours/week
    await user.click(screen.getByRole('tab', { name: /Level 3/i }));
    await user.click(screen.getAllByRole('button')[0]); // First category
    await user.type(screen.getAllByLabelText(/Minutes per Activity/i)[0], '20');
    await user.type(screen.getAllByLabelText(/Times per Week/i)[0], '21');

    // Expected calculations for each level:
    // - Weekly hours: 7 hours per week
    // - Monthly hours: 7 * 4.3 = 30.1 hours per month
    
    // Level 1 cost: 30.1 * 14.90 = 448.49
    // Level 2 cost: 30.1 * 14.00 = 421.40
    // Level 3 cost: 30.1 * 21.11 = 635.41
    // Total monthly cost: 448.49 + 421.40 + 635.41 = 1,505.30
    // Annual cost: 1,505.30 * 12 = 18,063.60

    // Open summary
    await user.click(screen.getByText(/View Summary/i));
    
    // Verify calculations in summary
    await waitFor(() => {
      // Level 1
      expect(screen.getByText(/Level 1 - Routine Personal Care/i).parentElement).toHaveTextContent(/Weekly Hours: 7/i);
      expect(screen.getByText(/Level 1 - Routine Personal Care/i).parentElement).toHaveTextContent(/Monthly Hours: 30.1/i);
      expect(screen.getByText(/Level 1 - Routine Personal Care/i).parentElement).toHaveTextContent(/Monthly Cost: \$448.49/i);
      
      // Level 2
      expect(screen.getByText(/Level 2 - Basic Supervision/i).parentElement).toHaveTextContent(/Weekly Hours: 7/i);
      expect(screen.getByText(/Level 2 - Basic Supervision/i).parentElement).toHaveTextContent(/Monthly Hours: 30.1/i);
      expect(screen.getByText(/Level 2 - Basic Supervision/i).parentElement).toHaveTextContent(/Monthly Cost: \$421.4/i);
      
      // Level 3
      expect(screen.getByText(/Level 3 - Complex Care/i).parentElement).toHaveTextContent(/Weekly Hours: 7/i);
      expect(screen.getByText(/Level 3 - Complex Care/i).parentElement).toHaveTextContent(/Monthly Hours: 30.1/i);
      expect(screen.getByText(/Level 3 - Complex Care/i).parentElement).toHaveTextContent(/Monthly Cost: \$635.41/i);
      
      // Totals
      expect(screen.getByText(/Total Monthly Hours: 90.3/i)).toBeInTheDocument();
      expect(screen.getByText(/Total Monthly Cost: \$1,505.3/i)).toBeInTheDocument();
      expect(screen.getByText(/Annual Cost Estimate: \$18,063.6/i)).toBeInTheDocument();
    });
  });

  it('handles activity updates and recalculations', async () => {
    const { user } = renderWithForm(<AttendantCareSection />);

    // Enter initial data
    await user.click(screen.getByRole('tab', { name: /Level 1/i }));
    await user.click(screen.getAllByRole('button')[0]); // First category
    
    const minutesInput = screen.getAllByLabelText(/Minutes per Activity/i)[0];
    const timesInput = screen.getAllByLabelText(/Times per Week/i)[0];
    
    await user.type(minutesInput, '30');
    await user.type(timesInput, '7');
    
    // Open summary to check initial calculations
    await user.click(screen.getByText(/View Summary/i));
    
    // Get initial total (30 * 7 = 210 minutes = 3.5 hours/week)
    const initialHours = screen.getByText(/Level 1 - Routine Personal Care/i).parentElement?.textContent?.match(/Weekly Hours: (\d+(\.\d+)?)/i)?.[1];
    
    // Close summary
    await user.click(screen.getByTestId('dialog-close'));
    
    // Update input values
    await user.clear(minutesInput);
    await user.clear(timesInput);
    await user.type(minutesInput, '60');
    await user.type(timesInput, '7');
    
    // Open summary again
    await user.click(screen.getByText(/View Summary/i));
    
    // Verify calculations updated (60 * 7 = 420 minutes = 7 hours/week)
    await waitFor(() => {
      const updatedHours = screen.getByText(/Level 1 - Routine Personal Care/i).parentElement?.textContent?.match(/Weekly Hours: (\d+(\.\d+)?)/i)?.[1];
      expect(updatedHours).not.toBe(initialHours);
      expect(parseFloat(updatedHours || '0')).toBe(7);
    });
  });

  it('calculates zero when inputs are cleared', async () => {
    const { user } = renderWithForm(<AttendantCareSection />);

    // Enter initial data
    await user.click(screen.getByRole('tab', { name: /Level 1/i }));
    await user.click(screen.getAllByRole('button')[0]); // First category
    
    const minutesInput = screen.getAllByLabelText(/Minutes per Activity/i)[0];
    const timesInput = screen.getAllByLabelText(/Times per Week/i)[0];
    
    await user.type(minutesInput, '30');
    await user.type(timesInput, '7');
    
    // Open summary
    await user.click(screen.getByText(/View Summary/i));
    
    // Verify non-zero values
    await waitFor(() => {
      expect(screen.getByText(/Level 1 - Routine Personal Care/i).parentElement).toHaveTextContent(/Weekly Hours: 3.5/i);
    });
    
    // Close summary
    await user.click(screen.getByTestId('dialog-close'));
    
    // Clear inputs
    await user.clear(minutesInput);
    await user.clear(timesInput);
    
    // Open summary again
    await user.click(screen.getByText(/View Summary/i));
    
    // Verify zero calculations
    await waitFor(() => {
      expect(screen.getByText(/Level 1 - Routine Personal Care/i).parentElement).toHaveTextContent(/Weekly Hours: 0/i);
      expect(screen.getByText(/Level 1 - Routine Personal Care/i).parentElement).toHaveTextContent(/Monthly Hours: 0/i);
      expect(screen.getByText(/Level 1 - Routine Personal Care/i).parentElement).toHaveTextContent(/Monthly Cost: \$0/i);
    });
  });

  it('matches manual calculations with precise values', async () => {
    const onDataChange = jest.fn();
    const { user } = renderWithForm(
      <AttendantCareSection onDataChange={onDataChange} />
    );

    // Enter precise test values
    await user.click(screen.getByRole('tab', { name: /Level 1/i }));
    await user.click(screen.getAllByRole('button')[0]); // First category
    
    await user.type(screen.getAllByLabelText(/Minutes per Activity/i)[0], '37');
    await user.type(screen.getAllByLabelText(/Times per Week/i)[0], '13');
    
    // Manual calculations:
    // Total minutes: 37 * 13 = 481 minutes/week
    // Weekly hours: 481 / 60 = 8.02 hours/week
    // Monthly hours: 8.02 * 4.3 = 34.49 hours/month
    // Monthly cost: 34.49 * 14.90 = 513.90
    
    await waitFor(() => {
      const lastCall = onDataChange.mock.calls[onDataChange.mock.calls.length - 1][0];
      const calculations = lastCall.calculations;
      
      // Check with small tolerance for floating-point arithmetic
      expect(calculations.level1.weeklyHours).toBeCloseTo(8.02, 1);
      expect(calculations.level1.monthlyHours).toBeCloseTo(34.49, 1);
      expect(calculations.level1.monthlyCost).toBeCloseTo(513.90, 0);
    });
  });
});