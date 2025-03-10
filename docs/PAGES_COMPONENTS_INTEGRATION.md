# Pages Components Integration

This document describes how the components from `/src/sections` have been integrated with the Next.js Pages Router in Delilah V3.0.

## Overview

The Delilah V3.0 application uses Next.js with the Pages Router architecture. The assessment section components were originally developed with a focus on the `/src/components` directory, but the application structure requires them to be used in the `/pages` directory.

## Integration Approach

### 1. Dynamic Imports with SSR Disabled

All section components are imported dynamically with SSR (Server-Side Rendering) disabled to ensure they work properly in the Next.js Pages Router:

```jsx
const SimpleFunctionalStatus = dynamic(
  () => import('@/sections/5-FunctionalStatus/SimpleFunctionalStatus'),
  { ssr: false }
);
```

This approach:
- Prevents SSR-related errors with client-side components
- Allows code-splitting for better performance
- Handles imports of components that use client-side only features

### 2. Error Boundary Wrapping

Each component is wrapped in an ErrorBoundary to catch and handle any runtime errors:

```jsx
<ErrorBoundary fallback={<FallbackComponent />}>
  <SimpleSymptomsAssessment />
</ErrorBoundary>
```

This ensures that if a component fails to render, the entire page doesn't crash.

### 3. Context Provider Integration

All components are wrapped in the necessary context providers (e.g., AssessmentProvider) to ensure they have access to the required data and functionality:

```jsx
<AssessmentProvider>
  <SimpleFunctionalStatus />
</AssessmentProvider>
```

### 4. Consistent UI Framework

The page layouts have been updated to use consistent styling and UI components:

- Blue primary buttons for dashboard navigation
- Outline secondary buttons for other navigation
- Card components for section content
- Properly styled headers and alerts

## Modified Pages

The following pages have been updated to use the new integration approach:

1. **functional-status.tsx**
   - Uses components from `/src/sections/5-FunctionalStatus`
   - Implements the complete functional status assessment

2. **activities-daily-living.tsx**
   - Uses components from `/src/sections/8-ActivitiesOfDailyLiving`
   - Implements the ADL assessment with all categories

3. **attendant-care.tsx**
   - Uses components from `/src/sections/9-AttendantCare`
   - Implements the attendant care needs assessment

4. **typical-day.tsx**
   - Uses components from `/src/sections/6-TypicalDay`
   - Handles both regular and irregular sleep schedules

5. **symptoms-assessment.tsx**
   - Uses components from `/src/sections/4-SymptomsAssessment`
   - Implements the complete symptoms assessment

6. **medical-history.tsx**
   - Uses components from `/src/sections/3-MedicalHistory`
   - Implements the medical history tracking

## Styling Fixes

The following styling changes have been applied to ensure consistency:

1. **Navigation Buttons**
   - Primary action buttons use `className="bg-blue-600 hover:bg-blue-700 text-white"`
   - Secondary buttons use `variant="outline"`

2. **Card Containers**
   - All section content is wrapped in a Card component
   - Added `overflow-hidden` to prevent content overflow issues

3. **Component Containers**
   - Simplified card headers and content structure
   - Removed excessive padding and margins

## Troubleshooting

If there are issues with the components:

1. **Check the browser console for errors**
   - Look for import path issues
   - Check for missing dependencies

2. **Verify dynamic imports**
   - Make sure SSR is disabled for client-side components
   - Check that the correct component is being imported

3. **Check context providers**
   - Ensure all required providers are present
   - Verify the order of nested providers

4. **Look for style conflicts**
   - Check for inconsistent style applications
   - Verify that tailwind classes are applying correctly