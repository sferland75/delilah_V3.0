'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { IntelligenceSummary } from '@/components/intelligence/IntelligenceSummary';
import { 
  FileText, 
  ClipboardList, 
  FileOutput,
  ArrowRight,
  FileUp,
  ListChecks,
  Users,
  Calendar,
  FileQuestion 
} from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-center">Delilah V3.0</h1>
          <p className="text-muted-foreground text-center">In-Home Assessment and Report System</p>
          <p className="text-center max-w-2xl mx-auto">
            A comprehensive system for importing medical documents, conducting structured assessments, 
            and generating detailed reports with intelligent assistance.
          </p>
        </div>
        
        {/* Workflow Section */}
        <div className="bg-slate-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-6">Integrated Assessment Workflow</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <FileUp className="h-5 w-5" />
                  <span>1. Import Documents</span>
                </CardTitle>
                <CardDescription>
                  Upload medical documents to extract data
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm">
                Upload PDFs and use pattern recognition to extract structured data automatically.
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700" 
                  onClick={() => router.push('/import/assessment')}
                >
                  Start with Document Import
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  <span>2. Complete Assessment</span>
                </CardTitle>
                <CardDescription>
                  Fill out structured assessment forms
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm">
                Complete assessment sections with pre-populated data from imports or start fresh.
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => router.push('/assessment/initial')}
                >
                  Go to Assessment
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-purple-200 bg-purple-50">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <FileOutput className="h-5 w-5" />
                  <span>3. Generate Reports</span>
                </CardTitle>
                <CardDescription>
                  Create professional reports
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm">
                Generate comprehensive reports with intelligent content suggestions based on your assessment.
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  onClick={() => router.push('/report-drafting')}
                >
                  Create Reports
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="mt-4 flex justify-center">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => router.push('/integrated-workflow')}
            >
              <span>View Complete Workflow</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Quick Access */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <ListChecks className="h-4 w-4" />
                  <span>Active Assessments</span>
                </CardTitle>
              </CardHeader>
              <CardFooter className="pt-2">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.push('/assessment/initial')}
                >
                  View Active
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Patient Directory</span>
                </CardTitle>
              </CardHeader>
              <CardFooter className="pt-2">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.push('/patients')}
                >
                  View Patients
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Recent Reports</span>
                </CardTitle>
              </CardHeader>
              <CardFooter className="pt-2">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.push('/report-drafting')}
                >
                  View Reports
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileQuestion className="h-4 w-4" />
                  <span>Templates</span>
                </CardTitle>
              </CardHeader>
              <CardFooter className="pt-2">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.push('/templates')}
                >
                  View Templates
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
        
        {/* Development Options */}
        <Alert className="bg-amber-50 border-amber-200">
          <AlertTitle>Development Options</AlertTitle>
          <AlertDescription>
            <p className="mb-2">These options are available during development:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => router.push('/full-access')}
              >
                Full Assessment (Static)
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => router.push('/direct')}
              >
                Direct Component Access
              </Button>
            </div>
          </AlertDescription>
        </Alert>
        
        {/* Intelligence Features */}
        <Card>
          <CardHeader>
            <CardTitle>Intelligence Features</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              The intelligence features provide real-time insights and suggestions to improve the 
              quality of your assessments. As you complete assessment sections, you'll see suggestions 
              and validation warnings here.
            </p>
            
            <div className="mt-4 p-6 border border-dashed border-muted-foreground/20 rounded-md text-center">
              <p className="text-muted-foreground">
                Intelligence features will appear here as you complete assessment sections.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
