# Referral Document Integration Guide

## Overview

The Referral Document Integration feature in Delilah V3.0 allows users to import referral documents, extract structured data from them, and use this information as context throughout the assessment process. This guide explains how the feature works and how to use it effectively.

## Key Components

### 1. Referral Document Processing

The system can detect and process referral documents uploaded by users. The processing pipeline includes:

- Extracting text from PDF documents
- Detecting if a document is a referral document
- Identifying sections within the referral document
- Extracting structured data from each section
- Mapping the extracted data to the application's data model

### 2. Referral Data Structure

Referral data is organized into the following structure:

```typescript
{
  client: {
    name: string,
    dateOfBirth: string,
    dateOfLoss: string,
    fileNumber: string,
    language: string,
    phoneNumbers: string[],
    address: string,
    email: string
  },
  assessmentTypes: string[],
  reportTypes: array,
  specificRequirements: string[],
  criteria: string[],
  domains: string[],
  appointments: array,
  reportDueDate: string,
  reportGuidelines: string[],
  referralSource: {
    organization: string,
    contactPerson: string,
    contactInfo: string
  }
}
```

### 3. Mapper Service

The `referralMapper.ts` service handles bidirectional mapping between the referral data and the application's context model. It also provides utility functions for:

- Syncing client data to demographics
- Extracting assessment requirements for the purpose section
- Checking for specific requirements

### 4. UI Components

The integration includes two main UI components:

- **ReferralImport**: A page for uploading and processing referral documents
- **ReferralContext**: A component that displays referral information in the assessment context

## Integration with Assessment Process

### Providing Context

The referral data provides valuable context for the assessment, including:

1. **Client Information**: Pre-populates demographics data
2. **Assessment Requirements**: Indicates what should be covered in the assessment
3. **Scheduling Information**: Shows appointment details
4. **Reporting Requirements**: Clarifies report formatting and due dates

### Cross-Section Integration

Referral data can be used across different assessment sections:

- **Demographics**: Client information from the referral
- **Purpose**: Assessment requirements from the referral
- **Medical History**: Health information from the referral
- **Other Sections**: Specific requirements relevant to each section

## Technical Implementation

### PDF Processing

The system uses PDF.js for extracting text from PDF documents. The configuration ensures proper font handling and text extraction.

### Pattern Recognition

The pattern recognition system includes:

- **ReferralDetector**: Determines if a document is a referral document
- **REFERRALExtractor**: Extracts structured data from referral documents
- **ReferralPatterns**: Defines patterns for identifying sections and data points

### Confidence Scoring

Each extracted data point includes a confidence score, indicating how certain the system is about the extraction. The UI presents this information to help users validate the data.

## How to Use

### Importing a Referral Document

1. Navigate to the "Import Referral" page
2. Upload a referral document (PDF format)
3. Review the extracted information
4. Import the referral into your assessment

### Accessing Referral Information

Once imported, referral information is available throughout the assessment process:

- The ReferralContext component displays referral information
- Demographic information is pre-populated from the referral
- Assessment requirements appear in the purpose section
- Other sections reference specific requirements from the referral

### Using Referral Context

When writing assessment sections, refer to the referral information to ensure you address:

- Specific domains mentioned in the referral
- Criteria specified by the referral source
- Report formatting requirements
- Due dates and submission guidelines

## Best Practices

1. **Import Early**: Import the referral document at the beginning of the assessment process
2. **Verify Data**: Always verify extracted information for accuracy
3. **Address Requirements**: Explicitly address all requirements mentioned in the referral
4. **Check Confidence**: Pay special attention to data with low confidence scores
5. **Supplement Manually**: Add any missing information that wasn't extracted automatically

## Troubleshooting

- **Document Not Recognized**: Ensure the document is a valid referral document from a supported format
- **Missing Information**: Check if the information is present in the original document
- **Low Confidence Scores**: Manually verify and correct information with low confidence scores
- **Font Issues**: If you see font warnings, they're generally harmless and don't affect extraction quality

## Future Enhancements

Planned enhancements to the referral integration include:

1. **Support for More Sources**: Expand pattern recognition to include more referral sources
2. **Machine Learning**: Improve extraction accuracy through machine learning
3. **Interactive Correction**: Allow users to correct extracted data directly
4. **Multi-Document Support**: Handle multiple referral documents for the same assessment
5. **Expanded Data Extraction**: Extract more detailed information from referral documents

## Conclusion

The Referral Document Integration feature streamlines the assessment process by automatically extracting and utilizing information from referral documents. This reduces manual data entry, ensures all requirements are addressed, and provides valuable context throughout the assessment workflow.
