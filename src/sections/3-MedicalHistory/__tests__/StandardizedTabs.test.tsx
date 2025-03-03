/**
 * Standardized Tabs Component Tests
 * 
 * Tests for the standardized tab component implementation in the Medical History section.
 * These tests focus on the styling, navigation, and accessibility of the tabs.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MedicalHistory } from '../components/MedicalHistory';
import { AssessmentContext } from '@/contexts/AssessmentContext';

// Mock the form persistence hook
jest.mock('@/hooks/useFormPersistence', () => ({
  useFormPersistence: () => ({
    persistForm: jest.fn()
  })
}));

// Mock the components that would be rendered in tabs
jest.mock('../components/PreExistingConditionsSection', () => ({
  PreExistingConditionsSection: () => <div data-testid="pre-existing-section">Pre-existing conditions content</div>
}));

jest.mock('../components/InjuryDetailsSection', () => ({
  InjuryDetailsSection: () => <div data-testid="injury-details-section">Injury details content</div>
}));

jest.mock('../components/TreatmentSection', () => ({
  TreatmentSection: () => <div data-testid="treatment-section">Treatment content</div>
}));

jest.mock('../components/MedicationsSection', () => ({
  MedicationsSection: () => <div data-testid="medications-section">Medications content</div>
}));

// Helper for rendering with context
const renderWithContext = (ui, contextValue = {}) => {
  return render(
    <AssessmentContext.Provider value={{
      data: {},
      updateSection: jest.fn(),
      ...contextValue
    }}>
      {ui}
    </AssessmentContext.Provider>
  );
};

describe('Standardized Tabs in Medical History Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders tabs with standardized styling', () => {
    renderWithContext(<MedicalHistory />);
    
    // Check tabs container has border and rounded corners
    const tabsContainer = screen.getByRole('tablist').closest('div');
    expect(tabsContainer).toHaveClass('border');
    expect(tabsContainer).toHaveClass('rounded-md');
    
    // Get all tab triggers
    const tabTriggers = screen.getAllByRole('tab');
    expect(tabTriggers).toHaveLength(4);
    
    // Check styling of active tab (first tab is active by default)
    const activeTab = tabTriggers[0];
    expect(activeTab).toHaveClass('data-[state=active]:border-b-2');
    expect(activeTab).toHaveClass('data-[state=active]:border-blue-600');
    expect(activeTab).toHaveClass('data-[state=active]:text-blue-600');
    
    // Check styling of inactive tabs
    const inactiveTabs = tabTriggers.slice(1);
    inactiveTabs.forEach(tab => {
      expect(tab).toHaveClass('data-[state=inactive]:border-b');
      expect(tab).toHaveClass('data-[state=inactive]:border-gray-200');
      expect(tab).toHaveClass('data-[state=inactive]:text-gray-600');
    });
  });
  
  it('ensures tab content has consistent padding', () => {
    renderWithContext(<MedicalHistory />);
    
    // Check first tab content is visible and has correct padding
    const tabPanel = screen.getByRole('tabpanel');
    expect(tabPanel).toHaveClass('p-6');
  });
  
  it('maintains standardized grid layout for tab list', () => {
    renderWithContext(<MedicalHistory />);
    
    // Check tab list has grid layout
    const tabList = screen.getByRole('tablist');
    expect(tabList).toHaveClass('grid');
    expect(tabList).toHaveClass('grid-cols-4');
  });
  
  it('shows correct tab content when a tab is clicked', async () => {
    renderWithContext(<MedicalHistory />);
    const user = userEvent.setup();
    
    // Initially, Pre-existing tab should be active
    expect(screen.getByTestId('pre-existing-section')).toBeVisible();
    expect(screen.queryByTestId('injury-details-section')).not.toBeVisible();
    
    // Click on Injury Details tab
    await user.click(screen.getByRole('tab', { name: /Injury Details/i }));
    
    // Now Injury Details tab should be active
    expect(screen.getByTestId('injury-details-section')).toBeVisible();
    expect(screen.queryByTestId('pre-existing-section')).not.toBeVisible();
  });
  
  it('sets tab triggers to have consistent height and border styles', () => {
    renderWithContext(<MedicalHistory />);
    
    // Check all tabs have consistent height and border styles
    const tabTriggers = screen.getAllByRole('tab');
    
    tabTriggers.forEach(tab => {
      expect(tab).toHaveClass('py-2');
      expect(tab).toHaveClass('rounded-none');
    });
  });
  
  it('is accessible via keyboard navigation', async () => {
    renderWithContext(<MedicalHistory />);
    const user = userEvent.setup();
    
    // Get all tabs
    const tabTriggers = screen.getAllByRole('tab');
    
    // Focus on the first tab
    await user.tab();
    expect(tabTriggers[0]).toHaveFocus();
    
    // Press right arrow to move to next tab
    await user.keyboard('{ArrowRight}');
    expect(tabTriggers[1]).toHaveFocus();
    
    // Press Enter to select the focused tab
    await user.keyboard('{Enter}');
    
    // The injury details tab should now be active
    expect(screen.getByTestId('injury-details-section')).toBeVisible();
    expect(screen.queryByTestId('pre-existing-section')).not.toBeVisible();
  });
  
  it('has aria-selected attribute set correctly', async () => {
    renderWithContext(<MedicalHistory />);
    const user = userEvent.setup();
    
    // Get all tabs
    const tabTriggers = screen.getAllByRole('tab');
    
    // Initially, first tab should be selected
    expect(tabTriggers[0]).toHaveAttribute('aria-selected', 'true');
    expect(tabTriggers[1]).toHaveAttribute('aria-selected', 'false');
    
    // Click on the second tab
    await user.click(tabTriggers[1]);
    
    // Now second tab should be selected
    expect(tabTriggers[0]).toHaveAttribute('aria-selected', 'false');
    expect(tabTriggers[1]).toHaveAttribute('aria-selected', 'true');
  });
  
  it('maintains tab content visibility correctly across all tabs', async () => {
    renderWithContext(<MedicalHistory />);
    const user = userEvent.setup();
    
    // Check initial visibility
    expect(screen.getByTestId('pre-existing-section')).toBeVisible();
    expect(screen.queryByTestId('injury-details-section')).not.toBeVisible();
    expect(screen.queryByTestId('treatment-section')).not.toBeVisible();
    expect(screen.queryByTestId('medications-section')).not.toBeVisible();
    
    // Click on each tab and verify correct content is shown
    
    // Injury Details
    await user.click(screen.getByRole('tab', { name: /Injury Details/i }));
    expect(screen.queryByTestId('pre-existing-section')).not.toBeVisible();
    expect(screen.getByTestId('injury-details-section')).toBeVisible();
    expect(screen.queryByTestId('treatment-section')).not.toBeVisible();
    expect(screen.queryByTestId('medications-section')).not.toBeVisible();
    
    // Treatment
    await user.click(screen.getByRole('tab', { name: /Treatment/i }));
    expect(screen.queryByTestId('pre-existing-section')).not.toBeVisible();
    expect(screen.queryByTestId('injury-details-section')).not.toBeVisible();
    expect(screen.getByTestId('treatment-section')).toBeVisible();
    expect(screen.queryByTestId('medications-section')).not.toBeVisible();
    
    // Medications
    await user.click(screen.getByRole('tab', { name: /Medications/i }));
    expect(screen.queryByTestId('pre-existing-section')).not.toBeVisible();
    expect(screen.queryByTestId('injury-details-section')).not.toBeVisible();
    expect(screen.queryByTestId('treatment-section')).not.toBeVisible();
    expect(screen.getByTestId('medications-section')).toBeVisible();
    
    // Back to Pre-existing
    await user.click(screen.getByRole('tab', { name: /Pre-Existing/i }));
    expect(screen.getByTestId('pre-existing-section')).toBeVisible();
    expect(screen.queryByTestId('injury-details-section')).not.toBeVisible();
    expect(screen.queryByTestId('treatment-section')).not.toBeVisible();
    expect(screen.queryByTestId('medications-section')).not.toBeVisible();
  });
});
