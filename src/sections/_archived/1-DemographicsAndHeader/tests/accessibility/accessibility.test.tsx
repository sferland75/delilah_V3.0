import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { DemographicsSection } from '../../components/DemographicsSection';
import { FormProvider } from '@/contexts/FormContext';

expect.extend(toHaveNoViolations);

describe('Demographics Section Accessibility', () => {
  const renderDemographics = () => {
    return render(
      <FormProvider>
        <DemographicsSection />
      </FormProvider>
    );
  };

  it('should have no accessibility violations', async () => {
    const { container } = renderDemographics();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('maintains proper focus management', async () => {
    renderDemographics();
    
    // Start from first field
    const firstNameInput = screen.getByLabelText(/first name/i);
    firstNameInput.focus();
    
    // Tab through fields
    await userEvent.tab();
    expect(screen.getByLabelText(/last name/i)).toHaveFocus();
    
    await userEvent.tab();
    expect(screen.getByLabelText(/date of birth/i)).toHaveFocus();
    
    await userEvent.tab();
    expect(screen.getByLabelText(/email/i)).toHaveFocus();
  });

  it('announces validation errors to screen readers', async () => {
    renderDemographics();
    
    // Submit with invalid data
    await userEvent.click(screen.getByRole('button', { name: /save/i }));
    
    // Check ARIA live region
    await waitFor(() => {
      const alerts = screen.getAllByRole('alert');
      alerts.forEach(alert => {
        expect(alert).toHaveAttribute('aria-live', 'polite');
      });
    });
  });

  it('has proper ARIA labels on all form controls', () => {
    renderDemographics();
    
    // Check all form controls have proper labels
    const formControls = screen.getAllByRole('textbox');
    formControls.forEach(control => {
      expect(control).toHaveAttribute('aria-label');
    });

    // Check section headings
    const sections = screen.getAllByRole('region');
    sections.forEach(section => {
      expect(section).toHaveAttribute('aria-labelledby');
    });
  });

  it('supports keyboard navigation between tabs', async () => {
    renderDemographics();
    
    // Navigate to tabs list
    const tabList = screen.getByRole('tablist');
    tabList.focus();
    
    // Use arrow keys to navigate
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: /contact/i })).toHaveFocus();
    
    await userEvent.keyboard('{ArrowLeft}');
    expect(screen.getByRole('tab', { name: /personal/i })).toHaveFocus();
  });

  it('maintains focus after form submission', async () => {
    renderDemographics();
    
    // Fill required field
    const firstNameInput = screen.getByLabelText(/first name/i);
    await userEvent.type(firstNameInput, 'John');
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: /save/i });
    await userEvent.click(submitButton);
    
    // Focus should return to the form
    await waitFor(() => {
      expect(firstNameInput).toHaveFocus();
    });
  });

  it('handles error messages with proper ARIA attributes', async () => {
    renderDemographics();
    
    // Submit empty form to trigger validation
    await userEvent.click(screen.getByRole('button', { name: /save/i }));
    
    // Check error messages
    await waitFor(() => {
      const errorMessages = screen.getAllByRole('alert');
      errorMessages.forEach(error => {
        expect(error).toHaveAttribute('role', 'alert');
        expect(error).toHaveAttribute('aria-live', 'polite');
      });
    });
  });

  it('provides skip links for keyboard navigation', () => {
    renderDemographics();
    
    const skipLinks = screen.getAllByRole('link', { name: /skip to/i });
    expect(skipLinks.length).toBeGreaterThan(0);
  });
});
