# Attendant Care Section

## Overview
This section manages attendant care assessment including:
- Level 1: Routine personal care
- Level 2: Basic supervision
- Level 3: Complex care
- Rate calculations and cost assessment

## Component Structure
```
9-AttendantCare/
├── components/
│   ├── AttendantCareField.tsx    # Individual care activity input
│   ├── AttendantCareSection.tsx  # Main section container
│   ├── Level1Care.tsx           # Routine personal care
│   ├── Level2Care.tsx           # Basic supervision activities
│   ├── Level3Care.tsx           # Complex care activities
│   ├── CareActivity.tsx         # Reusable care activity component
│   └── index.ts
├── utils/
│   └── calculations.ts          # Care cost calculator
├── __tests__/
│   ├── AttendantCareField.test.tsx
│   ├── AttendantCareSection.test.tsx
│   ├── Level1Care.test.tsx
│   ├── calculations.test.ts
│   └── jest.setup.ts
├── __test_utils__/
│   ├── fixtures.ts
│   └── utils.tsx
├── constants.ts                 # Care rates and descriptions
└── schema.ts                    # Form validation schema

## Key Features
- Minute-by-minute activity tracking
- Weekly to monthly conversions
- Rate-based cost calculations
- Multi-level care assessment

## Testing Requirements
- Statements: 80% coverage
- Branches: 90% coverage
- Functions: 70% coverage
- Lines: 80% coverage

## Implementation Notes
- Uses shadcn/ui components
- react-hook-form for form state
- Zod validation schema
- Automated calculations