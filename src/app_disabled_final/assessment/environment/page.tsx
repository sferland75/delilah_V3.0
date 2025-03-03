'use client';

import React, { useEffect } from 'react';
import { EnvironmentalAssessmentIntegrated } from '@/sections/7-EnvironmentalAssessment';

export default function EnvironmentPage() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    
    // Try alternative approach with setTimeout
    const timeoutId = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Environment</h2>
        <p className="text-sm text-muted-foreground">Assessment of living environment, accessibility, and safety concerns</p>
      </div>
      
      <EnvironmentalAssessmentIntegrated />
    </>
  );
}