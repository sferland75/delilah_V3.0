# How to Use Enhanced Pattern Recognition

This guide provides step-by-step instructions for using the enhanced pattern recognition system in Delilah V3.0.

## Table of Contents

1. [Setup and Initialization](#setup-and-initialization)
2. [Processing Documents](#processing-documents)
3. [Reviewing Extraction Results](#reviewing-extraction-results)
4. [Training the System](#training-the-system)
5. [Monitoring Extraction Quality](#monitoring-extraction-quality)
6. [Troubleshooting](#troubleshooting)
7. [Advanced Usage](#advanced-usage)

## Setup and Initialization

### Installing Dependencies

Ensure you have all required dependencies:

```bash
cd d:\delilah_V3.0
npm install nanoid
```

### Initializing the System

```javascript
const { initializeEnhancedSystem } = require('./src/utils/pdf-import/index-enhanced');

async function setup() {
  // Initialize the enhanced system
  const enhancedSystem = await initializeEnhancedSystem();
  
  // Store the system for later use
  global.enhancedSystem = enhancedSystem;
  
  console.log('Enhanced pattern recognition system initialized successfully');
}

setup();
```

## Processing Documents

### Basic Document Processing

```javascript
async function processDocument(documentText) {
  // Get the initialized system
  const enhancedSystem = global.enhancedSystem;
  
  // Process the document
  const result = enhancedSystem.processDocument(documentText);
  
  // Enhance with NLP
  const enhancedResult = enhancedSystem.enhanceWithNLP(result);
  
  return enhancedResult;
}
```

### Processing Documents from Files

```javascript
const fs = require('fs').promises;

async function processDocumentFile(filePath) {
  // Read the file
  const documentText = await fs.readFile(filePath, 'utf8');
  
  // Process the document
  return await processDocument(documentText);
}
```

## Reviewing Extraction Results

### Basic Result Review

```javascript
function reviewExtractionResults(extractionResult) {
  console.log('----- EXTRACTION RESULTS SUMMARY -----');
  console.log(`Document Type: ${extractionResult._documentType}`);
  console.log(`Document Confidence: ${extractionResult._documentConfidence.toFixed(2)}`);
  
  // Print section summaries
  console.log('\nExtracted Sections:');
  
  // Demographics
  if (extractionResult.DEMOGRAPHICS) {
    console.log('\nDEMOGRAPHICS:');
    if (extractionResult.DEMOGRAPHICS.name) console.log(`  - Name: ${extractionResult.DEMOGRAPHICS.name}`);
    if (extractionResult.DEMOGRAPHICS.dateOfLoss) console.log(`  - Date of Loss: ${extractionResult.DEMOGRAPHICS.dateOfLoss}`);
    if (extractionResult.DEMOGRAPHICS.address) console.log(`  - Address: ${extractionResult.DEMOGRAPHICS.address}`);
    if (extractionResult.DEMOGRAPHICS.telephone) console.log(`  - Telephone: ${extractionResult.DEMOGRAPHICS.telephone}`);
    if (extractionResult.DEMOGRAPHICS.claimNumber) console.log(`  - Claim Number: ${extractionResult.DEMOGRAPHICS.claimNumber}`);
  }
  
  // Attendant Care
  if (extractionResult.ATTENDANT_CARE) {
    console.log('\nATTENDANT CARE:');
    if (extractionResult.ATTENDANT_CARE.hoursPerWeek) console.log(`  - Hours Per Week: ${extractionResult.ATTENDANT_CARE.hoursPerWeek}`);
    if (extractionResult.ATTENDANT_CARE.monthlyCost) console.log(`  - Monthly Cost: $${extractionResult.ATTENDANT_CARE.monthlyCost}`);
    if (extractionResult.ATTENDANT_CARE.careType) console.log(`  - Care Type: ${extractionResult.ATTENDANT_CARE.careType}`);
  }
}
```

### Advanced Result Review

For a more comprehensive review, including confidence scores and NLP analysis:

```javascript
function advancedResultReview(extractionResult) {
  // Basic review
  reviewExtractionResults(extractionResult);
  
  // Confidence scores
  console.log('\nConfidence Scores:');
  Object.keys(extractionResult).forEach(section => {
    if (section.startsWith('_')) return;
    
    const sectionData = extractionResult[section];
    if (!sectionData || !sectionData.confidence) return;
    
    console.log(`\n${section} Confidence Scores:`);
    Object.entries(sectionData.confidence).forEach(([field, confidence]) => {
      const confidenceLevel = confidence >= 0.8 ? 'High' : confidence >= 0.5 ? 'Medium' : 'Low';
      console.log(`  - ${field}: ${(confidence * 100).toFixed(0)}% (${confidenceLevel})`);
    });
  });
  
  // NLP analysis
  if (extractionResult._nlpAnalysis) {
    console.log('\nNLP Analysis:');
    
    // Entity relationships
    const entityRelationships = extractionResult._nlpAnalysis.entityRelationships;
    if (entityRelationships && Object.keys(entityRelationships).length > 0) {
      console.log('\nEntity Relationships:');
      Object.entries(entityRelationships).forEach(([section, data]) => {
        console.log(`\n${section}:`);
        
        if (data.entities && data.entities.length > 0) {
          console.log('  Entities:');
          data.entities.forEach(entity => {
            console.log(`    - ${entity.type}: ${entity.value} (${(entity.confidence * 100).toFixed(0)}%)`);
          });
        }
        
        if (data.relationships && data.relationships.length > 0) {
          console.log('  Relationships:');
          data.relationships.forEach(rel => {
            console.log(`    - ${rel.source} ${rel.type} ${rel.target} (${(rel.confidence * 100).toFixed(0)}%)`);
          });
        }
      });
    }
    
    // Severity analysis
    const severityAnalysis = extractionResult._nlpAnalysis.severity;
    if (severityAnalysis && Object.keys(severityAnalysis).length > 0) {
      console.log('\nSeverity Analysis:');
      Object.entries(severityAnalysis).forEach(([section, data]) => {
        console.log(`\n${section}:`);
        
        if (data.overall) {
          console.log(`  Overall: ${data.overall.term} (Level ${data.overall.level})`);
        }
        
        if (data.specific && Object.keys(data.specific).length > 0) {
          console.log('  Specific:');
          Object.entries(data.specific).forEach(([condition, severity]) => {
            console.log(`    - ${condition}: ${severity.term} (Level ${severity.level})`);
          });
        }
      });
    }
  }
}
```

## Training the System

### Basic Training

```javascript
async function trainSystem(originalExtraction, correctedData, documentType = 'OT_ASSESSMENT') {
  // Get the initialized system
  const enhancedSystem = global.enhancedSystem;
  
  // Train the system
  const trainingRecord = await enhancedSystem.trainWithCorrection(
    originalExtraction,
    correctedData,
    documentType
  );
  
  console.log(`Training completed: ${trainingRecord.id}`);
  console.log(`Fields improved: ${Object.keys(trainingRecord.differences).length}`);
  
  return trainingRecord;
}
```

### Creating Corrected Data

```javascript
function createCorrectedData(originalExtraction) {
  // Clone the original extraction
  const correctedData = JSON.parse(JSON.stringify(originalExtraction));
  
  // Make corrections as needed
  // For example, fix a name:
  if (correctedData.DEMOGRAPHICS) {
    correctedData.DEMOGRAPHICS.name = 'Mr. John Smith';
  }
  
  // Add missing data
  if (!correctedData.ATTENDANT_CARE) {
    correctedData.ATTENDANT_CARE = {
      hoursPerWeek: 10,
      monthlyCost: 650.75,
      careType: 'Personal care assistance'
    };
  }
  
  return correctedData;
}
```

## Monitoring Extraction Quality

### Tracking Confidence Scores

```javascript
function trackConfidenceScores(extractionResults) {
  // Calculate average confidence by section
  const sectionConfidence = {};
  
  extractionResults.forEach(result => {
    Object.keys(result).forEach(section => {
      if (section.startsWith('_') || !result[section] || !result[section].confidence) return;
      
      if (!sectionConfidence[section]) {
        sectionConfidence[section] = {
          totalConfidence: 0,
          count: 0
        };
      }
      
      // Sum up field confidence scores
      let sectionTotal = 0;
      let fieldCount = 0;
      
      Object.values(result[section].confidence).forEach(confidence => {
        sectionTotal += confidence;
        fieldCount++;
      });
      
      if (fieldCount > 0) {
        const avgConfidence = sectionTotal / fieldCount;
        sectionConfidence[section].totalConfidence += avgConfidence;
        sectionConfidence[section].count++;
      }
    });
  });
  
  // Calculate averages
  console.log('\nAverage Confidence Scores:');
  Object.entries(sectionConfidence).forEach(([section, data]) => {
    if (data.count > 0) {
      const avgConfidence = data.totalConfidence / data.count;
      console.log(`  - ${section}: ${(avgConfidence * 100).toFixed(1)}%`);
    }
  });
}
```

### Tracking Improvement Over Time

```javascript
function trackImprovementOverTime(trainingRecords) {
  // Group by section
  const sectionImprovement = {};
  
  trainingRecords.forEach((record, index) => {
    const { differences } = record;
    
    Object.keys(differences).forEach(section => {
      if (!sectionImprovement[section]) {
        sectionImprovement[section] = {
          totalCorrections: 0,
          records: []
        };
      }
      
      // Count field corrections
      const fieldCorrections = Object.keys(differences[section].fields).length;
      sectionImprovement[section].totalCorrections += fieldCorrections;
      
      // Add to records
      sectionImprovement[section].records.push({
        index,
        corrections: fieldCorrections
      });
    });
  });
  
  // Print improvement by section
  console.log('\nImprovement Over Time:');
  Object.entries(sectionImprovement).forEach(([section, data]) => {
    console.log(`\n${section}:`);
    console.log(`  - Total Corrections: ${data.totalCorrections}`);
    
    // Print trend
    if (data.records.length > 1) {
      const firstCorrections = data.records[0].corrections;
      const lastCorrections = data.records[data.records.length - 1].corrections;
      
      const trend = lastCorrections < firstCorrections ? 'Improving' : 'Needs attention';
      console.log(`  - Trend: ${trend}`);
    }
  });
}
```

## Troubleshooting

### Low Confidence Extractions

If you're getting low confidence scores:

1. **Check document quality**: Ensure the document is text-based, not a scanned image
2. **Verify document type**: Confirm the document is being correctly classified
3. **Review patterns**: Check if the document follows expected formatting
4. **Train the system**: Make corrections and train the system to improve future extractions

### Missing Sections

If sections are missing from the extraction:

1. **Check section headers**: Ensure section headers are clearly identifiable
2. **Verify section content**: Make sure sections have enough content to extract
3. **Add custom patterns**: Define custom patterns for specific document types
4. **Increase section confidence threshold**: Lower the threshold for section detection

### Extraction Errors

If extraction produces incorrect results:

1. **Check document structure**: Verify the document follows expected formatting
2. **Review confidence scores**: Low confidence may indicate potential errors
3. **Make corrections**: Correct the errors and train the system
4. **Check for ambiguities**: Ensure the document doesn't contain ambiguous information

## Advanced Usage

### Custom Document Types

To add support for a new document type:

1. Create a specialized extractor for the document type:

```javascript
// MyDocumentTypeExtractor.js
class MyDocumentTypeExtractor {
  static extract(text) {
    // Implement extraction logic
    return {
      _documentType: 'MY_DOCUMENT_TYPE',
      _documentConfidence: 0.9,
      // Section data
    };
  }
}

module.exports = MyDocumentTypeExtractor;
```

2. Register the document type with the DocumentClassifier:

```javascript
// Add to DocumentClassifier.js classifiers array
{
  type: 'MY_DOCUMENT_TYPE',
  patterns: [
    /my document type/i,
    /specific pattern for my document/i
  ],
  sections: [
    'SECTION_1',
    'SECTION_2'
  ],
  weight: 1.0
}
```

3. Add the extractor to the enhanced system:

```javascript
// In index-enhanced.js
// Add to extractors object
MY_DOCUMENT_TYPE: EnhancedExtractor.enhance(MyDocumentTypeExtractor, 'MY_DOCUMENT_TYPE')
```

### Custom Pattern Generation

To generate custom patterns for specific fields:

```javascript
function generateCustomPatterns(field, examples) {
  const patterns = [];
  
  examples.forEach(example => {
    // Create pattern variations
    patterns.push({
      pattern: `\\b${example.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`,
      confidence: 0.9,
      description: `Exact match for ${field}`
    });
    
    // Add context-based patterns
    if (example.includes(' ')) {
      const words = example.split(' ');
      if (words.length > 1) {
        const firstWords = words.slice(0, 2).join(' ').replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        patterns.push({
          pattern: `\\b${firstWords}\\b`,
          confidence: 0.7,
          description: `Partial match for ${field}`
        });
      }
    }
  });
  
  return patterns;
}
```

### Batch Processing

For processing multiple documents in batch:

```javascript
async function batchProcess(filePaths) {
  const results = [];
  
  for (const filePath of filePaths) {
    try {
      console.log(`Processing ${filePath}...`);
      const result = await processDocumentFile(filePath);
      results.push({
        filePath,
        result,
        success: true
      });
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error);
      results.push({
        filePath,
        error: error.message,
        success: false
      });
    }
  }
  
  // Summarize results
  const successCount = results.filter(r => r.success).length;
  console.log(`\nProcessed ${results.length} documents, ${successCount} successful`);
  
  return results;
}
```

### Cross-Section Validation

To perform advanced cross-section validation:

```javascript
function validateCrossSectionConsistency(extractionResult) {
  const validationResults = {
    issues: [],
    consistencyScore: 1.0
  };
  
  // Example: Check name consistency across sections
  const names = new Map();
  
  Object.keys(extractionResult).forEach(section => {
    if (section.startsWith('_')) return;
    
    const sectionData = extractionResult[section];
    if (!sectionData) return;
    
    // Look for name fields
    const nameFields = ['name', 'clientName', 'patientName', 'client', 'patient'];
    
    nameFields.forEach(field => {
      if (sectionData[field]) {
        const name = sectionData[field].trim();
        if (name) {
          if (!names.has(name)) {
            names.set(name, { count: 0, sections: [] });
          }
          
          const record = names.get(name);
          record.count++;
          record.sections.push(section);
        }
      }
    });
  });
  
  // Check for inconsistencies
  if (names.size > 1) {
    const nameEntries = Array.from(names.entries());
    const mostFrequentName = nameEntries.reduce((prev, current) => 
      prev[1].count > current[1].count ? prev : current
    );
    
    // Report inconsistencies
    nameEntries.forEach(([name, record]) => {
      if (name !== mostFrequentName[0]) {
        validationResults.issues.push({
          type: 'name_inconsistency',
          message: `Inconsistent name: "${name}" found in ${record.sections.join(', ')}. Most frequent name is "${mostFrequentName[0]}".`,
          severity: 'warning',
          sections: record.sections
        });
        
        // Reduce consistency score
        validationResults.consistencyScore -= 0.1;
      }
    });
  }
  
  // Add more cross-section validations as needed
  
  return validationResults;
}
```

By following this guide, you should be able to effectively use the enhanced pattern recognition system in Delilah V3.0 for accurate document data extraction.
