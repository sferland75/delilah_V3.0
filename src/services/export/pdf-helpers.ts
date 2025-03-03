/**
 * PDF Helpers for Delilah V3.0
 * 
 * This file contains helper functions for PDF generation and formatting.
 */

import { jsPDF } from 'jspdf';
import { AdvancedExportOptions } from './export-service';

interface ContentBlock {
  type: 'paragraph' | 'heading' | 'list' | 'table' | 'image';
  content: string;
  level?: number; // For headings and lists
  tableData?: any[][]; // For tables
  imageData?: string; // For images
}

interface PageInfo {
  pageCount: number;
  currentPage: number;
}

/**
 * Format and add content to a PDF document with proper handling of
 * paragraphs, lists, tables, and other formatted content
 */
export function formatPdfContent(
  content: string,
  doc: jsPDF,
  startY: number,
  maxWidth: number = 170,
  options: AdvancedExportOptions
): number {
  let currentY = startY;
  
  // Parse content into blocks for better handling
  const blocks = parseContentBlocks(content);
  
  for (const block of blocks) {
    // Check if we need a page break
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
      
      // Add headers and footers to the new page if enabled
      if (options.includeHeaders || options.includeFooters) {
        const pageInfo: PageInfo = {
          pageCount: doc.getNumberOfPages(),
          currentPage: doc.getCurrentPageInfo().pageNumber
        };
        addHeadersAndFooters(doc, options, pageInfo);
      }
    }
    
    switch (block.type) {
      case 'paragraph':
        currentY = addParagraph(doc, block.content, currentY, maxWidth);
        break;
        
      case 'heading':
        currentY = addHeading(doc, block.content, block.level || 1, currentY);
        break;
        
      case 'list':
        currentY = addListItem(doc, block.content, block.level || 1, currentY, maxWidth);
        break;
        
      case 'table':
        if (block.tableData) {
          currentY = addTable(doc, block.tableData, currentY, maxWidth);
        }
        break;
        
      case 'image':
        // Image handling would be implemented here
        currentY += 10;
        break;
    }
    
    // Add some spacing between blocks
    currentY += 5;
  }
  
  return currentY;
}

/**
 * Parse content string into structured blocks for better formatting
 */
function parseContentBlocks(content: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  
  // Split content by double line breaks to separate paragraphs
  const paragraphs = content.split('\n\n');
  
  for (const paragraph of paragraphs) {
    if (paragraph.trim() === '') continue;
    
    // Check if paragraph is a heading
    if (paragraph.startsWith('#')) {
      let level = 1;
      while (paragraph.charAt(level) === '#' && level < 6) {
        level++;
      }
      
      blocks.push({
        type: 'heading',
        content: paragraph.substring(level).trim(),
        level
      });
      continue;
    }
    
    // Check if paragraph is a list item
    if (paragraph.trim().startsWith('- ') || paragraph.trim().startsWith('* ')) {
      blocks.push({
        type: 'list',
        content: paragraph.substring(2).trim(),
        level: 1
      });
      continue;
    }
    
    // Check if paragraph is a numbered list item
    if (/^\d+\.\s/.test(paragraph.trim())) {
      blocks.push({
        type: 'list',
        content: paragraph.replace(/^\d+\.\s/, '').trim(),
        level: 1
      });
      continue;
    }
    
    // Check for tables (simplified detection)
    if (paragraph.includes('|') && paragraph.trim().startsWith('|')) {
      try {
        const tableData = parseTableData(paragraph);
        blocks.push({
          type: 'table',
          content: paragraph,
          tableData
        });
        continue;
      } catch (error) {
        console.warn('Failed to parse table:', error);
        // Fall back to treating it as a paragraph
      }
    }
    
    // Default to paragraph
    blocks.push({
      type: 'paragraph',
      content: paragraph
    });
  }
  
  return blocks;
}

/**
 * Add a paragraph to the PDF document
 */
function addParagraph(
  doc: jsPDF,
  text: string,
  y: number,
  maxWidth: number
): number {
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  // Split text to fit within maxWidth
  const textLines = doc.splitTextToSize(text, maxWidth);
  doc.text(textLines, 20, y);
  
  // Calculate and return new Y position
  return y + (7 * textLines.length);
}

/**
 * Add a heading to the PDF document
 */
function addHeading(
  doc: jsPDF,
  text: string,
  level: number,
  y: number
): number {
  // Set font size based on heading level
  let fontSize = 16;
  switch (level) {
    case 1: fontSize = 16; break;
    case 2: fontSize = 14; break;
    case 3: fontSize = 13; break;
    case 4: fontSize = 12; break;
    case 5: 
    case 6: fontSize = 11; break;
  }
  
  doc.setFontSize(fontSize);
  doc.setFont('helvetica', 'bold');
  doc.text(text, 20, y);
  
  // Return new Y position
  return y + fontSize * 0.5;
}

/**
 * Add a list item to the PDF document
 */
