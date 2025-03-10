# Delilah V3.0 Routing and Component Structure Guide

This guide explains the standardized approach for organizing routes and components in the Delilah V3.0 application.

## Directory Structure

```
delilah_V3.0/
├── pages/          # All route definitions go here
│   ├── index.tsx   # Homepage
│   ├── _app.js     # App wrapper with providers
│   └── [section-name].tsx  # Individual section pages
├── src/
│   ├── sections/   # Section-specific components and logic
│   │   ├── 6-TypicalDay/  # Grouped by section number
│   │   │   ├── components/  # Complex components
│   │   │   ├── index.ts     # Exports
│   │   │   ├── schema.ts    # Data validation
│   │   │   ├── types.ts     # TypeScript types
│   │   │   └── SimpleTypicalDay.tsx  # Simplified version
│   ├── services/   # Shared services
│   ├── contexts/   # Context providers
│   └── components/ # Shared UI components
```

## Routing Pattern

1. **Place all routes in `/pages` directory**: In Next.js Pages Router, only files in the `/pages` directory are registered as routes.

2. **Avoid duplicate routes**: Do not create routes in both `/pages` and `/src/pages` as this causes conflicts.

3. **Route naming convention**: Use kebab-case for route names (e.g., `typical-day.tsx`).

## Component Structure

1. **Main Component for Each Section**:
   - Complex implementation: `/src/sections/[number]-[name]/components/[Name].tsx`
   - Simplified implementation: `/src/sections/[number]-[name]/Simple[Name].tsx`

2. **Component Integration with Context**:
   - Use `useAssessment()` hook consistently
   - Use `updateSection()` method for saving data
   - Handle loading data from context in useEffect

3. **Error Boundaries**:
   - Wrap components in ErrorBoundary components
   - Provide fallback UI for errors

## Data Flow

1. **Schema and Validation**:
   - Define Zod schema in `schema.ts`
   - Define TypeScript types in `types.ts`
   - Use consistent naming patterns

2. **Data Conversion**:
   - Use mapper services for conversion between formats
   - Handle errors in conversion process
   - Support backward compatibility

3. **Form Management**:
   - Use React Hook Form for forms
   - Initialize with schema resolver when possible
   - Handle form submission and reset consistently

## Component Creation Best Practices

1. **Always create a simplified version** of each complex component:
   ```typescript
   // SimpleTypicalDay.tsx
   export function SimpleTypicalDay() {
     // Simplified implementation with minimal dependencies
   }
   ```

2. **Export components via index.ts**:
   ```typescript
   // index.ts
   export { default as SimpleTypicalDay } from './SimpleTypicalDay';
   export { default as TypicalDaySection } from './TypicalDaySection';
   export type { TypicalDay as TypicalDayType } from './schema';
   export { typicalDaySchema, defaultFormState } from './schema';
   ```

3. **Use fallback components** for error cases:
   ```typescript
   const FallbackComponent = () => (
     <div className="p-6 border-2 border-orange-200 bg-orange-50 rounded-md">
       <h3 className="text-lg font-medium text-orange-800 mb-2">Loading Error</h3>
       <p className="text-orange-700">This section encountered an error while loading.</p>
     </div>
   );
   ```

## Page Structure Pattern

1. **Standard Page Template**:
   ```typescript
   export default function SectionPage() {
     return (
       <div className="container mx-auto py-6">
         <div className="flex justify-between items-center mb-6">
           <h1 className="text-2xl font-bold">Section Name</h1>
           <div className="flex space-x-2">
             <Link href="/full-assessment">
               <Button variant="outline">Full Assessment</Button>
             </Link>
             <Link href="/">
               <Button variant="outline">Return to Home</Button>
             </Link>
           </div>
         </div>
         
         <Card className="mb-6">
           <CardHeader>
             <CardTitle>Section Title</CardTitle>
           </CardHeader>
           <CardContent>
             <AssessmentProvider>
               <SimpleSectionComponent />
             </AssessmentProvider>
           </CardContent>
         </Card>
       </div>
     );
   }
   ```

2. **Dynamic imports** for troubleshooting:
   ```typescript
   const DynamicComponent = () => {
     const [Component, setComponent] = React.useState(null);
     
     React.useEffect(() => {
       import('@/sections/6-TypicalDay/SimpleTypicalDay')
         .then(module => setComponent(() => module.default))
         .catch(error => console.error("Failed to load component:", error));
     }, []);
     
     return Component ? <Component /> : <p>Loading component...</p>;
   };
   ```

## Troubleshooting Components

1. **Check console errors**: Always check browser console for import or runtime errors.

2. **Test with simplified component**: Create and test with a basic component first.

3. **Add error boundaries**: Wrap components in error boundaries to isolate failures.

4. **Use dynamic imports**: Use dynamic imports to identify module resolution issues.

5. **Add debugging logs**: Add console.log statements at component lifecycle points.

## Assessment Context Integration

1. **Loading Data**:
   ```typescript
   const { data, updateSection } = useAssessment();
   
   useEffect(() => {
     if (data?.sectionName) {
       // Map data to form state
       // Set loading state
     }
   }, [data?.sectionName]);
   ```

2. **Saving Data**:
   ```typescript
   const onSubmit = (formData) => {
     try {
       // Map form data to context structure
       updateSection('sectionName', contextData);
       // Show success message
     } catch (error) {
       console.error("Error saving data:", error);
     }
   };
   ```

By following these patterns consistently, we create a robust, maintainable codebase with predictable behavior and improved error handling.
