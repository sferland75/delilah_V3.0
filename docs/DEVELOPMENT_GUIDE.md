# Development Guide Updates

## Form Component Development

### 1. Setup New Component

```typescript
// 1. Create component file
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

export function NewComponent() {
  const { control } = useFormContext();
  return (
    <div className="space-y-8">
      {/* Form fields here */}
    </div>
  );
}

// 2. Create test configuration
const testConfig = {
  fields: [
    // Field definitions
  ],
  sections: [
    // Section organization
  ],
  errorHandling: {
    submission: true,
    validation: true,
    network: true
  }
};

// 3. Generate tests
const { structureTests, validationTests } = createFormTests('NewComponent', testConfig);
```

### 2. Test Implementation

See [TESTING_STRATEGY.md](./TESTING_STRATEGY.md) for detailed testing patterns.

```typescript
// Component test file
import { createFormTests } from '@/test/form-test-factory';

const config = {
  fields: [
    {
      name: 'fieldName',
      type: 'text',
      required: true
    }
  ]
};

const { structureTests } = createFormTests('ComponentName', config);
structureTests();
```

### 3. Error Handling Pattern

```typescript
// Error boundaries in form components
<FormField
  control={control}
  name="fieldName"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Field Label</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

## Development Workflow

### 1. Component Creation
- Create basic structure
- Add form fields
- Implement validation
- Add error handling
- Write tests using factory

### 2. Testing
- Use test factory
- Add integration tests
- Verify accessibility
- Check coverage

### 3. Documentation
- Update knowledge graph
- Document patterns
- Update guides

## Quality Standards

### 1. Testing
- Jest + Testing Library
- Form Test Factory
- 80% coverage minimum
- Accessibility verification

### 2. Documentation
- Update knowledge graph
- Document patterns
- Note error handling
- Record accessibility

### 3. Code Standards
- TypeScript strict mode
- Error boundaries
- Form validation
- Accessibility support

## Form Patterns

### 1. Field Configuration
```typescript
{
  name: 'fieldName',
  type: 'text',
  required: true,
  validation: {
    pattern: /^[A-Z]+$/,
    message: 'Custom error'
  }
}
```

### 2. Section Organization
```typescript
{
  name: 'Section Name',
  fields: ['field1', 'field2'],
  description: 'Section description'
}
```

### 3. Error Handling
```typescript
{
  submission: true,
  validation: true,
  network: true
}
```

## Integration Requirements

### 1. State Management
- Form persistence
- Cross-tab state
- Mode switching
- Error state

### 2. Validation
- Field level
- Form level
- Cross-field
- Async validation

### 3. Accessibility
- ARIA labels
- Focus management
- Error announcements
- Keyboard navigation

## Resources

### 1. Testing
- [Testing Strategy](./TESTING_STRATEGY.md)
- [Form Test Factory](../src/test/form-test-factory.tsx)
- [Integration Tests](../src/sections/1-DemographicsAndHeader/tests)

### 2. Components
- [Demographics Reference](../src/sections/1-DemographicsAndHeader)
- [Form Components](../src/components/ui/form)
- [Test Utils](../src/test/test-utils.tsx)

### 3. Documentation
- [Knowledge Graph](./KNOWLEDGE_GRAPH.md)
- [Component Patterns](../src/patterns)
- [Accessibility Guide](./ACCESSIBILITY.md)