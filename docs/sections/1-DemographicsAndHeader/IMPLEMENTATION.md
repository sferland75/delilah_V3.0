# Demographics Section Implementation Guide

## Component Architecture

### Main Section Component (index.tsx)
- Manages form state with react-hook-form
- Handles tab navigation
- Toggles between edit/view modes
- Implements auto-save

```typescript
export function DemographicsSection() {
  const methods = useForm<Demographics>({
    resolver: zodResolver(demographicsSchema),
    defaultValues
  });

  useFormPersistence(methods);
  
  // View or Edit mode rendering
  return mode === 'view' ? <Display /> : <Form />;
}
```

### Form Components Structure
Each form component follows the pattern:
```typescript
export function SubForm() {
  const { control } = useFormContext<Demographics>();
  
  return (
    <div className="space-y-8">
      <FormField
        control={control}
        name="fieldName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Label</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
```

## Data Flow

1. User Input → Form Components
2. Form State → react-hook-form
3. Validation → Zod Schema
4. Persistence → localStorage
5. Display → Formatted View

## Testing Strategy

### Unit Tests
- Component rendering
- Form validation
- User interactions

### Integration Tests
- Form state management
- Data persistence
- Error handling

### End-to-End Tests
- Complete form submission
- Navigation flow
- Data preservation

## Prompt Lab Integration

### Data Formatting
```typescript
export function formatDemographicsData(data: Demographics): string {
  // Format data for Claude prompt
}
```

### Prompt Templates
- Brief: Basic identification
- Standard: Complete information
- Detailed: Comprehensive context

## Dependencies

### Components
- shadcn/ui form components
- react-hook-form
- zod validation

### Testing
- @testing-library/react
- jest
- msw for API mocking

## Development Workflow

1. Create/Update Component
2. Write/Update Tests
3. Implement Validation
4. Add Error Handling
5. Test Edge Cases
6. Document Changes

## Deployment Checklist

- [ ] All tests passing
- [ ] Form validation complete
- [ ] Error handling implemented
- [ ] Accessibility verified
- [ ] Documentation updated
- [ ] Performance tested
- [ ] Prompt templates verified