# Field Trial Preparation Guide

## Technical Implementation Guide for Developers

This document provides technical guidance for developers working on the next phase of Delilah V3.0 implementation, focusing on preparing the application for field trials.

## Current Technical Architecture

### State Management
- **AssessmentContext**: Central state management for assessment data
- **React Hook Form**: Form state management within sections
- **Local Storage**: Basic persistence mechanism

### Component Structure
- **Core Pattern**: `ErrorBoundary → SectionComponent → FormComponent`
- **Data Flow**: Context → Form State → UI → Updates → Context

### Routing System
- **Standalone Pages**: Direct access to individual sections
- **Integrated Flow**: Section tabs within full assessment

## Priority Enhancements for Field Trials

### 1. Robust Data Persistence

#### Auto-Save Implementation
```jsx
// Implement in AssessmentContext.tsx
const [autoSaveInterval, setAutoSaveInterval] = useState(30000); // 30 seconds
const [lastSaved, setLastSaved] = useState(null);
const [saveStatus, setSaveStatus] = useState('idle'); // 'idle', 'saving', 'success', 'error'

// Auto-save timer
useEffect(() => {
  const timer = setInterval(() => {
    if (hasUnsavedChanges) {
      setSaveStatus('saving');
      const success = saveCurrentAssessment();
      setSaveStatus(success ? 'success' : 'error');
      if (success) {
        setLastSaved(new Date());
      }
    }
  }, autoSaveInterval);

  return () => clearInterval(timer);
}, [hasUnsavedChanges, autoSaveInterval]);

// Expose status to components
const contextValue = {
  // Existing values...
  saveStatus,
  lastSaved,
  setAutoSaveInterval,
};
```

#### Enhanced Storage Mechanism
```typescript
// storage-service.ts
import { compress, decompress } from 'lz-string';

export const StorageService = {
  saveAssessment: (id: string, data: any) => {
    try {
      // Compress data before storing
      const compressedData = compress(JSON.stringify(data));
      localStorage.setItem(`assessment_${id}`, compressedData);
      return true;
    } catch (error) {
      console.error('Error saving assessment:', error);
      
      // Fallback to session storage if local storage fails
      try {
        sessionStorage.setItem(`assessment_${id}`, JSON.stringify(data));
        return true;
      } catch (sessionError) {
        console.error('Error using fallback storage:', sessionError);
        return false;
      }
    }
  },
  
  loadAssessment: (id: string) => {
    try {
      const compressedData = localStorage.getItem(`assessment_${id}`);
      if (!compressedData) return null;
      
      // Decompress data
      return JSON.parse(decompress(compressedData));
    } catch (error) {
      console.error('Error loading assessment:', error);
      
      // Try fallback
      try {
        const sessionData = sessionStorage.getItem(`assessment_${id}`);
        return sessionData ? JSON.parse(sessionData) : null;
      } catch (sessionError) {
        console.error('Error using fallback storage:', sessionError);
        return null;
      }
    }
  }
};
```

#### Session Recovery
```jsx
// Add to _app.js
import { useRouter } from 'next/router';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  
  // Capture 'beforeunload' events
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      // Save current route and form data to sessionStorage
      sessionStorage.setItem('lastRoute', router.asPath);
      // Dispatch event to any open forms to save their state
      window.dispatchEvent(new CustomEvent('app-beforeunload'));
      
      // For modern browsers
      event.preventDefault();
      // For older browsers
      event.returnValue = '';
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [router]);
  
  // Check for recovery on mount
  useEffect(() => {
    const lastRoute = sessionStorage.getItem('lastRoute');
    if (lastRoute && router.asPath !== lastRoute) {
      // Show recovery dialog
      // ...
    }
  }, []);
  
  return <Component {...pageProps} />;
}

export default MyApp;
```

### 2. Form Validation Enhancement

#### Section-Specific Validation
```jsx
// Enhanced validation in schema.ts
import { z } from 'zod';

export const enhancedAttendantCareSchema = z.object({
  level1: z.object({
    personalCare: z.object({
      bathing: z.object({
        minutes: z.number()
          .min(1, "Minutes must be at least 1")
          .max(120, "Minutes should not exceed 120"),
        timesPerWeek: z.number()
          .min(0, "Times per week cannot be negative")
          .max(28, "Times per week should not exceed 28"),
        notes: z.string().optional()
      }),
      // Other fields...
    })
  }),
  // Other levels...
}).refine(data => {
  // Cross-field validation
  const totalLevel1Minutes = calculateTotalMinutes(data.level1);
  return totalLevel1Minutes <= 1680; // Max 28 hours per week
}, {
  message: "Total Level 1 care exceeds maximum allowed (28 hours per week)",
  path: ["level1"]
});
```

