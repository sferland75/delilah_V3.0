import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ErrorBoundary } from '@/components/ui/error-boundary/error-boundary';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { InfoIcon, Home, LayoutDashboard, Save, Loader, PenTool } from 'lucide-react';
import MainNavigation from '@/components/navigation/main';
import { useAssessment } from '@/contexts/AssessmentContext';
import { useToast } from "@/components/ui/use-toast";
import { getAllAssessments } from '@/services/assessment-storage-service';

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
// Update paths from '@/sections/' to '@/sections/' to use our path alias

// Symptoms Assessment
let SymptomsComponent;
try {
  const SymptomsMod = require('@/sections/4-SymptomsAssessment/components/SymptomsAssessment.integrated.final.tsx');
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
    const MedicalHistoryMod = require('@/sections/3-MedicalHistory/components/MedicalHistory.integrated.tsx');
    MedicalHistoryComponent = MedicalHistoryMod.MedicalHistoryIntegrated || MedicalHistoryMod.default;
  } catch (e) {
    // Fallback to direct access version if available
    const MedicalHistoryMod = require('@/sections/3-MedicalHistory/components/MedicalHistory.direct-access.tsx');
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
  const TypicalDayMod = require('@/sections/6-TypicalDay/components/TypicalDay.integrated.final.tsx');
  TypicalDayComponent = TypicalDayMod.TypicalDayIntegratedFinal || TypicalDayMod.default;
} catch (error) {
  console.error("Failed to load TypicalDayComponent:", error);
  TypicalDayComponent = () => <FallbackComponent name="Typical Day" />;
}

// Initial Assessment - Use the updated Demographics component
let InitialAssessmentComponent;
try {
  // Import the Demographics component that we've updated
  const DemographicsMod = require('@/sections/1-InitialAssessment/components/Demographics.tsx');
  InitialAssessmentComponent = DemographicsMod.Demographics || DemographicsMod.default;
  
  // Log the component to verify it loaded correctly
  console.log("Loaded Demographics component:", InitialAssessmentComponent);
} catch (error) {
  console.error("Failed to load InitialAssessmentComponent:", error);
  InitialAssessmentComponent = () => <FallbackComponent name="Initial Assessment" />;
}

// Purpose and Methodology
let PurposeMethodologyComponent;
try {
  const PurposeMethodologyMod = require('@/sections/2-PurposeAndMethodology/components/PurposeAndMethodology.integrated.tsx');
  PurposeMethodologyComponent = PurposeMethodologyMod.PurposeAndMethodologyIntegrated || PurposeMethodologyMod.default;
} catch (error) {
  console.error("Failed to load PurposeMethodologyComponent:", error);
  PurposeMethodologyComponent = () => <FallbackComponent name="Purpose and Methodology" />;
}

// Functional Status - Use the Redux version instead
let FunctionalStatusComponent;
try {
  // Use the Redux version of the Functional Status component
  const FunctionalStatusMod = require('@/sections/5-FunctionalStatus/FunctionalStatus.redux.tsx');
  FunctionalStatusComponent = FunctionalStatusMod.default;
  console.log("Successfully loaded FunctionalStatusComponent:", FunctionalStatusComponent);
} catch (error) {
  console.error("Failed to load FunctionalStatusComponent:", error);
  FunctionalStatusComponent = () => <FallbackComponent name="Functional Status" />;
}

// Environmental Assessment - We found this component exists
let EnvironmentalAssessmentComponent;
try {
  const EnvironmentalAssessmentMod = require('@/sections/7-EnvironmentalAssessment/components/EnvironmentalAssessment.integrated.tsx');
  EnvironmentalAssessmentComponent = EnvironmentalAssessmentMod.EnvironmentalAssessmentIntegrated || EnvironmentalAssessmentMod.default;
} catch (error) {
  console.error("Failed to load EnvironmentalAssessmentComponent:", error);
  EnvironmentalAssessmentComponent = () => <FallbackComponent name="Environmental Assessment" />;
}

// Activities of Daily Living - We found this component exists
let ActivitiesOfDailyLivingComponent;
try {
  const ActivitiesOfDailyLivingMod = require('@/sections/8-ActivitiesOfDailyLiving/components/ActivitiesOfDailyLiving.integrated.tsx');
  ActivitiesOfDailyLivingComponent = ActivitiesOfDailyLivingMod.ActivitiesOfDailyLivingIntegrated || ActivitiesOfDailyLivingMod.default;
} catch (error) {
  console.error("Failed to load ActivitiesOfDailyLivingComponent:", error);
  ActivitiesOfDailyLivingComponent = () => <FallbackComponent name="Activities of Daily Living" />;
}

