import { FormTestConfig } from './form-test-factory';

/**
 * Common form field patterns for reuse across components
 */

export const personalInfoFields = {
  firstName: {
    name: 'firstName',
    type: 'text' as const,
    required: true,
    label: 'First Name'
  },
  lastName: {
    name: 'lastName',
    type: 'text' as const,
    required: true,
    label: 'Last Name'
  },
  dateOfBirth: {
    name: 'dateOfBirth',
    type: 'date' as const,
    required: true,
    label: 'Date of Birth'
  },
  gender: {
    name: 'gender',
    type: 'select' as const,
    required: true,
    label: 'Gender',
    options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
      { value: 'other', label: 'Other' },
      { value: 'prefer-not-to-say', label: 'Prefer not to say' }
    ]
  }
};

export const contactFields = {
  phone: {
    name: 'phone',
    type: 'phone' as const,
    required: true,
    label: 'Phone Number',
    validation: {
      pattern: /^\(\d{3}\) \d{3}-\d{4}$/,
      message: 'Phone number must be in format (XXX) XXX-XXXX'
    }
  },
  email: {
    name: 'email',
    type: 'email' as const,
    required: true,
    label: 'Email'
  },
  address: {
    name: 'address',
    type: 'text' as const,
    required: true,
    label: 'Address'
  }
};

export const insuranceFields = {
  provider: {
    name: 'provider',
    type: 'text' as const,
    required: true,
    label: 'Insurance Provider'
  },
  policyNumber: {
    name: 'policyNumber',
    type: 'text' as const,
    required: true,
    label: 'Policy Number',
    validation: {
      pattern: /^[A-Z0-9]{10}$/,
      message: 'Policy number must be 10 characters of uppercase letters and numbers'
    }
  },
  adjustorName: {
    name: 'adjustorName',
    type: 'text' as const,
    required: true,
    label: 'Claims Adjustor'
  }
};

export const legalFields = {
  name: {
    name: 'name',
    type: 'text' as const,
    required: true,
    label: 'Legal Representative Name'
  },
  firm: {
    name: 'firm',
    type: 'text' as const,
    required: true,
    label: 'Law Firm'
  },
  fileNumber: {
    name: 'fileNumber',
    type: 'text' as const,
    required: true,
    label: 'File Number',
    validation: {
      pattern: /^FILE\d{3}$/,
      message: 'File number must be in format FILE followed by 3 digits'
    }
  }
};

/**
 * Common form configurations for reuse
 */

export const createPersonalConfig = (prefix = ''): FormTestConfig => ({
  fields: Object.values(personalInfoFields).map(field => ({
    ...field,
    name: prefix ? `${prefix}.${field.name}` : field.name
  })),
  sections: [
    {
      name: 'Personal Information',
      fields: Object.keys(personalInfoFields).map(key => 
        prefix ? `${prefix}.${key}` : key
      ),
      description: 'Basic personal information'
    }
  ],
  errorHandling: {
    submission: true,
    validation: true,
    network: true
  }
});

export const createContactConfig = (prefix = ''): FormTestConfig => ({
  fields: Object.values(contactFields).map(field => ({
    ...field,
    name: prefix ? `${prefix}.${field.name}` : field.name
  })),
  sections: [
    {
      name: 'Contact Information',
      fields: Object.keys(contactFields).map(key => 
        prefix ? `${prefix}.${key}` : key
      ),
      description: 'Primary contact details'
    }
  ],
  errorHandling: {
    submission: true,
    validation: true,
    network: true
  }
});

/**
 * Example usage:
 * 
 * // For a standalone personal info form
 * const config = createPersonalConfig();
 * 
 * // For a nested personal info form
 * const config = createPersonalConfig('user');
 * 
 * // Combining configurations
 * const config = {
 *   fields: [
 *     ...createPersonalConfig('personal').fields,
 *     ...createContactConfig('contact').fields
 *   ],
 *   sections: [
 *     ...createPersonalConfig('personal').sections,
 *     ...createContactConfig('contact').sections
 *   ],
 *   errorHandling: {
 *     submission: true,
 *     validation: true,
 *     network: true
 *   }
 * };
 */