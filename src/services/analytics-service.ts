/**
 * Analytics service for field trials
 * 
 * This module provides methods for tracking user activities during field trials.
 * In production, this would be replaced with a proper analytics solution.
 * For field trials, we store data locally and provide export mechanisms.
 */

// Define the structure of analytics events
interface AnalyticsEvent {
  eventType: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  timestamp: string;
  sessionId: string;
  path: string;
  metadata?: Record<string, any>;
}

// Define the structure of errors
interface ErrorEvent {
  errorType: string;
  message: string;
  stack?: string;
  timestamp: string;
  sessionId: string;
  path: string;
  metadata?: Record<string, any>;
}

// Store for analytics events
let events: AnalyticsEvent[] = [];
let errors: ErrorEvent[] = [];
let sessionId: string = '';

// Initialize the analytics service
export function initAnalytics(): void {
  try {
    // Generate a unique session ID
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Try to load any existing events from local storage
    const storedEvents = localStorage.getItem('delilah_analytics_events');
    if (storedEvents) {
      events = JSON.parse(storedEvents);
    }
    
    const storedErrors = localStorage.getItem('delilah_analytics_errors');
    if (storedErrors) {
      errors = JSON.parse(storedErrors);
    }
    
    // Register page view for initial page
    trackPageView(window.location.pathname);
    
    // Track session start
    trackEvent('Session', 'Start', 'Field Trial');
    
    console.log('Analytics initialized with session ID:', sessionId);
  } catch (error) {
    console.error('Failed to initialize analytics:', error);
  }
}

// Track a page view
export function trackPageView(path: string): void {
  try {
    const event: AnalyticsEvent = {
      eventType: 'pageview',
      category: 'Navigation',
      action: 'View',
      label: path,
      timestamp: new Date().toISOString(),
      sessionId,
      path
    };
    
    events.push(event);
    persistEvents();
    
    console.log('Page view tracked:', path);
  } catch (error) {
    console.error('Failed to track page view:', error);
  }
}

// Track an event
export function trackEvent(
  category: string, 
  action: string, 
  label?: string, 
  value?: number,
  metadata?: Record<string, any>
): void {
  try {
    const event: AnalyticsEvent = {
      eventType: 'event',
      category,
      action,
      label,
      value,
      timestamp: new Date().toISOString(),
      sessionId,
      path: window.location.pathname,
      metadata
    };
    
    events.push(event);
    persistEvents();
    
    console.log('Event tracked:', { category, action, label, value });
  } catch (error) {
    console.error('Failed to track event:', error);
  }
}

// Track an error
export function trackError(
  errorType: string,
  message: string,
  stack?: string,
  metadata?: Record<string, any>
): void {
  try {
    const errorEvent: ErrorEvent = {
      errorType,
      message,
      stack,
      timestamp: new Date().toISOString(),
      sessionId,
      path: window.location.pathname,
      metadata
    };
    
    errors.push(errorEvent);
    persistErrors();
    
    console.log('Error tracked:', { errorType, message });
  } catch (error) {
    console.error('Failed to track error:', error);
  }
}

// Persist events to local storage
function persistEvents(): void {
  try {
    localStorage.setItem('delilah_analytics_events', JSON.stringify(events));
  } catch (error) {
    console.error('Failed to persist events:', error);
  }
}

// Persist errors to local storage
function persistErrors(): void {
  try {
    localStorage.setItem('delilah_analytics_errors', JSON.stringify(errors));
  } catch (error) {
    console.error('Failed to persist errors:', error);
  }
}

// Export analytics data as JSON
export function exportAnalyticsData(): { events: AnalyticsEvent[], errors: ErrorEvent[] } {
  return { events, errors };
}

// Clear analytics data
export function clearAnalyticsData(): void {
  events = [];
  errors = [];
  localStorage.removeItem('delilah_analytics_events');
  localStorage.removeItem('delilah_analytics_errors');
}

// Track form interactions
export function trackFormInteraction(
  formId: string,
  action: 'focus' | 'blur' | 'change' | 'submit' | 'error',
  fieldName?: string,
  metadata?: Record<string, any>
): void {
  trackEvent('Form', action, `${formId}${fieldName ? `:${fieldName}` : ''}`, undefined, metadata);
}

// Track assessment actions
export function trackAssessmentAction(
  assessmentId: string,
  action: 'create' | 'load' | 'save' | 'update' | 'complete',
  section?: string,
  metadata?: Record<string, any>
): void {
  trackEvent('Assessment', action, `${assessmentId}${section ? `:${section}` : ''}`, undefined, metadata);
}

// Automatically log certain types of events
export function setupAutomaticTracking(): void {
  // Track all clicks on buttons
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const button = target.closest('button');
    
    if (button) {
      const buttonText = button.textContent?.trim() || 'Unknown';
      const buttonType = button.getAttribute('type') || 'button';
      const buttonId = button.id || 'unnamed';
      
      trackEvent('UI', 'Click', `Button:${buttonId}:${buttonText}`, undefined, {
        buttonType,
        buttonText,
        buttonId,
        hasIcon: button.querySelector('svg, img') !== null
      });
    }
  });
  
  // Track JS errors
  window.addEventListener('error', (event) => {
    trackError(
      'JavaScript', 
      event.message || 'Unknown error', 
      event.error?.stack,
      {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      }
    );
  });
  
  // Track unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    let message = 'Unknown promise rejection';
    
    if (typeof event.reason === 'string') {
      message = event.reason;
    } else if (event.reason instanceof Error) {
      message = event.reason.message;
    }
    
    trackError(
      'UnhandledPromiseRejection',
      message,
      event.reason instanceof Error ? event.reason.stack : undefined
    );
  });
}

// Export the session ID for use in other components
export function getSessionId(): string {
  return sessionId;
}
