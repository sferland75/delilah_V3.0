# Sections to Pages Integration

This document outlines the approach used to integrate section components from `/src/sections` into the Next.js Pages Router structure.

## Key Integration Challenges

1. **Component Path Discrepancies**: Section components developed for src were referenced incorrectly
2. **Import Issues**: Some components had dependency and import issues
3. **Visual Inconsistencies**: Tab styling varied between sections
4. **Component Export Problems**: Some modules exported the wrong component variants
5. **App Router vs Pages Router Confusion**: Some components used App Router features that are incompatible with Pages Router

## Integration Solutions

### 1. Direct Component Imports

Instead of relying on barrel exports (index.ts), we now import components directly from their source files:

```javascript
// Instead of this (which may cause errors)
import { SymptomsAssessment } from '@/sections/4-SymptomsAssessment';

// Use this approach for reliability
import { SymptomsAssessment } from '@/sections/4-SymptomsAssessment/components/SymptomsAssessment';
```

### 2. Dynamic Imports with Better Fallbacks

All section components use dynamic imports with clear fallback mechanisms:

```javascript
const SymptomsAssessment = dynamic(
  () => import('@/sections/4-SymptomsAssessment/components/SymptomsAssessment')
    .then(mod => mod.SymptomsAssessment)
    .catch(() => {
      console.error('Failed to load SymptomsAssessment component directly');
      return import('@/sections/4-SymptomsAssessment/SimpleSymptomsAssessment');
    }),
  { ssr: false }
);
```

### 3. Standardized Tab Styling

All section components now use consistent tab styling with blue active indicators:

```jsx
<TabsList className="w-full border-b p-0 h-auto">
  <TabsTrigger 
    value="physical" 
    className="py-2 rounded-none flex-1 data-[state=active]:border-b-2 
    data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 
    data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 
    data-[state=inactive]:text-gray-600"
  >
    Physical
  </TabsTrigger>
  <!-- More tabs -->
</TabsList>
```

### 4. Custom UI Components

For missing UI components (e.g., Switch), we created custom alternatives:

```jsx
const Toggle = ({ checked, onChange, id }) => (
  <div 
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors 
    ${checked ? 'bg-blue-600' : 'bg-gray-200'}`}
    onClick={() => onChange(!checked)}
    role="switch"
    aria-checked={checked}
    id={id}
  >
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform 
    ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
  </div>
);
```

### 5. Button Styling Consistency

All primary action buttons use the standard blue styling:

```jsx
<Button className="bg-blue-600 hover:bg-blue-700 text-white">
  Save Assessment
</Button>
```

### 6. Pages Router-Compatible Components

For sections that continued to have issues, we created Pages Router-compatible versions in the pages directory:

```jsx
// /pages/direct-components/MedicalHistoryComponent.jsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function MedicalHistoryComponent() {
  const [formData, setFormData] = useState({...});
  
  // Component logic...
  
  return (
    <div className="space-y-6 p-6">
      {/* Component JSX */}
    </div>
  );
}
```

Then we updated the page and full-assessment files to use these components:

```jsx
// In pages file
import MedicalHistoryComponent from './direct-components/MedicalHistoryComponent';

// In full-assessment.tsx
const MedicalHistory = dynamic(
  () => import('./direct-components/MedicalHistoryComponent'),
  { ssr: false, loading: () => <div>Loading Medical History...</div> }
);
```

## Modified Components

The following components have been updated for Pages Router compatibility:

1. **Demographics**
   - Direct import from components directory
   - Fixed form submission handling

2. **Medical History**
   - Created a Pages Router-compatible version in `/pages/direct-components`
   - Fixed form nesting issues
   - Improved error handling

3. **Symptoms Assessment**
   - Created a Pages Router-compatible version in `/pages/direct-components`
   - Fixed incorrect component loading
   - Enhanced fallback mechanism

4. **Functional Status**
   - Fixed import path for FunctionalStatusRedux
   - Standardized tab and button styling

5. **Typical Day**
   - Updated tab styling to match other sections
   - Added consistent blue styling

6. **Activities of Daily Living**
   - Replaced custom tab implementation with standard Tabs component
   - Standardized styling

7. **Attendant Care**
   - Enhanced imports and error handling

## Directory Structure

Key files in the integration:

```
/pages/
  ├── direct-components/               # Pages Router-compatible components
  │   ├── MedicalHistoryComponent.jsx  # Direct implementation for Pages Router
  │   └── SymptomsComponent.jsx        # Direct implementation for Pages Router
  ├── functional-status.tsx            # Individual section page
  ├── activities-daily-living.tsx      # Individual section page
  ├── symptoms-assessment.tsx          # Individual section page
  ├── medical-history.tsx              # Individual section page
  ├── typical-day.tsx                  # Individual section page
  ├── attendant-care.tsx               # Individual section page
  ├── full-assessment.tsx              # Combined assessment page
  └── _app.js                          # Application entry point

/src/sections/
  ├── 1-InitialAssessment/             # Demographics components
  ├── 3-MedicalHistory/                # Medical history components
  ├── 4-SymptomsAssessment/            # Symptoms components
  ├── 5-FunctionalStatus/              # Functional status components
  ├── 6-TypicalDay/                    # Typical day components
  ├── 8-ActivitiesOfDailyLiving/       # ADL components
  └── 9-AttendantCare/                 # Attendant care components
```

## Implementation Best Practices

1. **Direct Imports**: Always import components directly from their source files, not through barrel exports
2. **Dynamic Loading**: Use dynamic imports with `{ ssr: false }` for client-side only components
3. **Error Boundaries**: Wrap all section components in ErrorBoundary components with meaningful fallbacks
4. **Consistent Styling**: Use the standard blue color scheme for tabs and buttons
5. **Clear Fallbacks**: Provide explicit fallbacks when primary components fail to load
6. **Pages Router-Compatible Components**: Create Pages Router-specific components for problematic sections

## Troubleshooting

If sections don't load correctly:

1. Check browser console for component loading errors
2. Verify direct import paths to component source files
3. Ensure all dependencies are correctly imported
4. Check for naming conflicts between Simple/Enhanced component variants
5. Remove any `'use client'` directives in components
6. Create a Pages Router-compatible version in `/pages/direct-components` if other solutions fail