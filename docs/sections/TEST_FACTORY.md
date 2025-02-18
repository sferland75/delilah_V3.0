# Form Test Factory Documentation

## Overview
The Form Test Factory provides a configuration-driven approach to generating comprehensive test suites for form components. It ensures consistent test coverage across all form components while reducing test setup time.

## Features
- Structure testing (fields, labels, sections)
- Validation testing (required fields, formats)
- Submission handling (success/error states)
- Accessibility compliance (ARIA, focus management)

## Usage

### Basic Example
```typescript
const config = {
  fields: [
    {
      name: 'fieldName',
      type: 'text',
      required: true,
      label: 'Field Label'
    }
  ]
};

const { structureTests, validationTests } = createFormTests('ComponentName', config);
structureTests();
validationTests();
```

### Configuration Options

#### Field Configuration
```typescript
interface FormField {
  name: string;                 // Form field name
  type: 'text' | 'email' | 'phone' | 'date';  // Field type
  required?: boolean;           // Is field required
  validation?: {               // Custom validation
    pattern?: RegExp;          // Validation pattern
    message?: string;          // Error message
  };
  label?: string;              // Field label
}
```

#### Section Configuration
```typescript
interface FormSection {
  name: string;                // Section name
  fields: string[];            // Fields in section
  description?: string;        // Section description
}
```

#### Error Handling Configuration
```typescript
interface ErrorHandling {
  submission?: boolean;        // Test submission errors
  network?: boolean;           // Test network errors
  validation?: boolean;        // Test validation errors
}
```

## Test Categories

### Structure Tests
- Field presence
- Label associations
- Section organization
- Field types

### Validation Tests
- Required field validation
- Format validation
- Custom pattern validation
- Error message display

### Submission Tests
- Successful submission
- Error handling
- Network error handling
- Form state management

### Accessibility Tests
- ARIA labels
- Focus management
- Error announcements
- Keyboard navigation

## Best Practices

1. **Field Naming**
   - Use consistent naming patterns
   - Include parent object in name (e.g., 'insurance.provider')
   - Keep names descriptive

2. **Validation Patterns**
   - Use clear regex patterns
   - Provide helpful error messages
   - Consider edge cases

3. **Section Organization**
   - Group related fields
   - Provide clear section names
   - Add descriptive text when needed

4. **Error Handling**
   - Enable all error handling options
   - Test network failures
   - Verify error messages

## Example Configurations

### Insurance Form
```typescript
const insuranceConfig = {
  fields: [
    {
      name: 'insurance.provider',
      type: 'text',
      required: true,
      label: 'Insurance Provider'
    },
    {
      name: 'insurance.claimNumber',
      type: 'text',
      required: true,
      validation: {
        pattern: /^CLM\d{6}$/,
        message: 'Must start with CLM followed by 6 digits'
      }
    }
  ],
  sections: [
    {
      name: 'Insurance Information',
      fields: ['insurance.provider', 'insurance.claimNumber']
    }
  ],
  errorHandling: {
    submission: true,
    validation: true,
    network: true
  }
};
```

### Legal Form
```typescript
const legalConfig = {
  fields: [
    {
      name: 'legalRep.name',
      type: 'text',
      required: true
    },
    {
      name: 'legalRep.phone',
      type: 'phone',
      required: true
    }
  ],
  sections: [
    {
      name: 'Legal Representative',
      fields: ['legalRep.name', 'legalRep.phone']
    }
  ]
};
```

## Success Metrics
- 50% reduction in test setup time
- Zero test pattern deviations
- 80% minimum test coverage
- Consistent error handling
- Full accessibility compliance

## Next Steps
1. Convert existing tests to factory pattern
2. Add more field types (select, radio, checkbox)
3. Enhance accessibility testing
4. Add state persistence testing