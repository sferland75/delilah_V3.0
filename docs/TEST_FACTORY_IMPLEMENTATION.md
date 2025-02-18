# Test Factory Implementation Guide

## Overview
The test factory approach has been simplified to focus on essential testing patterns and reduce complexity.

## Current Implementation

### 1. Basic Structure
```typescript
describe('Component Tests', () => {
  // Mock setup
  const mockPersist = jest.fn();
  
  // Mock hooks at top level
  jest.mock('@/hooks/useHook', () => ({
    useHook: () => ({
      persist: mockPersist,
      error: null
    })
  }));

  // Test cases
  it('works as expected', async () => {
    render(<Component />);
    // Test steps
  });
});
```

### 2. Common Mock Patterns
```typescript
// Hook mocking
jest.mock('@/hooks/useHook', () => ({
  useHook: () => ({
    data: mockData,
    loading: false,
    error: null
  })
}));

// Context mocking
jest.mock('@/contexts/Context', () => ({
  useContext: () => ({
    state: 'default',
    setState: jest.fn()
  })
}));

// Form mocking
jest.mock('react-hook-form', () => ({
  useForm: () => ({
    register: jest.fn(),
    handleSubmit: (cb: any) => cb,
    formState: { errors: {} }
  }),
  FormProvider: ({ children }) => children
}));
```

## Test Patterns

### 1. User Interaction
```typescript
it('handles user input', async () => {
  render(<Component />);
  
  await user.type(screen.getByLabelText(/name/i), 'John');
  await user.click(screen.getByRole('button'));
  
  expect(mockSubmit).toHaveBeenCalled();
});
```

### 2. Error Handling
```typescript
it('handles errors', async () => {
  jest.mocked(require('@/hooks/useHook')).useHook.mockReturnValue({
    error: new Error('Failed')
  });

  render(<Component />);
  expect(screen.getByText(/failed/i)).toBeInTheDocument();
});
```

## Best Practices

### 1. Mock Setup
- Place mocks before component imports
- Use simple mock implementations
- Clean up in beforeEach
- Mock at module level

### 2. Test Structure
- Focus on user behavior
- Test happy path first
- Test error cases explicitly
- Keep tests focused

### 3. Selectors
- Use role-based queries
- Use label text for inputs
- Avoid test IDs when possible
- Use semantic HTML elements

## Implementation Steps

1. Set up mocks
```typescript
const mockFn = jest.fn();
jest.mock('@/hooks/useHook', () => ({
  useHook: () => ({ fn: mockFn })
}));
```

2. Create test suite
```typescript
describe('Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('test case', async () => {
    // Test implementation
  });
});
```

3. Implement tests
```typescript
render(<Component />);
await user.type(screen.getByLabelText(/name/i), 'John');
expect(mockFn).toHaveBeenCalled();
```

## Common Patterns

### 1. Form Testing
Test basic form functionality:
```typescript
it('submits form', async () => {
  render(<Form />);
  await user.type(screen.getByLabelText(/name/i), 'John');
  await user.click(screen.getByRole('button', { name: /submit/i }));
  expect(mockSubmit).toHaveBeenCalled();
});
```

### 2. Error Testing
Test error states:
```typescript
it('shows errors', async () => {
  mockHook.mockReturnValue({ error: new Error('Failed') });
  render(<Component />);
  expect(screen.getByText(/failed/i)).toBeInTheDocument();
});
```

### 3. Navigation Testing
Test navigation between views:
```typescript
it('navigates between tabs', async () => {
  render(<Component />);
  await user.click(screen.getByRole('tab', { name: /next/i }));
  expect(screen.getByText(/next content/i)).toBeInTheDocument();
});
```

## Future Improvements

1. Enhance error coverage
2. Add accessibility testing
3. Improve mock patterns
4. Document common cases