function addListItem(
  doc: jsPDF,
  text: string,
  level: number,
  y: number,
  maxWidth: number
): number {
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  // Calculate left margin based on list level
  const leftMargin = 20 + ((level - 1) * 10);
  
  // Add bullet point
  doc.text('•', leftMargin, y);
  
  // Add list item text
  const textLines = doc.splitTextToSize(text, maxWidth - leftMargin - 5);
  doc.text(textLines, leftMargin + 5, y);
  
  // Return new Y position
  return y + (7 * textLines.length);
}

/**
 * Add a table to the PDF document
 */
function addTable(
  doc: jsPDF,
  tableData: any[][],
  y: number,
  maxWidth: number
): number {
  if (!tableData || tableData.length === 0) {
    return y;
  }
  
  const columnCount = tableData[0].length;
  const columnWidth = maxWidth / columnCount;
  
  // Create table header
  const headers = tableData[0];
  const data = tableData.slice(1);
  
  // Use jspdf-autotable for table creation
  const finalY = (doc as any).autoTable({
    startY: y,
    head: [headers],
    body: data,
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
    columnStyles: Array(columnCount).fill({ cellWidth: columnWidth }),
    margin: { left: 20, right: 20 }
  }).finalY || y + 20;
  
  return finalY + 5;
}

/**
 * Parse table data from markdown-like table format
 */
function parseTableData(tableText: string): any[][] {
  // Split into lines
  const lines = tableText.split('\n').filter(line => line.trim() !== '');
  
  if (lines.length < 2) {
    throw new Error('Invalid table: not enough rows');
  }
  
  // Process each line into cells
  const tableData = lines.map(line => {
    // Remove leading and trailing pipe, then split by pipe
    const rawCells = line.trim().replace(/^\||\|$/g, '').split('|');
    
    // Trim each cell
    return rawCells.map(cell => cell.trim());
  });
  
  // Remove separator row if it exists (row with dashes)
  const isSeparatorRow = (row: any[]) => {
    return row.every(cell => cell.trim().match(/^[-:]+$/));
  };
  
  if (tableData.length > 1 && isSeparatorRow(tableData[1])) {
    tableData.splice(1, 1);
  }
  
  return tableData;
}

/**
 * Add headers and footers to all pages of a PDF document
 */
export function addHeadersAndFooters(
  doc: jsPDF,
  options: AdvancedExportOptions,
  pageInfo: PageInfo
): void {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Add header if enabled
  if (options.includeHeaders) {
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    
    if (options.useBranding && options.organizationName) {
      doc.text(options.organizationName, 20, 10);
      
      // Add line under the header
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.line(20, 12, pageWidth - 20, 12);
    } else {
      const headerText = options.customHeader || 'Assessment Report';
      doc.text(headerText, pageWidth / 2, 10, { align: 'center' });
    }
  }
  
  // Add footer if enabled
  if (options.includeFooters) {
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    
    // Add page numbers
    const footerText = `Page ${pageInfo.currentPage} of ${pageInfo.pageCount}`;
    doc.text(footerText, pageWidth / 2, pageHeight - 10, { align: 'center' });
    
    // Add custom footer if provided
    if (options.customFooter) {
      doc.text(options.customFooter, 20, pageHeight - 10);
    }
    
    // Add generation date
    const dateText = `Generated: ${new Date().toLocaleDateString()}`;
    doc.text(dateText, pageWidth - 20, pageHeight - 10, { align: 'right' });
  }
}

/**
 * Add a cover page to the PDF document
 */
export function addCoverPage(
  doc: jsPDF,
  title: string,
  metadata: any,
  options: AdvancedExportOptions
): void {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Add organization logo and details if branding is enabled
  let yPosition = 40;
  
  if (options.useBranding) {
    // Organization name
    if (options.organizationName) {
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(options.organizationName, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 10;
    }
    
    // Organization address
    if (options.organizationAddress) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(options.organizationAddress, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 20;
    }
  }
  
  // Report title
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(title, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 20;
  
  // Assessment type
  doc.setFontSize(16);
  doc.setFont('helvetica', 'italic');
  doc.text('Assessment Report', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 40;
  
  // Client information
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Client Information', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;
  
  // Client details
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  if (metadata.clientName) {
    doc.text(`Name: ${metadata.clientName}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 8;
  }
  
  if (metadata.assessmentDate) {
    const dateStr = new Date(metadata.assessmentDate).toLocaleDateString();
    doc.text(`Assessment Date: ${dateStr}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 8;
  }
  
  // Report details
  yPosition += 20;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Report Details', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;
  
  // Author details
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  if (metadata.authorName) {
    doc.text(`Author: ${metadata.authorName}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 8;
  }
  
  const generateDate = new Date().toLocaleDateString();
  doc.text(`Generation Date: ${generateDate}`, pageWidth / 2, yPosition, { align: 'center' });
  
  // Add footer with confidentiality notice
  const confidentialityText = 'CONFIDENTIAL: This document contains sensitive information.';
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.text(confidentialityText, pageWidth / 2, pageHeight - 20, { align: 'center' });
}
