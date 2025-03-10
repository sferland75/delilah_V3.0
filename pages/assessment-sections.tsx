import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import { 
  Activity,
  ClipboardList,
  Calendar,
  MapPin,
  Heart,
  UserPlus,
  Clock,
  FileText,
  Users,
  Home,
  Briefcase,
  Calculator 
} from 'lucide-react';
import Head from 'next/head';

// Define section cards with proper links
const sections = [
  {
    id: 'demographics',
    title: 'Demographics',
    description: 'Basic information and demographics for the assessment',
    icon: <ClipboardList className="h-8 w-8 text-blue-500" />,
    directLink: '/demographics',
    color: 'bg-blue-50 border-blue-200',
  },
  {
    id: 'medical',
    title: 'Medical History',
    description: 'Comprehensive medical history and conditions',
    icon: <Heart className="h-8 w-8 text-red-500" />,
    directLink: '/medical-history',
    color: 'bg-red-50 border-red-200',
  },
  {
    id: 'symptoms',
    title: 'Symptoms Assessment',
    description: 'Physical, cognitive, and emotional symptoms',
    icon: <Activity className="h-8 w-8 text-orange-500" />,
    directLink: '/symptoms-assessment',
    color: 'bg-orange-50 border-orange-200',
  },
  {
    id: 'functional',
    title: 'Functional Status',
    description: 'Current functional capabilities and limitations',
    icon: <Users className="h-8 w-8 text-yellow-500" />,
    directLink: '/functional-status',
    color: 'bg-yellow-50 border-yellow-200',
  },
  {
    id: 'typical-day',
    title: 'Typical Day',
    description: 'Daily routines and activities',
    icon: <Clock className="h-8 w-8 text-green-500" />,
    directLink: '/typical-day',
    color: 'bg-green-50 border-green-200',
  },
  {
    id: 'adl',
    title: 'Activities of Daily Living',
    description: 'Self-care and daily living activities',
    icon: <Calendar className="h-8 w-8 text-cyan-500" />,
    directLink: '/activities-daily-living',
    color: 'bg-cyan-50 border-cyan-200',
  },
  {
    id: 'attendant-care',
    title: 'Attendant Care',
    description: 'Required assistance and caregiving needs',
    icon: <UserPlus className="h-8 w-8 text-purple-500" />,
    directLink: '/attendant-care',
    color: 'bg-purple-50 border-purple-200',
  },
  {
    id: 'housekeeping',
    title: 'Housekeeping Calculator',
    description: 'Calculation of housekeeping needs and costs',
    icon: <Calculator className="h-8 w-8 text-pink-500" />,
    directLink: '/full-assessment?section=housekeeping',
    color: 'bg-pink-50 border-pink-200',
  },
  {
    id: 'report',
    title: 'Report Drafting',
    description: 'Generate and edit assessment reports',
    icon: <FileText className="h-8 w-8 text-gray-500" />,
    directLink: '/report-drafting',
    color: 'bg-gray-50 border-gray-200',
  }
];

export default function AssessmentSections() {
  return (
    <>
      <Head>
        <title>Assessment Sections | Delilah V3.0</title>
      </Head>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Assessment Sections</h1>
          <div className="flex space-x-2">
            <Link href="/full-assessment">
              <Button variant="outline">Full Assessment</Button>
            </Link>
            <Link href="/">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Dashboard</Button>
            </Link>
          </div>
        </div>
        
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <InfoIcon className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">Section Directory</AlertTitle>
          <AlertDescription className="text-blue-700">
            Select a section below to access it directly. All sections use the enhanced, fully-developed components
            and maintain data consistency through the assessment context.
          </AlertDescription>
        </Alert>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map((section) => (
            <Card key={section.id} className={`${section.color} overflow-hidden border-l-4 ${section.color.replace('bg-', 'border-').replace('-50', '-500')}`}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div>{section.icon}</div>
                  <CardTitle className="text-xl">{section.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-700 mt-1">
                  {section.description}
                </CardDescription>
              </CardContent>
              <CardFooter className="pt-2">
                <Link href={section.directLink} className="w-full">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Open Section</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}