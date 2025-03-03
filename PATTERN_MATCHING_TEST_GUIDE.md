# Pattern Matching Test Guide

This guide will help you test the enhanced pattern recognition system that we've implemented for Delilah V3.0.

## Setup Instructions

Before testing, make sure you've applied all the necessary fixes and improvements:

1. Run the following batch file to apply the pattern recognition improvements:
   ```
   apply-pattern-improvements.bat
   ```

2. If prompted by the script, run the PDF.js worker copy script:
   ```
   copy-pdf-worker.bat
   ```

3. Update your package.json to include the font copying script:
   ```json
   "scripts": {
     "prebuild": "node scripts/copy-pdf-fonts.js",
     "copy-fonts": "node scripts/copy-pdf-fonts.js",
     // other existing scripts...
   }
   ```

4. Make sure your _app.js file imports and calls the configurePdfJs function:
   ```javascript
   import { useEffect } from 'react';
   import configureStandardFonts from '../utils/pdf-import/configurePdfJs';

   function MyApp({ Component, pageProps }) {
     useEffect(() => {
       // Configure PDF.js standard fonts
       configureStandardFonts();
     }, []);

     return <Component {...pageProps} />;
   }

   export default MyApp;
   ```

## Testing the Pattern Recognition System

### Using the Test Page

1. Start the development server:
   ```
   npm run dev
   ```

2. Navigate to the test page:
   ```
   http://localhost:3000/test-pdf-import
   ```

3. Upload a PDF document (preferably an assessment document or referral).

4. Click "Process PDF" and observe the results:
   - The confidence scores for each detected section
   - The extracted structured data
   - The raw PDF text (expandable)

### What to Look For

1. **Section Detection**: Check if all the expected sections are detected with reasonable confidence scores.

2. **Data Extraction**: Examine the extracted data to see if it correctly captures:
   - Demographics information
   - Medical history
   - Symptoms descriptions
   - Functional status details
   - Typical day routines
   - Environmental assessments
   - ADLs information
   - Attendant care needs
   - Purpose and methodology

3. **Confidence Scores**: Pay attention to the confidence scores:
   - Green (80%+): High confidence, likely accurate
   - Yellow (50-79%): Medium confidence, may need review
   - Red (<50%): Low confidence, likely needs manual correction

## Troubleshooting

If you encounter issues during testing, check the following:

### PDF.js Font Warnings

If you see font-related warnings in the console:
- Make sure the standard_fonts directory exists in your public folder
- Verify that the font files are present
- Check that configurePdfJs.js is properly setting the standardFontDataUrl

### Section Detection Issues

If sections are not being detected correctly:
- Check the raw PDF text to see if the text extraction worked
- Look for unusual formatting in the document
- Consider adding more pattern matchers for the specific document format

### Extraction Problems

If data extraction is incomplete or incorrect:
- Check if the correct extractor is being used for the section
- Examine the section content to see if it follows the expected format
- Consider adding more extraction patterns in the relevant extractor

## Advanced Testing

For more comprehensive testing:

1. **Process Multiple Documents**: Test with a variety of document formats to ensure robustness.

2. **Edge Cases**: Try documents with missing sections, unusual formatting, or different structures.

3. **Performance Testing**: Monitor processing time for large documents.

## Sample Test Cases

To facilitate systematic testing, use the following test cases:

### Test Case 1: Basic Assessment Document
- **Purpose**: Verify core functionality with a standard document
- **Expected Result**: All main sections detected, high confidence scores

### Test Case 2: Referral Document
- **Purpose**: Test referral document detection and processing
- **Expected Result**: Document identified as referral, appropriate data extracted

### Test Case 3: Incomplete Document
- **Purpose**: Verify system behavior with missing sections
- **Expected Result**: Available sections detected, appropriate confidence scores

### Test Case 4: Non-standard Formatting
- **Purpose**: Test robustness with unusual document formatting
- **Expected Result**: Sections identified despite formatting differences

### Test Case 5: Document with Tables
- **Purpose**: Verify extraction from tabular data
- **Expected Result**: Structured data correctly parsed from tables

## Integration Testing

After basic functionality is confirmed, test integration with the wider application:

1. **Import to Assessment**: Test importing extracted data into a new assessment
2. **Cross-section References**: Verify that extracted data is consistent across sections
3. **UI Indicators**: Confirm that confidence indicators appear in the UI
4. **Edit Workflow**: Test the workflow for correcting low-confidence extractions
5. **Save and Load**: Verify that extracted data is correctly saved and loaded

## Known Limitations

Be aware of the following current limitations:

1. **Tables**: Complex tables may not be perfectly extracted
2. **Handwriting**: The system cannot process handwritten notes
3. **Images**: Content in images is not processed
4. **Special Characters**: Some special characters may not extract correctly
5. **Font Warnings**: Non-critical font warnings may still appear in the console

## Next Steps

After successful testing:

1. **Improve Extractors**: Based on testing results, refine the extractors for better accuracy
2. **Enhance UI Integration**: Implement confidence indicators in the main application UI
3. **Add User Verification**: Allow users to review and correct low-confidence extractions
4. **Integrate with Reports**: Connect the extracted data to the report generation system
5. **Implement Learning**: Consider adding a feedback loop to improve extraction over time

## Reporting Issues

If you encounter persistent issues that you can't resolve, please:

1. Document the specific problem
2. Include the document type and format
3. Note any console errors
4. Describe the expected vs. actual behavior
5. Create a test case that reproduces the issue

By following this guide, you should be able to effectively test and validate the pattern recognition system for Delilah V3.0.
