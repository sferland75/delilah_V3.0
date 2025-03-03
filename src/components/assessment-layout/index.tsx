'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface SidebarNavItemProps {
  number: number;
  title: string;
  href: string;
  isActive: boolean;
}

const SidebarNavItem = ({ number, title, href, isActive }: SidebarNavItemProps) => (
  <Link 
    href={href}
    className={cn(
      "flex items-center gap-3 px-4 py-2 rounded-md transition-colors",
      isActive ? "bg-slate-100" : "hover:bg-slate-50"
    )}
  >
    <div className={cn(
      "w-6 h-6 rounded-full flex items-center justify-center text-xs",
      isActive ? "bg-primary text-white" : "bg-slate-200 text-slate-600"
    )}>
      {number}
    </div>
    <span className={cn(
      "text-sm font-medium",
      isActive ? "text-primary" : "text-slate-700"
    )}>
      {title}
    </span>
  </Link>
);

interface UtilityLinkProps {
  icon: React.ReactNode;
  title: string;
  href: string;
  isActive: boolean;
}

const UtilityLink = ({ icon, title, href, isActive }: UtilityLinkProps) => (
  <Link 
    href={href}
    className={cn(
      "flex items-center gap-3 px-4 py-2 rounded-md transition-colors",
      isActive ? "bg-slate-100" : "hover:bg-slate-50"
    )}
  >
    <span className="text-slate-500">{icon}</span>
    <span className={cn(
      "text-sm font-medium",
      isActive ? "text-primary" : "text-slate-700"
    )}>
      {title}
    </span>
  </Link>
);

interface AssessmentLayoutProps {
  children: ReactNode;
  completionPercentage?: number;
}

export function AssessmentLayout({ children, completionPercentage = 0 }: AssessmentLayoutProps) {
  const pathname = usePathname();
  
  const assessmentSections = [
    { number: 1, title: 'Initial Assessment', href: '/assessment/initial' },
    { number: 2, title: 'Purpose & Methodology', href: '/assessment/purpose' },
    { number: 3, title: 'Medical History', href: '/assessment/medical-history' },
    { number: 4, title: 'Symptoms Assessment', href: '/assessment/symptoms' },
    { number: 5, title: 'Functional Assessment', href: '/assessment/functional' },
    { number: 6, title: 'Typical Day', href: '/assessment/typical-day' },
    { number: 7, title: 'Environmental Assessment', href: '/assessment/environmental' },
    { number: 8, title: 'Activities of Daily Living', href: '/assessment/adl' },
    { number: 9, title: 'Attendant Care', href: '/assessment/attendant-care' },
  ];
  
  // Find the current section based on the pathname
  const currentSection = assessmentSections.find(section => pathname === section.href) || assessmentSections[0];

  // All navigation tabs
  const navigationTabs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Assessment', href: '/assessment/initial', isActive: pathname.startsWith('/assessment/') },
    { title: 'Import Documents', href: '/import/assessment' },
    { title: 'Generate Report', href: '/report-drafting' },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 border-r bg-white flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">Delilah V3.0</h1>
          <p className="text-sm text-muted-foreground">In-Home Assessment</p>
        </div>
        
        <div className="flex-1 overflow-auto py-2">
          {/* Assessment Sections */}
          <div className="space-y-1 px-2">
            {assessmentSections.map((section) => (
              <SidebarNavItem
                key={section.number}
                number={section.number}
                title={section.title}
                href={section.href}
                isActive={pathname === section.href}
              />
            ))}
          </div>
          
          {/* Utilities */}
          <div className="mt-6 pt-6 border-t px-4">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Utilities
            </h3>
            <div className="space-y-1">
              <UtilityLink
                icon={<span className="text-xs">📄</span>}
                title="Report Drafting"
                href="/report-drafting"
                isActive={pathname.startsWith('/report-drafting')}
              />
              <UtilityLink
                icon={<span className="text-xs">📥</span>}
                title="Import PDF"
                href="/import/assessment"
                isActive={pathname.startsWith('/import/assessment')}
              />
              <UtilityLink
                icon={<span className="text-xs">📋</span>}
                title="Import Referral"
                href="/import/referral"
                isActive={pathname.startsWith('/import/referral')}
              />
            </div>
          </div>
          
          {/* Developer Tools */}
          <div className="mt-6 pt-6 border-t px-4">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Developer Tools
            </h3>
            <div className="space-y-1">
              <UtilityLink
                icon={<span className="text-xs">🧪</span>}
                title="Referral Integration Test"
                href="/developer/referral-test"
                isActive={pathname.startsWith('/developer/referral-test')}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="h-16 border-b bg-white flex items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <h2 className="text-lg font-semibold">Delilah V3.0</h2>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500">Assessment Completion:</span>
              <div className="w-40 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <span className="text-sm font-medium">{completionPercentage}%</span>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link href="/import/assessment">Import Documents</Link>
            </Button>
            <Button asChild>
              <Link href="/report-drafting">Generate Report</Link>
            </Button>
          </div>
        </div>
        
        {/* Tab navigation */}
        <div className="border-b bg-white">
          <div className="mx-6">
            <div className="flex border-b">
              {navigationTabs.map((tab) => (
                <Link 
                  key={tab.title} 
                  href={tab.href}
                  className={cn(
                    "py-3 px-4 text-sm font-medium border-b-2 -mb-px transition-colors",
                    (tab.isActive || pathname === tab.href) 
                      ? "border-primary text-primary" 
                      : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
                  )}
                >
                  {tab.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        {/* Content area with section tabs */}
        <div className="flex-1 flex flex-col bg-slate-50">
          <div className="border-b bg-white">
            <div className="mx-6">
              <div className="flex overflow-x-auto">
                {assessmentSections.map((section) => (
                  <Link 
                    key={section.number} 
                    href={section.href}
                    className={cn(
                      "py-2 px-4 text-sm font-medium whitespace-nowrap transition-colors",
                      pathname === section.href
                        ? "text-primary bg-primary/5"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    )}
                  >
                    {section.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
