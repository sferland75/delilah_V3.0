import React from 'react';
import { Card } from '@/components/ui/card';
import DwellingInfo from './DwellingInfo';
import { SafetyChecklist } from './SafetyChecklist';
import { OutdoorAccess } from './OutdoorAccess';
import { livingEnvironmentSchema, type LivingEnvironment } from '../schema';

export const LivingEnvironmentAssessment: React.FC = () => {
  // Initialize form with empty values
  const initialValues: LivingEnvironment = {
    dwelling: {
      type: 'house',
      floors: 1,
      rooms: {
        bedrooms: 0,
        bathrooms: 0,
        kitchen: false,
        livingRoom: false,
        other: []
      }
    },
    flooring: {
      types: [],
      concerns: ''
    },
    safety: {
      hazards: [],
      modifications: [],
      recommendations: []
    },
    outdoor: {
      hasSpace: false,
      types: [],
      access: ''
    }
  };

  const [formData, setFormData] = React.useState<LivingEnvironment>(initialValues);

  const handleSectionUpdate = (section: keyof LivingEnvironment, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: value
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Living Environment Assessment</h2>
      
      <div className="grid gap-6">
        <DwellingInfo 
          value={formData.dwelling}
          onChange={(value) => handleSectionUpdate('dwelling', value)}
        />

        <SafetyChecklist
          value={formData.safety}
          onChange={(value) => handleSectionUpdate('safety', value)}
        />

        <OutdoorAccess
          value={formData.outdoor}
          onChange={(value) => handleSectionUpdate('outdoor', value)}
        />
      </div>
    </div>
  );
};