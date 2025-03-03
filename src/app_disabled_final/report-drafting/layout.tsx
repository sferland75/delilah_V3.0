"use client";

import React from 'react';
import { ReportDraftingProvider } from '@/contexts/ReportDrafting/ReportDraftingContext';

export default function ReportDraftingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ReportDraftingProvider>
      {children}
    </ReportDraftingProvider>
  );
}
