# Pattern Recognition Repository

This repository contains pattern recognition data and analysis results from processing In-Home Assessment (IHA) documents.

## Directory Structure

- `/expanded_dataset/` - Contains results from processing the expanded dataset of 50+ IHA documents
  - `meta_analysis.json` - Comprehensive analysis of section detection across all documents
  - `summary_report.md` - Human-readable report of pattern recognition effectiveness
  - Individual JSON files for each processed document

## Expanded Dataset (March 2025)

The expanded dataset incorporates 50+ IHA documents to create a more comprehensive pattern recognition model. This expanded training set significantly improves:

1. **Section Detection** - More varied section header formats are now recognized
2. **Pattern Matching** - The system now identifies a wider range of patterns for each section
3. **Extraction Confidence** - With more examples, the system better evaluates its confidence in extracted data

### Key Improvements

The expanded dataset helps the pattern recognition system handle:

- Different document structures and layouts
- Various terminology used by different practitioners
- Regional and organizational variations in assessment formats
- Different documentation styles and conventions

### Usage

The pattern repository can be used to analyze:

- Most common section structures across IHA documents
- Typical content patterns within sections
- Confidence levels for different extraction tasks
- Recommended areas for improvement in pattern recognition

## Training Process

The training process analyzes each document and:

1. Detects document sections using multi-tier pattern matching
2. Extracts data from each section using specialized extractors
3. Calculates confidence scores for detection and extraction
4. Identifies the most effective patterns for each section
5. Generates comprehensive statistics on pattern effectiveness

## Generating Updated Results

To generate an updated pattern repository with newly added documents:

1. Place IHA documents (PDF and DOCX) in the `d:\delilah\IHAs` directory
2. Run the enhanced pattern recognition script:
   ```
   enhanced-pattern-recognition.bat
   ```
3. Review the summary report in the results directory

## Maintenance

The pattern repository should be updated periodically as new document formats are encountered to ensure the pattern recognition system continues to improve.
