/**
 * Export Service for Delilah V3.0
 * 
 * This service handles the export functionality for reports, including:
 * - PDF export with customizable options
 * - Word document export with formatting
 * - Email sharing integration
 * - Print optimization
 */

import { saveAs } from 'file-saver';
import { 
  GeneratedReport, 
  ExportOptions, 
  ExportFormat, 
  ExportResult 
} from '@/lib/report-drafting/types';

// Import PDF generation libraries
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Import Word document generation libraries
import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  HeadingLevel, 
  Table, 
  TableRow, 
  TableCell, 
  BorderStyle,
  AlignmentType,
  Header,
  Footer,
  PageNumber,
  ImageRun,
  PageOrientation,
  PageBreak,
  ExternalHyperlink
} from 'docx';

// Define expanded export options
export interface AdvancedExportOptions extends ExportOptions {
  // PDF-specific options
  pageSize?: 'letter' | 'a4' | 'legal';
  orientation?: 'portrait' | 'landscape';
  margins?: { top: number; right: number; bottom: number; left: number };
  
  // Word-specific options
  useStyles?: boolean;
  includeTableOfContents?: boolean;
  documentTemplate?: string;
  
  // Email-specific options
  emailRecipients?: string[];
  emailSubject?: string;
  emailBody?: string;
  emailAttachFormat?: 'pdf' | 'docx' | 'both';
  
  // Print options
  optimizeForPrinting?: boolean;
  
  // Security options
  password?: string;
  allowCopy?: boolean;
  allowPrint?: boolean;
  allowEdit?: boolean;
  
  // Organization branding
  useBranding?: boolean;
  logoUrl?: string;
  organizationName?: string;
  organizationAddress?: string;
  organizationContact?: string;
  
  // Content options
  includeAppendices?: boolean;
  includeSummaryPage?: boolean;
  includeImages?: boolean;
  includeSignatureLine?: boolean;
  signatureImageUrl?: string;
}

/**
 * Export Service class for handling report exports
 */
export class ExportService {
  
