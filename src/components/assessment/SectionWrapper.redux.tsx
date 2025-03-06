'use client';

import { ReactNode } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { SectionCompleteness } from '@/components/intelligence/SectionCompleteness';
import { useIntelligenceContext } from '@/contexts/IntelligenceContext';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCurrentSection } from '@/store/slices/uiSlice';

interface SectionWrapperProps {
  title: string;
  sectionId: string;
  children: ReactNode;
  nextSection?: string;
  previousSection?: string;
  onSave?: () => Promise<boolean>;
}

export function SectionWrapperRedux({
  title,
  sectionId,
  children,
  nextSection,
  previousSection,
  onSave
}: SectionWrapperProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentSection = useAppSelector(state => state.ui.currentSection);
  const saveStatus = useAppSelector(state => state.assessments.loading.save);
  
  const { 
    sectionWarnings = {},
    sectionSuggestions = {}
  } = useIntelligenceContext?.() || {};
  
  const warnings = sectionWarnings[sectionId] || [];
  const suggestions = sectionSuggestions[sectionId] || [];
  
  // Update current section in Redux
  if (currentSection !== sectionId) {
    dispatch(setCurrentSection(sectionId));
  }
  
  const handleSave = async () => {
    if (onSave) {
      return await onSave();
    }
    return true;
  };
  
  const handleNext = async () => {
    if (onSave) {
      const success = await onSave();
      if (!success) return;
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
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                disabled={saveStatus === 'loading'}
              >
                Previous Section
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleSave}
              disabled={saveStatus === 'loading'}
            >
              Save
            </Button>
            {nextSection && (
              <Button 
                onClick={handleNext}
                disabled={saveStatus === 'loading'}
              >
                Next Section
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </ErrorBoundary>
  );
}
