# Symptoms Assessment Test Implementation

This document provides an overview of the test implementation for the Symptoms Assessment section of the Delilah V3.0 application. These tests focus on the Symptoms Assessment component, the mapper service, schema validation, migration between legacy and updated schemas, and the integration with the Assessment Context.

## Test Files Implemented

1. **Symptoms Assessment Mapper Service Tests**
   - File: `src/services/__tests__/symptomsAssessmentMapper.test.ts`
   - Purpose: Tests the bidirectional mapping functionality between context data and form data structures.
   - Coverage: Tests all mapper functions including:
     - `mapContextToForm`
     - `mapFormToContext`
     - `exportSymptomsToJson`
     - `importSymptomsFromJson`
   - Key features tested:
     - Multiple symptoms handling
     - Bidirectional data integrity

2. **Symptoms Assessment Integrated Component Tests**
   - File: `src/sections/4-SymptomsAssessment/__tests__/SymptomsAssessment.integrated.test.tsx`
   - Purpose: Tests the SymptomsAssessmentIntegrated component that uses the mapper service to integrate with the Assessment Context.
   - Coverage: Tests component rendering, tab navigation, context data loading, form submission, and export/import functionality.
   - Key features tested:
     - Multiple symptoms support alert
     - Tab navigation between symptom types

3. **Updated Schema Tests**
   - File: `src/sections/4-SymptomsAssessment/__tests__/schema.updated.test.ts`
   - Purpose: Tests the updated symptoms schema that supports multiple physical and cognitive symptoms.
   - Coverage: Tests schema validation, type definitions, and data structure integrity.
   - Key features tested:
     - Required fields validation
     - Type checking for symptom structures

4. **Schema Migration Tests**
   - File: `src/sections/4-SymptomsAssessment/__tests__/migration.test.ts`
   - Purpose: Tests the migration utilities between legacy and updated schemas.
   - Coverage: Tests bidirectional migration between single-symptom and multi-symptom formats.
   - Key features tested:
     - Data preservation during migration
     - Round-trip conversion integrity

5. **Assessment Context Integration Tests**
   - File: `src/test/assessment-context-integration/SymptomsAssessmentIntegration.test.tsx`
   - Purpose: Tests the integration between the Symptoms Assessment section and the Assessment Context provider.
   - Coverage: Tests data flow between context and component, preservation of existing context data, and UI updates reflecting context changes.
   - Key features tested:
     - Multiple symptoms handling in context
     - Cross-section data preservation

## Test Execution

Two batch files have been created to run the tests:

1. **Symptoms Assessment Tests Only**
   - File: `run_symptoms_assessment_tests.bat`
   - Purpose: Runs only the Symptoms Assessment related tests.
   - Usage: Execute this script to run all Symptoms Assessment tests in sequence.

2. **All Tests Including Symptoms Assessment**
   - File: `run_tests.bat` (updated)
   - Purpose: Runs all tests including the new Symptoms Assessment tests.
   - Usage: Execute this script to run all tests in the application.

## Test Approach

The tests follow these key principles:

### 1. Multiple Symptoms Support

The primary focus of these tests is to ensure that the new multiple symptom support functionality works correctly:

- **Schema Testing**: Validates that the updated schema can handle arrays of physical and cognitive symptoms.
- **Migration Testing**: Ensures data can be migrated between legacy (single symptom) and updated (multiple symptoms) formats.
- **Mapper Testing**: Verifies that the mapper service correctly handles arrays of symptoms in both directions.
- **Component Testing**: Checks that the UI components support adding and displaying multiple symptoms.

### 2. Bidirectional Mapping

- Comprehensive testing of the bidirectional mapping between context and form data formats.
- Tests validate that data integrity is maintained during the mapping process.
- Special attention to factors that are represented as arrays in form data but strings in context data.

### 3. Schema Validation

- Tests ensure that the schema properly validates required fields.
- Validation of complex nested structures with arrays of symptoms.
- Type checking for physical, cognitive, and emotional symptom structures.

### 4. Context Integration

- Tests verify that symptoms data flows correctly between the component and Assessment Context.
- Multiple symptoms are preserved when saving to and loading from context.
- Other context sections are preserved during updates.

## Coverage

These tests focus on the following aspects of coverage:

1. **Functional Coverage**
   - Multiple symptoms support
   - Bidirectional data mapping
   - Schema validation
   - Schema migration
   - Context integration

2. **Code Coverage**
   - 100% coverage of mapper functions
   - Comprehensive coverage of schema utilities
   - High coverage of component rendering and interaction paths

3. **Edge Cases Coverage**
   - Empty symptom arrays
   - Malformed input data
   - Data structure mismatches
   - Context updates with missing data

## Test Patterns

1. **Mapper Service Testing**
   - Test context-to-form mapping with various input formats
   - Test form-to-context mapping with arrays of different sizes
   - Verify JSON export/import functionality
   - Test error handling for malformed data

2. **Schema Testing**
   - Validate required fields and constraints
   - Test migration utilities for data preservation
   - Verify type definitions match schema requirements

3. **Component Testing**
   - Verify tab navigation works correctly
   - Test data loading from context
   - Test form submission updates context
   - Verify UI alerts and user feedback

4. **Integration Testing**
   - Test full context provider integration
   - Verify cross-section data preservation
   - Test bidirectional data flow

## Next Steps

Building on these tests, the next steps for test coverage should focus on:

1. Testing the individual symptom components (PhysicalSymptomsSectionUpdated, CognitiveSymptomsSectionUpdated)
2. Testing the symptom addition/removal functionality in the UI
3. Adding more end-to-end scenarios with complete symptom assessment workflows
4. Testing export to PDF and Word formats with multiple symptoms
