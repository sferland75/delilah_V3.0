# Report Drafting Module Tests

This directory contains comprehensive tests for the Report Drafting module.

## Test Structure

The tests are organized to cover each aspect of the Report Drafting module:

1. **API Service Tests** (`api-service.test.ts`)
   - Tests for all functions in the API service layer
   - Includes both successful API call scenarios and fallback behavior
   - Verifies proper handling of error conditions

2. **Data Mapping Tests** (`data-mapping.test.ts`)
   - Tests for data extraction and transformation functions
   - Validates section data completeness calculations
   - Tests formatting of assessment data for reports

3. **Integration Tests** (`integration.test.ts`)
   - End-to-end tests of the full report drafting workflow
   - Verifies all components work together correctly
   - Tests graceful degradation when API calls fail

## API Route Tests

The following API routes have been tested separately:

1. **Templates** (`templates.test.ts`, `template-by-id.test.ts`)
   - Tests for retrieving all templates and specific templates by ID
   - Validates proper error handling for missing templates

2. **Data Availability** (`data-availability.test.ts`)
   - Tests for fetching section data completeness information
   - Verifies correct handling of assessment data

3. **Configurations** (`configurations.test.ts`)
   - Tests for creating and retrieving report configurations
   - Validates input validation for required fields

4. **Report Generation** (`generate.test.ts`)
   - Tests for generating reports from configurations
   - Verifies proper handling of section inclusion/exclusion

5. **Section Updates** (`update-section.test.ts`)
   - Tests for updating individual report sections
   - Validates content requirements and error handling

6. **Report Export** (`export.test.ts`)
   - Tests for exporting reports in different formats
   - Verifies handling of export options and format validation

## Running the Tests

To run all tests for the Report Drafting module:

```bash
npm test src/lib/report-drafting
```

To run a specific test file:

```bash
npm test src/lib/report-drafting/__tests__/api-service.test.ts
```

To run API route tests:

```bash
npm test src/app/api/report-drafting/__tests__
```

## Coverage

These tests aim to provide comprehensive coverage of:
- Service functions
- API routes
- Error handling
- Fallback mechanisms
- Integration scenarios

## Best Practices

1. **Mocking**: All external dependencies are properly mocked
2. **Isolation**: Tests are isolated from each other
3. **Predictability**: Timestamps are mocked for consistent results
4. **Coverage**: All code paths are tested, including error scenarios
5. **Documentation**: Tests are well-documented for future maintenance
