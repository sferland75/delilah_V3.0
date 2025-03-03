import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SymptomsAssessment } from '../../components/SymptomsAssessment';
import { setupCascadeTest } from '../cascade/test-setup';

const runFullAssessment = async (user: ReturnType<typeof userEvent.setup>) => {
  // Add cognitive symptoms
  await user.click(screen.getByRole('button', { name: /add cognitive/i }));
  await user.type(screen.getByLabelText(/description/i), 'Memory and concentration issues');
  await user.click(screen.getByRole('button', { name: /save cognitive/i }));

  // Add physical symptoms
  await user.click(screen.getByRole('button', { name: /add physical/i }));
  await user.click(screen.getByTestId('body-map'));
  await user.selectOptions(screen.getByLabelText(/pain type/i), 'sharp');
  await user.click(screen.getByRole('button', { name: /save physical/i }));

  // Add emotional symptoms
  await user.click(screen.getByRole('button', { name: /add emotional/i }));
  await user.click(screen.getByLabelText(/anxiety/i));
  await user.click(screen.getByRole('slider')); // Intensity slider
  await user.click(screen.getByRole('button', { name: /save emotional/i }));

  // Complete assessment
  await user.click(screen.getByRole('button', { name: /complete assessment/i }));
};

describe('Symptoms Assessment E2E', () => {
  const { runner, TestWrapper } = setupCascadeTest();

  beforeEach(() => {
    runner.reset();
  });

  it('completes full assessment flow', async () => {
    const user = userEvent.setup();
    
    render(<SymptomsAssessment />, { wrapper: TestWrapper });

    await runFullAssessment(user);

    // Verify final state
    await waitFor(() => {
      expect(runner.isComplete()).toBe(true);
      expect(screen.getByText(/assessment complete/i)).toBeInTheDocument();
    });
  });

  it('saves progress and allows later completion', async () => {
    const user = userEvent.setup();
    
    const { rerender } = render(<SymptomsAssessment />, { wrapper: TestWrapper });

    // Add cognitive symptoms
    await user.click(screen.getByRole('button', { name: /add cognitive/i }));
    await user.type(screen.getByLabelText(/description/i), 'Memory issues');
    await user.click(screen.getByRole('button', { name: /save cognitive/i }));

    // Simulate leaving and returning
    rerender(<SymptomsAssessment key="rerender" />);

    // Verify cognitive data persisted
    await user.click(screen.getByRole('button', { name: /cognitive/i }));
    expect(screen.getByLabelText(/description/i)).toHaveValue('Memory issues');

    // Complete remaining sections
    await user.click(screen.getByRole('button', { name: /add physical/i }));
    await user.click(screen.getByTestId('body-map'));
    await user.click(screen.getByRole('button', { name: /save physical/i }));

    await user.click(screen.getByRole('button', { name: /add emotional/i }));
    await user.click(screen.getByLabelText(/anxiety/i));
    await user.click(screen.getByRole('button', { name: /save emotional/i }));

    // Verify completion
    await user.click(screen.getByRole('button', { name: /complete assessment/i }));
    expect(screen.getByText(/assessment complete/i)).toBeInTheDocument();
  });

  it('validates required fields and shows appropriate errors', async () => {
    const user = userEvent.setup();
    
    render(<SymptomsAssessment />, { wrapper: TestWrapper });

    // Try to skip physical symptoms (required)
    await user.click(screen.getByRole('button', { name: /complete assessment/i }));
    expect(screen.getByText(/physical symptoms required/i)).toBeInTheDocument();

    // Add only physical symptoms
    await user.click(screen.getByRole('button', { name: /add physical/i }));
    await user.click(screen.getByTestId('body-map'));
    await user.click(screen.getByRole('button', { name: /save physical/i }));

    // Should allow completion with only required section
    await user.click(screen.getByRole('button', { name: /complete assessment/i }));
    expect(screen.getByText(/assessment complete/i)).toBeInTheDocument();
  });

  it('handles form validation within each section', async () => {
    const user = userEvent.setup();
    
    render(<SymptomsAssessment />, { wrapper: TestWrapper });

    // Try to save cognitive without description
    await user.click(screen.getByRole('button', { name: /add cognitive/i }));
    await user.click(screen.getByRole('button', { name: /save cognitive/i }));
    expect(screen.getByText(/description is required/i)).toBeInTheDocument();

    // Try to save physical without location
    await user.click(screen.getByRole('button', { name: /add physical/i }));
    await user.click(screen.getByRole('button', { name: /save physical/i }));
    expect(screen.getByText(/select at least one location/i)).toBeInTheDocument();

    // Try to save emotional without selections
    await user.click(screen.getByRole('button', { name: /add emotional/i }));
    await user.click(screen.getByRole('button', { name: /save emotional/i }));
    expect(screen.getByText(/select at least one symptom/i)).toBeInTheDocument();
  });

  it('handles navigation between sections while maintaining state', async () => {
    const user = userEvent.setup();
    
    render(<SymptomsAssessment />, { wrapper: TestWrapper });

    // Setup cognitive section
    await user.click(screen.getByRole('button', { name: /add cognitive/i }));
    await user.type(screen.getByLabelText(/description/i), 'Memory issues');
    await user.click(screen.getByRole('button', { name: /save cognitive/i }));

    // Navigate to physical
    await user.click(screen.getByRole('button', { name: /add physical/i }));
    await user.click(screen.getByTestId('body-map'));
    await user.click(screen.getByRole('button', { name: /save physical/i }));

    // Return to cognitive and verify state
    await user.click(screen.getByRole('button', { name: /cognitive/i }));
    expect(screen.getByLabelText(/description/i)).toHaveValue('Memory issues');

    // Check physical state persisted
    await user.click(screen.getByRole('button', { name: /physical/i }));
    expect(screen.getByTestId('selected-locations')).toBeInTheDocument();
  });

  it('properly handles dependency validation', async () => {
    const user = userEvent.setup();
    
    render(<SymptomsAssessment />, { wrapper: TestWrapper });

    // Try to access emotional before cognitive
    await user.click(screen.getByRole('button', { name: /add emotional/i }));
    expect(screen.getByText(/complete cognitive assessment first/i)).toBeInTheDocument();

    // Complete cognitive and verify emotional access
    await user.click(screen.getByRole('button', { name: /add cognitive/i }));
    await user.type(screen.getByLabelText(/description/i), 'Memory issues');
    await user.click(screen.getByRole('button', { name: /save cognitive/i }));

    await user.click(screen.getByRole('button', { name: /add emotional/i }));
    expect(screen.getByLabelText(/anxiety/i)).toBeInTheDocument();
  });
});