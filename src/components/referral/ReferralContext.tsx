"use client";

/**
 * ReferralContext.tsx
 * Component to display referral information in the assessment context
 */

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { useAssessment } from '@/contexts/AssessmentContext';
import { mapContextToForm, hasRequirement } from '@/services/referralMapper';

export function ReferralContext() {
  const { data } = useAssessment();
  const [hasReferral, setHasReferral] = useState<boolean>(false);
  const [referralData, setReferralData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("client");
  
  useEffect(() => {
    // Check if we have referral data
    if (data && data.referral) {
      const { formData, hasData } = mapContextToForm(data);
      setReferralData(formData);
      setHasReferral(hasData);
    } else {
      setHasReferral(false);
      setReferralData(null);
    }
  }, [data]);
  
  if (!hasReferral || !referralData) {
    return (
      <Alert>
        <InfoCircledIcon className="h-4 w-4" />
        <AlertTitle>No Referral Information</AlertTitle>
        <AlertDescription>
          There is no referral information available in the current assessment context.
          <br />
          You can import a referral document to add context to your assessment.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Referral Information</span>
          {referralData.client.fileNumber && (
            <Badge variant="outline">File #: {referralData.client.fileNumber}</Badge>
          )}
        </CardTitle>
        <CardDescription>
          Information from the referral document to provide context for this assessment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="client">Client</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
            <TabsTrigger value="reporting">Reporting</TabsTrigger>
          </TabsList>
          
          <TabsContent value="client" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium">Client Name</h3>
                <p className="text-sm">{referralData.client.name || 'Not provided'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium">Date of Birth</h3>
                <p className="text-sm">{referralData.client.dateOfBirth || 'Not provided'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium">Date of Loss</h3>
                <p className="text-sm">{referralData.client.dateOfLoss || 'Not provided'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium">Language</h3>
                <p className="text-sm">{referralData.client.language || 'Not provided'}</p>
              </div>
              
              <div className="col-span-2">
                <h3 className="text-sm font-medium">Address</h3>
                <p className="text-sm">{referralData.client.address || 'Not provided'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium">Phone</h3>
                <p className="text-sm">
                  {referralData.client.phoneNumbers && referralData.client.phoneNumbers.length > 0 
                    ? referralData.client.phoneNumbers.join(' / ')
                    : 'Not provided'}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium">Email</h3>
                <p className="text-sm">{referralData.client.email || 'Not provided'}</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="requirements" className="space-y-4 mt-4">
            {referralData.assessmentTypes && referralData.assessmentTypes.length > 0 && (
              <div>
                <h3 className="text-sm font-medium">Assessment Types</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {referralData.assessmentTypes.map((type: string, index: number) => (
                    <Badge key={index} variant="secondary">{type}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            {referralData.specificRequirements && referralData.specificRequirements.length > 0 && (
              <div>
                <h3 className="text-sm font-medium">Specific Requirements</h3>
                <ul className="list-disc pl-5 text-sm mt-1">
                  {referralData.specificRequirements.map((req: string, index: number) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {referralData.domains && referralData.domains.length > 0 && (
              <div>
                <h3 className="text-sm font-medium">Domains to Address</h3>
                <ul className="list-disc pl-5 text-sm mt-1">
                  {referralData.domains.map((domain: string, index: number) => (
                    <li key={index}>{domain}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {referralData.criteria && referralData.criteria.length > 0 && (
              <div>
                <h3 className="text-sm font-medium">Criteria</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {referralData.criteria.map((criterion: string, index: number) => (
                    <Badge key={index} variant="outline">Criterion {criterion}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            {(referralData.assessmentTypes?.length === 0 && 
              referralData.specificRequirements?.length === 0 &&
              referralData.domains?.length === 0 &&
              referralData.criteria?.length === 0) && (
              <p className="text-sm text-muted-foreground">No specific requirements provided in the referral.</p>
            )}
          </TabsContent>
          
          <TabsContent value="scheduling" className="space-y-4 mt-4">
            {referralData.appointments && referralData.appointments.length > 0 ? (
              <div>
                <h3 className="text-sm font-medium">Scheduled Appointments</h3>
                <div className="space-y-3 mt-2">
                  {referralData.appointments.map((appt: any, index: number) => (
                    <div key={index} className="border rounded p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{appt.type || 'Assessment'}</span>
                        <Badge variant="outline">{appt.dateTime || 'Date TBD'}</Badge>
                      </div>
                      <div className="text-sm">
                        <p><span className="font-medium">Assessor:</span> {appt.assessor || 'Not specified'}</p>
                        <p><span className="font-medium">Location:</span> {appt.location || 'Not specified'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No appointment information provided in the referral.</p>
            )}
          </TabsContent>
          
          <TabsContent value="reporting" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <h3 className="text-sm font-medium">Report Due Date</h3>
                <p className="text-sm">{referralData.reportDueDate || 'Not specified'}</p>
              </div>
              
              {referralData.reportGuidelines && referralData.reportGuidelines.length > 0 && (
                <div className="col-span-2">
                  <h3 className="text-sm font-medium">Report Guidelines</h3>
                  <ul className="list-disc pl-5 text-sm mt-1">
                    {referralData.reportGuidelines.map((guideline: string, index: number) => (
                      <li key={index}>{guideline}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {referralData.referralSource && (
                <>
                  <div>
                    <h3 className="text-sm font-medium">Referral Organization</h3>
                    <p className="text-sm">{referralData.referralSource.organization || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium">Contact Person</h3>
                    <p className="text-sm">{referralData.referralSource.contactPerson || 'Not provided'}</p>
                  </div>
                  
                  {referralData.referralSource.contactInfo && (
                    <div className="col-span-2">
                      <h3 className="text-sm font-medium">Contact Information</h3>
                      <p className="text-sm">{referralData.referralSource.contactInfo}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default ReferralContext;
