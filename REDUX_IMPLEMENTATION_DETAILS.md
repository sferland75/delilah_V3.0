# Redux Implementation Details for Delilah V3.0

This document provides detailed information about the Redux implementation in the Delilah V3.0 application. It covers the architecture, key components, state management patterns, and best practices.

## Architecture Overview

Delilah V3.0 uses Redux Toolkit for state management. The application previously used React Context API, but has been migrated to Redux for improved performance, better debugging capabilities, and more centralized state management.

The Redux implementation includes:

1. **Store**: The central state repository configured with Redux Toolkit
2. **Slices**: Modular state chunks with their own reducers, actions, and selectors
3. **Thunks**: Asynchronous action creators for handling side effects
4. **Persistence**: Data persistence using redux-persist
5. **Component Integration**: React components that connect to the Redux store

## Store Configuration

The store is configured in `src/store/index.ts` and includes:

- Redux Toolkit's `configureStore` for setup
- Redux Persist for data persistence
- Redux DevTools extension integration
- Middleware configuration (including thunk)

```typescript
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';

import assessmentReducer from './slices/assessmentSlice';
import uiReducer from './slices/uiSlice';

const rootReducer = combineReducers({
  assessments: assessmentReducer,
  ui: uiReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['assessments'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

## Redux Slices

### Assessment Slice

The assessment slice (`src/store/slices/assessmentSlice.ts`) manages all assessment-related data:

- Current assessment data
- Loading states for async operations
- Assessment list
- CRUD operations for assessments

Key features:

- Normalized state structure
- Thunks for async operations (loading/saving/updating)
- Selectors for derived data
- Error handling

```typescript
// Example of a thunk for updating a section
export const updateSectionThunk = createAsyncThunk(
  'assessments/updateSection',
  async ({ sectionName, sectionData }: UpdateSectionPayload, { getState }) => {
    const state = getState() as RootState;
    const currentAssessment = state.assessments.currentData;
    
    // Update assessment section
    const updatedData = {
      ...currentAssessment,
      [sectionName]: sectionData,
    };
    
    return updatedData;
  }
);
```

### UI Slice

The UI slice (`src/store/slices/uiSlice.ts`) manages UI-related state:

- Toast notifications
- Modal states
- UI preferences
- Error messages

```typescript
// Example of toast notifications in uiSlice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    addToast: (state, action: PayloadAction<ToastNotification>) => {
      state.toasts.push({
        ...action.payload,
        id: Date.now().toString(),
      });
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
    },
  },
});
```

## Custom Hooks

Custom hooks in `src/store/hooks.ts` provide type-safe access to the Redux store:

```typescript
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

## Component Migration Pattern

The Redux migration followed a consistent pattern for all components:

1. Create a `.redux.tsx` version of each component
2. Replace Context hooks with Redux hooks
3. Update form submission logic to use Redux thunks
4. Add error handling and loading states
5. Prevent duplicate data loading with refs

### Common Implementation Patterns

#### Data Loading
```tsx
const dispatch = useAppDispatch();
const currentData = useAppSelector(state => state.assessments.currentData);
const saveStatus = useAppSelector(state => state.assessments.loading.save);

// Use ref to prevent duplicate loading
const initialLoadRef = useRef(false);

useEffect(() => {
  if (data && Object.keys(data).length > 0 && !initialLoadRef.current) {
    // Map data to form
    const formData = mapDataToForm();
    form.reset(formData);
    setDataLoaded(true);
    initialLoadRef.current = true;
  }
}, [data]);
```

#### Form Submission
```tsx
const onSubmit = async (formData) => {
  try {
    // Map form data to Redux structure
    const mappedData = mapFormToReduxData(formData);
    
    // Update section in Redux
    await dispatch(updateSectionThunk({
      sectionName: 'sectionName',
      sectionData: mappedData
    }));
    
    // Save assessment
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
    // Handle errors
    console.error("Error submitting form:", error);
    dispatch(addToast({
      title: "Error",
      description: "An unexpected error occurred.",
      type: "error"
    }));
  }
};
```

#### Loading State Handling
```tsx
<Button 
  type="submit"
  disabled={saveStatus === 'loading'}
>
  {saveStatus === 'loading' ? 'Saving...' : 'Save Form'}
</Button>
```

## Migrated Components

All major form components have been migrated from Context to Redux:

1. **AttendantCareSection** (Section 9)
   - Complex form with calculations and tab navigation
   - Handles mapping between form data and Redux state

2. **EnvironmentalAssessment** (Section 7)
   - Multi-tab assessment form
   - Safety and accessibility data management

3. **ActivitiesOfDailyLiving** (Section 8)
   - Complex form with nested categories
   - Handles ADL assessment data

4. **SymptomsAssessment** (Section 4)
   - Form with physical, cognitive, and emotional symptoms
   - Import/export functionality

5. **FunctionalStatus** (Section 5)
   - Multi-tab assessment for range of motion, muscle testing
   - Complex data transformations

6. **TypicalDay** (Section 6)
   - Pre/post accident comparison
   - Time-based activity tracking

7. **PurposeAndMethodology** (Section 2)
   - Assessment metadata and objectives
   - Referral information

## Performance Considerations

The Redux implementation includes several performance optimizations:

1. **Selective Rendering**: Components only re-render when relevant state changes
2. **Memoization**: Used for expensive computations
3. **Normalized State**: Reduces duplication and helps with selective updates
4. **Batch Updates**: Multiple updates are batched to reduce rendering cycles
5. **Lazy Loading**: Components are loaded only when needed

## Error Handling Strategy

Consistent error handling across the application:

1. **Try/Catch Blocks**: All async operations use try/catch
2. **Thunk Error Handling**: Thunks include proper error management
3. **Toast Notifications**: User-friendly error messages via toast notifications
4. **Console Logging**: Detailed error information logged to console for debugging
5. **Loading States**: UI updates to reflect loading/error states

## Testing Considerations

When testing Redux components:

1. **Store Mocking**: Create a mock store for testing
2. **Action Testing**: Verify actions are dispatched correctly
3. **Selector Testing**: Ensure selectors return expected data
4. **Integration Testing**: Test component interaction with Redux
5. **Async Testing**: Test async thunks and loading states

## Future Enhancements

Potential improvements to consider:

1. **RTK Query**: Consider migrating to RTK Query for API calls
2. **Entity Adapters**: Use Redux Toolkit entity adapters for normalized collections
3. **Middleware Optimization**: Add custom middleware for specific functionality
4. **State Persistence Optimization**: Fine-tune what gets persisted
5. **Performance Profiling**: Use Redux DevTools to identify performance bottlenecks

## Conclusion

The Redux implementation provides a robust foundation for state management in Delilah V3.0. By following the patterns outlined in this document, developers can maintain consistency and leverage Redux's capabilities effectively.
