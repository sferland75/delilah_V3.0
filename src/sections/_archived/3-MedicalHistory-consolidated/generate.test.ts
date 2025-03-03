import { generateMedicalHistoryNarrative } from './generate';
import { generateWithClaude } from '../../services/claude';

// Mock the Claude service
jest.mock('../../services/claude', () => ({
  generateWithClaude: jest.fn()
}));

describe('generateMedicalHistoryNarrative', () => {
  const mockData = {
    preExisting: 'Hypertension, Type 2 Diabetes',
    currentConditions: 'Lower back pain, reduced mobility',
    injury: {
      type: 'Musculoskeletal',
      mechanism: 'Workplace lifting incident',
      immediateSymptoms: 'Acute lower back pain with radiation to left leg'
    },
    medications: [{
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'twice daily',
      purpose: 'diabetes management'
    }],
    treatments: [{
      provider: 'Dr. Smith',
      type: 'Physical Therapy',
      frequency: 'twice weekly',
      notes: 'Focus on core strengthening'
    }]
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call Claude with properly formatted data', async () => {
    const mockResponse = {
      content: 'Generated medical history narrative'
    };
    (generateWithClaude as jest.Mock).mockResolvedValue(mockResponse);

    await generateMedicalHistoryNarrative(mockData);

    expect(generateWithClaude).toHaveBeenCalled();
    const prompt = (generateWithClaude as jest.Mock).mock.calls[0][0];
    
    // Verify prompt contains key data points
    expect(prompt).toContain('Hypertension, Type 2 Diabetes');
    expect(prompt).toContain('Workplace lifting incident');
    expect(prompt).toContain('Metformin');
    expect(prompt).toContain('Physical Therapy');
  });

  it('should handle empty data gracefully', async () => {
    const emptyData = {
      preExisting: '',
      currentConditions: '',
      injury: {
        type: '',
        mechanism: '',
        immediateSymptoms: ''
      },
      medications: [],
      treatments: []
    };

    await generateMedicalHistoryNarrative(emptyData);
    expect(generateWithClaude).toHaveBeenCalled();
  });
});