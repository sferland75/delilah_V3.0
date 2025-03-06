import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { Loader, FileText, Settings, FileOutput, Mail } from 'lucide-react';
import MainNavigation from '@/components/navigation/main';
import { ReportDraftingProvider, useReportDraftingContext } from '@/contexts/ReportDrafting/ReportDraftingContext';
import { useAssessment } from '@/contexts/AssessmentContext';
import TemplateSelection from '@/components/ReportDrafting/TemplateSelection';
import ConfigureReport from '@/components/ReportDrafting/ConfigureReport';
import ReportPreview from '@/components/ReportDrafting/ReportPreview';
import ExportReport from '@/components/ReportDrafting/ExportReport';

function ReportDraftingContent() {
  const router = useRouter();
  const { id } = router.query;
  const { currentAssessmentId, loadAssessmentById } = useAssessment();
  const { 
    activeStep, 
    isLoading, 
    error, 
    resetError,
    selectedTemplate,
    generatedReport
  } = useReportDraftingContext();
  
  const [assessmentLoading, setAssessmentLoading] = useState(false);
  
  // Load assessment if ID is provided
  useEffect(() => {
    const loadAssessment = async () => {
      if (id && typeof id === 'string' && id !== currentAssessmentId) {
        setAssessmentLoading(true);
        try {
          await loadAssessmentById(id);
        } catch (error) {
          console.error(`Failed to load assessment with ID: ${id}`, error);
        } finally {
          setAssessmentLoading(false);
        }
      }
    };
    
    if (id) {
      loadAssessment();
    }
  }, [id, currentAssessmentId, loadAssessmentById]);
  
  if (assessmentLoading) {
    return (
      <div className="flex items-center justify-center h-full p-10">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-lg text-gray-600">Loading assessment data...</p>
        </div>
      </div>
    );
  }
  
  if (!currentAssessmentId) {
    return (
      <div className="p-8">
        <Alert className="mb-6 bg-amber-50 border-amber-200">
          <AlertTitle className="text-amber-800">No Assessment Selected</AlertTitle>
          <AlertDescription className="text-amber-700">
            Please select an assessment before generating a report.
          </AlertDescription>
        </Alert>
        
        <div className="flex justify-center mt-8">
          <Button 
            onClick={() => router.push('/assessment')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Select an Assessment
          </Button>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-8">
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        
        <Button 
          onClick={resetError}
          variant="outline"
        >
          Try Again
        </Button>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <div className="bg-white p-4 rounded-lg mb-6 border">
        <Tabs value={activeStep} className="w-full">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="template-selection" disabled={activeStep !== 'template-selection'}>
              1. Select Template
            </TabsTrigger>
            <TabsTrigger value="configure" disabled={activeStep !== 'configure' && activeStep !== 'template-selection'}>
              2. Configure
            </TabsTrigger>
            <TabsTrigger value="preview" disabled={activeStep !== 'preview' && activeStep !== 'configure' && activeStep !== 'template-selection'}>
              3. Preview & Edit
            </TabsTrigger>
            <TabsTrigger value="export" disabled={activeStep !== 'export' && activeStep !== 'preview' && activeStep !== 'configure' && activeStep !== 'template-selection'}>
              4. Export & Share
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>
            {activeStep === 'template-selection' && 'Select Report Template'}
            {activeStep === 'configure' && 'Configure Report'}
            {activeStep === 'preview' && 'Preview & Edit Report'}
            {activeStep === 'export' && 'Export & Share Report'}
          </CardTitle>
          <CardDescription>
            {activeStep === 'template-selection' && 'Choose a template for your assessment report'}
            {activeStep === 'configure' && 'Customize the sections and details to include'}
            {activeStep === 'preview' && 'Review and edit the generated report content'}
            {activeStep === 'export' && 'Export your report in different formats'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ErrorBoundary>
            {isLoading ? (
              <div className="flex items-center justify-center p-10">
                <Loader className="h-6 w-6 animate-spin mr-2" />
                <span>Loading...</span>
              </div>
            ) : (
              <>
                {activeStep === 'template-selection' && <TemplateSelection />}
                {activeStep === 'configure' && <ConfigureReport />}
                {activeStep === 'preview' && <ReportPreview />}
                {activeStep === 'export' && <ExportReport />}
              </>
            )}
          </ErrorBoundary>
        </CardContent>
      </Card>
      
      {selectedTemplate && activeStep !== 'template-selection' && (
        <div className="mt-4 bg-gray-50 p-4 border rounded-md">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Selected Template:</span> {selectedTemplate.name}
          </p>
          {generatedReport && activeStep === 'export' && (
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-medium">Report ID:</span> {generatedReport.id.substring(0, 8)}...
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function ReportDraftingPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-64 p-4 bg-white border-r">
        <MainNavigation />
      </div>
      
      <div className="flex-1">
        <div className="p-8 border-b bg-white shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Report Drafting</h1>
              <p className="text-gray-600">Generate and customize assessment reports</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Saved Reports
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Templates
              </Button>
            </div>
          </div>
        </div>
        
        <ReportDraftingProvider>
          <ReportDraftingContent />
        </ReportDraftingProvider>
      </div>
    </div>
  );
}
