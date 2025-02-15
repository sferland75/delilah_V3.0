import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const sections = [
  { id: '1', name: 'Demographics & Header', path: '/assessment/demographics' },
  { id: '2', name: 'Purpose & Methodology', path: '/assessment/purpose' },
  { id: '3', name: 'Medical History', path: '/assessment/medical-history' },
  { id: '4', name: 'Subjective Information', path: '/assessment/subjective' },
  { id: '5', name: 'Functional Assessment', path: '/assessment/functional' },
  { id: '6', name: 'Typical Day', path: '/assessment/typical-day' },
  { id: '7', name: 'Environmental Assessment', path: '/assessment/environmental' },
  { id: '8', name: 'Activities of Daily Living', path: '/assessment/adl' },
  { id: '9', name: 'Attendant Care', path: '/assessment/attendant-care' },
  { id: '10', name: 'AMA Guides Assessment', path: '/assessment/ama-guides' },
];

export function SectionNavigation() {
  const router = useRouter();
  const pathname = usePathname();

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
    </nav>
  );
}