import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DemographicsSection } from '../../index';
import { renderWithForm } from '@/test/test-utils';
import { useFormPersistence } from '@/hooks/useFormPersistence';

// Mock the persistence hook
jest.mock('@/hooks/useFormPersistence', () => ({
  useFormPersistence: jest.fn()
}));

describe('Demographics Integration', () => {
  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
    // Clear localStorage
    localStorage.clear();
  });

  it('maintains state across tab switches', async () => {
    renderWithForm(<DemographicsSection />);
    
    // Fill out personal info
    const firstNameInput = screen.getByLabelText(/first name/i);
    fireEvent.change(firstNameInput, { target: { value: 'John' } });

    // Switch to contact tab
    const contactTab = screen.getByRole('tab', { name: /contact/i });
    fireEvent.click(contactTab);

    // Switch back to personal tab
    const personalTab = screen.getByRole('tab', { name: /personal/i });
    fireEvent.click(personalTab);

    // Verify data persisted
    expect(firstNameInput).toHaveValue('John');
  });

  it('persists form data to localStorage', async () => {
    renderWithForm(<DemographicsSection />);
    
    // Fill out form
    const firstNameInput = screen.getByLabelText(/first name/i);
    fireEvent.change(firstNameInput, { target: { value: 'John' } });

    // Verify useFormPersistence was called
    expect(useFormPersistence).toHaveBeenCalled();

    // Wait for persistence
    await waitFor(() => {
      const stored = localStorage.getItem('demographics-form');
      expect(stored).toBeTruthy();
      expect(JSON.parse(stored!)).toHaveProperty('data.personal.firstName', 'John');
    });
  });

  it('loads persisted data on mount', async () => {
    // Pre-populate localStorage
    localStorage.setItem('demographics-form', JSON.stringify({
      data: {
        personal: {
          firstName: 'John',
          lastName: 'Doe'
        }
      }
    }));

    renderWithForm(<DemographicsSection />);

    // Verify data loaded
    await waitFor(() => {
      expect(screen.getByLabelText(/first name/i)).toHaveValue('John');
      expect(screen.getByLabelText(/last name/i)).toHaveValue('Doe');
    });
  });

  it('handles form submission flow', async () => {
    const { container } = renderWithForm(<DemographicsSection />);

    // Fill required fields
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/date of birth/i), { target: { value: '1990-01-01' } });

    // Submit form
    const submitButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(submitButton);

    // Verify no validation errors
    await waitFor(() => {
      expect(screen.queryByText(/required/i)).not.toBeInTheDocument();
    });
  });

  it('synchronizes view/edit mode state', async () => {
    renderWithForm(<DemographicsSection />);

    // Toggle to view mode
    const viewButton = screen.getByRole('button', { name: /view/i });
    fireEvent.click(viewButton);

    // Verify display component shown
    expect(screen.queryByRole('form')).not.toBeInTheDocument();
    expect(screen.getByRole('article')).toBeInTheDocument();

    // Toggle back to edit mode
    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    // Verify form shown
    expect(screen.getByRole('form')).toBeInTheDocument();
  });

  it('handles API errors gracefully', async () => {
    // Mock API error
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const mockError = new Error('API Error');
    (useFormPersistence as jest.Mock).mockImplementation(() => {
      throw mockError;
    });

    renderWithForm(<DemographicsSection />);

    // Verify error displayed
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});