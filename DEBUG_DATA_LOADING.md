# Debug Data Loading Issues

This document provides instructions for troubleshooting data loading issues in the Delilah V3.0 application.

## The Problem

Data loaded from the Assessment Context is not populating correctly in these sections:
- Medical History
- Emotional Symptoms
- Typical Day

## Debugging Tools Provided

I've created several tools to help diagnose the issue:

### 1. Enhanced Debug Context

Run the following batch script to replace the AssessmentContext with a debug version:

```
d:\delilah_V3.0\apply-debug-context.bat
```

This adds enhanced logging to help track data flow.

### 2. Direct Data Viewers

I've created special debug pages that directly display the data in the Assessment Context:

- **Full Context Debug View**: `/assessment/context-debug`
- **Medical History**: `/assessment/medical-direct`
- **Symptoms Assessment**: `/assessment/symptoms-direct`
- **Typical Day**: `/assessment/typical-day-direct`

### 3. Fixed Component Files

I've provided fixed versions of the components with proper export names:

- `MedicalHistory.integrated.tsx`
- `SymptomsAssessment.integrated.tsx`
- `TypicalDay.integrated.tsx`

## Testing Steps

1. Run `apply-debug-context.bat` to install the debug context.
2. Restart your development server.
3. Go to the Load Assessment page and load a sample case.
4. Check the browser console for detailed logs.
5. Visit the direct data viewer pages to see what data is actually in the context.
6. Compare this with what appears in the regular component views.

## Common Issues

1. **Data Structure Mismatch**: The data structure from context doesn't match what components expect.
2. **Empty Context**: Data isn't being properly loaded into the context.
3. **Component Import Issues**: Component export names don't match imports.
4. **Rendering Issues**: Components render before data is loaded.

## Specific Paths to Check

### Medical History:
- `data.medicalHistory.pastMedicalHistory.conditions`
- `data.medicalHistory.pastMedicalHistory.surgeries`
- `data.medicalHistory.pastMedicalHistory.allergies`
- `data.medicalHistory.pastMedicalHistory.medications`

### Symptoms Assessment:
- `data.symptomsAssessment.physicalSymptoms`
- `data.symptomsAssessment.cognitiveSymptoms`
- `data.symptomsAssessment.emotionalSymptoms`

### Typical Day:
- `data.typicalDay.morningRoutine`
- `data.typicalDay.daytimeActivities`
- `data.typicalDay.eveningRoutine`

## After Testing

When finished debugging, restore the original context:

```
d:\delilah_V3.0\restore-context.bat
```

This script is automatically created when you run the debug context installer.