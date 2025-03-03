/**
 * Tests for the ReportPreview component
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { ReportDraftingProvider } from '@/contexts/ReportDrafting/ReportDraftingContext';
import ReportPreview from '../ReportPreview';
import * as apiService from '@/lib/report-drafting/api-service';

// Mock the API service
jest.mock('@/lib/report-drafting/api-service');
const mockApiService = apiService as jest.Mocked<typeof apiService>;

describe('ReportPreview Component', () => {
  // Sample data for tests
  const sampleReportConfig = {
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

  // Setup mock context values for the component
  const setupMocksForPreview = () => {
    mockApiService.updateReportSection.mockImplementation((reportId, sectionId, content) => {
      return Promise.resolve({
        ...sampleGeneratedReport,
        sections: sampleGeneratedReport.sections.map(s => 
          s.id === sectionId ? { ...s, content } : s
        )
      });
    });
  };

  beforeEach(() => {
    jest.resetAllMocks();
    setupMocksForPreview();
  });

  // Helper function to render the component with necessary context state
  const renderWithGeneratedReport = async () => {
    const renderResult = render(
      <ReportDraftingProvider>
        <ReportPreview />
      </ReportDraftingProvider>
    );

    // Access the context and set it up with generated report
    const { getByText } = renderResult;
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Generating report...')).not.toBeInTheDocument();
    });
    
    return renderResult;
  };

  it('should display the generated report', async () => {
    const { container } = await renderWithGeneratedReport();
    
    // Check that the report title is displayed
    expect(screen.getByText('OT Assessment Report')).toBeInTheDocument();
    
    // Check that section titles are displayed
    expect(screen.getByText('Medical History')).toBeInTheDocument();
    expect(screen.getByText('Functional Status')).toBeInTheDocument();
    
    // Check that section content is displayed
    expect(screen.getByText(/The client has a history of chronic back pain/)).toBeInTheDocument();
    expect(screen.getByText(/The client demonstrates independence with basic self-care tasks/)).toBeInTheDocument();
    
    // Check that edit buttons are available
    const editButtons = screen.getAllByText('Edit');
    expect(editButtons.length).toBe(2);
  });

  it('should switch to edit mode when Edit is clicked', async () => {
    await renderWithGeneratedReport();
    
    // Find and click the edit button for Medical History
    const editButtons = screen.getAllByText('Edit');
    
    await act(async () => {
      fireEvent.click(editButtons[0]);
    });
    
    // Check that the edit view is displayed
    expect(screen.getByText('Editing:')).toBeInTheDocument();
    
    // Check that the textarea contains the section content
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveValue(sampleGeneratedReport.sections[0].content);
    
    // Check that save and cancel buttons are displayed
    expect(screen.getByText('Save Changes')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('should save edited content', async () => {
    await renderWithGeneratedReport();
    
    // Find and click the edit button for Medical History
    const editButtons = screen.getAllByText('Edit');
    
    await act(async () => {
      fireEvent.click(editButtons[0]);
    });
    
    // Edit the content in the textarea
    const textarea = screen.getByRole('textbox');
    const newContent = 'This is updated medical history content.';
    
    await act(async () => {
      fireEvent.change(textarea, { target: { value: newContent } });
    });
    
    // Save the changes
    await act(async () => {
      fireEvent.click(screen.getByText('Save Changes'));
    });
    
    // Check that the API was called
    expect(mockApiService.updateReportSection).toHaveBeenCalledWith(
      'report-1',
      'medical-history',
      newContent
    );
    
    // Check that we return to preview mode
    expect(screen.queryByText('Editing:')).not.toBeInTheDocument();
  });

  it('should cancel editing without saving', async () => {
    await renderWithGeneratedReport();
    
    // Find and click the edit button for Medical History
    const editButtons = screen.getAllByText('Edit');
    
    await act(async () => {
      fireEvent.click(editButtons[0]);
    });
    
    // Edit the content in the textarea
    const textarea = screen.getByRole('textbox');
    const newContent = 'This content should not be saved.';
    
    await act(async () => {
      fireEvent.change(textarea, { target: { value: newContent } });
    });
    
    // Cancel the changes
    await act(async () => {
      fireEvent.click(screen.getByText('Cancel'));
    });
    
    // Check that the API was NOT called
    expect(mockApiService.updateReportSection).not.toHaveBeenCalled();
    
    // Check that we return to preview mode
    expect(screen.queryByText('Editing:')).not.toBeInTheDocument();
  });

  it('should display data mapping information in the data mapping tab', async () => {
    await renderWithGeneratedReport();
    
    // Switch to data mapping tab
    await act(async () => {
      fireEvent.click(screen.getByRole('tab', { name: 'Data Mapping' }));
    });
    
    // Check that the data mapping view is displayed
    expect(screen.getByText('Data Source Mapping')).toBeInTheDocument();
    
    // Check that data sources are displayed
    expect(screen.getByText('Medical Records')).toBeInTheDocument();
    expect(screen.getByText('Client Interview')).toBeInTheDocument();
    expect(screen.getByText('Functional Assessment')).toBeInTheDocument();
    expect(screen.getByText('ADL Observation')).toBeInTheDocument();
    
    // Check that completion status is displayed
    expect(screen.getAllByText('Complete', { exact: false })).toHaveLength(2);
  });

  it('should handle errors when updating section content', async () => {
    // Mock error response
    mockApiService.updateReportSection.mockRejectedValue(new Error('API error'));
    
    await renderWithGeneratedReport();
    
    // Find and click the edit button for Medical History
    const editButtons = screen.getAllByText('Edit');
    
    await act(async () => {
      fireEvent.click(editButtons[0]);
    });
    
    // Edit the content in the textarea
    const textarea = screen.getByRole('textbox');
    
    await act(async () => {
      fireEvent.change(textarea, { target: { value: 'New content' } });
    });
    
    // Save the changes
    await act(async () => {
      fireEvent.click(screen.getByText('Save Changes'));
    });
    
    // Check console.error was called
    expect(console.error).toHaveBeenCalledWith(
      'Error updating section:', 
      expect.any(Error)
    );
  });

  it('should disable the text editor when saving', async () => {
    // Mock slow response to test loading state
    mockApiService.updateReportSection.mockImplementation(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      return {
        ...sampleGeneratedReport,
        sections: sampleGeneratedReport.sections
      };
    });
    
    await renderWithGeneratedReport();
    
    // Find and click the edit button for Medical History
    const editButtons = screen.getAllByText('Edit');
    
    await act(async () => {
      fireEvent.click(editButtons[0]);
    });
    
    // Save the changes
    const saveButton = screen.getByText('Save Changes');
    const cancelButton = screen.getByText('Cancel');
    
    await act(async () => {
      fireEvent.click(saveButton);
    });
    
    // Buttons should be disabled while saving
    expect(saveButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
    
    // Wait for save to complete
    await waitFor(() => {
      expect(screen.queryByText('Editing:')).not.toBeInTheDocument();
    });
  });

  it('should handle navigation between steps', async () => {
    await renderWithGeneratedReport();
    
    // Check that the back and next buttons are present
    expect(screen.getByText('Back')).toBeInTheDocument();
    expect(screen.getByText('Next: Finalize Report')).toBeInTheDocument();
  });
});
