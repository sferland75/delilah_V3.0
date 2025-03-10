import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  initAnalytics, 
  trackPageView, 
  setupAutomaticTracking 
} from '@/services/analytics-service';

/**
 * AnalyticsProvider initializes the analytics service and sets up
 * automatic tracking for page views and other events during field trials.
 */
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  
  useEffect(() => {
    if (!router) return;
    
    // Initialize analytics when the app first loads
    try {
      initAnalytics();
    } catch (error) {
      console.error("Failed to initialize analytics:", error);
    }
    
    // Set up automatic tracking for clicks, errors, etc.
    try {
      setupAutomaticTracking();
    } catch (error) {
      console.error("Failed to setup automatic tracking:", error);
    }
    
    // Track route changes if router is available
    if (router.events) {
      const handleRouteChange = (url: string) => {
        try {
          trackPageView(url);
        } catch (error) {
          console.error("Failed to track page view:", error);
        }
      };
      
      // Add router event listeners
      router.events.on('routeChangeComplete', handleRouteChange);
      
      // Clean up
      return () => {
        router.events.off('routeChangeComplete', handleRouteChange);
      };
    }
  }, [router]);
  
  // Simply render children - this is a "behavior" component without UI
  return <>{children}</>;
}

export default AnalyticsProvider;
