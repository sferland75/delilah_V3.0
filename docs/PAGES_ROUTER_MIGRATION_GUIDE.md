# Pages Router Migration Guide

## Overview

This document provides guidance for migrating components from the App Router to the Pages Router structure in Delilah V3.0. It includes best practices, common issues, and implementation patterns.

## Key Differences Between App Router and Pages Router

### App Router
- Uses `'use client'` directives to indicate client components
- Components typically stored in `/src/app` directory
- Supports server components
- Uses the newer routing system with route groups and layouts

### Pages Router
- No need for `'use client'` directives
- Components stored in `/pages` directory
- All components are client-side rendered
- Uses the file-based routing system

## Migration Process

### 1. Create Pages-Compatible Components

Create self-contained components in the `/pages/direct-components` directory:

```jsx
// Example: /pages/direct-components/ExampleComponent.jsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function ExampleComponent() {
  const [data, setData] = useState({ name: '' });
  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Example Component</h2>
      {/* Component content */}
    </div>
  );
}
```

### 2. Convert Page Files

Create or update page files in the root `/pages` directory:

```jsx
// Example: /pages/example.tsx
import React from 'react';
import { Card } from '../src/components/ui/card';
import { AssessmentProvider } from '../src/contexts/AssessmentContext';
import { ErrorBoundary } from '../src/components/ui/error-boundary';
import ExampleComponent from './direct-components/ExampleComponent';

export default function ExamplePage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Example Page</h1>
      
      <Card className="mb-6 overflow-hidden">
        <AssessmentProvider>
          <ErrorBoundary fallback={<div>Error loading component</div>}>
            <ExampleComponent />
          </ErrorBoundary>
        </AssessmentProvider>
      </Card>
    </div>
  );
}
```

### 3. Update Import Paths in Full Assessment Page

```jsx
// In /pages/full-assessment.tsx
import dynamic from 'next/dynamic';

// Import the direct components from pages directory
const ExampleComponent = dynamic(
  () => import('./direct-components/ExampleComponent'),
  { ssr: false, loading: () => <div>Loading...</div> }
);

// Use in component:
{activeTab === 'example' && (
  <ErrorBoundary fallback={<PlaceholderSection title="Example (Error Loading)" />}>
    <ExampleComponent />
  </ErrorBoundary>
)}
```

## Common Issues and Solutions

### Issue 1: Components Not Rendering
- Ensure components are properly imported using relative paths
- Remove any `'use client'` directives
- Check for console errors related to imports

### Issue 2: Form Nesting Issues
- Avoid nested `<form>` elements
- Use standard HTML form elements instead of shadcn/ui Form components when nesting is a problem
- Implement direct state management with useState

### Issue 3: Styling Inconsistencies
- Use the standard styling patterns from other working components
- Follow the tab styling pattern for consistent appearance
- Test components in both individual pages and the full assessment page

## Implemented Examples

### Medical History Component
Successfully migrated the Medical History component to the Pages Router structure:
- Created `/pages/direct-components/MedicalHistoryComponent.jsx`
- Updated references in `/pages/medical-history.tsx` and `/pages/full-assessment.tsx`
- Implemented consistent styling and form handling

### Symptoms Assessment Component
Successfully migrated the Symptoms Assessment component:
- Created `/pages/direct-components/SymptomsComponent.jsx`
- Updated references in `/pages/symptoms-assessment.tsx` and `/pages/full-assessment.tsx`
- Maintained the tab-based interface with proper styling

## Best Practices

1. **Component Organization**
   - Keep all Pages Router components in `/pages/direct-components`
   - Create subdirectories for each section to maintain organization

2. **State Management**
   - Use direct state management with useState for form components
   - Connect to the Assessment Context for data persistence
   - Implement proper validation and error handling

3. **Styling**
   - Use consistent styling patterns from other working components
   - Follow the tab styling pattern for consistent appearance
   - Test components in both individual pages and the full assessment page

4. **Error Handling**
   - Wrap components in ErrorBoundary components
   - Provide meaningful fallback UI
   - Add console logs for debugging

## Conclusion

By following this guide, you can successfully migrate components from the App Router to the Pages Router structure in Delilah V3.0. This ensures compatibility with the current application architecture and provides a consistent user experience.
