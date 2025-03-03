# Advanced Pattern Recognition System

This directory contains the implementation of the advanced pattern recognition system based on statistical analysis of 91 documents. The system leverages data-driven patterns, statistical confidence scoring, and prioritized field extraction to improve the accuracy and efficiency of document processing.

## Implementation Components

### 1. Data-Driven Pattern Matcher

The core of the system is the `PatternMatcher.js` file, which is generated from statistical analysis data rather than using manually defined patterns. The `generatePatternMatcher.js` script processes the meta-analysis data and creates an optimized PatternMatcher with:

- Patterns sorted by effectiveness based on frequency
- Confidence scores calibrated using statistical data
- Contextual pattern matching with weighted confidence

### 2. Field Extraction Prioritization

The `BaseExtractor.js` class implements a prioritized field extraction strategy that:

- Categorizes fields into high, medium, low, and very low priority tiers based on success rates
- Applies different extraction strategies based on priority level
- Uses a fallback mechanism for difficult-to-extract fields

### 3. Section-Specific Extractors

Specialized extractors (e.g., `SYMPTOMSExtractor.js`) implement enhanced extraction techniques for specific sections:

- Custom pattern matching tailored to the section type
- Additional validation and post-processing
- Cross-reference between fields for improved accuracy

### 4. Adaptive Pattern Selection

The `ExtractorFactory.js` implements document classification and strategy selection:

- Classifies documents based on type, structure, and complexity
- Adjusts confidence thresholds based on document characteristics
- Selects appropriate extraction strategies for each section

## Usage

### Generating Pattern Matcher

To generate the optimized PatternMatcher from analysis data:

```bash
node patterns/generate.js
```

This script:
1. Backs up the existing PatternMatcher.js
2. Processes the meta-analysis data
3. Generates a new PatternMatcher.js with optimized patterns
4. Verifies the new implementation

### Extracting Data from Documents

To use the new system in code:

```javascript
const PatternMatcher = require('../utils/pdf-import/PatternMatcher');
const ExtractorFactory = require('../utils/pdf-import/patterns/ExtractorFactory');

// Detect sections in a document
const matcher = new PatternMatcher();
const sections = matcher.detectSections(pdfText);

// Classify document for optimal extraction
const classification = ExtractorFactory.classifyDocument(pdfText);

// Extract data from all sections
const extractionResults = ExtractorFactory.extractAllSections(sections, {
  documentType: classification.type,
  documentStructure: classification.structure
});

// Use the extracted data
console.log(extractionResults.DEMOGRAPHICS);
console.log(extractionResults.SYMPTOMS);
```

## Next Steps

1. Implement additional section-specific extractors for:
   - DEMOGRAPHICS
   - ENVIRONMENTAL
   - MEDICAL_HISTORY
   - ATTENDANT_CARE
   - FUNCTIONAL_STATUS
   - TYPICAL_DAY
   - ADLS

2. Enhance confidence scoring calibration:
   - Implement cross-validation with test corpus
   - Develop confidence adjustment based on field correlations

3. Optimize for large document processing:
   - Implement parallel processing with worker threads
   - Create incremental processing for large files
   - Develop caching mechanism for pattern matching

## Dashboard

A visualization dashboard is available to monitor pattern effectiveness and field extraction success rates. To generate the dashboard:

```bash
node dashboard/generateDashboard.js
```

The dashboard shows:
- Section confidence scores
- Field extraction success rates
- Pattern effectiveness metrics
- Document processing statistics

The dashboard is located at `pattern_repository/dashboard/index.html`.
