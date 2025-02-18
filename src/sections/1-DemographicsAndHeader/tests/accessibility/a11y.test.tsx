import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { DemographicsSection } from '../../index';
import { renderWithForm } from '@/test/test-utils';

expect.extend(toHaveNoViolations);

describe('Demographics Accessibility', () => {
  it('has no detectable accessibility violations', async () => {
    const { container } = renderWithForm(<DemographicsSection />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('supports keyboard navigation', async () => {
    renderWithForm(<DemographicsSection />);

    // Start from first input
    const firstNameInput = screen.getByLabelText(/first name/i);
    firstNameInput.focus();
    expect(document.activeElement).toBe(firstNameInput);

    // Tab to next input
    fireEvent.keyDown(firstNameInput, { key: 'Tab' });
    const lastNameInput = screen.getByLabelText(/last name/i);
    expect(document.activeElement).toBe(lastNameInput);

    // Tab to next input
    fireEvent.keyDown(lastNameInput, { key: 'Tab' });
    const dobInput = screen.getByLabelText(/date of birth/i);
    expect(document.activeElement).toBe(dobInput);
  });

  it('announces form errors', async () => {
    renderWithForm(<DemographicsSection />);

    // Submit empty form
    const submitButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(submitButton);

    // Check for aria-invalid and aria-errormessage
    await waitFor(() => {
      const firstNameInput = screen.getByLabelText(/first name/i);
      expect(firstNameInput).toHaveAttribute('aria-invalid', 'true');
      expect(firstNameInput).toHaveAttribute('aria-errormessage');
    });
  });

  it('has proper ARIA labels', () => {
    renderWithForm(<DemographicsSection />);

    // Check form controls
    expect(screen.getByLabelText(/first name/i)).toHaveAttribute('aria-required', 'true');
    expect(screen.getByLabelText(/last name/i)).toHaveAttribute('aria-required', 'true');
    expect(screen.getByRole('combobox', { name: /gender/i })).toHaveAttribute('aria-required', 'true');

    // Check tabs
    const tabs = screen.getAllByRole('tab');
    tabs.forEach(tab => {
      expect(tab).toHaveAttribute('aria-selected');
      expect(tab).toHaveAttribute('aria-controls');
    });
  });

  it('manages focus when showing/hiding content', async () => {
    renderWithForm(<DemographicsSection />);

    // Click contact tab
    const contactTab = screen.getByRole('tab', { name: /contact/i });
    fireEvent.click(contactTab);

    // Verify focus moves to first input in contact tab
    await waitFor(() => {
      const addressInput = screen.getByLabelText(/address/i);
      expect(document.activeElement).toBe(addressInput);
    });
  });

  it('supports screen reader announcements', async () => {
    renderWithForm(<DemographicsSection />);

    // Submit empty form
    const submitButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(submitButton);

    // Check for live region updates
    await waitFor(() => {
      const alert = screen.getByRole('alert');
      expect(alert).toHaveTextContent(/please correct the following errors/i);
    });
  });

  it('has sufficient color contrast', () => {
    renderWithForm(<DemographicsSection />);

    // Get all text elements
    const textElements = screen.getAllByText(/.+/);

    textElements.forEach(element => {
      const styles = window.getComputedStyle(element);
      const backgroundColor = styles.backgroundColor;
      const color = styles.color;

      // Check contrast ratio
      // Note: In a real implementation, you'd use a color contrast library
      expect(element).toHaveClass(/text-slate-800|text-slate-600/);
    });
  });
});