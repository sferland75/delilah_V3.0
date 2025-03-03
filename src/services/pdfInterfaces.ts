/**
 * PDF Processing Interfaces
 * 
 * This file contains interfaces used by the PDF processing service.
 */

// Interface for PDF extraction options
export interface PdfExtractionOptions {
  includePageNumbers?: boolean;
  normalizeSpaces?: boolean;
  preserveFormatting?: boolean;
}

// Interface for the extracted PDF data
export interface ExtractedPdfData {
  demographics?: any;
  medicalHistory?: any;
  symptoms?: any;
  functionalStatus?: any;
  typicalDay?: any;
  environment?: any;
  adls?: any;
  attendantCare?: any;
  purpose?: any;
  methodology?: any;
  originalText: string;
  parsedByPage: string[];
  confidence: {
    [key: string]: number;  // Section name: confidence score (0-1)
  };
}

// Interface for specific pattern matchers
export interface PatternMatcher {
  section: string;
  patterns: RegExp[];
  extract: (text: string) => any;
  confidence: (result: any) => number;
}