// Attendant Care - We found this component exists
let AttendantCareComponent;
try {
  const AttendantCareMod = require('@/sections/9-AttendantCare/components/AttendantCareSection.integrated.tsx');
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
  const { section, id } = router.query;
  const { toast } = useToast();
  const { 
    currentAssessmentId, 
    loadAssessmentById, 
    saveCurrentAssessment, 
    hasUnsavedChanges, 
    createAssessment, 
    data 
  } = useAssessment();
  
  // Use a ref to track if we've already loaded an assessment
  const hasLoadedRef = useRef(false);
  
  // Start with initial assessment as the default tab
  const [activeTab, setActiveTab] = useState('initial');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(null);
  const [clientDisplayName, setClientDisplayName] = useState('Unnamed Client');
  
  // Load assessment when component mounts or ID changes
  useEffect(() => {
    const loadAssessment = async () => {
      // Prevent re-loading if we've already loaded this assessment
      if (hasLoadedRef.current && ((id && currentAssessmentId === id) || (!id && currentAssessmentId))) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      try {
        if (id && typeof id === 'string') {
          // Load specified assessment
          console.log(`Loading assessment with ID: ${id}`);
          const success = await loadAssessmentById(id);
          if (!success) {
            console.error(`Failed to load assessment with ID: ${id}`);
            // Create a new assessment as fallback
            createAssessment();
          } else {
            console.log(`Successfully loaded assessment with ID: ${id}`);
            console.log("Assessment data:", data);
            
            // Check if there's a client name stored in local storage
            const assessments = getAllAssessments();
            const currentAssessment = assessments.find(a => a.id === id);
            if (currentAssessment && currentAssessment.clientName && currentAssessment.clientName !== 'Untitled') {
              console.log("Found client name in storage:", currentAssessment.clientName);
              // Parse the clientName to ensure we display it correctly
              let displayName = currentAssessment.clientName;
              // If the name is in "Last, First" format, convert it to "First Last"
              if (displayName.includes(',')) {
                const parts = displayName.split(',');
                if (parts.length === 2) {
                  displayName = `${parts[1].trim()} ${parts[0].trim()}`;
                }
              }
              setClientDisplayName(displayName);
            }
          }
        } else if (!currentAssessmentId) {
          // Create a new assessment if none is loaded
          console.log("Creating new assessment");
          createAssessment();
        }
        
        // Mark that we've loaded the assessment
        hasLoadedRef.current = true;
      } catch (error) {
        console.error("Error loading assessment:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAssessment();
  }, [id, loadAssessmentById, currentAssessmentId, createAssessment, data]);

  // Update client name whenever demographics data changes
  useEffect(() => {
    const updateClientName = () => {
      // First check if we already have a name in the context data
      if (data?.demographics?.personalInfo?.firstName || data?.demographics?.personalInfo?.lastName) {
        const firstName = data.demographics.personalInfo.firstName || '';
        const lastName = data.demographics.personalInfo.lastName || '';
        
        if (firstName || lastName) {
          const displayName = `${firstName} ${lastName}`.trim();
          console.log("Setting client name from context data:", displayName);
          setClientDisplayName(displayName);
          return;
        }
      }
      
      // If not found in context, check stored assessments
      if (currentAssessmentId) {
        const assessments = getAllAssessments();
        const currentAssessment = assessments.find(a => a.id === currentAssessmentId);
        
        if (currentAssessment && currentAssessment.clientName && currentAssessment.clientName !== 'Untitled') {
          console.log("Setting client name from storage:", currentAssessment.clientName);
          
          // Parse the clientName to ensure we display it correctly
          let displayName = currentAssessment.clientName;
          // If the name is in "Last, First" format, convert it to "First Last"
          if (displayName.includes(',')) {
            const parts = displayName.split(',');
            if (parts.length === 2) {
              displayName = `${parts[1].trim()} ${parts[0].trim()}`;
            }
          }
          setClientDisplayName(displayName);
          return;
        }
      }
    };
    
    updateClientName();
  }, [data, data.demographics, currentAssessmentId]);
  
  // Set the active tab based on the query parameter if provided
  useEffect(() => {
    if (section && typeof section === 'string') {
      const sectionParam = section;
      // Check if the section exists in our tabs
      if (sectionTabs.some(tab => tab.value === sectionParam)) {
        setActiveTab(sectionParam);
      }
    }
  }, [section]);
  
  // Handle tab change
  const handleTabChange = (value) => {
    console.log(`Changing to tab: ${value}`);
    setActiveTab(value);
    
    // Update URL without full navigation
    const newPath = id 
      ? `/full-assessment?section=${value}&id=${id}` 
      : `/full-assessment?section=${value}`;
      
    router.push(newPath, undefined, { shallow: true });
  };
  
  // Handle save button click
  const handleSave = async () => {
    if (!currentAssessmentId) {
      console.error("No assessment loaded to save");
      toast({
        title: "Cannot Save",
        description: "No assessment is currently active.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSaving(true);
    setSaveSuccess(null);
    
    try {
      console.log("Attempting to save from main save button");
      const success = saveCurrentAssessment();
      
      if (success) {
        console.log("Save successful from main button");
        setSaveSuccess(true);
        
        // Update client name after save
        const assessments = getAllAssessments();
        const freshAssessment = assessments.find(a => a.id === currentAssessmentId);
        if (freshAssessment && freshAssessment.clientName && freshAssessment.clientName !== 'Untitled') {
          console.log("Updating client name after save:", freshAssessment.clientName);
          
          // Parse the clientName to ensure we display it correctly
          let displayName = freshAssessment.clientName;
          // If the name is in "Last, First" format, convert it to "First Last"
          if (displayName.includes(',')) {
            const parts = displayName.split(',');
            if (parts.length === 2) {
              displayName = `${parts[1].trim()} ${parts[0].trim()}`;
            }
          }
          setClientDisplayName(displayName);
        }
        
        // Update success message after save
        toast({
          title: "Assessment Saved",
          description: "Your assessment has been saved successfully.",
          variant: "success"
        });
        
        // Force page refresh to ensure the title updates
        if (data?.demographics?.personalInfo?.firstName || data?.demographics?.personalInfo?.lastName) {
          setTimeout(() => {
            // Refresh page to update title
            router.replace(router.asPath);
          }, 500);
        }
        
        // Clear success message after 3 seconds
        setTimeout(() => setSaveSuccess(null), 3000);
      } else {
        console.error("Save unsuccessful from main button");
        setSaveSuccess(false);
        toast({
          title: "Save Failed",
          description: "Failed to save assessment. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error saving assessment:", error);
      setSaveSuccess(false);
      toast({
        title: "Error Saving Assessment",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Generate columns based on window width
  const tabsColumns = sectionTabs.length > 6 ? 'grid-cols-3 md:grid-cols-4 lg:grid-cols-6' : 'grid-cols-3';

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <div className="w-64 p-4 bg-white border-r">
          <MainNavigation />
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-xl">Loading assessment...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-64 p-4 bg-white border-r">
        <MainNavigation />
      </div>
      
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Full Assessment: {clientDisplayName}</h1>
            <p className="text-gray-600 text-sm">
              {currentAssessmentId ? `ID: ${currentAssessmentId}` : 'New Assessment'}
            </p>
          </div>
          <div className="flex space-x-3">
            {hasUnsavedChanges && (
              <Alert className="py-2 px-3 h-10 flex items-center bg-amber-50 border-amber-200">
                <span className="text-amber-800 text-sm">Unsaved changes</span>
              </Alert>
            )}
            
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save
                </>
              )}
            </Button>
            
            <Link href="/assessment">
              <Button variant="outline" className="flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                Assessment List
              </Button>
            </Link>
          </div>
        </div>
        
        {saveSuccess === true && (
          <Alert className="mb-4 bg-green-50 border-green-200">
            <AlertTitle className="text-green-800">Saved Successfully</AlertTitle>
            <AlertDescription className="text-green-700">
              Your assessment has been saved successfully.
            </AlertDescription>
          </Alert>
        )}
        
        {saveSuccess === false && (
          <Alert className="mb-4 bg-red-50 border-red-200" variant="destructive">
            <AlertTitle>Save Failed</AlertTitle>
            <AlertDescription>
              There was an error saving your assessment. Please try again.
            </AlertDescription>
          </Alert>
        )}
        
        <Card className="mb-6">
          <CardContent className="p-0">
            <Tabs 
              value={activeTab} 
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList className={`grid ${tabsColumns} p-2 bg-white border-b rounded-none overflow-x-auto`}>
                {sectionTabs.map(tab => (
                  <TabsTrigger 
                    key={tab.value} 
                    value={tab.value}
                    className="rounded-md"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {sectionTabs.map(tab => (
                <TabsContent key={tab.value} value={tab.value} className="p-6">
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
            variant="outline" 
            size="lg"
            className="flex items-center gap-2"
            onClick={() => router.push('/report-drafting')}
          >
            <PenTool className="h-5 w-5" />
            Proceed to Report Drafting
          </Button>
        </div>
      </div>
    </div>
  );
}
