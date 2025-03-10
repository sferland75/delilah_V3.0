# Component Integration Troubleshooting Guide

This document outlines common issues encountered when integrating section components into the Pages Router and recommended solutions.

## Nested Form Issues

**Problem**: Error `<form> cannot appear as a descendant of <form>` occurs when using `FormProvider` and `Form` components from react-hook-form within components already wrapped in forms.

**Solution**: 
- Replace the `Form` component from shadcn/ui with a standard HTML `form` element
- Use local state management with `useState` instead of `useForm` when nesting is unavoidable
- Create simplified components that don't use nested form structures

Example implementation:
```jsx
// Instead of
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    {/* Form content */}
  </form>
</Form>

// Use
<form onSubmit={handleSubmit}>
  {/* Form content */}
</form>
```

## Undefined Component Errors

**Problem**: Error `Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined` when importing components.

**Solution**:
- Use direct imports from component files rather than barrel exports
- Create simplified versions of components with fewer dependencies
- Implement robust fallback mechanisms for dynamic imports

Implementation example:
```jsx
// Instead of
import { SymptomsAssessment } from '@/sections/4-SymptomsAssessment';

// Use direct imports
import { SymptomsAssessment } from '@/sections/4-SymptomsAssessment/components/SymptomsAssessment';

// Or with dynamic import and fallback
const SymptomsAssessment = dynamic(
  () => import('@/sections/4-SymptomsAssessment/components/SymptomsAssessment.ultrasimple')
    .then(mod => mod.SymptomsAssessment)
    .catch(() => import('@/sections/4-SymptomsAssessment/SimpleSymptomsAssessment')),
  { ssr: false }
);
```

## React Hook Form Property Warnings

**Problem**: Warnings about unrecognized props like `handleSubmit`, `setValue`, `getValues`, etc. being passed to DOM elements.

**Solution**:
- Don't spread form props directly to HTML elements
- Extract the needed properties before passing them to DOM elements
- Use simpler form implementations with standard HTML elements

Example fix:
```jsx
// Instead of
<form {...form}>

// Use
<form onSubmit={handleSubmit}>
```

## Empty Rendering Issues

**Problem**: Components appear to be loaded but don't display any content.

**Solution**:
- Pre-populate components with sample data to ensure visibility
- Check that the component is properly importing its sub-components
- Ensure proper CSS classes are applied for visibility

Sample data implementation:
```jsx
const [formData, setFormData] = useState({
  // Pre-populated sample data for demonstration
  preExistingConditions: [
    { 
      condition: 'Type 2 Diabetes', 
      status: 'active', 
      diagnosisDate: '2020-05-15', 
      details: 'Managed with oral medication' 
    }
  ],
  // More pre-populated data...
});
```

## Component Integration Best Practices

1. **Simplify Component Structure**:
   - Create simplified versions of complex components
   - Reduce nesting of form elements
   - Use direct state management for forms when possible

2. **Implement Proper Error Boundaries**:
   - Wrap all sections in ErrorBoundary components
   - Provide meaningful fallback UI for error states
   - Log errors to console with descriptive messages

3. **Use Direct Imports**:
   - Avoid barrel exports (index.ts files) for complex components
   - Import directly from component files
   - Create alternative simplified versions of complex components

4. **Leverage Dynamic Imports with Fallbacks**:
   - Always provide a fallback mechanism for dynamic imports
   - Set `ssr: false` for client-side only components
   - Use loading states to indicate component loading

## Affected Components

The following components have been updated to resolve integration issues:

1. **SymptomsAssessment**:
   - Created ultrasimple version with fewer dependencies
   - Fixed nested form structure
   - Added simplified sub-components

2. **MedicalHistory**:
   - Replaced Form component with standard HTML form
   - Implemented direct state management
   - Pre-populated with sample data

3. **PhysicalSymptomsSection**:
   - Fixed incorrect component imports
   - Simplified state management
   - Created alternative version with fewer dependencies

## Future Improvements

1. Create a standard pattern for form components that avoids nesting issues
2. Implement a testing strategy to catch integration issues before deployment
3. Refactor components to use a more consistent approach to form management
4. Document all component dependencies and import requirements
