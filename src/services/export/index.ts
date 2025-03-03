/**
 * Export Service - Development Version
 * 
 * This file exports mock implementations of the export and print services
 * to avoid dependency issues during development and testing.
 */

// Mock services for export and print functionality
const exportService = {
  exportReport: async (report: any, format: string, options: any) => {
    console.log(`[MOCK] Exporting report in ${format} format`, { reportTitle: report.title, options });
    
    // Show an alert in development to simulate a successful export
    setTimeout(() => {
      alert(`[MOCK] Export successful!\nFormat: ${format}\nFile: ${options.filename || 'report.' + format}`);
    }, 500);
    
    return {
      success: true,
      message: `[MOCK] Report successfully exported as ${format.toUpperCase()}: ${options.filename || 'report.' + format}`
    };
  },
  
  shareViaEmail: async (report: any, options: any) => {
    console.log('[MOCK] Sharing via email', { 
      to: options.emailRecipients,
      subject: options.emailSubject || report.title,
      attachFormat: options.emailAttachFormat
    });
    
    // Show an alert in development
    setTimeout(() => {
      alert(`[MOCK] Email sharing successful!\nTo: ${options.emailRecipients?.join(', ') || 'No recipients'}\nSubject: ${options.emailSubject || report.title}`);
    }, 500);
    
    return {
      success: true,
      message: `[MOCK] Report would be shared via email to ${options.emailRecipients?.join(', ') || 'No recipients'}`
    };
  }
};

// Mock print service
const printService = {
  printReport: async (report: any, options: any) => {
    console.log('[MOCK] Printing report', { title: report.title, options });
    
    // Show an alert in development
    setTimeout(() => {
      alert(`[MOCK] Print dialog would open for report: ${report.title}`);
    }, 500);
    
    return true;
  },
  
  getPrintableHtml: (report: any) => {
    return `<html><body><h1>${report.title}</h1><p>Mock printable content</p></body></html>`;
  },
  
  getDefaultPrintOptions: () => {
    return {
      paperSize: 'letter',
      orientation: 'portrait',
      margins: { top: 25, right: 25, bottom: 25, left: 25 },
      includeHeaderFooter: true,
      useColor: true,
      printBackground: true
    };
  }
};

// Now export both services properly
export { exportService, printService };

// Also export the types needed by the component
export interface AdvancedExportOptions {
  [key: string]: any;
  format?: string;
  filename?: string;
  includeMetadata?: boolean;
  includeHeaders?: boolean;
  includeFooters?: boolean;
  pageSize?: 'letter' | 'a4' | 'legal';
  orientation?: 'portrait' | 'landscape';
  margins?: { top: number; right: number; bottom: number; left: number };
  includeAppendices?: boolean;
  includeSummaryPage?: boolean;
  includeSignatureLine?: boolean;
  includeCoverPage?: boolean;
  includeTableOfContents?: boolean;
  useBranding?: boolean;
  organizationName?: string;
  emailRecipients?: string[];
  emailSubject?: string;
  emailBody?: string;
  emailAttachFormat?: string;
}