# Delilah V3.0 Testing Strategy

[Previous content remains the same...]

## Symptoms Section Testing Strategy

### 1. Component Testing Structure
- Each symptom type (Cognitive, Physical, Emotional) has its own test suite
- Tests follow a consistent pattern for state management
- Mock component behavior consistently across suites

### 2. Physical Symptoms Testing
```typescript
describe('PhysicalSymptoms', () => {
  // Common helper for expanding accordion
  const expandAccordion = async (user, index = 0) => {
    const trigger = screen.getByTestId(`accordion-trigger-${index}`);
    await act(async () => {
      await user.click(trigger);
    });
  };

  // Test cases
  it('allows location selection', async () => {
    // Setup with body location mock
    render(<PhysicalSymptoms />);
    
    // Test location selection
    await user.click(locationMap);
    expect(selectedLocation).toBe('value');
  });

  it('handles pain type selection', async () => {
    // Test pain type dropdown
  });

  it('persists location data', async () => {
    // Test data persistence
  });
});
```

### 3. E2E Testing Approach
```typescript
describe('Symptoms Assessment Flow', () => {
  it('completes full assessment', async () => {
    // Start at symptoms page
    cy.visit('/symptoms');

    // Add cognitive symptom
    cy.findByRole('button', { name: /add cognitive/i }).click();
    cy.findByLabelText(/type of cognitive/i).select('Memory');
    
    // Add physical symptom
    cy.findByRole('button', { name: /add physical/i }).click();
    cy.findByTestId('body-map').click(200, 300);
    
    // Add emotional symptom
    cy.findByRole('button', { name: /add emotional/i }).click();
    
    // Submit assessment
    cy.findByRole('button', { name: /submit/i }).click();
    
    // Verify completion
    cy.url().should('include', '/review');
  });

  it('saves progress between sections', async () => {
    // Test navigation and state persistence
  });

  it('validates required fields', async () => {
    // Test validation rules
  });
});
```

### 4. Common Test Patterns for Symptoms

#### a. Accordion State Management
```typescript
// Starting collapsed
expect(screen.queryByRole('textbox')).not.toBeInTheDocument();

// After expansion
await expandAccordion(user);
expect(screen.getByRole('textbox')).toBeInTheDocument();
```

#### b. Form State Persistence
```typescript
// Set value
await act(async () => {
  await user.type(input, 'value');
});

// Navigate away
await user.click(otherTab);

// Return and verify
await user.click(originalTab);
expect(input).toHaveValue('value');
```

#### c. Visual Selection Testing
```typescript
// Body map selection
const bodyMap = screen.getByTestId('body-map');
await user.click(bodyMap);
expect(selectedPoint).toEqual({ x: 100, y: 200 });
```

### 5. Test Coverage Requirements

#### a. Component Tests
- All symptom type components have individual test suites
- Each interaction pattern has corresponding tests
- Error states and validation are covered
- Accessibility is verified

#### b. Integration Tests
- Cross-component communication
- State management between components
- Navigation between sections
- Data persistence across views

#### c. E2E Tests
- Complete assessment flow
- Error handling and validation
- Navigation patterns
- Data persistence
- Form submission

### 6. Physical Symptoms Specific Tests

#### a. Location Selection
- Valid point selection
- Multiple point selection
- Point removal
- Location persistence

#### b. Pain Characteristics
- Pain type selection
- Intensity rating
- Frequency selection
- Impact description

#### c. Visual Components
- Body map rendering
- Point rendering
- Selection feedback
- Hover states

## Testing Guidelines

### 1. Component Testing
- Mock complex components consistently
- Test accessibility
- Verify visual feedback
- Check validation rules

### 2. Integration Testing
- Test component communication
- Verify state updates
- Check navigation flows
- Test error handling

### 3. E2E Testing
- Cover main user flows
- Test form submission
- Verify data persistence
- Check validation feedback

## Documentation

### 1. Test File Structure
```
symptoms/
├── components/
│   ├── CognitiveSymptoms.test.tsx
│   ├── PhysicalSymptoms.test.tsx
│   └── EmotionalSymptoms.test.tsx
├── integration/
│   └── SymptomsFlow.test.tsx
└── e2e/
    └── SymptomAssessment.test.tsx
```

### 2. Common Issues
- Async state updates
- Component visibility
- Event handling
- Form state persistence

### 3. Updates & Improvements
- Ongoing test refinements
- Pattern updates
- Common solutions
- Best practices
