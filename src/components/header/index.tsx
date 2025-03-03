'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { useIntelligenceContext } from '../../contexts/IntelligenceContext';

export function Header() {
  const { getTotalCompleteness } = useIntelligenceContext?.() || { getTotalCompleteness: () => 0 };
  const completionPercentage = getTotalCompleteness();

  return (
    <header className="border-b border-border bg-card p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xl font-bold">Delilah V3.0</Link>
          <div className="h-6 w-px bg-border"></div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Assessment Completion:</span>
            <div className="w-40 h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary" 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium">{completionPercentage}%</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/import/assessment">Import Documents</Link>
          </Button>
          <Button variant="default" size="sm" asChild>
            <Link href="/report-drafting">Generate Report</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
