/**
 * Functional Status Assessment Context Integration Test
 * 
 * This test validates the integration between the Functional Status section and 
 * the Assessment Context provider, ensuring data flows correctly between them.
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AssessmentProvider } from '@/contexts/AssessmentContext';
import { FunctionalStatusIntegrated } from '@/sections/5-FunctionalStatus/components/FunctionalStatus.integrated';
import * as functionalStatusMapper from '@/services/functionalStatusMapper';

// Mock the components within Functional Status that aren't relevant to this test
jest.mock('@/sections/5-FunctionalStatus/components/MobilityAssessmentSection', () => ({
  MobilityAssessmentSection: () => <div data-testid="mobility-assessment-section">Mobility Assessment content</div>
}));

jest.mock('@/sections/5-FunctionalStatus/components/UpperExtremityFunctionSection', () => ({
  UpperExtremityFunctionSection: () => <div data-testid="upper-extremity-section">Upper Extremity Function content</div>
}));

jest.mock('@/sections/5-FunctionalStatus/components/PostureToleranceSection', () => ({
  PostureToleranceSection: () => <div data-testid="posture-tolerance-section">Posture Tolerance content</div>
}));

jest.mock('@/sections/5-FunctionalStatus/components/BergBalanceSection', () => ({
  BergBalanceSection: () => <div data-testid="berg-balance-section">Berg Balance content</div>
}));

// Mock the form persistence hook
jest.mock('@/hooks/useFormPersistence', () => ({
  useFormPersistence: () => ({
    persistForm: jest.fn()
  })
}));

// Spy on the mapper functions instead of fully mocking them
// This allows us to test the real functionality while still tracking calls
jest.spyOn(functionalStatusMapper, 'mapContextToForm');
jest.spyOn(functionalStatusMapper, 'mapFormToContext');

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
      <FunctionalStatusIntegrated />
    </AssessmentProvider>
  );
};

describe('Functional Status Context Integration', () => {
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
    (functionalStatusMapper.mapContextToForm as jest.Mock).mockRestore();
    (functionalStatusMapper.mapFormToContext as jest.Mock).mockRestore();
  });
  
  it('loads empty form when no context data exists', () => {
    render(<TestComponent />);
    
    // Should not show data loaded alert
    expect(screen.queryByText('Data Loaded From Assessment Context')).not.toBeInTheDocument();
    
    // Should still render the form
    expect(screen.getByText('Functional Status')).toBeInTheDocument();
    expect(screen.getByTestId('mobility-assessment-section')).toBeInTheDocument();
  });
  
  it('loads data from assessment context when available', () => {
    // Create initial context data
    const initialData = {
      functionalStatus: {
        mobilityAssessment: {
          transferability: {
            bedMobility: 'Independent',
            sitToStand: 'Requires minimal assistance'
          },
          ambulation: {
            indoorAmbulation: 'Independent with walker',
            outdoorAmbulation: 'Requires moderate assistance'
          },
          stairNavigation: 'Requires significant assistance',
          assistiveDevices: ['Walker', 'Wheelchair for long distances']
        },
        upperExtremityFunction: {
          dominantHand: 'Right',
          gripStrength: {
            rightHand: '35 lbs',
            leftHand: '25 lbs'
          },
          fineMotorSkills: 'Intact',
          reachingAbilities: 'Limited range of motion overhead'
        },
        postureTolerances: {
          standingTolerance: '15 minutes',
          sittingTolerance: '45 minutes',
          notes: 'Experiences increased back pain with prolonged standing'
        },
        bergBalanceScale: {
          totalScore: 42,
          riskLevel: 'Moderate risk of falls',
          notes: 'Client demonstrates good static balance but reduced dynamic balance'
        }
      }
    };
    
    render(<TestComponent initialData={initialData} />);
    
    // Should show data loaded alert
    expect(screen.getByText('Data Loaded From Assessment Context')).toBeInTheDocument();
    
    // Should call mapper with context data
    expect(functionalStatusMapper.mapContextToForm).toHaveBeenCalledWith(
      initialData.functionalStatus,
      expect.anything()
    );
  });
  
  it('updates assessment context when form is submitted', async () => {
    const user = userEvent.setup();
    render(<TestComponent />);
    
    // Submit the form
    await user.click(screen.getByText('Save Functional Status'));
    
    // mapFormToContext should be called
    expect(functionalStatusMapper.mapFormToContext).toHaveBeenCalled();
    
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
      functionalStatus: {
        mobilityAssessment: {
          transferability: {
            bedMobility: 'Independent',
            sitToStand: 'Requires minimal assistance'
          }
        }
      }
    };
    
    const user = userEvent.setup();
    render(<TestComponent initialData={initialData} />);
    
    // Submit the form
    await user.click(screen.getByText('Save Functional Status'));
    
    // Wait to ensure context update happens
    await waitFor(() => {
      // Check that localStorage contains all sections
      const savedData = JSON.parse(mockLocalStorage.setItem.mock.calls[0][1]);
      expect(savedData.demographics).toBeDefined();
      expect(savedData.demographics.firstName).toBe('John');
      expect(savedData.medicalHistory).toBeDefined();
      expect(savedData.medicalHistory.pastMedicalHistory.conditions).toHaveLength(1);
      expect(savedData.functionalStatus).toBeDefined();
    });
  });
  
  it('correctly reflects context updates in the UI', async () => {
    // Start with empty context
    const { rerender } = render(<TestComponent />);
    
    // No data loaded alert initially
    expect(screen.queryByText('Data Loaded From Assessment Context')).not.toBeInTheDocument();
    
    // Now rerender with data
    const initialData = {
      functionalStatus: {
        mobilityAssessment: {
          transferability: {
            bedMobility: 'Independent',
            sitToStand: 'Independent'
          },
          assistiveDevices: ['Cane']
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
      functionalStatus: {
        mobilityAssessment: {
          transferability: {
            bedMobility: 'Independent',
            sitToStand: 'Requires minimal assistance'
          }
        }
      }
    };
    
    const user = userEvent.setup();
    render(<TestComponent initialData={initialData} />);
    
    // Reset the form
    await user.click(screen.getByText('Reset'));
    
    // Submit the form with reset data
    await user.click(screen.getByText('Save Functional Status'));
    
    // Wait to ensure context update happens
    await waitFor(() => {
      // Check that demographics data is still preserved
      const savedData = JSON.parse(mockLocalStorage.setItem.mock.calls[0][1]);
      expect(savedData.demographics).toBeDefined();
      expect(savedData.demographics.firstName).toBe('John');
    });
  });
  
  it('maps complex Berg Balance data correctly', () => {
    // Create initial context data
    const initialData = {
      functionalStatus: {
        bergBalanceScale: {
          sitToStand: 3,
          standingUnsupported: 4,
          sittingUnsupported: 4,
          standToSit: 3,
          transfers: 3,
          standingEyesClosed: 2,
          standingFeetTogether: 3,
          reachingForward: 2,
          retrievingObject: 3,
          lookingBehind: 3,
          turning360: 2,
          alternatingStools: 2,
          standingOneFootInFront: 1,
          standingOnOneFoot: 1,
          totalScore: 36,
          riskLevel: 'Medium risk of falls',
          notes: 'Client has difficulty with tasks requiring single leg stance'
        }
      }
    };
    
    render(<TestComponent initialData={initialData} />);
    
    // Should show data loaded alert
    expect(screen.getByText('Data Loaded From Assessment Context')).toBeInTheDocument();
    
    // Should call mapper with complex Berg Balance data
    expect(functionalStatusMapper.mapContextToForm).toHaveBeenCalledWith(
      expect.objectContaining({
        bergBalanceScale: expect.objectContaining({
          totalScore: 36,
          standingOneFootInFront: 1,
          standingOnOneFoot: 1
        })
      }),
      expect.anything()
    );
  });
  
  it('maps upper extremity function data correctly', () => {
    // Create initial context data
    const initialData = {
      functionalStatus: {
        upperExtremityFunction: {
          dominantHand: 'Right',
          gripStrength: {
            rightHand: '35 lbs',
            leftHand: '25 lbs'
          },
          pinchStrength: {
            rightHand: '12 lbs',
            leftHand: '10 lbs'
          },
          fineMotorSkills: 'Intact',
          reachingAbilities: 'Limited range of motion overhead',
          coordination: 'Normal',
          muscleTone: 'Normal'
        }
      }
    };
    
    render(<TestComponent initialData={initialData} />);
    
    // Should show data loaded alert
    expect(screen.getByText('Data Loaded From Assessment Context')).toBeInTheDocument();
    
    // Should call mapper with upper extremity function data
    expect(functionalStatusMapper.mapContextToForm).toHaveBeenCalledWith(
      expect.objectContaining({
        upperExtremityFunction: expect.objectContaining({
          dominantHand: 'Right',
          gripStrength: expect.objectContaining({
            rightHand: '35 lbs',
            leftHand: '25 lbs'
          })
        })
      }),
      expect.anything()
    );
  });
  
  it('exports and imports JSON correctly', async () => {
    // Create initial context data
    const initialData = {
      functionalStatus: {
        mobilityAssessment: {
          transferability: {
            bedMobility: 'Independent',
            sitToStand: 'Requires minimal assistance'
          },
          assistiveDevices: ['Walker']
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
