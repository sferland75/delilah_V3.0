# Redux Migration Guide for Delilah V3.0

This document outlines the process for migrating state management from React Context API to Redux Toolkit. The migration is set up to be incremental, allowing both systems to coexist during the transition.

## Overview of Changes

The migration involves the following key components:

1. **Redux Store**: Central state management with slices for different data domains
2. **Bridge Component**: Synchronizes data between Context and Redux during transition
3. **Redux Hooks**: Custom hooks for accessing and updating Redux state
4. **Refactored Components**: Components updated to use Redux instead of Context

## Current Implementation

The Redux infrastructure has been set up with:

- Basic store configuration with persist functionality
- Assessment slice for handling assessment data
- UI slice for managing UI-related state
- Redux bridge to sync data between Context and Redux
- All major form components refactored to use Redux

## Migration Steps

Here's a step-by-step guide for continuing the migration:

### 1. Component Migration

For each component that uses the AssessmentContext:

1. Create a new version of the component that uses Redux (e.g., `ComponentName.redux.tsx`)
2. Replace Context calls with Redux hooks and actions
3. Test the new component to ensure proper functionality
4. Gradually replace imports of the original component with the Redux version

Example of migrating a component from Context to Redux:

```tsx
// Original component using Context
import { useAssessment } from '@/contexts/AssessmentContext';

const MyComponent = () => {
  const { data, updateSection } = useAssessment();
  
  // Component logic using Context
};
```

```tsx
// Refactored component using Redux
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateSectionThunk, saveCurrentAssessmentThunk } from '@/store/slices/assessmentSlice';
import { addToast } from '@/store/slices/uiSlice';

const MyComponent = () => {
  const dispatch = useAppDispatch();
  const currentData = useAppSelector(state => state.assessments.currentData);
  const saveStatus = useAppSelector(state => state.assessments.loading.save);
  
  // Component logic using Redux
  const handleUpdate = async (sectionName, sectionData) => {
    try {
      await dispatch(updateSectionThunk({ sectionName, sectionData }));
      const saveResult = await dispatch(saveCurrentAssessmentThunk());
      
      if (saveCurrentAssessmentThunk.fulfilled.match(saveResult)) {
        dispatch(addToast({
          title: "Save Successful",
          description: "Your data has been saved successfully.",
          type: "success"
        }));
      }
    } catch (error) {
      dispatch(addToast({
        title: "Save Failed",
        description: "There was an error saving your data.",
        type: "error"
      }));
    }
  };
};
```

### 2. Testing Strategy

For each migrated component:

1. Test the component with the Redux store
2. Verify data persistence between page refreshes
3. Test interaction with other components (both Redux and Context-based)
4. Ensure proper error handling

### 3. Complete Migration

Once all components have been migrated:

1. Remove the Context provider from the application
2. Remove the Redux bridge component
3. Clean up unused Context-related code
4. Update documentation to reflect the new state management approach

## Key Files

- `/src/store/index.ts`: Redux store configuration
- `/src/store/hooks.ts`: Custom Redux hooks
- `/src/store/slices/assessmentSlice.ts`: Assessment state management
- `/src/store/slices/uiSlice.ts`: UI state management
- `/src/components/ReduxBridge.tsx`: Bridge between Context and Redux
- `/src/sections/*/components/*.redux.tsx`: Redux-based components

## Best Practices

### Redux State Structure

- Keep state normalized (avoid deep nesting)
- Use separate slices for different domains
- Use thunks for async operations and complex logic
- Use selectors for derived data

### Component Integration

- Use `useAppSelector` and `useAppDispatch` from our custom hooks
- Select only the data your component needs
- Dispatch actions for state updates
- Use memoization for expensive computations
- Use refs to prevent duplicate data loading
- Add proper loading state handling

### Error Handling

- Add proper error handling in thunks
- Use the UI slice for global error messages
- Include loading states for async operations
- Provide user feedback with toast notifications

## Migration Status

- [x] Infrastructure setup complete
- [x] Assessment slice implemented
- [x] UI slice implemented
- [x] Example component (Demographics) migrated
- [x] AttendantCareSection migrated
- [x] EnvironmentalAssessment migrated
- [x] ActivitiesOfDailyLiving migrated
- [x] SymptomsAssessment migrated
- [x] FunctionalStatus migrated
- [x] TypicalDay migrated 
- [x] PurposeAndMethodology migrated
- [ ] Remove Context provider (pending complete migration)
- [ ] Cleanup Context-related code (pending complete migration)

## Common Patterns Used in Migration

### Data Loading from Redux
```tsx
// Use a ref to prevent duplicate loading
const initialLoadRef = useRef(false);

useEffect(() => {
  if (contextData && Object.keys(contextData).length > 0 && !initialLoadRef.current) {
    console.log("Data detected, mapping to form");
    const formData = mapContextDataToForm();
    form.reset(formData);
    setDataLoaded(true);
    initialLoadRef.current = true;
  }
}, [contextData]);
```

### Form Submission with Redux
```tsx
const onSubmit = async (formData) => {
  try {
    // Update the Redux store
    await dispatch(updateSectionThunk({
      sectionName: 'sectionName',
      sectionData: mappedData
    }));
    
    // Save the assessment
    const saveResult = await dispatch(saveCurrentAssessmentThunk());
    
    // Show success notification
    if (saveCurrentAssessmentThunk.fulfilled.match(saveResult)) {
      dispatch(addToast({
        title: "Success",
        description: "Data saved successfully.",
        type: "success"
      }));
    }
  } catch (error) {
    console.error("Error:", error);
    dispatch(addToast({
      title: "Error",
      description: "An unexpected error occurred.",
      type: "error"
    }));
  }
};
```

### Loading State Handling
```tsx
<Button 
  type="submit"
  disabled={saveStatus === 'loading'}
>
  {saveStatus === 'loading' ? 'Saving...' : 'Save Form'}
</Button>
```

## Troubleshooting

Common issues you might encounter:

1. **Redux Persist Issues**: If data isn't persisting, check the persist configuration
2. **Component Re-rendering**: Use selectors to minimize re-renders
3. **Data Synchronization**: Ensure data is properly synced between Context and Redux
4. **Duplicate Data Loading**: Use a ref to track initial loading state

## Additional Resources

- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React Redux Documentation](https://react-redux.js.org/)
- [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools)
