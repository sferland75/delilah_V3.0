import { formatDemographicsData, preparePrompt, defaultPrompts } from './prompts';
import { Demographics } from './schema';

describe('Demographics Prompts', () => {
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

  describe('formatDemographicsData', () => {
    it('formats complete demographics data correctly', () => {
      const formatted = formatDemographicsData(mockData);
      
      expect(formatted).toContain('John Doe');
      expect(formatted).toContain('1990-01-01');
      expect(formatted).toContain('(555) 555-5555');
      expect(formatted).toContain('Jane Doe');
      expect(formatted).toContain('Test Insurance');
      expect(formatted).toContain('Bob Wilson');
    });

    it('handles missing optional data', () => {
      const minimalData: Demographics = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        gender: 'male',
        contact: {},
        insurance: {
          provider: 'Test Insurance',
          claimNumber: 'CLM123456',
          adjustorName: 'Sarah Smith'
        },
        legalRep: {
          name: 'Bob Wilson',
          firm: 'Wilson Law',
          fileNumber: 'FILE789'
        }
      };

      const formatted = formatDemographicsData(minimalData);
      
      expect(formatted).toContain('Not provided');
      expect(formatted).not.toContain('undefined');
      expect(formatted).toContain('John Doe');
      expect(formatted).toContain('Test Insurance');
    });
  });

  describe('preparePrompt', () => {
    it('prepares brief prompt correctly', () => {
      const prompt = preparePrompt(mockData, 'brief');
      
      expect(prompt).toContain(defaultPrompts.brief);
      expect(prompt).toContain('John Doe');
      expect(prompt).toContain('Guidelines:');
    });

    it('prepares standard prompt correctly', () => {
      const prompt = preparePrompt(mockData, 'standard');
      
      expect(prompt).toContain(defaultPrompts.standard);
      expect(prompt).toContain('John Doe');
      expect(prompt).toContain('Include insurance and legal representation details');
    });

    it('prepares detailed prompt correctly', () => {
      const prompt = preparePrompt(mockData, 'detailed');
      
      expect(prompt).toContain(defaultPrompts.detailed);
      expect(prompt).toContain('John Doe');
      expect(prompt).toContain('Detail insurance coverage');
    });

    it('maintains guideline structure in all prompt types', () => {
      const prompts = {
        brief: preparePrompt(mockData, 'brief'),
        standard: preparePrompt(mockData, 'standard'),
        detailed: preparePrompt(mockData, 'detailed')
      };

      Object.values(prompts).forEach(prompt => {
        expect(prompt).toContain('Guidelines:');
        expect(prompt).toContain('[Client Demographics]');
      });
    });
  });
});