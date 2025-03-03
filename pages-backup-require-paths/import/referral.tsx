"use client";

/**
 * Referral Import Page
 */

import React from 'react';
import ReferralImport from '@/pages/import/ReferralImport';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { useAssessment } from '@/contexts/AssessmentContext';

export default function ReferralImportPage() {
  const { data, updateSection } = useAssessment();
  
  // We're using the same UpdateReferral function from our test environment
  const updateReferral = (referralData: any) => {
    if (referralData && referralData.referral) {
      updateSection('referral', referralData.referral);
    }
  };
  
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
          <BreadcrumbLink href="/import/referral">Import Referral</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      
      <h1 className="text-2xl font-bold mb-6">Import Referral Document</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>About Referral Import</CardTitle>
          <CardDescription>
            How referral documents enhance your assessment process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Importing a referral document allows Delilah to automatically extract client information, 
            assessment requirements, and other relevant details. This information provides valuable 
            context throughout your assessment process, ensuring you address all requirements specified 
            in the referral.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-muted p-4 rounded">
              <h3 className="font-medium mb-2">Client Information</h3>
              <p className="text-xs text-muted-foreground">
                Extract client demographics, contact details, and key dates to pre-populate your assessment.
              </p>
            </div>
            
            <div className="bg-muted p-4 rounded">
              <h3 className="font-medium mb-2">Assessment Requirements</h3>
              <p className="text-xs text-muted-foreground">
                Understand what domains, criteria, and specific requirements need to be addressed in your assessment.
              </p>
            </div>
            
            <div className="bg-muted p-4 rounded">
              <h3 className="font-medium mb-2">Reporting Guidelines</h3>
              <p className="text-xs text-muted-foreground">
                Get clear information about report due dates, formatting requirements, and submission instructions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <ReferralImport />
    </div>
  );
}
