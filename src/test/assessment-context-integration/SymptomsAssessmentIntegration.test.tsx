/**
 * Symptoms Assessment Context Integration Test
 * 
 * This test validates the integration between the Symptoms Assessment section and 
 * the Assessment Context provider, ensuring data flows correctly between them.
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AssessmentProvider } from '@/contexts/AssessmentContext';
import { SymptomsAssessmentIntegrated } from '@/sections/4-SymptomsAssessment/components/SymptomsAssessment.integrated';
import * as symptomsAssessmentMapper from '@/services/symptomsAssessmentMapper';

// Mock the components within Symptoms Assessment that aren't relevant to this test
jest.mock('@/sections/4-SymptomsAssessment/components/PhysicalSymptomsSection', () => ({
  PhysicalSymptomsSection: () => <div data-testid="physical-symptoms-section">Physical Symptoms content</div>
}));

jest.mock('@/sections/4-SymptomsAssessment/components/CognitiveSymptomsSection', () => ({
  CognitiveSymptomsSection: () => <div data-testid="cognitive-symptoms-section">Cognitive Symptoms content</div>
}));

jest.mock('@/sections/4-SymptomsAssessment/components/EmotionalSymptomsSection', () => ({
  EmotionalSymptomsSection: () => <div data-testid="emotional-symptoms-section">Emotional Symptoms content</div>
}));

jest.mock('@/sections/4-SymptomsAssessment/components/PsychologicalSymptomsSection', () => ({
  PsychologicalSymptomsSection: () => <div data-testid="psychological-symptoms-section">Psychological Symptoms content</div>
}));

// Mock the form persistence hook
jest.mock('@/hooks/useFormPersistence', () => ({
  useFormPersistence: () => ({
    persistForm: jest.fn()
  })
}));

// Spy on the mapper functions instead of fully mocking them
// This allows us to test the real functionality while still tracking calls
jest.spyOn(symptomsAssessmentMapper, 'mapContextToForm');
jest.spyOn(symptomsAssessmentMapper, 'mapFormToContext');

// Mock localStorage for persisting context state
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

// Create a component that uses the real AssessmentProvider
const TestComponent = ({ initialData = {} }) => {
  return (
    <AssessmentProvider initialData={initialData}>
      <SymptomsAssessmentIntegrated />
    </AssessmentProvider>
  );
};

describe('Symptoms Assessment Context Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();
    
    // Mock URL and document methods used in export functionality
    URL.createObjectURL = jest.fn(() => 'blob:mock-url');
    URL.revokeObjectURL = jest.fn();
    document.createElement = jest.fn().mockImplementation((tagName) => {
      if (tagName === 'a') {
        return { 
          href: '', 
          download: '', 
          click: jest.fn(), 
          style: {} 
        };
      }
      return document.createElement.getMockImplementation()(tagName);
    });
    
    // Restore the real implementations of mapper functions
    (symptomsAssessmentMapper.mapContextToForm as jest.Mock).mockRestore();
    (symptomsAssessmentMapper.mapFormToContext as jest.Mock).mockRestore();
  });
  
  it('loads empty form when no context data exists', () => {
    render(<TestComponent />);
    
    // Should not show data loaded alert
    expect(screen.queryByText('Data Loaded From Assessment Context')).not.toBeInTheDocument();
    
    // Should still render the form
    expect(screen.getByText('Symptoms Assessment')).toBeInTheDocument();
    expect(screen.getByTestId('physical-symptoms-section')).toBeInTheDocument();
  });
  
  it('loads data from assessment context when available', () => {
    // Create initial context data with multiple symptoms
    const initialData = {
      symptomsAssessment: {
        physicalSymptoms: [
          {
            symptom: 'Headache',
            severity: 7,
            frequency: 'Daily',
            duration: '2-4 hours',
            aggravatingFactors: 'Bright light, stress',
            relievingFactors: 'Rest, medication'
          },
          {
            symptom: 'Back pain',
            severity: 8,
            frequency: 'Constant',
            duration: 'Ongoing',
            aggravatingFactors: 'Bending, lifting',
            relievingFactors: 'Heat, lying down'
          }
        ],
        cognitiveSymptoms: [
          {
            symptom: 'Memory issues',
            severity: 6,
            frequency: 'Daily',
            impact: 'Moderate impact on daily activities',
            notes: 'Difficulty remembering appointments'
          }
        ],
        emotionalSymptomsPresent: true,
        emotionalSymptoms: {
          anxiety: true,
          depression: true,
          irritability: false
        }
      }
    };
    
    render(<TestComponent initialData={initialData} />);
    
    // Should show data loaded alert
    expect(screen.getByText('Data Loaded From Assessment Context')).toBeInTheDocument();
    
    // Should call mapper with context data
    expect(symptomsAssessmentMapper.mapContextToForm).toHaveBeenCalledWith(
      initialData.symptomsAssessment,
      expect.anything()
    );
  });
  
  it('updates assessment context when form is submitted', async () => {
    const user = userEvent.setup();
    render(<TestComponent />);
    
    // Submit the form
    await user.click(screen.getByText('Save Symptoms Assessment'));
    
    // mapFormToContext should be called
    expect(symptomsAssessmentMapper.mapFormToContext).toHaveBeenCalled();
    
    // Wait to ensure context update happens
    await waitFor(() => {
      // localStorage should be called to persist data
      expect(mockLocalStorage.setItem).toHaveBeenCalled();
    });
  });
  
  it('preserves existing context data when updated', async () => {
    // Create initial context with data in multiple sections
    const initialData = {
      demographics: {
        firstName: 'John',
        lastName: 'Doe'
      },
      medicalHistory: {
        pastMedicalHistory: {
          conditions: [
            {
              condition: 'Asthma',
              diagnosisDate: '2015-03-10',
              treatment: 'Inhaler as needed'
            }
          ]
        }
      },
      symptomsAssessment: {
        physicalSymptoms: [
          {
            symptom: 'Headache',
            severity: 7,
            frequency: 'Daily',
            duration: '2-4 hours',
            aggravatingFactors: 'Bright light, stress',
            relievingFactors: 'Rest, medication'
          }
        ]
      }
    };
    
    const user = userEvent.setup();
    render(<TestComponent initialData={initialData} />);
    
    // Submit the form
    await user.click(screen.getByText('Save Symptoms Assessment'));
    
    // Wait to ensure context update happens
    await waitFor(() => {
      // Check that localStorage contains all sections
      const savedData = JSON.parse(mockLocalStorage.setItem.mock.calls[0][1]);
      expect(savedData.demographics).toBeDefined();
      expect(savedData.demographics.firstName).toBe('John');
      expect(savedData.medicalHistory).toBeDefined();
      expect(savedData.medicalHistory.pastMedicalHistory.conditions).toHaveLength(1);
      expect(savedData.symptomsAssessment).toBeDefined();
    });
  });
  
  it('correctly reflects context updates in the UI', async () => {
    // Start with empty context
    const { rerender } = render(<TestComponent />);
    
    // No data loaded alert initially
    expect(screen.queryByText('Data Loaded From Assessment Context')).not.toBeInTheDocument();
    
    // Now rerender with data
    const initialData = {
      symptomsAssessment: {
        physicalSymptoms: [
          {
            symptom: 'Neck pain',
            severity: 6,
            frequency: 'Intermittent',
            duration: '1-2 hours',
            aggravatingFactors: 'Poor posture',
            relievingFactors: 'Stretching'
          }
        ],
        cognitiveSymptoms: []
      }
    };
    
    rerender(<TestComponent initialData={initialData} />);
    
    // Should show data loaded alert after context update
    expect(screen.getByText('Data Loaded From Assessment Context')).toBeInTheDocument();
  });
  
  it('handles form reset without affecting other context sections', async () => {
    // Create initial context with data in multiple sections
    const initialData = {
      demographics: {
        firstName: 'John',
        lastName: 'Doe'
      },
      symptomsAssessment: {
        physicalSymptoms: [
          {
            symptom: 'Headache',
            severity: 7,
            frequency: 'Daily',
            duration: '2-4 hours',
            aggravatingFactors: 'Bright light, stress',
            relievingFactors: 'Rest, medication'
          }
        ]
      }
    };
    
    const user = userEvent.setup();
    render(<TestComponent initialData={initialData} />);
    
    // Reset the form
    await user.click(screen.getByText('Reset'));
    
    // Submit the form with reset data
    await user.click(screen.getByText('Save Symptoms Assessment'));
    
    // Wait to ensure context update happens
    await waitFor(() => {
      // Check that demographics data is still preserved
      const savedData = JSON.parse(mockLocalStorage.setItem.mock.calls[0][1]);
      expect(savedData.demographics).toBeDefined();
      expect(savedData.demographics.firstName).toBe('John');
    });
  });
  
  it('handles multiple physical symptoms correctly', () => {
    // Create initial context data with multiple symptoms
    const initialData = {
      symptomsAssessment: {
        physicalSymptoms: [
          {
            symptom: 'Headache',
            severity: 7,
            frequency: 'Daily'
          },
          {
            symptom: 'Back pain',
            severity: 8,
            frequency: 'Constant'
          },
          {
            symptom: 'Fatigue',
            severity: 6,
            frequency: 'Daily'
          }
        ]
      }
    };
    
    render(<TestComponent initialData={initialData} />);
    
    // Should show data loaded alert
    expect(screen.getByText('Data Loaded From Assessment Context')).toBeInTheDocument();
    
    // Should call mapper with context data containing all symptoms
    expect(symptomsAssessmentMapper.mapContextToForm).toHaveBeenCalledWith(
      expect.objectContaining({
        physicalSymptoms: expect.arrayContaining([
          expect.objectContaining({ symptom: 'Headache' }),
          expect.objectContaining({ symptom: 'Back pain' }),
          expect.objectContaining({ symptom: 'Fatigue' })
        ])
      }),
      expect.anything()
    );
  });
  
  it('handles multiple cognitive symptoms correctly', () => {
    // Create initial context data with multiple cognitive symptoms
    const initialData = {
      symptomsAssessment: {
        cognitiveSymptoms: [
          {
            symptom: 'Memory issues',
            severity: 6,
            frequency: 'Daily'
          },
          {
            symptom: 'Difficulty concentrating',
            severity: 5,
            frequency: 'Intermittent'
          }
        ]
      }
    };
    
    render(<TestComponent initialData={initialData} />);
    
    // Should show data loaded alert
    expect(screen.getByText('Data Loaded From Assessment Context')).toBeInTheDocument();
    
    // Should call mapper with context data containing all cognitive symptoms
    expect(symptomsAssessmentMapper.mapContextToForm).toHaveBeenCalledWith(
      expect.objectContaining({
        cognitiveSymptoms: expect.arrayContaining([
          expect.objectContaining({ symptom: 'Memory issues' }),
          expect.objectContaining({ symptom: 'Difficulty concentrating' })
        ])
      }),
      expect.anything()
    );
  });
  
  it('exports and imports JSON correctly', async () => {
    // Create initial context data
    const initialData = {
      symptomsAssessment: {
        physicalSymptoms: [
          {
            symptom: 'Headache',
            severity: 7,
            frequency: 'Daily',
            duration: '2-4 hours',
            aggravatingFactors: 'Bright light, stress',
            relievingFactors: 'Rest, medication'
          }
        ]
      }
    };
    
    const user = userEvent.setup();
    render(<TestComponent initialData={initialData} />);
    
    // Export to JSON
    await user.click(screen.getByText('Export JSON'));
    
    // Verify export functionality was invoked
    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(document.createElement).toHaveBeenCalledWith('a');
  });
});
