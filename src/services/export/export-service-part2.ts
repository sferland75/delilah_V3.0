
    // Set document properties
    doc.setProperties({
      title: report.title,
      subject: `Assessment report for ${report.metadata.clientName}`,
      author: report.metadata.authorName || 'Delilah Assessment System',
      keywords: 'assessment, report, rehabilitation',
      creator: 'Delilah V3.0'
    });
    
    // Add cover page if enabled
    if (options.includeCoverPage) {
      addCoverPage(doc, report.title, report.metadata, options);
      doc.addPage();
    } else {
      // Add basic title and metadata
      doc.setFontSize(16);
      doc.text(report.title, 20, 20);
      
      doc.setFontSize(11);
      doc.text(`Client: ${report.metadata.clientName}`, 20, 30);
      doc.text(`Date: ${new Date(report.createdAt).toLocaleDateString()}`, 20, 35);
      doc.text(`Author: ${report.metadata.authorName}`, 20, 40);
      
      // Add a line before content
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      doc.line(20, 45, 190, 45);
    }
    
    // Setup headers and footers if enabled
    if (options.includeHeaders || options.includeFooters) {
      const pageInfo = {
        pageCount: doc.getNumberOfPages(),
        currentPage: doc.getCurrentPageInfo().pageNumber
      };
      addHeadersAndFooters(doc, options, pageInfo);
    }
    
    // Starting Y position for content
    let yPosition = options.includeCoverPage ? 20 : 55;
    
    // Add each section with enhanced formatting
    for (const section of report.sections) {
      // Add section title
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(section.title, 20, yPosition);
      yPosition += 10;
      
      // Add section content with enhanced formatting
      yPosition = formatPdfContent(section.content, doc, yPosition, 170, options);
      
      // Add some space after section
      yPosition += 15;
      
      // Check if we need a page break for the next section
      if (yPosition > 250 && section !== report.sections[report.sections.length - 1]) {
        doc.addPage();
        yPosition = 20;
        
        // Add headers and footers to the new page if enabled
        if (options.includeHeaders || options.includeFooters) {
          const pageInfo = {
            pageCount: doc.getNumberOfPages(),
            currentPage: doc.getCurrentPageInfo().pageNumber
          };
          addHeadersAndFooters(doc, options, pageInfo);
        }
      }
    }
    
    // Update all page headers and footers with correct page numbers
    if (options.includeHeaders || options.includeFooters) {
      const totalPages = doc.getNumberOfPages();
      
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        
        const pageInfo = {
          pageCount: totalPages,
          currentPage: i
        };
        
        addHeadersAndFooters(doc, options, pageInfo);
      }
    }
    
    // Return the PDF as a blob
    return doc.output('blob');
  }
  
  /**
   * Generate a Word document blob without saving to file (for email attachments)
   */
  private async generateWordBlob(
    report: GeneratedReport,
    options: AdvancedExportOptions
  ): Promise<Blob> {
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
    
    // Add each report section with enhanced formatting
    for (const section of report.sections) {
      // Add section title
      sections.push(
        new Paragraph({
          text: section.title,
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 }
        })
      );
      
      // Format section content with enhanced formatting
      const formattedContent = formatWordContent(section.content);
      sections.push(...formattedContent);
      
      // Add a section break if not the last section
      if (section !== report.sections[report.sections.length - 1]) {
        sections.push(new Paragraph({ text: "", pageBreakBefore: true }));
      }
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
    return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
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
    return await this.generatePdfBlob(report, printOptions);
  }
}

// Export a singleton instance
export const exportService = new ExportService();
