import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Demographics } from '../schema';
import { formatDate } from '@/lib/utils';

interface DisplayProps {
  data: Demographics;
}

export function Display({ data }: DisplayProps) {
  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="mt-1">{`${data.firstName} ${data.lastName}`}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
              <dd className="mt-1">{formatDate(data.dateOfBirth)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Gender</dt>
              <dd className="mt-1">{data.gender}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Marital Status</dt>
              <dd className="mt-1">{data.maritalStatus || 'Not provided'}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Phone</dt>
              <dd className="mt-1">{data.contact.phone || 'Not provided'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1">{data.contact.email || 'Not provided'}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-sm font-medium text-gray-500">Address</dt>
              <dd className="mt-1">{data.contact.address || 'Not provided'}</dd>
            </div>
          </dl>

          {data.emergencyContact && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Emergency Contact</h4>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="mt-1">{data.emergencyContact.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Relationship</dt>
                  <dd className="mt-1">{data.emergencyContact.relationship || 'Not provided'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="mt-1">{data.emergencyContact.phone || 'Not provided'}</dd>
                </div>
              </dl>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Insurance Information */}
      <Card>
        <CardHeader>
          <CardTitle>Insurance Information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Provider</dt>
              <dd className="mt-1">{data.insurance.provider}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Claim Number</dt>
              <dd className="mt-1">{data.insurance.claimNumber}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Claims Adjustor</dt>
              <dd className="mt-1">{data.insurance.adjustorName}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Adjustor Phone</dt>
              <dd className="mt-1">{data.insurance.adjustorPhone || 'Not provided'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Adjustor Email</dt>
              <dd className="mt-1">{data.insurance.adjustorEmail || 'Not provided'}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Legal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Legal Representative Information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Representative</dt>
              <dd className="mt-1">{data.legalRep.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Law Firm</dt>
              <dd className="mt-1">{data.legalRep.firm}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Phone</dt>
              <dd className="mt-1">{data.legalRep.phone || 'Not provided'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1">{data.legalRep.email || 'Not provided'}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-sm font-medium text-gray-500">Office Address</dt>
              <dd className="mt-1">{data.legalRep.address || 'Not provided'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">File Number</dt>
              <dd className="mt-1">{data.legalRep.fileNumber}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}