#### Form Error Feedback Component
```jsx
// FormErrorSummary.tsx
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { XCircleIcon } from 'lucide-react';

export function FormErrorSummary() {
  const { formState: { errors } } = useFormContext();
  
  // Flatten nested errors for display
  const flattenErrors = (obj, prefix = '') => {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      const path = prefix ? `${prefix}.${key}` : key;
      if (value && typeof value === 'object' && !value.message) {
        return [...acc, ...flattenErrors(value, path)];
      }
      return value.message ? [...acc, { path, message: value.message }] : acc;
    }, []);
  };
  
  const flatErrors = flattenErrors(errors);
  
  if (flatErrors.length === 0) return null;
  
  return (
    <Alert variant="destructive" className="mb-6">
      <XCircleIcon className="h-4 w-4" />
      <AlertTitle>Please correct the following issues:</AlertTitle>
      <AlertDescription>
        <ul className="list-disc pl-4 mt-2 space-y-1">
          {flatErrors.map((error, index) => (
            <li key={index}>
              <span className="font-medium">{error.path}:</span> {error.message}
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}
```

### 3. Performance Optimization

#### Code Splitting for Section Components
```jsx
// In full-assessment.tsx
import dynamic from 'next/dynamic';

// Dynamic imports with loading state
const SimpleDemographics = dynamic(
  () => import('@/sections/1-InitialAssessment/SimpleDemographics'),
  { 
    loading: () => <div className="p-6 text-center">Loading Demographics...</div>,
    ssr: false
  }
);

const AttendantCareSectionIntegrated = dynamic(
  () => import('@/sections/9-AttendantCare').then(mod => ({ default: mod.AttendantCareSectionIntegrated })),
  { 
    loading: () => <div className="p-6 text-center">Loading Attendant Care Assessment...</div>,
    ssr: false
  }
);
```

#### Memoization for Complex Calculations
```jsx
// In AttendantCareSection.integrated.tsx
import React, { useMemo, useCallback } from 'react';

// Memoize expensive calculations
const calculations = useMemo(() => {
  return calculateSummary(formData);
}, [formData.level1, formData.level2, formData.level3]); // Only re-compute when these change

// Memoize event handlers
const handleActivityChange = useCallback((level, category, activity, value) => {
  // Handler implementation
}, []);
```

#### Virtualization for Long Lists
```jsx
// For sections with many items (e.g., symptoms list)
import { FixedSizeList as List } from 'react-window';

function VirtualizedSymptomList({ symptoms }) {
  return (
    <List
      height={400}
      width="100%"
      itemCount={symptoms.length}
      itemSize={60}
    >
      {({ index, style }) => (
        <div style={style}>
          <SymptomItem symptom={symptoms[index]} />
        </div>
      )}
    </List>
  );
}
```

### 4. User Experience Enhancements

#### Progress Tracking
```jsx
// ProgressIndicator.tsx
import React from 'react';
import { useAssessment } from '@/contexts/AssessmentContext';

export function ProgressIndicator() {
  const { data } = useAssessment();
  
  // Calculate completion percentage for each section
  const calculateSectionCompletion = (section, data) => {
    // Implementation based on required fields
    // Return value between 0-100
  };
  
  const sections = [
    { id: 'demographics', label: 'Demographics', completion: calculateSectionCompletion('demographics', data) },
    { id: 'medicalHistory', label: 'Medical History', completion: calculateSectionCompletion('medicalHistory', data) },
    // Other sections...
  ];
  
  const overallCompletion = sections.reduce((sum, section) => sum + section.completion, 0) / sections.length;
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span>Overall Progress</span>
        <span>{Math.round(overallCompletion)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full" 
          style={{ width: `${overallCompletion}%` }}
        ></div>
      </div>
      
      <div className="space-y-2 mt-4">
        {sections.map(section => (
          <div key={section.id} className="grid grid-cols-3 text-sm">
            <span>{section.label}</span>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div 
                className="bg-blue-600 h-1.5 rounded-full" 
                style={{ width: `${section.completion}%` }}
              ></div>
            </div>
            <span className="text-right">{Math.round(section.completion)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

#### Improved Navigation
```jsx
// BreadcrumbNav.tsx
import React from 'react';
import Link from 'next/link';
import { ChevronRightIcon, HomeIcon } from 'lucide-react';

