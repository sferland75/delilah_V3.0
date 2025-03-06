# Persistent UI Issues in Delilah V3.0

## Current Status: March 4, 2025

This document outlines persistent UI issues that need to be addressed in the next development cycle. These issues affect the user experience and data integrity of the application.

## 1. Client Name Display Issue

### Problem Description
When a user creates and saves an assessment, the client name is correctly stored in the backend storage system but does not update in the UI header. The page continues to display "Unnamed Client" even after successfully saving client information in the Demographics form.

### Investigation Summary
The issue appears to stem from how the application manages state between different components:

1. The `assessment-storage-service.ts` is correctly storing the client name as "Last Name, First Name" format in localStorage.
2. The `Demographics.tsx` component successfully saves the data to context and localStorage.
3. The `full-assessment.tsx` page does not refresh or update its state to reflect these changes.
4. The attempted solutions using `router.push()` and `router.replace()` have not resolved the issue.

### Attempted Solutions
The following approaches have been attempted without success:

1. Adding state management to track client name changes:
   ```typescript
   const [clientDisplayName, setClientDisplayName] = useState('Unnamed Client');
   ```

2. Adding a format converter to handle name format differences:
   ```typescript
   if (displayName.includes(',')) {
     const parts = displayName.split(',');
     if (parts.length === 2) {
       displayName = `${parts[1].trim()} ${parts[0].trim()}`;
     }
   }
   ```

3. Forcing page refreshes after saving:
   ```typescript
   setTimeout(() => {
     router.replace(router.asPath);
   }, 500);
   ```

4. Adding direct access to localStorage after save operations:
   ```typescript
   const assessments = getAllAssessments();
   const freshAssessment = assessments.find(a => a.id === currentAssessmentId);
   ```

### Next Steps for Developers
For the developer continuing this work, we recommend the following approaches:

1. **Implement a Global State Solution**:
   - Consider implementing Redux or another global state management library instead of relying on React Context and localStorage.
   - This will ensure all components have access to the latest state changes.

2. **Server-Side Rendering**:
   - Consider moving some state management to server-side rendering to ensure consistent data across page loads.

3. **React Query Integration**:
   - Implementing React Query would help manage both the data fetching and state synchronization.

4. **Hard Page Refresh Investigation**:
   - The current approaches to refreshing the page may be intercepted by Next.js's client-side navigation.
   - Test a traditional `window.location.reload()` approach with appropriate measures to preserve the current state.

5. **Component Hierarchy Restructuring**:
   - Reevaluate the component hierarchy to minimize prop drilling and state management complexity.
   - Consider lifting state higher in the component tree.

## 2. Form Data Persistence Issues

### Problem Description
Form data is inconsistently persisted when navigating between different tabs/sections. Users report that their entered data sometimes disappears when they navigate away from a section and return to it.

### Investigation Summary
The issue appears related to how the form data is saved and retrieved:

1. The auto-save functionality in `Demographics.tsx` is triggering, but may not be properly updating the context.
2. The `updateSection` function in `AssessmentContext.tsx` might not be propagating changes correctly.
3. There may be timing issues related to when data is saved versus when navigation occurs.

### Recommended Approach for Resolution
The developer who picks up this issue should focus on:

1. Implementing a more robust form state management solution, possibly using Formik or React Hook Form with persistent storage.
2. Adding explicit save operations on tab change events.
3. Implementing a consistent approach to data loading when returning to previously visited tabs.

## 3. Save Button Functionality

### Problem Description
Save buttons throughout the application (both section-specific and global) appear to execute their functions without errors but don't always result in visible UI updates or data persistence.

### Technical Details
- Save operations successfully execute and return `true`
- Toast notifications confirm successful saves
- However, the UI state doesn't always reflect the saved data
- LocalStorage shows the correct saved data when inspected directly

### Recommended Approach
1. Implement a unified save operation that ensures UI state, context, and storage are all updated atomically.
2. Add comprehensive logging to track the flow of data during save operations.
3. Consider adding a data version or timestamp approach to force UI refreshes when underlying data changes.

## Conclusion

These UI issues represent critical functionality problems that should be prioritized in the next development cycle. The application's core functionality is working, but the user experience is compromised by these state management and UI update issues.

When addressing these issues, focus on implementing a more robust and predictable state management approach rather than trying to fix the existing implementation with small patches. A more fundamental restructuring of how state is managed across the application may be necessary.
