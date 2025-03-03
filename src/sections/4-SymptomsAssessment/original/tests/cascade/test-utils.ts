import { SymptomsStateManager } from '../../../../test/cascade/StateManager';

export const setupTestState = async (options: {
  cognitive?: boolean;
  physical?: boolean;
  emotional?: boolean;
}) => {
  const stateManager = new SymptomsStateManager();
  
  if (options.cognitive) {
    await stateManager.save('cognitive', {
      selectedSymptoms: ['memory', 'concentration'],
      severity: 'moderate',
      duration: '1-3 months'
    });
  }
  
  if (options.physical) {
    await stateManager.save('physical', {
      locations: [
        { x: 100, y: 100, label: 'neck' },
        { x: 200, y: 300, label: 'lower back' }
      ],
      painTypes: ['sharp', 'dull'],
      intensity: 7
    });
  }
  
  if (options.emotional) {
    await stateManager.save('emotional', {
      symptoms: ['anxiety', 'depression'],
      intensity: 6,
      frequency: 'daily'
    });
  }
  
  return stateManager;
};

export const mockSymptomsData = {
  cognitive: {
    symptoms: ['memory', 'concentration', 'confusion'],
    severityLevels: ['mild', 'moderate', 'severe'],
    durations: ['<1 month', '1-3 months', '3-6 months', '>6 months']
  },
  physical: {
    bodyRegions: ['neck', 'shoulder', 'back', 'knee'],
    painTypes: ['sharp', 'dull', 'throbbing', 'burning'],
    intensityScale: Array.from({ length: 11 }, (_, i) => i)
  },
  emotional: {
    symptoms: ['anxiety', 'depression', 'irritability', 'mood swings'],
    frequencies: ['daily', 'weekly', 'monthly', 'occasionally']
  }
};

export const validateState = async (section: string) => {
  const stateManager = new SymptomsStateManager();
  return stateManager.validate(section);
};
