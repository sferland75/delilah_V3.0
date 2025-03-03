import React from 'react';
import { Insurance } from './Insurance';
import { createFormTests } from '@/test/form-test-factory';

const insuranceConfig = {
  fields: [
    {
      name: 'insurance.provider',
      type: 'text',
      required: true,
      label: 'Insurance Provider'
    },
    {
      name: 'insurance.claimNumber',
      type: 'text',
      required: true,
      label: 'Claim Number',
      validation: {
        pattern: /^CLM\d{6}$/,
        message: 'Claim number must be in format CLM followed by 6 digits'
      }
    },
    {
      name: 'insurance.adjustorName',
      type: 'text',
      required: true,
      label: 'Claims Adjustor'
    },
    {
      name: 'insurance.adjustorPhone',
      type: 'phone',
      required: true,
      label: 'Adjustor Phone'
    },
    {
      name: 'insurance.adjustorEmail',
      type: 'email',
      required: true,
      label: 'Adjustor Email'
    }
  ],
  sections: [
    {
      name: 'Insurance Information',
      fields: [
        'insurance.provider',
        'insurance.claimNumber',
        'insurance.adjustorName',
        'insurance.adjustorPhone',
        'insurance.adjustorEmail'
      ],
      description: 'Primary insurance details'
    }
  ],
  errorHandling: {
    submission: true,
    validation: true,
    network: true
  }
};

const {
  structureTests,
  validationTests,
  submissionTests,
  accessibilityTests
} = createFormTests('Insurance', insuranceConfig);

// Run all generated test suites
structureTests();
validationTests();
submissionTests();
accessibilityTests();