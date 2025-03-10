import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import LoadAssessment from '@/components/LoadAssessment';
import SaveAssessment from '@/components/SaveAssessment';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { 
  FileText, 
  Clipboard, 
  Bot, 
  ArrowRight, 
  BarChart, 
  FileUp, 
  Pen,
  InfoIcon,
  Clock, 
  Calendar,
  Users,
  FileOutput,
  Download
} from "lucide-react";
import { useAssessmentContext } from "@/contexts/AssessmentContext";
import { useEnhancedAssessment } from "@/contexts/EnhancedAssessmentContext";

// Function to export field trial data
function exportFieldTrialData() {
  try {
    // Get feedback data
    const feedback = localStorage.getItem('delilah_feedback') || '[]';
    
    // Get analytics data
    const events = localStorage.getItem('delilah_analytics_events') || '[]';
    const errors = localStorage.getItem('delilah_analytics_errors') || '[]';
    
    // Combine into one object
    const exportData = {
      feedback: JSON.parse(feedback),
      analytics: {
        events: JSON.parse(events),
        errors: JSON.parse(errors)
      },
      exportDate: new Date().toISOString(),
      userAgent: navigator.userAgent
    };
    
    // Create downloadable file
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `delilah_field_trial_data_${Date.now()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  } catch (error) {
    console.error("Error exporting field trial data:", error);
    alert("An error occurred while exporting field trial data. Please try again.");
  }
}

export default function Dashboard() {
  // Check if we're in field trial mode
  const isFieldTrial = process.env.NEXT_PUBLIC_FIELD_TRIAL === 'true';
  
  // Use either the regular or enhanced assessment context based on the mode
  const { currentAssessmentId: regularId, data: regularData } = useAssessmentContext();
  const [enhancedAssessment, setEnhancedAssessment] = useState<any>(null);
  
  // Try to get the enhanced assessment context if in field trial mode
  useEffect(() => {
    if (isFieldTrial) {
      try {
        const { currentAssessmentId, data } = useEnhancedAssessment();
        setEnhancedAssessment({ currentAssessmentId, data });
      } catch (error) {
        console.error("Error accessing enhanced assessment context:", error);
      }
    }
  }, [isFieldTrial]);
  
  // Use the appropriate context data
  const currentAssessmentId = isFieldTrial && enhancedAssessment 
    ? enhancedAssessment.currentAssessmentId 
    : regularId;
    
  const data = isFieldTrial && enhancedAssessment 
    ? enhancedAssessment.data 
    : regularData;

  // Get client name from assessment data
  const getClientName = () => {
    if (data?.demographics?.personalInfo) {
      const { firstName, lastName } = data.demographics.personalInfo;
      if (firstName && lastName) {
        return `${firstName} ${lastName}`;
      }
    }
    return currentAssessmentId ? "Unnamed Client" : null;
  };

  const clientName = getClientName();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-2">
          Delilah V3.0
          {isFieldTrial && <span className="ml-2 text-sm bg-blue-500 text-white px-2 py-1 rounded">Field Trial</span>}
        </h1>
        <p className="text-xl text-muted-foreground">
          Comprehensive Assessment Platform for Occupational Therapists
        </p>
      </div>

      {currentAssessmentId && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <InfoIcon className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Active Assessment: {clientName}</AlertTitle>
          <AlertDescription className="text-green-700">
            Assessment data is loaded and ready. You can continue editing the assessment or generate a report.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-2xl font-semibold mb-6">Assessment Management</h2>
          <div className="grid gap-6">
            <LoadAssessment />
            <SaveAssessment />
            
            {/* Progress tracking (Only shown in field trial) */}
            {isFieldTrial && currentAssessmentId && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Assessment Progress</CardTitle>
                  <CardDescription>
                    Track your progress through the assessment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProgressIndicator showDetailedBreakdown={true} />
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-6">Quick Access</h2>
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Continue Current Assessment</CardTitle>
                <CardDescription>
                  Pick up where you left off with the current assessment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/full-assessment">
                    <Button variant="outline" className="w-full flex items-center justify-center">
                      <Clipboard className="h-4 w-4 mr-2" />
                      Full Assessment
                    </Button>
                  </Link>
                  <Link href="/report-drafting">
                    <Button variant="outline" className="w-full flex items-center justify-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Report Drafting
                    </Button>
                  </Link>
                  <Link href="/import-pdf">
                    <Button variant="outline" className="w-full flex items-center justify-center">
                      <FileUp className="h-4 w-4 mr-2" />
                      Import PDF
                    </Button>
                  </Link>
                  <Link href="/assessment-sections">
                    <Button variant="outline" className="w-full flex items-center justify-center">
                      <Pen className="h-4 w-4 mr-2" />
                      Section Editor
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Common Sections</CardTitle>
                <CardDescription>
                  Quickly access frequently used assessment sections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/medical-full">
                    <Button variant="outline" className="w-full flex items-center justify-center">
                      <Users className="h-4 w-4 mr-2" />
                      Medical History
                    </Button>
                  </Link>
                  <Link href="/emergency-symptoms">
                    <Button variant="outline" className="w-full flex items-center justify-center">
                      <BarChart className="h-4 w-4 mr-2" />
                      Symptoms Assessment
                    </Button>
                  </Link>
                  <Link href="/typical-day">
                    <Button variant="outline" className="w-full flex items-center justify-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Typical Day
                    </Button>
                  </Link>
                  <Link href="/full-assessment?section=attendant-care">
                    <Button variant="outline" className="w-full flex items-center justify-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Attendant Care
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Assessment Workflow</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <FileUp className="h-5 w-5 text-blue-600 mr-2" />
                <span>1. Import Documents</span>
              </CardTitle>
              <CardDescription>
                Start by importing and extracting data from existing documents
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-3">
              <ul className="space-y-2 text-sm">
                <li className="flex">
                  <ArrowRight className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Upload PDF documents (medical records, previous assessments)</span>
                </li>
                <li className="flex">
                  <ArrowRight className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Automatic data extraction with pattern recognition</span>
                </li>
                <li className="flex">
                  <ArrowRight className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Review and validate extracted information</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/import-pdf" className="w-full">
                <Button className="w-full">Start Import</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <Clipboard className="h-5 w-5 text-purple-600 mr-2" />
                <span>2. Complete Assessment</span>
              </CardTitle>
              <CardDescription>
                Fill in assessment sections and validate data
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-3">
              <ul className="space-y-2 text-sm">
                <li className="flex">
                  <ArrowRight className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Enter information across all assessment sections</span>
                </li>
                <li className="flex">
                  <ArrowRight className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Get AI-powered suggestions for missing information</span>
                </li>
                <li className="flex">
                  <ArrowRight className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Review cross-section validation checks</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/full-assessment" className="w-full">
                <Button className="w-full">Continue Assessment</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <FileOutput className="h-5 w-5 text-green-600 mr-2" />
                <span>3. Generate Report</span>
              </CardTitle>
              <CardDescription>
                Create professional reports based on assessment data
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-3">
              <ul className="space-y-2 text-sm">
                <li className="flex">
                  <ArrowRight className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Select from customizable report templates</span>
                </li>
                <li className="flex">
                  <ArrowRight className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Review AI-generated sections with supporting evidence</span>
                </li>
                <li className="flex">
                  <ArrowRight className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Export in multiple formats (PDF, Word, HTML)</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/report-drafting" className="w-full">
                <Button className="w-full">Draft Report</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Intelligence Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-base">
                <Bot className="h-5 w-5 text-blue-600 mr-2" />
                Data Extraction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Intelligent pattern recognition to extract data from existing documents
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-base">
                <BarChart className="h-5 w-5 text-green-600 mr-2" />
                Missing Info Detection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Identify critical missing information with importance ratings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-base">
                <Bot className="h-5 w-5 text-purple-600 mr-2" />
                Content Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                AI-powered suggestions for improving assessment content
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-base">
                <FileText className="h-5 w-5 text-amber-600 mr-2" />
                Report Drafting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Generate professional reports with supporting evidence
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Field Trial Export Button - Only in field trial mode */}
      {isFieldTrial && (
        <div className="mt-12 border-t pt-8">
          <h2 className="text-2xl font-semibold mb-6">Field Trial Tools</h2>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-base">
                <Download className="h-5 w-5 text-blue-600 mr-2" />
                Export Field Trial Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Export all feedback and analytics data collected during the field trial for analysis.
              </p>
              <Button onClick={exportFieldTrialData}>
                Export Data
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
