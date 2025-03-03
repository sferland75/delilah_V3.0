# Referral Integration Testing Guide

This document provides step-by-step instructions for testing the referral document integration in the Delilah V3.0 UI.

## Prerequisites

- Delilah V3.0 running in development mode
- Sample referral documents (provided in the project)

## Testing Process

### 1. Access the Testing Page

The easiest way to test the integration is to use the dedicated testing page:

1. Start the application in development mode: `npm run dev`
2. Navigate to `/testing/referral-integration`
3. This page provides controls for testing both the import and display components

### 2. Test the Import Component

1. On the testing page, select "Test Import"
2. Upload one of the sample referral documents:
   - Use `D:\delilah-agentic\referrals\omega-referral-sample.pdf`
   - Or any other referral document you have
3. Verify that the document is processed correctly
4. Check that the extracted information is displayed in the preview
5. Test the import functionality

### 3. Test the Display Component

1. On the testing page, select "Test Display"
2. Click "Load Sample Data" to load test data
3. Verify that the ReferralContext component displays correctly:
   - Check the "Client" tab for client information
   - Verify the "Requirements" tab shows assessment requirements
   - Test the "Scheduling" and "Reporting" tabs
4. Test navigation between tabs
5. Click "Clear Data" to test the empty state

### 4. Test the Full Integration

To test the integration in the actual application workflow:

1. Navigate to `/import/referral`
2. Upload a referral document
3. Verify the document processes correctly
4. Import the referral data
5. Navigate to the assessment workflow (e.g., `/assessment/initial`)
6. Verify that the ReferralSummary component appears with the correct data
7. Click "View Full Details" to navigate to the referral details page
8. Check that all referral data is correctly displayed
9. Navigate back to the assessment

### 5. Test Cross-Section Integration

1. After importing a referral, navigate to the Demographics section
2. Verify that client information from the referral has been pre-populated
3. Go to the Purpose & Methodology section
4. Check if assessment requirements from the referral are displayed
5. Test other sections for integration with referral data

## Testing Scenarios

### Scenario 1: Basic Referral Import

1. Import a standard referral document
2. Verify all key information is extracted:
   - Client details (name, DOB, date of loss, file number)
   - Assessment types
   - Required domains
   - Report due date

### Scenario 2: Data Propagation

1. Import a referral with detailed client information
2. Check if demographics data is pre-populated
3. Verify purpose section includes assessment requirements

### Scenario 3: Error Handling

1. Upload an invalid document (non-PDF)
2. Upload a PDF that is not a referral document
3. Verify error messages are displayed
4. Check recovery options

### Scenario 4: Referral Replacement

1. Import a referral document
2. Then import a different referral document
3. Verify the data is updated throughout the application

## Test Document Locations

Sample referral documents for testing:

- `D:\delilah-agentic\referrals\omega-referral-sample.pdf` - Standard Omega referral
- `D:\delilah-agentic\referrals\omega-referral-sample2.pdf` - Alternative Omega referral

## Reporting Issues

If you encounter any issues during testing:

1. Note the specific step where the issue occurred
2. Document the expected behavior vs. actual behavior
3. Include browser console logs if applicable
4. Take screenshots of any error messages
5. Report the issue in the project issue tracker

## Success Criteria

The referral integration is considered successfully tested when:

1. ✅ Referral documents can be uploaded and processed
2. ✅ Extracted data is correctly displayed in the preview
3. ✅ Referral data can be imported into the assessment
4. ✅ ReferralContext component shows the imported data
5. ✅ Client information is correctly displayed
6. ✅ Assessment requirements are clearly shown
7. ✅ Client information is propagated to demographics
8. ✅ Assessment requirements are added to purpose section
9. ✅ Error handling works for invalid documents
10. ✅ The system can handle referral replacement
