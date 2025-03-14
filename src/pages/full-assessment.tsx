import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ErrorBoundary } from '@/components/ui/error-boundary/error-boundary';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { InfoIcon, Home, LayoutDashboard, Save, FileText } from 'lucide-react';
import { useAssessmentContext } from '@/contexts/AssessmentContext';
import SaveAssessment from '@/components/SaveAssessment';
import { createBackup } from '@/utils/simpleBackup';

// Define fallback components in case loading fails
const FallbackComponent = ({ name }) => (
  <div className="p-6 border-2 border-orange-200 bg-orange-50 rounded-md">
    <h3 className="text-lg font-medium text-orange-800 mb-2">Section Loading Error: {name}</h3>
    <p className="text-orange-700">This section encountered an error while loading.</p>
    <p className="mt-2 text-orange-600">Try accessing this section directly from the home page instead.</p>
    <p className="mt-2 text-orange-600">Technical details: Could not find the proper component export.</p>
  </div>
);

// Import each section component directly with proper error handling

// Symptoms Assessment
let SymptomsComponent;
try {
  const SymptomsMod = require('../sections/4-SymptomsAssessment/components/SymptomsAssessment.integrated.final.tsx');
  SymptomsComponent = SymptomsMod.SymptomsAssessmentIntegratedFinal || SymptomsMod.default;
} catch (error) {
  console.error("Failed to load SymptomsComponent:", error);
  SymptomsComponent = () => <FallbackComponent name="Symptoms Assessment" />;
}

// Medical History
let MedicalHistoryComponent;
try {
  // Try to load the Medical History component
  try {
    const MedicalHistoryMod = require('../sections/3-MedicalHistory/components/MedicalHistory.integrated.tsx');
    MedicalHistoryComponent = MedicalHistoryMod.MedicalHistoryIntegrated || MedicalHistoryMod.default;
  } catch (e) {
    // Fallback to direct access version if available
    const MedicalHistoryMod = require('../sections/3-MedicalHistory/components/MedicalHistory.direct-access.tsx');
    MedicalHistoryComponent = MedicalHistoryMod.default || MedicalHistoryMod;
  }
} catch (error) {
  console.error("Failed to load MedicalHistoryComponent:", error);
  MedicalHistoryComponent = () => <FallbackComponent name="Medical History" />;
}

// Typical Day - Use the fixed component
let TypicalDayComponent;
try {
  // Import the fixed TypicalDay component
  const TypicalDayMod = require('../sections/6-TypicalDay/components/TypicalDay.integrated.final.tsx');
  TypicalDayComponent = TypicalDayMod.TypicalDayIntegratedFinal || TypicalDayMod.default;
} catch (error) {
  console.error("Failed to load TypicalDayComponent:", error);
  TypicalDayComponent = () => <FallbackComponent name="Typical Day" />;
}

// Initial Assessment
let InitialAssessmentComponent;
try {
  // Try to get the Demographics component as it's the main component for Initial Assessment
  const DemographicsMod = require('../sections/1-InitialAssessment/components/Demographics.integrated.tsx');
  InitialAssessmentComponent = DemographicsMod.DemographicsIntegrated || DemographicsMod.default;
} catch (error) {
  console.error("Failed to load InitialAssessmentComponent:", error);
  InitialAssessmentComponent = () => <FallbackComponent name="Initial Assessment" />;
}

// Purpose and Methodology
let PurposeMethodologyComponent;
try {
  const PurposeMethodologyMod = require('../sections/2-PurposeAndMethodology/components/PurposeAndMethodology.integrated.tsx');
  PurposeMethodologyComponent = PurposeMethodologyMod.PurposeAndMethodologyIntegrated || PurposeMethodologyMod.default;
} catch (error) {
  console.error("Failed to load PurposeMethodologyComponent:", error);
  PurposeMethodologyComponent = () => <FallbackComponent name="Purpose and Methodology" />;
}

