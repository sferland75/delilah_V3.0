import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { type FormState } from '../types';

interface DisplayProps {
  formState: FormState;
}

export function Display({ formState }: DisplayProps) {
  const { data } = formState;

  return (
    <div className="space-y-6">
      {/* Pre-existing Conditions */}
      <Card>
        <CardHeader>
          <CardTitle>Pre-existing Conditions</CardTitle>
          <CardDescription>Medical conditions prior to incident</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.preExistingConditions.map((condition, index) => (
              <div key={index} className="border-b pb-4 last:border-none">
                <h4 className="font-medium">{condition.condition}</h4>
                <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                  <span className="text-slate-600">Diagnosis Date:</span>
                  <span>{condition.diagnosisDate || 'Not specified'}</span>
                  <span className="text-slate-600">Status:</span>
                  <span className="capitalize">{condition.status}</span>
                  <span className="text-slate-600">Details:</span>
                  <span>{condition.details}</span>
                </div>
              </div>
            ))}
            {data.preExistingConditions.length === 0 && (
              <p className="text-slate-600 italic">No pre-existing conditions recorded</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Injury Details */}
      <Card>
        <CardHeader>
          <CardTitle>Injury Details</CardTitle>
          <CardDescription>Incident information and response</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 pb-4 border-b">
              <div>
                <h4 className="font-medium mb-1">Date & Time</h4>
                <p>{data.injury.date} {data.injury.time}</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Position & Impact</h4>
                <p>{data.injury.position} - {data.injury.impactType}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-1">Circumstances</h4>
                <p className="text-sm">{data.injury.circumstance}</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Impact Preparation</h4>
                <p className="text-sm">{data.injury.preparedForImpact}</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Immediate Symptoms</h4>
                <p className="text-sm">{data.injury.immediateSymptoms}</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Immediate Response</h4>
                <p className="text-sm">{data.injury.immediateResponse}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Treatments */}
      <Card>
        <CardHeader>
          <CardTitle>Current Treatments</CardTitle>
          <CardDescription>Ongoing medical care and rehabilitation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.currentTreatments.map((treatment, index) => (
              <div key={index} className="border-b pb-4 last:border-none">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{treatment.type}</h4>
                  <span className="text-sm px-2 py-1 bg-slate-100 rounded-full capitalize">
                    {treatment.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-slate-600">Provider:</span>
                  <span>{treatment.provider}</span>
                  <span className="text-slate-600">Facility:</span>
                  <span>{treatment.facility}</span>
                  <span className="text-slate-600">Start Date:</span>
                  <span>{treatment.startDate}</span>
                  <span className="text-slate-600">Frequency:</span>
                  <span>{treatment.frequency}</span>
                  <span className="text-slate-600">Notes:</span>
                  <span>{treatment.notes}</span>
                </div>
              </div>
            ))}
            {data.currentTreatments.length === 0 && (
              <p className="text-slate-600 italic">No current treatments recorded</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Medications */}
      <Card>
        <CardHeader>
          <CardTitle>Current Medications</CardTitle>
          <CardDescription>Prescribed medications and details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.currentMedications.map((medication, index) => (
              <div key={index} className="border-b pb-4 last:border-none">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{medication.name}</h4>
                  <span className="text-sm px-2 py-1 bg-slate-100 rounded-full capitalize">
                    {medication.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-slate-600">Dosage:</span>
                  <span>{medication.dosage}</span>
                  <span className="text-slate-600">Frequency:</span>
                  <span>{medication.frequency}</span>
                  <span className="text-slate-600">Prescribed For:</span>
                  <span>{medication.prescribedFor}</span>
                  <span className="text-slate-600">Prescribed By:</span>
                  <span>{medication.prescribedBy || 'Not specified'}</span>
                  <span className="text-slate-600">Start Date:</span>
                  <span>{medication.startDate || 'Not specified'}</span>
                  <span className="text-slate-600">End Date:</span>
                  <span>{medication.endDate || 'Ongoing'}</span>
                </div>
              </div>
            ))}
            {data.currentMedications.length === 0 && (
              <p className="text-slate-600 italic">No medications recorded</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}