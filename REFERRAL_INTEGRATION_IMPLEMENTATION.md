# Referral Integration Implementation Guide

## Overview

The Referral Document Integration in Delilah V3.0 enables automatic extraction of key information from referral documents to populate assessment sections and provide context throughout the assessment process. This document details the implementation, architecture, and current status of the integration.

## Component Architecture

The referral integration system consists of the following key components:

### 1. Extraction Components

- **REFERRALExtractor.js**: The core extraction engine that parses referral document text and converts it to structured data.
- **ReferralConfidenceScorer.js**: Calculates confidence scores for extracted data through cross-validation and weighted scoring.
- **ReferralDetector.js**: Detects if a document is a referral document and identifies its sections.

### 2. Integration Components

- **referralIntegration.ts**: Maps extracted referral data across different assessment sections.
- **referralMapper.ts**: Handles bidirectional mapping between referral data and application data models.

### 3. UI Components

- **ReferralContext.tsx**: Displays referral information within assessment sections.
- **ReferralImport.tsx**: Provides interface for importing and processing referral documents.

## Data Flow

1. **Document Ingestion**:
   - User uploads PDF document
   - `ReferralDetector.js` determines if it's a referral document
   - Document text is extracted and sections are identified

2. **Data Extraction**:
   - `REFERRALExtractor.js` extracts structured data from each section
   - `ReferralConfidenceScorer.js` calculates confidence scores
   - Extracted data is mapped to application model

3. **Cross-Section Integration**:
   - `referralIntegration.ts` distributes data to appropriate sections
   - Client info → Demographics section
   - Assessment requirements → Purpose section
   - Injury date → Medical History section
   - Section-specific requirements → Relevant sections

4. **User Interaction**:
   - Extracted data is displayed in `ReferralContext.tsx` component
   - User validates and can modify extracted data
   - Confidence scores guide user to review low-confidence extractions

## Implementation Status

### Completed Components

1. **REFERRALExtractor.js**:
   - Implemented patterns for client information
   - Created extractors for assessment requirements
   - Added scheduling information extraction
   - Implemented reporting requirements extraction
   - Added referral source extraction

2. **ReferralConfidenceScorer.js**:
   - Implemented weighted confidence scoring
   - Added cross-validation between related fields
   - Created extraction method tracking
   - Implemented section-level confidence aggregation

3. **ReferralDetector.js**:
   - Implemented document type detection
   - Added section identification
   - Created mapping to application model

4. **referralIntegration.ts**:
   - Implemented cross-section integration
   - Added specific section requirements detection
   - Created demographic data integration
   - Implemented purpose data integration

### Integration Testing

- Created sample referral documents for testing
- Implemented basic extraction tests
- Added comprehensive integrations tests
- Created test environment setup script

### Known Issues

1. **Name Extraction**: The current regex pattern for name extraction captures too much text, sometimes including "DOB".
2. **Table Parsing**: Multi-line table entries are not parsed correctly, leading to fragmented appointment data.
3. **Test Suite Integration**: The full integration with the test suite requires additional configuration.

## Usage Examples

### Extracting Referral Data

```javascript
const { processReferralDocument, mapReferralToApplicationModel } = require('./src/utils/pdf-import/ReferralDetector');

// Read document text
const documentText = fs.readFileSync('path/to/referral.txt', 'utf8');

// Process the document
const processedData = processReferralDocument(documentText);

// Map to application model
const appModel = mapReferralToApplicationModel(processedData);

console.log('Client Name:', appModel.referral.client.name);
console.log('Assessment Types:', appModel.referral.assessmentTypes.join(', '));
```

### Integrating Across Sections

```typescript
import { integrateAcrossSections } from '../services/referralIntegration';

// Referral data from extractor
const referralData = processedData.data.REFERRAL;

// Current assessment data
const assessmentData = {
  demographics: { ... },
  purpose: { ... },
  medicalHistory: { ... },
  // Other sections...
};

// Integrate referral data across sections
const integratedData = integrateAcrossSections(referralData, assessmentData);

// Save updated assessment data
saveAssessment(integratedData);
```

## Next Steps

### Critical Improvements

1. **Refine Extraction Patterns**:
   - Fix name extraction regex to avoid capturing extra text
   - Improve table parsing for multi-line entries
   - Add more patterns for handling different referral document formats

2. **Test Suite Integration**:
   - Update Jest configuration for new components
   - Create proper mocks for referral data
   - Fix TypeScript interface issues

3. **Enhance Cross-Validation**:
   - Implement more sophisticated cross-field validation rules
   - Add context-aware confidence adjustments
   - Improve validation feedback for users

### Future Enhancements

1. **Machine Learning Integration**:
   - Train models on larger referral document datasets
   - Implement more adaptive pattern recognition
   - Add automatic learning from user corrections

2. **UI Enhancements**:
   - Create confidence visualization for extracted data
   - Add one-click correction for extracted fields
   - Implement side-by-side view of original and extracted data

3. **Additional Document Types**:
   - Extend detection for more referral sources
   - Add support for hospital discharge summaries
   - Implement extraction for clinical notes

## Development Guidelines

### Adding New Extraction Patterns

To add new patterns for field extraction:

1. Identify recurring patterns in referral documents
2. Add regex patterns to appropriate extraction functions
3. Assign appropriate confidence scores and extraction methods
4. Update cross-validation rules if necessary
5. Test with a variety of document formats

### Testing Extraction Accuracy

To test extraction accuracy:

1. Use the `run-simple-test.bat` script for quick validation
2. Add new sample documents to `public/data/sample-referrals/`
3. Update unit tests for new extraction patterns
4. Run integration tests with `npm test -- -t "referralIntegration"`
5. Verify cross-section integration with real assessment data

### Enhancing Confidence Scoring

To improve confidence scoring:

1. Analyze extraction failures and identify patterns
2. Adjust confidence weights in `ReferralConfidenceScorer.js`
3. Add new validation rules for cross-field verification
4. Update extraction method classification for better scoring
5. Test with documents that have known extraction challenges

## Conclusion

The Referral Document Integration implementation provides a solid foundation for automating the extraction and integration of referral data into the assessment process. While there are still improvements to be made, particularly in extraction accuracy and test suite integration, the current implementation demonstrates the viability of the approach and delivers significant value by reducing manual data entry and improving assessment context.

Future development should focus on refining extraction patterns, enhancing cross-validation, and improving the user experience around reviewing and correcting extracted data.
