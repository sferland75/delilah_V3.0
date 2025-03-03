import { functionalStatusSchema, defaultFormState } from '../../schema';
import { z } from 'zod';

describe('Functional Status Schema', () => {
  describe('Schema Validation', () => {
    it('validates value ranges correctly', async () => {
      const invalidData = {
        ...defaultFormState,
        data: {
          ...defaultFormState.data,
          rangeOfMotion: {
            ...defaultFormState.data.rangeOfMotion,
            cervical: {
              ...defaultFormState.data.rangeOfMotion.cervical,
              flexion: { value: 500, notes: '' }
            }
          }
        }
      };

      const result = await functionalStatusSchema.safeParseAsync(invalidData);
      expect(result.success).toBe(false);
      
      if (!result.success) {
        const flexionError = result.error.issues.find(i => 
          i.path.includes('cervical') && 
          i.path.includes('flexion') && 
          i.path.includes('value')
        );
        expect(flexionError).toBeDefined();
        expect(flexionError?.message.toLowerCase()).toContain('between 0 and 180');
      }
    });
  });
});