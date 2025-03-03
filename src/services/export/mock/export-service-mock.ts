/**
 * Mock Export Service for Delilah V3.0
 * 
 * This is a simplified version of the export service that doesn't rely on external libraries
 * that might cause compatibility issues. It can be used during development and testing.
 */

import { 
  GeneratedReport, 
  ExportOptions, 
  ExportFormat, 
  ExportResult 
} from '@/lib/report-drafting/types';

// Define expanded export options
export interface AdvancedExportOptions extends ExportOptions {
  pageSize?: 'letter' | 'a4' | 'legal';
  orientation?: 'portrait' | 'landscape';
  margins?: { top: number; right: number; bottom: number; left: number };
  useStyles?: boolean;
  includeTableOfContents?: boolean;
  documentTemplate?: string;
  emailRecipients?: string[];
  emailSubject?: string;
  emailBody?: string;
  emailAttachFormat?: 'pdf' | 'docx' | 'both';
  optimizeForPrinting?: boolean;
  password?: string;
  allowCopy?: boolean;
  allowPrint?: boolean;
  allowEdit?: boolean;
  useBranding?: boolean;
  logoUrl?: string;
  organizationName?: string;
  organizationAddress?: string;
  organizationContact?: string;
  includeAppendices?: boolean;
  includeSummaryPage?: boolean;
  includeImages?: boolean;
  includeSignatureLine?: boolean;
  signatureImageUrl?: string;
}

/**
 * Mock Export Service class for handling report exports during development
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
      console.log(`[MOCK] Exporting report in ${format} format:`, {
        reportTitle: report.title,
        options
      });
      
      // Simply log what would happen and return a success result
      switch (format) {
        case 'pdf':
          return this.mockExportToPdf(report, options);
        case 'docx':
          return this.mockExportToWord(report, options);
        case 'clientRecord':
          return this.mockExportToClientRecord(report, options);
        default:
          throw new Error(`Unsupported export format: ${format}`);
      }
    } catch (error) {
      console.error('[MOCK] Error exporting report:', error);
      return {
        success: false,
        message: `Failed to export report: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
  
  /**
   * Mock PDF export
   */
  private mockExportToPdf(
    report: GeneratedReport,
    options: AdvancedExportOptions
  ): ExportResult {
    console.log('[MOCK] Generating PDF with options:', options);
    
    const filename = options.filename || `${report.title.replace(/\s+/g, '_')}.pdf`;
    
    // In development mode, we'll just show a message instead of generating a file
    setTimeout(() => {
      alert(`[MOCK] PDF export successful!\n\nFile: ${filename}\nTitle: ${report.title}\nNumber of sections: ${report.sections.length}`);
    }, 500);
    
    return {
      success: true,
      message: `[MOCK] Report would be exported as PDF: ${filename}`,
    };
  }
  
  /**
   * Mock Word export
   */
  private mockExportToWord(
    report: GeneratedReport,
    options: AdvancedExportOptions
  ): ExportResult {
    console.log('[MOCK] Generating Word document with options:', options);
    
    const filename = options.filename || `${report.title.replace(/\s+/g, '_')}.docx`;
    
    // In development mode, we'll just show a message instead of generating a file
    setTimeout(() => {
      alert(`[MOCK] Word export successful!\n\nFile: ${filename}\nTitle: ${report.title}\nNumber of sections: ${report.sections.length}`);
    }, 500);
    
    return {
      success: true,
      message: `[MOCK] Report would be exported as Word document: ${filename}`,
    };
  }
  
  /**
   * Mock client record export
   */
  private mockExportToClientRecord(
    report: GeneratedReport,
    options: AdvancedExportOptions
  ): ExportResult {
    console.log('[MOCK] Sending to client record system:', {
      reportTitle: report.title,
      clientName: report.metadata.clientName,
      authorName: report.metadata.authorName,
      sections: report.sections.length
    });
    
    // Generate a fake record ID
    const recordId = `mock-record-${Date.now()}`;
    
    // In development mode, we'll just show a message
    setTimeout(() => {
      alert(`[MOCK] Client record export successful!\n\nRecord ID: ${recordId}\nTitle: ${report.title}\nClient: ${report.metadata.clientName}`);
    }, 500);
    
    return {
      success: true,
      message: `[MOCK] Report would be saved to client record system with ID: ${recordId}`,
      recordId
    };
  }
  
  /**
   * Mock email sharing
   */
  public async shareViaEmail(
    report: GeneratedReport,
    options: AdvancedExportOptions
  ): Promise<ExportResult> {
    console.log('[MOCK] Sharing via email:', {
      to: options.emailRecipients,
      subject: options.emailSubject || report.title,
      body: options.emailBody,
      attachFormat: options.emailAttachFormat
    });
    
    // In development mode, we'll just show a message
    setTimeout(() => {
      alert(`[MOCK] Email sharing successful!\n\nTo: ${options.emailRecipients?.join(', ') || 'No recipients'}\nSubject: ${options.emailSubject || report.title}`);
    }, 500);
    
    return {
      success: true,
      message: `[MOCK] Report would be shared via email to ${options.emailRecipients?.join(', ') || 'No recipients'}`
    };
  }
  
  /**
   * Mock print version generation
   */
  public async generatePrintVersion(
    report: GeneratedReport,
    options: AdvancedExportOptions
  ): Promise<Blob> {
    console.log('[MOCK] Generating print version:', {
      title: report.title,
      orientation: options.orientation,
      pageSize: options.pageSize
    });
    
    // In development mode, we'll just show a message
    setTimeout(() => {
      alert(`[MOCK] Print version generated for ${report.title}`);
    }, 500);
    
    // Return an empty blob
    return new Blob(['[MOCK] Print version content'], { type: 'application/pdf' });
  }
}

/**
 * Mock Print Service class for handling print functionality during development
 */
export class PrintService {
  /**
   * Print the report using browser's print functionality
   */
  public async printReport(
    report: GeneratedReport,
    options: AdvancedExportOptions
  ): Promise<boolean> {
    console.log('[MOCK] Printing report:', {
      title: report.title,
      options
    });
    
    // In development mode, we'll just show a message
    setTimeout(() => {
      alert(`[MOCK] Print functionality would open the browser's print dialog for report: ${report.title}`);
    }, 500);
    
    return true;
  }
  
  /**
   * Get printer-friendly HTML content
   */
  public getPrintableHtml(report: GeneratedReport): string {
    return `
      <html>
        <head>
          <title>${report.title}</title>
          <style>
            body { font-family: Arial, sans-serif; }
            h1 { color: #333; }
          </style>
        </head>
        <body>
          <h1>${report.title}</h1>
          <p>Client: ${report.metadata.clientName}</p>
          <p>Date: ${new Date(report.createdAt).toLocaleDateString()}</p>
          
          <!-- Mock content -->
          ${report.sections.map(section => `
            <h2>${section.title}</h2>
            <p>[Mock content for section]</p>
          `).join('')}
        </body>
      </html>
    `;
  }
  
  /**
   * Get print options for the report
   */
  public getDefaultPrintOptions(): Record<string, any> {
    return {
      orientation: 'portrait',
      pageSize: 'letter',
      margins: { top: 10, right: 10, bottom: 10, left: 10 },
      printBackground: true,
      printHeaders: true,
      printFooters: true
    };
  }
}

// Export singleton instances
export const exportService = new ExportService();
export const printService = new PrintService();
