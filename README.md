# Delilah v3.0

## Overview
Delilah is an Occupational Therapy Assessment and Report Generation System that combines structured assessment data collection with intelligent narrative generation.

## Project Structure

```
src/
├── sections/                      # Assessment sections
│   ├── 1-DemographicsAndHeader
│   ├── 2-PurposeAndMethodology
│   ├── 3-MedicalHistory
│   ├── 4-SubjectiveInformation
│   ├── 5-FunctionalAssessment
│   ├── 6-TypicalDay
│   ├── 7-EnvironmentalAssessment
│   ├── 8-ActivitiesOfDailyLiving
│   ├── 9-AttendantCare
│   └── 10-AMAGuidesAssessment
├── narrative/                    # Narrative generation system
│   ├── PromptLab/
│   ├── ReportGeneration/
│   └── NarrativeEngine/
├── components/                   # Shared components
├── utils/                       # Utility functions
└── hooks/                       # Custom React hooks
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Run tests:
```bash
npm test
```

## Features

- Structured OT assessment form with 10 comprehensive sections
- Intelligent narrative generation
- Professional report formatting
- Client data management
- Assessment validation
- AMA Guides integration