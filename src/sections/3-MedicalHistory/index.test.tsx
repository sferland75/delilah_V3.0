import React from 'react';
import { render, screen, waitFor } from './tests/utils';
import userEvent from '@testing-library/user-event';
import { MedicalHistorySection } from './index';
import { mockMedicalHistory } from './tests/utils';

// Mock hooks
jest.mock('@/hooks/useFormPersistence', () => ({
  useFormPersistence: jest.fn()
}));

describe('MedicalHistorySection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Navigation and Layout', () => {
    it('renders in edit mode by default', () => {
      render(<MedicalHistorySection />);
      
      // Check for main components
      expect(screen.getByText('Medical History')).toBeInTheDocument();
      expect(screen.getByRole('tablist')).toBeInTheDocument();
      
      // Check for all tabs
      const tabs = ['Pre-Existing', 'Injury Details', 'Treatment', 'Medications'];
      tabs.forEach(tab => {
        expect(screen.getByRole('tab', { name: new RegExp(tab, 'i') })).toBeInTheDocument();
      });
    });

    it('shows correct guidance information', () => {
      render(<MedicalHistorySection />);
      
      const guidance = screen.getByText(/Document comprehensive medical history/i);
      expect(guidance).toBeInTheDocument();
      expect(guidance).toHaveTextContent(/pre-existing conditions/i);
      expect(guidance).toHaveTextContent(/injury mechanism/i);
      expect(guidance).toHaveTextContent(/current medications/i);
    });

    it('switches between tabs and maintains content', async () => {
      render(<MedicalHistorySection />);
      const user = userEvent.setup();
      
      // Test each tab
      const tabs = ['Injury Details', 'Treatment', 'Medications', 'Pre-Existing'];
      
      for (const tabName of tabs) {
        const tab = screen.getByRole('tab', { name: new RegExp(tabName, 'i') });
        await user.click(tab);
        
        // Check tab is selected
        expect(tab).toHaveAttribute('aria-selected', 'true');
        
        // Check appropriate content is shown
        expect(screen.getByRole('tabpanel')).toBeVisible();
      }
    });
  });

  describe('Form State and Validation', () => {
    it('loads with default values', () => {
      render(<MedicalHistorySection />);
      
      // Verify default tab is active
      expect(screen.getByRole('tab', { name: /pre-existing/i }))
        .toHaveAttribute('aria-selected', 'true');
    });

    it('persists entered data between tab switches', async () => {
      render(<MedicalHistorySection />);
      const user = userEvent.setup();

      // Navigate to Injury Details
      await user.click(screen.getByRole('tab', { name: /injury details/i }));
      
      // Fill out some data
      const detailsInput = screen.getByLabelText(/injury details/i);
      await user.type(detailsInput, 'Test injury details');

      // Switch tabs
      await user.click(screen.getByRole('tab', { name: /treatment/i }));
      await user.click(screen.getByRole('tab', { name: /injury details/i }));

      // Verify data persists
      expect(detailsInput).toHaveValue('Test injury details');
    });
  });

  describe('Data Display', () => {
    it('displays pre-existing conditions correctly', async () => {
      render(<MedicalHistorySection />, {
        formValues: mockMedicalHistory
      });

      const user = userEvent.setup();
      await user.click(screen.getByRole('tab', { name: /pre-existing/i }));

      // Check for condition data
      expect(screen.getByText('Hypertension')).toBeInTheDocument();
      expect(screen.getByText('Diabetes')).toBeInTheDocument();
    });

    it('displays injury details correctly', async () => {
      render(<MedicalHistorySection />, {
        formValues: mockMedicalHistory
      });

      const user = userEvent.setup();
      await user.click(screen.getByRole('tab', { name: /injury details/i }));

      // Check for injury data
      expect(screen.getByText('Workplace injury')).toBeInTheDocument();
      expect(screen.getByText('Slip and fall')).toBeInTheDocument();
    });

    it('displays treatment information correctly', async () => {
      render(<MedicalHistorySection />, {
        formValues: mockMedicalHistory
      });

      const user = userEvent.setup();
      await user.click(screen.getByRole('tab', { name: /treatment/i }));

      // Check for treatment data
      expect(screen.getByText('Dr. Smith')).toBeInTheDocument();
      expect(screen.getByText('Physical Therapy')).toBeInTheDocument();
    });

    it('displays medication information correctly', async () => {
      render(<MedicalHistorySection />, {
        formValues: mockMedicalHistory
      });

      const user = userEvent.setup();
      await user.click(screen.getByRole('tab', { name: /medications/i }));

      // Check for medication data
      expect(screen.getByText('Ibuprofen')).toBeInTheDocument();
      expect(screen.getByText('800mg')).toBeInTheDocument();
    });
  });

  describe('Form Persistence', () => {
    it('uses the useFormPersistence hook correctly', () => {
      const mockUseFormPersistence = jest.requireMock('@/hooks/useFormPersistence').useFormPersistence;
      render(<MedicalHistorySection />);
      
      expect(mockUseFormPersistence).toHaveBeenCalledWith(
        expect.any(Object),
        'medical-history'
      );
    });
  });

  describe('Accessibility', () => {
    it('has accessible tab navigation', async () => {
      render(<MedicalHistorySection />);
      const tabList = screen.getByRole('tablist');
      
      // Check ARIA attributes
      expect(tabList).toHaveAttribute('aria-orientation', 'horizontal');
      
      // Check tab elements
      const tabs = screen.getAllByRole('tab');
      tabs.forEach(tab => {
        expect(tab).toHaveAttribute('aria-selected');
        expect(tab).toHaveAttribute('tabindex');
      });
    });

    it('maintains focus management during tab switches', async () => {
      render(<MedicalHistorySection />);
      const user = userEvent.setup();
      
      const firstTab = screen.getByRole('tab', { name: /pre-existing/i });
      const secondTab = screen.getByRole('tab', { name: /injury details/i });
      
      // Click first tab
      await user.click(firstTab);
      expect(firstTab).toHaveFocus();
      
      // Tab to next
      await user.tab();
      expect(secondTab).toHaveFocus();
    });
  });
});