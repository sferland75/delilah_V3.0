# Delilah V3.0 Field Trial

Welcome to the Delilah V3.0 Field Trial! This document provides essential information for setting up, running, and evaluating the field trial version of the application.

## Overview

The field trial version of Delilah V3.0 includes enhanced features for improved reliability, user experience, and data collection. These enhancements are designed to test application performance in real-world scenarios and gather valuable feedback for future development.

## Installation

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Git

### Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/delilah-v3.git
   cd delilah-v3
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   # Copy the sample .env file
   cp .env.example .env.local
   
   # Edit .env.local and set:
   NEXT_PUBLIC_FIELD_TRIAL=true
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Access the application at `http://localhost:3000`

## Key Features

The field trial version includes several key enhancements:

### 1. Enhanced Data Persistence

- **Auto-save with status indicators**: See when your data was last saved
- **Robust storage mechanisms**: Multiple fallback options to prevent data loss
- **Session recovery**: Automatically recover from interrupted sessions

### 2. Improved Form Validation

- **Schema-based validation**: Comprehensive error checking
- **Cross-field validations**: Check relationships between different input fields
- **Error summaries**: Clear display of validation issues

### 3. Progress Tracking

- **Assessment completion indicators**: See how much of the assessment is complete
- **Section-by-section breakdown**: Track progress in each section
- **Visual indicators**: Color-coded progress bars

### 4. Field Trial Feedback

- **In-app feedback form**: Easily report issues or suggestions
- **Analytics tracking**: Anonymous usage data collection
- **Error reporting**: Automatic capture of technical issues

## Testing Focus Areas

During the field trial, please focus on the following areas:

1. **Data Persistence**
   - Does the application reliably save your work?
   - Does it recover properly after unexpected closures?
   - Are there any scenarios where data is lost?

2. **Form Validation**
   - Are error messages clear and helpful?
   - Do the validation rules make sense for clinical practice?
   - Are there any false positive errors?

3. **User Experience**
   - How helpful are the progress indicators?
   - Is the auto-save feedback useful?
   - Does the interface feel responsive and intuitive?

4. **Attendant Care Section**
   - This section has been completely enhanced
   - Test the validation rules for realistic scenarios
   - Evaluate the calculation logic for total care hours

## Providing Feedback

You can provide feedback in several ways:

1. **In-app Feedback Button**
   - Click the "Feedback" button in the bottom-right corner
   - Select a feedback type (issue, suggestion, question)
   - Provide details about your experience

2. **Export Field Trial Data**
   - Navigate to Dashboard
   - Scroll to bottom and click "Export Field Trial Data"
   - Share the exported JSON file with the development team

3. **Direct Communication**
   - Email: fieldtrial@delilah.example.com
   - Slack: #delilah-field-trial channel

## Known Limitations

- The enhanced forms are only implemented for the Attendant Care section in this trial
- Form validation schemas may require adjustment based on feedback
- The application works best in Chrome or Edge browsers

## Privacy Note

All data collected during the field trial is stored locally on your device. Analytics data is anonymized and does not include personally identifiable information or client details. You can export and review all collected data at any time using the "Export Field Trial Data" button on the dashboard.

## Support

If you encounter any issues during the field trial, please contact:

- Technical Support: support@delilah.example.com
- Field Trial Coordinator: coordinator@delilah.example.com

## After the Field Trial

After completing your testing, please:

1. Export your field trial data
2. Complete the post-trial survey (link will be emailed)
3. Schedule a debrief session with the development team

Thank you for participating in the Delilah V3.0 Field Trial!
