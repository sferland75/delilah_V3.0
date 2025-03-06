# Redux Developer Guide for Delilah V3.0

This guide provides essential information for developers working with the Redux-based architecture in Delilah V3.0. It includes practical examples, common patterns, and best practices to follow when creating or modifying components.

## Getting Started

### Redux Store Structure

The Redux store is organized into slices:

- **assessmentSlice**: Manages assessment data, loading states, and CRUD operations
- **uiSlice**: Handles UI-related state (toasts, modals, preferences)

The store is configured to persist data across sessions using `redux-persist`.

### Essential Imports

Include these imports in components that use Redux:

```typescript
// Redux hooks
import { useAppSelector, useAppDispatch } from '@/store/hooks';

// Assessment actions
import { 
  updateSectionThunk, 
  saveCurrentAssessmentThunk,
  loadAssessmentThunk
} from '@/store/slices/assessmentSlice';

// UI actions
import { addToast } from '@/store/slices/uiSlice';
```

## Working with Redux Components

### Creating a New Redux Component

1. Create a `.redux.tsx` file for your component
2. Import the necessary Redux hooks and actions
3. Set up state using selectors
4. Implement dispatch logic for updates
5. Add loading and error handling

Basic component template:

```tsx
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateSectionThunk, saveCurrentAssessmentThunk } from '@/store/slices/assessmentSlice';
import { addToast } from '@/store/slices/uiSlice';

export function MyComponentRedux() {
  const dispatch = useAppDispatch();
  const currentData = useAppSelector(state => state.assessments.currentData);
  const saveStatus = useAppSelector(state => state.assessments.loading.save);
  
  const sectionData = currentData.mySectionName || {};
  const [dataLoaded, setDataLoaded] = useState(false);
  const initialLoadRef = useRef(false);
  
  // Load data from Redux
  useEffect(() => {
    if (sectionData && Object.keys(sectionData).length > 0 && !initialLoadRef.current) {
      console.log("Data detected, processing...");
      // Map data to component state/form
      setDataLoaded(true);
      initialLoadRef.current = true;
    }
  }, [sectionData]);
  
  // Save data to Redux
  const handleSave = async (data) => {
    try {
      await dispatch(updateSectionThunk({
        sectionName: 'mySectionName',
        sectionData: data
      }));
      
      const saveResult = await dispatch(saveCurrentAssessmentThunk());
      
      if (saveCurrentAssessmentThunk.fulfilled.match(saveResult)) {
        dispatch(addToast({
          title: "Save Successful",
          description: "Your data has been saved successfully.",
          type: "success"
        }));
      }
    } catch (error) {
      console.error("Save error:", error);
      dispatch(addToast({
        title: "Save Failed",
        description: "There was an error saving your data.",
        type: "error"
      }));
    }
  };
  
  return (
    <div>
      {dataLoaded && (
        <div>Data loaded successfully!</div>
      )}
      
      <button 
        onClick={() => handleSave({ key: 'value' })}
        disabled={saveStatus === 'loading'}
      >
        {saveStatus === 'loading' ? 'Saving...' : 'Save Data'}
      </button>
    </div>
  );
}
```

### Form Integration

For components using React Hook Form:

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { mySchema } from '../schema';

// In your component:
const form = useForm({
  resolver: zodResolver(mySchema),
  defaultValues: {},
});

// When data is loaded from Redux:
useEffect(() => {
  if (data && !initialLoadRef.current) {
    const formData = mapDataToForm(data);
    form.reset(formData);
    initialLoadRef.current = true;
  }
}, [data]);

// On form submission:
const onSubmit = async (formData) => {
  const mappedData = mapFormToReduxData(formData);
  await handleSave(mappedData);
};

// In JSX:
<form onSubmit={form.handleSubmit(onSubmit)}>
  {/* Form fields */}
</form>
```

## Common Patterns

### Loading Data from Redux

```tsx
// Component setup
const currentData = useAppSelector(state => state.assessments.currentData);
const contextData = currentData.sectionName || {};
const [dataLoaded, setDataLoaded] = useState(false);
const initialLoadRef = useRef(false);

