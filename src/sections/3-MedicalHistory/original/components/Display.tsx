import React from 'react';
import { useFormContext } from 'react-hook-form';
import { type MedicalHistory } from '../types';

export function Display() {
  const { getValues } = useFormContext<{ data: MedicalHistory }>();
  const data = getValues('data');

  const formatConditions = () => {
    if (!data?.preExistingConditions?.length) return 'No pre-existing conditions';
    return data.preExistingConditions.map(c =>
      `${c.condition} (${c.status}${c.details ? `: ${c.details}` : ''})`
    ).join('\n');
  };

  const formatInjury = () => {
    if (!data?.injury) return 'No injury details';
    const { date, impactType, circumstance, immediateSymptoms } = data.injury;
    const details = [
      date && `Date: ${date}`,
      impactType && `Type: ${impactType}`,
      circumstance && `Circumstance: ${circumstance}`,
      immediateSymptoms && `Symptoms: ${immediateSymptoms}`
    ].filter(Boolean).join('\n');
    
    return details || 'No injury details available';
  };

  const formatTreatments = () => {
    if (!data?.currentTreatments?.length) return 'No current treatments';
    return data.currentTreatments.map(t =>
      `${t.type} with ${t.provider}${t.frequency ? ` (${t.frequency})` : ''}${t.notes ? `\n${t.notes}` : ''}`
    ).join('\n\n');
  };

  const formatMedications = () => {
    if (!data?.currentMedications?.length) return 'No current medications';
    return data.currentMedications.map(m =>
      `${m.name} ${m.dosage} ${m.frequency}${m.prescribedFor ? ` for ${m.prescribedFor}` : ''}`
    ).join('\n');
  };

  return (
    <div className="space-y-4">
      <div>
        <div>
          <h3>Pre-Existing Conditions</h3>
        </div>
        <div>
          <pre>{formatConditions()}</pre>
        </div>
      </div>
      
      <div>
        <div>
          <h3>Injury Details</h3>
        </div>
        <div>
          <pre>{formatInjury()}</pre>
        </div>
      </div>

      <div>
        <div>
          <h3>Current Treatment</h3>
        </div>
        <div>
          <pre>{formatTreatments()}</pre>
        </div>
      </div>

      <div>
        <div>
          <h3>Current Medications</h3>
        </div>
        <div>
          <pre>{formatMedications()}</pre>
        </div>
      </div>
    </div>
  );
}