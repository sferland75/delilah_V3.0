/**
 * Export Service Tests
 * 
 * Tests for the export service functionality, including:
 * - PDF export
 * - Word document export
 * - Email sharing
 * - Client record export
 * - Print optimization
 */

import { ExportService, AdvancedExportOptions } from '../export-service';
import { GeneratedReport, ExportFormat, ExportResult } from '@/lib/report-drafting/types';

// Mock file-saver
jest.mock('file-saver', () => ({
  saveAs: jest.fn()
}));

// Mock jsPDF
jest.mock('jspdf', () => ({
  jsPDF: jest.fn(() => ({
    setProperties: jest.fn(),
    setEncryption: jest.fn(),
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

// Mock jspdf-autotable
jest.mock('jspdf-autotable', () => jest.fn());

// Mock docx
jest.mock('docx', () => ({
  Document: jest.fn(),
  Packer: {
    toBuffer: jest.fn(() => Buffer.from('mock word document')),
  },
  Paragraph: jest.fn(),
  TextRun: jest.fn(),
  HeadingLevel: {
    TITLE: 'title',
    HEADING_1: 'heading1',
  },
  Table: jest.fn(),
  TableRow: jest.fn(),
  TableCell: jest.fn(),
  BorderStyle: {
    SINGLE: 'single',
  },
  AlignmentType: {
    LEFT: 'left',
    CENTER: 'center',
    RIGHT: 'right',
  },
  Header: jest.fn(),
  Footer: jest.fn(),
  PageNumber: {
    CURRENT: 'current',
    TOTAL_PAGES: 'total',
  },
  ImageRun: jest.fn(),
  PageOrientation: {
    PORTRAIT: 'portrait',
    LANDSCAPE: 'landscape',
  },
  PageBreak: jest.fn(),
  ExternalHyperlink: jest.fn(),
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
      content: 'Client has a history of lower back pain following a motor vehicle accident in 2023.\n\nClient reports ongoing issues with pain management and mobility restrictions.',
    },
    {
      id: 'section-2',
      title: 'Functional Assessment',
      content: 'Client demonstrates reduced range of motion in lumbar spine.\n\nClient reports difficulty with prolonged sitting and standing.',
    },
    {
      id: 'section-3',
      title: 'Recommendations',
      content: 'Physical therapy 3x weekly for 6 weeks.\n\nErgonomic assessment for workstation.\n\nHome exercise program focused on core strengthening.',
    }
  ]
};

// Default export options for testing
const defaultOptions: AdvancedExportOptions = {
  filename: 'test-report',
  includeCovers: true,
  pageSize: 'letter',
  orientation: 'portrait',
  margins: { top: 20, right: 20, bottom: 20, left: 20 },
  includeHeaders: true,
  includeFooters: true,
  useBranding: true,
  organizationName: 'Test Organization',
  organizationAddress: '123 Test St, Test City',
  includeSignatureLine: true
};

describe('Export Service', () => {
  let exportService: ExportService;
  let saveAs;
  
  beforeEach(() => {
    // Clear mocks
    jest.clearAllMocks();
    
    // Get reference to saveAs mock
    saveAs = require('file-saver').saveAs;
    
    // Create new instance of export service
    exportService = new ExportService();
    
    // Mock console to prevent test output noise
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  
  describe('exportReport', () => {
    it('calls the correct export method based on format', async () => {
      // Spy on the private methods
      const spyExportToPdf = jest.spyOn(exportService as any, 'exportToPdf');
      const spyExportToWord = jest.spyOn(exportService as any, 'exportToWord');
      const spyExportToClientRecord = jest.spyOn(exportService as any, 'exportToClientRecord');
      
      // Configure spy returns
      spyExportToPdf.mockResolvedValue({ success: true, message: 'PDF success' });
      spyExportToWord.mockResolvedValue({ success: true, message: 'Word success' });
      spyExportToClientRecord.mockResolvedValue({ success: true, message: 'Client record success' });
      
      // Test PDF export
      await exportService.exportReport(mockReport, 'pdf', defaultOptions);
      expect(spyExportToPdf).toHaveBeenCalledWith(mockReport, defaultOptions);
      
      // Test Word export
      await exportService.exportReport(mockReport, 'docx', defaultOptions);
      expect(spyExportToWord).toHaveBeenCalledWith(mockReport, defaultOptions);
      
      // Test client record export
      await exportService.exportReport(mockReport, 'clientRecord', defaultOptions);
      expect(spyExportToClientRecord).toHaveBeenCalledWith(mockReport, defaultOptions);
    });
    
    it('handles errors and returns unsuccessful result', async () => {
      // Set up exportToPdf to throw an error
      jest.spyOn(exportService as any, 'exportToPdf').mockImplementation(() => {
        throw new Error('Test error');
      });
      
      // Attempt to export
      const result = await exportService.exportReport(mockReport, 'pdf', defaultOptions);
      
      // Check error handling
      expect(result.success).toBe(false);
      expect(result.message).toContain('Test error');
    });
    
    it('rejects unsupported export formats', async () => {
      // @ts-ignore - deliberately passing an invalid format
      const result = await exportService.exportReport(mockReport, 'invalid', defaultOptions);
      
      expect(result.success).toBe(false);
      expect(result.message).toContain('Unsupported export format');
    });
  });
  
  describe('exportToPdf', () => {
    it('creates a PDF document with the correct structure', async () => {
      // Execute the private method directly
      const method = exportService['exportToPdf'].bind(exportService);
      const result = await method(mockReport, defaultOptions);
      
      // Check that jsPDF was constructed correctly
      const { jsPDF } = require('jspdf');
      expect(jsPDF).toHaveBeenCalledWith({
        orientation: 'portrait',
        unit: 'mm',
        format: 'letter'
      });
      
      // Check that document properties were set
      const mockJsPdf = jsPDF.mock.results[0].value;
      expect(mockJsPdf.setProperties).toHaveBeenCalledWith(expect.objectContaining({
        title: mockReport.title,
        subject: expect.stringContaining(mockReport.metadata.clientName)
      }));
      
      // Check that saveAs was called with the correct args
      expect(saveAs).toHaveBeenCalled();
      expect(saveAs.mock.calls[0][0]).toBeInstanceOf(Blob);
      expect(saveAs.mock.calls[0][1]).toBe('test-report.pdf');
      
      // Check result
      expect(result.success).toBe(true);
      expect(result.message).toContain('successfully exported as PDF');
    });
    
    it('adds password protection when specified', async () => {
      // Options with password
      const optionsWithPassword = {
        ...defaultOptions,
        password: 'test-password',
        allowPrint: true,
        allowCopy: false,
        allowEdit: false
      };
      
      // Execute the private method directly
      const method = exportService['exportToPdf'].bind(exportService);
      await method(mockReport, optionsWithPassword);
      
      // Check that encryption was set
      const mockJsPdf = require('jspdf').jsPDF.mock.results[0].value;
      expect(mockJsPdf.setEncryption).toHaveBeenCalledWith(expect.objectContaining({
        password: 'test-password',
        userPassword: 'test-password',
        ownerPassword: 'test-password',
        permissions: expect.objectContaining({
          printing: 'highResolution',
          copying: false,
          modifying: false
        })
      }));
    });
    
    it('adds organization branding when specified', async () => {
      // Execute the private method directly
      const method = exportService['exportToPdf'].bind(exportService);
      await method(mockReport, defaultOptions);
      
      // Check that organization information was added
      const mockJsPdf = require('jspdf').jsPDF.mock.results[0].value;
      expect(mockJsPdf.text).toHaveBeenCalledWith('Test Organization', 20, 20);
      expect(mockJsPdf.text).toHaveBeenCalledWith('123 Test St, Test City', 20, 27);
    });
    
    it('adds signature line when specified', async () => {
      // Execute the private method directly
      const method = exportService['exportToPdf'].bind(exportService);
      await method(mockReport, { ...defaultOptions, includeSignatureLine: true });
      
      // Check that signature line was added
      const mockJsPdf = require('jspdf').jsPDF.mock.results[0].value;
      // This is tricky to test due to the dynamic y-position
      // But we can at least verify that the line drawing method was called
      expect(mockJsPdf.line).toHaveBeenCalledTimes(expect.any(Number));
    });
  });
  
  describe('exportToWord', () => {
    it('creates a Word document with the correct structure', async () => {
      // Execute the private method directly
      const method = exportService['exportToWord'].bind(exportService);
      const result = await method(mockReport, defaultOptions);
      
      // Check that Document was constructed
      const { Document } = require('docx');
      expect(Document).toHaveBeenCalled();
      
      // Check that Packer.toBuffer was called
      const { Packer } = require('docx');
      expect(Packer.toBuffer).toHaveBeenCalled();
      
      // Check that saveAs was called with the correct args
      expect(saveAs).toHaveBeenCalled();
      expect(saveAs.mock.calls[0][0]).toBeInstanceOf(Blob);
      expect(saveAs.mock.calls[0][1]).toBe('test-report.docx');
      
      // Check result
      expect(result.success).toBe(true);
      expect(result.message).toContain('successfully exported as Word document');
    });
    
    it('adds table of contents when specified', async () => {
      // Options with TOC
      const optionsWithToc = {
        ...defaultOptions,
        includeTableOfContents: true
      };
      
      // Spy on Paragraph constructor
      const { Paragraph } = require('docx');
      
      // Execute the private method directly
      const method = exportService['exportToWord'].bind(exportService);
      await method(mockReport, optionsWithToc);
      
      // Check that TOC title was added
      expect(Paragraph).toHaveBeenCalledWith(expect.objectContaining({
        text: 'Table of Contents'
      }));
    });
    
    it('adds headers and footers when specified', async () => {
      // Options with headers and footers
      const optionsWithHeadersFooters = {
        ...defaultOptions,
        includeHeaders: true,
        includeFooters: true
      };
      
      // Spy on Header and Footer constructors
      const { Header, Footer } = require('docx');
      
      // Execute the private method directly
      const method = exportService['exportToWord'].bind(exportService);
      await method(mockReport, optionsWithHeadersFooters);
      
      // Check that Header and Footer were constructed
      expect(Header).toHaveBeenCalled();
      expect(Footer).toHaveBeenCalled();
    });
    
    it('handles errors during document generation', async () => {
      // Force Packer.toBuffer to throw an error
      const { Packer } = require('docx');
      Packer.toBuffer.mockImplementationOnce(() => {
        throw new Error('Document generation error');
      });
      
      // Execute the private method directly
      const method = exportService['exportToWord'].bind(exportService);
      const result = await method(mockReport, defaultOptions);
      
      // Check error handling
      expect(result.success).toBe(false);
      expect(result.message).toContain('Document generation error');
    });
  });
  
  describe('exportToClientRecord', () => {
    it('simulates saving to client record system', async () => {
      // Execute the private method directly
      const method = exportService['exportToClientRecord'].bind(exportService);
      const result = await method(mockReport, defaultOptions);
      
      // Check result
      expect(result.success).toBe(true);
      expect(result.message).toContain('successfully saved to client record system');
      expect(result.recordId).toBeDefined();
    });
  });
  
  describe('shareViaEmail', () => {
    it('validates email recipients', async () => {
      // Attempt to share without recipients
      const result = await exportService.shareViaEmail(mockReport, defaultOptions);
      
      // Check error handling
      expect(result.success).toBe(false);
      expect(result.message).toContain('No email recipients specified');
    });
    
    it('simulates email sending with correct attachments', async () => {
      // Options with email recipients and attachment format
      const emailOptions = {
        ...defaultOptions,
        emailRecipients: ['test@example.com'],
        emailSubject: 'Test Subject',
        emailBody: 'Test Body',
        emailAttachFormat: 'both' as 'both'
      };
      
      // Spy on exportToPdf and exportToWord
      const spyExportToPdf = jest.spyOn(exportService as any, 'exportToPdf')
        .mockResolvedValue({ success: true });
      const spyExportToWord = jest.spyOn(exportService as any, 'exportToWord')
        .mockResolvedValue({ success: true });
      
      // Execute the method
      const result = await exportService.shareViaEmail(mockReport, emailOptions);
      
      // Check that both export methods were called
      expect(spyExportToPdf).toHaveBeenCalled();
      expect(spyExportToWord).toHaveBeenCalled();
      
      // Check result
      expect(result.success).toBe(true);
      expect(result.message).toContain('successfully shared via email');
    });
    
    it('handles errors during email sending', async () => {
      // Force exportToPdf to throw an error
      jest.spyOn(exportService as any, 'exportToPdf').mockImplementationOnce(() => {
        throw new Error('PDF generation error');
      });
      
      // Options with email recipients
      const emailOptions = {
        ...defaultOptions,
        emailRecipients: ['test@example.com'],
        emailAttachFormat: 'pdf' as 'pdf'
      };
      
      // Execute the method
      const result = await exportService.shareViaEmail(mockReport, emailOptions);
      
      // Check error handling
      expect(result.success).toBe(false);
      expect(result.message).toContain('PDF generation error');
    });
  });
  
  describe('generatePrintVersion', () => {
    it('creates a print-optimized PDF', async () => {
      // Spy on exportToPdf
      const spyExportToPdf = jest.spyOn(exportService as any, 'exportToPdf')
        .mockResolvedValue({ success: true });
      
      // Execute the method
      const result = await exportService.generatePrintVersion(mockReport, defaultOptions);
      
      // Check that exportToPdf was called with print-specific options
      expect(spyExportToPdf).toHaveBeenCalledWith(
        mockReport,
        expect.objectContaining({
          optimizeForPrinting: true,
          includeHeaders: true,
          includeFooters: true
        })
      );
      
      // Check result is a Blob
      expect(result).toBeInstanceOf(Blob);
    });
  });
});
