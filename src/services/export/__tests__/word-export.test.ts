/**
 * Word Document Export Tests
 * 
 * Comprehensive tests for Word document export functionality
 */

import { ExportService } from '../export-service';
import { GeneratedReport } from '@/lib/report-drafting/types';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell } from 'docx';

// Mock file-saver
jest.mock('file-saver', () => ({
  saveAs: jest.fn()
}));

// Mock docx
jest.mock('docx', () => ({
  Document: jest.fn(() => ({
    addSection: jest.fn()
  })),
  Packer: {
    toBuffer: jest.fn(() => Buffer.from('mock word document')),
  },
  Paragraph: jest.fn(),
  TextRun: jest.fn(),
  HeadingLevel: {
    TITLE: 'title',
    HEADING_1: 'heading1',
    HEADING_2: 'heading2',
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
  WidthType: {
    PERCENTAGE: 'percentage',
    DXA: 'dxa',
  },
  Header: jest.fn(),
  Footer: jest.fn(),
  HorizontalPositionAlign: {
    CENTER: 'center',
  },
  HorizontalPositionRelativeFrom: {
    PAGE: 'page',
  },
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
  BookmarkType: {
    START: 'start',
    END: 'end',
  },
  TableOfContents: jest.fn(),
  SectionType: {
    NEXT_PAGE: 'nextPage',
  },
  LevelFormat: {
    DECIMAL: 'decimal',
  },
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

describe('Word Document Export', () => {
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
  
  describe('exportToWord', () => {
    it('creates a Word document with the correct structure', async () => {
      // Options for export
      const options = {
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
      
      // Execute the private method directly
      const method = exportService['exportToWord'].bind(exportService);
      const result = await method(mockReport, options);
      
      // Check that Document was constructed
      expect(Document).toHaveBeenCalled();
      
      // Check that Packer.toBuffer was called
      expect(Packer.toBuffer).toHaveBeenCalled();
      
      // Check that saveAs was called with the correct args
      expect(saveAs).toHaveBeenCalled();
      expect(saveAs.mock.calls[0][0]).toBeInstanceOf(Blob);
      expect(saveAs.mock.calls[0][1]).toBe('test-report.docx');
      
      // Check result
      expect(result.success).toBe(true);
      expect(result.message).toContain('successfully exported as Word document');
    });
    
    it('adds cover page when specified', async () => {
      // Options with cover page
      const options = {
        filename: 'test-report',
        includeCovers: true,
        useBranding: true,
        organizationName: 'Test Organization',
        organizationAddress: '123 Test St, Test City'
      };
      
      // Execute the private method directly
      const method = exportService['exportToWord'].bind(exportService);
      await method(mockReport, options);
      
      // Check that appropriate elements for cover page were created
      expect(Paragraph).toHaveBeenCalledWith(expect.objectContaining({
        heading: HeadingLevel.TITLE
      }));
      expect(TextRun).toHaveBeenCalledWith(expect.objectContaining({
        text: 'Test Assessment Report'
      }));
    });
    
    it('adds table of contents when specified', async () => {
      // Options with table of contents
      const options = {
        filename: 'test-report',
        includeTableOfContents: true
      };
      
      // Execute the private method directly
      const method = exportService['exportToWord'].bind(exportService);
      await method(mockReport, options);
      
      // Check for ToC title
      expect(Paragraph).toHaveBeenCalledWith(expect.objectContaining({
        text: 'Table of Contents'
      }));
    });
    
    it('creates a section for each report section', async () => {
      // Execute the private method directly
      const method = exportService['exportToWord'].bind(exportService);
      await method(mockReport, {
        filename: 'test-report'
      });
      
      // Check that each section was included
      mockReport.sections.forEach(section => {
        // Check for section title
        expect(Paragraph).toHaveBeenCalledWith(expect.objectContaining({
          heading: HeadingLevel.HEADING_1,
          text: section.title
        }));
        
        // Check for section content
        const contentLines = section.content.split('\n\n');
        contentLines.forEach(line => {
          expect(Paragraph).toHaveBeenCalledWith(expect.objectContaining({
            text: line
          }));
        });
      });
    });
    
    it('adds metadata table when includeMetadata is true', async () => {
      // Options with metadata
      const options = {
        filename: 'test-report',
        includeMetadata: true
      };
      
      // Execute the private method directly
      const method = exportService['exportToWord'].bind(exportService);
      await method(mockReport, options);
      
      // Check that a table was created for metadata
      expect(Table).toHaveBeenCalled();
      expect(TableRow).toHaveBeenCalled();
      expect(TableCell).toHaveBeenCalled();
      
      // Check for client name
      expect(TextRun).toHaveBeenCalledWith(expect.objectContaining({
        text: 'John Doe'
      }));
      
      // Check for author name
      expect(TextRun).toHaveBeenCalledWith(expect.objectContaining({
        text: 'Dr. Jane Smith'
      }));
      
      // Check for assessment date
      expect(TextRun).toHaveBeenCalledWith(expect.objectContaining({
        text: '2025-02-15'
      }));
    });
    
    it('adds headers and footers when specified', async () => {
      // Options with headers and footers
      const options = {
        filename: 'test-report',
        includeHeaders: true,
        includeFooters: true
      };
      
      // Execute the private method directly
      const method = exportService['exportToWord'].bind(exportService);
      await method(mockReport, options);
      
      // Check that headers and footers were added
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
      const result = await method(mockReport, {
        filename: 'test-report'
      });
      
      // Check error handling
      expect(result.success).toBe(false);
      expect(result.message).toContain('Document generation error');
    });
    
    it('applies custom page size and orientation', async () => {
      // Options with custom page settings
      const options = {
        filename: 'test-report',
        pageSize: 'a4' as 'a4',
        orientation: 'landscape' as 'landscape'
      };
      
      // Execute the private method directly
      const method = exportService['exportToWord'].bind(exportService);
      await method(mockReport, options);
      
      // Check that document was created with correct page settings
      expect(Document).toHaveBeenCalledWith(expect.objectContaining({
        sections: expect.arrayContaining([
          expect.objectContaining({
            properties: expect.objectContaining({
              page: expect.objectContaining({
                size: {
                  orientation: 'landscape'
                }
              })
            })
          })
        ])
      }));
    });
    
    it('applies custom margins when specified', async () => {
      // Options with custom margins
      const options = {
        filename: 'test-report',
        margins: { top: 15, right: 15, bottom: 15, left: 15 }
      };
      
      // Execute the private method directly
      const method = exportService['exportToWord'].bind(exportService);
      await method(mockReport, options);
      
      // Check that document was created with correct margin settings
      expect(Document).toHaveBeenCalledWith(expect.objectContaining({
        sections: expect.arrayContaining([
          expect.objectContaining({
            properties: expect.objectContaining({
              page: expect.objectContaining({
                margin: {
                  top: 15,
                  right: 15,
                  bottom: 15,
                  left: 15
                }
              })
            })
          })
        ])
      }));
    });
    
    it('adds signature line when specified', async () => {
      // Options with signature line
      const options = {
        filename: 'test-report',
        includeSignatureLine: true
      };
      
      // Execute the private method directly
      const method = exportService['exportToWord'].bind(exportService);
      await method(mockReport, options);
      
      // Check that signature line components were created
      expect(Paragraph).toHaveBeenCalledWith(expect.objectContaining({
        text: 'Signature:'
      }));
      
      // Check for signature line
      expect(Paragraph).toHaveBeenCalledWith(expect.objectContaining({
        border: expect.objectContaining({
          bottom: {
            style: 'single',
            size: 1
          }
        })
      }));
      
      // Check for date line
      expect(Paragraph).toHaveBeenCalledWith(expect.objectContaining({
        text: 'Date:'
      }));
    });
    
    it('properly handles paragraphs and line breaks in content', async () => {
      // Execute the private method directly
      const method = exportService['exportToWord'].bind(exportService);
      await method(mockReport, {
        filename: 'test-report'
      });
      
      // Test section has multiple paragraphs
      const testSection = mockReport.sections[0];
      const paragraphs = testSection.content.split('\n\n');
      
      // Check that each paragraph was created properly
      paragraphs.forEach(paragraph => {
        expect(Paragraph).toHaveBeenCalledWith(expect.objectContaining({
          text: paragraph
        }));
      });
    });
    
    it('includes customFields in metadata when available', async () => {
      // Options with metadata
      const options = {
        filename: 'test-report',
        includeMetadata: true
      };
      
      // Execute the private method directly
      const method = exportService['exportToWord'].bind(exportService);
      await method(mockReport, options);
      
      // Check for custom field values
      expect(TextRun).toHaveBeenCalledWith(expect.objectContaining({
        text: 'Dr. Johnson'
      }));
      expect(TextRun).toHaveBeenCalledWith(expect.objectContaining({
        text: 'ABC Insurance'
      }));
    });
  });
});