// Functional Status - We found this component exists
let FunctionalStatusComponent;
try {
  const FunctionalStatusMod = require('../sections/5-FunctionalStatus/components/FunctionalStatus.integrated.tsx');
  FunctionalStatusComponent = FunctionalStatusMod.FunctionalStatusIntegrated || FunctionalStatusMod.default;
} catch (error) {
  console.error("Failed to load FunctionalStatusComponent:", error);
  FunctionalStatusComponent = () => <FallbackComponent name="Functional Status" />;
}

// Environmental Assessment - We found this component exists
let EnvironmentalAssessmentComponent;
try {
  const EnvironmentalAssessmentMod = require('../sections/7-EnvironmentalAssessment/components/EnvironmentalAssessment.integrated.tsx');
  EnvironmentalAssessmentComponent = EnvironmentalAssessmentMod.EnvironmentalAssessmentIntegrated || EnvironmentalAssessmentMod.default;
} catch (error) {
  console.error("Failed to load EnvironmentalAssessmentComponent:", error);
  EnvironmentalAssessmentComponent = () => <FallbackComponent name="Environmental Assessment" />;
}

// Activities of Daily Living - We found this component exists
let ActivitiesOfDailyLivingComponent;
try {
  const ActivitiesOfDailyLivingMod = require('../sections/8-ActivitiesOfDailyLiving/components/ActivitiesOfDailyLiving.integrated.tsx');
  ActivitiesOfDailyLivingComponent = ActivitiesOfDailyLivingMod.ActivitiesOfDailyLivingIntegrated || ActivitiesOfDailyLivingMod.default;
} catch (error) {
  console.error("Failed to load ActivitiesOfDailyLivingComponent:", error);
  ActivitiesOfDailyLivingComponent = () => <FallbackComponent name="Activities of Daily Living" />;
}

// Attendant Care - We found this component exists
let AttendantCareComponent;
try {
  const AttendantCareMod = require('../sections/9-AttendantCare/components/AttendantCareSection.integrated.tsx');
  AttendantCareComponent = AttendantCareMod.AttendantCareSectionIntegrated || AttendantCareMod.default;
} catch (error) {
  console.error("Failed to load AttendantCareComponent:", error);
  AttendantCareComponent = () => <FallbackComponent name="Attendant Care" />;
}

// For sections that don't have components, use fallback components
const HousekeepingComponent = () => <FallbackComponent name="Housekeeping Calculator" />;
const AMAGuidesComponent = () => <FallbackComponent name="AMA Guides Assessment" />;

// Define tab labels and component mapping
const sectionTabs = [
  { value: 'initial', label: 'Initial Assessment', component: InitialAssessmentComponent },
  { value: 'purpose', label: 'Purpose & Methodology', component: PurposeMethodologyComponent },
  { value: 'medical', label: 'Medical History', component: MedicalHistoryComponent },
  { value: 'symptoms', label: 'Symptoms Assessment', component: SymptomsComponent },
  { value: 'functional', label: 'Functional Status', component: FunctionalStatusComponent },
  { value: 'typical-day', label: 'Typical Day', component: TypicalDayComponent },
  { value: 'environment', label: 'Environmental Assessment', component: EnvironmentalAssessmentComponent },
  { value: 'adl', label: 'Activities of Daily Living', component: ActivitiesOfDailyLivingComponent },
  { value: 'attendant-care', label: 'Attendant Care', component: AttendantCareComponent },
  { value: 'housekeeping', label: 'Housekeeping Calculator', component: HousekeepingComponent },
  { value: 'ama-guides', label: 'AMA Guides Assessment', component: AMAGuidesComponent },
];

