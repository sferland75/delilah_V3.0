# Testing Guide - Delilah V3.0

## Test Setup

1. Configure test environment:
```bash
npm install             # Install dependencies
npm test -- --init     # Initialize Jest if needed
```

2. File structure:
```
src/
└── sections/
    └── [section-name]/
        └── tests/
            ├── __mocks__/          # Section-specific mocks
            │   ├── ui/             # UI component mocks
            │   └── utils/          # Utility mocks
            ├── components/         # Component tests
            ├── integration/        # Integration tests
            ├── unit/              # Schema and state tests
            └── utils/             # Shared test utilities
```

## Running Tests

1. Run all tests:
```bash
npm test
```

2. Run section tests:
```bash
npm test src/sections/[section-name]/tests
```

3. Run specific component:
```bash
npm test [component-name].test.tsx
```

4. Watch mode:
```bash
npm test -- --watch
```

## Component Testing

### 1. Basic Component
```typescript
it('renders correctly', () => {
  render(<Component />);
  expect(screen.getByRole('button')).toBeInTheDocument();
});
```

### 2. Form Components
```typescript
it('handles form state', async () => {
  const { user } = render(<Component />);
  await user.type(screen.getByLabelText('Field'), 'value');
  expect(screen.getByLabelText('Field')).toHaveValue('value');
});
```

### 3. Accordion Components
```typescript
it('manages visibility', async () => {
  const { user } = render(<Component />);
  const trigger = screen.getByTestId('accordion-trigger');
  
  expect(screen.queryByTestId('content')).not.toBeInTheDocument();
  await user.click(trigger);
  expect(screen.getByTestId('content')).toBeInTheDocument();
});
```

## Mock Patterns

### 1. UI Components
```typescript
// select.tsx mock
const Select = React.forwardRef((props, ref) => {
  const { value, onValueChange, ...rest } = props;
  return (
    <select
      ref={ref}
      value={value}
      onChange={(e) => onValueChange?.(e.target.value)}
      {...rest}
    />
  );
});
```

### 2. Form Components
```typescript
// form.tsx mock
const FormField = ({ name, control, render }) => {
  const { field } = useController({ name, control });
  return render({ field });
};
```

### 3. Accordion Components
```typescript
// accordion.tsx mock
const Accordion = React.forwardRef((props, ref) => {
  const [value, setValue] = useState(props.defaultValue);
  return (
    <AccordionContext.Provider value={{ value, setValue }}>
      <div ref={ref} data-state={value ? 'open' : 'closed'}>
        {props.children}
      </div>
    </AccordionContext.Provider>
  );
});
```

## Testing Requirements

### 1. Component Tests
- Render states
- User interactions
- Form handling
- Error states

### 2. Integration Tests
- Component communication
- State management
- Data flow
- Error handling

### 3. Validation Tests
- Form validation
- Schema validation
- Error messages
- Edge cases

## Best Practices

### 1. Component Testing
- Test user interactions
- Verify state changes
- Check accessibility
- Test error handling

### 2. Form Testing
- Test field validation
- Check state updates
- Verify submissions
- Test field interactions

### 3. Mock Usage
- Minimal mocking
- Maintain behavior
- Handle state
- Mock consistently

## Common Patterns

### 1. User Interaction
```typescript
await act(async () => {
  await user.click(element);
});
expect(result).toBeInTheDocument();
```

### 2. Form State
```typescript
const { result } = renderHook(() => useForm({
  defaultValues: {}
}));
```

### 3. Async Operations
```typescript
await waitFor(() => {
  expect(element).toBeInTheDocument();
});
```

## Test Output

Use for:
1. Debugging tests
2. CI/CD pipelines
3. Coverage reports
4. Performance monitoring

```bash
# Output to file
npm test path/to/test > test_output.txt 2>&1

# With coverage
npm test -- --coverage > coverage_output.txt 2>&1
```

## Troubleshooting

### 1. Act Warnings
- Wrap async operations
- Handle state updates
- Check effect cleanup
- Verify timeouts

### 2. State Updates
- Use proper act()
- Wait for changes
- Check async state
- Verify effects

### 3. Mock Issues
- Check mock paths
- Verify behavior
- Test state handling
- Validate props

## Documentation

### 1. Test Files
- Clear descriptions
- Setup information
- Mock documentation
- Coverage goals

### 2. Component Tests
- Props documentation
- State management
- Event handling
- Error cases

### 3. Integration Tests
- Data flow
- State handling
- Error propagation
- Edge cases