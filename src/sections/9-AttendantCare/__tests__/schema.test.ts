import { attendantCareSchema } from '../schema';
import { DEFAULT_ACTIVITY } from '../constants';

describe('Attendant Care Schema', () => {
  it('validates a valid form structure', () => {
    const validForm = {
      level1: {
        dress: {
          upperBody: { ...DEFAULT_ACTIVITY, minutes: 10, timesPerWeek: 7 },
          lowerBody: { ...DEFAULT_ACTIVITY, minutes: 15, timesPerWeek: 7 }
        },
        hygiene: {
          bathing: { ...DEFAULT_ACTIVITY, minutes: 20, timesPerWeek: 7 },
          toileting: { ...DEFAULT_ACTIVITY, minutes: 10, timesPerWeek: 21 },
          grooming: { ...DEFAULT_ACTIVITY, minutes: 15, timesPerWeek: 7 }
        },
        mobility: {
          transfers: { ...DEFAULT_ACTIVITY, minutes: 5, timesPerWeek: 14 },
          positioning: { ...DEFAULT_ACTIVITY, minutes: 5, timesPerWeek: 14 },
          walking: { ...DEFAULT_ACTIVITY, minutes: 10, timesPerWeek: 7 }
        }
      },
      level2: {
        supervision: {
          medication: { ...DEFAULT_ACTIVITY, minutes: 5, timesPerWeek: 21 },
          safety: { ...DEFAULT_ACTIVITY, minutes: 15, timesPerWeek: 7 },
          direction: { ...DEFAULT_ACTIVITY, minutes: 10, timesPerWeek: 7 }
        }
      },
      level3: {
        complexCare: {
          woundCare: { ...DEFAULT_ACTIVITY, minutes: 15, timesPerWeek: 3 },
          catheter: { ...DEFAULT_ACTIVITY, minutes: 10, timesPerWeek: 14 },
          feeding: { ...DEFAULT_ACTIVITY, minutes: 20, timesPerWeek: 21 }
        }
      }
    };

    const result = attendantCareSchema.safeParse(validForm);
    expect(result.success).toBe(true);
  });

  it('requires all levels in the form structure', () => {
    const partialForm = {
      level1: {
        dress: {
          upperBody: { ...DEFAULT_ACTIVITY, minutes: 10, timesPerWeek: 7 },
          lowerBody: { ...DEFAULT_ACTIVITY, minutes: 15, timesPerWeek: 7 }
        },
        hygiene: {
          bathing: { ...DEFAULT_ACTIVITY, minutes: 20, timesPerWeek: 7 },
          toileting: { ...DEFAULT_ACTIVITY, minutes: 10, timesPerWeek: 21 },
          grooming: { ...DEFAULT_ACTIVITY, minutes: 15, timesPerWeek: 7 }
        },
        mobility: {
          transfers: { ...DEFAULT_ACTIVITY, minutes: 5, timesPerWeek: 14 },
          positioning: { ...DEFAULT_ACTIVITY, minutes: 5, timesPerWeek: 14 },
          walking: { ...DEFAULT_ACTIVITY, minutes: 10, timesPerWeek: 7 }
        }
      }
      // Missing level2 and level3
    };

    const result = attendantCareSchema.safeParse(partialForm);
    expect(result.success).toBe(false);
  });

  it('rejects negative minutes', () => {
    const invalidForm = {
      level1: {
        dress: {
          upperBody: { ...DEFAULT_ACTIVITY, minutes: -10, timesPerWeek: 7 },
          lowerBody: { ...DEFAULT_ACTIVITY, minutes: 15, timesPerWeek: 7 }
        },
        hygiene: {
          bathing: { ...DEFAULT_ACTIVITY, minutes: 20, timesPerWeek: 7 },
          toileting: { ...DEFAULT_ACTIVITY, minutes: 10, timesPerWeek: 21 },
          grooming: { ...DEFAULT_ACTIVITY, minutes: 15, timesPerWeek: 7 }
        },
        mobility: {
          transfers: { ...DEFAULT_ACTIVITY, minutes: 5, timesPerWeek: 14 },
          positioning: { ...DEFAULT_ACTIVITY, minutes: 5, timesPerWeek: 14 },
          walking: { ...DEFAULT_ACTIVITY, minutes: 10, timesPerWeek: 7 }
        }
      },
      level2: {
        supervision: {
          medication: { ...DEFAULT_ACTIVITY, minutes: 5, timesPerWeek: 21 },
          safety: { ...DEFAULT_ACTIVITY, minutes: 15, timesPerWeek: 7 },
          direction: { ...DEFAULT_ACTIVITY, minutes: 10, timesPerWeek: 7 }
        }
      },
      level3: {
        complexCare: {
          woundCare: { ...DEFAULT_ACTIVITY, minutes: 15, timesPerWeek: 3 },
          catheter: { ...DEFAULT_ACTIVITY, minutes: 10, timesPerWeek: 14 },
          feeding: { ...DEFAULT_ACTIVITY, minutes: 20, timesPerWeek: 21 }
        }
      }
    };

    const result = attendantCareSchema.safeParse(invalidForm);
    expect(result.success).toBe(false);
  });

  it('rejects negative times per week', () => {
    const invalidForm = {
      level1: {
        dress: {
          upperBody: { ...DEFAULT_ACTIVITY, minutes: 10, timesPerWeek: -7 },
          lowerBody: { ...DEFAULT_ACTIVITY, minutes: 15, timesPerWeek: 7 }
        },
        hygiene: {
          bathing: { ...DEFAULT_ACTIVITY, minutes: 20, timesPerWeek: 7 },
          toileting: { ...DEFAULT_ACTIVITY, minutes: 10, timesPerWeek: 21 },
          grooming: { ...DEFAULT_ACTIVITY, minutes: 15, timesPerWeek: 7 }
        },
        mobility: {
          transfers: { ...DEFAULT_ACTIVITY, minutes: 5, timesPerWeek: 14 },
          positioning: { ...DEFAULT_ACTIVITY, minutes: 5, timesPerWeek: 14 },
          walking: { ...DEFAULT_ACTIVITY, minutes: 10, timesPerWeek: 7 }
        }
      },
      level2: {
        supervision: {
          medication: { ...DEFAULT_ACTIVITY, minutes: 5, timesPerWeek: 21 },
          safety: { ...DEFAULT_ACTIVITY, minutes: 15, timesPerWeek: 7 },
          direction: { ...DEFAULT_ACTIVITY, minutes: 10, timesPerWeek: 7 }
        }
      },
      level3: {
        complexCare: {
          woundCare: { ...DEFAULT_ACTIVITY, minutes: 15, timesPerWeek: 3 },
          catheter: { ...DEFAULT_ACTIVITY, minutes: 10, timesPerWeek: 14 },
          feeding: { ...DEFAULT_ACTIVITY, minutes: 20, timesPerWeek: 21 }
        }
      }
    };

    const result = attendantCareSchema.safeParse(invalidForm);
    expect(result.success).toBe(false);
  });
});
