import React from 'react';
import { Personal } from './Personal';
import { createFormTests } from '@/test/form-test-factory';

const personalConfig = {
  fields: [
    {
      name: 'firstName',
      type: 'text',
      required: true,
      label: 'First Name'
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
      label: 'Last Name'
    },
    {
      name: 'dateOfBirth',
      type: 'date',
      required: true,
      label: 'Date of Birth'
    },
    {
      name: 'gender',
      type: 'select',
      required: true,
      label: 'Gender',
      options: [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' },
        { value: 'prefer-not-to-say', label: 'Prefer not to say' }
      ]
    },
    {
      name: 'maritalStatus',
      type: 'select',
      required: true,
      label: 'Marital Status',
      options: [
        { value: 'single', label: 'Single' },
        { value: 'married', label: 'Married' },
        { value: 'commonLaw', label: 'Common Law' },
        { value: 'divorced', label: 'Divorced' },
        { value: 'separated', label: 'Separated' },
        { value: 'widowed', label: 'Widowed' }
      ]
    }
  ],
  sections: [
    {
      name: 'Personal Information',
      fields: ['firstName', 'lastName', 'dateOfBirth', 'gender', 'maritalStatus'],
      description: 'Basic personal information'
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
} = createFormTests('Personal', personalConfig);

// Run all generated test suites
structureTests();
validationTests();
submissionTests();
accessibilityTests();