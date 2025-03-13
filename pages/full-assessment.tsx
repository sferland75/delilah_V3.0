import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { InfoIcon, Save, ArrowLeft, ArrowRight } from 'lucide-react';
import { AssessmentProvider, useAssessment } from '@/contexts/AssessmentContext';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/components/ui/use-toast';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import dynamic from 'next/dynamic';
import Head from 'next/head';

// Dynamically import components to prevent SSR issues
const Demographics = dynamic(
  () => import('@/sections/1-InitialAssessment').then(mod => mod.Demographics).catch(() => {
    console.error('Failed to load Demographics');
    return import('@/sections/1-InitialAssessment').then(mod => mod.SimpleDemographics);
  }),
  { ssr: false }
);

// **CHANGED: Import the direct components from pages directory**
const MedicalHistory = dynamic(
  () => import('./direct-components/MedicalHistoryComponent'),
  { ssr: false, loading: () => <div>Loading Medical History...</div> }
);

// **CHANGED: Import the advanced symptoms component from pages directory**
const SymptomsAssessment = dynamic(
  () => import('./direct-components/AdvancedSymptomsComponent'),
  { ssr: false, loading: () => <div>Loading Advanced Symptoms Assessment...</div> }
);

// Import the enhanced functional status component from pages directory
const FunctionalStatus = dynamic(
  () => import('./direct-components/EnhancedFunctionalStatus'),
  { ssr: false, loading: () => <div>Loading Functional Status Assessment...</div> }
);

const TypicalDay = dynamic(
  () => import('@/sections/6-TypicalDay/EnhancedTypicalDay').catch(() => {
    console.error('Failed to load EnhancedTypicalDay');
    return import('@/sections/6-TypicalDay/SimpleTypicalDay');
  }),
  { ssr: false }
);

const ActivitiesOfDailyLiving = dynamic(
  () => import('@/sections/8-ActivitiesOfDailyLiving/components/ActivitiesOfDailyLiving').catch(() => {
    console.error('Failed to load ActivitiesOfDailyLiving');
    return import('@/sections/8-ActivitiesOfDailyLiving').then(mod => mod.ActivitiesOfDailyLiving);
  }),
  { ssr: false }
);

const AttendantCareSection = dynamic(
  () => import('@/sections/9-AttendantCare').then(mod => mod.AttendantCareSectionIntegrated).catch(() => {
    console.error('Failed to load AttendantCareSectionIntegrated');
    return import('@/sections/9-AttendantCare').then(mod => {
      return mod.SimpleAttendantCare || mod.AttendantCareSection;
    });
  }),
  { ssr: false }
);

