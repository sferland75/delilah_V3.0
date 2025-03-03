import '@testing-library/jest-dom';
import { symptomsSchema, defaultSymptomsState } from '../../schema';
import { mockPhysicalSymptom, mockCognitiveSymptom, mockEmotionalSymptom } from '../test-utils';

describe('Symptoms Schema', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.resetModules();
  });

  describe('Schema Validation', () => {
    it('validates default state', async () => {
      const result = await symptomsSchema.safeParseAsync(defaultSymptomsState);
      expect(result.success).toBe(true);
    });

    it('validates valid physical symptoms', async () => {
      const data = {
        ...defaultSymptomsState,
        physical: [mockPhysicalSymptom]
      };
      const result = await symptomsSchema.safeParseAsync(data);
      expect(result.success).toBe(true);
    });

    it('validates valid cognitive symptoms', async () => {
      const data = {
        ...defaultSymptomsState,
        cognitive: [mockCognitiveSymptom]
      };
      const result = await symptomsSchema.safeParseAsync(data);
      expect(result.success).toBe(true);
    });

    it('validates valid emotional symptoms', async () => {
      const data = {
        ...defaultSymptomsState,
        emotional: [mockEmotionalSymptom]
      };
      const result = await symptomsSchema.safeParseAsync(data);
      expect(result.success).toBe(true);
    });

    it('requires location for physical symptoms', async () => {
      const data = {
        ...defaultSymptomsState,
        physical: [{
          ...mockPhysicalSymptom,
          location: ''
        }]
      };
      const result = await symptomsSchema.safeParseAsync(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['physical', 0, 'location']);
      }
    });

    it('validates severity levels', async () => {
      const data = {
        ...defaultSymptomsState,
        physical: [{
          ...mockPhysicalSymptom,
          severity: 'Invalid' as any
        }]
      };
      const result = await symptomsSchema.safeParseAsync(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['physical', 0, 'severity']);
      }
    });

    it('validates frequency levels', async () => {
      const data = {
        ...defaultSymptomsState,
        cognitive: [{
          ...mockCognitiveSymptom,
          frequency: 'Invalid' as any
        }]
      };
      const result = await symptomsSchema.safeParseAsync(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['cognitive', 0, 'frequency']);
      }
    });

    it('validates symptom types', async () => {
      const data = {
        ...defaultSymptomsState,
        emotional: [{
          ...mockEmotionalSymptom,
          symptom: 'Invalid' as any
        }]
      };
      const result = await symptomsSchema.safeParseAsync(data);
      expect(result.success).toBe(false);
    });
  });
});