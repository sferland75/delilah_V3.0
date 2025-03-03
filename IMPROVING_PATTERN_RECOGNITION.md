# Improving Pattern Recognition Based on Form Mapping

This guide explains how to iteratively improve the pattern recognition system by analyzing how extracted data maps to form fields and making adjustments accordingly.

## Observing Data Mapping

The first step in improving pattern recognition is to observe how extracted data maps to your form fields:

1. **Upload various PDF documents** through the Import Assessment page
2. **Review the extracted data** and note which fields have:
   - Correct data with high confidence
   - Correct data with low confidence
   - Incorrect data
   - Missing data

3. **Save assessments** and observe how the data populates the form fields

## Analyzing Pattern Recognition Issues

After observing how data maps to form fields, identify common patterns of issues:

### 1. Fields with Consistently Low Confidence

If certain fields consistently show low confidence scores (e.g., 33%):

- The extractor may not have enough patterns to recognize this data
- The section detection might be incorrect (data may appear in a different section)
- The field may use terminology different from your pattern matchers

### 2. Fields with Missing Data

If fields consistently have no data extracted:

- The data might not exist in the source documents
- The pattern recognition rules might not match the format of this data
- The data might be in an unexpected location

### 3. Fields with Incorrect Data

If fields consistently contain incorrect data:

- The pattern matcher might be too broad (capturing unrelated text)
- There might be conflicting patterns causing confusion
- The document structure might differ from what the extractor expects

## Improving the Pattern Recognition System

Based on your analysis, here are steps to improve the system:

### 1. Enhance Section Extractors

For each problematic section, update the extractor patterns in the appropriate files:

```javascript
// Example: Update DEMOGRAPHICSExtractor.js to improve name recognition
const namePatterns = [
  // Existing patterns
  { regex: /name(?:\s*:|of)\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/i, confidence: 0.8 },
  
  // Add new patterns based on your document format
  { regex: /patient(?:\s*:|information):\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/i, confidence: 0.8 },
  { regex: /client:\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/i, confidence: 0.8 }
];
```

### 2. Adjust Confidence Thresholds

Update the confidence thresholds based on observed accuracy:

```javascript
// For fields that are usually accurate but have low confidence
if (this.calculatePatternStrength(match) > 0.5) {
  confidence = 0.8; // Increase confidence for strong pattern matches
}
```

### 3. Add Domain-Specific Keywords

Expand the keyword lists for each extractor based on your specific document formats:

```javascript
// Add domain-specific keywords to improve symptom detection
this.symptomKeywords = [
  // Existing keywords
  'pain', 'discomfort', 'ache',
  
  // Add new keywords based on your documents
  'difficulty', 'unable to', 'limitation', 'restricted'
];
```

### 4. Add Cross-Section References

If data is often found in unexpected sections, add cross-section references:

```javascript
// Extract medical conditions from multiple sections
extractMedicalConditions(text, allSections) {
  let conditions = [];
  
  // Check primary section
  conditions = this.extractConditionsFromSection(text);
  
  // Check other sections that might contain condition info
  if (allSections.SYMPTOMS) {
    const symptomConditions = this.extractConditionsFromSymptoms(allSections.SYMPTOMS);
    conditions = [...conditions, ...symptomConditions];
  }
  
  return conditions;
}
```

## Creating Targeted Training Sets

For systematic improvement:

1. **Create a training directory** with documents that represent different formats
2. **Run the analysis scripts** on these documents:
   ```
   node analyze_pdfs.js ./training_documents/
   ```
3. **Review analysis output** to identify patterns and missing rules
4. **Update the pattern matchers** based on the analysis

## Template Patterns for Common Fields

For commonly problematic fields, here are template patterns to add:

### Client Name

```javascript
const namePatterns = [
  { regex: /(?:client|patient|name of)(?:\s*:|\s*is|\s*-)\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/i, confidence: 0.8 },
  { regex: /[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3},?\s+(?:is a|was|has been|was referred)/i, confidence: 0.7 }
];
```

### Medical Conditions

```javascript
const conditionPatterns = [
  { regex: /(?:diagnosis|condition|medical history|diagnoses)(?:\s*:|\s*-)\s*([^.]+)/i, confidence: 0.8 },
  { regex: /(?:diagnosed with|suffers from|history of)(?:\s*:|\s*-)?\s*([^.]+)/i, confidence: 0.7 }
];
```

### Home Environment

```javascript
const homePatterns = [
  { regex: /(?:lives in|resides in|home is|residence is|dwelling is)(?:\s*a)?\s*([^.]+)/i, confidence: 0.8 },
  { regex: /(?:home|residence|dwelling|housing)(?:\s*:|\s*-|\s*type\s*:)?\s*([^.]+)/i, confidence: 0.7 }
];
```

## Monitoring and Continuous Improvement

To maintain and continuously improve the system:

1. **Keep a log of problematic documents** to identify trends
2. **Periodically re-analyze** the expanded document set
3. **Track confidence scores** over time to measure improvements
4. **Get user feedback** on extraction accuracy to identify areas needing attention

## When to Retrain vs. When to Adjust Rules

- **Retrain** when you have a significant number of new document formats
- **Adjust rules** for specific issues with consistent patterns
- **Add new extractors** for entirely new section types or document formats
- **Modify confidence scoring** when the system is consistently under or over-confident

## Example Improvement Workflow

1. **Observe**: Demographics data is often missing or has low confidence
2. **Analyze**: Review sample documents to see how demographics are formatted
3. **Modify**: Update the DEMOGRAPHICSExtractor with new patterns
4. **Test**: Process the same documents again to verify improvement
5. **Implement**: Apply changes to the production system
6. **Monitor**: Track confidence scores and user corrections over time

By following this iterative process, you can continuously improve the pattern recognition system based on how data maps to your form fields.