function FullAssessmentContent() {
  const router = useRouter();
  const { id } = router.query;
  const { data, loadAssessmentById, saveCurrentAssessment, hasUnsavedChanges } = useAssessment();
  const [activeTab, setActiveTab] = useState('demographics');
  const [loadingState, setLoadingState] = useState({ isLoading: true, error: null });
  
  // Load assessment data when ID is available
  useEffect(() => {
    if (id && typeof id === 'string') {
      setLoadingState({ isLoading: true, error: null });
      try {
        const success = loadAssessmentById(id);
        if (!success) {
          setLoadingState({
            isLoading: false,
            error: `Could not load assessment with ID: ${id}`
          });
        } else {
          setLoadingState({ isLoading: false, error: null });
        }
      } catch (error) {
        setLoadingState({
          isLoading: false,
          error: `Error loading assessment: ${error.message}`
        });
      }
    } else {
      setLoadingState({ isLoading: false, error: null });
    }
  }, [id, loadAssessmentById]);
  
  // Save current assessment
  const handleSave = () => {
    try {
      const success = saveCurrentAssessment();
      if (success) {
        toast({
          title: 'Assessment saved',
          description: 'Your assessment has been saved successfully.',
        });
      } else {
        toast({
          title: 'Save failed',
          description: 'Failed to save assessment. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: `Error saving assessment: ${error.message}`,
        variant: 'destructive',
      });
    }
  };
  
  // Go to next section
  const goToNextSection = () => {
    const sections = ['demographics', 'medicalHistory', 'symptoms', 'functionalStatus', 'typicalDay', 'adl', 'attendantCare', 'summary'];
    const currentIndex = sections.indexOf(activeTab);
    if (currentIndex < sections.length - 1) {
      setActiveTab(sections[currentIndex + 1]);
    }
  };
  
  // Go to previous section
  const goToPreviousSection = () => {
    const sections = ['demographics', 'medicalHistory', 'symptoms', 'functionalStatus', 'typicalDay', 'adl', 'attendantCare', 'summary'];
    const currentIndex = sections.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(sections[currentIndex - 1]);
    }
  };
  
  // Show placeholder for sections that aren't implemented
  const PlaceholderSection = ({ title }) => (
    <div className="p-6 border rounded-md bg-gray-50">
      <h3 className="text-lg font-medium mb-2">{title} Section</h3>
      <p className="text-gray-600 mb-4">This section is a placeholder.</p>
      <p className="text-sm text-gray-500">
        For demonstration purposes, only the Demographics, Medical History, Symptoms, Functional Status, Typical Day, Activities of Daily Living, and Attendant Care sections are fully implemented.
      </p>
    </div>
  );
  
  // Handle loading states
  if (loadingState.isLoading) {
    return <div className="p-6 text-center">Loading assessment data...</div>;
  }
  
  if (loadingState.error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{loadingState.error}</AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-slate-800">
          {data?.demographics?.personalInfo?.firstName 
            ? `Assessment for ${data.demographics.personalInfo.firstName} ${data.demographics.personalInfo.lastName || ''}`
            : 'New Assessment'
          }
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Complete all sections for a comprehensive assessment</p>
      </div>
      
      {hasUnsavedChanges && (
        <Alert className="mb-6 bg-yellow-50 border-yellow-200">
          <InfoIcon className="h-4 w-4 text-yellow-800" />
          <AlertTitle className="text-yellow-800">Unsaved Changes</AlertTitle>
          <AlertDescription className="text-yellow-700">
            You have unsaved changes. Click the "Save Assessment" button to save your progress.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left sidebar navigation */}
        <div className="md:w-1/4 w-full">
          <div className="bg-gray-50 rounded-md p-4 sticky top-4">
            <h3 className="font-medium text-lg mb-3">Assessment Sections</h3>
            <div className="flex flex-col space-y-2">
              <Button 
                variant={activeTab === 'demographics' ? 'default' : 'ghost'} 
                className={`justify-start ${activeTab === 'demographics' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}`}
                onClick={() => setActiveTab('demographics')}
              >
                Demographics
              </Button>
              <Button 
                variant={activeTab === 'medicalHistory' ? 'default' : 'ghost'} 
                className={`justify-start ${activeTab === 'medicalHistory' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}`}
                onClick={() => setActiveTab('medicalHistory')}
              >
                Medical History
              </Button>
              <Button 
                variant={activeTab === 'symptoms' ? 'default' : 'ghost'} 
                className={`justify-start ${activeTab === 'symptoms' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}`}
                onClick={() => setActiveTab('symptoms')}
              >
                Symptoms
              </Button>
              <Button 
                variant={activeTab === 'functionalStatus' ? 'default' : 'ghost'} 
                className={`justify-start ${activeTab === 'functionalStatus' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}`}
                onClick={() => setActiveTab('functionalStatus')}
              >
                Functional Status
              </Button>
              <Button 
                variant={activeTab === 'typicalDay' ? 'default' : 'ghost'} 
                className={`justify-start ${activeTab === 'typicalDay' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}`}
                onClick={() => setActiveTab('typicalDay')}
              >
                Typical Day
              </Button>
              <Button 
                variant={activeTab === 'adl' ? 'default' : 'ghost'} 
                className={`justify-start ${activeTab === 'adl' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}`}
                onClick={() => setActiveTab('adl')}
              >
                Activities of Daily Living
              </Button>
              <Button 
                variant={activeTab === 'attendantCare' ? 'default' : 'ghost'} 
                className={`justify-start ${activeTab === 'attendantCare' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}`}
                onClick={() => setActiveTab('attendantCare')}
              >
                Attendant Care
              </Button>
              <Button 
                variant={activeTab === 'summary' ? 'default' : 'ghost'} 
                className={`justify-start ${activeTab === 'summary' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}`}
                onClick={() => setActiveTab('summary')}
              >
                Summary
              </Button>
            </div>

            <div className="mt-6">
              <Button 
                variant="default" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleSave}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Assessment
              </Button>
            </div>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="md:w-3/4 w-full">
          <div className="border rounded-md overflow-hidden">
            {activeTab === 'demographics' && (
              <ErrorBoundary fallback={<PlaceholderSection title="Demographics (Error Loading)" />}>
                <Demographics />
              </ErrorBoundary>
            )}
            
            {activeTab === 'medicalHistory' && (
              <ErrorBoundary fallback={<PlaceholderSection title="Medical History (Error Loading)" />}>
                <MedicalHistory />
              </ErrorBoundary>
            )}
            
            {activeTab === 'symptoms' && (
              <ErrorBoundary fallback={<PlaceholderSection title="Symptoms Assessment (Error Loading)" />}>
                <SymptomsAssessment />
              </ErrorBoundary>
            )}
            
            {activeTab === 'functionalStatus' && (
              <ErrorBoundary fallback={<PlaceholderSection title="Functional Status (Error Loading)" />}>
                <FunctionalStatus formData={data} updateFormData={(section, sectionData) => {
                  // This is a simplified version of the updateFormData function
                  // In a real implementation, this would update the assessment context
                  console.log(`Updating ${section} with:`, sectionData);
                }} />
              </ErrorBoundary>
            )}
            
            {activeTab === 'typicalDay' && (
              <ErrorBoundary fallback={<PlaceholderSection title="Typical Day (Error Loading)" />}>
                <TypicalDay />
              </ErrorBoundary>
            )}
            
            {activeTab === 'adl' && (
              <ErrorBoundary fallback={<PlaceholderSection title="Activities of Daily Living (Error Loading)" />}>
                <ActivitiesOfDailyLiving />
              </ErrorBoundary>
            )}
            
            {activeTab === 'attendantCare' && (
              <ErrorBoundary fallback={<PlaceholderSection title="Attendant Care (Error Loading)" />}>
                <AttendantCareSection />
              </ErrorBoundary>
            )}
            
            {activeTab === 'summary' && (
              <PlaceholderSection title="Assessment Summary" />
            )}
          </div>
          
          <div className="flex justify-between mt-6">
            <Button 
              variant="outline" 
              onClick={goToPreviousSection}
              disabled={activeTab === 'demographics'}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous Section
            </Button>
            
            <Button 
              variant="outline"
              onClick={goToNextSection}
              disabled={activeTab === 'summary'}
              className="flex items-center gap-2"
            >
              Next Section
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FullAssessmentPage() {
  return (
    <>
      <Head>
        <title>Full Assessment | Delilah V3.0</title>
      </Head>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Full Assessment</h1>
          <div className="flex space-x-2">
            <Link href="/">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Return to Home</Button>
            </Link>
          </div>
        </div>
        
        <Card className="mb-6">
          <CardContent className="p-0">
            <AssessmentProvider>
              <FullAssessmentContent />
            </AssessmentProvider>
          </CardContent>
        </Card>
        
        <Toaster />
      </div>
    </>
  );
}