import { defaultFormState } from '../../schema';
import { type FormState } from '../../types';

describe('Medical History Form State', () => {
  it('initializes with valid default state', () => {
    expect(defaultFormState.config.mode).toBe('edit');
    expect(defaultFormState.config.activeTab).toBe('preExisting');
    expect(defaultFormState.isDirty).toBe(false);
    expect(defaultFormState.isValid).toBe(false);
  });

  it('has empty arrays for collection fields', () => {
    expect(defaultFormState.data.preExistingConditions).toEqual([]);
    expect(defaultFormState.data.currentMedications).toEqual([]);
  });

  it('has required config properties', () => {
    const expectedKeys: Array<keyof FormState['config']> = ['mode', 'activeTab'];
    expectedKeys.forEach(key => {
      expect(defaultFormState.config).toHaveProperty(key);
    });
  });

  it('matches expected type structure', () => {
    // Type checking at runtime
    const formState: FormState = defaultFormState;
    expect(formState).toBeTruthy();
    
    // Check nested type structure
    expect(formState.config.mode).toBeDefined();
    expect(typeof formState.config.mode).toBe('string');
    expect(['edit', 'view']).toContain(formState.config.mode);
  });
});