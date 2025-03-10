import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AssessmentProvider } from '@/contexts/AssessmentContext';
import Link from 'next/link';
import Head from 'next/head';
import dynamic from 'next/dynamic';

// Dynamically import the Attendant Care component to prevent SSR issues
const AttendantCareSection = dynamic(
  () => import('@/sections/9-AttendantCare').then(mod => mod.AttendantCareSectionIntegrated),
  { ssr: false }
);

export default function AttendantCarePage() {
  return (
    <>
      <Head>
        <title>Attendant Care Assessment | Delilah V3.0</title>
      </Head>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Attendant Care Assessment</h1>
          <div className="flex space-x-2">
            <Link href="/full-assessment">
              <Button variant="outline">Full Assessment</Button>
            </Link>
            <Link href="/">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Dashboard</Button>
            </Link>
          </div>
        </div>
        
        <Card className="mb-6 overflow-hidden">
          <AssessmentProvider>
            <AttendantCareSection />
          </AssessmentProvider>
        </Card>
      </div>
    </>
  );
}