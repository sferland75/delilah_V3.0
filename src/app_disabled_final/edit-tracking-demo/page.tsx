"use client";

import React from 'react';
import { EditTrackingProvider } from '@/contexts/edit-tracking';
import { ReportEditingExample } from '@/components/edit-tracking/example-usage';

export default function EditTrackingDemoPage() {
  // Using a simple ID for demo purposes
  const reportId = "demo-report-123";

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-semibold text-slate-800 mb-2">Edit Tracking System Demo</h2>
      <p className="text-sm text-muted-foreground mb-6">
        This page demonstrates the edit tracking system implemented for Delilah V3.0.
        Edit content in the sections below to see the tracking in action.
      </p>

      <ReportEditingExample reportId={reportId} />
    </div>
  );
}