// Effect for data loading
useEffect(() => {
  if (contextData && Object.keys(contextData).length > 0 && !initialLoadRef.current) {
    try {
      console.log("Data detected, mapping to form");
      const formData = mapContextDataToForm();
      form.reset(formData);
      setDataLoaded(true);
      initialLoadRef.current = true;
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }
}, [contextData]);
```

### Saving Data to Redux

```tsx
const dispatch = useAppDispatch();
const saveStatus = useAppSelector(state => state.assessments.loading.save);

const saveData = async (data) => {
  try {
    // Update section
    await dispatch(updateSectionThunk({
      sectionName: 'sectionName',
      sectionData: data
    }));
    
    // Save assessment
    const saveResult = await dispatch(saveCurrentAssessmentThunk());
    
    // Handle success
    if (saveCurrentAssessmentThunk.fulfilled.match(saveResult)) {
      dispatch(addToast({
        title: "Save Successful",
        description: "Data saved successfully.",
        type: "success"
      }));
    }
  } catch (error) {
    // Handle error
    console.error("Save error:", error);
    dispatch(addToast({
      title: "Save Failed",
      description: "There was an error saving your data.",
      type: "error"
    }));
  }
};
```

### Loading State UI

```tsx
<Button 
  type="submit"
  disabled={saveStatus === 'loading'}
  className="bg-blue-600 hover:bg-blue-700 text-white"
>
  {saveStatus === 'loading' ? 'Saving...' : 'Save Data'}
</Button>
```

### Data Loaded Alert

```tsx
{dataLoaded && (
  <Alert className="mb-6 bg-blue-50 text-blue-800 border-blue-200">
    <InfoIcon className="h-4 w-4 text-blue-800" />
    <AlertTitle>Data Loaded</AlertTitle>
    <AlertDescription>
      Data has been loaded from previous assessments. You can review and modify as needed.
    </AlertDescription>
  </Alert>
)}
```

## Best Practices

### State Selection

- **Be Specific**: Select only the data your component needs
- **Avoid Deep Selectors**: Create memoized selectors for complex data access
- **Use Type Safety**: Leverage TypeScript for type-safe selectors

```tsx
// Good: Specific selection
const sectionData = useAppSelector(state => state.assessments.currentData.sectionName || {});

// Better: Memoized selector
const selectSectionData = useMemo(() => 
  (state) => state.assessments.currentData.sectionName || {},
[]);
const sectionData = useAppSelector(selectSectionData);
```

### Action Dispatching

- **Use Thunks for Complex Logic**: Handle side effects and async operations in thunks
- **Batch Related Updates**: Group related updates to reduce re-renders
- **Handle Errors**: Always include error handling in thunks

```tsx
// Good: Using thunks with error handling
const handleSave = async () => {
  try {
    await dispatch(updateSectionThunk({ /* data */ }));
    await dispatch(saveCurrentAssessmentThunk());
  } catch (error) {
    console.error("Error:", error);
    // Handle error
  }
};
```

### Performance Optimization

- **Memoize Expensive Calculations**: Use useMemo for complex computations
- **Prevent Unnecessary Re-renders**: Use shallowEqual for object comparisons
- **Lazy Loading**: Only load components when needed
- **Avoid State Duplication**: Keep state normalized

```tsx
// Memoizing calculations
const calculatedValue = useMemo(() => {
  return expensiveCalculation(value);
}, [value]);

// Preventing unnecessary re-renders
const data = useAppSelector(
  state => state.assessments.currentData.section,
  shallowEqual
);
```

### Error Handling

- **Try/Catch Blocks**: Wrap all async operations in try/catch
- **Meaningful Error Messages**: Provide useful error messages to users
- **Graceful Degradation**: Allow the UI to function even when errors occur
- **Logging**: Log errors for debugging

```tsx
try {
  await dispatch(someAsyncAction());
} catch (error) {
  console.error("Detailed error for debugging:", error);
  
  dispatch(addToast({
    title: "Error",
    description: "A user-friendly error message",
    type: "error"
  }));
  
  // Fallback behavior
  setFallbackData(defaultData);
}
```

## Debugging Redux

### Redux DevTools

The Redux DevTools extension provides powerful debugging capabilities:

1. **State Inspection**: View the current state
2. **Action History**: See all dispatched actions
3. **Time Travel**: Move back and forth through actions
4. **Action Replay**: Replay actions for debugging

Access the DevTools by:
- Installing the browser extension
- Opening browser DevTools
- Navigating to the Redux tab

### Common Debugging Techniques

1. **Console Logging**: Add logging to track state changes
   ```tsx
   console.log("Before dispatch:", getState());
   dispatch(action);
   console.log("After dispatch:", getState());
   ```

2. **Action Tracing**: Log actions as they're dispatched
   ```tsx
   console.log("Dispatching:", action);
   ```

3. **Component Props**: Check what props are being passed to components
   ```tsx
   console.log("Component props:", props);
   ```

## Conclusion

This guide covers the essential patterns and practices for working with Redux in Delilah V3.0. By following these guidelines, you'll be able to maintain consistency across the application and leverage Redux effectively for state management.

Remember that Redux is a tool to make state management more predictable and maintainable. Use it thoughtfully, and don't hesitate to refactor as your understanding of the application's needs evolves.
