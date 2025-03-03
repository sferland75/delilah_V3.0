# PDF Import Technical Documentation

## Architecture Overview

The PDF import feature is built on a modular architecture designed for maintainability and extensibility:

```
src/
├── services/
│   ├── pdfProcessingService.ts    # Main service coordinating PDF processing
│   ├── pdfExtraction.ts           # PDF.js integration and core extraction utilities
│   ├── pdfInterfaces.ts           # Common interfaces for PDF processing
│   ├── pdfMatchers/               # Pattern matchers for different sections
│   │   ├── index.ts               # Exports all matchers
│   │   ├── demographicsMatcher.ts # Demographics extraction
│   │   ├── medicalHistoryMatcher.ts # Medical history extraction
│   │   ├── ...                    # Other section matchers
│   │   ├── adlsMatcher.ts         # ADLs extraction
│   │   ├── adlsExtractors/        # Specific ADL component extractors
│   │   │   ├── basicADLsExtractor.ts
│   │   │   ├── ...
│   │   ├── attendantCareMatcher.ts  # Attendant care extraction
│   │   ├── attendantCareExtractors/ # Attendant care component extractors
│   │   │   ├── selfCareExtractor.ts
│   │   │   ├── ...
├── components/
│   ├── PdfImportComponent.tsx     # UI for PDF import functionality
```

## Core Concepts

### 1. Text Extraction

Text extraction is handled by PDF.js, with custom logic to preserve formatting:

- **Page-by-page extraction** - Processes each page individually
- **Formatting preservation** - Maintains line breaks and spacing
- **Error handling** - Robust error handling for corrupt or malformed PDFs

### 2. Pattern Matching

Each section uses pattern matchers to extract structured data:

- **RegExp patterns** - Multiple regular expressions per data point
- **Fallbacks** - Progressive fallback strategies if primary patterns fail
- **Confidence scoring** - Algorithms to assess extraction reliability

### 3. Pattern Matcher Interface

All matchers implement this interface:
```typescript
interface PatternMatcher {
  section: string;         // Section identifier
  patterns: RegExp[];      // Patterns to identify this section
  extract: (text: string) => any;  // Function to extract data
  confidence: (result: any) => number;  // Function to calculate confidence
}
```

## PDF Processing Flow

1. **PDF Loading** - PDF file is loaded as ArrayBuffer
2. **Text Extraction** - PDF.js extracts text with formatting
3. **Section Detection** - Text is analyzed to identify sections
4. **Data Extraction** - Pattern matchers extract structured data
5. **Confidence Calculation** - Extraction quality is assessed
6. **Mapping** - Data is mapped to Assessment Context format

## PDF.js Worker Configuration

The PDF.js library requires a worker script to function properly. We've configured it to use the locally available worker instead of fetching it from CDN:

```typescript
// Configure PDF.js worker
const pdfjsWorker = require('pdfjs-dist/build/pdf.worker.entry');
if (typeof window !== 'undefined' && 'Worker' in window) {
  pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
}
```

This approach solves common issues with 404 errors when trying to fetch the worker from CDN. If you upgrade the PDF.js library version, make sure to test that the worker configuration still works correctly.

> **Important Note:** We're using pdfjs-dist version 3.11.174 which includes the worker file as part of the package. Avoid using versions that don't properly include the worker file.

## Confidence Scoring

Confidence scores are calculated using section-specific algorithms:

1. **Field presence** - Core fields receive higher weighting
2. **Data completeness** - More complete data = higher confidence
3. **Pattern strength** - Strong pattern matches = higher confidence
4. **Data quality** - Validation checks affect scoring

Scores are normalized to a 0-1 scale where:
- 0 = No confidence
- 1 = Perfect extraction

## Extending the System

### Adding a New Section Matcher

1. Create a new matcher file in `src/services/pdfMatchers/`
2. Implement the `PatternMatcher` interface
3. Add your matcher to the exports in `index.ts`

### Improving Extraction Patterns

Each matcher contains multiple pattern sets. To improve recognition:

1. Analyze failure cases to identify missing patterns
2. Add new RegExp patterns to the appropriate matcher
3. Test with representative documents

### Modifying Confidence Scoring

To adjust confidence calculation:

1. Locate the `confidence` function in the relevant matcher
2. Adjust weights for different components
3. Add additional validation checks if needed

## Common Challenges

### Inconsistent Formatting

Problem: Documents use different section naming and organization.
Solution: Multiple pattern sets with varied terminology.

### OCR Quality Issues

Problem: Scanned PDFs may have poor text recognition.
Solution: Fuzzy matching and context-aware extraction.

### Complex Data Structures

Problem: Nested data (like medical history) can be complex to extract.
Solution: Hierarchical pattern matching with context awareness.

## Testing

The PDF extraction system includes several test types:

1. **Unit tests** - For individual extraction functions (`pdfExtraction.test.ts`)
2. **Pattern matcher tests** - For each section matcher
3. **Integration tests** - End-to-end PDF processing tests
4. **Confidence scoring tests** - Validates score calculations

## Maintenance Recommendations

1. **Pattern updates** - Review and expand patterns periodically based on user feedback
2. **PDF.js updates** - Keep the PDF.js library updated, but ensure worker compatibility
3. **Performance monitoring** - Watch for performance issues with large documents
4. **Confidence thresholds** - Adjust confidence thresholds based on user feedback

## Troubleshooting Common Issues

### Worker File Not Found (404)

If you see errors like "Failed to fetch dynamically imported module" or 404 errors for the PDF.js worker:

1. Check that you're using the local worker file rather than CDN
2. Verify the PDF.js version matches with the worker version
3. Use version 3.11.174 or another stable version with included worker

### Processing Hangs or is Very Slow

For large or complex PDFs:

1. Add a timeout mechanism to prevent indefinite processing
2. Consider processing pages in batches
3. Add progress indicators in the UI

### Text Extraction Issues

If text isn't extracted correctly:

1. Check if the PDF contains actual text (not just images)
2. Verify text encoding and language support
3. Test with different PDF.js configuration options

## External Dependencies

- **PDF.js** (`pdfjs-dist`) - Core PDF processing
- **nanoid** - For generating unique IDs

## Future Enhancements

1. **Machine learning integration** - For improved pattern recognition
2. **Table extraction** - Enhanced handling of tabular data
3. **Image recognition** - For diagrams and non-text content
4. **Form field extraction** - Specialized handling for PDF forms
