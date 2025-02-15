import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DemographicsSection } from './index';
import { renderWithFormAndAssessment } from '@/test/test-utils';
import { useAssessmentContext } from '@/contexts/AssessmentContext';

// Mock the AssessmentContext
jest.mock('@/contexts/AssessmentContext', () => ({
  useAssessmentContext: jest.fn()
}));

describe('DemographicsSection', () => {
  beforeEach(() => {
    (useAssessmentContext as jest.Mock).mockReturnValue({
      mode: 'edit'
    });
  });

  it('renders in edit mode with all tabs', () => {
    renderWithFormAndAssessment(<DemographicsSection />);
    
    // Check for all tabs
    expect(screen.getByRole('tab', { name: /personal/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /contact/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /insurance/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /legal/i })).toBeInTheDocument();
  });

  it('switches between tabs correctly', () => {
    renderWithFormAndAssessment(<DemographicsSection />);
    
    // Click contact tab
    fireEvent.click(screen.getByRole('tab', { name: /contact/i }));
    expect(screen.getByRole('tabpanel', { name: /contact/i })).toBeVisible();
    
    // Click insurance tab
    fireEvent.click(screen.getByRole('tab', { name: /insurance/i }));
    expect(screen.getByRole('tabpanel', { name: /insurance/i })).toBeVisible();
  });

  it('renders display mode when mode is view', () => {
    (useAssessmentContext as jest.Mock).mockReturnValue({
      mode: 'view'
    });

    renderWithFormAndAssessment(<DemographicsSection />);
    
    // Should not see tabs in view mode
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
  });

  it('persists form data between renders', () => {
    const { rerender } = renderWithFormAndAssessment(<DemographicsSection />);
    
    // Fill in some data
    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: 'John' }
    });
    
    // Rerender the component
    rerender(<DemographicsSection />);
    
    // Check if data persisted
    expect(screen.getByLabelText(/first name/i)).toHaveValue('John');
  });
});