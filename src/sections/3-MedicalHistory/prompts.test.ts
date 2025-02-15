import { formatMedicalHistory, preparePrompt } from './prompts';
import { type MedicalHistory } from './types';

const mockMedicalHistory: MedicalHistory = {
  preExistingConditions: [{
    condition: 'Hypertension',
    diagnosisDate: '2020-01-01',
    status: 'managed',
    details: 'Well controlled with medication'
  }],
  surgeries: [],
  familyHistory: 'No significant family history',
  allergies: ['Penicillin'],
  injury: {
    date: '2024-01-15',
    time: '14:30',
    position: 'Driver',
    impactType: 'Rear',
    circumstance: 'Stopped at red light',
    preparedForImpact: 'No warning before impact',
    immediateSymptoms: 'Neck pain, headache',
    immediateResponse: 'Ambulance called, taken to ER',
    vehicleDamage: 'Significant rear damage',
    subsequentCare: 'Follow-up with family doctor'
  },
  currentMedications: [{
    name: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Daily',
    prescribedFor: 'Hypertension',
    prescribedBy: 'Dr. Smith',
    startDate: '2020-01-01',
    status: 'current'
  }],
  currentTreatments: [{
    provider: 'Dr. Jones',
    type: 'Physiotherapy',
    facility: 'City Rehab',
    startDate: '2024-01-20',
    frequency: 'Twice weekly',
    status: 'ongoing',
    notes: 'Showing improvement'
  }]
};

describe('Medical History Prompts', () => {
  describe('formatMedicalHistory', () => {
    it('formats pre-existing conditions correctly', () => {
      const formatted = formatMedicalHistory(mockMedicalHistory);
      expect(formatted).toContain('Hypertension');
      expect(formatted).toContain('2020-01-01');
      expect(formatted).toContain('managed');
    });

    it('formats injury details correctly', () => {
      const formatted = formatMedicalHistory(mockMedicalHistory);
      expect(formatted).toContain('2024-01-15');
      expect(formatted).toContain('Driver');
      expect(formatted).toContain('Rear');
    });

    it('formats current treatments correctly', () => {
      const formatted = formatMedicalHistory(mockMedicalHistory);
      expect(formatted).toContain('Physiotherapy');
      expect(formatted).toContain('City Rehab');
      expect(formatted).toContain('Twice weekly');
    });

    it('formats medications correctly', () => {
      const formatted = formatMedicalHistory(mockMedicalHistory);
      expect(formatted).toContain('Lisinopril');
      expect(formatted).toContain('10mg');
      expect(formatted).toContain('Daily');
    });

    it('handles empty data gracefully', () => {
      const emptyHistory: MedicalHistory = {
        preExistingConditions: [],
        surgeries: [],
        familyHistory: '',
        allergies: [],
        injury: {
          date: '',
          position: '',
          impactType: '',
          circumstance: '',
          preparedForImpact: '',
          immediateSymptoms: '',
          immediateResponse: '',
          vehicleDamage: '',
          subsequentCare: ''
        },
        currentMedications: [],
        currentTreatments: []
      };
      const formatted = formatMedicalHistory(emptyHistory);
      expect(formatted).toContain('No pre-existing conditions reported');
      expect(formatted).toContain('No current medications reported');
      expect(formatted).toContain('No current treatments reported');
    });
  });

  describe('preparePrompt', () => {
    it('prepares brief prompt correctly', () => {
      const prompt = preparePrompt(mockMedicalHistory, 'brief');
      expect(prompt).toContain('Create a concise 2-3 sentence summary');
      expect(prompt).toContain('Hypertension');
    });

    it('prepares standard prompt correctly', () => {
      const prompt = preparePrompt(mockMedicalHistory, 'standard');
      expect(prompt).toContain('comprehensive medical history');
      expect(prompt).toContain('Pre-existing conditions');
      expect(prompt).toContain('Injury mechanism');
    });

    it('prepares detailed prompt correctly', () => {
      const prompt = preparePrompt(mockMedicalHistory, 'detailed');
      expect(prompt).toContain('thorough medical-legal report');
      expect(prompt).toContain('Biomechanical considerations');
      expect(prompt).toContain('Treatment compliance');
    });

    it('uses standard prompt by default', () => {
      const prompt = preparePrompt(mockMedicalHistory);
      expect(prompt).toContain('comprehensive medical history');
    });
  });
});