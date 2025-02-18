# Delilah V3.0 Testing Strategy

## Core Testing Philosophy
Keep tests simple, maintainable, and focused on user behavior. Prefer fewer, well-structured tests over comprehensive but brittle ones.

## Test Structure Guidelines

### 1. Mock Setup
```typescript
// Global mock setup at top level
const mockPersist = jest.fn();
const mockSetMode = jest.fn();

// Mock hooks and contexts before component imports
jest.mock('@/hooks/useFormPersistence', () => ({
  useFormPersistence: () => ({
    persist: mockPersist,
    loading: false,
    error: null
  })
}));
```

### 2. Test Organization
```typescript
describe('Component Name', () => {
  // Setup
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test cases
  it('allows user interaction', async () => {
    render(<Component />);
    // Test steps
  });
});
```

## Key Test Cases

### 1. Basic User Interaction
```typescript
it('allows filling out the form', async () => {
  render(<Component />);
  
  await user.type(screen.getByLabelText(/first name/i), 'John');
  await user.click(screen.getByRole('button', { name: /save/i }));
  
  expect(mockSave).toHaveBeenCalled();
});
```

### 2. Error Handling
```typescript
it('handles errors gracefully', async () => {
  // Override mock for this test
  mockHook.mockReturnValue({
    error: new Error('Save failed')
  });

  render(<Component />);
  expect(screen.getByText(/save failed/i)).toBeInTheDocument();
});
```

## Best Practices

### 1. Mocking
- Mock at the module level before imports
- Use simple, focused mocks
- Clean up mocks in beforeEach
- Avoid complex mock implementations

### 2. Testing
- Focus on user behavior
- Use role-based queries when possible
- Keep tests simple and readable
- Test error states explicitly

### 3. Component Organization
- Group related functionality
- Keep components focused
- Extract reusable logic to hooks
- Use proper context providers

## Common Patterns

### 1. Form Testing
- Test field interaction
- Test submission
- Test validation
- Test error states

### 2. Navigation Testing
- Test tab switching
- Test view/edit modes
- Test data persistence

### 3. Error Testing
- Test API errors
- Test validation errors
- Test boundary conditions

## Avoid
1. Over-mocking
2. Testing implementation details
3. Brittle selectors
4. Complex test setups

## Recommended Testing Tools
1. React Testing Library
2. Jest
3. user-event
4. jest.mock() for dependencies

## Setup Example
```typescript
// Mock dependencies
jest.mock('@/hooks/useHook', () => ({
  useHook: () => ({
    data: mockData,
    error: null
  })
}));

// Test suite
describe('Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('works as expected', async () => {
    render(<Component />);
    // Test steps
  });
});
```

## Next Steps
1. Convert existing tests to new pattern
2. Improve error handling coverage
3. Add accessibility tests
4. Document common patterns