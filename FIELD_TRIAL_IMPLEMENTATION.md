# Delilah V3.0 Field Trial Implementation

This document provides guidance on the field trial implementation for Delilah V3.0, including setup instructions and key features.

## Overview

The field trial implementation includes several enhancements to the core application to improve reliability, user experience, and data collection during testing:

1. **Enhanced Data Persistence**
   - Robust auto-save with error handling
   - Data compression for efficient storage
   - Session recovery for unexpected interruptions

2. **User Experience Improvements**
   - Save status indicators
   - Progress tracking
   - Detailed validation feedback

3. **Field Trial Support**
   - In-app feedback mechanism
   - Analytics tracking
   - Error reporting

## Setup Instructions

### 1. Install Dependencies

First, ensure you have the necessary dependencies:

```bash
npm install lz-string
```

### 2. Update Application Entry Point

Modify your `_app.tsx` file to use the field trial providers:

```tsx
import { FieldTrialProviders } from '@/providers/FieldTrialProviders';

function MyApp({ Component, pageProps }) {
  return (
    <FieldTrialProviders>
      <Component {...pageProps} />
    </FieldTrialProviders>
  );
}

export default MyApp;
```

### 3. Update Import Statements

Update any components that were using the original AssessmentContext to use the enhanced version:

```tsx
// Change this:
import { useAssessment } from '@/contexts/AssessmentContext';

// To this:
import { useEnhancedAssessment } from '@/contexts/EnhancedAssessmentContext';
```

### 4. Add UI Components

Add the save status indicator to your form components:

```tsx
import { SaveStatusIndicator } from '@/components/SaveStatusIndicator';

function MyFormComponent() {
  // ... existing code
  
  return (
    <div>
      <form>
        {/* form fields */}
        
        <div className="flex justify-between items-center mt-4">
          <Button type="submit">Save</Button>
          <SaveStatusIndicator />
        </div>
      </form>
    </div>
  );
}
```

Add the progress indicator to your dashboard or assessment pages:

```tsx
import { ProgressIndicator } from '@/components/ProgressIndicator';

function DashboardComponent() {
  // ... existing code
  
  return (
    <div>
      <h1>Assessment Dashboard</h1>
      <div className="mb-6">
        <ProgressIndicator showDetailedBreakdown={true} />
      </div>
      
      {/* rest of dashboard */}
    </div>
  );
}
```

Add form error summary to your form components:

```tsx
import { FormErrorSummary } from '@/components/FormErrorSummary';
import { FormProvider, useForm } from 'react-hook-form';

function MyFormComponent() {
  const methods = useForm();
  
  return (
    <FormProvider {...methods}>
      <form>
        <FormErrorSummary />
        
        {/* form fields */}
      </form>
    </FormProvider>
  );
}
```

## Key Features

### Enhanced Assessment Context

The `EnhancedAssessmentContext` provides the following improvements:

- Detailed save status (`idle`, `saving`, `success`, `error`)
- Last saved timestamp
- Configurable auto-save interval
- Session recovery
- Improved error handling

### Storage Service

The enhanced storage service includes:

- Data compression using lz-string
- Fallback mechanisms (localStorage → sessionStorage)
- Individual assessment backup
- Session state tracking

### Feedback Collection

The feedback button allows users to:

- Report issues
- Suggest improvements
- Ask questions

Feedback is stored locally during field trials and can be exported for analysis.

### Analytics

The analytics service tracks:

- Page views
- Form interactions
- Assessment actions
- Errors

Data is stored locally and can be exported for analysis.

## Extracting Field Trial Data

To extract feedback and analytics data from a field trial device, you can add the following utility function:

```tsx
function ExportFieldTrialDataButton() {
  const handleExport = () => {
    // Get feedback data
    const feedback = localStorage.getItem('delilah_feedback') || '[]';
    
    // Get analytics data
    const events = localStorage.getItem('delilah_analytics_events') || '[]';
    const errors = localStorage.getItem('delilah_analytics_errors') || '[]';
    
    // Combine into one object
    const exportData = {
      feedback: JSON.parse(feedback),
      analytics: {
        events: JSON.parse(events),
        errors: JSON.parse(errors)
      },
      exportDate: new Date().toISOString(),
      userAgent: navigator.userAgent
    };
    
    // Create downloadable file
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `delilah_field_trial_data_${Date.now()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };
  
  return (
    <Button onClick={handleExport}>
      Export Field Trial Data
    </Button>
  );
}
```

## Field Trial Considerations

1. **Data Privacy**: All data is stored locally on the device. No data is transmitted to external servers during field trials unless explicitly exported by the tester.

2. **Performance**: The enhanced storage with compression may impact performance on older devices. Monitor for any slowdowns during testing.

3. **Storage Limits**: Browser storage has limits (typically 5-10MB). For very large assessments, monitor storage usage.

4. **Error Handling**: The implementation includes multiple fallback mechanisms, but some edge cases may still occur. Use the analytics to identify and address these.

5. **Network Requirements**: This implementation works entirely offline, making it suitable for field trials in areas with limited connectivity.

## Post-Field Trial Migration

After field trials are complete, the following steps should be taken:

1. Analyze feedback and analytics data
2. Address identified issues
3. Replace localStorage with server-side storage
4. Retain the enhanced UI components for user experience benefits
5. Replace the local analytics with a production analytics solution if needed
