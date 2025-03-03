/**
 * Print Service for Delilah V3.0
 * 
 * This service handles print optimization for reports.
 */

import { GeneratedReport } from '@/lib/report-drafting/types';
import { AdvancedExportOptions } from './export-service';

export interface PrintOptions {
  // Paper size options
  paperSize: 'letter' | 'a4' | 'legal';
  orientation: 'portrait' | 'landscape';
  
  // Margins in mm
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  
  // Content options
  includeHeaderFooter: boolean;
  useColor: boolean;
  printBackground: boolean;
  scale: number; // 0.1 to 2.0
  
  // Page range options
  pageRanges?: string; // e.g., '1-5, 8, 11-13'
  
  // Advanced options
  preferCssPageSize: boolean;
  printMetadata: boolean;
}

export interface PrintResult {
  success: boolean;
  message: string;
  printJobId?: string;
}

/**
 * Print Service for handling print optimization
 */
export class PrintService {
  /**
   * Generate a print-optimized version of the report
   */
  public async generatePrintVersion(
    report: GeneratedReport,
    options: AdvancedExportOptions
  ): Promise<Blob> {
    // Convert export options to print options
    const printOptions: PrintOptions = {
      paperSize: options.pageSize || 'letter',
      orientation: options.orientation || 'portrait',
      margins: options.margins || { top: 25, right: 25, bottom: 25, left: 25 },
      includeHeaderFooter: options.includeHeaders || options.includeFooters || false,
      useColor: true,
      printBackground: true,
      scale: 1.0,
      preferCssPageSize: true,
      printMetadata: options.includeMetadata || true
    };
    
    // In a real implementation, we would generate a print-optimized HTML or PDF
    // For now, return a placeholder
    return new Blob(['Print version placeholder'], { type: 'application/pdf' });
  }
  
  /**
   * Print the report directly (browser-based)
   */
  public async printReport(
    report: GeneratedReport,
    options?: Partial<PrintOptions>
  ): Promise<PrintResult> {
    try {
      // Default print options
      const defaultOptions: PrintOptions = {
        paperSize: 'letter',
        orientation: 'portrait',
        margins: { top: 25, right: 25, bottom: 25, left: 25 },
        includeHeaderFooter: true,
        useColor: true,
        printBackground: true,
        scale: 1.0,
        preferCssPageSize: true,
        printMetadata: true
      };
      
      // Merge with provided options
      const printOptions = { ...defaultOptions, ...options };
      
      // In a real implementation, we would use the browser's print API
      // Create a hidden iframe with the report content
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.top = '-9999px';
      iframe.style.left = '-9999px';
      iframe.style.width = '0';
      iframe.style.height = '0';
      document.body.appendChild(iframe);
      
      // Generate print-optimized HTML
      const html = this.generatePrintHtml(report, printOptions);
      
      // Write HTML to the iframe
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) {
        throw new Error('Failed to access iframe document');
      }
      
      iframeDoc.open();
      iframeDoc.write(html);
      iframeDoc.close();
      
      // Add onload handler
      iframe.onload = () => {
        // Wait a moment to ensure content is rendered
        setTimeout(() => {
          // Access the iframe's window
          const iframeWin = iframe.contentWindow;
          if (!iframeWin) {
            console.error('Failed to access iframe window');
            return;
          }
          
          // Print the iframe content
          iframeWin.print();
          
          // Remove the iframe after printing (or after a timeout)
          setTimeout(() => {
            document.body.removeChild(iframe);
          }, 5000);
        }, 500);
      };
      
      return {
        success: true,
        message: 'Print job sent to browser',
        printJobId: `print-${Date.now()}`
      };
    } catch (error) {
      console.error('Error printing report:', error);
      return {
        success: false,
        message: `Failed to print report: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
  
  /**
   * Generate print-optimized HTML for a report
   */
  private generatePrintHtml(report: GeneratedReport, options: PrintOptions): string {
    // Create a print-optimized HTML document
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${report.title}</title>
        <style>
          @page {
            size: ${options.paperSize} ${options.orientation};
            margin: ${options.margins.top}mm ${options.margins.right}mm ${options.margins.bottom}mm ${options.margins.left}mm;
          }
          
          body {
            font-family: Arial, sans-serif;
            line-height: 1.5;
            color: #000;
            background: #fff;
            margin: 0;
            padding: 0;
          }
          
          .report-title {
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
          }
          
          .report-metadata {
            margin: 10px 0 30px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 15px;
          }
          
          .metadata-row {
            display: flex;
            margin-bottom: 5px;
          }
          
          .metadata-label {
            font-weight: bold;
            width: 150px;
          }
          
          .section {
            margin: 30px 0;
            break-inside: avoid-page;
          }
          
          .section-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
          }
          
          .section-content {
            margin-bottom: 20px;
          }
          
          .page-break {
            page-break-after: always;
          }
          
          .footer {
            text-align: center;
            font-size: 10px;
            color: #666;
            margin-top: 30px;
          }
          
          /* Print-specific styles */
          @media print {
            a {
              text-decoration: none;
              color: #000;
            }
            
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="report-title">${report.title}</div>
        
        ${options.printMetadata ? `
        <div class="report-metadata">
          <div class="metadata-row">
            <div class="metadata-label">Client:</div>
            <div>${report.metadata.clientName || 'N/A'}</div>
          </div>
          <div class="metadata-row">
            <div class="metadata-label">Assessment Date:</div>
            <div>${report.metadata.assessmentDate ? new Date(report.metadata.assessmentDate).toLocaleDateString() : 'N/A'}</div>
          </div>
          <div class="metadata-row">
            <div class="metadata-label">Author:</div>
            <div>${report.metadata.authorName || 'N/A'}</div>
          </div>
          <div class="metadata-row">
            <div class="metadata-label">Organization:</div>
            <div>${report.metadata.organizationName || 'N/A'}</div>
          </div>
        </div>
        ` : ''}
        
        ${report.sections.map((section, index) => `
          <div class="section">
            <div class="section-title">${section.title}</div>
            <div class="section-content">
              ${section.content.replace(/\n\n/g, '<br><br>')}
            </div>
            ${index < report.sections.length - 1 ? '<div class="page-break"></div>' : ''}
          </div>
        `).join('')}
        
        ${options.includeHeaderFooter ? `
        <div class="footer">
          ${report.title} | Generated on ${new Date(report.createdAt).toLocaleDateString()} | 
          Page <span class="page-number"></span>
        </div>
        ` : ''}
        
        <script>
          // Add page numbers
          window.onload = function() {
            // This would be implemented for actual page numbering in a real print system
          };
        </script>
      </body>
      </html>
    `;
    
    return html;
  }
}

// Export a singleton instance
export const printService = new PrintService();
