import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DemographicsSection } from '../index';
import { AssessmentProvider } from '@/contexts/AssessmentContext';
import { mockDemographicsData } from '@/test/test-utils';

// Mock persistence hook to avoid localStorage errors
jest.mock('@/hooks/useFormPersistence', () => ({
  useFormPersistence: jest.fn()
}));

const renderDemographics = () => {
  return render(
    <AssessmentProvider>
      <DemographicsSection />
    </AssessmentProvider>
  );
};

describe('Demographics Section Integration', () => {
  it('navigates between tabs and maintains form state', async () => {
    const user = userEvent.setup();
    renderDemographics();

    // Start with Personal tab
    expect(screen.getByRole('tab', { name: /personal/i })).toHaveAttribute('aria-selected', 'true');
    
    // Fill personal information
    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(screen.getByLabelText(/date of birth/i), '1990-01-01');
    
    // Select gender
    const genderSelect = screen.getByRole('combobox', { name: /gender/i });
    await user.click(genderSelect);
    await user.click(screen.getByRole('option', { name: /male/i }));

    // Move to Contact tab
    await user.click(screen.getByRole('tab', { name: /contact/i }));
    expect(screen.getByRole('tab', { name: /contact/i })).toHaveAttribute('aria-selected', 'true');
    
    // Fill contact information
    await user.type(screen.getByLabelText(/^phone number/i), '(555) 555-5555');
    await user.type(screen.getByLabelText(/email/i), 'john.doe@example.com');
    await user.type(screen.getByLabelText(/address/i), '123 Main St');

    // Move to Insurance tab
    await user.click(screen.getByRole('tab', { name: /insurance/i }));
    expect(screen.getByRole('tab', { name: /insurance/i })).toHaveAttribute('aria-selected', 'true');
    
    // Fill insurance information
    await user.type(screen.getByLabelText(/insurance provider/i), 'Test Insurance');
    await user.type(screen.getByLabelText(/claim number/i), 'CLM123456');
    await user.type(screen.getByLabelText(/claims adjustor/i), 'Sarah Smith');
    
    // Move to Legal tab
    await user.click(screen.getByRole('tab', { name: /legal/i }));
    expect(screen.getByRole('tab', { name: /legal/i })).toHaveAttribute('aria-selected', 'true');
    
    // Fill legal information
    await user.type(screen.getByLabelText(/legal representative name/i), 'Bob Wilson');
    await user.type(screen.getByLabelText(/law firm/i), 'Wilson Law');
    await user.type(screen.getByLabelText(/file number/i), 'FILE789');

    // Return to Personal tab and verify data persistence
    await user.click(screen.getByRole('tab', { name: /personal/i }));
    expect(screen.getByLabelText(/first name/i)).toHaveValue('John');
    expect(screen.getByLabelText(/last name/i)).toHaveValue('Doe');
  });

  it('validates form data across all sections', async () => {
    const user = userEvent.setup();
    renderDemographics();

    // Try to submit with empty required fields
    await user.click(screen.getByRole('button', { name: /submit/i }));
    
    // Check Personal tab errors
    expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
    
    // Move to Contact tab and check errors
    await user.click(screen.getByRole('tab', { name: /contact/i }));
    expect(screen.getByText(/phone number is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    
    // Move to Insurance tab and check errors
    await user.click(screen.getByRole('tab', { name: /insurance/i }));
    expect(screen.getByText(/insurance provider is required/i)).toBeInTheDocument();
    expect(screen.getByText(/claim number is required/i)).toBeInTheDocument();
    
    // Move to Legal tab and check errors
    await user.click(screen.getByRole('tab', { name: /legal/i }));
    expect(screen.getByText(/legal representative name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/law firm is required/i)).toBeInTheDocument();
  });

  it('handles view mode correctly', async () => {
    const user = userEvent.setup();
    render(
      <AssessmentProvider defaultMode="view">
        <DemographicsSection />
      </AssessmentProvider>
    );

    // Verify display component is shown
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
    expect(screen.getByText(/demographics information/i)).toBeInTheDocument();
  });

  it('preserves data between mode switches', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <AssessmentProvider>
        <DemographicsSection />
      </AssessmentProvider>
    );

    // Fill out some data
    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');

    // Switch to view mode
    rerender(
      <AssessmentProvider defaultMode="view">
        <DemographicsSection />
      </AssessmentProvider>
    );

    // Verify data is displayed
    expect(screen.getByText(/john/i)).toBeInTheDocument();
    expect(screen.getByText(/doe/i)).toBeInTheDocument();

    // Switch back to edit mode
    rerender(
      <AssessmentProvider defaultMode="edit">
        <DemographicsSection />
      </AssessmentProvider>
    );

    // Verify data is preserved
    expect(screen.getByLabelText(/first name/i)).toHaveValue('John');
    expect(screen.getByLabelText(/last name/i)).toHaveValue('Doe');
  });

  it('handles auto-save functionality', async () => {
    const user = userEvent.setup();
    renderDemographics();

    // Type in a field and wait for auto-save
    await user.type(screen.getByLabelText(/first name/i), 'John');
    
    // Wait for form persistence hook to be called
    await waitFor(() => {
      expect(require('@/hooks/useFormPersistence').useFormPersistence).toHaveBeenCalled();
    });
  });

  it('maintains accessibility across section navigation', async () => {
    const user = userEvent.setup();
    renderDemographics();

    // Test keyboard navigation
    await user.tab(); // Focus first tab
    expect(screen.getByRole('tab', { name: /personal/i })).toHaveFocus();

    await user.keyboard('{ArrowRight}'); // Move to next tab
    expect(screen.getByRole('tab', { name: /contact/i })).toHaveFocus();

    await user.keyboard('{ArrowRight}'); // Move to next tab
    expect(screen.getByRole('tab', { name: /insurance/i })).toHaveFocus();

    await user.keyboard('{ArrowRight}'); // Move to next tab
    expect(screen.getByRole('tab', { name: /legal/i })).toHaveFocus();

    // Test focus management within tabs
    await user.keyboard('{Enter}'); // Activate Legal tab
    await user.tab(); // Focus first field in Legal tab
    expect(screen.getByLabelText(/legal representative name/i)).toHaveFocus();
  });
});