export default function FullAssessment() {
  const router = useRouter();
  // Start with medical history as the default tab
  const [activeTab, setActiveTab] = useState('medical');
  
  // Get assessment context - use only standard context
  const { 
    data, 
    currentAssessmentId, 
    hasUnsavedChanges, 
    saveCurrentAssessment 
  } = useAssessmentContext();
  
  // Add autosave with a simple, direct approach
  useEffect(() => {
    let autosaveInterval;
    
    if (typeof window !== 'undefined') {
      // Create backup immediately on load
      if (currentAssessmentId && data) {
        createBackup(currentAssessmentId, data);
        console.log("Initial backup created");
      }
      
      // Set up autosave
      autosaveInterval = setInterval(() => {
        if (hasUnsavedChanges) {
          console.log("Autosaving...");
          saveCurrentAssessment();
          
          // Create a backup after saving
          if (currentAssessmentId && data) {
            createBackup(currentAssessmentId, data);
            console.log("Autosave backup created");
          }
        }
      }, 10000); // 10 seconds
    }
    
    return () => {
      if (autosaveInterval) {
        clearInterval(autosaveInterval);
      }
    };
  }, [currentAssessmentId, data, hasUnsavedChanges, saveCurrentAssessment]);
  
  // Set the active tab based on the query parameter if provided
  useEffect(() => {
    if (router.query && router.query.section && typeof router.query.section === 'string') {
      const sectionParam = router.query.section;
      // Check if the section exists in our tabs
      if (sectionTabs.some(tab => tab.value === sectionParam)) {
        setActiveTab(sectionParam);
      }
    }
  }, [router.query]);

  // Generate columns based on window width
  const tabsColumns = sectionTabs.length > 6 ? 'grid-cols-3 md:grid-cols-4 lg:grid-cols-6' : 'grid-cols-3';

  // Function to navigate to the main dashboard
  const goToDashboard = () => {
    // Check for unsaved changes before leaving
    if (hasUnsavedChanges) {
      const shouldSave = window.confirm("You have unsaved changes. Would you like to save before leaving?");
      if (shouldSave) {
        saveCurrentAssessment();
      }
    }
    router.push('/');
  };
  
  // Get client name from assessment data
  const getClientName = () => {
    if (data?.demographics?.personalInfo) {
      const { firstName, lastName } = data.demographics.personalInfo;
      if (firstName && lastName) {
        return `${firstName} ${lastName}`;
      }
    }
    return "Unnamed Client";
  };
  
  // Function to navigate to report drafting with current assessment
  const goToReportDrafting = () => {
    // Save current assessment state first
    if (hasUnsavedChanges) {
      saveCurrentAssessment();
    }
    
    // Then navigate to report drafting
    router.push(`/report-drafting?assessment=${currentAssessmentId || 'current'}`);
  };

  // Handle save with backup
  const handleSave = () => {
    console.log("Manual save triggered");
    saveCurrentAssessment();
    
    // Create a backup after saving
    setTimeout(() => {
      if (currentAssessmentId && data) {
        createBackup(currentAssessmentId, data);
        console.log("Manual save backup created");
      }
    }, 500);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            Assessment: {getClientName()}
          </h1>
          {data?.metadata?.created && (
            <p className="text-sm text-muted-foreground">
              Created {new Date(data.metadata.created).toLocaleDateString()}
            </p>
          )}
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            className="flex items-center"
            onClick={handleSave}
            disabled={!hasUnsavedChanges}
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center"
            onClick={goToReportDrafting}
          >
            <FileText className="h-4 w-4 mr-2" />
            Report
          </Button>
          <Link href="/">
            <Button variant="outline" className="flex items-center">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="md:col-span-3">
          <Alert className="bg-blue-50 border-blue-200">
            <InfoIcon className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Assessment in Progress</AlertTitle>
            <AlertDescription className="text-blue-700">
              Navigate through assessment sections using the tabs below. Your progress is automatically saved.
              {hasUnsavedChanges && " You have unsaved changes."}
            </AlertDescription>
          </Alert>
        </div>
        <div className="md:col-span-1">
          <SaveAssessment />
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <CardTitle>Assessment Sections</CardTitle>
          <div>
            <Button 
              variant="default" 
              className="flex items-center bg-blue-600 hover:bg-blue-700"
              onClick={goToReportDrafting}
            >
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className={`grid ${tabsColumns} mb-6 overflow-x-auto`}>
              {sectionTabs.map(tab => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {sectionTabs.map(tab => (
              <TabsContent key={tab.value} value={tab.value} className="pt-2">
                <ErrorBoundary>
                  {React.createElement(tab.component)}
                </ErrorBoundary>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="flex justify-center mt-8">
        <Button 
          variant="default" 
          size="lg"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          onClick={goToDashboard}
        >
          <LayoutDashboard className="h-5 w-5" />
          Back to Main Dashboard
        </Button>
      </div>
    </div>
  );
}
