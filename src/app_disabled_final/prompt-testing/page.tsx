"use client";

import PromptTester from '@/components/ReportDrafting/PromptTester';

export default function PromptTestingPage() {
  return (
    <div className="container mx-auto py-6">
      <h2 className="text-2xl font-semibold text-slate-800">Prompt Testing</h2>
      <p className="text-sm text-muted-foreground mt-1 mb-4">
        Test and visualize prompt templates for the Report Drafting module
      </p>
      
      <PromptTester />
    </div>
  );
}
