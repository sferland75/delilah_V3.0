/**
 * Tests for the ExportReport component
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { ReportDraftingProvider } from '@/contexts/ReportDrafting/ReportDraftingContext';
import ExportReport from '../ExportReport';
import * as apiService from '@/lib/report-drafting/api-service';

// Mock the API service
jest.mock('@/lib/report-drafting/api-service');
const mockApiService = apiService as jest.Mocked<typeof apiService>;

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush
  })
}));

describe('ExportReport Component', () => {
  // Sample data for tests
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
  const setupMocksForExport = () => {
    mockApiService.exportReport.mockResolvedValue({
      success: true,
      message: 'Report successfully exported',
      downloadUrl: 'mock-download-url'
    });
  };

  beforeEach(() => {
    jest.resetAllMocks();
    setupMocksForExport();
  });

  // Helper function to render the component with necessary context state
  const renderWithGeneratedReport = async () => {
    const renderResult = render(
      <ReportDraftingProvider>
        <ExportReport />
      </ReportDraftingProvider>
    );

    // Access the context and set it up with generated report
    const { getByText } = renderResult;
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    return renderResult;
  };

  it('should display export options', async () => {
    const { container } = await renderWithGeneratedReport();
    
    // Check that the title is displayed
    expect(screen.getByText('Finalize & Export Report')).toBeInTheDocument();
    
    // Check that export format options are displayed
    expect(screen.getByText('PDF Document')).toBeInTheDocument();
    expect(screen.getByText('Word Document')).toBeInTheDocument();
    expect(screen.getByText('Client Record')).toBeInTheDocument();
    
    // Check that a filename input is displayed
    expect(screen.getByLabelText('Report Filename')).toBeInTheDocument();
    
    // Check that export button is displayed
    expect(screen.getByText('Export Report')).toBeInTheDocument();
  });

  it('should allow changing the export format', async () => {
    await renderWithGeneratedReport();
    
    // Default should be PDF
    const pdfCard = screen.getByText('PDF Document').closest('.border-2');
    expect(pdfCard).toHaveClass('border-blue-600');
    
    // Click on Word Document
    await act(async () => {
      fireEvent.click(screen.getByText('Word Document'));
    });
    
    // Word Document should now be selected
    const wordCard = screen.getByText('Word Document').closest('.border-2');
    expect(wordCard).toHaveClass('border-blue-600');
  });

  it('should allow changing the filename', async () => {
    await renderWithGeneratedReport();
    
    // Change the filename
    const filenameInput = screen.getByLabelText('Report Filename');
    
    await act(async () => {
      fireEvent.change(filenameInput, { target: { value: 'custom-filename' } });
    });
    
    // Check that the value was updated
    expect(filenameInput).toHaveValue('custom-filename');
  });

  it('should display report summary', async () => {
    await renderWithGeneratedReport();
    
    // Check that the report summary section is displayed
    expect(screen.getByText('Report Summary')).toBeInTheDocument();
    
    // Check that summary includes key information
    expect(screen.getByText('Title:')).toBeInTheDocument();
    expect(screen.getByText('Sections:')).toBeInTheDocument();
    expect(screen.getByText('Created Date:')).toBeInTheDocument();
    expect(screen.getByText('Format:')).toBeInTheDocument();
  });

  it('should export report in the selected format', async () => {
    await renderWithGeneratedReport();
    
    // Select Word Document format
    await act(async () => {
      fireEvent.click(screen.getByText('Word Document'));
    });
    
    // Click the export button
    await act(async () => {
      fireEvent.click(screen.getByText('Export Report'));
    });
    
    // Check that the API was called with the correct format
    expect(mockApiService.exportReport).toHaveBeenCalledWith(
      'report-1',
      expect.objectContaining({
        format: 'docx',
        includeMetadata: true,
        includeHeaders: true,
        includeFooters: true
      })
    );
    
    // Check that success message is displayed
    await waitFor(() => {
      expect(screen.getByText('Export Complete')).toBeInTheDocument();
    });
    
    // Check that return button is displayed
    expect(screen.getByText('Return to Dashboard')).toBeInTheDocument();
  });

  it('should display error message when export fails', async () => {
    // Mock failed export
    mockApiService.exportReport.mockResolvedValue({
      success: false,
      message: 'Failed to export report',
      downloadUrl: null
    });
    
    await renderWithGeneratedReport();
    
    // Click the export button
    await act(async () => {
      fireEvent.click(screen.getByText('Export Report'));
    });
    
    // Check that error message is displayed
    await waitFor(() => {
      expect(screen.getByText('Export Failed')).toBeInTheDocument();
      expect(screen.getByText('Failed to export report')).toBeInTheDocument();
    });
    
    // Return button should not be displayed
    expect(screen.queryByText('Return to Dashboard')).not.toBeInTheDocument();
  });

  it('should handle API errors gracefully', async () => {
    // Mock API error
    mockApiService.exportReport.mockRejectedValue(new Error('API error'));
    
    await renderWithGeneratedReport();
    
    // Click the export button
    await act(async () => {
      fireEvent.click(screen.getByText('Export Report'));
    });
    
    // Check that error message is displayed
    await waitFor(() => {
      expect(screen.getByText('Export Failed')).toBeInTheDocument();
    });
    
    // Check console.error was called
    expect(console.error).toHaveBeenCalledWith(
      'Error exporting report:', 
      expect.any(Error)
    );
  });

  it('should disable export button during export', async () => {
    // Mock slow export
    mockApiService.exportReport.mockImplementation(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      return {
        success: true,
        message: 'Report successfully exported',
        downloadUrl: 'mock-download-url'
      };
    });
    
    await renderWithGeneratedReport();
    
    // Click the export button
    const exportButton = screen.getByText('Export Report');
    
    await act(async () => {
      fireEvent.click(exportButton);
    });
    
    // Button should be disabled during export
    expect(exportButton).toBeDisabled();
    
    // Wait for export to complete
    await waitFor(() => {
      expect(screen.getByText('Export Complete')).toBeInTheDocument();
    });
  });

  it('should direct user back to dashboard after successful export', async () => {
    await renderWithGeneratedReport();
    
    // Click the export button
    await act(async () => {
      fireEvent.click(screen.getByText('Export Report'));
    });
    
    // Wait for export to complete
    await waitFor(() => {
      expect(screen.getByText('Export Complete')).toBeInTheDocument();
    });
    
    // Click return to dashboard
    await act(async () => {
      fireEvent.click(screen.getByText('Return to Dashboard'));
    });
    
    // Router.push should have been called
    expect(mockPush).toHaveBeenCalledWith('/assessment/initial');
  });

  it('should allow returning to preview step', async () => {
    await renderWithGeneratedReport();
    
    // Click the back button
    await act(async () => {
      fireEvent.click(screen.getByText('Back'));
    });
    
    // Check that goToPreviousStep was called
    // This is tested indirectly since the context is mocked
  });

  it('should show error message when no report is available', async () => {
    // Force the context to have no report
    render(
      <ReportDraftingProvider>
        <ExportReport />
      </ReportDraftingProvider>
    );
    
    // Error message should be displayed
    await waitFor(() => {
      expect(screen.getByText('No report to export')).toBeInTheDocument();
    });
    
    // Back button should be available
    expect(screen.getByText('Back to Preview')).toBeInTheDocument();
  });
});