  /**
   * Export a report to the specified format with advanced options
   */
  public async exportReport(
    report: GeneratedReport,
    format: ExportFormat,
    options: AdvancedExportOptions
  ): Promise<ExportResult> {
    try {
      switch (format) {
        case 'pdf':
          return await this.exportToPdf(report, options);
        case 'docx':
          return await this.exportToWord(report, options);
        case 'clientRecord':
          return await this.exportToClientRecord(report, options);
        default:
          throw new Error(`Unsupported export format: ${format}`);
      }
    } catch (error) {
      console.error('Error exporting report:', error);
      return {
        success: false,
        message: `Failed to export report: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
  
  /**
   * Export a report to PDF format
   */
  private async exportToPdf(
    report: GeneratedReport,
    options: AdvancedExportOptions
  ): Promise<ExportResult> {
    // Create a new PDF document
    const orientation = options.orientation || 'portrait';
    const pageSize = options.pageSize || 'letter';
    
    const doc = new jsPDF({
      orientation: orientation,
      unit: 'mm',
      format: pageSize
    });
    
    // Set document properties
    doc.setProperties({
      title: report.title,
      subject: `Assessment report for ${report.metadata.clientName}`,
      author: report.metadata.authorName || 'Delilah Assessment System',
      keywords: 'assessment, report, rehabilitation',
      creator: 'Delilah V3.0'
    });
    
    // Add protection if password is provided
    if (options.password) {
      doc.setEncryption({
        password: options.password,
        userPassword: options.password,
        ownerPassword: options.password,
        permissions: {
          printing: options.allowPrint !== false ? 'highResolution' : 'none',
          modifying: Boolean(options.allowEdit),
          copying: Boolean(options.allowCopy),
          annotating: Boolean(options.allowEdit),
          fillingForms: Boolean(options.allowEdit),
          contentAccessibility: true,
          documentAssembly: Boolean(options.allowEdit)
        }
      });
    }
    
    // Add header with logo if branding is enabled
    if (options.useBranding && options.logoUrl) {
      try {
        // In a real implementation, we would load the logo
        // For now, use a placeholder approach
        doc.setFontSize(18);
        doc.text(options.organizationName || 'Organization', 20, 20);
        
        if (options.organizationAddress) {
          doc.setFontSize(10);
          doc.text(options.organizationAddress, 20, 27);
        }
        
        // Add a line under the header
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.5);
        doc.line(20, 30, 190, 30);
      } catch (error) {
        console.warn('Failed to add logo to PDF:', error);
      }
    }
    
    // Add title
    doc.setFontSize(16);
    doc.text(report.title, 20, options.useBranding ? 40 : 20);
    
    // Add metadata
    doc.setFontSize(11);
    doc.text(`Client: ${report.metadata.clientName}`, 20, options.useBranding ? 50 : 30);
    doc.text(`Date: ${new Date(report.createdAt).toLocaleDateString()}`, 20, options.useBranding ? 55 : 35);
    doc.text(`Author: ${report.metadata.authorName}`, 20, options.useBranding ? 60 : 40);
    
    // Add a line before content
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(20, options.useBranding ? 65 : 45, 190, options.useBranding ? 65 : 45);
    
    let yPosition = options.useBranding ? 75 : 55;
    
    // Add each section
    for (const section of report.sections) {
      // Check if we need a page break
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Add section title
      doc.setFontSize(14);
      doc.text(section.title, 20, yPosition);
      yPosition += 8;
      
      // Add section content - this is a simplified approach
      // In a real implementation, we'd need to properly format the content
      doc.setFontSize(11);
      
      // Split content into paragraphs and add them
      const paragraphs = section.content.split('\n\n');
      for (const paragraph of paragraphs) {
        // Handle page breaks
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        
        // Use splitTextToSize to handle text wrapping
        const textLines = doc.splitTextToSize(paragraph, 170);
        doc.text(textLines, 20, yPosition);
        
        // Update y position based on number of lines
        yPosition += 7 * textLines.length;
      }
      
      // Add some space after section
      yPosition += 15;
    }
    
    // Add signature line if requested
    if (options.includeSignatureLine) {
      // Check if we need a page break
      if (yPosition > 230) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setLineWidth(0.5);
      doc.line(20, yPosition + 20, 100, yPosition + 20);
      doc.text(`${report.metadata.authorName}`, 20, yPosition + 30);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 120, yPosition + 30);
    }
    
    // Save the PDF
    const filename = options.filename || `${report.title.replace(/\s+/g, '_')}.pdf`;
    const pdfBlob = doc.output('blob');
    saveAs(pdfBlob, filename);
    
    return {
      success: true,
      message: `Report successfully exported as PDF: ${filename}`,
    };
  }
  
  /**
   * Export a report to Word document format
   */
  private async exportToWord(
    report: GeneratedReport,
    options: AdvancedExportOptions
  ): Promise<ExportResult> {
    try {
      // Create document sections
      const sections = [];
      
      // Add title and metadata
      sections.push(
        new Paragraph({
          text: report.title,
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 }
        })
      );
      
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: "Client: ", bold: true }),
            new TextRun(report.metadata.clientName || "Unknown"),
          ],
          spacing: { after: 100 }
        })
      );
      
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: "Date: ", bold: true }),
            new TextRun(new Date(report.createdAt).toLocaleDateString()),
          ],
          spacing: { after: 100 }
        })
      );
      
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: "Author: ", bold: true }),
            new TextRun(report.metadata.authorName || "Unknown"),
          ],
          spacing: { after: 200 }
        })
      );
      
      // Add table of contents if requested
      if (options.includeTableOfContents) {
        sections.push(
          new Paragraph({
            text: "Table of Contents",
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 200 }
          })
        );
        
        // In a real implementation, we would use Word's TOC field
        // For now, create a simple list of sections
        for (const section of report.sections) {
          sections.push(
            new Paragraph({
              text: section.title,
              spacing: { after: 100 }
            })
          );
        }
        
        // Add page break after TOC
        sections.push(new Paragraph({ text: "", pageBreakBefore: true }));
      }
      
      // Add each report section
      for (const section of report.sections) {
        // Add section title
        sections.push(
          new Paragraph({
            text: section.title,
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          })
        );
        
        // Format section content
        const paragraphs = section.content.split('\n\n');
        for (const paragraph of paragraphs) {
          sections.push(
            new Paragraph({
              text: paragraph,
              spacing: { after: 200 }
            })
          );
        }
        
        // Add a section break if not the last section
        if (section !== report.sections[report.sections.length - 1]) {
          sections.push(new Paragraph({ text: "", pageBreakBefore: true }));
        }
      }
      
      // Add signature line if requested
      if (options.includeSignatureLine) {
        sections.push(
          new Paragraph({
            text: "",
            spacing: { before: 400 }
          })
        );
        
        sections.push(
          new Paragraph({
            text: "_______________________________",
            spacing: { after: 100 }
          })
        );
        
        sections.push(
          new Paragraph({
            text: report.metadata.authorName || "Signature",
            spacing: { after: 100 }
          })
        );
        
        sections.push(
          new Paragraph({
            text: `Date: ${new Date().toLocaleDateString()}`,
            spacing: { after: 100 }
          })
        );
      }
      
      // Create headers and footers if requested
      const headers = {};
      const footers = {};
      
      if (options.includeHeaders) {
        headers.default = new Header({
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: options.organizationName || "Delilah Assessment System", bold: true }),
              ],
              alignment: AlignmentType.RIGHT
            })
          ]
        });
      }
      
      if (options.includeFooters) {
        footers.default = new Footer({
          children: [
            new Paragraph({
              children: [
                new TextRun("Page "),
                new TextRun({ children: [PageNumber.CURRENT] }),
                new TextRun(" of "),
                new TextRun({ children: [PageNumber.TOTAL_PAGES] }),
              ],
              alignment: AlignmentType.CENTER
            })
          ]
        });
      }
      
      // Create the Word document
      const doc = new Document({
        sections: [
          {
            properties: {
              page: {
                size: {
                  width: options.orientation === 'landscape' ? 14210 : 8510,
                  height: options.orientation === 'landscape' ? 8510 : 11090,
                },
                margin: {
                  top: options.margins?.top || 1440,
                  right: options.margins?.right || 1440,
                  bottom: options.margins?.bottom || 1440,
                  left: options.margins?.left || 1440,
                }
              },
            },
            headers: options.includeHeaders ? headers : undefined,
            footers: options.includeFooters ? footers : undefined,
            children: sections,
          },
        ],
      });
      
      // Generate the Word document as a Blob
      const buffer = await Packer.toBuffer(doc);
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      
      // Save the file
      const filename = options.filename || `${report.title.replace(/\s+/g, '_')}.docx`;
      saveAs(blob, filename);
      
      return {
        success: true,
        message: `Report successfully exported as Word document: ${filename}`,
      };
    } catch (error) {
      console.error('Error exporting to Word:', error);
      return {
        success: false,
        message: `Failed to export to Word: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
  
  /**
   * Export a report to the client record system
   */
  private async exportToClientRecord(
    report: GeneratedReport,
    options: AdvancedExportOptions
  ): Promise<ExportResult> {
    try {
      // In a real implementation, this would integrate with the client record system
      // For now, simulate a successful API call
      
      // Construct the report data to send to the client record system
      const reportData = {
        reportTitle: report.title,
        clientId: report.metadata.clientId,
        clientName: report.metadata.clientName,
        authorId: report.metadata.authorId,
        authorName: report.metadata.authorName,
        createdDate: report.createdAt,
        organizationId: report.metadata.organizationId,
        content: report.sections.map(section => ({
          title: section.title,
          content: section.content
        })),
        metadata: {
          assessmentDate: report.metadata.assessmentDate,
          ...report.metadata.customFields
        }
      };
      
      // Simulate API call to client record system
      console.log('Sending report to client record system:', reportData);
      
      // Generate a fake record ID
      const recordId = `record-${Date.now()}`;
      
      return {
        success: true,
        message: 'Report successfully saved to client record system',
        recordId
      };
    } catch (error) {
      console.error('Error exporting to client record:', error);
      return {
        success: false,
        message: `Failed to export to client record: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
  
  /**
   * Share the report via email
   */
  public async shareViaEmail(
    report: GeneratedReport,
    options: AdvancedExportOptions
  ): Promise<ExportResult> {
    try {
      if (!options.emailRecipients || options.emailRecipients.length === 0) {
        throw new Error('No email recipients specified');
      }
      
      // In a real implementation, this would integrate with an email service
      // For now, simulate a successful email send
      
      console.log('Sending email to:', options.emailRecipients);
      console.log('Subject:', options.emailSubject || report.title);
      console.log('Body:', options.emailBody || 'Please find the attached assessment report.');
      
      // Generate attachments if requested
      if (options.emailAttachFormat === 'pdf' || options.emailAttachFormat === 'both') {
        await this.exportToPdf(report, options);
      }
      
      if (options.emailAttachFormat === 'docx' || options.emailAttachFormat === 'both') {
        await this.exportToWord(report, options);
      }
      
      return {
        success: true,
        message: `Report successfully shared via email to ${options.emailRecipients.join(', ')}`
      };
    } catch (error) {
      console.error('Error sharing via email:', error);
      return {
        success: false,
        message: `Failed to share via email: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
  
  /**
   * Generate a print-optimized version of the report
   */
  public async generatePrintVersion(
    report: GeneratedReport,
    options: AdvancedExportOptions
  ): Promise<Blob> {
    // For print optimization, we'll use the PDF export with specific settings
    const printOptions: AdvancedExportOptions = {
      ...options,
      optimizeForPrinting: true,
      // Set margins appropriate for printing
      margins: { top: 25, right: 25, bottom: 25, left: 25 },
      // Include headers and footers
      includeHeaders: true,
      includeFooters: true,
      // Use organization branding if available
      useBranding: options.useBranding ?? true
    };
    
    // Generate a PDF optimized for printing
    await this.exportToPdf(report, printOptions);
    
    // In a real implementation, we would return the actual PDF blob
    // For now, create a placeholder blob
    return new Blob(['Print version placeholder'], { type: 'application/pdf' });
  }
}

// Export a singleton instance
export const exportService = new ExportService();
