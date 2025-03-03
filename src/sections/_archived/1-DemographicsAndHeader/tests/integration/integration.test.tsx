import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DemographicsSection } from '../../components/DemographicsSection';
import { FormProvider } from '@/contexts/FormContext';
import { createFormTests } from '@/test/form-test-factory';

// Mock API calls
jest.mock('@/services/api', () => ({
  saveFormData: jest.fn().mockResolvedValue({ success: true }),
  getFormData: jest.fn().mockResolvedValue({
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1990-01-01',
    email: 'john.doe@example.com',
    phone: '(555) 555-5555'
  })
}));

describe('Demographics Section Integration', () => {
  const renderDemographics = () => {
    return render(
      <FormProvider>
        <DemographicsSection />
      </FormProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads and displays existing data', async () => {
    renderDemographics();

    await waitFor(() => {
      expect(screen.getByLabelText(/first name/i)).toHaveValue('John');
      expect(screen.getByLabelText(/last name/i)).toHaveValue('Doe');
      expect(screen.getByLabelText(/email/i)).toHaveValue('john.doe@example.com');
    });
  });

  it('maintains state across tab navigation', async () => {
    renderDemographics();
    
    // Fill personal information
    await userEvent.type(screen.getByLabelText(/first name/i), 'Jane');
    await userEvent.type(screen.getByLabelText(/last name/i), 'Smith');
    
    // Navigate to contact tab
    await userEvent.click(screen.getByRole('tab', { name: /contact/i }));
    
    // Fill contact information
    await userEvent.type(screen.getByLabelText(/email/i), 'jane.smith@example.com');
    
    // Navigate back to personal tab
    await userEvent.click(screen.getByRole('tab', { name: /personal/i }));
    
    // Verify data persistence
    expect(screen.getByLabelText(/first name/i)).toHaveValue('Jane');
    expect(screen.getByLabelText(/last name/i)).toHaveValue('Smith');
  });

  it('handles form submission correctly', async () => {
    const { saveFormData } = require('@/services/api');
    renderDemographics();

    // Fill all required fields
    await userEvent.type(screen.getByLabelText(/first name/i), 'Jane');
    await userEvent.type(screen.getByLabelText(/last name/i), 'Smith');
    await userEvent.type(screen.getByLabelText(/email/i), 'jane.smith@example.com');
    await userEvent.type(screen.getByLabelText(/phone/i), '(555) 555-5555');

    // Submit form
    await userEvent.click(screen.getByRole('button', { name: /save/i }));

    // Verify API call
    await waitFor(() => {
      expect(saveFormData).toHaveBeenCalledWith({
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phone: '(555) 555-5555'
      });
    });

    // Verify success message
    expect(await screen.findByText(/successfully saved/i)).toBeInTheDocument();
  });

  it('handles API errors gracefully', async () => {
    const { saveFormData } = require('@/services/api');
    saveFormData.mockRejectedValueOnce(new Error('API Error'));

    renderDemographics();

    // Fill and submit form
    await userEvent.type(screen.getByLabelText(/first name/i), 'Jane');
    await userEvent.click(screen.getByRole('button', { name: /save/i }));

    // Verify error handling
    expect(await screen.findByRole('alert')).toHaveTextContent(/error saving data/i);
  });

  it('validates all required fields before submission', async () => {
    renderDemographics();

    // Submit without filling required fields
    await userEvent.click(screen.getByRole('button', { name: /save/i }));

    // Check for validation messages
    const alerts = await screen.findAllByRole('alert');
    expect(alerts).toHaveLength(5); // One for each required field
    expect(alerts[0]).toHaveTextContent(/required/i);
  });

  it('supports edit/view mode switching', async () => {
    renderDemographics();
    
    // Fill form data
    await userEvent.type(screen.getByLabelText(/first name/i), 'Jane');
    await userEvent.type(screen.getByLabelText(/last name/i), 'Smith');
    
    // Switch to view mode
    await userEvent.click(screen.getByRole('button', { name: /view/i }));
    
    // Verify display
    expect(screen.getByText('Jane')).toBeInTheDocument();
    expect(screen.getByText('Smith')).toBeInTheDocument();
    
    // Switch back to edit
    await userEvent.click(screen.getByRole('button', { name: /edit/i }));
    
    // Verify form state preserved
    expect(screen.getByLabelText(/first name/i)).toHaveValue('Jane');
    expect(screen.getByLabelText(/last name/i)).toHaveValue('Smith');
  });
});
