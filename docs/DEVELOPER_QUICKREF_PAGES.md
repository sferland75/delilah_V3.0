# Developer Quick Reference: Pages Router Integration

This quick reference guide outlines best practices for working with section components in the Pages Router structure.

## Importing Components

**✅ Recommended:**
```js
import dynamic from 'next/dynamic';

// Direct import from component file
const SymptomsAssessment = dynamic(
  () => import('@/sections/4-SymptomsAssessment/components/SymptomsAssessment')
    .then(mod => mod.SymptomsAssessment),
  { ssr: false }
);
```

**❌ Avoid:**
```js
// Indirect import via barrel export
import { SymptomsAssessment } from '@/sections/4-SymptomsAssessment';
```

## Component Fallbacks

Always provide explicit fallbacks for dynamic imports:

```js
const FunctionalStatus = dynamic(
  () => import('@/sections/5-FunctionalStatus/components/FunctionalStatus.redux')
    .then(mod => mod.FunctionalStatusRedux)
    .catch(() => {
      console.error('Failed to load FunctionalStatus');
      return import('@/sections/5-FunctionalStatus/SimpleFunctionalStatus');
    }),
  { ssr: false }
);
```

## Tab Component Styling

Use this standard styling for tabs:

```jsx
<TabsList className="w-full border-b p-0 h-auto">
  <TabsTrigger 
    value="tab1" 
    className="py-2 rounded-none flex-1 data-[state=active]:border-b-2 
    data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 
    data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 
    data-[state=inactive]:text-gray-600"
  >
    Tab 1
  </TabsTrigger>
</TabsList>
```

## Button Styling

Use blue for primary actions:

```jsx
<Button className="bg-blue-600 hover:bg-blue-700 text-white">
  Save Section
</Button>
```

Use outline for secondary actions:

```jsx
<Button variant="outline">
  Cancel
</Button>
```

## Error Handling

Wrap components in error boundaries:

```jsx
<ErrorBoundary fallback={<FallbackComponent title="Section Name" />}>
  <SectionComponent />
</ErrorBoundary>
```

## Page Structure Template

```jsx
import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AssessmentProvider } from '@/contexts/AssessmentContext';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import dynamic from 'next/dynamic';
import Head from 'next/head';

// Dynamic import with fallback
const SectionComponent = dynamic(
  () => import('@/sections/X-SectionName/components/SectionComponent')
    .then(mod => mod.SectionComponent)
    .catch(() => import('@/sections/X-SectionName/SimpleSection')),
  { ssr: false }
);

export default function SectionPage() {
  return (
    <>
      <Head>
        <title>Section Name | Delilah V3.0</title>
      </Head>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Section Name</h1>
          <div className="flex space-x-2">
            <Link href="/full-assessment">
              <Button variant="outline">Full Assessment</Button>
            </Link>
            <Link href="/">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Dashboard</Button>
            </Link>
          </div>
        </div>
        
        <Card className="mb-6 overflow-hidden">
          <AssessmentProvider>
            <ErrorBoundary fallback={<FallbackComponent />}>
              <SectionComponent />
            </ErrorBoundary>
          </AssessmentProvider>
        </Card>
      </div>
    </>
  );
}
```

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Component doesn't load | Check direct import path |
| Wrong component loads | Import specifically from component file |
| Styling inconsistency | Use standard tab/button styling |
| SSR errors | Add `{ ssr: false }` to dynamic imports |
| Form context errors | Ensure `FormProvider` wraps form content |

## Field Testing Integration

For field testing components:
- Initialize field testing in `pages/_app.js` not in individual components
- Use `window.fieldTesting` global API for console-based testing
- See `FIELD_TESTING_PAGES_IMPLEMENTATION.md` for details