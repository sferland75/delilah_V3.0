/**
 * Export Options Component Tests
 * 
 * Tests for the export options UI components, including:
 * - Format selection
 * - Export options configuration
 * - Email sharing options
 * - Print settings
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExportTabContent } from '../ExportTabContent';
import { ReportDraftingContext } from '@/contexts/ReportDrafting/ReportDraftingContext';
import * as exportService from '@/services/export/export-service';

// Mock the export service
jest.mock('@/services/export/export-service', () => ({
  exportService: {
    exportReport: jest.fn(() => Promise.resolve({ success: true, message: 'Export successful' })),
    shareViaEmail: jest.fn(() => Promise.resolve({ success: true, message: 'Email sent' })),
    generatePrintVersion: jest.fn(() => Promise.resolve(new Blob(['test data'])))
  }
}));

// Sample context data for testing
const mockContextValue = {
  currentStep: 'export',
  report: {
    id: 'report-123',
    title: 'Test Report',
    createdAt: '2025-02-20T12:00:00Z',
    updatedAt: '2025-02-20T12:00:00Z',
    metadata: {
      clientId: 'client-123',
      clientName: 'John Doe',
      authorId: 'author-123',
      authorName: 'Dr. Jane Smith',
      assessmentDate: '2025-02-15',
      organizationId: 'org-123'
    },
    sections: [
      {
        id: 'section-1',
        title: 'Medical History',
        content: 'Test content for medical history',
      },
      {
        id: 'section-2',
        title: 'Recommendations',
        content: 'Test content for recommendations',
      }
    ]
  },
  template: {
    id: 'template-123',
    name: 'Test Template',
    description: 'Test Description',
    sections: ['section-1', 'section-2']
  },
  setCurrentStep: jest.fn(),
  goToStep: jest.fn(),
  updateReport: jest.fn(),
  getReportData: jest.fn(),
  templates: [],
  isLoading: false,
  error: null,
  exportOptions: {
    format: 'pdf',
    filename: 'test-report',
    includeCovers: true,
    includeHeaders: true,
    includeFooters: true
  },
  setExportOptions: jest.fn(),
  exportReport: jest.fn(() => Promise.resolve({ success: true, message: 'Export successful' })),
  shareViaEmail: jest.fn(() => Promise.resolve({ success: true, message: 'Email sent' })),
  printReport: jest.fn(() => Promise.resolve())
};

// Helper to render with context
const renderWithContext = (ui, contextValue = mockContextValue) => {
  return render(
    <ReportDraftingContext.Provider value={contextValue}>
      {ui}
    </ReportDraftingContext.Provider>
  );
};

describe('Export Options Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders the component with tabs for export options', () => {
    renderWithContext(<ExportTabContent />);
    
    // Check for tab buttons
    expect(screen.getByRole('tab', { name: /file/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /email/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /print/i })).toBeInTheDocument();
  });
  
  it('shows File export options by default', () => {
    renderWithContext(<ExportTabContent />);
    
    // Check for file-specific form elements
    expect(screen.getByLabelText(/format/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/filename/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /export report/i })).toBeInTheDocument();
  });
  
  it('switches to Email tab when clicked', async () => {
    renderWithContext(<ExportTabContent />);
    const user = userEvent.setup();
    
    // Click the Email tab
    await user.click(screen.getByRole('tab', { name: /email/i }));
    
    // Check for email-specific form elements
    expect(screen.getByLabelText(/recipient/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send email/i })).toBeInTheDocument();
  });
  
  it('switches to Print tab when clicked', async () => {
    renderWithContext(<ExportTabContent />);
    const user = userEvent.setup();
    
    // Click the Print tab
    await user.click(screen.getByRole('tab', { name: /print/i }));
    
    // Check for print-specific form elements
    expect(screen.getByLabelText(/page size/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/orientation/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /print report/i })).toBeInTheDocument();
  });
  
  it('updates export options when form values change', async () => {
    renderWithContext(<ExportTabContent />);
    const user = userEvent.setup();
    
    // Change the format
    await user.selectOptions(screen.getByLabelText(/format/i), 'docx');
    
    // Change filename
    await user.clear(screen.getByLabelText(/filename/i));
    await user.type(screen.getByLabelText(/filename/i), 'new-filename');
    
    // Toggle checkboxes
    await user.click(screen.getByLabelText(/include covers/i));
    
    // Check that setExportOptions was called with updated values
    expect(mockContextValue.setExportOptions).toHaveBeenCalledWith(
      expect.objectContaining({
        format: 'docx',
        filename: 'new-filename'
      })
    );
  });
  
  it('calls exportReport with correct options when Export button is clicked', async () => {
    renderWithContext(<ExportTabContent />);
    const user = userEvent.setup();
    
    // Click the Export button
    await user.click(screen.getByRole('button', { name: /export report/i }));
    
    // Check that exportReport was called
    expect(mockContextValue.exportReport).toHaveBeenCalledWith(
      expect.objectContaining({
        format: 'pdf',
        filename: 'test-report'
      })
    );
  });
  
  it('calls shareViaEmail with correct options when Send Email button is clicked', async () => {
    renderWithContext(<ExportTabContent />);
    const user = userEvent.setup();
    
    // Switch to Email tab
    await user.click(screen.getByRole('tab', { name: /email/i }));
    
    // Fill email form
    await user.type(screen.getByLabelText(/recipient/i), 'test@example.com');
    await user.type(screen.getByLabelText(/subject/i), 'Test Subject');
    await user.type(screen.getByLabelText(/message/i), 'Test Message');
    
    // Click the Send Email button
    await user.click(screen.getByRole('button', { name: /send email/i }));
    
    // Check that shareViaEmail was called with correct options
    expect(mockContextValue.shareViaEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        emailRecipients: ['test@example.com'],
        emailSubject: 'Test Subject',
        emailBody: 'Test Message'
      })
    );
  });
  
  it('calls printReport with correct options when Print button is clicked', async () => {
    renderWithContext(<ExportTabContent />);
    const user = userEvent.setup();
    
    // Switch to Print tab
    await user.click(screen.getByRole('tab', { name: /print/i }));
    
    // Change print options
    await user.selectOptions(screen.getByLabelText(/page size/i), 'a4');
    await user.selectOptions(screen.getByLabelText(/orientation/i), 'landscape');
    
    // Click the Print button
    await user.click(screen.getByRole('button', { name: /print report/i }));
    
    // Check that printReport was called with correct options
    expect(mockContextValue.printReport).toHaveBeenCalledWith(
      expect.objectContaining({
        pageSize: 'a4',
        orientation: 'landscape'
      })
    );
  });
  
  it('shows success message after export', async () => {
    renderWithContext(<ExportTabContent />);
    const user = userEvent.setup();
    
    // Click the Export button
    await user.click(screen.getByRole('button', { name: /export report/i }));
    
    // Wait for success message to appear
    await waitFor(() => {
      expect(screen.getByText(/export successful/i)).toBeInTheDocument();
    });
  });
  
  it('shows error message when export fails', async () => {
    // Mock implementation that fails
    mockContextValue.exportReport.mockResolvedValueOnce({
      success: false,
      message: 'Export failed'
    });
    
    renderWithContext(<ExportTabContent />);
    const user = userEvent.setup();
    
    // Click the Export button
    await user.click(screen.getByRole('button', { name: /export report/i }));
    
    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText(/export failed/i)).toBeInTheDocument();
    });
  });
  
  it('disables buttons during export processing', async () => {
    // Mock a delayed response
    mockContextValue.exportReport.mockImplementationOnce(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({ success: true, message: 'Export successful' });
        }, 100);
      });
    });
    
    renderWithContext(<ExportTabContent />);
    const user = userEvent.setup();
    
    // Click the Export button
    await user.click(screen.getByRole('button', { name: /export report/i }));
    
    // Check that the button is disabled
    expect(screen.getByRole('button', { name: /exporting/i })).toBeDisabled();
    
    // Wait for the export to complete
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /export report/i })).toBeEnabled();
    });
  });
});
