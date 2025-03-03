# UI Components Guide - Delilah V3.0

## Core Components

### Error Boundary
The ErrorBoundary component provides a standardized way to handle errors across the application.

```tsx
import { ErrorBoundary } from '@/components/ui/error-boundary';

// Usage
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

### Loading States
Various loading state components for different scenarios:

```tsx
import { 
  LoadingState, 
  FormSkeleton, 
  CardSkeleton, 
  TableSkeleton 
} from '@/components/ui/loading';

// Basic loading spinner
<LoadingState message="Loading assessment..." />

// Form placeholder
<FormSkeleton />

// Card placeholder
<CardSkeleton />

// Table placeholder
<TableSkeleton />
```

## Form Components

### Form Fields
Standard form components with validation:

```tsx
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';

<FormField
  control={control}
  name="fieldName"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Field Label</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Tabs
Used for sectioned content:

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>
```

### Cards
Container components:

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Section Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
</Card>
```

## Usage Guidelines

### Error Handling
1. Wrap section components with ErrorBoundary
2. Use try-catch for async operations
3. Display error messages using Alert component
4. Provide retry functionality where appropriate

### Loading States
1. Use LoadingState for initial data fetching
2. Use skeletons for content placeholders
3. Show loading indicators during form submissions
4. Maintain layout stability during loading

### Form Validation
1. Use Zod schemas for validation
2. Show inline error messages
3. Disable submission during validation
4. Preserve form state during errors

### Accessibility
1. Include ARIA labels
2. Maintain focus management
3. Provide keyboard navigation
4. Use semantic HTML elements

## Best Practices

1. Error Boundaries:
   - Place at logical component boundaries
   - Include error reporting
   - Provide recovery options
   - Maintain user context

2. Loading States:
   - Match content structure
   - Animate appropriately
   - Maintain layout
   - Show progress where possible

3. Forms:
   - Validate on change
   - Show immediate feedback
   - Preserve data on errors
   - Handle async validation

4. Performance:
   - Lazy load components
   - Optimize re-renders
   - Cache form state
   - Debounce validations