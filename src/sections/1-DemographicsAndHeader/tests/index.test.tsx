import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DemographicsSection } from '../index';
import { renderWithForm } from '@/test/test-utils';
import { useFormPersistence } from '@/hooks/useFormPersistence';

// Mock the persistence hook
jest.mock('@/hooks/useFormPersistence', () => ({
  useFormPersistence: jest.fn()
}));

describe('DemographicsSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('renders in edit mode by default', () => {
    renderWithForm(<DemographicsSection />);
    
    expect(screen.getByRole('form')).toBeInTheDocument();
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });

  it('switches between tabs correctly', () => {
    renderWithForm(<DemographicsSection />);
    
    const contactTab = screen.getByRole('tab', { name: /contact/i });
    fireEvent.click(contactTab);
    
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
  });

  it('toggles between edit and view modes', () => {
    renderWithForm(<DemographicsSection />);
    
    const viewModeButton = screen.getByRole('button', { name: /view/i });
    fireEvent.click(viewModeButton);
    
    expect(screen.queryByRole('form')).not.toBeInTheDocument();
    expect(screen.getByRole('article')).toBeInTheDocument();
  });

  it('persists form data', async () => {
    renderWithForm(<DemographicsSection />);
    
    const firstNameInput = screen.getByLabelText(/first name/i);
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    
    await waitFor(() => {
      expect(useFormPersistence).toHaveBeenCalled();
    });
  });

  it('loads persisted data', () => {
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
    
    expect(screen.getByLabelText(/first name/i)).toHaveValue('John');
    expect(screen.getByLabelText(/last name/i)).toHaveValue('Doe');
  });

  it('validates all required fields before submission', async () => {
    renderWithForm(<DemographicsSection />);
    
    const submitButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getAllByText(/required/i)).toHaveLength(6); // Number of required fields
    });
  });

  it('handles successful form submission', async () => {
    renderWithForm(<DemographicsSection />);
    
    // Fill out required fields
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/date of birth/i), { target: { value: '1990-01-01' } });
    
    // Click contact tab
    const contactTab = screen.getByRole('tab', { name: /contact/i });
    fireEvent.click(contactTab);
    
    // Fill out contact info
    fireEvent.change(screen.getByLabelText(/address/i), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByLabelText(/city/i), { target: { value: 'Boston' } });
    fireEvent.change(screen.getByLabelText(/zip/i), { target: { value: '02108' } });
    
    const submitButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.queryByText(/required/i)).not.toBeInTheDocument();
    });
  });

  it('maintains data consistency across tab switches', async () => {
    renderWithForm(<DemographicsSection />);
    
    // Fill personal info
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
    
    // Switch to contact and back
    const contactTab = screen.getByRole('tab', { name: /contact/i });
    fireEvent.click(contactTab);
    const personalTab = screen.getByRole('tab', { name: /personal/i });
    fireEvent.click(personalTab);
    
    expect(screen.getByLabelText(/first name/i)).toHaveValue('John');
  });

  it('handles form reset', async () => {
    renderWithForm(<DemographicsSection />);
    
    // Fill out some fields
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
    
    // Reset form
    const resetButton = screen.getByRole('button', { name: /reset/i });
    fireEvent.click(resetButton);
    
    // Verify fields are cleared
    expect(screen.getByLabelText(/first name/i)).toHaveValue('');
    expect(screen.getByLabelText(/last name/i)).toHaveValue('');
  });

  it('handles API errors gracefully', async () => {
    // Mock API error
    const mockError = new Error('API Error');
    (useFormPersistence as jest.Mock).mockImplementation(() => {
      throw mockError;
    });

    renderWithForm(<DemographicsSection />);
    
    await waitFor(() => {
      expect(screen.getByText(/error occurred/i)).toBeInTheDocument();
    });
  });

  it('handles concurrent tab switching', async () => {
    renderWithForm(<DemographicsSection />);
    
    const contactTab = screen.getByRole('tab', { name: /contact/i });
    const personalTab = screen.getByRole('tab', { name: /personal/i });
    
    // Rapid tab switching
    fireEvent.click(contactTab);
    fireEvent.click(personalTab);
    fireEvent.click(contactTab);
    fireEvent.click(personalTab);
    
    // Verify final state
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
  });

  it('manages focus correctly on tab switch', async () => {
    renderWithForm(<DemographicsSection />);
    
    const contactTab = screen.getByRole('tab', { name: /contact/i });
    fireEvent.click(contactTab);
    
    await waitFor(() => {
      expect(document.activeElement).toBe(screen.getByLabelText(/address/i));
    });
  });

  describe('View Mode', () => {
    it('displays formatted data correctly', async () => {
      // Pre-populate form
      renderWithForm(<DemographicsSection />);
      fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
      fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
      
      // Switch to view mode
      const viewButton = screen.getByRole('button', { name: /view/i });
      fireEvent.click(viewButton);
      
      // Verify display
      expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    });

    it('allows switching back to edit mode', async () => {
      renderWithForm(<DemographicsSection />);
      
      // Switch to view mode
      const viewButton = screen.getByRole('button', { name: /view/i });
      fireEvent.click(viewButton);
      
      // Switch back to edit mode
      const editButton = screen.getByRole('button', { name: /edit/i });
      fireEvent.click(editButton);
      
      expect(screen.getByRole('form')).toBeInTheDocument();
    });
  });
});