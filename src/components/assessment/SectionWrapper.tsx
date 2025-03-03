'use client';

import { ReactNode } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { SectionCompleteness } from '@/components/intelligence/SectionCompleteness';
import { useIntelligenceContext } from '@/contexts/IntelligenceContext';
import { useRouter } from 'next/navigation';

interface SectionWrapperProps {
  title: string;
  sectionId: string;
  children: ReactNode;
  nextSection?: string;
  previousSection?: string;
  onSave?: () => Promise<void>;
}

export function SectionWrapper({
  title,
  sectionId,
  children,
  nextSection,
  previousSection,
  onSave
}: SectionWrapperProps) {
  const router = useRouter();
  const { 
    sectionWarnings = {},
    sectionSuggestions = {}
  } = useIntelligenceContext?.() || {};
  
  const warnings = sectionWarnings[sectionId] || [];
  const suggestions = sectionSuggestions[sectionId] || [];
  
  const handleSave = async () => {
    if (onSave) {
      await onSave();
    }
  };
  
  const handleNext = async () => {
    if (onSave) {
      await onSave();
    }
    
    if (nextSection) {
      router.push(nextSection);
    }
  };
  
  const handlePrevious = () => {
    if (previousSection) {
      router.push(previousSection);
    }
  };
  
  return (
    <ErrorBoundary>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>{title}</CardTitle>
            <div className="text-sm text-muted-foreground">Section {sectionId}</div>
          </div>
          <SectionCompleteness section={sectionId} />
        </CardHeader>
        
        {warnings.length > 0 && (
          <div className="px-6 mb-4">
            <Alert variant="destructive">
              <AlertTitle>Issues Detected</AlertTitle>
              <AlertDescription>
                There {warnings.length === 1 ? 'is' : 'are'} {warnings.length} {warnings.length === 1 ? 'issue' : 'issues'} to address in this section.
              </AlertDescription>
            </Alert>
          </div>
        )}
        
        {suggestions.length > 0 && (
          <div className="px-6 mb-4">
            <Alert>
              <AlertTitle>Suggestions Available</AlertTitle>
              <AlertDescription>
                There {suggestions.length === 1 ? 'is' : 'are'} {suggestions.length} suggestion{suggestions.length === 1 ? '' : 's'} for this section.
              </AlertDescription>
            </Alert>
          </div>
        )}
        
        <CardContent>
          {children}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <div>
            {previousSection && (
              <Button variant="outline" onClick={handlePrevious}>
                Previous Section
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSave}>
              Save
            </Button>
            {nextSection && (
              <Button onClick={handleNext}>
                Next Section
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </ErrorBoundary>
  );
}
