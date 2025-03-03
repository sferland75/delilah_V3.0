"use client";

/**
 * Referral Details Page
 * Displays complete referral information from the assessment context
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoCircledIcon, PlusCircledIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import { useAssessment } from '@/contexts/AssessmentContext';
import ReferralContext from '@/components/referral/ReferralContext';

export default function ReferralDetailsPage() {
  const router = useRouter();
  const { data } = useAssessment();
  const hasReferral = data.referral != null;
  
  return (
    <div className="container py-6">
      <Breadcrumb className="mb-6">
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/assessment">Assessment</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/assessment/referral">Referral Details</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Referral Details</h1>
        {!hasReferral && (
          <Button onClick={() => router.push('/import/referral')}>
            <PlusCircledIcon className="mr-2 h-4 w-4" />
            Import Referral
          </Button>
        )}
      </div>
      
      {hasReferral ? (
        <ReferralContext />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Referral Information</CardTitle>
            <CardDescription>
              No referral data has been imported into this assessment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <InfoCircledIcon className="h-4 w-4" />
              <AlertTitle>Missing Referral Information</AlertTitle>
              <AlertDescription>
                Referral documents provide important context for your assessment, including client information,
                assessment requirements, and reporting guidelines. Adding this information can help ensure
                your assessment meets all necessary criteria.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push('/import/referral')} className="w-full">
              <PlusCircledIcon className="mr-2 h-4 w-4" />
              Import Referral Document
            </Button>
          </CardFooter>
        </Card>
      )}
      
      <div className="mt-6 flex justify-end">
        <Button variant="outline" onClick={() => router.back()}>
          Back to Assessment
        </Button>
      </div>
    </div>
  );
}
