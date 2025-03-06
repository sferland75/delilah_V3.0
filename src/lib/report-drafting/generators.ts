import { DetailLevel, ReportStyle } from './types';
import { contentGenerators } from './content-generators';

// Helper function to generate content based on section ID, detail level, and style
export function generateReportContent(
  sectionId: string,
  detailLevel: DetailLevel,
  style: ReportStyle
): string {
  // Get the appropriate generator function for the section
  const generator = contentGenerators[sectionId] || defaultContentGenerator;
  
  // Generate content with the specified detail level and style
  return generator(detailLevel, style);
}

// Default content generator for sections without specific generators
function defaultContentGenerator(detailLevel: DetailLevel, style: ReportStyle): string {
  return 'This section has not been implemented yet. Please edit to add your content.';
}
