# Pattern Recognition App Integration

## Overview

The pattern recognition system has been integrated into the Delilah V3.0 application using the App Router architecture. This document describes the changes made and how to use the new functionality.

## Components Added

### 1. PDF Import Page

Location: `src/app/import/assessment/page.tsx`

This page provides a user-friendly interface for:
- Uploading PDF files
- Processing them with the pattern recognition system
- Displaying extracted data
- Saving the data for use in assessment forms

### 2. PDF Testing/Debugging Tools

Two testing tools have been added:

1. **Basic PDF Test**
   - Location: `src/app/testing/pdf-basic-test/page.tsx`
   - Purpose: Verify basic PDF.js functionality
   - Features: Simple test to confirm PDF.js is correctly configured

2. **PDF Debug Tool**
   - Location: `src/app/testing/pdf-debug/page.tsx`
   - Purpose: Detailed debugging of PDF processing
   - Features: Step-by-step logs, progress tracking, text extraction display

## How to Use the Integration

### Importing an Assessment PDF

1. Navigate to `/import/assessment`
2. Click "Select PDF" to choose a file
3. The system will process the file and display a progress bar
4. Upon completion, you can review the extracted data
5. Click "Continue to Assessment Form" to use the data in a new assessment

### Testing PDF.js Functionality

If you encounter issues with PDF processing:

1. Navigate to `/testing/pdf-basic-test`
2. Run the basic test to verify PDF.js configuration
3. If the basic test passes but processing still fails, use the debug tool

### Using the PDF Debug Tool

1. Navigate to `/testing/pdf-debug`
2. Upload a PDF file
3. Click "Process PDF"
4. Review detailed logs of each processing step
5. Examine extracted text to identify potential pattern matching improvements

## Integration with Existing Components

The pattern recognition system uses localStorage to pass data between components:

1. When an assessment is processed and saved in the import page, the data is stored in localStorage
2. When navigating to the assessment form, it checks for data in localStorage and pre-fills the form

To integrate with your existing assessment forms:

```javascript
// In your assessment form component
useEffect(() => {
  // Check if coming from import page
  if (router.query.from === 'import') {
    // Get data from localStorage
    const importedData = localStorage.getItem('importedAssessmentData');
    if (importedData) {
      // Parse and use the data
      const data = JSON.parse(importedData);
      // Pre-fill your form
      // ...
    }
  }
}, [router.query]);
```

## Improving Pattern Recognition

As you use the system, you'll see which fields have low confidence or incorrect data. Use this information to improve the pattern recognition system:

1. Update the section extractors in `src/utils/pdf-import/` based on your observations
2. Add new patterns for commonly misrecognized fields
3. Adjust confidence thresholds as needed

For detailed guidance on improving the pattern recognition system, see `IMPROVING_PATTERN_RECOGNITION.md`.

## App Router vs. Pages Router

This integration uses Next.js App Router architecture to match the existing project structure. Key differences:

- Components are placed in `src/app/` instead of `src/pages/`
- Client-side code requires the `'use client';` directive
- Navigation uses `useRouter` from `next/navigation` instead of `next/router`

## Troubleshooting

### PDF.js Worker File Issues

If PDF processing gets stuck:

1. Run the verify-pdfjs-worker.js script:
   ```
   node scripts/verify-pdfjs-worker.js
   ```

2. Check that the PDF.js worker file exists in the public directory:
   ```
   public/pdf.worker.js
   ```

### Font Configuration

If you see font warnings in the console:

1. Verify that `configurePdfJs` is called on application startup
2. Check that the standard fonts are in the public folder

### Other Issues

For other pattern recognition issues, refer to:
- `PDF_TIMEOUT_TROUBLESHOOTING.md` for timeout issues
- `PATTERN_RECOGNITION_FIXES.md` for common problems and solutions

## Next Steps

1. **Continue to train the pattern recognition system** using more of your document formats
2. **Expand the verification workflow** to better capture user corrections
3. **Add server-side processing** for more robust PDF handling
4. **Implement caching** to improve performance with similar documents

## Conclusion

The pattern recognition system is now fully integrated into the Delilah V3.0 application. As you use it with real documents, you'll be able to iteratively improve the pattern matching rules based on how the data maps to your form fields.
