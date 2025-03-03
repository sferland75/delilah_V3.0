'use client';

import { useIntelligenceContext } from '@/contexts/IntelligenceContext';
import { cn } from '@/lib/utils';

interface SectionCompletenessProps {
  section: string;
}

export function SectionCompleteness({ section }: SectionCompletenessProps) {
  const { getSectionCompletenessScore } = useIntelligenceContext?.() || { getSectionCompletenessScore: () => 0 };
  
  const completeness = getSectionCompletenessScore(section);
  
  // Color based on completeness score
  const color = 
    completeness >= 90 ? 'bg-green-500' : 
    completeness >= 70 ? 'bg-emerald-500' : 
    completeness >= 50 ? 'bg-amber-500' : 
    completeness >= 20 ? 'bg-orange-500' : 
    'bg-red-500';
  
  // Status text based on completeness score
  const statusText = 
    completeness >= 90 ? 'Complete' : 
    completeness >= 70 ? 'Nearly Complete' : 
    completeness >= 50 ? 'Partial' : 
    completeness >= 20 ? 'Started' : 
    'Incomplete';
  
  return (
    <div className="flex items-center gap-2" title={`${statusText} - ${completeness}% complete`}>
      <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
        <div 
          className={cn("h-full", color)} 
          style={{ width: `${completeness}%` }}
        ></div>
      </div>
      <span className="text-xs font-medium">{completeness}%</span>
    </div>
  );
}
