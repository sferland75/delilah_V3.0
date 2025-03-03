# Delilah V3.0 Routing Guide

## Overview

This guide explains the routing structure in Delilah V3.0 and the permanent fixes applied to resolve conflicts between the Next.js App Router and Pages Router implementations.

## Current Routing Structure

Delilah V3.0 now uses the Next.js Pages Router as the primary routing system. The App Router components have been backed up but are not actively used to avoid conflicts.

### Main Routes

- **/** - Home page with quick access cards to different parts of the app
- **/full-assessment** - Comprehensive assessment form with all integrated sections
- **/assessment** - Dashboard for managing assessments
- **/import/assessment** - PDF import with pattern recognition
- **/report-drafting** - Assessment report generation

### Section-Specific Routes

For direct access to individual section components:

- **/emergency-symptoms** - Direct access to Symptoms Assessment
- **/medical-full** - Direct access to Medical History
- **/assessment-sections** - Menu of all individual section pages

## Understanding the Fix

The project had routing conflicts due to:

1. Mixing both App Router (`/src/app/`) and Pages Router (`/src/pages/`) implementations
2. Inconsistent component exports across different files
3. Issues with pattern recognition integration

### Applied Fixes

1. **Routing Consolidation**: Standardized on Pages Router for consistency
2. **Direct Component Loading**: Used `require()` to bypass export chain issues
3. **Context Integration**: Ensured AssessmentContext is properly attached
4. **Navigation Updates**: Added all key routes to the navbar for easy access

## Component Loading Approach

For each section, we use direct component loading to avoid export issues:

```javascript
// Example of direct component loading
const SymptomsComponent = require('@/sections/4-SymptomsAssessment/components/SymptomsAssessment.integrated.final.tsx').SymptomsAssessmentIntegratedFinal;
```

This approach bypasses any export chain issues by going directly to the source component file.

## Best Practices for Future Development

1. **Stick to One Router**: Choose either App Router or Pages Router, not both
2. **Consistent Exports**: Use consistent export patterns across components
3. **Error Boundaries**: Always wrap section components in error boundaries
4. **Context Usage**: Ensure all components use the AssessmentContext properly

## Debugging Tips

If you encounter routing or component loading issues:

1. Check browser console for specific errors
2. Use direct component loading for problematic sections
3. Verify component export patterns are consistent
4. Ensure the AssessmentContext is being used correctly

## Future Roadmap

For long-term stability, consider:

1. **Full Migration**: Complete migration to App Router when ready
2. **Component Cleanup**: Standardize component file structure 
3. **Export Simplification**: Create consistent export patterns
4. **Testing**: Add comprehensive tests for all routes and components
