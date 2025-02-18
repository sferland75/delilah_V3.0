import { defaultPrompts, formatDemographicsData, preparePrompt } from './prompts';
import { Demographics } from './schema';
import { normalizeWhitespace } from '@/test/test-helpers';

describe('Demographics Prompts', () => {
  describe('formatDemographicsData', () => {
    it('formats complete demographics data correctly', () => {
      const mockData: Demographics = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        gender: 'male',
        maritalStatus: 'married',
        contact: {
          phone: '(555) 555-5555',
          email: 'john.doe@example.com',
          address: '123 Main St'
        },
        emergencyContact: {
          name: 'Jane Doe',
          relationship: 'Spouse',
          phone: '(555) 555-5556'
        },
        insurance: {
          provider: 'Test Insurance',
          claimNumber: 'CLM123456',
          adjustorName: 'Sarah Smith',
          adjustorPhone: '(555) 555-5557',
          adjustorEmail: 'sarah.smith@insurance.com'
        },
        legalRep: {
          name: 'Bob Wilson',
          firm: 'Wilson Law',
          phone: '(555) 555-5558',
          email: 'bob@wilsonlaw.com',
          address: '456 Law St',
          fileNumber: 'FILE789'
        }
      };

      const formatted = formatDemographicsData(mockData);
      expect(formatted).toContain('John Doe');
      expect(formatted).toContain('1990-01-01');
      expect(formatted).toContain('Test Insurance');
    });
  });

  describe('preparePrompt', () => {
    const mockData: Demographics = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01',
      gender: 'male',
      maritalStatus: 'married',
      contact: {
        phone: '(555) 555-5555',
        email: 'john.doe@example.com',
        address: '123 Main St'
      },
      emergencyContact: {
        name: 'Jane Doe',
        relationship: 'Spouse',
        phone: '(555) 555-5556'
      },
      insurance: {
        provider: 'Test Insurance',
        claimNumber: 'CLM123456',
        adjustorName: 'Sarah Smith',
        adjustorPhone: '(555) 555-5557',
        adjustorEmail: 'sarah.smith@insurance.com'
      },
      legalRep: {
        name: 'Bob Wilson',
        firm: 'Wilson Law',
        phone: '(555) 555-5558',
        email: 'bob@wilsonlaw.com',
        address: '456 Law St',
        fileNumber: 'FILE789'
      }
    };

    it('prepares brief prompt correctly', () => {
      const briefContent = normalizeWhitespace(defaultPrompts.brief.replace('{data}', ''));
      const prompt = preparePrompt(mockData, 'brief');
      expect(normalizeWhitespace(prompt)).toContain(briefContent);
      expect(prompt).toContain('John Doe');
      expect(prompt).toContain('Guidelines:');
    });

    it('prepares standard prompt correctly', () => {
      const standardContent = normalizeWhitespace(defaultPrompts.standard.replace('{data}', ''));
      const prompt = preparePrompt(mockData, 'standard');
      expect(normalizeWhitespace(prompt)).toContain(standardContent);
      expect(prompt).toContain('John Doe');
      expect(prompt).toContain('Include insurance and legal representation details');
    });

    it('prepares detailed prompt correctly', () => {
      const detailedContent = normalizeWhitespace(defaultPrompts.detailed.replace('{data}', ''));
      const prompt = preparePrompt(mockData, 'detailed');
      expect(normalizeWhitespace(prompt)).toContain(detailedContent);
      expect(prompt).toContain('John Doe');
      expect(prompt).toContain('Detail insurance coverage');
    });
  });
});