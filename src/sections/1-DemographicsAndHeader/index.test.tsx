import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DemographicsSection } from './index';
import { renderWithFormAndAssessment } from '@/test/test-utils';
import { useAssessmentContext } from '@/contexts/AssessmentContext';
import { useFormPersistence } from '@/hooks/useFormPersistence';

// Mock the necessary hooks
jest.mock('@/contexts/AssessmentContext', () => ({
  useAssessmentContext: jest.fn()
}));

jest.mock('@/hooks/useFormPersistence', () => ({
  useFormPersistence: jest.fn()
}));

describe('DemographicsSection', () => {
  beforeEach(() => {
    (useAssessmentContext as jest.Mock).mockReturnValue({
      mode: 'edit'
    });
    (useFormPersistence as jest.Mock).mockImplementation(() => {});
  });

  it('renders in edit mode with all tabs', () => {
    renderWithFormAndAssessment(<DemographicsSection />);
    
    // Check for all tabs
    expect(screen.getByRole('tab', { name: /personal/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /contact/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /insurance/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /legal/i })).toBeInTheDocument();
  });

  it('switches between tabs correctly', async () => {
    const user = userEvent.setup();
    renderWithFormAndAssessment(<DemographicsSection />);
    
    // Click contact tab
    await user.click(screen.getByRole('tab', { name: /contact/i }));
    expect(screen.getByRole('tabpanel', { name: /contact/i })).toBeVisible();
    
    // Click insurance tab
    await user.click(screen.getByRole('tab', { name: /insurance/i }));
    expect(screen.getByRole('tabpanel', { name: /insurance/i })).toBeVisible();
  });

  it('supports keyboard navigation between tabs', async () => {
    const user = userEvent.setup();
    renderWithFormAndAssessment(<DemographicsSection />);
    
    // Focus first tab
    await user.tab();
    expect(screen.getByRole('tab', { name: /personal/i })).toHaveFocus();
    
    // Navigate with arrow keys
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: /contact/i })).toHaveFocus();
    
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: /insurance/i })).toHaveFocus();
    
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('tab', { name: /contact/i })).toHaveFocus();
  });

  it('maintains focus management within tabs', async () => {
    const user = userEvent.setup();
    renderWithFormAndAssessment(<DemographicsSection />);
    
    // Navigate to personal tab
    await user.click(screen.getByRole('tab', { name: /personal/i }));
    
    // Tab through fields
    await user.tab(); // First Name
    expect(screen.getByLabelText(/first name/i)).toHaveFocus();
    
    await user.tab(); // Last Name
    expect(screen.getByLabelText(/last name/i)).toHaveFocus();
    
    await user.tab(); // Date of Birth
    expect(screen.getByLabelText(/date of birth/i)).toHaveFocus();
  });

  it('persists validation errors across tab switches', async () => {
    const user = userEvent.setup();
    renderWithFormAndAssessment(<DemographicsSection />);
    
    // Submit empty form to trigger validation
    await user.click(screen.getByRole('button', { name: /submit/i }));
    
    // Check personal tab errors
    expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
    
    // Switch to contact tab
    await user.click(screen.getByRole('tab', { name: /contact/i }));
    expect(screen.getByText(/phone number is required/i)).toBeInTheDocument();
    
    // Switch back to personal
    await user.click(screen.getByRole('tab', { name: /personal/i }));
    expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
  });

  it('handles form autosave', async () => {
    const user = userEvent.setup();
    renderWithFormAndAssessment(<DemographicsSection />);
    
    // Type in a field
    await user.type(screen.getByLabelText(/first name/i), 'John');
    
    // Wait for autosave
    await waitFor(() => {
      expect(useFormPersistence).toHaveBeenCalled();
    });
  });

  it('maintains form state during mode switches', async () => {
    const user = userEvent.setup();
    const { rerender } = renderWithFormAndAssessment(<DemographicsSection />);
    
    // Fill in form data
    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    
    // Switch to view mode
    (useAssessmentContext as jest.Mock).mockReturnValue({
      mode: 'view'
    });
    rerender(<DemographicsSection />);
    
    // Verify data is displayed
    expect(screen.getByText(/john/i)).toBeInTheDocument();
    expect(screen.getByText(/doe/i)).toBeInTheDocument();
    
    // Switch back to edit mode
    (useAssessmentContext as jest.Mock).mockReturnValue({
      mode: 'edit'
    });
    rerender(<DemographicsSection />);
    
    // Verify form state persisted
    expect(screen.getByLabelText(/first name/i)).toHaveValue('John');
    expect(screen.getByLabelText(/last name/i)).toHaveValue('Doe');
  });

  it('handles API submission errors', async () => {
    const user = userEvent.setup();
    const mockSubmit = jest.fn().mockRejectedValue(new Error('API Error'));
    
    renderWithFormAndAssessment(<DemographicsSection onSubmit={mockSubmit} />);
    
    // Fill required fields
    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /submit/i }));
    
    // Verify error handling
    await waitFor(() => {
      expect(screen.getByText(/api error/i)).toBeInTheDocument();
    });
  });

  it('handles successful form submission', async () => {
    const user = userEvent.setup();
    const mockSubmit = jest.fn().mockResolvedValue({});
    
    renderWithFormAndAssessment(<DemographicsSection onSubmit={mockSubmit} />);
    
    // Fill required fields
    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /submit/i }));
    
    // Verify submission
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled();
      expect(screen.getByText(/successfully submitted/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('maintains tab panel focus when switching tabs', async () => {
      const user = userEvent.setup();
      renderWithFormAndAssessment(<DemographicsSection />);
      
      // Focus last field in personal tab
      await user.click(screen.getByRole('tab', { name: /personal/i }));
      await user.tab(); // First Name
      await user.tab(); // Last Name
      await user.tab(); // Date of Birth
      
      // Switch to contact tab
      await user.click(screen.getByRole('tab', { name: /contact/i }));
      
      // First field in contact should be focused
      expect(screen.getByLabelText(/phone number/i)).toHaveFocus();
    });

    it('announces validation errors to screen readers', async () => {
      const user = userEvent.setup();
      renderWithFormAndAssessment(<DemographicsSection />);
      
      // Submit empty form
      await user.click(screen.getByRole('button', { name: /submit/i }));
      
      // Check for aria-invalid and aria-errormessage
      const firstNameInput = screen.getByLabelText(/first name/i);
      expect(firstNameInput).toHaveAttribute('aria-invalid', 'true');
      expect(firstNameInput).toHaveAttribute('aria-errormessage');
    });
  });
});