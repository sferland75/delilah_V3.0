/**
 * Word Document Helpers for Delilah V3.0
 * 
 * This file contains helper functions for Word document generation and formatting.
 */

import { 
  Paragraph, 
  TextRun, 
  HeadingLevel, 
  TableRow, 
  TableCell, 
  Table,
  BorderStyle,
  AlignmentType,
  TableOfContents,
  StyleLevel
} from 'docx';

/**
 * Format content text into properly structured Word document elements
 */
export function formatWordContent(content: string): Paragraph[] {
  const paragraphs: Paragraph[] = [];
  
  // Split content by double line breaks to separate paragraphs
  const contentBlocks = content.split('\n\n');
  
  for (const block of contentBlocks) {
    if (block.trim() === '') continue;
    
    // Check if block is a heading
    if (block.startsWith('#')) {
      let level = 1;
      while (block.charAt(level) === '#' && level < 6) {
        level++;
      }
      
      // Map level to heading level
      let headingLevel;
      switch (level) {
        case 1: headingLevel = HeadingLevel.HEADING_1; break;
        case 2: headingLevel = HeadingLevel.HEADING_2; break;
        case 3: headingLevel = HeadingLevel.HEADING_3; break;
        case 4: headingLevel = HeadingLevel.HEADING_4; break;
        case 5: 
        case 6: headingLevel = HeadingLevel.HEADING_5; break;
        default: headingLevel = HeadingLevel.HEADING_2;
      }
      
      paragraphs.push(
        new Paragraph({
          text: block.substring(level).trim(),
          heading: headingLevel,
          spacing: { before: 200, after: 80 }
        })
      );
      continue;
    }
    
    // Check if block is a list item
    if (block.trim().startsWith('- ') || block.trim().startsWith('* ')) {
      // For simplicity, we're just adding it as a bullet point paragraph
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun('• '),
            new TextRun(block.substring(2).trim())
          ],
          indent: { left: 720 },
          spacing: { after: 80 }
        })
      );
      continue;
    }
    
    // Check if block is a numbered list item
    if (/^\d+\.\s/.test(block.trim())) {
      const number = block.trim().match(/^\d+/)[0];
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun(`${number}. `),
            new TextRun(block.replace(/^\d+\.\s/, '').trim())
          ],
          indent: { left: 720 },
          spacing: { after: 80 }
        })
      );
      continue;
    }
    
    // Regular paragraph
    paragraphs.push(
      new Paragraph({
        text: block,
        spacing: { after: 120 }
      })
    );
  }
  
  return paragraphs;
}

/**
 * Create a Table of Contents element
 */
export function createWordToc(): TableOfContents {
  return new TableOfContents("Table of Contents", {
    hyperlink: true,
    headingStyleRange: "1-5",
    stylesWithLevels: [
      new StyleLevel("Heading1", 1),
      new StyleLevel("Heading2", 2),
      new StyleLevel("Heading3", 3),
      new StyleLevel("Heading4", 4),
      new StyleLevel("Heading5", 5),
    ],
  });
}
