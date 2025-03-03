import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ErrorBoundary } from '@/components/ui/error-boundary/error-boundary';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

// Import default exports for all section components
import DemographicsIntegrated from '../sections/1-InitialAssessment/components/Demographics.integrated';
import { PurposeAndMethodologyIntegrated } from '../sections/2-PurposeAndMethodology/components/PurposeAndMethodology.integrated';
import { MedicalHistoryIntegrated } from '../sections/3-MedicalHistory/components/MedicalHistory.integrated';
import { SymptomsAssessmentIntegrated } from '../sections/4-SymptomsAssessment/components/SymptomsAssessment.integrated';
import { FunctionalStatusIntegrated } from '../sections/5-FunctionalStatus/components/FunctionalStatus.integrated';
import TypicalDayIntegrated from '../sections/6-TypicalDay/components/TypicalDay.integrated';
import { EnvironmentalAssessmentIntegrated } from '../sections/7-EnvironmentalAssessment/components/EnvironmentalAssessment.integrated';
import { ActivitiesOfDailyLivingIntegrated } from '../sections/8-ActivitiesOfDailyLiving/components/ActivitiesOfDailyLiving.integrated';
import { AttendantCareSectionIntegrated } from '../sections/9-AttendantCare/components/AttendantCareSection.integrated';

export default function FullAccess() {
  const [activeTab, setActiveTab] = useState('symptoms');
  
  const sections = [
    { id: 'initial', name: '1. Initial', component: DemographicsIntegrated },
    { id: 'purpose', name: '2. Purpose', component: PurposeAndMethodologyIntegrated },
    { id: 'medical', name: '3. Medical', component: MedicalHistoryIntegrated },
    { id: 'symptoms', name: '4. Symptoms', component: SymptomsAssessmentIntegrated },
    { id: 'functional', name: '5. Functional', component: FunctionalStatusIntegrated },
    { id: 'typical-day', name: '6. Typical Day', component: TypicalDayIntegrated },
    { id: 'environment', name: '7. Environment', component: EnvironmentalAssessmentIntegrated },
    { id: 'adl', name: '8. ADLs', component: ActivitiesOfDailyLivingIntegrated },
    { id: 'attendant', name: '9. Attendant Care', component: AttendantCareSectionIntegrated }
  ];
  
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Delilah V3.0 Complete Assessment</h1>
        <Link href="/">
          <Button variant="outline">Return to Home</Button>
        </Link>
      </div>
      
      <Alert className="mb-6">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Assessment Sections</AlertTitle>
        <AlertDescription>
          Select a section below to view and complete that part of the assessment.
        </AlertDescription>
      </Alert>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Assessment Sections</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-9 gap-2 mb-6">
              {sections.map(section => (
                <TabsTrigger key={section.id} value={section.id}>
                  {section.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {sections.map(section => (
              <TabsContent key={section.id} value={section.id} className="pt-2">
                <ErrorBoundary>
                  {section.component ? <section.component /> : 
                    <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-md">
                      <h3 className="text-lg font-medium text-yellow-800 mb-2">Component Not Available</h3>
                      <p className="text-yellow-700">The {section.name} component could not be loaded.</p>
                    </div>
                  }
                </ErrorBoundary>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}