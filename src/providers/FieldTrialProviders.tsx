import React from 'react';
import { EnhancedAssessmentProvider } from '@/contexts/EnhancedAssessmentContext';
import { SessionRecoveryDialog } from '@/components/SessionRecoveryDialog';
import { FeedbackButton } from '@/components/FeedbackButton';
import { AnalyticsProvider } from '@/providers/AnalyticsProvider';

/**
 * FieldTrialProviders is a wrapper component that provides all the necessary context
 * and UI elements for field trial functionality, including:
 * - Enhanced assessment state management with auto-save
 * - Session recovery for interrupted sessions
 * - Feedback collection mechanism
 * - Analytics tracking
 */
export function FieldTrialProviders({ children }: { children: React.ReactNode }) {
  return (
    <AnalyticsProvider>
      <EnhancedAssessmentProvider>
        {children}
        <SessionRecoveryDialog />
        <FeedbackButton />
      </EnhancedAssessmentProvider>
    </AnalyticsProvider>
  );
}

export default FieldTrialProviders;
