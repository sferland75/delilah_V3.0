/**
 * Print Functionality Tests
 * 
 * Tests for the print functionality in the export service
 */

import { ExportService } from '../export-service';
import { GeneratedReport } from '@/lib/report-drafting/types';

// Mock Print-JS
jest.mock('print-js', () => jest.fn());
const printJsMock = require('print-js');

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
    customFields: {
      referralSource: 'Dr. Johnson',
      insuranceProvider: 'ABC Insurance'
    }
  },
  sections: [
    {
      id: 'section-1',
      title: 'Medical History',
      content: 'Client has a history of lower back pain following a motor vehicle accident in 2023.',
    },
    {
      id: 'section-2',
      title: 'Functional Assessment',
      content: 'Client demonstrates reduced range of motion in lumbar spine.',
    }
  ]
};

describe('Print Functionality', () => {
  let exportService: ExportService;
  
  beforeEach(() => {
    // Clear mocks
    jest.clearAllMocks();
    
    // Create new instance of export service
    exportService = new ExportService();
    
    // Mock console methods to prevent test output noise
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock URL.createObjectURL
    global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = jest.fn();
  });
  
  describe('generatePrintVersion', () => {
    it('creates a print-optimized PDF with default options', async () => {
      // Spy on exportToPdf
      const spyExportToPdf = jest.spyOn(exportService as any, 'exportToPdf')
        .mockResolvedValue({ 
          success: true,
          blob: new Blob(['pdf content'], { type: 'application/pdf' })
        });
      
      // Generate print version with default options
      const result = await exportService.generatePrintVersion(mockReport, {
        filename: 'test-report'
      });
      
      // Check that exportToPdf was called with print-specific options
      expect(spyExportToPdf).toHaveBeenCalledWith(
        mockReport,
        expect.objectContaining({
          optimizeForPrinting: true,
          includeHeaders: true,
          includeFooters: true,
          filename: 'test-report'
        })
      );
      
      // Check result is a Blob
      expect(result).toBeInstanceOf(Blob);
    });
    
    it('applies custom page settings when specified', async () => {
      // Spy on exportToPdf
      const spyExportToPdf = jest.spyOn(exportService as any, 'exportToPdf')
        .mockResolvedValue({ 
          success: true,
          blob: new Blob(['pdf content'], { type: 'application/pdf' })
        });
      
      // Custom print options
      const options = {
        filename: 'test-report',
        pageSize: 'a4' as 'a4',
        orientation: 'landscape' as 'landscape',
        margins: { top: 15, right: 15, bottom: 15, left: 15 }
      };
      
      // Generate print version with custom options
      await exportService.generatePrintVersion(mockReport, options);
      
      // Check that exportToPdf was called with correct options
      expect(spyExportToPdf).toHaveBeenCalledWith(
        mockReport,
        expect.objectContaining({
          optimizeForPrinting: true,
          pageSize: 'a4',
          orientation: 'landscape',
          margins: { top: 15, right: 15, bottom: 15, left: 15 }
        })
      );
    });
    
    it('handles errors during PDF generation', async () => {
      // Force exportToPdf to throw an error
      jest.spyOn(exportService as any, 'exportToPdf').mockImplementation(() => {
        throw new Error('PDF generation error');
      });
      
      // Attempt to generate print version
      await expect(exportService.generatePrintVersion(mockReport, {
        filename: 'test-report'
      })).rejects.toThrow('PDF generation error');
    });
    
    it('applies print-specific optimizations', async () => {
      // Spy on exportToPdf to capture options
      const spyExportToPdf = jest.spyOn(exportService as any, 'exportToPdf')
        .mockResolvedValue({ 
          success: true,
          blob: new Blob(['pdf content'], { type: 'application/pdf' })
        });
      
      // Generate print version
      await exportService.generatePrintVersion(mockReport, {
        filename: 'test-report',
        optimizePrintDensity: true,
        printScaling: 'fit'
      });
      
      // Check that print-specific options were applied
      expect(spyExportToPdf).toHaveBeenCalledWith(
        mockReport,
        expect.objectContaining({
          optimizeForPrinting: true,
          optimizePrintDensity: true,
          printScaling: 'fit'
        })
      );
    });
  });
  
  describe('printReport', () => {
    it('generates print version and sends to printer', async () => {
      // Spy on generatePrintVersion
      const mockBlob = new Blob(['pdf content'], { type: 'application/pdf' });
      jest.spyOn(exportService, 'generatePrintVersion').mockResolvedValue(mockBlob);
      
      // Print options
      const options = {
        filename: 'test-report',
        pageSize: 'letter',
        orientation: 'portrait'
      };
      
      // Print report
      const result = await exportService.printReport(mockReport, options);
      
      // Check that generatePrintVersion was called
      expect(exportService.generatePrintVersion).toHaveBeenCalledWith(
        mockReport,
        expect.objectContaining(options)
      );
      
      // Check that print-js was called with the URL
      expect(printJsMock).toHaveBeenCalledWith({
        printable: 'blob:mock-url',
        type: 'pdf',
        showModal: true
      });
      
      // Check result
      expect(result.success).toBe(true);
      expect(result.message).toContain('successfully sent to printer');
    });
    
    it('handles errors during print preparation', async () => {
      // Force generatePrintVersion to throw an error
      jest.spyOn(exportService, 'generatePrintVersion').mockImplementation(() => {
        throw new Error('Print preparation error');
      });
      
      // Attempt to print
      const result = await exportService.printReport(mockReport, {
        filename: 'test-report'
      });
      
      // Check error handling
      expect(result.success).toBe(false);
      expect(result.message).toContain('Print preparation error');
    });
    
    it('cleans up resources after printing', async () => {
      // Spy on generatePrintVersion
      const mockBlob = new Blob(['pdf content'], { type: 'application/pdf' });
      jest.spyOn(exportService, 'generatePrintVersion').mockResolvedValue(mockBlob);
      
      // Print report
      await exportService.printReport(mockReport, {
        filename: 'test-report'
      });
      
      // Check that URL.revokeObjectURL was called
      expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    });
    
    it('applies custom print settings', async () => {
      // Spy on generatePrintVersion
      const mockBlob = new Blob(['pdf content'], { type: 'application/pdf' });
      jest.spyOn(exportService, 'generatePrintVersion').mockResolvedValue(mockBlob);
      
      // Custom print options
      const options = {
        filename: 'test-report',
        printScaling: 'fit' as 'fit',
        silent: true,
        copies: 2
      };
      
      // Print report
      await exportService.printReport(mockReport, options);
      
      // Check that print-js was called with custom options
      expect(printJsMock).toHaveBeenCalledWith(expect.objectContaining({
        printable: 'blob:mock-url',
        type: 'pdf',
        showModal: true,
        silent: true,
        copies: 2
      }));
    });
  });
});
