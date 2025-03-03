'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Card } from '../ui/card';
import { useIntelligenceContext } from '../../contexts/IntelligenceContext';
import { cn } from '../../lib/utils';

export function Navigation() {
  const pathname = usePathname();
  const { getSectionCompletenessScore } = useIntelligenceContext?.() || { getSectionCompletenessScore: () => 0 };
  
  const sections = [
    { id: '1', name: 'Initial Assessment', path: '/assessment/initial' },
    { id: '2', name: 'Purpose & Methodology', path: '/assessment/purpose' },
    { id: '3', name: 'Medical History', path: '/assessment/medical-history' },
    { id: '4', name: 'Symptoms', path: '/assessment/symptoms' },
    { id: '5', name: 'Functional Status', path: '/assessment/functional' },
    { id: '6', name: 'Typical Day', path: '/assessment/typical-day' },
    { id: '7', name: 'Environmental', path: '/assessment/environmental' },
    { id: '8', name: 'Activities of Daily Living', path: '/assessment/adl' },
    { id: '9', name: 'Attendant Care', path: '/assessment/attendant-care' },
  ];
  
  return (
    <Card className="w-64 h-full p-4 shrink-0">
      <div className="space-y-1">
        <Link href="/" className={cn(
          "block px-4 py-2 rounded-md text-sm",
          pathname === "/" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
        )}>
          Dashboard
        </Link>
        
        <div className="pt-4">
          <p className="px-4 text-sm font-medium text-muted-foreground">Assessment</p>
          <ul className="mt-2 space-y-1">
            {sections.map((section) => {
              const completeness = getSectionCompletenessScore(section.id);
              
              return (
                <li key={section.id}>
                  <Link href={section.path} className={cn(
                    "flex items-center justify-between px-4 py-2 text-sm rounded-md",
                    pathname === section.path ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  )}>
                    <span>{section.name}</span>
                    {completeness > 0 && (
                      <span className={cn(
                        "w-2 h-2 rounded-full",
                        completeness >= 90 ? "bg-green-500" :
                        completeness >= 50 ? "bg-amber-500" : "bg-red-500"
                      )} />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        
        <div className="pt-4">
          <p className="px-4 text-sm font-medium text-muted-foreground">Utilities</p>
          <ul className="mt-2 space-y-1">
            <li>
              <Link href="/import/assessment" className={cn(
                "block px-4 py-2 text-sm rounded-md",
                pathname === "/import/assessment" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              )}>
                Import Documents
              </Link>
            </li>
            <li>
              <Link href="/report-drafting" className={cn(
                "block px-4 py-2 text-sm rounded-md",
                pathname === "/report-drafting" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              )}>
                Generate Report
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
