# Mapper Service Pattern Documentation

## Overview

The Mapper Service Pattern is a design approach implemented in Delilah V3.0 to separate data transformation logic from UI components. This pattern has been successfully applied to the Medical History and Symptoms Assessment sections, resolving complex data mapping issues and performance problems.

## Core Principles

1. **Separation of Concerns**
   - Keep UI components focused on rendering and user interactions
   - Isolate data transformation logic in dedicated services
   - Make components more maintainable and testable

2. **Bidirectional Mapping**
   - Context → Form mapping (loading data into the UI)
   - Form → Context mapping (saving data back to the context)
   - Preserve data integrity during transformations

3. **Error Handling**
   - Implement comprehensive error handling with try/catch blocks
   - Provide detailed logging for debugging
   - Include fallback mechanisms for missing or malformed data

4. **Testing Support**
   - Implement JSON import/export functionality
   - Enable validation of mappings with test data
   - Support comparison of input and output data

## Implementation Structure

A typical mapper service includes:

```typescript
// Default form values (exported to be used by the component)
export const defaultValues = {
  // Initial form state structure
};

/**
 * Maps context data to form data structure
 * @param contextData Data from the assessment context
 * @returns Object containing form data and hasData flag
 */
export function mapContextToForm(contextData: any) {
  try {
    // Logging for debugging
    console.log("Mapper - Context Data:", contextData);
    
    // Start with default values
    const formData = JSON.parse(JSON.stringify(defaultValues));
    let hasData = false;
    
    // Early return if no data
    if (!contextData || Object.keys(contextData).length === 0) {
      return { formData, hasData };
    }
    
    // Map each section of data from context to form format
    // ...
    
    // Set hasData flag if any data was mapped
    hasData = true;
    
    // Final logging
    console.log("Mapper - Mapped Form Data:", formData);
    return { formData, hasData };
  } catch (error) {
    // Error handling
    console.error("Mapper - Error mapping context data:", error);
    return { formData: defaultValues, hasData: false };
  }
}

/**
 * Maps form data to context structure
 * @param formData Form data from React Hook Form
 * @returns Context-structured data
 */
export function mapFormToContext(formData: any) {
  try {
    // Transform form data to context format
    const contextData = {
      // Mapping logic
    };
    
    // Logging
    console.log("Mapper - Mapped Context Data:", contextData);
    return contextData;
  } catch (error) {
    // Error handling
    console.error("Mapper - Error mapping to context:", error);
    return { /* Default empty data structure */ };
  }
}

/**
 * Creates a JSON export of the data
 * @param contextData Context data
 * @returns String representation of the JSON data
 */
export function exportToJson(contextData: any) {
  try {
    return JSON.stringify(contextData, null, 2);
  } catch (error) {
    console.error("Mapper - Error exporting to JSON:", error);
    return '';
  }
}

/**
 * Imports data from JSON
 * @param jsonString JSON string representation of data
 * @returns Parsed data
 */
export function importFromJson(jsonString: string) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Mapper - Error importing from JSON:", error);
    return null;
  }
}
```

## Component Integration

In your component, use the mapper service like this:

```typescript
// Import the mapper service
import { 
  mapContextToForm, 
  mapFormToContext,
  exportToJson,
  importFromJson,
  defaultValues
} from '@/services/myComponentMapper';

export function MyComponent() {
  const { data, updateSection } = useAssessment();
  const [dataLoaded, setDataLoaded] = useState(false);
  
  // Define form with the schema
  const form = useForm({
    resolver: zodResolver(mySchema),
    defaultValues: defaultValues,
    mode: "onChange"
  });

  // Access data from context
  const contextData = data?.mySection || {};

  // Update form when context data changes
  useEffect(() => {
    if (contextData && Object.keys(contextData).length > 0) {
      try {
        const { formData, hasData } = mapContextToForm(contextData);
        form.reset(formData);
        setDataLoaded(hasData);
      } catch (error) {
        console.error("Error updating form from context:", error);
      }
    }
  }, [contextData, form]);

  // Handle form submission
  const onSubmit = (formData) => {
    try {
      // Map form data to context structure
      const contextFormattedData = mapFormToContext(formData);
      
      // Update the context with the mapped data
      updateSection('mySection', contextFormattedData);
      
      // Persist form data if needed
      persistForm(formData);
    } catch (error) {
      console.error("Error preparing data for context update:", error);
    }
  };
  
  // Additional functions for JSON import/export
  // ...
}
```

## Key Benefits

1. **Improved Performance**
   - Prevents "Too many re-renders" errors by isolating state updates
   - Reduces component complexity
   - Enables proper memoization of expensive operations

2. **Better Error Handling**
   - Centralized error handling for data transformations
   - Detailed logging for debugging
   - Resilient to malformed or missing data

3. **Enhanced Testability**
   - Pure functions are easier to test
   - JSON import/export enables data flow validation
   - Clear separation of UI and data concerns

4. **Maintainability**
   - Logic for complex transformations is isolated
   - Components remain focused on UI concerns
   - Changes to data structure are handled in one place

## Common Mapping Techniques

1. **Defensive Mapping**
   ```typescript
   // Check if data exists before mapping
   if (contextData.section?.field) {
     formData.section.field = contextData.section.field;
   }
   ```

2. **Default Values**
   ```typescript
   // Provide fallbacks for missing data
   formData.section.field = contextData.section?.field || defaultValue;
   ```

3. **Type Conversion**
   ```typescript
   // Convert between string and array representations
   formData.tags = contextData.tagsString ? 
     contextData.tagsString.split(',').map(t => t.trim()) : 
     [];
   ```

4. **Complex Transformations**
   ```typescript
   // Transform between different data structures
   formData.detailedItems = contextData.simpleItems.map(item => ({
     id: item.id,
     name: item.title,
     description: item.content,
     status: item.completed ? 'done' : 'pending'
   }));
   ```

5. **Data Extraction from Text**
   ```typescript
   // Extract structured data from text descriptions
   if (contextData.description && contextData.description.includes('pain')) {
     formData.painLevel = extractPainLevel(contextData.description);
   }
   ```

## Testing Strategies

1. **Unit Testing Transformations**
   - Test individual mapping functions with various input data
   - Verify expected output format and values
   - Test error handling with malformed inputs

2. **End-to-End Data Flow Testing**
   - Test the complete data flow: form → context → form
   - Verify data integrity through transformations
   - Test with minimal, typical, and complex data sets

3. **JSON Export/Import Testing**
   - Export form data to JSON
   - Import the JSON back into a new form
   - Verify that all data is preserved

## Future Extensions

The mapper service pattern should be extended to all remaining sections to ensure consistency and maintainability across the application. When implementing a new mapper service:

1. Create a dedicated file in the `services` directory
2. Export default values, mapping functions, and JSON utilities
3. Update the component to use the mapper service
4. Add comprehensive error handling and logging
5. Write tests for the mapper service

## Examples

See the implementation in:
- `src/services/medicalHistoryMapper.ts`
- `src/services/symptomsAssessmentMapper.ts`

These files demonstrate the pattern in action and can be used as templates for extending to other sections.
