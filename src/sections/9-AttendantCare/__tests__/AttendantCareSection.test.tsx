import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AttendantCareSection } from '../components/AttendantCareSection';
import { CARE_RATES } from "../constants";
import { mockUiComponents } from './testUtils';

// Mock the UI components using our centralized mocks
jest.mock('@/components/ui/card', () => ({
  Card: mockUiComponents.Card
}));

jest.mock('@/components/ui/tabs', () => ({
  Tabs: mockUiComponents.Tabs,
  TabsContent: mockUiComponents.TabsContent,
  TabsList: mockUiComponents.TabsList,
  TabsTrigger: mockUiComponents.TabsTrigger
}));

jest.mock('@/components/ui/alert-dialog', () => ({
  AlertDialog: mockUiComponents.AlertDialog,
  AlertDialogContent: mockUiComponents.AlertDialogContent,
  AlertDialogHeader: mockUiComponents.AlertDialogHeader,
  AlertDialogTitle: mockUiComponents.AlertDialogTitle,
  AlertDialogDescription: mockUiComponents.AlertDialogDescription
}));

jest.mock('@/components/ui/button', () => ({
  Button: mockUiComponents.Button
}));

// Mock the Level components
jest.mock('../components/Level1Care', () => ({
  Level1Care: () => <div data-testid="level1-care">Level 1 Care Component</div>
}));

jest.mock('../components/Level2Care', () => ({
  Level2Care: () => <div data-testid="level2-care">Level 2 Care Component</div>
}));

jest.mock('../components/Level3Care', () => ({
  Level3Care: () => <div data-testid="level3-care">Level 3 Care Component</div>
}));

// Mock the CostCalculation component
jest.mock('../components/CostCalculation', () => ({
  CostCalculation: () => <div data-testid="cost-calculation">Cost Calculation Component</div>
}));

// Mock the AssessmentContext
jest.mock('@/contexts/AssessmentContext', () => ({
  useAssessment: () => ({
    data: { attendantCare: {} },
    updateSection: jest.fn()
  })
}));

// Mock the calculation utilities
const mockCalculations = {
  level1: {
    weeklyHours: 3,
    monthlyHours: 12.9,
    monthlyCost: 192.21
  },
  level2: {
    weeklyHours: 1.5,
    monthlyHours: 6.5,
    monthlyCost: 91.00
  },
  level3: {
    weeklyHours: 0.5,
    monthlyHours: 2.15,
    monthlyCost: 45.39
  },
  summary: {
    totalMonthlyHours: 21.55,
    totalMonthlyCost: 328.60,
    annualCost: 3943.20
  }
};

jest.mock('../utils/calculations', () => ({
  calculateSummary: jest.fn(() => mockCalculations)
}));

// Mock lodash debounce to execute immediately
jest.mock('lodash', () => ({
  ...jest.requireActual('lodash'),
  debounce: (fn: Function) => fn
}));

// Mock zod resolver
jest.mock('@hookform/resolvers/zod', () => ({
  zodResolver: () => async (data: any) => ({
    values: data,
    errors: {}
  })
}));

describe('AttendantCareSection Component', () => {
  const defaultProps = {
    initialData: undefined,
    onDataChange: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the main title and description', () => {
    render(<AttendantCareSection {...defaultProps} />);
    
    expect(screen.getByText('Assessment of Attendant Care Needs')).toBeInTheDocument();
    expect(screen.getByText(/This form assesses the future needs for attendant care/)).toBeInTheDocument();
  });

  it('renders tabs for all three care levels and calculation', () => {
    render(<AttendantCareSection {...defaultProps} />);
    
    expect(screen.getByText('Level 1 Care')).toBeInTheDocument();
    expect(screen.getByText('Level 2 Care')).toBeInTheDocument();
    expect(screen.getByText('Level 3 Care')).toBeInTheDocument();
    expect(screen.getByText('Cost Calculation')).toBeInTheDocument();
  });

  it('shows Level1Care component by default', () => {
    render(<AttendantCareSection {...defaultProps} />);
    
    const tabsComponent = screen.getByTestId('tabs');
    expect(tabsComponent).toHaveAttribute('data-default-value', 'level1');
    expect(screen.getByTestId('level1-care')).toBeInTheDocument();
  });

  it('shows summary dialog when View Summary button is clicked', async () => {
    render(<AttendantCareSection {...defaultProps} />);
    
    // Click the summary button
    const summaryButton = screen.getByText('View Summary');
    fireEvent.click(summaryButton);
    
    // The summary dialog should be visible
    await waitFor(() => {
      expect(screen.getByTestId('alert-dialog')).toHaveAttribute('data-open', 'true');
    });
    
    // Check for key summary items
    expect(screen.getByText('Level 1 - Routine Personal Care')).toBeInTheDocument();
    expect(screen.getByText('Level 2 - Basic Supervision')).toBeInTheDocument();
    expect(screen.getByText('Level 3 - Complex Care')).toBeInTheDocument();
    expect(screen.getByText('Total Care Requirements')).toBeInTheDocument();

    // Verify calculations are displayed
    expect(screen.getByText(`Weekly Hours: ${mockCalculations.level1.weeklyHours}`)).toBeInTheDocument();
    expect(screen.getByText(`Rate: $${CARE_RATES.LEVEL_1}/hr`)).toBeInTheDocument();
    expect(screen.getByText(`Annual Cost Estimate: $${mockCalculations.summary.annualCost}`)).toBeInTheDocument();
  });

  it('calls onDataChange callback with calculations', async () => {
    render(<AttendantCareSection {...defaultProps} />);
    
    await waitFor(() => {
      expect(defaultProps.onDataChange).toHaveBeenCalledWith(
        expect.objectContaining({
          calculations: mockCalculations
        })
      );
    });
  });

  it('handles empty initial data correctly', () => {
    render(<AttendantCareSection {...defaultProps} />);
    expect(screen.getByTestId('tabs')).toBeInTheDocument();
  });
});