/**
 * Print Optimization Tests
 * 
 * Tests for the print optimization functionality of the export service.
 * These tests focus specifically on generating print-optimized versions of reports.
 */

import { ExportService, AdvancedExportOptions } from '../export-service';
import { GeneratedReport } from '@/lib/report-drafting/types';

// Mock dependencies
jest.mock('file-saver', () => ({
  saveAs: jest.fn()
}));

// Mock jsPDF
jest.mock('jspdf', () => ({
  jsPDF: jest.fn(() => ({
    setProperties: jest.fn(),
    setFontSize: jest.fn(),
    text: jest.fn(),
    setDrawColor: jest.fn(),
    setLineWidth: jest.fn(),
    line: jest.fn(),
    addPage: jest.fn(),
    splitTextToSize: jest.fn((text) => [text]),
    output: jest.fn(() => new Blob(['pdf content'], { type: 'application/pdf' }))
  }))
}));

// Sample report data for testing
const mockReport: GeneratedReport = {
  id: 'report-123',
  title: 'Test Assessment Report',
  createdAt: '2025-02-20T12:00:00Z',
  updatedAt: '2025-02-20T12:00:00Z',
  metadata: {
    clientId: 'client-123',
    clientName: 'John Doe',
    authorId: 'author-123',
    authorName: 'Dr. Jane Smith',
    assessmentDate: '2025-02-15',
    organizationId: 'org-123',
    customFields: {}
  },
  sections: [
    {
      id: 'section-1',
      title: 'Medical History',
      content: 'Test medical history content',
    },
    {
      id: 'section-2',
      title: 'Recommendations',
      content: 'Test recommendations content',
    }
  ]
};

describe('Print Optimization Functionality', () => {
  let exportService: ExportService;
  
  beforeEach(() => {
    // Clear mocks
    jest.clearAllMocks();
    
    // Create new instance of export service
    exportService = new ExportService();
    
    // Mock exportToPdf to avoid actual PDF generation
    jest.spyOn(exportService as any, 'exportToPdf').mockResolvedValue({ success: true });
    
    // Mock console to prevent test output noise
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  
  it('generates a print-optimized PDF with correct options', async () => {
    // Basic options
    const options: AdvancedExportOptions = {
      filename: 'test-report',
      pageSize: 'letter',
      orientation: 'portrait'
    };
    
    // Spy on exportToPdf
    const exportToPdfSpy = jest.spyOn(exportService as any, 'exportToPdf');
    
    // Generate print version
    await exportService.generatePrintVersion(mockReport, options);
    
    // Check that exportToPdf was called with print-specific options
    expect(exportToPdfSpy).toHaveBeenCalledWith(
      mockReport,
      expect.objectContaining({
        optimizeForPrinting: true,
        margins: expect.any(Object),
        includeHeaders: true,
        includeFooters: true
      })
    );
  });
  
  it('preserves user-specified options when generating print version', async () => {
    // User-specified options
    const options: AdvancedExportOptions = {
      filename: 'custom-filename',
      pageSize: 'a4',
      orientation: 'landscape',
      useBranding: false,
      margins: { top: 10, right: 10, bottom: 10, left: 10 }
    };
    
    // Spy on exportToPdf
    const exportToPdfSpy = jest.spyOn(exportService as any, 'exportToPdf');
    
    // Generate print version
    await exportService.generatePrintVersion(mockReport, options);
    
    // Check that exportToPdf was called with user options preserved
    expect(exportToPdfSpy).toHaveBeenCalledWith(
      mockReport,
      expect.objectContaining({
        filename: 'custom-filename',
        pageSize: 'a4',
        orientation: 'landscape',
        useBranding: false
      })
    );
  });
  
  it('sets print-specific margins', async () => {
    // Basic options
    const options: AdvancedExportOptions = {
      filename: 'test-report'
    };
    
    // Spy on exportToPdf
    const exportToPdfSpy = jest.spyOn(exportService as any, 'exportToPdf');
    
    // Generate print version
    await exportService.generatePrintVersion(mockReport, options);
    
    // Check that exportToPdf was called with print-specific margins
    expect(exportToPdfSpy).toHaveBeenCalledWith(
      mockReport,
      expect.objectContaining({
        margins: { top: 25, right: 25, bottom: 25, left: 25 }
      })
    );
  });
  
  it('enables headers and footers for print version', async () => {
    // Options with headers and footers disabled
    const options: AdvancedExportOptions = {
      filename: 'test-report',
      includeHeaders: false,
      includeFooters: false
    };
    
    // Spy on exportToPdf
    const exportToPdfSpy = jest.spyOn(exportService as any, 'exportToPdf');
    
    // Generate print version
    await exportService.generatePrintVersion(mockReport, options);
    
    // Check that exportToPdf was called with headers and footers enabled
    expect(exportToPdfSpy).toHaveBeenCalledWith(
      mockReport,
      expect.objectContaining({
        includeHeaders: true,
        includeFooters: true
      })
    );
  });
  
  it('enables branding for print version by default', async () => {
    // Options with branding not specified
    const options: AdvancedExportOptions = {
      filename: 'test-report'
    };
    
    // Spy on exportToPdf
    const exportToPdfSpy = jest.spyOn(exportService as any, 'exportToPdf');
    
    // Generate print version
    await exportService.generatePrintVersion(mockReport, options);
    
    // Check that exportToPdf was called with branding enabled
    expect(exportToPdfSpy).toHaveBeenCalledWith(
      mockReport,
      expect.objectContaining({
        useBranding: true
      })
    );
  });
  
  it('respects user branding preference for print version', async () => {
    // Options with branding disabled
    const options: AdvancedExportOptions = {
      filename: 'test-report',
      useBranding: false
    };
    
    // Spy on exportToPdf
    const exportToPdfSpy = jest.spyOn(exportService as any, 'exportToPdf');
    
    // Generate print version
    await exportService.generatePrintVersion(mockReport, options);
    
    // Check that exportToPdf was called with branding disabled
    expect(exportToPdfSpy).toHaveBeenCalledWith(
      mockReport,
      expect.objectContaining({
        useBranding: false
      })
    );
  });
  
  it('returns a PDF Blob', async () => {
    // Basic options
    const options: AdvancedExportOptions = {
      filename: 'test-report'
    };
    
    // Generate print version
    const result = await exportService.generatePrintVersion(mockReport, options);
    
    // Check result is a Blob with PDF content type
    expect(result).toBeInstanceOf(Blob);
    expect(result.type).toBe('application/pdf');
  });
  
  it('handles errors during PDF generation', async () => {
    // Force exportToPdf to throw an error
    jest.spyOn(exportService as any, 'exportToPdf').mockImplementationOnce(() => {
      throw new Error('PDF generation error');
    });
    
    // Basic options
    const options: AdvancedExportOptions = {
      filename: 'test-report'
    };
    
    // Generate print version should not throw
    await expect(exportService.generatePrintVersion(mockReport, options)).resolves.toBeInstanceOf(Blob);
  });
});
