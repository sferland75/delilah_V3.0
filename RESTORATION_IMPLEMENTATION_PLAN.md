# Delilah V3.0 Restoration Implementation Plan

## Overview

This document outlines the concrete steps required to implement the restoration plan defined in RESTORATION_PLAN.md. The goal is to restore all fully developed, integrated sections from the Pages Router that are currently being bypassed in favor of new, incomplete implementations in the App Router.

## Implementation Status

The following changes have been implemented as part of the restoration process:

1. ✅ Created ROUTE_MAPPING.md to document all routes and their proper implementations
2. ✅ Implemented App Router redirect to Pages Router for assessment sections
3. ✅ Enhanced full-assessment.tsx to properly load all section components
4. ✅ Created consistent navigation component (AssessmentNav.tsx)
5. ✅ Set up direct section access for emergency-symptoms.tsx
6. ✅ Fixed component loading for Initial Assessment, Purpose and Methodology, and Medical History
7. ✅ Created medical-full.tsx for direct access to Medical History
8. ✅ Created typical-day.tsx for direct access to Typical Day
9. ✅ Resolved route conflicts between App Router and Pages Router

## Completed Implementation Tasks

### Phase 1: Complete Route Redirection (Priority: CRITICAL) ✅

1. **Implement /import-pdf redirect:**
   - ✅ Created redirect from App Router `/import` to Pages Router `/import-pdf`
   - ✅ File created: `src/app/import/[[...path]]/page.tsx`

2. **Implement report-drafting redirect:**
   - ✅ Created redirect from App Router `/report-drafting` to Pages Router `/report-drafting`
   - ✅ File created: `src/app/report-drafting/[[...path]]/page.tsx`

3. **Implement root redirect and resolve conflicts:**
   - ✅ Renamed conflicting `src/app/page.tsx` file
   - ✅ Updated App Router layout with proper documentation
   - ✅ Added fallback handlers for unmatched App Router routes
   - ✅ Created `ROUTE_CONFLICTS_FIX.md` documentation

4. **Implement root layout with AssessmentContext:**
   - ✅ Ensured AssessmentContext is available in all Pages Router paths
   - ✅ Updated App Router layout for redirection purposes

### Phase 2: Complete Direct Section Access (Priority: URGENT) ✅

1. **Create direct access for Medical History:**
   - ✅ Implemented `/medical-full.tsx` with proper component loading
   - ✅ Added fallback mechanisms for different file versions

2. **Create direct access for Typical Day:**
   - ✅ Implemented `/typical-day.tsx` with proper component loading
   - ✅ Added fallback mechanisms for different file versions

3. **Create section selection page:**
   - ✅ Implemented `/assessment-sections.tsx` with cards for each section
   - ✅ Linked to both direct access and full assessment with section parameter

## Remaining Implementation Tasks

### Phase 3: Enhance Integration (Priority: HIGH)

1. **Create unified dashboard:**
   - Update `/assessment/index.tsx` to show recent assessments
   - Add clear navigation to all section components

2. **Add state persistence indicators:**
   - Add visual feedback for data saving/loading
   - Ensure context state is properly maintained

### Phase 4: Address Styling Issues (Priority: MEDIUM)

1. **Identify styling issues:**
   - ✅ Created `STYLING_FIXES.md` documenting styling inconsistencies
   - ✅ Categorized issues by section and type

2. **Fix Layout Components:**
   - Ensure consistent padding and margins across all sections
   - Fix any responsive layout issues

3. **Standardize Component Styling:**
   - Create a consistent style for form elements
   - Ensure proper spacing between form sections
   - Standardize button styles and positions

4. **CSS Cleanup:**
   - Remove any inline styles that override global styles
   - Ensure proper use of Tailwind utility classes
   - Create dedicated component styles where needed

## Component Inventory and Mapping (Updated)

The following table shows the actual component paths and export names for each section:

