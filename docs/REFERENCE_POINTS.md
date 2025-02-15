# Reference Implementation Guide

## Key Reference Points in Demographics Section

### 1. Form Structure
```typescript
// See: src/sections/1-DemographicsAndHeader/components/Personal.tsx
// Example of form field implementation:
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
```

### 2. Validation Pattern
```typescript
// See: src/sections/1-DemographicsAndHeader/schema.ts
// Example of validation schema:
const sectionSchema = z.object({
  required: z.string().min(1, "Required field"),
  optional: z.string().optional(),
  complex: z.object({
    nested: z.string()
  })
});
```

### 3. Display Component
```typescript
// See: src/sections/1-DemographicsAndHeader/components/Display.tsx
// Example of display format:
<Card>
  <CardHeader>
    <CardTitle>Section Title</CardTitle>
  </CardHeader>
  <CardContent>
    <dl className="grid grid-cols-2 gap-4">
      <div>
        <dt className="text-sm font-medium text-gray-500">Label</dt>
        <dd className="mt-1">{value || 'Not provided'}</dd>
      </div>
    </dl>
  </CardContent>
</Card>
```

### 4. Prompt Structure
```typescript
// See: src/sections/1-DemographicsAndHeader/prompts.ts
// Example of prompt template:
export const sectionPrompts = {
  brief: `
    [Template structure]
    {data}
    [Guidelines]
  `
};
```

## Testing Examples

### 1. Component Tests
```typescript
// See: src/sections/1-DemographicsAndHeader/tests/Personal.test.tsx
describe('ComponentName', () => {
  it('renders required fields', () => {
    renderWithForm(<Component />);
    expect(screen.getByLabelText(/field/i)).toBeInTheDocument();
  });
});
```

### 2. Form Validation Tests
```typescript
// See: src/sections/1-DemographicsAndHeader/tests/validation.test.ts
it('validates required fields', async () => {
  const { findByText } = renderWithForm(<Component />);
  fireEvent.blur(screen.getByLabelText(/field/i));
  expect(await findByText('Required field')).toBeInTheDocument();
});
```

### 3. Display Tests
```typescript
// See: src/sections/1-DemographicsAndHeader/tests/Display.test.tsx
it('displays formatted data', () => {
  render(<Display data={mockData} />);
  expect(screen.getByText(mockData.value)).toBeInTheDocument();
});
```

## Knowledge Graph Examples

### 1. Entity Creation
```typescript
// See: Most recent development session in knowledge graph
createEntities([{
  name: "ComponentName_V3",
  entityType: "UI Component",
  observations: [
    "Implementation details",
    "Features list",
    "Dependencies"
  ]
}]);
```

### 2. Relationship Definition
```typescript
// See: Most recent development session in knowledge graph
createRelations([{
  from: "ComponentName_V3",
  to: "ParentSystem_V3",
  relationType: "implements"
}]);
```

## Documentation References

### 1. Component Documentation
See: `/src/sections/1-DemographicsAndHeader/components/README.md`
- Purpose
- Props
- Usage examples
- Edge cases

### 2. Schema Documentation
See: `/src/sections/1-DemographicsAndHeader/schema.ts`
- Type definitions
- Validation rules
- Error messages
- Default values

### 3. Prompt Documentation
See: `/src/sections/1-DemographicsAndHeader/PROMPTS.md`
- Template structure
- Data formatting
- Guidelines
- Examples

## Common Patterns

### 1. Form State Management
```typescript
// See: src/sections/1-DemographicsAndHeader/index.tsx
const methods = useForm<SectionData>({
  resolver: zodResolver(sectionSchema),
  defaultValues
});
```

### 2. Error Handling
```typescript
// See: src/sections/1-DemographicsAndHeader/components/ErrorBoundary.tsx
try {
  // Operation
} catch (error) {
  handleError(error);
}
```

### 3. Data Transformation
```typescript
// See: src/sections/1-DemographicsAndHeader/utils/format.ts
export function formatData(data: RawData): FormattedData {
  // Transformation logic
}
```

## Directory Structure
```
1-DemographicsAndHeader/
├── components/           # Copy this structure exactly
├── tests/               # Copy test patterns
├── utils/               # Copy utility patterns
├── index.tsx            # Copy component structure
├── schema.ts           # Copy validation patterns
└── prompts.ts          # Copy prompt patterns
```

Remember: The goal is to copy these patterns exactly, not to innovate on them.