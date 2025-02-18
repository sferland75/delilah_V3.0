# Testing Strategy

## Overview
Testing follows a section-by-section approach, with integration testing to follow.

## Testing Levels

### 1. Section Tests
- Individual section functionality
- Prompt formatting
- Data handling
- API integration

### 2. Integration Tests
- Cross-section functionality
- Data flow
- Complete report generation

### 3. UI Tests
- Form functionality
- Data collection
- Real-time validation

## Test Structure
```typescript
describe('Section Name', () => {
  describe('Data Processing', () => {
    // Data formatting tests
  });

  describe('API Integration', () => {
    // API call tests
  });

  describe('Error Handling', () => {
    // Error case tests
  });
});
```

## Running Tests
1. Section-specific:
   ```bash
   npm test src/sections/[section-name]/generate.test.ts
   ```

2. All tests:
   ```bash
   npm test
   ```

## Mocking
1. API Responses
   ```typescript
   jest.mock('../../services/claude', () => ({
     generateWithClaude: jest.fn()
   }));
   ```

2. Form Data
   ```typescript
   const mockData = {
     // Section-specific test data
   };
   ```

## Coverage Requirements
- Logic paths: 100%
- Error handling: 100%
- Edge cases: Documented and tested

## Test Data
- Use realistic but anonymized data
- Cover edge cases
- Include empty/invalid cases

## Debugging
1. Use section-specific test files
2. Check prompt formatting
3. Verify API responses
4. Validate data handling