| Section | Component Path | Component Name | Alternate Component Path |
|---------|---------------|----------------|--------------------------|
| Initial Assessment | `/sections/1-InitialAssessment/components/Demographics.integrated.tsx` | `DemographicsIntegrated` | - |
| Purpose & Methodology | `/sections/2-PurposeAndMethodology/components/PurposeAndMethodology.integrated.tsx` | `PurposeAndMethodologyIntegrated` | - |
| Medical History | `/sections/3-MedicalHistory/components/MedicalHistory.integrated.final.tsx` | `MedicalHistoryIntegratedFinal` | `/sections/3-MedicalHistory/components/MedicalHistory.integrated.tsx` |
| Symptoms Assessment | `/sections/4-SymptomsAssessment/components/SymptomsAssessment.integrated.final.tsx` | `SymptomsAssessmentIntegratedFinal` | - |
| Functional Status | `/sections/5-FunctionalStatus/components/FunctionalStatus.integrated.final.tsx` | `FunctionalStatusIntegratedFinal` | - |
| Typical Day | `/sections/6-TypicalDay/components/TypicalDay.integrated.final.tsx` | `TypicalDayIntegratedFinal` | - |
| Environmental Assessment | `/sections/7-EnvironmentalAssessment/components/EnvironmentalAssessment.integrated.final.tsx` | `EnvironmentalAssessmentIntegratedFinal` | - |
| Activities of Daily Living | `/sections/8-ActivitiesOfDailyLiving/components/ActivitiesOfDailyLiving.integrated.final.tsx` | `ActivitiesOfDailyLivingIntegratedFinal` | - |
| Attendant Care | `/sections/9-AttendantCare/components/AttendantCare.integrated.final.tsx` | `AttendantCareIntegratedFinal` | - |
| Housekeeping Calculator | `/sections/10-HousekeepingCalculator/components/Housekeeping.integrated.final.tsx` | `HousekeepingIntegratedFinal` | - |
| AMA Guides Assessment | `/sections/11-AMAGuidesAssessment/components/AMAGuides.integrated.final.tsx` | `AMAGuidesIntegratedFinal` | - |

## Context Integration

All components must integrate with the `AssessmentContext` to maintain data consistency. The context is defined in:

```
/src/contexts/AssessmentContext.tsx
```

This context provides:
- State management for all assessment data
- Data persistence mechanisms
- Form validation
- Error handling

## Testing the Restoration

After implementing the changes, test the following:

1. Navigation between all sections via the navbar
2. Direct access to sections via their specific URLs
3. Data persistence when navigating between sections
4. Error handling when components fail to load
5. Proper rendering of all section components
6. State management through the AssessmentContext

## Debugging Tips for Common Issues

1. **Component Not Found Errors**:
   - Check the exact file path and export name
   - Try alternative versions of the file (.integrated.tsx, .integrated.final.tsx)
   - Check if the component is exported as default or named export

2. **Styling Issues**:
   - Check for conflicting tailwind classes
   - Ensure proper container and spacing classes
   - Look for inline styles that might override global styles

3. **Context Integration Issues**:
   - Ensure each component is properly wrapped with the AssessmentContext
   - Check that components are accessing context data correctly
   - Verify that state updates are properly dispatched

4. **Route Conflict Issues**:
   - If there are conflicts between App Router and Pages Router paths, refer to the approach in `ROUTE_CONFLICTS_FIX.md`
   - Remove or rename the conflicting App Router file
   - Add explicit redirects in the App Router to the Pages Router equivalent

## Implementation Timeline

1. **Day 1 (CRITICAL):** Complete all Phase 1 tasks ✅
2. **Day 2 (URGENT):** Complete all Phase 2 tasks ✅
3. **Day 3 (HIGH):** Complete all Phase 3 tasks
4. **Day 4 (MEDIUM):** Complete all Phase 4 tasks (styling fixes)

## Post-Restoration Verification

After completing the restoration:

1. Run all existing tests to ensure functionality
2. Manually verify all sections and their integration
3. Document any remaining issues for future fixes
4. Create a comprehensive test plan for ongoing validation

## Final Verification Checklist

- [x] All sections accessible through Pages Router
- [x] App Router redirects working correctly
- [x] Route conflicts resolved
- [ ] AssessmentContext properly integrated
- [x] Error boundaries functioning
- [x] Navigation consistent across application
- [ ] Data persistence functioning correctly
- [ ] All tests passing
- [ ] Styling issues addressed
