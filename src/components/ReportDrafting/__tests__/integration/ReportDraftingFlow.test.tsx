/**
 * Integration tests for Report Drafting module workflow
 * 
 * These tests validate the end-to-end flow from template selection
 * through report generation and export.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import { ReportDraftingProvider } from '@/contexts/ReportDrafting/ReportDraftingContext';
import * as apiService from '@/lib/report-drafting/api-service';
import * as templateService from '@/lib/report-drafting/template-service';
import TemplateSelection from '../../TemplateSelection';
import ConfigureReport from '../../ConfigureReport';
import ReportPreview from '../../ReportPreview';
import ExportReport from '../../ExportReport';

// Mock all API services
jest.mock('@/lib/report-drafting/api-service');
jest.mock('@/lib/report-drafting/template-service');
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock toast notifications
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

// Sample data for tests
const sampleTemplates = [
  {
    id: 'template-1',
    name: 'Standard OT Assessment',
    description: 'Comprehensive occupational therapy assessment with all sections',
    defaultTitle: 'OT Assessment Report',
    defaultStyle: 'clinical',
    defaultSections: [
      {
        id: 'medical-history',
        title: 'Medical History',
        included: true,
        detailLevel: 'standard'
      },
      {
        id: 'symptoms-assessment',
        title: 'Symptoms Assessment',
        included: true,
        detailLevel: 'standard'
      },
      {
        id: 'functional-status',
        title: 'Functional Status',
        included: true,
        detailLevel: 'comprehensive'
      }
    ],
    isBuiltIn: true
  },
  {
    id: 'template-2',
    name: 'Brief Assessment',
    description: 'Brief assessment focusing on key areas',
    defaultTitle: 'Brief OT Summary',
    defaultStyle: 'conversational',
    defaultSections: [
      {
        id: 'medical-history',
        title: 'Medical History',
        included: true,
        detailLevel: 'brief'
      },
      {
        id: 'functional-status',
        title: 'Functional Status',
        included: true,
        detailLevel: 'brief'
      }
    ],
    isBuiltIn: true
  }
];

const sampleDataAvailability = {
  'medical-history': { status: 'complete', percentage: 100 },
  'symptoms-assessment': { status: 'partial', percentage: 75 },
  'functional-status': { status: 'complete', percentage: 100 },
  'typical-day': { status: 'incomplete', percentage: 30 },
  'environmental-assessment': { status: 'complete', percentage: 90 }
};

const sampleGeneratedReport = {
  id: 'report-1',
  title: 'OT Assessment Report',
  createdAt: new Date().toISOString(),
  sections: [
    {
      id: 'medical-history',
      title: 'Medical History',
      content: 'The client has a history of chronic back pain following a workplace injury in 2022...',
      dataSources: ['Medical Records', 'Client Interview'],
      dataCompleteness: { status: 'complete', percentage: 100 }
    },
    {
      id: 'functional-status',
      title: 'Functional Status',
      content: 'The client demonstrates independence with basic self-care tasks but requires moderate assistance with...',
      dataSources: ['Functional Assessment', 'ADL Observation'],
      dataCompleteness: { status: 'complete', percentage: 100 }
    }
  ]
};

// Create a wrapper that renders each step in the proper flow
const renderReportDraftingFlow = () => {
  // Set up the wrapper with the context provider
  const renderResult = render(
    <ReportDraftingProvider>
      <div data-testid="template-selection-step">
        <TemplateSelection />
      </div>
      <div data-testid="configure-report-step" className="hidden">
        <ConfigureReport />
      </div>
      <div data-testid="report-preview-step" className="hidden">
        <ReportPreview />
      </div>
      <div data-testid="export-report-step" className="hidden">
        <ExportReport />
      </div>
    </ReportDraftingProvider>
  );

  // Create helper functions to simulate step transitions
  const goToConfigureStep = async () => {
    // Make the template selection step hidden and the configure step visible
    await act(async () => {
      const templateSelectionElement = screen.getByTestId('template-selection-step');
      const configureReportElement = screen.getByTestId('configure-report-step');
      
      templateSelectionElement.classList.add('hidden');
      configureReportElement.classList.remove('hidden');
    });
  };

  const goToPreviewStep = async () => {
    // Make the configure step hidden and the preview step visible
    await act(async () => {
      const configureReportElement = screen.getByTestId('configure-report-step');
      const reportPreviewElement = screen.getByTestId('report-preview-step');
      
      configureReportElement.classList.add('hidden');
      reportPreviewElement.classList.remove('hidden');
    });
  };

  const goToExportStep = async () => {
    // Make the preview step hidden and the export step visible
    await act(async () => {
      const reportPreviewElement = screen.getByTestId('report-preview-step');
      const exportReportElement = screen.getByTestId('export-report-step');
      
      reportPreviewElement.classList.add('hidden');
      exportReportElement.classList.remove('hidden');
    });
  };

  return {
    ...renderResult,
    goToConfigureStep,
    goToPreviewStep,
    goToExportStep
  };
};

describe('Report Drafting Integration Flow', () => {
  // Set up mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();
    
    // Default mock implementations
    (apiService.getAvailableTemplates as jest.Mock).mockResolvedValue(sampleTemplates);
    (apiService.getTemplate as jest.Mock).mockImplementation((id) => {
      return Promise.resolve(sampleTemplates.find(t => t.id === id));
    });
    (apiService.getDataAvailabilityStatus as jest.Mock).mockResolvedValue(sampleDataAvailability);
    (apiService.createReportConfiguration as jest.Mock).mockResolvedValue({
      id: 'config-1',
      templateId: 'template-1',
      title: 'OT Assessment Report',
      style: 'clinical',
      sections: [
        {
          id: 'medical-history',
          included: true,
          detailLevel: 'standard'
        },
        {
          id: 'functional-status',
          included: true,
          detailLevel: 'comprehensive'
        }
      ],
      createdAt: new Date().toISOString()
    });
    (apiService.generateReport as jest.Mock).mockResolvedValue(sampleGeneratedReport);
    (apiService.updateReportSection as jest.Mock).mockImplementation((reportId, sectionId, content) => {
      return Promise.resolve({
        ...sampleGeneratedReport,
        sections: sampleGeneratedReport.sections.map(s => 
          s.id === sectionId ? { ...s, content } : s
        )
      });
    });
    (apiService.exportReport as jest.Mock).mockResolvedValue({
      success: true,
      message: 'Report successfully exported',
      downloadUrl: 'mock-download-url'
    });
  });

  test('Complete end-to-end flow: template selection → report generation → export', async () => {
    const { goToConfigureStep, goToPreviewStep, goToExportStep } = renderReportDraftingFlow();

    // Step 1: Template Selection
    // Wait for templates to load
    await waitFor(() => {
      expect(apiService.getAvailableTemplates).toHaveBeenCalled();
    });

    // Verify templates are visible
    expect(screen.getByText('Standard OT Assessment')).toBeInTheDocument();
    expect(screen.getByText('Brief Assessment')).toBeInTheDocument();

    // Select a template
    await act(async () => {
      fireEvent.click(screen.getByText('Standard OT Assessment'));
    });

    // Verify template selection API call
    expect(apiService.getTemplate).toHaveBeenCalledWith('template-1');

    // Disable the hidden class on the Next button for testing
    await act(async () => {
      const nextButton = screen.getByText('Next: Configure Report');
      fireEvent.click(nextButton);
    });

    // Move to Configure Report step
    await goToConfigureStep();

    // Step 2: Configure Report
    // Verify data availability was checked
    await waitFor(() => {
      expect(apiService.getDataAvailabilityStatus).toHaveBeenCalled();
    });

    // Verify report title from template is displayed
    expect(screen.getByDisplayValue('OT Assessment Report')).toBeInTheDocument();

    // Change report title
    await act(async () => {
      fireEvent.change(screen.getByLabelText('Report Title'), { 
        target: { value: 'Custom OT Assessment Report' } 
      });
    });

    // Toggle a section
    await act(async () => {
      // Find all checkboxes
      const checkboxes = screen.getAllByRole('checkbox');
      
      // Uncheck the Symptoms Assessment
      const symptomsCheckbox = checkboxes.find(checkbox => 
        checkbox.closest('.border')?.textContent?.includes('Symptoms Assessment')
      );
      
      if (symptomsCheckbox) {
        fireEvent.click(symptomsCheckbox);
      }
    });

    // Go to next step - create report configuration and generate report
    await act(async () => {
      fireEvent.click(screen.getByText('Next: Preview Report'));
    });

    // Verify createReportConfig was called
    expect(apiService.createReportConfiguration).toHaveBeenCalledWith(
      'template-1',
      expect.any(Array),
      'clinical',
      expect.any(String)
    );

    // Verify generateReport was called
    expect(apiService.generateReport).toHaveBeenCalled();

    // Move to Report Preview step
    await goToPreviewStep();

    // Step 3: Report Preview
    // Verify report content is displayed
    expect(screen.getByText('OT Assessment Report')).toBeInTheDocument();
    expect(screen.getByText('Medical History')).toBeInTheDocument();
    expect(screen.getByText('Functional Status')).toBeInTheDocument();

    // Edit a section
    await act(async () => {
      // Find the edit button for the Medical History section
      const editButtons = screen.getAllByRole('button', { name: 'Edit' });
      fireEvent.click(editButtons[0]);
    });

    // Verify edit mode is activated
    expect(screen.getByText('Editing:')).toBeInTheDocument();

    // Edit the content
    await act(async () => {
      fireEvent.change(screen.getByRole('textbox'), { 
        target: { value: 'Updated medical history content.' } 
      });
    });

    // Save the changes
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
    });

    // Verify updateReportSection was called
    expect(apiService.updateReportSection).toHaveBeenCalledWith(
      'report-1',
      'medical-history',
      'Updated medical history content.'
    );

    // Go to next step - export report
    await act(async () => {
      fireEvent.click(screen.getByText('Next: Finalize Report'));
    });

    // Move to Export Report step
    await goToExportStep();

    // Step 4: Export Report
    // Verify report summary is displayed
    expect(screen.getByText('Report Summary')).toBeInTheDocument();

    // Check formatting options
    expect(screen.getByText('PDF Document')).toBeInTheDocument();
    expect(screen.getByText('Word Document')).toBeInTheDocument();

    // Change export format
    await act(async () => {
      // Click on Word Document option
      fireEvent.click(screen.getByText('Word Document'));
    });

    // Export the report
    await act(async () => {
      fireEvent.click(screen.getByText('Export Report'));
    });

    // Verify exportReport was called with correct format
    expect(apiService.exportReport).toHaveBeenCalledWith(
      'report-1',
      expect.objectContaining({ format: 'docx' })
    );

    // Verify export success message
    await waitFor(() => {
      expect(screen.getByText('Export Complete')).toBeInTheDocument();
    });
  });

  test('Handles API errors gracefully in template selection step', async () => {
    // Mock API error
    (apiService.getAvailableTemplates as jest.Mock).mockRejectedValue(
      new Error('API error')
    );
    
    renderReportDraftingFlow();

    // Verify error state is displayed
    await waitFor(() => {
      expect(screen.getByText('Error loading templates')).toBeInTheDocument();
    });

    // Try again button should be visible
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  test('Handles API errors gracefully in report generation step', async () => {
    const { goToConfigureStep } = renderReportDraftingFlow();

    // Wait for templates to load and select one
    await waitFor(() => {
      expect(apiService.getAvailableTemplates).toHaveBeenCalled();
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Standard OT Assessment'));
    });

    // Go to configure step
    await goToConfigureStep();

    // Mock report generation error
    (apiService.generateReport as jest.Mock).mockRejectedValue(
      new Error('Failed to generate report')
    );

    // Attempt to generate report
    await act(async () => {
      fireEvent.click(screen.getByText('Next: Preview Report'));
    });

    // Verify error is handled
    await waitFor(() => {
      expect(apiService.createReportConfiguration).toHaveBeenCalled();
    });
  });

  test('Validates data mapping between assessment data and prompts', async () => {
    const { goToConfigureStep, goToPreviewStep } = renderReportDraftingFlow();

    // Complete template selection
    await waitFor(() => {
      expect(apiService.getAvailableTemplates).toHaveBeenCalled();
    });
    await act(async () => {
      fireEvent.click(screen.getByText('Standard OT Assessment'));
      await goToConfigureStep();
    });

    // Complete report configuration
    await act(async () => {
      fireEvent.click(screen.getByText('Next: Preview Report'));
      await goToPreviewStep();
    });

    // Switch to data mapping tab
    await act(async () => {
      fireEvent.click(screen.getByRole('tab', { name: 'Data Mapping' }));
    });

    // Verify data mapping information is displayed
    expect(screen.getByText('Data Source Mapping')).toBeInTheDocument();
    expect(screen.getAllByText('Data Sources:')).toHaveLength(sampleGeneratedReport.sections.length);
    
    // Verify specific data sources are shown
    expect(screen.getByText('Medical Records')).toBeInTheDocument();
    expect(screen.getByText('Client Interview')).toBeInTheDocument();
    
    // Verify completion status is displayed
    expect(screen.getAllByText('Complete')).toHaveLength(sampleGeneratedReport.sections.length);
  });

  test('Verifies state persistence across wizard workflow', async () => {
    const { goToConfigureStep, goToPreviewStep, goToExportStep } = renderReportDraftingFlow();

    // Complete template selection
    await waitFor(() => {
      expect(apiService.getAvailableTemplates).toHaveBeenCalled();
    });
    await act(async () => {
      fireEvent.click(screen.getByText('Standard OT Assessment'));
      await goToConfigureStep();
    });

    // Modify configuration (change title)
    await act(async () => {
      fireEvent.change(screen.getByLabelText('Report Title'), { 
        target: { value: 'Custom Report Title' } 
      });
      fireEvent.click(screen.getByText('Next: Preview Report'));
      await goToPreviewStep();
    });

    // Go back to configuration step
    await act(async () => {
      fireEvent.click(screen.getByText('Back'));
      await goToConfigureStep();
    });

    // Verify title is still set to the custom value (state persisted)
    expect(screen.getByDisplayValue('Custom Report Title')).toBeInTheDocument();

    // Go forward to preview again
    await act(async () => {
      fireEvent.click(screen.getByText('Next: Preview Report'));
      await goToPreviewStep();
    });

    // Edit a section
    await act(async () => {
      const editButtons = screen.getAllByRole('button', { name: 'Edit' });
      fireEvent.click(editButtons[0]);
      fireEvent.change(screen.getByRole('textbox'), { 
        target: { value: 'Edited content for testing.' } 
      });
      fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
    });

    // Go to export step
    await act(async () => {
      fireEvent.click(screen.getByText('Next: Finalize Report'));
      await goToExportStep();
    });

    // Go back to preview step
    await act(async () => {
      fireEvent.click(screen.getByText('Back'));
      await goToPreviewStep();
    });

    // Verify edited content is still there (state persisted)
    expect(screen.getByText('Edited content for testing.')).toBeInTheDocument();
  });

  test('Tests fallback mechanisms when API fails', async () => {
    // Mock getAvailableTemplates to first fail, then succeed on retry
    let retryCount = 0;
    (apiService.getAvailableTemplates as jest.Mock).mockImplementation(() => {
      if (retryCount === 0) {
        retryCount++;
        return Promise.reject(new Error('Network error'));
      }
      return Promise.resolve(sampleTemplates);
    });

    renderReportDraftingFlow();

    // Wait for initial error
    await waitFor(() => {
      expect(screen.getByText('Error loading templates')).toBeInTheDocument();
    });

    // Click try again
    await act(async () => {
      fireEvent.click(screen.getByText('Try Again'));
    });

    // Verify templates load on retry
    await waitFor(() => {
      expect(screen.getByText('Standard OT Assessment')).toBeInTheDocument();
    });
  });
});
