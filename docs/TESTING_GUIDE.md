# Testing Guide (Updated Feb 2025)

## Tab Panel Testing Pattern
When testing tabbed interfaces, use these guidelines:

```typescript
describe('Tab Panel Tests', () => {
  it('shows correct active tab panel', async () => {
    render(<Component />);

    // Check panel visibility using ARIA attributes
    expect(screen.getByRole('tabpanel', { name: /panel-name/i }))
      .toBeInTheDocument();
    
    // Switch tabs
    await user.click(screen.getByRole('tab', { name: /other-tab/i }));
    
    // Check hidden state
    const firstPanel = screen.getByRole('tabpanel', { name: /panel-name/i });
    expect(firstPanel).toHaveAttribute('hidden');
  });
});
```

## Form Testing Factory Pattern

### Basic Setup
```typescript
const createFormTests = (componentName: string, config: FormTestConfig) => {
  describe(componentName, () => {
    // Standard form tests...
  });
};
```

### Mock Patterns
```typescript
// Form Context Mock
jest.mock('react-hook-form', () => ({
  useForm: () => ({
    register: jest.fn(),
    handleSubmit: (cb: any) => (e: any) => {
      e?.preventDefault?.();
      return cb({});
    },
    formState: { errors: {} }
  }),
  FormProvider: ({ children }: any) => <>{children}</>
}));

// UI Component Mocks
jest.mock('@/components/ui/form', () => ({
  FormField: ({ name, render }: any) => {
    const [section, field] = name.split('.');
    const id = `${section}-${field}`;
    return render({ 
      field: { 
        name,
        id,
        value: '',
        onChange: jest.fn(),
        onBlur: jest.fn()
      }
    });
  }
  // ... other form components
}));
```

## E2E Testing Guidelines

### Component Structure
```typescript
describe('Section Integration', () => {
  describe('Navigation', () => {
    it('allows tab navigation', async () => {
      // Test tab switching
    });
  });

  describe('Form Interaction', () => {
    it('handles form submission', async () => {
      // Test form submission
    });
  });

  describe('Mode Switching', () => {
    it('handles edit/view mode', async () => {
      // Test mode switching
    });
  });
});
```

### Best Practices
1. Use role-based queries when possible
2. Test ARIA attributes for accessibility
3. Mock external dependencies
4. Handle form events properly
5. Test visibility states correctly

## Testing Hierarchy

1. Unit Tests
   - Individual components
   - Form validation
   - Error states

2. Integration Tests
   - Cross-component interaction
   - State management
   - Data flow

3. E2E Tests
   - User workflows
   - Full form submission
   - Navigation paths

## Common Patterns

### Tab Testing
```typescript
// Find tab elements
const tab = screen.getByRole('tab', { name: /tab-name/i });
const panel = screen.getByRole('tabpanel', { name: /panel-name/i });

// Check initial state
expect(tab).toHaveAttribute('aria-selected', 'true');
expect(panel).not.toHaveAttribute('hidden');

// Switch tabs
await user.click(otherTab);
expect(panel).toHaveAttribute('hidden');
```

### Form Testing
```typescript
// Test form submission
const submitButton = screen.getByRole('button', { name: /submit/i });
await user.click(submitButton);
expect(mockSubmit).toHaveBeenCalled();

// Test validation
const input = screen.getByLabelText(/field-name/i);
await user.type(input, 'invalid');
expect(screen.getByText(/error-message/i)).toBeInTheDocument();
```

## Error Handling

### Test Error States
```typescript
it('handles errors gracefully', async () => {
  // Mock error state
  mockHook.mockReturnValue({
    error: new Error('Test error'),
    loading: false
  });

  render(<Component />);
  expect(screen.getByText(/test error/i)).toBeInTheDocument();
});
```

### Form Validation
```typescript
it('validates required fields', async () => {
  render(<Component />);
  
  const input = screen.getByLabelText(/required-field/i);
  await user.clear(input);
  await user.tab();
  
  expect(screen.getByText(/field is required/i)).toBeInTheDocument();
});
```

## Next Steps
1. Add tab panel visibility testing
2. Improve form event handling
3. Standardize mock patterns
4. Complete E2E test suite