import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DemographicsSection } from '../index';
import { renderWithFormAndAssessment } from '@/test/test-utils';
import { setupApiTests, apiTestUtils, server } from '@/test/api-test-utils';
import { rest } from 'msw';

// Setup API test environment
setupApiTests();

describe('Demographics API Integration', () => {
  it('successfully submits form data', async () => {
    const user = userEvent.setup();
    const mockData = apiTestUtils.createMockDemographics();
    
    apiTestUtils.mockSuccessResponse('/api/assessment/demographics', mockData);
    
    renderWithFormAndAssessment(<DemographicsSection />);
    
    // Fill personal information
    await user.type(screen.getByLabelText(/first name/i), mockData.firstName);
    await user.type(screen.getByLabelText(/last name/i), mockData.lastName);
    await user.type(screen.getByLabelText(/date of birth/i), mockData.dateOfBirth);
    
    // Select gender
    const genderSelect = screen.getByRole('combobox', { name: /gender/i });
    await user.click(genderSelect);
    await user.click(screen.getByRole('option', { name: mockData.gender }));
    
    // Move to Contact tab and fill information
    await user.click(screen.getByRole('tab', { name: /contact/i }));
    await user.type(screen.getByLabelText(/phone number/i), mockData.contact.phone);
    await user.type(screen.getByLabelText(/email/i), mockData.contact.email);
    await user.type(screen.getByLabelText(/address/i), mockData.contact.address);
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /submit/i }));
    
    // Verify success message
    await waitFor(() => {
      expect(screen.getByText(/successfully submitted/i)).toBeInTheDocument();
    });
  });

  it('handles validation errors from API', async () => {
    const user = userEvent.setup();
    
    apiTestUtils.mockValidationError('/api/assessment/demographics', [
      'Invalid phone number format',
      'Invalid email format'
    ]);
    
    renderWithFormAndAssessment(<DemographicsSection />);
    
    // Fill invalid data
    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/phone number/i), 'invalid');
    await user.type(screen.getByLabelText(/email/i), 'invalid');
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /submit/i }));
    
    // Verify error messages
    await waitFor(() => {
      expect(screen.getByText(/invalid phone number format/i)).toBeInTheDocument();
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });
  });

  it('handles network errors', async () => {
    const user = userEvent.setup();
    
    apiTestUtils.mockNetworkError('/api/assessment/demographics');
    
    renderWithFormAndAssessment(<DemographicsSection />);
    
    // Fill required fields
    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /submit/i }));
    
    // Verify network error message
    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
  });

  it('persists form state between sessions', async () => {
    const user = userEvent.setup();
    const mockData = apiTestUtils.createMockDemographics();
    
    // Mock form state retrieval
    server.use(
      rest.get('/api/form-state', (req, res, ctx) => {
        return res(ctx.json({
          status: 'success',
          data: mockData
        }));
      })
    );
    
    const { rerender } = renderWithFormAndAssessment(<DemographicsSection />);
    
    // Verify form is populated with persisted data
    await waitFor(() => {
      expect(screen.getByLabelText(/first name/i)).toHaveValue(mockData.firstName);
      expect(screen.getByLabelText(/last name/i)).toHaveValue(mockData.lastName);
    });
    
    // Update form data
    await user.clear(screen.getByLabelText(/first name/i));
    await user.type(screen.getByLabelText(/first name/i), 'Jane');
    
    // Mock successful state persistence
    apiTestUtils.mockSuccessResponse('/api/form-state', {
      ...mockData,
      firstName: 'Jane'
    });
    
    // Wait for auto-save
    await waitFor(() => {
      expect(screen.getByLabelText(/first name/i)).toHaveValue('Jane');
    });
    
    // Simulate page refresh
    rerender(<DemographicsSection />);
    
    // Verify updated data persists
    await waitFor(() => {
      expect(screen.getByLabelText(/first name/i)).toHaveValue('Jane');
    });
  });

  describe('Real-time Validation', () => {
    it('validates fields as user types', async () => {
      const user = userEvent.setup();
      
      renderWithFormAndAssessment(<DemographicsSection />);
      
      // Type invalid email
      await user.click(screen.getByRole('tab', { name: /contact/i }));
      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'invalid');
      await user.tab(); // Trigger blur validation
      
      // Verify client-side validation
      await waitFor(() => {
        expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
      });
      
      // Fix the email
      await user.clear(emailInput);
      await user.type(emailInput, 'valid@email.com');
      await user.tab();
      
      // Verify validation error is cleared
      await waitFor(() => {
        expect(screen.queryByText(/invalid email/i)).not.toBeInTheDocument();
      });
    });

    it('validates dependent fields', async () => {
      const user = userEvent.setup();
      
      renderWithFormAndAssessment(<DemographicsSection />);
      
      // Fill insurance information
      await user.click(screen.getByRole('tab', { name: /insurance/i }));
      await user.type(screen.getByLabelText(/insurance provider/i), 'Test Insurance');
      
      // Submit without adjustor information
      await user.click(screen.getByRole('button', { name: /submit/i }));
      
      // Verify dependent field validation
      await waitFor(() => {
        expect(screen.getByText(/adjustor information required/i)).toBeInTheDocument();
      });
      
      // Fill adjustor information
      await user.type(screen.getByLabelText(/claims adjustor/i), 'Jane Smith');
      await user.type(screen.getByLabelText(/adjustor phone/i), '(555) 555-5555');
      
      // Verify validation passes
      await waitFor(() => {
        expect(screen.queryByText(/adjustor information required/i)).not.toBeInTheDocument();
      });
    });
  });
});