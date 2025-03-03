# PDF Import Troubleshooting Guide

## Overview

This guide provides solutions for common issues encountered when using Delilah V3.0's PDF import functionality. Whether you're using the standard import or enhanced intelligent import, these tips will help you achieve optimal results.

## Common Issues and Solutions

### No Data Extracted

**Issue**: The system fails to extract any data from your PDF document.

**Possible causes and solutions**:

1. **Incorrect Document Format**
   - Ensure your document is a text-based PDF, not just a scanned image
   - Check that the PDF has selectable text (try copying text from the PDF)
   - If using a scanned document, run it through OCR software first

2. **Missing Recognizable Sections**
   - Ensure your document has clear section headers
   - Format section titles to stand out (e.g., larger font, bold, on separate lines)
   - Use standard OT assessment terminology for section headers

3. **Font/Encoding Issues**
   - Some PDF fonts may not be properly recognized
   - Try converting the PDF to a standard font using Adobe Acrobat or similar tools
   - Save as PDF/A format if possible for better text extraction

### "Unable to Extract Data" Error Messages

**Problem**: You see specific error messages like "adls is not defined" or other technical errors.

**Solutions**:
1. Try the Enhanced Import feature which has better error handling
2. Check that your document follows a structure similar to standard OT assessments
3. If errors persist, report the specific error message to the development team

### Low Confidence Scores

**Issue**: Data is extracted but with very low confidence scores.

**Solutions**:
1. Look at the extracted data carefully before importing - it may require manual verification
2. Check if your document has clear, standard terminology for assessment sections
3. Consider using the Enhanced Import which provides better pattern recognition

### Missing Information Warnings

**Issue**: The system flags multiple missing fields in the Missing Information panel.

**This is actually a helpful feature!** The system is identifying critical information that should be in your assessment. For best results:

1. Consider completing the identified missing fields manually after import
2. In future assessments, ensure these critical fields are included in your documents
3. Pay attention to "High importance" fields as they are essential for comprehensive assessments

### Incorrect Data Extraction

**Issue**: The system extracts data but places it in the wrong fields.

**Solutions**:
1. Look for ambiguous wording in your document that might be confusing the pattern recognition
2. Try the Enhanced Import which has better context-aware extraction
3. Use clearer section labeling in future documents
4. Review and edit extracted data before finalizing the import

## Optimizing Your Documents for Import

For best results with automated extraction:

1. **Clear Section Headers**: Use standard, recognizable section headers for key assessment areas
2. **Consistent Formatting**: Maintain consistent formatting for similar types of information
3. **Standard Terminology**: Use standard OT terminology for symptoms, conditions, and assessments
4. **Text-Based PDFs**: Ensure documents are text-based and not just scanned images
5. **Complete Information**: Include all critical assessment fields (see Missing Information panel for guidance)
6. **Structured Content**: Organize information in a logical, hierarchical structure

## Document Structure Best Practices

The pattern recognition system works best with documents that follow this general structure:

```
DEMOGRAPHICS
[Patient information, contact details, date of birth, etc.]

MEDICAL HISTORY
[Conditions, medications, surgeries, etc.]

SYMPTOMS ASSESSMENT
[Physical symptoms, cognitive symptoms, emotional symptoms]

FUNCTIONAL STATUS
[Mobility status, limitations, assistive devices, etc.]

TYPICAL DAY
[Morning routines, afternoon activities, evening routines]

ENVIRONMENTAL ASSESSMENT
[Home type, barriers, safety issues, etc.]

ACTIVITIES OF DAILY LIVING
[Self-care abilities, instrumental activities, etc.]

ATTENDANT CARE
[Care needs, hours, caregiver information, etc.]

PURPOSE & METHODOLOGY
[Assessment purpose, methods used, tools, etc.]
```

## Advanced Troubleshooting

If you continue to experience issues with PDF imports:

1. Try using the "Show section details" option when reviewing extracted data
2. Look at the confidence scores for specific fields to identify problematic areas
3. Consider reformatting your documents to better match the expected structure
4. For documents that consistently fail extraction, provide feedback to help improve the system

## Getting Help

If you've tried the suggestions in this guide but still face issues:

1. Document the specific error messages or problems you encounter
2. Note which sections are successfully extracted and which are problematic
3. Share examples of documents that work well and those that don't
4. Contact technical support with these details for further assistance

Remember that the pattern recognition system improves over time as it processes more documents and receives feedback from users.
