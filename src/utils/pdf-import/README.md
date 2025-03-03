# Enhanced Pattern Recognition System

This directory contains the enhanced pattern recognition system for Delilah V3.0's PDF import functionality. The system features trainable pattern recognition, document classification, and advanced NLP extraction capabilities.

## Main Components

- **Enhanced Pattern Matcher**: Improves pattern matching with fuzzy matching and learning capabilities
- **Pattern Training Service**: Enables the system to learn from user corrections
- **Document Classifier**: Identifies document types to optimize pattern selection
- **NLP Extractor**: Provides advanced text extraction using natural language processing

## Getting Started

To use the enhanced pattern recognition system:

```javascript
const { initializeEnhancedSystem } = require('./utils/pdf-import/index-enhanced');

// Initialize the system
const enhancedSystem = await initializeEnhancedSystem();

// Process a document
const result = enhancedSystem.processDocument(documentText);

// Train the system with corrections
const trainingRecord = await enhancedSystem.trainWithCorrection(
  originalExtraction,
  correctedData,
  documentType
);

// Enhance extraction with NLP capabilities
const enhancedResult = enhancedSystem.enhanceWithNLP(extractionResult);
```

## Directory Structure

- `PatternMatcher.js` - Original pattern matcher
- `EnhancedPatternMatcher.js` - Enhanced pattern matcher with learning capabilities
- `PatternTrainingService.js` - Service for training pattern recognition
- `DocumentClassifier.js` - Document type classification service
- `NLPExtractor.js` - Advanced text extraction using NLP
- `training-data/` - Directory for storing training data
- `*Extractor.js` - Individual section extractors
- `index-enhanced.js` - Entry point for the enhanced system

## Pattern Training Workflow

1. **Document Import**: Import a document with pattern recognition
2. **Extraction Review**: Review extraction results for accuracy
3. **Correction**: Make corrections to any incorrectly extracted data
4. **Training Submission**: Submit corrections for training
5. **Pattern Improvement**: System updates patterns based on corrections
6. **Verification**: Test improved patterns on new documents

## Advanced Features

### Fuzzy Matching

The enhanced pattern matcher implements fuzzy matching to handle minor variations in text:

```javascript
const match = enhancedMatcher.matchWithTolerance(text, pattern, 0.2);
```

### Context-Aware Extraction

Extract data with surrounding context for better understanding:

```javascript
const result = enhancedMatcher.extractWithContext(text, patterns, 3);
```

### Document Classification

Automatically classify documents to optimize pattern selection:

```javascript
const classification = enhancedMatcher.classifyDocument(text);
```

### Cross-Section Validation

Validate data consistency across different sections:

```javascript
enhancedMatcher.crossValidateSections(results);
```

## Training Data Format

Training data is stored as JSON files with the following structure:

```json
{
  "id": "unique-id",
  "timestamp": "ISO-8601 timestamp",
  "documentType": "OT_ASSESSMENT",
  "originalExtraction": {
    // Original extraction result
  },
  "correctedData": {
    // User-corrected data
  },
  "differences": {
    // Calculated differences
  },
  "patternImprovements": {
    // Generated pattern improvements
  }
}
```

## NLP Capabilities

The NLP Extractor provides advanced extraction capabilities:

- **Entity Relationship Extraction**: Identify relationships between entities
- **Severity Classification**: Convert textual severity to numeric values
- **Temporal Information Extraction**: Extract dates, durations, and frequencies

## Contributing

When adding new features to the pattern recognition system:

1. Add unit tests for new pattern matchers
2. Update the documentation
3. Train the system with representative documents
4. Validate improvements with test cases
