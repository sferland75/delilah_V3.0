# Delilah V3.0 Developer Quick Start Guide

This guide provides a quick overview of the restored Delilah V3.0 application and instructions for development.

## Project Status

The application now has a working:
- Dashboard navigation system
- Form completion with save capabilities 
- Report drafting module with API integration

The import functionality has been parked for future development, as agreed.

## Key Files and Components

### Core UI Components

- `pages/index.tsx`: Main dashboard 
- `pages/assessment/index.tsx`: Assessment list and management
- `pages/full-assessment.tsx`: Assessment form with section tabs
- `src/components/navigation/main/MainNavigation.tsx`: Main navigation component

### Form Components

- `src/components/form/FormSectionBase.tsx`: Base component for all form sections
- `src/sections/sample/DemoSection.tsx`: Example form implementation
- `src/services/assessment-storage-service.ts`: Data persistence service

### Report Drafting

- `pages/report-drafting/index.tsx`: Report drafting workflow
- `src/components/ReportDrafting/ReportPreview.tsx`: Report preview with editing
- `src/lib/report-drafting/`: Contains report generation logic and API integration

## Development Workflow

### Running the Application

1. Install dependencies:
   ```
   npm install
   ```

2. Start development server:
   ```
   npm run dev
   ```

3. Access at http://localhost:3000

### Creating New Form Sections

1. Create a new form section component that follows the pattern in `src/sections/sample/DemoSection.tsx`
2. Define a Zod schema for validation
3. Implement `mapContextToForm` and `mapFormToContext` functions
4. Render your form fields in the `formContent` function
5. Use the `FormSectionBase` to handle state management

Example:
```jsx
export default function YourSection() {
  // Form content renderer
  const formContent = (form, dataLoaded, isSaving) => (
    <div className="space-y-6">
      {/* Your form fields here */}
    </div>
  );
  
  return (
    <FormSectionBase
      title="Your Section"
      sectionId="yourSection"
      schema={yourSchema}
      defaultValues={defaultValues}
      mapContextToForm={mapContextToForm}
      mapFormToContext={mapFormToContext}
      formContent={formContent}
      nextSection="/full-assessment?section=next-section"
      previousSection="/full-assessment?section=previous-section"
    />
  );
}
```

### Extending Report Drafting

1. Add new content generators in `src/lib/report-drafting/content-generators.ts`
2. Update the template definitions in `src/lib/report-drafting/templates.ts`
3. Extend the API client in `src/lib/report-drafting/api-client.ts` for new AI capabilities

## Data Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     User UI     │────►│ Form Components │────►│ AssessmentContext│
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                                                         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Export UI    │◄────│ Report Drafting │◄────│    Assessment    │
│                 │     │     System      │     │   Storage Svc    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Troubleshooting Common Issues

1. **Missing UI components**:
   - Check that all UI components exist in `src/components/ui/`
   - Some components may need to be created or imported

2. **Form saving issues**:
   - Verify the `AssessmentContext` is properly initialized
   - Check browser localStorage for saved data
   - Ensure form is using the correct sectionId

3. **Report generation issues**:
   - Ensure there is assessment data available
   - Check template configuration in report-drafting library

## Testing

Run tests with:
```
npm run test
```

Focus on testing:
1. Form validation and submission
2. Assessment data persistence
3. Report generation workflow

## Next Development Phase

The future import function will require:
1. PDF processing components restoration
2. Pattern recognition integration
3. Data mapping to form components

## Contact

For questions, contact the technical lead on the project.
