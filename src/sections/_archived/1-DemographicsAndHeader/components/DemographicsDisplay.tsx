import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Demographics } from '../types';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function DemographicsDisplay() {
  const { watch } = useFormContext<{ demographics: Demographics }>();
  const demographics = watch('demographics');

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <Tabs defaultValue="client" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="client">Client Information</TabsTrigger>
        <TabsTrigger value="insurer">Insurance Details</TabsTrigger>
        <TabsTrigger value="legal">Legal Representative</TabsTrigger>
        <TabsTrigger value="additional">Additional Info</TabsTrigger>
      </TabsList>

      {/* Client Information Display */}
      <TabsContent value="client">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Basic Information</h3>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="mt-1">{`${demographics.firstName} ${demographics.lastName}`}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
              <dd className="mt-1">{demographics.dateOfBirth ? formatDate(demographics.dateOfBirth) : 'Not provided'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Gender</dt>
              <dd className="mt-1">{demographics.gender || 'Not provided'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Phone</dt>
              <dd className="mt-1">{demographics.phone || 'Not provided'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1">{demographics.email || 'Not provided'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Address</dt>
              <dd className="mt-1">{demographics.address || 'Not provided'}</dd>
            </div>
          </dl>
        </Card>
      </TabsContent>

      {/* Insurance Details Display */}
      <TabsContent value="insurer">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Insurance Details</h3>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Insurance Provider</dt>
              <dd className="mt-1">{demographics.insuranceProvider || 'Not provided'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Claim Number</dt>
              <dd className="mt-1">{demographics.claimNumber || 'Not provided'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Claims Adjustor</dt>
              <dd className="mt-1">{demographics.adjustorName || 'Not provided'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Adjustor Phone</dt>
              <dd className="mt-1">{demographics.adjustorPhone || 'Not provided'}</dd>
            </div>
          </dl>
        </Card>
      </TabsContent>

      {/* Legal Representative Display */}
      <TabsContent value="legal">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Legal Representative Information</h3>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Representative Name</dt>
              <dd className="mt-1">{demographics.legalRepName || 'Not provided'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Law Firm</dt>
              <dd className="mt-1">{demographics.legalFirm || 'Not provided'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Phone</dt>
              <dd className="mt-1">{demographics.legalPhone || 'Not provided'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1">{demographics.legalEmail || 'Not provided'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Office Address</dt>
              <dd className="mt-1">{demographics.legalAddress || 'Not provided'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">File Number</dt>
              <dd className="mt-1">{demographics.fileNumber || 'Not provided'}</dd>
            </div>
          </dl>
        </Card>
      </TabsContent>

      {/* Additional Information Display */}
      <TabsContent value="additional">
        <Card className="p-6">
          <div className="space-y-8">
            {/* Emergency Contact */}
            <div>
              <h3 className="text-lg font-medium mb-4">Emergency Contact</h3>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="mt-1">{demographics.emergencyContact?.name || 'Not provided'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="mt-1">{demographics.emergencyContact?.phone || 'Not provided'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Relationship</dt>
                  <dd className="mt-1">{demographics.emergencyContact?.relationship || 'Not provided'}</dd>
                </div>
              </dl>
            </div>

            {/* Family Information */}
            <div>
              <h3 className="text-lg font-medium mb-4">Family Information</h3>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Marital Status</dt>
                  <dd className="mt-1">{demographics.maritalStatus || 'Not provided'}</dd>
                </div>

                {demographics.children && demographics.children.length > 0 && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 mb-2">Children</dt>
                    <dd className="mt-1 space-y-2">
                      {demographics.children.map((child, index) => (
                        <div key={index} className="pl-4 border-l-2 border-gray-200">
                          {`${child.name}${child.age ? ` (${child.age} years)` : ''}`}
                          {child.notes && <div className="text-sm text-gray-500">{child.notes}</div>}
                        </div>
                      ))}
                    </dd>
                  </div>
                )}

                {demographics.householdMembers && demographics.householdMembers.length > 0 && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 mb-2">Household Members</dt>
                    <dd className="mt-1 space-y-2">
                      {demographics.householdMembers.map((member, index) => (
                        <div key={index} className="pl-4 border-l-2 border-gray-200">
                          {`${member.name} (${member.relationship})`}
                          {member.notes && <div className="text-sm text-gray-500">{member.notes}</div>}
                        </div>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  );
}