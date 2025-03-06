# Redux Migration Implementation Plan

This document outlines the step-by-step approach to complete the migration from React Context API to Redux Toolkit for Delilah V3.0.

## Current Progress

- ✅ Redux infrastructure set up (store, slices, middleware)
- ✅ Bridge component created to sync data between Context and Redux
- ✅ Key components migrated:
  - ✅ Demographics component
  - ✅ MedicalHistory component
  - ✅ AssessmentList component
  - ✅ FormSectionBase component (core form wrapper)
  - ✅ SectionWrapper component (UI wrapper)
- ✅ Toast notification system implemented with Redux

## Implementation Steps

### Phase 1: Test Current Implementation (1-2 days)

1. Run the application with both Context and Redux active
2. Test the migrated components:
   - Create a new assessment
   - Fill out demographics information
   - Fill out medical history information
   - Verify data persistence between page refreshes
   - Verify toast notifications work
3. Fix any issues found during testing

### Phase 2: Core Components Migration (3-5 days)

1. Migrate remaining core components:
   - [ ] Navigation components
   - [ ] Header components
   - [ ] Assessment context provider replacements
   - [ ] Form sections and base components

2. For each component:
   - Create a .redux.tsx version of the file
   - Replace Context hooks with Redux hooks
   - Test the component individually
   - Update references in parent components

3. Update routing to use Redux state:
   - Update assessment loading in routes
   - Handle URL params with Redux state

### Phase 3: Feature Components Migration (5-7 days)

1. Migrate specialized components:
   - [ ] Report drafting components
   - [ ] Symptoms assessment components
   - [ ] Typical day components
   - [ ] Environmental assessment components
   - [ ] Activities of daily living components
   - [ ] Attendant care components

2. Implement feature-specific Redux slices if needed:
   - Create specialized slices for complex features
   - Update the root reducer

3. Add optimizations:
   - Implement memoization for selectors
   - Add performance tracking

### Phase 4: Integration and Testing (3-4 days)

1. End-to-end testing:
   - Test entire workflows with Redux
   - Verify all data is persisted correctly
   - Test error handling and edge cases

2. Switch component imports:
   - Update imports to use Redux versions
   - Remove Context references

3. Performance optimization:
   - Analyze render performance
   - Identify and fix any performance issues

### Phase 5: Context Removal and Final Migration (2-3 days)

1. Remove Context dependencies:
   - Remove Bridge component
   - Remove Context providers from _app.js
   - Clean up unused Context files

2. Final testing:
   - Comprehensive testing of all features
   - Regression testing
   - Performance testing

3. Documentation:
   - Update technical documentation
   - Create developer guidelines for Redux

## Component Migration Guidelines

When migrating a component, follow these steps:

1. **Create Redux Version**:
   ```bash
   # Use helper script to create initial version
   node create-redux-component.js src/path/to/Component.tsx
   ```

2. **Update Imports**:
   ```typescript
   // Replace Context imports
   // FROM:
   import { useAssessment } from '@/contexts/AssessmentContext';
   
   // TO:
   import { useAppSelector, useAppDispatch } from '@/store/hooks';
   import { 
     updateSectionThunk, 
     saveCurrentAssessmentThunk 
   } from '@/store/slices/assessmentSlice';
   ```

3. **Replace Context Hooks**:
   ```typescript
   // FROM:
   const { data, updateSection, saveCurrentAssessment } = useAssessment();
   
   // TO:
   const dispatch = useAppDispatch();
   const currentData = useAppSelector(state => state.assessments.currentData);
   const saveStatus = useAppSelector(state => state.assessments.loading.save);
   ```

4. **Update State Management**:
   ```typescript
   // FROM:
   updateSection('sectionName', sectionData);
   
   // TO:
   dispatch(updateSectionThunk({ 
     sectionName: 'sectionName', 
     sectionData: sectionData 
   }));
   ```

5. **Update Save Actions**:
   ```typescript
   // FROM:
   const success = saveCurrentAssessment();
   
   // TO:
   const resultAction = await dispatch(saveCurrentAssessmentThunk());
   const success = saveCurrentAssessmentThunk.fulfilled.match(resultAction);
   ```

6. **Add Loading States**:
   ```typescript
   // Add disable state to buttons
   <Button 
     disabled={saveStatus === 'loading'}
     onClick={handleSave}
   >
     {saveStatus === 'loading' ? 'Saving...' : 'Save'}
   </Button>
   ```

7. **Replace Alerts with Toasts**:
   ```typescript
   // FROM:
   alert("Data saved successfully!");
   
   // TO:
   dispatch(addToast({
     title: "Save Successful",
     description: "Data saved successfully!",
     type: "success"
   }));
   ```

## Testing Guidelines

For each migrated component:

1. Test basic functionality:
   - Component renders correctly
   - Data loads correctly from Redux
   - Actions update the Redux store
   - UI reflects Redux state

2. Test integration with other components:
   - Data flows between components
   - Navigation works correctly
   - Form submissions update related components

3. Test error handling:
   - Error states are displayed correctly
   - Recovery from errors works properly
   - Toast notifications display correctly

## Next Steps

1. **Begin with Phase 1** - Test the current implementation
2. **Migrate remaining core components** - Focus on components used across the application
3. **Migrate feature-specific components** - Target one feature at a time
4. **Integrate and test** - Ensure everything works together
5. **Remove Context and finalize** - Complete the migration

## Timeline

With the proposed implementation plan, the complete migration should take approximately 2-3 weeks of development time, followed by 1 week of testing and finalization.
