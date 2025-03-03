/**
 * Tests for the ConfigureReport component
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { ReportDraftingProvider } from '@/contexts/ReportDrafting/ReportDraftingContext';
import ConfigureReport from '../ConfigureReport';
import * as apiService from '@/lib/report-drafting/api-service';

// Mock the API service
jest.mock('@/lib/report-drafting/api-service');
const mockApiService = apiService as jest.Mocked<typeof apiService>;

// Mock the sectionMetadata
jest.mock('@/lib/report-drafting/templates', () => ({
  sectionMetadata: {
    'medical-history': {
      title: 'Medical History',
      description: 'Client medical history information',
      category: 'assessment'
    },
    'symptoms-assessment': {
      title: 'Symptoms Assessment',
      description: 'Client symptoms assessment',
      category: 'assessment'
    },
    'functional-status': {
      title: 'Functional Status',
      description: 'Client functional status',
      category: 'functional'
    },
    'environmental-assessment': {
      title: 'Environmental Assessment',
      description: 'Client environmental assessment',
      category: 'functional'
    }
  }
}));

describe('ConfigureReport Component', () => {
  // Sample data for tests
  const sampleTemplate = {
    id: 'template-1',
    name: 'Comprehensive Assessment',
    description: 'A comprehensive occupational therapy assessment',
    defaultTitle: 'OT Assessment Report',
    defaultStyle: 'clinical',
    defaultSections: [
      {
        id: 'medical-history',
        included: true,
        detailLevel: 'standard'
      },
      {
        id: 'symptoms-assessment',
        included: true,
        detailLevel: 'standard'
      },
      {
        id: 'functional-status',
        included: true,
        detailLevel: 'comprehensive'
      },
      {
        id: 'environmental-assessment',
        included: false,
        detailLevel: 'brief'
      }
    ],
    isBuiltIn: true
  };

  const sampleDataAvailability = {
    'medical-history': { status: 'complete', percentage: 100 },
    'symptoms-assessment': { status: 'partial', percentage: 75 },
    'functional-status': { status: 'complete', percentage: 100 },
    'environmental-assessment': { status: 'incomplete', percentage: 30 }
  };

  // Setup mock context values for the component
  const setupMocksForConfiguration = () => {
    // Default mock implementations
    mockApiService.getDataAvailabilityStatus.mockResolvedValue(sampleDataAvailability);
    mockApiService.createReportConfig.mockResolvedValue({
      id: 'config-1',
      templateId: 'template-1',
      sections: sampleTemplate.defaultSections,
      title: sampleTemplate.defaultTitle,
      style: sampleTemplate.defaultStyle,
      createdAt: new Date().toISOString()
    });
    mockApiService.generateReport.mockResolvedValue({
      id: 'report-1',
      title: sampleTemplate.defaultTitle,
      createdAt: new Date().toISOString(),
      sections: [
        {
          id: 'medical-history',
          title: 'Medical History',
          content: 'Medical history content...',
          dataSources: ['Client Interview'],
          dataCompleteness: { status: 'complete', percentage: 100 }
        },
        {
          id: 'symptoms-assessment',
          title: 'Symptoms Assessment',
          content: 'Symptoms assessment content...',
          dataSources: ['Self-Report'],
          dataCompleteness: { status: 'partial', percentage: 75 }
        },
        {
          id: 'functional-status',
          title: 'Functional Status',
          content: 'Functional status content...',
          dataSources: ['Observation'],
          dataCompleteness: { status: 'complete', percentage: 100 }
        }
      ]
    });
  };

  beforeEach(() => {
    jest.resetAllMocks();
    setupMocksForConfiguration();
  });

  // Helper function to render the component with necessary context state
  const renderWithSelectedTemplate = async () => {
    const renderResult = render(
      <ReportDraftingProvider>
        <ConfigureReport />
      </ReportDraftingProvider>
    );

    // Access the context and set it up with a selected template
    const { getByText } = renderResult;
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Loading configuration...')).not.toBeInTheDocument();
    });
    
    return renderResult;
  };

  it('should display configuration options when template is selected', async () => {
    const { container } = await renderWithSelectedTemplate();
    
    // Check that the title input is populated
    expect(screen.getByLabelText('Report Title')).toBeInTheDocument();
    
    // Check that style options are displayed
    expect(screen.getByLabelText('Clinical')).toBeInTheDocument();
    expect(screen.getByLabelText('Conversational')).toBeInTheDocument();
    expect(screen.getByLabelText('Simplified')).toBeInTheDocument();
    
    // Check that sections are organized by category
    expect(screen.getByText('Assessment Sections')).toBeInTheDocument();
    expect(screen.getByText('Functional & Environmental Sections')).toBeInTheDocument();
  });

  it('should allow changing report title', async () => {
    await renderWithSelectedTemplate();
    
    // Change the report title
    await act(async () => {
      fireEvent.change(screen.getByLabelText('Report Title'), {
        target: { value: 'Custom Report Title' }
      });
    });
    
    // Check that the value was updated
    expect(screen.getByLabelText('Report Title')).toHaveValue('Custom Report Title');
  });

  it('should allow changing report style', async () => {
    await renderWithSelectedTemplate();
    
    // Select conversational style
    await act(async () => {
      fireEvent.click(screen.getByLabelText('Conversational'));
    });
    
    // Check that the conversational style is selected
    expect(screen.getByLabelText('Conversational')).toBeChecked();
    expect(screen.getByLabelText('Clinical')).not.toBeChecked();
  });

  it('should show section completion status', async () => {
    await renderWithSelectedTemplate();
    
    // Expand all accordions
    await act(async () => {
      fireEvent.click(screen.getByText('Assessment Sections'));
      fireEvent.click(screen.getByText('Functional & Environmental Sections'));
    });
    
    // Check for completion status indicators
    expect(screen.getByText('Complete', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('75% complete')).toBeInTheDocument();
  });

  it('should allow toggling section inclusion', async () => {
    await renderWithSelectedTemplate();
    
    // Expand assessment sections
    await act(async () => {
      fireEvent.click(screen.getByText('Assessment Sections'));
    });
    
    // Get the first checkbox (Medical History)
    const medicalHistoryCheckbox = screen.getAllByRole('checkbox')[0];
    
    // It should be checked initially
    expect(medicalHistoryCheckbox).toBeChecked();
    
    // Uncheck it
    await act(async () => {
      fireEvent.click(medicalHistoryCheckbox);
    });
    
    // It should now be unchecked
    expect(medicalHistoryCheckbox).not.toBeChecked();
  });

  it('should allow changing detail level for sections', async () => {
    await renderWithSelectedTemplate();
    
    // Expand assessment sections
    await act(async () => {
      fireEvent.click(screen.getByText('Assessment Sections'));
    });
    
    // Find the Medical History section's "Comprehensive" radio button
    const comprehensiveRadio = screen.getByLabelText('Comprehensive');
    
    // Click on it
    await act(async () => {
      fireEvent.click(comprehensiveRadio);
    });
    
    // It should now be checked
    expect(comprehensiveRadio).toBeChecked();
  });

  it('should disable checkboxes for sections with no data', async () => {
    await renderWithSelectedTemplate();
    
    // Expand functional sections
    await act(async () => {
      fireEvent.click(screen.getByText('Functional & Environmental Sections'));
    });
    
    // Find environment section which is incomplete (30%)
    const sectionContainer = screen.getByText('Environmental Assessment').closest('.border');
    const checkbox = sectionContainer?.querySelector('input[type="checkbox"]');
    
    // Checkbox should be disabled due to low completion
    expect(checkbox).toBeDisabled();
  });

  it('should handle submission with valid configuration', async () => {
    await renderWithSelectedTemplate();
    
    // Click the submit button
    await act(async () => {
      fireEvent.click(screen.getByText('Next: Preview Report'));
    });
    
    // Check that the API was called
    expect(mockApiService.createReportConfig).toHaveBeenCalled();
    expect(mockApiService.generateReport).toHaveBeenCalled();
  });

  it('should handle API errors gracefully', async () => {
    // Mock error response
    mockApiService.createReportConfig.mockRejectedValue(new Error('API error'));
    
    await renderWithSelectedTemplate();
    
    // Click the submit button
    await act(async () => {
      fireEvent.click(screen.getByText('Next: Preview Report'));
    });
    
    // Check console.error was called
    expect(console.error).toHaveBeenCalledWith(
      'Error configuring report:', 
      expect.any(Error)
    );
  });

  it('should disable Next button when no sections are included', async () => {
    await renderWithSelectedTemplate();
    
    // Expand all accordions
    await act(async () => {
      fireEvent.click(screen.getByText('Assessment Sections'));
      fireEvent.click(screen.getByText('Functional & Environmental Sections'));
    });
    
    // Uncheck all checkboxes
    const checkboxes = screen.getAllByRole('checkbox');
    
    for (const checkbox of checkboxes) {
      if (checkbox.checked && !checkbox.disabled) {
        await act(async () => {
          fireEvent.click(checkbox);
        });
      }
    }
    
    // Next button should be disabled
    const nextButton = screen.getByText('Next: Preview Report');
    expect(nextButton).toBeDisabled();
  });
});
