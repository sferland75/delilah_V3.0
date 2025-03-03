import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

// Import all section components
import { SymptomsAssessmentIntegrated } from '@/sections/4-SymptomsAssessment';
import { MedicalHistory } from '@/sections/3-MedicalHistory/components/MedicalHistory';
import { InitialAssessment } from '@/sections/1-InitialAssessment';
import { PurposeAndMethodology } from '@/sections/2-PurposeAndMethodology';
import { FunctionalStatus } from '@/sections/5-FunctionalStatus';
import { TypicalDay } from '@/sections/6-TypicalDay';
import { EnvironmentalAssessment } from '@/sections/7-EnvironmentalAssessment';
import { ActivitiesOfDailyLiving } from '@/sections/8-ActivitiesOfDailyLiving';
import { AttendantCare } from '@/sections/9-AttendantCare';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

export default function SectionForm() {
  const router = useRouter();
  const { section } = router.query;
  const [activeSection, setActiveSection] = useState(section || 'symptoms');
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    // Update active section when route changes
    if (section) {
      setActiveSection(section as string);
    }
  }, [section]);

  // Map section IDs to components
  const sectionComponents = {
    'initial': InitialAssessment,
    'purpose': PurposeAndMethodology,
    'medical': MedicalHistory,
    'symptoms': SymptomsAssessmentIntegrated,
    'functional': FunctionalStatus,
    'typical-day': TypicalDay,
    'environment': EnvironmentalAssessment,
    'adl': ActivitiesOfDailyLiving,
    'attendant-care': AttendantCare
  };

  // Get the component for the current section
  const CurrentSectionComponent = sectionComponents[activeSection as string];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Assessment Form</h1>
          <p className="text-sm text-muted-foreground mt-1">Complete all sections to generate the assessment report</p>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle>Navigation</CardTitle>
          <div className="mt-2 overflow-auto pb-1">
            <Tabs 
              value={activeSection as string} 
              onValueChange={(value) => {
                router.push(`/assessment/section-form?section=${value}`, undefined, { shallow: true });
              }}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
                <TabsTrigger value="initial">Initial</TabsTrigger>
                <TabsTrigger value="purpose">Purpose</TabsTrigger>
                <TabsTrigger value="medical">Medical History</TabsTrigger>
                <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
                <TabsTrigger value="functional">Functional</TabsTrigger>
                <TabsTrigger value="typical-day">Typical Day</TabsTrigger>
                <TabsTrigger value="environment">Environment</TabsTrigger>
                <TabsTrigger value="adl">ADLs</TabsTrigger>
                <TabsTrigger value="attendant-care">Attendant Care</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>

        <CardContent className="pt-2">
          <ErrorBoundary>
            {CurrentSectionComponent ? (
              <CurrentSectionComponent />
            ) : (
              <Alert>
                <AlertTitle>Section not found</AlertTitle>
                <AlertDescription>
                  The requested section could not be loaded. Please try another section.
                </AlertDescription>
              </Alert>
            )}
          </ErrorBoundary>
        </CardContent>
      </Card>
    </div>
  );
}