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
            ├── components/     # Component tests
            ├── integration/    # Integration tests
            └── unit/          # Unit tests
```

## Running Tests

1. Run all tests:
```bash
npm test
```

2. Run specific tests:
```bash
npm test -- path/to/test
```

3. Watch mode:
```bash
npm test -- --watch
```

## Test Types

### Unit Tests
- Test individual functions
- Mock dependencies
- Focus on specific behavior

### Component Tests
- Test React components
- Use React Testing Library
- Test user interactions

### Integration Tests
- Test multiple components
- Test data flow
- Test API integration

## Writing Tests

1. Create test file:
```typescript
import { render, screen } from '@testing-library/react';
import { YourComponent } from './YourComponent';

describe('YourComponent', () => {
  it('renders correctly', () => {
    render(<YourComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

2. Test structure:
- Describe block for feature
- Individual test cases
- Clear test names

3. Assertions:
- Be specific
- Test behavior
- Cover edge cases

## Best Practices

1. Write tests first
2. Keep tests focused
3. Use meaningful names
4. Test important paths
5. Mock external services

## Commands

```bash
# Run all tests
npm test

# Run specific test
npm test -- path/to/test

# Update snapshots
npm test -- -u

# Get coverage report
npm test -- --coverage
```

## Debugging Tests

1. Use console.log()
2. Check test output
3. Use debugger
4. Inspect DOM

## Common Problems

1. Async issues:
- Use await
- Wait for elements
- Handle promises

2. Mock issues:
- Check mock setup
- Verify mock calls
- Clear mocks between tests

3. DOM issues:
- Check rendered output
- Verify elements exist
- Check accessibility

## Getting Help

1. Check documentation
2. Review existing tests
3. Run tests in debug mode
4. Ask for help in PR