export function BreadcrumbNav({ section, subsection }) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link href="/" className="inline-flex items-center text-sm text-gray-700 hover:text-blue-600">
            <HomeIcon className="w-4 h-4 mr-2" />
            Home
          </Link>
        </li>
        <li>
          <div className="flex items-center">
            <ChevronRightIcon className="w-4 h-4 text-gray-400" />
            <Link href="/full-assessment" className="ml-1 text-sm text-gray-700 hover:text-blue-600 md:ml-2">
              Assessment
            </Link>
          </div>
        </li>
        <li aria-current="page">
          <div className="flex items-center">
            <ChevronRightIcon className="w-4 h-4 text-gray-400" />
            <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
              {section}
            </span>
          </div>
        </li>
        {subsection && (
          <li aria-current="page">
            <div className="flex items-center">
              <ChevronRightIcon className="w-4 h-4 text-gray-400" />
              <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                {subsection}
              </span>
            </div>
          </li>
        )}
      </ol>
    </nav>
  );
}
```

### 5. Field Trial Support

#### Feedback Mechanism
```jsx
// FeedbackButton.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MessageSquareIcon } from 'lucide-react';

export function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState('issue');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Send feedback to backend
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: feedbackType,
          message,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent
        })
      });
      
      // Reset and close
      setMessage('');
      setOpen(false);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 flex items-center space-x-1"
        onClick={() => setOpen(true)}
      >
        <MessageSquareIcon className="h-4 w-4 mr-1" />
        Feedback
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Feedback</DialogTitle>
            <DialogDescription>
              Share your thoughts on the application. Your feedback helps us improve.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <RadioGroup value={feedbackType} onValueChange={setFeedbackType}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="issue" id="issue" />
                <Label htmlFor="issue">Report an Issue</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="suggestion" id="suggestion" />
                <Label htmlFor="suggestion">Suggest an Improvement</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="question" id="question" />
                <Label htmlFor="question">Ask a Question</Label>
              </div>
            </RadioGroup>
            
            <div className="space-y-2">
              <Label htmlFor="message">Your Message</Label>
              <Textarea
                id="message"
                placeholder="Please provide details..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!message || submitting}
            >
              {submitting ? 'Sending...' : 'Send Feedback'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
```

#### Analytics Implementation
```jsx
// In _app.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';

// Simple analytics service
const AnalyticsService = {
  trackPageView: (url) => {
    // Implementation - could be a fetch to your analytics endpoint
    console.log('Page view:', url);
  },
  
  trackEvent: (category, action, label, value) => {
    // Implementation
    console.log('Event:', { category, action, label, value });
  },
  
  trackError: (error, componentStack) => {
    // Implementation
    console.log('Error:', error, componentStack);
  }
};

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  
  useEffect(() => {
    // Track page views
    const handleRouteChange = (url) => {
      AnalyticsService.trackPageView(url);
    };
    
    router.events.on('routeChangeComplete', handleRouteChange);
    
    // Track initial page load
    AnalyticsService.trackPageView(window.location.pathname);
    
    // Track JS errors
    const handleError = (event) => {
      AnalyticsService.trackError(event.error?.message, event.error?.stack);
    };
    
    window.addEventListener('error', handleError);
    
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      window.removeEventListener('error', handleError);
    };
  }, [router]);
  
  return <Component {...pageProps} />;
}
```

## Testing Strategy for Field Trial

### 1. Unit Testing Priority Components
- Focus on data persistence mechanisms
- Test form validation rules
- Validate calculation functions

### 2. Integration Testing
- Test full assessment flow
- Verify data consistency between sections
- Test navigation and state preservation

### 3. User Acceptance Testing Scenarios
1. **Complete Assessment Flow**
   - Create new assessment
   - Fill all sections
   - Navigate between sections
   - Save and return later

2. **Error Recovery Scenarios**
   - Close browser during editing
   - Network disruption during save
   - Invalid data entry

3. **Performance Scenarios**
   - Large assessments with complex data
   - Multiple assessments open
   - Mobile device usage

## Deployment Strategy for Field Trial

1. **Staging Environment**
   - Deploy to staging environment identical to production
   - Perform final validation tests
   - Verify analytics and feedback mechanisms

2. **Limited Rollout**
   - Start with small group of trusted users
   - Collect initial feedback
   - Address critical issues

3. **Full Field Trial**
   - Expand to all test users
   - Provide user documentation
   - Establish support channels

## Conclusion

The key focus for field trial preparation is enhancing stability, user experience, and performance while maintaining the existing functionality. By implementing the recommended enhancements, the application will be better positioned for successful field trials and subsequent production deployment.
