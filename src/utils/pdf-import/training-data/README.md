# Pattern Recognition Training Data

This directory contains training data for improving the pattern recognition system's accuracy.

## Structure

Each training record is stored as a JSON file with the following structure:

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
    // Calculated differences between original and corrected
  },
  "patternImprovements": {
    // Generated pattern improvements
  }
}
```

## How Training Works

1. **Correction Recording**: When a user corrects extraction results, the system records both the original extraction and the corrected data.

2. **Difference Analysis**: The system calculates differences between the original and corrected data to identify where the extraction failed.

3. **Pattern Improvement**: Based on the differences, the system generates new patterns and weight adjustments.

4. **Training Application**: When the pattern matcher is initialized with training data, it applies these improvements to enhance extraction accuracy.

## Training Examples

Training data starts with examples of common correction patterns, such as:

- Correcting misidentified section boundaries
- Adding missing fields
- Fixing incorrect field values
- Adjusting confidence scores
- Generating new extraction patterns based on corrected data

## Adding Training Data

Training data can be added automatically through the PatternTrainingService or manually by adding JSON files to this directory.

## Training Metrics

The system tracks the following metrics for each training record:

- Number of corrections per section
- Percentage improvement in extraction accuracy
- Types of corrections made
- Pattern effectiveness after training

These metrics are used to continuously improve the pattern recognition system.
