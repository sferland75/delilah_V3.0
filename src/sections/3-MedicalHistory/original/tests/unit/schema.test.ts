import { medicalHistorySchema, defaultFormState } from '../../schema';
import { mockMedicalHistory } from '../utils/test-utils';

describe('Medical History Schema', () => {
  it('accepts valid medical history data', async () => {
    const result = await medicalHistorySchema.safeParseAsync(mockMedicalHistory);
    expect(result.success).toBe(true);
  });

  it('validates required injury fields', async () => {
    const invalidData = {
      ...mockMedicalHistory,
      injury: {
        ...mockMedicalHistory.injury,
        date: ''  // Required field
      }
    };
    const result = await medicalHistorySchema.safeParseAsync(invalidData);
    expect(result.success).toBe(false);
  });

  it('validates medication status values', async () => {
    const invalidData = {
      ...mockMedicalHistory,
      currentMedications: [{
        ...mockMedicalHistory.currentMedications[0],
        status: 'invalid-status'  // Invalid enum value
      }]
    };
    const result = await medicalHistorySchema.safeParseAsync(invalidData);
    expect(result.success).toBe(false);
  });

  it('provides default form state with required fields', () => {
    expect(defaultFormState).toHaveProperty('data.preExistingConditions');
    expect(defaultFormState).toHaveProperty('data.injury');
    expect(defaultFormState).toHaveProperty('data.currentMedications');
    expect(defaultFormState).toHaveProperty('config.mode');
    expect(defaultFormState).toHaveProperty('config.activeTab');
  });
});