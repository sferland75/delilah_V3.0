/**
 * Email Sharing Tests
 * 
 * Tests for the email sharing functionality in the export service
 */

import { ExportService } from '../export-service';
import { GeneratedReport } from '@/lib/report-drafting/types';

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
      content: 'Client has a history of lower back pain following a motor vehicle accident in 2023.',
    },
    {
      id: 'section-2',
      title: 'Functional Assessment',
      content: 'Client demonstrates reduced range of motion in lumbar spine.',
    }
  ]
};

describe('Email Sharing Functionality', () => {
  let exportService: ExportService;
  
  beforeEach(() => {
    // Clear mocks
    jest.clearAllMocks();
    
    // Create new instance of export service
    exportService = new ExportService();
    
    // Mock console to prevent test output noise
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  
  describe('shareViaEmail', () => {
    it('validates email recipients before sending', async () => {
      // Options without recipients
      const options = {
        filename: 'test-report',
        emailSubject: 'Test Subject',
        emailBody: 'Test Body',
        emailAttachFormat: 'pdf' as 'pdf'
      };
      
      // Attempt to share via email without recipients
      const result = await exportService.shareViaEmail(mockReport, options);
      
      // Check error handling
      expect(result.success).toBe(false);
      expect(result.message).toContain('No email recipients specified');
    });
    
    it('validates email recipient format', async () => {
      // Options with invalid recipient format
      const options = {
        filename: 'test-report',
        emailRecipients: ['invalid-email'],
        emailSubject: 'Test Subject',
        emailBody: 'Test Body',
        emailAttachFormat: 'pdf' as 'pdf'
      };
      
      // Attempt to share via email with invalid recipient
      const result = await exportService.shareViaEmail(mockReport, options);
      
      // Check error handling
      expect(result.success).toBe(false);
      expect(result.message).toContain('Invalid email format');
    });
    
    it('attaches PDF document when specified', async () => {
      // Spy on PDF export method
      const spyExportToPdf = jest.spyOn(exportService as any, 'exportToPdf')
        .mockResolvedValue({ success: true });
      
      // Options with PDF attachment
      const options = {
        filename: 'test-report',
        emailRecipients: ['test@example.com'],
        emailSubject: 'Test Subject',
        emailBody: 'Test Body',
        emailAttachFormat: 'pdf' as 'pdf'
      };
      
      // Share via email
      const result = await exportService.shareViaEmail(mockReport, options);
      
      // Check that PDF export was called
      expect(spyExportToPdf).toHaveBeenCalled();
      
      // Check result
      expect(result.success).toBe(true);
      expect(result.message).toContain('successfully shared via email');
      expect(result.recipients).toEqual(['test@example.com']);
    });
    
    it('attaches Word document when specified', async () => {
      // Spy on Word export method
      const spyExportToWord = jest.spyOn(exportService as any, 'exportToWord')
        .mockResolvedValue({ success: true });
      
      // Options with Word attachment
      const options = {
        filename: 'test-report',
        emailRecipients: ['test@example.com'],
        emailSubject: 'Test Subject',
        emailBody: 'Test Body',
        emailAttachFormat: 'docx' as 'docx'
      };
      
      // Share via email
      const result = await exportService.shareViaEmail(mockReport, options);
      
      // Check that Word export was called
      expect(spyExportToWord).toHaveBeenCalled();
      
      // Check result
      expect(result.success).toBe(true);
      expect(result.message).toContain('successfully shared via email');
    });
    
    it('attaches both PDF and Word documents when specified', async () => {
      // Spy on export methods
      const spyExportToPdf = jest.spyOn(exportService as any, 'exportToPdf')
        .mockResolvedValue({ success: true });
      const spyExportToWord = jest.spyOn(exportService as any, 'exportToWord')
        .mockResolvedValue({ success: true });
      
      // Options with both attachment types
      const options = {
        filename: 'test-report',
        emailRecipients: ['test@example.com'],
        emailSubject: 'Test Subject',
        emailBody: 'Test Body',
        emailAttachFormat: 'both' as 'both'
      };
      
      // Share via email
      const result = await exportService.shareViaEmail(mockReport, options);
      
      // Check that both export methods were called
      expect(spyExportToPdf).toHaveBeenCalled();
      expect(spyExportToWord).toHaveBeenCalled();
      
      // Check result
      expect(result.success).toBe(true);
      expect(result.message).toContain('successfully shared via email');
    });
    
    it('handles errors during PDF generation', async () => {
      // Force PDF export to fail
      jest.spyOn(exportService as any, 'exportToPdf').mockImplementation(() => {
        throw new Error('PDF generation error');
      });
      
      // Options with PDF attachment
      const options = {
        filename: 'test-report',
        emailRecipients: ['test@example.com'],
        emailSubject: 'Test Subject',
        emailBody: 'Test Body',
        emailAttachFormat: 'pdf' as 'pdf'
      };
      
      // Share via email
      const result = await exportService.shareViaEmail(mockReport, options);
      
      // Check error handling
      expect(result.success).toBe(false);
      expect(result.message).toContain('PDF generation error');
    });
    
    it('handles errors during Word document generation', async () => {
      // Force Word export to fail
      jest.spyOn(exportService as any, 'exportToWord').mockImplementation(() => {
        throw new Error('Word generation error');
      });
      
      // Options with Word attachment
      const options = {
        filename: 'test-report',
        emailRecipients: ['test@example.com'],
        emailSubject: 'Test Subject',
        emailBody: 'Test Body',
        emailAttachFormat: 'docx' as 'docx'
      };
      
      // Share via email
      const result = await exportService.shareViaEmail(mockReport, options);
      
      // Check error handling
      expect(result.success).toBe(false);
      expect(result.message).toContain('Word generation error');
    });
    
    it('handles multiple recipients', async () => {
      // Spy on PDF export method
      const spyExportToPdf = jest.spyOn(exportService as any, 'exportToPdf')
        .mockResolvedValue({ success: true });
      
      // Options with multiple recipients
      const options = {
        filename: 'test-report',
        emailRecipients: ['test1@example.com', 'test2@example.com', 'test3@example.com'],
        emailSubject: 'Test Subject',
        emailBody: 'Test Body',
        emailAttachFormat: 'pdf' as 'pdf'
      };
      
      // Share via email
      const result = await exportService.shareViaEmail(mockReport, options);
      
      // Check result
      expect(result.success).toBe(true);
      expect(result.message).toContain('successfully shared via email');
      expect(result.recipients).toHaveLength(3);
      expect(result.recipients).toContain('test1@example.com');
      expect(result.recipients).toContain('test2@example.com');
      expect(result.recipients).toContain('test3@example.com');
    });
    
    it('includes report metadata in email subject when no subject provided', async () => {
      // Spy on PDF export method
      const spyExportToPdf = jest.spyOn(exportService as any, 'exportToPdf')
        .mockResolvedValue({ success: true });
      
      // Options without subject
      const options = {
        filename: 'test-report',
        emailRecipients: ['test@example.com'],
        emailBody: 'Test Body',
        emailAttachFormat: 'pdf' as 'pdf'
      };
      
      // Share via email
      const result = await exportService.shareViaEmail(mockReport, options);
      
      // Check result
      expect(result.success).toBe(true);
      expect(result.subject).toContain('Test Assessment Report');
      expect(result.subject).toContain('John Doe');
    });
    
    it('uses provided email subject when available', async () => {
      // Spy on PDF export method
      const spyExportToPdf = jest.spyOn(exportService as any, 'exportToPdf')
        .mockResolvedValue({ success: true });
      
      // Options with custom subject
      const options = {
        filename: 'test-report',
        emailRecipients: ['test@example.com'],
        emailSubject: 'Custom Subject Line',
        emailBody: 'Test Body',
        emailAttachFormat: 'pdf' as 'pdf'
      };
      
      // Share via email
      const result = await exportService.shareViaEmail(mockReport, options);
      
      // Check result
      expect(result.success).toBe(true);
      expect(result.subject).toBe('Custom Subject Line');
    });
    
    it('includes default message body when none provided', async () => {
      // Spy on PDF export method
      const spyExportToPdf = jest.spyOn(exportService as any, 'exportToPdf')
        .mockResolvedValue({ success: true });
      
      // Options without body
      const options = {
        filename: 'test-report',
        emailRecipients: ['test@example.com'],
        emailSubject: 'Test Subject',
        emailAttachFormat: 'pdf' as 'pdf'
      };
      
      // Share via email
      const result = await exportService.shareViaEmail(mockReport, options);
      
      // Check result
      expect(result.success).toBe(true);
      expect(result.body).toContain('Please find attached');
      expect(result.body).toContain('assessment report');
    });
  });
});
