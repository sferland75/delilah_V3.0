import { type FormTestConfig } from '@/test-utils/formTestFactory';

export const medicalHistoryTestConfig: FormTestConfig = {
  fields: [
    {
      name: 'data.preExistingConditions.0.condition',
      type: 'text',
      required: true,
      label: 'Condition'
    },
    {
      name: 'data.injury.date',
      type: 'date',
      required: true,
      label: 'Date of Injury'
    },
    {
      name: 'data.currentMedications.0.name',
      type: 'text',
      required: true,
      label: 'Medication Name'
    }
  ],
  sections: [
    {
      name: 'Pre-Existing Conditions',
      fields: ['data.preExistingConditions.0.condition', 'data.preExistingConditions.0.status']
    },
    {
      name: 'Injury Details',
      fields: ['data.injury.date', 'data.injury.time']
    },
    {
      name: 'Medications',
      fields: ['data.currentMedications.0.name', 'data.currentMedications.0.dosage']
    }
  ],
  navigation: {
    tabs: ['preExisting', 'injury', 'treatment', 'medications']
  },
  errorHandling: {
    submission: true,
    validation: true
  }
};