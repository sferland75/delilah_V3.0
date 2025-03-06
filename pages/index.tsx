import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, FileText, Activity, ClipboardList, Calendar, MapPin, 
  Heart, UserPlus, Clock, Calculator, PenTool, Upload,
  Calendar as CalendarIcon, Settings, Users, Brain
} from 'lucide-react';
import { useAssessment } from '@/contexts/AssessmentContext';
import { getAllAssessments } from '@/services/assessment-storage-service';

// Workflow card component for dashboard
function WorkflowCard({ title, description, icon, href, accentColor = "blue" }) {
  const router = useRouter();
  
  return (
    <Card 
      className={`hover:shadow-md transition-shadow cursor-pointer border-t-4 border-${accentColor}-500`}
      onClick={() => router.push(href)}
    >
      <CardContent className="pt-6">
        <div className="text-center mb-4">
          {icon}
        </div>
        <h3 className="text-lg font-medium text-center mb-2">{title}</h3>
        <p className="text-sm text-gray-500 text-center">{description}</p>
      </CardContent>
    </Card>
  );
}

// Quick access card component
function QuickAccessCard({ title, href, icon, count = null }) {
  return (
    <Link href={href} passHref>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-4 bg-blue-100 p-2 rounded-full">{icon}</div>
            <div>
              <h3 className="font-medium">{title}</h3>
            </div>
          </div>
          {count !== null && (
            <Badge variant="outline">{count}</Badge>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { createAssessment } = useAssessment();
  const [recentAssessments, setRecentAssessments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    loadAssessments();
  }, []);
  
  const loadAssessments = () => {
    setIsLoading(true);
    try {
      const allAssessments = getAllAssessments();
      // Sort by last modified date and take the most recent 5
      const sorted = allAssessments
        .sort((a, b) => new Date(b.lastSaved) - new Date(a.lastSaved))
        .slice(0, 5);
      
      setRecentAssessments(sorted);
    } catch (error) {
      console.error("Error loading assessments:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateNew = () => {
    try {
      const newId = createAssessment();
      router.push(`/full-assessment?id=${newId}`);
    } catch (error) {
      console.error("Error creating assessment:", error);
      alert("Could not create a new assessment. Please try again.");
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Delilah Assessment Platform</h1>
          <p className="text-gray-600">
            Comprehensive assessment system with intelligent report drafting
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button 
            onClick={handleCreateNew}
            className="bg-blue-600 hover:bg-blue-700"
          >
            New Assessment
          </Button>
        </div>
      </div>
      
      {/* Main workflow section */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-6">Assessment Workflow</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <WorkflowCard 
            title="Import Data"
            description="Import client data from referrals and PDF documents"
            icon={<Upload className="h-12 w-12 text-blue-500 mx-auto" />}
            href="/import-pdf"
            accentColor="blue"
          />
          
          <WorkflowCard 
            title="Complete Assessment"
            description="Work through comprehensive assessment sections"
            icon={<FileText className="h-12 w-12 text-green-500 mx-auto" />}
            href="/full-assessment"
            accentColor="green"
          />
          
          <WorkflowCard 
            title="Generate Reports"
            description="Create professional reports with intelligent drafting"
            icon={<PenTool className="h-12 w-12 text-purple-500 mx-auto" />}
            href="/report-drafting"
            accentColor="purple"
          />
        </div>
      </div>
      
      {/* Recent assessments and quick access */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Assessments</CardTitle>
              <CardDescription>
                Continue working on recently modified assessments
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center p-4">Loading assessments...</div>
              ) : recentAssessments.length === 0 ? (
                <div className="text-center p-8">
                  <p className="text-gray-500 mb-4">No recent assessments found</p>
                  <Button 
                    onClick={handleCreateNew}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Create your first assessment
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentAssessments.map((assessment) => (
                    <Card 
                      key={assessment.id} 
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => router.push(`/full-assessment?id=${assessment.id}`)}
                    >
                      <CardContent className="p-4 flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">
                            {assessment.data?.demographics?.firstName 
                              ? `${assessment.data.demographics.firstName} ${assessment.data.demographics.lastName || ''}` 
                              : 'Unnamed Client'
                            }
                          </h3>
                          <p className="text-sm text-gray-500">
                            Last modified: {new Date(assessment.lastSaved).toLocaleDateString()}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          Open
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              
              <div className="mt-4 text-center">
                <Link href="/assessment">
                  <Button variant="outline">View All Assessments</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
          <div className="space-y-3">
            <QuickAccessCard
              title="Medical History"
              href="/medical-full"
              icon={<Heart className="h-5 w-5 text-red-500" />}
            />
            <QuickAccessCard
              title="Symptoms Assessment"
              href="/emergency-symptoms"
              icon={<Activity className="h-5 w-5 text-orange-500" />}
            />
            <QuickAccessCard
              title="Typical Day"
              href="/typical-day"
              icon={<Clock className="h-5 w-5 text-blue-500" />}
            />
            <QuickAccessCard
              title="PDF Import"
              href="/import-pdf"
              icon={<Upload className="h-5 w-5 text-green-500" />}
            />
            <QuickAccessCard
              title="Report Drafting"
              href="/report-drafting"
              icon={<PenTool className="h-5 w-5 text-purple-500" />}
            />
          </div>
        </div>
      </div>
      
      {/* Intelligence features showcase */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Intelligence Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <IntelligenceFeatureCard
            title="Pattern Recognition"
            description="Import and extract data from referral PDFs"
            icon={<Brain className="h-8 w-8 text-blue-500" />}
          />
          <IntelligenceFeatureCard
            title="Cross-Section Validation"
            description="Automatically validate data consistency across sections"
            icon={<ClipboardList className="h-8 w-8 text-green-500" />}
          />
          <IntelligenceFeatureCard
            title="Smart Suggestions"
            description="Receive intelligent content recommendations"
            icon={<Users className="h-8 w-8 text-orange-500" />}
          />
          <IntelligenceFeatureCard
            title="Report Drafting"
            description="AI-assisted report generation and refinement"
            icon={<FileText className="h-8 w-8 text-purple-500" />}
          />
        </div>
      </div>
    </div>
  );
}

function IntelligenceFeatureCard({ title, description, icon }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 p-3 bg-gray-50 rounded-full">
            {icon}
          </div>
          <h3 className="font-medium mb-2">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
