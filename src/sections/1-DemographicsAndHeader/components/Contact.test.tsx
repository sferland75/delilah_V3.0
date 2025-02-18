import React from 'react';
import { Contact } from './Contact';
import { createFormTests } from '@/test/form-test-factory';

const contactConfig = {
  fields: [
    {
      name: 'contact.phone',
      type: 'phone',
      required: true,
      label: 'Phone Number',
      validation: {
        pattern: /^\(\d{3}\) \d{3}-\d{4}$/,
        message: 'Phone number must be in format (XXX) XXX-XXXX'
      }
    },
    {
      name: 'contact.email',
      type: 'email',
      required: true,
      label: 'Email'
    },
    {
      name: 'contact.address',
      type: 'text',
      required: true,
      label: 'Address'
    },
    {
      name: 'emergencyContact.name',
      type: 'text',
      required: true,
      label: 'Name'
    },
    {
      name: 'emergencyContact.relationship',
      type: 'text',
      required: true,
      label: 'Relationship'
    },
    {
      name: 'emergencyContact.phone',
      type: 'phone',
      required: true,
      label: 'Phone Number',
      validation: {
        pattern: /^\(\d{3}\) \d{3}-\d{4}$/,
        message: 'Phone number must be in format (XXX) XXX-XXXX'
      }
    }
  ],
  sections: [
    {
      name: 'Primary Contact',
      fields: ['contact.phone', 'contact.email', 'contact.address'],
      description: 'Main contact information'
    },
    {
      name: 'Emergency Contact',
      fields: ['emergencyContact.name', 'emergencyContact.relationship', 'emergencyContact.phone'],
      description: 'Person to contact in case of emergency'
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
} = createFormTests('Contact', contactConfig);

// Run all generated test suites
structureTests();
validationTests();
submissionTests();
accessibilityTests();