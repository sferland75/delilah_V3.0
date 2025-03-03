import { partialAttendantCareSchema } from '../schema';
import { DEFAULT_ACTIVITY } from '../constants';

describe('Partial Attendant Care Schema', () => {
  it('validates a complete form structure', () => {
    const validForm = {
      level1: {
        dress: {
          upperBody: { ...DEFAULT_ACTIVITY, minutes: 10, timesPerWeek: 7 },
          lowerBody: { ...DEFAULT_ACTIVITY, minutes: 15, timesPerWeek: 7 }
        }
      },
      level2: {
        supervision: {
          medication: { ...DEFAULT_ACTIVITY, minutes: 5, timesPerWeek: 21 }
        }
      },
      level3: {
        complexCare: {
          woundCare: { ...DEFAULT_ACTIVITY, minutes: 15, timesPerWeek: 3 }
        }
      }
    };

    const result = partialAttendantCareSchema.safeParse(validForm);
    expect(result.success).toBe(true);
  });

  it('validates partial level data', () => {
    const partialForm = {
      level1: {
        dress: {
          upperBody: { ...DEFAULT_ACTIVITY, minutes: 10, timesPerWeek: 7 }
        }
      }
    };

    const result = partialAttendantCareSchema.safeParse(partialForm);
    expect(result.success).toBe(true);
  });

  it('validates an empty form', () => {
    const emptyForm = {};

    const result = partialAttendantCareSchema.safeParse(emptyForm);
    expect(result.success).toBe(true);
  });

  it('rejects invalid activity data structure', () => {
    const invalidForm = {
      level1: {
        dress: {
          upperBody: { minutes: "invalid" }  // Missing timesPerWeek and invalid minutes type
        }
      }
    };

    const result = partialAttendantCareSchema.safeParse(invalidForm);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThan(0);
    }
  });

  it('rejects invalid categories', () => {
    const invalidForm = {
      level1: {
        invalidCategory: {  // Category that doesn't exist
          someActivity: { ...DEFAULT_ACTIVITY, minutes: 10, timesPerWeek: 7 }
        }
      }
    };

    const result = partialAttendantCareSchema.safeParse(invalidForm);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThan(0);
    }
  });

  it('allows partial completion of activities', () => {
    const partialForm = {
      level1: {
        dress: {
          upperBody: { minutes: 10 }  // Missing timesPerWeek but valid in partial schema
        }
      }
    };

    const result = partialAttendantCareSchema.safeParse(partialForm);
    expect(result.success).toBe(true);
  });

  it('rejects negative values even in partial form', () => {
    const invalidForm = {
      level1: {
        dress: {
          upperBody: { ...DEFAULT_ACTIVITY, minutes: -10, timesPerWeek: 7 }
        }
      }
    };

    const result = partialAttendantCareSchema.safeParse(invalidForm);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThan(0);
    }
  });

  it('validates form with some empty activities', () => {
    const formWithEmpty = {
      level1: {
        dress: {
          upperBody: { ...DEFAULT_ACTIVITY, minutes: 10, timesPerWeek: 7 },
          lowerBody: {}  // Empty activity
        }
      }
    };

    const result = partialAttendantCareSchema.safeParse(formWithEmpty);
    expect(result.success).toBe(true);
  });

  it('validates form with null values', () => {
    const formWithNull = {
      level1: {
        dress: {
          upperBody: { ...DEFAULT_ACTIVITY, minutes: null, timesPerWeek: null }
        }
      }
    };

    const result = partialAttendantCareSchema.safeParse(formWithNull);
    expect(result.success).toBe(true);
  });

  it('validates form with undefined values', () => {
    const formWithUndefined = {
      level1: {
        dress: {
          upperBody: { ...DEFAULT_ACTIVITY, minutes: undefined, timesPerWeek: undefined }
        }
      }
    };

    const result = partialAttendantCareSchema.safeParse(formWithUndefined);
    expect(result.success).toBe(true);
  });

  it('validates mixed complete and partial activities', () => {
    const mixedForm = {
      level1: {
        dress: {
          upperBody: { ...DEFAULT_ACTIVITY, minutes: 10, timesPerWeek: 7 },  // Complete
          lowerBody: { minutes: 15 }  // Partial
        }
      }
    };

    const result = partialAttendantCareSchema.safeParse(mixedForm);
    expect(result.success).toBe(true);
  });
});