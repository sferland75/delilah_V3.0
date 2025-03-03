# Pattern Recognition System: Developer's Guide

## Introduction

This guide provides information for developers working on the Delilah V3.0 Pattern Recognition System. It explains the architecture, how to extend or modify patterns, and best practices for maintaining the system.

## System Architecture

The Pattern Recognition System consists of the following key components:

### 1. PatternMatcher

**Purpose**: Detects sections in documents and classifies them by type.

**Location**: `src/utils/pdf-import/PatternMatcher.js`

**Key Functions**:
- `detectSections(text)`: Identifies sections in a document
- `detectSectionStart(line, lineIndex, allLines)`: Detects the start of a new section
- `classifyDocument(text)`: Determines document type and structure
- `selectPatternStrategy(classification)`: Chooses optimal pattern matching strategy

### 2. Section-Specific Extractors

**Purpose**: Extract structured data from specific section types.

**Location**: `src/utils/pdf-import/patterns/[SECTION]Extractor.js`

**Available Extractors**:
- `DEMOGRAPHICSExtractor.js`
- `SYMPTOMSExtractor.js`
- `MEDICAL_HISTORYExtractor.js`
- `ENVIRONMENTALExtractor.js`
- `ATTENDANT_CAREExtractor.js`
- `FUNCTIONAL_STATUSExtractor.js`
- `TYPICAL_DAYExtractor.js`
- `ADLSExtractor.js`

### 3. BaseExtractor

**Purpose**: Provides common extraction functionality for all section types.

**Location**: `src/utils/pdf-import/patterns/BaseExtractor.js`

**Key Functions**:
- `extract(text, allSections)`: Main extraction method
- `extractPriorityFields(text, result, priority, allSections)`: Extracts fields by priority level
- `validateExtractions(result)`: Validates extracted data
- `computeConfidenceScores(result)`: Calculates confidence for extraction

### 4. ExtractorFactory

**Purpose**: Creates and manages the appropriate extractors for different sections.

**Location**: `src/utils/pdf-import/patterns/ExtractorFactory.js`

**Key Functions**:
- `getExtractor(sectionType, options)`: Creates extractor for a section type
- `extractSection(sectionType, text, options, allSections)`: Extracts data from a section
- `extractAllSections(sections, options)`: Processes all sections in a document

### 5. ExtractorUtils

**Purpose**: Provides common utilities for extractors.

**Location**: `src/utils/pdf-import/patterns/ExtractorUtils.js`

**Key Functions**:
- `getFieldPriorities()`: Returns field priority tiers
- `getExtractionStrategies()`: Returns extraction strategies by priority
- `getFieldConfidenceWeight(section, field)`: Returns statistical weight for confidence calculation
- `getExtractionMethods()`: Returns methods for extraction strategies

## How to Modify Patterns

### Adding/Modifying Section Detection Patterns

1. Open `PatternMatcher.js`
2. Locate the `sectionPatterns` object for the relevant section
3. Add or modify pattern entries:

```javascript
this.sectionPatterns = {
  "SECTION_NAME": [
    {
      "text": "pattern to match",
      "confidence": 0.5,  // Initial confidence (0-1)
      "frequency": 10     // How common this pattern is
    },
    // Add more patterns...
  ]
};
```

4. For stronger header detection, update the `sectionHeaders` object:

```javascript
this.sectionHeaders = {
  "SECTION_NAME": [
    /\b(?:explicit|header|patterns)\b/i,
    // Add more regex patterns...
  ]
};
```

### Adding/Modifying Field Extraction Patterns

1. Open the relevant `[SECTION]Extractor.js`
2. Locate the section-specific patterns object
3. Add or modify pattern entries:

```javascript
this.fieldPatterns = {
  fieldName: [
    { regex: /pattern to match (capturing group)(.*?)(?:\.|\n|$)/i, confidence: 0.8 },
    // Add more patterns...
  ]
};
```

4. Update keyword lists if necessary:

```javascript
this.fieldKeywords = [
  'keyword1', 'keyword2', 'phrase with spaces',
  // Add more keywords...
];
```

## How to Add a New Section Type

1. **Create a new extractor**:
   
   Create a new file `src/utils/pdf-import/patterns/NEW_SECTIONExtractor.js`:

