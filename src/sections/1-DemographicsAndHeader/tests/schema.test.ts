import { demographicsSchema } from '../schema';

describe('Demographics Schema Validation', () => {
  it('validates required personal information', () => {
    const result = demographicsSchema.safeParse({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: 'invalid',
      insurance: {
        provider: 'Test Provider',
        claimNumber: '12345',
        adjustorName: 'John Doe'
      },
      legalRep: {
        name: 'Jane Smith',
        firm: 'Law Firm',
        fileNumber: 'ABC123'
      }
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const formattedErrors = result.error.format();
      expect(formattedErrors.firstName?._errors).toContain('First name is required');
      expect(formattedErrors.lastName?._errors).toContain('Last name is required');
      expect(formattedErrors.dateOfBirth?._errors).toContain('Date of birth is required');
      expect(formattedErrors.gender?._errors).toBeDefined();
    }
  });

  it('validates optional fields correctly', () => {
    const validData = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01',
      gender: 'male',
      maritalStatus: 'single',
      contact: {
        email: 'john@example.com',
      },
      insurance: {
        provider: 'Test Provider',
        claimNumber: '12345',
        adjustorName: 'John Doe'
      },
      legalRep: {
        name: 'Jane Smith',
        firm: 'Law Firm',
        fileNumber: 'ABC123'
      }
    };

    const result = demographicsSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('validates email formats', () => {
    const invalidData = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01',
      gender: 'male',
      contact: {
        email: 'invalid-email',
      },
      insurance: {
        provider: 'Test Provider',
        claimNumber: '12345',
        adjustorName: 'John Doe',
        adjustorEmail: 'invalid-email'
      },
      legalRep: {
        name: 'Jane Smith',
        firm: 'Law Firm',
        fileNumber: 'ABC123',
        email: 'invalid-email'
      }
    };

    const result = demographicsSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      const formattedErrors = result.error.format();
      expect(formattedErrors.contact?.email?._errors).toContain('Invalid email address');
      expect(formattedErrors.insurance?.adjustorEmail?._errors).toContain('Invalid email address');
      expect(formattedErrors.legalRep?.email?._errors).toContain('Invalid email address');
    }
  });

  it('validates arrays of children and household members', () => {
    const validData = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01',
      gender: 'male',
      children: [
        { name: 'Child 1', age: 5 },
        { name: 'Child 2', age: 7 }
      ],
      householdMembers: [
        { name: 'Member 1', relationship: 'Spouse' }
      ],
      insurance: {
        provider: 'Test Provider',
        claimNumber: '12345',
        adjustorName: 'John Doe'
      },
      legalRep: {
        name: 'Jane Smith',
        firm: 'Law Firm',
        fileNumber: 'ABC123'
      }
    };

    const result = demographicsSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });
});