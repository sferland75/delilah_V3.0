/**
 * PDF Extraction Functions
 * 
 * This file contains the core functionality for extracting text from PDFs using PDF.js.
 */

import pdfjs, { initPdfJS } from './clientPdfService';

// Interface for PDF extraction options
export interface PdfExtractionOptions {
  includePageNumbers?: boolean;
  normalizeSpaces?: boolean;
  preserveFormatting?: boolean;
}

/**
 * Extract text content from a PDF using PDF.js
 * @param pdfBuffer The binary PDF data
 * @param options Options for text extraction
 * @returns Object containing the full text and individual page texts
 */
export async function extractTextFromPdf(
  pdfBuffer: ArrayBuffer, 
  options: PdfExtractionOptions = {}
): Promise<{ fullText: string; pageTexts: string[] }> {
  try {
    // Initialize PDF.js on client side
    initPdfJS();
    
    // Default options
    const {
      includePageNumbers = false,
      normalizeSpaces = true,
      preserveFormatting = true
    } = options;
    
    // Load PDF document using PDF.js
    const loadingTask = pdfjs.getDocument({ data: pdfBuffer });
    const pdfDocument = await loadingTask.promise;
    
    console.log(`PDF Processing Service - PDF loaded with ${pdfDocument.numPages} pages`);
    
    // Extract text from each page
    const pageTexts: string[] = [];
    let fullText = '';
    
    for (let i = 1; i <= pdfDocument.numPages; i++) {
      try {
        // Get the page
        const page = await pdfDocument.getPage(i);
        
        // Extract the text content
        const textContent = await page.getTextContent();
        
        // Process text items
        let pageText = '';
        let lastY: number | null = null;
        let lastX: number | null = null;
        
        // Process each text item
        for (const item of textContent.items) {
          const textItem = item as any; // Type assertion for simplicity
          
          // Add new line if Y position changes significantly
          if (lastY !== null && preserveFormatting) {
            const yDifference = Math.abs(textItem.transform[5] - lastY);
            const lineHeight = textItem.height || 12;
            
            // If Y position change is significant, consider it a new line
            if (yDifference > lineHeight * 0.5) {
              pageText += '\n';
              lastX = null; // Reset X position after line break
            } 
            // Add space if items are not adjacent but on same line
            else if (lastX !== null && textItem.transform[4] > lastX + 5) {
              pageText += ' ';
            }
          }
          
          // Add the text content
          pageText += textItem.str;
          
          // Update last positions
          lastY = textItem.transform[5];
          lastX = textItem.transform[4] + (textItem.width || 0);
        }
        
        // Normalize spaces if requested
        if (normalizeSpaces) {
          pageText = pageText.replace(/\s+/g, ' ').trim();
        }
        
        // Add page number if requested
        if (includePageNumbers) {
          pageText = `[Page ${i}]\n${pageText}`;
        }
        
        // Add to collection
        pageTexts.push(pageText);
        
        // Add to full text with page separator
        if (i > 1) {
          fullText += '\n\n';
        }
        fullText += pageText;
      } catch (error) {
        console.error(`PDF Processing Service - Error extracting text from page ${i}:`, error);
        pageTexts.push(`[Error extracting page ${i}]`);
        if (i > 1) fullText += '\n\n';
        fullText += `[Error extracting page ${i}]`;
      }
    }
    
    return { fullText, pageTexts };
  } catch (error) {
    console.error("PDF Processing Service - Error extracting text from PDF:", error);
    throw new Error(`PDF text extraction failed: ${error.message}`);
  }
}

/**
 * Helper utility functions for text extraction
 */

/**
 * Extract list items from text using various delimiters
 * @param text Text containing a list
 * @returns Array of extracted list items
 */
export function extractListItems(text: string): string[] {
  // Try to identify list items with various markers
  const listItems: string[] = [];
  
  // First check for numbered items
  const numberedItems = text.match(/\d+\.\s*([^\n.]+)(?:\.|$)/g);
  if (numberedItems && numberedItems.length > 1) {
    numberedItems.forEach(item => {
      const content = item.replace(/^\d+\.\s*/, '').trim();
      if (content) listItems.push(content);
    });
    return listItems;
  }
  
  // Then check for bullet points
  const bulletItems = text.match(/[•\-*]\s*([^\n•\-*]+)/g);
  if (bulletItems && bulletItems.length > 1) {
    bulletItems.forEach(item => {
      const content = item.replace(/^[•\-*]\s*/, '').trim();
      if (content) listItems.push(content);
    });
    return listItems;
  }
  
  // Finally, fall back to line breaks
  return text.split(/\n+/).filter(line => line.trim().length > 0).map(line => line.trim());
}

/**
 * Extract severity ratings from text
 * @param text Text to analyze
 * @returns Extracted severity or null
 */
export function extractSeverity(text: string): string | null {
  // Look for common pain/severity scales
  const painScaleMatch = text.match(/(\d+)\s*\/\s*10/i);
  if (painScaleMatch && painScaleMatch[1]) {
    return `${painScaleMatch[1]}/10`;
  }
  
  // Look for severity descriptions
  const severityMatch = text.match(/(?:mild|moderate|severe|extreme|significant|minimal)/i);
  if (severityMatch) {
    return severityMatch[0].trim();
  }
  
  return null;
}

/**
 * Extract impact descriptions from text
 * @param text Text to analyze
 * @returns Extracted impact or null
 */
export function extractImpact(text: string): string | null {
  // Look for descriptions of impact on life
  const impactMatch = text.match(/(?:affects|impacts|interferes with|limits|restricts)\s+([^.]+)/i);
  if (impactMatch && impactMatch[1]) {
    return impactMatch[1].trim();
  }
  
  return null;
}

/**
 * Extract activities from text
 * @param text Text to analyze
 * @returns Array of extracted activities
 */
export function extractActivities(text: string): string[] {
  const activities: string[] = [];
  
  // Extract activities using common patterns
  const actionVerbs = [
    'performs', 'completes', 'engages in', 'does', 'participates in',
    'eating', 'dressing', 'bathing', 'grooming', 'toileting',
    'walking', 'transferring', 'preparing', 'reading', 'watching'
  ];
  
  for (const verb of actionVerbs) {
    const pattern = new RegExp(`${verb}\\s+([^.,;]+)`, 'gi');
    let match;
    while ((match = pattern.exec(text)) !== null) {
      if (match[1] && match[1].trim().length > 0) {
        activities.push(match[1].trim());
      }
    }
  }
  
  // Deduplicate activities
  return [...new Set(activities)];
}

/**
 * Extract assistance needs from text
 * @param text Text to analyze
 * @returns Array of extracted assistance needs
 */
export function extractAssistance(text: string): string[] {
  const assistance: string[] = [];
  
  // Extract assistance using common patterns
  const assistancePatterns = [
    /(?:requires|needs|receives)\s+(?:assistance|help|support|aid)\s+(?:with|for)\s+([^.,;]+)/gi,
    /(?:dependent|relies)\s+(?:on|upon)\s+([^.,;]+)/gi,
    /(?:caregiver|spouse|family member|attendant)\s+(?:assists|helps|supports|provides)\s+(?:with)?\s+([^.,;]+)/gi
  ];
  
  for (const pattern of assistancePatterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      if (match[1] && match[1].trim().length > 0) {
        assistance.push(match[1].trim());
      }
    }
  }
  
  // Deduplicate assistance
  return [...new Set(assistance)];
}