```javascript
/**
 * NEW_SECTIONExtractor.js
 */

const BaseExtractor = require('./BaseExtractor');

class NEW_SECTIONExtractor extends BaseExtractor {
  constructor() {
    super('NEW_SECTION');
    
    // Section-specific patterns
    this.newSectionPatterns = {
      field1: [
        { regex: /pattern1 (.*?)(?:\.|\n|$)/i, confidence: 0.8 },
        { regex: /pattern2 (.*?)(?:\.|\n|$)/i, confidence: 0.7 }
      ],
      // Add more fields...
    };
    
    // Domain-specific keywords
    this.fieldKeywords = [
      // Add keywords...
    ];
  }
  
  extract(text, allSections = {}) {
    // Use base extractor
    const result = super.extract(text, allSections);
    
    // Additional extraction techniques
    this.extractField1(text, result);
    this.extractField2(text, result);
    
    // Validation
    this.validateData(result);
    
    return result;
  }
  
  // Add custom extraction methods...
  
  extractField1(text, result) {
    // Implementation...
  }
  
  validateData(result) {
    // Implementation...
  }
}

module.exports = NEW_SECTIONExtractor;
```

2. **Add patterns to PatternMatcher**:

   Update `PatternMatcher.js` to include patterns for the new section:

```javascript
this.sectionPatterns = {
  // Existing sections...
  
  "NEW_SECTION": [
    {
      "text": "new section pattern",
      "confidence": 0.4,
      "frequency": 5
    },
    // Add more patterns...
  ]
};

this.sectionHeaders = {
  // Existing headers...
  
  "NEW_SECTION": [
    /\b(?:new|section|headers)\b/i,
    // Add more regex patterns...
  ]
};

this.sectionProximity = {
  // Existing proximity...
  
  "NEW_SECTION": ["RELATED_SECTION1", "RELATED_SECTION2"],
  // Update related sections to include NEW_SECTION
};
```

3. **Update ExtractorFactory**:

   Modify `ExtractorFactory.js` to instantiate your new extractor:

```javascript
const NEW_SECTIONExtractor = require('./NEW_SECTIONExtractor');

class ExtractorFactory {
  static getExtractor(sectionType, options = {}) {
    switch (sectionType) {
      // Existing cases...
      
      case 'NEW_SECTION':
        return new NEW_SECTIONExtractor();
      
      default:
        return new BaseExtractor(sectionType);
    }
  }
}
```

## Testing and Validation

### Running Tests

1. **Test the Entire System**:

```bash
node src/utils/pdf-import/runImplementation.js
```

2. **Test with Specific Documents**:

```javascript
// In a test script
const PatternMatcher = require('./src/utils/pdf-import/PatternMatcher');
const ExtractorFactory = require('./src/utils/pdf-import/patterns/ExtractorFactory');

const text = fs.readFileSync('path/to/test/document.txt', 'utf-8');
const matcher = new PatternMatcher();
const sections = matcher.detectSections(text);
console.log(sections);

const extractionResults = ExtractorFactory.extractAllSections(sections);
console.log(extractionResults);
```

### Common Issues and Fixes

1. **Low Confidence in Section Detection**:
   - Add more specific patterns for the section
   - Increase pattern frequency for common patterns
   - Add explicit section headers with strong regex patterns

2. **False Positive Matches**:
   - Increase confidence threshold
   - Make patterns more specific
   - Add penalties for generic text

3. **Missing Fields in Extraction**:
   - Add more varied extraction patterns
   - Check for alternate phrasings or synonyms
   - Add contextual extraction methods

4. **Inconsistent Extraction**:
   - Add validation between related fields
   - Implement cross-section references
   - Add post-processing to normalize extracted data

## Performance Optimization

For large documents or batch processing:

1. **Cache common pattern matches**:

```javascript
// Add a pattern cache
this.patternCache = new Map();

// In your pattern matching function
const cacheKey = `${pattern.text}:${line}`;
if (this.patternCache.has(cacheKey)) {
  return this.patternCache.get(cacheKey);
}

const result = /* pattern matching logic */;
this.patternCache.set(cacheKey, result);
return result;
```

2. **Use more efficient regex patterns**:
   - Avoid excessive backtracking
   - Use non-capturing groups `(?:...)` when capture not needed
   - Consider using RegExp.test() instead of String.match() for yes/no checks

3. **Process sections in parallel**:

```javascript
async extractAllSectionsParallel(sections, options) {
  // Collect section content for cross-referencing
  const allSectionContent = {};
  sections.forEach(section => {
    allSectionContent[section.section] = section.content;
  });
  
  // Process sections in parallel
  const results = await Promise.all(sections.map(section => {
    return new Promise(resolve => {
      const sectionResult = this.extractSection(
        section.section,
        section.content,
        options,
        allSectionContent
      );
      resolve({ section: section.section, result: sectionResult });
    });
  }));
  
  // Combine results
  const combinedResults = {};
  results.forEach(r => {
    combinedResults[r.section] = r.result;
  });
  
  return combinedResults;
}
```

## Conclusion

The Pattern Recognition System is designed to be extensible and maintainable. By following the patterns and practices outlined in this guide, you can modify and extend the system to accommodate new requirements while maintaining consistency and reliability.

For further questions or assistance, consult the implementation documentation or contact the development team.
