"use client";

/**
 * ReferralSummary.tsx
 * A component that summarizes referral information in the assessment workflow
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoCircledIcon, PlusCircledIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import { useAssessment } from '@/contexts/AssessmentContext';

export default function ReferralSummary() {
  const router = useRouter();
  const { data } = useAssessment();
  const referral = data.referral;
  
  const navigateToImport = () => {
    router.push('/import/referral');
  };
  
  if (!referral) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Referral Information</CardTitle>
          <CardDescription>
            No referral information has been imported yet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <InfoCircledIcon className="h-4 w-4" />
            <AlertTitle>Import Referral Document</AlertTitle>
            <AlertDescription>
              Adding referral information can help ensure your assessment addresses all required elements.
              Referral documents typically contain valuable context about the client and assessment requirements.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button onClick={navigateToImport} className="w-full">
            <PlusCircledIcon className="mr-2 h-4 w-4" />
            Import Referral Document
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  // If we have referral data, show a summary
  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Referral Information</CardTitle>
            <CardDescription>
              Summary of imported referral document
            </CardDescription>
          </div>
          {referral.client?.fileNumber && (
            <Badge variant="outline">File #: {referral.client.fileNumber}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {referral.client && (
            <>
              <div>
                <h3 className="text-sm font-medium">Client</h3>
                <p className="text-sm">{referral.client.name || 'Not provided'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium">Date of Loss</h3>
                <p className="text-sm">{referral.client.dateOfLoss || 'Not provided'}</p>
              </div>
            </>
          )}
          
          {referral.assessmentTypes && referral.assessmentTypes.length > 0 && (
            <div className="col-span-2">
              <h3 className="text-sm font-medium">Assessment Types</h3>
              <div className="flex flex-wrap gap-1 mt-1">
                {referral.assessmentTypes.map((type: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {referral.domains && referral.domains.length > 0 && (
            <div className="col-span-2">
              <h3 className="text-sm font-medium">Key Domains</h3>
              <div className="flex flex-wrap gap-1 mt-1">
                {referral.domains.map((domain: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {domain}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {referral.reportDueDate && (
            <div className="col-span-2">
              <h3 className="text-sm font-medium">Report Due Date</h3>
              <p className="text-sm">{referral.reportDueDate}</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={navigateToImport}>
          Replace Referral
        </Button>
        
        <Button variant="ghost" size="sm" onClick={() => router.push('/assessment/referral')}>
          View Full Details
        </Button>
      </CardFooter>
    </Card>
  );
}
