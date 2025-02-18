import { generateInjuriesNarrative } from './generate';
import { generateWithClaude } from '../../services/claude';

jest.mock('../../services/claude', () => ({
  generateWithClaude: jest.fn()
}));

describe('generateInjuriesNarrative', () => {
  const mockData = {
    date: '2025-02-17',
    injuries: [
      {
        category: 'physical',
        type: 'Fracture',
        description: 'Left wrist fracture',
        resolved: true,
        resolutionDate: '2025-03-17'
      },
      {
        category: 'psychological',
        type: 'PTSD',
        description: 'Post-traumatic stress from workplace incident',
        resolved: false
      }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call Claude with properly formatted data', async () => {
    await generateInjuriesNarrative(mockData);
    
    expect(generateWithClaude).toHaveBeenCalled();
    const prompt = (generateWithClaude as jest.Mock).mock.calls[0][0];
    
    expect(prompt).toContain('2025-02-17');
    expect(prompt).toContain('Left wrist fracture');
    expect(prompt).toContain('PTSD');
    expect(prompt).toContain('Post-traumatic stress');
  });

  it('should handle empty data gracefully', async () => {
    const emptyData = {
      date: '',
      injuries: []
    };

    await generateInjuriesNarrative(emptyData);
    const prompt = (generateWithClaude as jest.Mock).mock.calls[0][0];
    expect(prompt).toContain('No injuries provided');
  });
});