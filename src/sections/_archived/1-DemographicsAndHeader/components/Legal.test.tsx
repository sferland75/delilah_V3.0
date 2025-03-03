import React from 'react';
import { Legal } from './Legal';
import { createFormTests } from '@/test/form-test-factory';

const legalConfig = {
  fields: [
    {
      name: 'legalRep.name',
      type: 'text',
      required: true,
      label: 'Legal Representative Name'
    },
    {
      name: 'legalRep.firm',
      type: 'text',
      required: true,
      label: 'Law Firm'
    },
    {
      name: 'legalRep.phone',
      type: 'phone',
      required: true,
      label: 'Phone Number',
      validation: {
        pattern: /^\(\d{3}\) \d{3}-\d{4}$/,
        message: 'Phone number must be in format (XXX) XXX-XXXX'
      }
    },
    {
      name: 'legalRep.email',
      type: 'email',
      required: true,
      label: 'Email'
    },
    {
      name: 'legalRep.address',
      type: 'text',
      required: true,
      label: 'Office Address'
    },
    {
      name: 'legalRep.fileNumber',
      type: 'text',
      required: true,
      label: 'File Number',
      validation: {
        pattern: /^FILE\d{3}$/,
        message: 'File number must be in format FILE followed by 3 digits'
      }
    }
  ],
  sections: [
    {
      name: 'Legal Representative Information',
      fields: [
        'legalRep.name',
        'legalRep.firm',
        'legalRep.phone',
        'legalRep.email',
        'legalRep.address',
        'legalRep.fileNumber'
      ],
      description: 'Primary legal representative details'
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
} = createFormTests('Legal', legalConfig);

// Run all generated test suites
structureTests();
validationTests();
submissionTests();
accessibilityTests();