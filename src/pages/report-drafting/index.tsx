import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { FileText, BookOpen, Clipboard, ArrowRight, AlertTriangle } from 'lucide-react';
import { useAssessmentContext } from '@/contexts/AssessmentContext';

export default function ReportDraftingIndex() {
  const router = useRouter();
  const { data, currentAssessmentId, hasUnsavedChanges, saveCurrentAssessment } = useAssessmentContext();
  
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
  
  // Handle create report click
  const handleCreateReport = () => {
    // Check if we have unsaved changes
    if (hasUnsavedChanges) {
      // Save assessment first
      saveCurrentAssessment();
    }
    
    // Navigate to report generation page
    router.push('/report-drafting/generate');
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-800">Report Drafting</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Create professional assessment reports with intelligent content suggestions.
        </p>
      </div>
      
      {currentAssessmentId ? (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md flex justify-between items-center">
          <div>
            <p className="font-medium text-blue-800">Current Assessment: {getClientName()}</p>
            <p className="text-sm text-blue-700 mt-1">
              {data?.metadata?.created && `Created: ${new Date(data.metadata.created).toLocaleDateString()}`}
            </p>
          </div>
          <Button 
            variant="outline" 
            className="bg-white text-blue-600 border-blue-300 hover:bg-blue-50"
            onClick={() => router.push('/full-assessment')}
          >
            Edit Assessment
          </Button>
        </div>
      ) : (
        <Alert variant="warning" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>No Active Assessment</AlertTitle>
          <AlertDescription>
            You need to load or create an assessment before generating a report.
            <div className="mt-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push('/')}
              >
                Go to Dashboard
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              New Report
            </CardTitle>
            <CardDescription>
              Create a new report from existing assessment data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Generate a comprehensive report using data from completed assessments
              with intelligent content suggestions.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full"
              onClick={handleCreateReport}
              disabled={!currentAssessmentId}
            >
              Create New Report
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-green-600" />
              Templates
            </CardTitle>
            <CardDescription>
              Manage and use report templates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Create, modify, and use report templates to ensure consistency
              across different types of assessments.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled>
              Coming Soon
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clipboard className="h-5 w-5 text-purple-600" />
              Recent Reports
            </CardTitle>
            <CardDescription>
              View and edit recently created reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Access your recently created reports for review, editing,
              or use as a basis for new assessments.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled>
              Coming Soon
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-8 bg-blue-50 p-4 rounded-md border border-blue-200">
        <h3 className="font-medium text-blue-800">Tips for effective reports:</h3>
        <ul className="mt-2 space-y-1 text-sm text-blue-700 list-disc pl-5">
          <li>Complete all assessment sections for the most comprehensive report</li>
          <li>Review AI-suggested content carefully before finalizing</li>
          <li>Use templates for consistent formatting across reports</li>
          <li>Save drafts frequently during the report creation process</li>
        </ul>
      </div>
      
      {!currentAssessmentId && (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => router.push('/')}
            className="w-full sm:w-auto"
          >
            Return to Dashboard
          </Button>
        </div>
      )}
    </div>
  );
}
