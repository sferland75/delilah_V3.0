"use client";

/**
 * Referral Integration Testing Page
 * 
 * This page allows developers to test the referral document integration
 * without affecting production data.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

// Import the components we want to test
import ReferralImport from '@/pages/import/ReferralImport';
import ReferralContext from '@/components/referral/ReferralContext';

// Mock test data
const SAMPLE_REFERRAL_DATA = {
  referral: {
    client: {
      name: "Dalal Farhan",
      dateOfBirth: "March 14, 1971",
      dateOfLoss: "January 1, 2023",
      fileNumber: "213182",
      language: "Arabic",
      phoneNumbers: ["613-890-3312", "613-882-3312"],
      address: "1328 Labrie Avenue, Gloucester, ON K1B 3M1",
      email: "Alienad1688@gmail.com"
    },
    assessmentTypes: [
      "In-home assessment",
      "situational assessment",
      "Attendant Care Needs assessment"
    ],
    reportTypes: [
      { number: "1", description: "CAT - Criterion 8: Mental/Behavioural Impairment" },
      { number: "2", description: "Attendant Care Needs" }
    ],
    specificRequirements: [
      "Mental/Behavioural Impairment – provide functional data related to these four domains"
    ],
    criteria: ["8"],
    domains: [
      "ADLS", 
      "Social Functioning", 
      "Concentration/Persistence/Pace", 
      "Adaptation"
    ],
    appointments: [
      {
        assessor: "Sebastien Ferland",
        type: "Occupational Therapy Assessment - Situational",
        location: "Client's Home: 1328 Labrie Avenue, Gloucester, ON K1B 3M1",
        dateTime: "February 10, 2025 9:30 AM",
        duration: "1:30 PM"
      },
      {
        assessor: "Sebastien Ferland",
        type: "Assessment In-Home & Attendant Care Needs",
        location: "Client's Home: 1328 Labrie Avenue, Gloucester, ON K1B 3M1",
        dateTime: "February 11, 2025 9:30 AM",
        duration: "1:30 PM"
      }
    ],
    reportDueDate: "February 26, 2025",
    reportGuidelines: [
      "CAT reports are due within 5 business days of your completed assessment",
      "ACN and Med Legal reports are due within 10 business days of your completed assessment",
      "Please use the attached report templates and modify to suit your needs"
    ],
    referralSource: {
      organization: "Omega Medical Associates",
      contactPerson: "Angelica McClimond",
      contactInfo: "angelica@omegamedical.ca"
    }
  },
  confidence: {
    CLIENT_INFO: 0.9,
    ASSESSMENT_REQUIREMENTS: 0.85,
    SCHEDULING_INFO: 0.8,
    REPORTING_REQUIREMENTS: 0.75,
    REFERRAL_SOURCE: 0.9
  }
};

export default function ReferralIntegrationTest() {
  const { toast } = useToast();
  const [testMode, setTestMode] = useState<'import' | 'display'>('import');
  const [assessmentData, setAssessmentData] = useState<any>(null);
  
  // Mock assessment context
  const mockAssessmentContext = {
    data: assessmentData || {},
    updateReferral: (data: any) => {
      setAssessmentData(data);
      toast({
        title: "Referral data updated",
        description: "The referral data has been updated in the test context."
      });
    }
  };
  
  const loadSampleData = () => {
    setAssessmentData(SAMPLE_REFERRAL_DATA);
    toast({
      title: "Sample data loaded",
      description: "Sample referral data has been loaded for testing."
    });
  };
  
  const clearData = () => {
    setAssessmentData(null);
    toast({
      title: "Data cleared",
      description: "Test data has been cleared."
    });
  };
  
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-2">Referral Integration Testing</h1>
      <p className="text-muted-foreground mb-6">
        Use this page to test the referral document integration components
      </p>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Test Controls</CardTitle>
          <CardDescription>Configure how you want to test the integration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <Button 
              variant={testMode === 'import' ? 'default' : 'outline'}
              onClick={() => setTestMode('import')}
            >
              Test Import
            </Button>
            <Button 
              variant={testMode === 'display' ? 'default' : 'outline'}
              onClick={() => setTestMode('display')}
            >
              Test Display
            </Button>
          </div>
          
          <Separator />
          
          <div className="flex space-x-4">
            <Button onClick={loadSampleData}>
              Load Sample Data
            </Button>
            <Button variant="destructive" onClick={clearData}>
              Clear Data
            </Button>
          </div>
          
          {assessmentData && (
            <div className="bg-muted p-4 rounded">
              <p className="font-medium mb-2">Current Test Data:</p>
              <p className="text-sm text-muted-foreground">
                Client: {assessmentData.referral.client.name || 'None'}<br />
                File: {assessmentData.referral.client.fileNumber || 'None'}<br />
                Reports: {assessmentData.referral.reportTypes?.length || 0} configured
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">
          {testMode === 'import' ? 'Testing Referral Import' : 'Testing Referral Display'}
        </h2>
        
        {testMode === 'import' && (
          <div className="mock-context">
            {/* Wrap in a provider context for testing */}
            <div className="assessment-context-provider">
              <ReferralImport />
            </div>
          </div>
        )}
        
        {testMode === 'display' && (
          <div className="mock-context">
            {/* Pass mock context data */}
            <div className="assessment-context-provider">
              {/* Override the context with our test data */}
              <div className="assessment-context-override" style={{ display: 'none' }}>
                {JSON.stringify(mockAssessmentContext)}
              </div>
              <ReferralContext />
            </div>
            
            {!assessmentData && (
              <div className="mt-4 p-4 bg-muted rounded">
                <p className="text-center text-muted-foreground">
                  No referral data loaded. Use the "Load Sample Data" button above to test display.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Testing Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="import">
            <TabsList>
              <TabsTrigger value="import">Import Testing</TabsTrigger>
              <TabsTrigger value="display">Display Testing</TabsTrigger>
              <TabsTrigger value="integration">Integration Testing</TabsTrigger>
            </TabsList>
            
            <TabsContent value="import" className="space-y-4 pt-4">
              <h3 className="text-lg font-medium">Testing the Import Component</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Select "Test Import" from the controls above</li>
                <li>Upload one of the sample referral documents</li>
                <li>Verify that the document is processed correctly</li>
                <li>Check that client information is extracted accurately</li>
                <li>Verify that requirements are parsed correctly</li>
                <li>Inspect confidence scores to ensure they're reasonable</li>
                <li>Test the "Import Referral" button</li>
              </ol>
            </TabsContent>
            
            <TabsContent value="display" className="space-y-4 pt-4">
              <h3 className="text-lg font-medium">Testing the Display Component</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Select "Test Display" from the controls above</li>
                <li>Click "Load Sample Data" to load test data</li>
                <li>Verify that the ReferralContext component displays all tabs</li>
                <li>Check that client information is displayed correctly</li>
                <li>Verify that assessment requirements are visible</li>
                <li>Test the scheduling and reporting tabs</li>
                <li>Click "Clear Data" to test the empty state</li>
              </ol>
            </TabsContent>
            
            <TabsContent value="integration" className="space-y-4 pt-4">
              <h3 className="text-lg font-medium">Testing Full Integration</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Start with "Test Import" mode</li>
                <li>Upload a referral document and import it</li>
                <li>Switch to "Test Display" mode</li>
                <li>Verify that the imported data appears in the display component</li>
                <li>Check cross-component data consistency</li>
                <li>Test multiple imports to ensure data updates correctly</li>
              </ol>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}