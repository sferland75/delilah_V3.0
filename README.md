# Delilah V3.0

## Overview

Delilah V3.0 is a comprehensive assessment platform for Occupational Therapists, enabling detailed client evaluations, report generation, and data management. The application features integrated assessment sections, enhanced PDF import capabilities with intelligent pattern recognition, template management, and report drafting tools.

## Current Status

The application has undergone significant enhancements to the pattern recognition and data extraction systems. Recent improvements include:

- **Enhanced Pattern Recognition**: Implemented trainable pattern matching for better extraction accuracy
- **Document Classification**: Added automatic document type detection and classification
- **NLP-Enhanced Extraction**: Integrated natural language processing for advanced text understanding
- **Training Interface**: Developed UI for correcting extractions and training the system

For detailed documentation, see:
- [PATTERN_RECOGNITION_ENHANCEMENT.md](./PATTERN_RECOGNITION_ENHANCEMENT.md): Details on enhanced pattern recognition
- [PDF_PATTERN_RECOGNITION_README.md](./PDF_PATTERN_RECOGNITION_README.md): Comprehensive guide to PDF import features
- [INTELLIGENCE_FEATURES_IMPLEMENTATION.md](./INTELLIGENCE_FEATURES_IMPLEMENTATION.md): Implementation of intelligence features
- [HOW_TO_USE_PATTERN_RECOGNITION.md](./HOW_TO_USE_PATTERN_RECOGNITION.md): User guide for pattern recognition

## Key Features

- **Comprehensive Assessment Sections**: Complete suite of assessment tools covering initial assessment, medical history, symptoms, functional status, and more
- **Intelligent PDF Import**: Import and extract data from existing PDF documents with smart validation and suggestions
- **Trainable Pattern Recognition**: System that learns from user corrections to improve extraction accuracy
- **Document Classification**: Automatic identification of document types for optimized extraction
- **NLP-Enhanced Extraction**: Advanced text understanding for better data extraction
- **Report Drafting System**: Generate professional reports based on assessment data
- **Template Management**: Create, customize, and share report templates
- **Missing Information Detection**: AI-powered identification of critical missing information in assessments
- **Cross-Section Validation**: Automated validation of data consistency across assessment sections

## Assessment Sections

The following assessment sections have been integrated:

1. **Initial Assessment**: Basic information and demographics
2. **Purpose and Methodology**: Assessment purpose and methodological approach
3. **Medical History**: Client medical history and conditions
4. **Symptoms Assessment**: Physical, cognitive, and emotional symptoms
5. **Functional Status**: Current capabilities and limitations
6. **Typical Day**: Daily routines and activities
7. **Environmental Assessment**: Home and community environment evaluation
8. **Activities of Daily Living**: Self-care and daily living activities
9. **Attendant Care**: Required assistance and caregiving needs

Sections still in development:
- Housekeeping Calculator
- AMA Guides Assessment

## Intelligence Features

The application now includes several intelligent features to enhance assessment quality:

- **Missing Information Detection**: Identifies critical missing fields with importance ratings
- **Data Validation Warnings**: Flags inconsistencies and potential errors across sections
- **Content Improvement Recommendations**: Suggests enhancements to assessment content
- **Confidence Scoring**: Provides confidence indicators for extracted data
- **Training Interface**: Allows users to correct extractions and train the system

## Project Structure

### Core Directories

- **`/src/pages`**: Contains the Pages Router implementation (primary routing system)
- **`/src/app`**: Contains the App Router implementation (redirects to Pages Router)
- **`/src/sections`**: Assessment section components organized by category
- **`/src/components`**: Reusable UI components
- **`/src/contexts`**: Context providers including AssessmentContext
- **`/src/services`**: Data transformation, API services, and intelligent analysis
- **`/src/utils/pdf-import`**: Enhanced pattern recognition for PDF imports
- **`/src/lib`**: Utility functions and libraries

## Navigation

### Main Routes

- **`/`**: Home page with quick access cards
- **`/full-assessment`**: Comprehensive assessment form with all integrated sections
- **`/assessment`**: Dashboard for managing assessments
- **`/import-pdf`**: Basic PDF import with pattern recognition
- **`/enhanced-import`**: Intelligent PDF import with validation and suggestions
- **`/report-drafting`**: Assessment report generation

### Direct Section Access

- **`/emergency-symptoms`**: Direct access to Symptoms Assessment
- **`/medical-full`**: Direct access to Medical History
- **`/typical-day`**: Direct access to Typical Day

## Development Guidelines

### Routing

This project uses the Next.js Pages Router as the primary routing system. The App Router components have been configured to redirect to their Pages Router equivalents. For details, see:
- [ROUTE_GUIDE.md](./ROUTE_GUIDE.md)
- [ROUTE_MAPPING.md](./ROUTE_MAPPING.md)
- [ROUTE_CONFLICTS_FIX.md](./ROUTE_CONFLICTS_FIX.md)

### Component Integration

Components are integrated with the AssessmentContext to maintain state:

```javascript
import { useAssessmentContext } from '@/contexts/AssessmentContext';

function MyComponent() {
  const { state, dispatch } = useAssessmentContext();
  // Component implementation
}
```

### Enhanced PDF Import and Pattern Recognition

The system now supports two PDF import methods:

1. **Basic Import**: Standard pattern recognition for document parsing
2. **Enhanced Import**: Intelligent pattern recognition with trainable matching, document classification, and NLP enhancement

For detailed information on the enhanced pattern recognition, see:
- [PATTERN_RECOGNITION_ENHANCEMENT.md](./PATTERN_RECOGNITION_ENHANCEMENT.md)
- [PDF_PATTERN_RECOGNITION_README.md](./PDF_PATTERN_RECOGNITION_README.md)
- [HOW_TO_USE_PATTERN_RECOGNITION.md](./HOW_TO_USE_PATTERN_RECOGNITION.md)

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run development server: `npm run dev`
4. Access the application at http://localhost:3000

## Recent Enhancements

1. **Enhanced Pattern Recognition**: Implemented trainable pattern matching for better extraction accuracy
2. **Document Classification**: Added automatic document type detection
3. **NLP-Enhanced Extraction**: Integrated natural language processing for advanced text understanding 
4. **Training Interface**: Developed UI for correcting extractions and training the system
5. **Confidence Scoring**: Added detailed confidence scoring for extracted data
6. **Cross-Section Validation**: Implemented validation across different document sections

## Future Improvements

1. **Additional Document Types**: Add support for more document types
2. **Advanced Training Analytics**: Add visualization of training improvements
3. **Batch Processing**: Add support for processing multiple documents in batch
4. **Cross-Section Validation**: Enhance validation across different document sections
5. **Integration with External Systems**: Connect with external databases for validation
