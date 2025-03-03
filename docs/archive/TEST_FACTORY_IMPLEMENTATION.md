# Test Factory Implementation Guide

## Overview
The test factory approach focuses on essential testing patterns while maintaining consistent structure across sections.

## Current Implementation

### Directory Structure
```
section/
├── tests/
│   ├── components/     # Individual component tests
│   ├── integration/    # Cross-component tests
│   ├── unit/          # Schema and state tests
│   └── utils/         # Shared test utilities
```

### Common Test Patterns

#### 1. Form Section Testing
```typescript
// Mock setup at top level
const mockPersist = jest.fn();
jest.mock('@/hooks/useFormPersistence', () => ({
  useFormPersistence: () => ({
    persist: mockPersist,
    error: null
  })
}));

// Test wrapper with form context
function TestWrapper({ children, initialValues = {} }) {
  const methods = useForm({
    defaultValues: {
      ...defaultFormState,
      ...initialValues,
      config: {
        mode: 'edit',
        activeTab: 'default'
      }
    }
  });
  
  return <FormProvider {...methods}>{children}</FormProvider>;
}

// Component test example
describe('Section Component', () => {
  const user = userEvent.setup();

  it('completes user workflow', async () => {
    render(<Component />, { initialValues: mockData });
    await user.type(...);
    expect(...).toBeInTheDocument();
  });
});
```

#### 2. Integration Testing
```typescript
describe('Section Integration', () => {
  it('maintains state between tabs', async () => {
    let formMethods;
    const TestForm = () => {
      formMethods = useForm({...});
      return <FormProvider {...formMethods}><Component /></FormProvider>;
    };

    render(<TestForm />);
    await act(...);
    expect(formMethods.getValues()).toBe(...);
  });
});
```

#### 3. Schema Validation
```typescript
describe('Schema Validation', () => {
  it('validates required fields', async () => {
    const result = await schema.safeParseAsync(invalidData);
    expect(result.success).toBe(false);
  });
});
```

### Test Utilities Pattern
```typescript
// test-utils.tsx
export const mockData = {...};

export const render = (
  ui: React.ReactElement,
  { initialValues, ...options } = {}
) => rtlRender(ui, { 
  wrapper: (props) => (
    <FormWrapper {...props} initialValues={initialValues} />
  ),
  ...options 
});
```

## Implementation Examples
See FunctionalStatus section for latest patterns:
- Schema validation with comprehensive error testing
- Form state management with proper hooks testing
- Integration tests focusing on user workflows
- Component tests with proper form context management

## Best Practices

### 1. Mock Setup
- Place mocks before imports
- Use consistent mock patterns
- Clean up in beforeEach
- Mock at module level

### 2. Test Structure
- Focus on user behavior
- Group related tests logically
- Test error states explicitly
- Maintain consistent patterns

### 3. Form Testing
- Test field updates
- Verify state persistence
- Check validation
- Test tab navigation

### 4. Common Patterns to Follow
- Use act() for state updates
- Handle async operations properly
- Test error states explicitly
- Verify form state directly

## Testing Workflow

1. Create test utilities first
2. Implement schema tests
3. Add form state tests
4. Create component tests
5. Add integration tests
6. Document patterns used