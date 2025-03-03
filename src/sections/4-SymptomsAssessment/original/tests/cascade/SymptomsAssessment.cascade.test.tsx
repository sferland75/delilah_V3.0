import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SymptomsAssessment } from '../../components/SymptomsAssessment';
import { setupCascadeTest } from './test-setup';

describe('Symptoms Assessment with Cascade Handling', () => {
  const { runner, TestWrapper } = setupCascadeTest();
  
  beforeEach(() => {
    // Clear form and context state
    runner.reset();
  });

  it('completes full workflow with proper state management', async () => {
    const user = userEvent.setup();
    
    render(<SymptomsAssessment />, { wrapper: TestWrapper });

    // Step 1: Cognitive Symptoms
    await user.click(screen.getByRole('button', { name: /add cognitive/i }));
    await user.type(screen.getByLabelText(/description/i), 'Memory issues');
    await user.click(screen.getByRole('button', { name: /save cognitive/i }));
    
    // Verify cognitive state
    await waitFor(() => {
      expect(runner.getStepState('cognitive')).toBeTruthy();
    });

    // Step 2: Physical Symptoms (required)
    await user.click(screen.getByRole('button', { name: /add physical/i }));
    const bodyMap = screen.getByTestId('body-map');
    await user.click(bodyMap);
    await user.click(screen.getByRole('button', { name: /save physical/i }));
    
    // Verify physical state
    await waitFor(() => {
      expect(runner.getStepState('physical')).toBeTruthy();
    });

    // Step 3: Emotional Symptoms (optional, depends on cognitive)
    await user.click(screen.getByRole('button', { name: /add emotional/i }));
    await user.click(screen.getByLabelText(/anxiety/i));
    await user.click(screen.getByRole('button', { name: /save emotional/i }));

    // Verify workflow completion
    await waitFor(() => {
      expect(runner.isComplete()).toBe(true);
    });
  });

  it('handles failures with proper recovery', async () => {
    const user = userEvent.setup();
    
    render(<SymptomsAssessment />, { 
      wrapper: TestWrapper,
      props: { simulateError: true }
    });

    // Attempt cognitive with error
    await user.click(screen.getByRole('button', { name: /add cognitive/i }));
    await user.type(screen.getByLabelText(/description/i), 'Will fail');
    await user.click(screen.getByRole('button', { name: /save cognitive/i }));
    
    // Should show error and allow retry
    await waitFor(() => {
      expect(screen.getByText(/error occurred/i)).toBeInTheDocument();
    });

    // Retry should work
    await user.click(screen.getByRole('button', { name: /retry/i }));
    await user.type(screen.getByLabelText(/description/i), 'Now works');
    await user.click(screen.getByRole('button', { name: /save cognitive/i }));
    
    await waitFor(() => {
      expect(runner.getStepState('cognitive')).toBeTruthy();
    });
  });

  it('enforces dependencies between sections', async () => {
    const user = userEvent.setup();
    
    render(<SymptomsAssessment />, { wrapper: TestWrapper });

    // Try to add emotional symptoms before cognitive
    await user.click(screen.getByRole('button', { name: /add emotional/i }));
    
    // Should show dependency warning
    expect(screen.getByText(/complete cognitive assessment first/i)).toBeInTheDocument();
    
    // Complete cognitive first
    await user.click(screen.getByRole('button', { name: /add cognitive/i }));
    await user.type(screen.getByLabelText(/description/i), 'Memory issues');
    await user.click(screen.getByRole('button', { name: /save cognitive/i }));
    
    // Now emotional should work
    await user.click(screen.getByRole('button', { name: /add emotional/i }));
    expect(screen.getByLabelText(/anxiety/i)).toBeInTheDocument();
  });

  it('maintains state between sections', async () => {
    const user = userEvent.setup();
    
    render(<SymptomsAssessment />, { wrapper: TestWrapper });

    // Add cognitive symptoms
    await user.click(screen.getByRole('button', { name: /add cognitive/i }));
    await user.type(screen.getByLabelText(/description/i), 'Memory issues');
    await user.click(screen.getByRole('button', { name: /save cognitive/i }));

    // Switch to physical
    await user.click(screen.getByRole('button', { name: /add physical/i }));

    // Switch back to cognitive
    await user.click(screen.getByRole('button', { name: /cognitive/i }));

    // Verify cognitive data persisted
    expect(screen.getByLabelText(/description/i)).toHaveValue('Memory issues');
  });
});