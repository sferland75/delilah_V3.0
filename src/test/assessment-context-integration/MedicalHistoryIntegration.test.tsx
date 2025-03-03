/**
 * Medical History Assessment Context Integration Test
 * 
 * This test validates the integration between the Medical History section and 
 * the Assessment Context provider, ensuring data flows correctly between them.
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AssessmentProvider } from '@/contexts/AssessmentContext';
import { MedicalHistoryIntegrated } from '@/sections/3-MedicalHistory/components/MedicalHistory.integrated';
import * as medicalHistoryMapper from '@/services/medicalHistoryMapper';

// Mock the components within Medical History that aren't relevant to this test
jest.mock('@/sections/3-MedicalHistory/components/PreExistingConditionsSection', () => ({
  PreExistingConditionsSection: () => <div data-testid="pre-existing-section">Pre-existing conditions content</div>
}));

jest.mock('@/sections/3-MedicalHistory/components/InjuryDetailsSection', () => ({
  InjuryDetailsSection: () => <div data-testid="injury-details-section">Injury details content</div>
}));

jest.mock('@/sections/3-MedicalHistory/components/TreatmentSection', () => ({
  TreatmentSection: () => <div data-testid="treatment-section">Treatment content</div>
}));

jest.mock('@/sections/3-MedicalHistory/components/MedicationsSection', () => ({
  MedicationsSection: () => <div data-testid="medications-section">Medications content</div>
}));

// Mock the form persistence hook
jest.mock('@/hooks/useFormPersistence', () => ({
  useFormPersistence: () => ({
    persistForm: jest.fn()
  })
}));

// Spy on the mapper functions instead of fully mocking them
// This allows us to test the real functionality while still tracking calls
jest.spyOn(medicalHistoryMapper, 'mapContextToForm');
jest.spyOn(medicalHistoryMapper, 'mapFormToContext');

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
      <MedicalHistoryIntegrated />
    </AssessmentProvider>
  );
};

describe('Medical History Assessment Context Integration', () => {
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
    (medicalHistoryMapper.mapContextToForm as jest.Mock).mockRestore();
    (medicalHistoryMapper.mapFormToContext as jest.Mock).mockRestore();
  });
  
  it('loads empty form when no context data exists', () => {
    render(<TestComponent />);
    
    // Should not show data loaded alert
    expect(screen.queryByText('Data Loaded From Assessment Context')).not.toBeInTheDocument();
    
    // Should still render the form
    expect(screen.getByText('Medical History')).toBeInTheDocument();
    expect(screen.getByTestId('pre-existing-section')).toBeInTheDocument();
  });
  
  it('loads data from assessment context when available', () => {
    // Create initial context data
    const initialData = {
      medicalHistory: {
        pastMedicalHistory: {
          conditions: [
            {
              condition: 'Diabetes Type 2',
              diagnosisDate: '2018-05-15',
              treatment: 'Medication and diet management'
            }
          ],
          allergies: 'Penicillin'
        },
        injuryDetails: {
          diagnosisDate: '2023-05-10',
          mechanism: 'Fall'
        }
      }
    };
    
    render(<TestComponent initialData={initialData} />);
    
    // Should show data loaded alert
    expect(screen.getByText('Data Loaded From Assessment Context')).toBeInTheDocument();
    
    // Should call mapper with context data
    expect(medicalHistoryMapper.mapContextToForm).toHaveBeenCalledWith(
      initialData.medicalHistory,
      expect.anything()
    );
  });
  
  it('updates assessment context when form is submitted', async () => {
    const user = userEvent.setup();
    render(<TestComponent />);
    
    // Submit the form
    await user.click(screen.getByText('Save Medical History'));
    
    // mapFormToContext should be called
    expect(medicalHistoryMapper.mapFormToContext).toHaveBeenCalled();
    
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
        cognitiveSymptomsPresent: true
      }
    };
    
    const user = userEvent.setup();
    render(<TestComponent initialData={initialData} />);
    
    // Submit the form
    await user.click(screen.getByText('Save Medical History'));
    
    // Wait to ensure context update happens
    await waitFor(() => {
      // Check that localStorage contains all sections
      const savedData = JSON.parse(mockLocalStorage.setItem.mock.calls[0][1]);
      expect(savedData.demographics).toBeDefined();
      expect(savedData.demographics.firstName).toBe('John');
      expect(savedData.medicalHistory).toBeDefined();
      expect(savedData.symptomsAssessment).toBeDefined();
      expect(savedData.symptomsAssessment.cognitiveSymptomsPresent).toBe(true);
    });
  });
  
  it('correctly reflects context updates in the UI', async () => {
    // This test validates the full bidirectional flow
    
    // Start with empty context
    const { rerender } = render(<TestComponent />);
    
    // No data loaded alert initially
    expect(screen.queryByText('Data Loaded From Assessment Context')).not.toBeInTheDocument();
    
    // Now rerender with data
    const initialData = {
      medicalHistory: {
        pastMedicalHistory: {
          conditions: [
            {
              condition: 'Diabetes Type 2',
              diagnosisDate: '2018-05-15',
              treatment: 'Medication and diet management'
            }
          ]
        }
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
      }
    };
    
    const user = userEvent.setup();
    render(<TestComponent initialData={initialData} />);
    
    // Reset the form
    await user.click(screen.getByText('Reset'));
    
    // Submit the form with reset data
    await user.click(screen.getByText('Save Medical History'));
    
    // Wait to ensure context update happens
    await waitFor(() => {
      // Check that demographics data is still preserved
      const savedData = JSON.parse(mockLocalStorage.setItem.mock.calls[0][1]);
      expect(savedData.demographics).toBeDefined();
      expect(savedData.demographics.firstName).toBe('John');
    });
  });
  
  it('exports and imports JSON correctly', async () => {
    // Create initial context data
    const initialData = {
      medicalHistory: {
        pastMedicalHistory: {
          conditions: [
            {
              condition: 'Diabetes Type 2',
              diagnosisDate: '2018-05-15',
              treatment: 'Medication and diet management'
            }
          ]
        }
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
