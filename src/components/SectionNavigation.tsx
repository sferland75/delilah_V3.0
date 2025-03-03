import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export const sections = [
  { id: '1', name: 'Initial Assessment', path: '/assessment/initial' },
  { id: '2', name: 'Purpose & Methodology', path: '/assessment/purpose' },
  { id: '3', name: 'Medical History', path: '/assessment/medical' },
  { id: '4', name: 'Symptoms Assessment', path: '/assessment/symptoms' },
  { id: '5', name: 'Functional Assessment', path: '/assessment/functional' },
  { id: '6', name: 'Typical Day', path: '/assessment/typical-day' },
  { id: '7', name: 'Environmental Assessment', path: '/assessment/environment' },
  { id: '8', name: 'Activities of Daily Living', path: '/assessment/adl' },
  { id: '9', name: 'Attendant Care', path: '/assessment/attendant-care' },
  // AMA Guides section removed temporarily
  // { id: '10', name: 'AMA Guides Assessment', path: '/assessment/ama-guides' },
];

export const utilityPages = [
  { name: 'Report Drafting', path: '/report-drafting', icon: '📝' },
  { name: 'Import PDF', path: '/import/pdf', icon: '📄' },
  { name: 'Import Referral', path: '/import/referral', icon: '📨' },
  // Add more utility pages here as they are developed
];

export const developerPages = [
  { name: 'Referral Integration Test', path: '/testing/referral-integration', icon: '🧪' },
  // Add more developer pages as needed
];

export function SectionNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  // Check if we're in development mode
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <nav className="space-y-1">
      {sections.map((section) => (
        <Button
          key={section.id}
          variant="ghost"
          className={cn(
            'w-full justify-start pl-8 relative',
            pathname === section.path && 'bg-accent text-accent-foreground'
          )}
          onClick={() => router.push(section.path)}
        >
          <span className="absolute left-2 text-sm text-muted-foreground">
            {section.id}.
          </span>
          {section.name}
        </Button>
      ))}
      
      <Separator className="my-4" />
      
      <div className="px-2 mb-2 text-sm font-medium text-muted-foreground">
        Utilities
      </div>
      
      {utilityPages.map((page) => (
        <Button
          key={page.path}
          variant="ghost"
          className={cn(
            'w-full justify-start',
            pathname === page.path && 'bg-accent text-accent-foreground'
          )}
          onClick={() => router.push(page.path)}
        >
          <span className="mr-2">{page.icon}</span>
          {page.name}
        </Button>
      ))}
      
      {/* Only show developer pages in development mode */}
      {isDev && (
        <>
          <Separator className="my-4" />
          
          <div className="px-2 mb-2 text-sm font-medium text-muted-foreground">
            Developer Tools
          </div>
          
          {developerPages.map((page) => (
            <Button
              key={page.path}
              variant="ghost"
              className={cn(
                'w-full justify-start',
                pathname === page.path && 'bg-accent text-accent-foreground'
              )}
              onClick={() => router.push(page.path)}
            >
              <span className="mr-2">{page.icon}</span>
              {page.name}
            </Button>
          ))}
        </>
      )}
    </nav>
  );
}