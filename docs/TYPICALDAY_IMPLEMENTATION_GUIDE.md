# Typical Day Implementation Guide

This document explains the updated Typical Day component implementation in Delilah V3.0. The component supports both regular and irregular sleep schedules and provides a more robust user interface.

## Schema Structure

The Typical Day component uses a Zod schema for validation defined in `schema.ts`. The main structure includes:

```typescript
// Main structure
typicalDaySchema
 ├── config
 │    ├── activeTab: 'preAccident' | 'postAccident'
 │    └── mode: 'view' | 'edit'
 └── data
      ├── preAccident
      │    ├── dailyRoutine
      │    │    ├── morning: []
      │    │    ├── afternoon: []
      │    │    ├── evening: []
      │    │    └── night: []
      │    └── sleepSchedule
      │         ├── type: 'regular' | 'irregular'
      │         ├── regularSchedule?: { wakeTime, bedTime, sleepQuality }
      │         └── irregularScheduleDetails?: string
      └── postAccident 
           ├── dailyRoutine (same structure as preAccident)
           └── sleepSchedule (same structure as preAccident)
```

## Key Files

1. **schema.ts**: Defines the data structure and validation rules
2. **types.ts**: TypeScript interfaces for form data and context data
3. **TypicalDay.integrated.tsx**: Main component that integrates with AssessmentContext
4. **TimeBlock.tsx**: Component for rendering a time period (morning/afternoon/evening/night)
5. **SimpleActivity.tsx**: Component for a single activity entry
6. **IrregularSleepTrigger.tsx**: Renamed to SleepSchedule.tsx, handles both regular and irregular sleep schedules
7. **typicalDayMapper.ts**: Handles conversion between context data and form data

## Context Integration

The component uses `useAssessment()` hook to access and update data in the Assessment Context:

```typescript
const { data, updateSection } = useAssessment();
```

## Sleep Schedule Implementation

The sleep schedule feature now supports both regular and irregular schedules:

1. **Regular Schedule**: Uses wakeTime, bedTime, and sleepQuality fields
2. **Irregular Schedule**: Uses a radio toggle and a detailed text description

## Activity Management

Activities are stored in arrays for each time period (morning, afternoon, evening, night):

```typescript
{
  timeBlock: string;   // Time of the activity (e.g. "8:00 AM")
  description: string; // Description of the activity
  assistance?: string; // Optional assistance information
  limitations?: string; // Optional limitations information
}
```

## Mapper Service

The `typicalDayMapper.ts` service handles bidirectional conversion between:

1. Context data structure (used in AssessmentContext)
2. Form data structure (used in React Hook Form)

Key functions:
- `mapContextToForm()`: Converts context data to form structure
- `mapFormToContext()`: Converts form data to context structure
- `textToActivities()`: Parses text descriptions into structured activities
- `activitiesToText()`: Converts structured activities to text descriptions

## Error Handling

The component uses:
1. ErrorBoundary components to catch rendering errors
2. try/catch blocks for data mapping operations
3. Form validation using Zod schema

## User Experience Improvements

1. Success notifications when saving data
2. Data loaded notifications
3. Proper validation feedback
4. Unsaved changes warning
5. Modal dialog for irregular sleep schedule instead of browser prompts

## Testing

Tests are available in `__tests__/TypicalDay.test.tsx` and cover:
1. Component rendering
2. Tab switching
3. Data persistence
4. Form submission
5. Reset functionality

## Backwards Compatibility

The implementation maintains backward compatibility with existing data by:
1. Supporting both structured and text-based activity data
2. Converting between formats automatically
3. Handling missing or partial data gracefully

## Implementation Roadmap

The implementation followed these steps:

1. **Standardized Schema**: Created a unified schema with proper validation for regular and irregular schedules
2. **Fixed Context Integration**: Updated the component to use `useAssessment()` hook consistently
3. **Improved Irregular Schedule Feature**: Replaced browser prompts with proper UI components
4. **Enhanced Mapper Service**: Added robust error handling and improved text parsing
5. **Improved User Experience**: Added success notifications and clear validation feedback
6. **Updated Tests**: Created comprehensive tests for the new implementation
7. **Documentation**: Added detailed documentation for developers

## Known Limitations

1. The component only shows standard time periods (morning, afternoon, evening, night) and doesn't support custom time periods
2. Activities don't support multiple types of assistance or limitations per activity
3. The irregular sleep schedule doesn't support structured input of shift patterns
