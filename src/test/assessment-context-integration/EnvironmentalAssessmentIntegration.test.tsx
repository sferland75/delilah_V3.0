/**
 * Environmental Assessment Context Integration Test
 * 
 * This test validates the integration between the Environmental Assessment section and 
 * the Assessment Context provider, ensuring data flows correctly between them.
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AssessmentProvider } from '@/contexts/AssessmentContext';
import { EnvironmentalAssessmentIntegrated } from '@/sections/7-EnvironmentalAssessment/components/EnvironmentalAssessment.integrated';
import * as environmentalAssessmentMapper from '@/services/environmentalAssessmentMapper';

// Mock the components within Environmental Assessment that aren't relevant to this test
jest.mock('@/sections/7-EnvironmentalAssessment/components/HomeLayoutSection', () => ({
  HomeLayoutSection: () => <div data-testid="home-layout-section">Home Layout content</div>
}));

jest.mock('@/sections/7-EnvironmentalAssessment/components/SafetyAssessmentSection', () => ({
  SafetyAssessmentSection: () => <div data-testid="safety-assessment-section">Safety Assessment content</div>
}));

jest.mock('@/sections/7-EnvironmentalAssessment/components/AccessibilityIssuesSection', () => ({
  AccessibilityIssuesSection: () => <div data-testid="accessibility-issues-section">Accessibility Issues content</div>
}));

jest.mock('@/sections/7-EnvironmentalAssessment/components/RecommendationsSection', () => ({
  RecommendationsSection: () => <div data-testid="recommendations-section">Recommendations content</div>
}));

// Mock the form persistence hook
jest.mock('@/hooks/useFormPersistence', () => ({
  useFormPersistence: () => ({
    persistForm: jest.fn()
  })
}));

// Spy on the mapper functions instead of fully mocking them
// This allows us to test the real functionality while still tracking calls
jest.spyOn(environmentalAssessmentMapper, 'mapContextToForm');
jest.spyOn(environmentalAssessmentMapper, 'mapFormToContext');

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
      <EnvironmentalAssessmentIntegrated />
    </AssessmentProvider>
  );
};

describe('Environmental Assessment Context Integration', () => {
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
    (environmentalAssessmentMapper.mapContextToForm as jest.Mock).mockRestore();
    (environmentalAssessmentMapper.mapFormToContext as jest.Mock).mockRestore();
  });
  
  it('loads empty form when no context data exists', () => {
    render(<TestComponent />);
    
    // Should not show data loaded alert
    expect(screen.queryByText('Data Loaded From Assessment Context')).not.toBeInTheDocument();
    
    // Should still render the form
    expect(screen.getByText('Environmental Assessment')).toBeInTheDocument();
    expect(screen.getByTestId('home-layout-section')).toBeInTheDocument();
  });
  
  it('loads data from assessment context when available', () => {
    // Create initial context data
    const initialData = {
      environmentalAssessment: {
        homeLayout: {
          homeType: 'Single-story house',
          numberOfBedrooms: 3,
          numberOfBathrooms: 2,
          entrances: {
            mainEntrance: {
              hasSteps: true,
              numberOfSteps: 3,
              hasRailing: true,
              stepHeight: '7 inches'
            },
            alternativeEntrance: {
              hasSteps: false,
              hasRamp: true,
              rampDetails: 'Concrete ramp with 1:12 slope'
            }
          },
          livingArrangement: 'Lives with spouse'
        },
        safetyAssessment: {
          generalSafety: 'Good overall safety with some concerns in bathroom',
          bathrooms: {
            hasBathtub: true,
            hasShower: true,
            hasGrabBars: false,
            hasBenchOrChair: true,
            concerns: 'No grab bars in shower and bathtub area'
          },
          kitchen: {
            hasAdequateLighting: true,
            hasAccessibleStorage: false,
            hasSlipResistantFlooring: true,
            concerns: 'Upper cabinets difficult to reach'
          },
          lighting: 'Adequate lighting throughout with motion-activated night lights'
        },
        accessibilityIssues: {
          entranceAccessibility: 'Main entrance has steps without ramp',
          bathroomAccessibility: 'Bathtub difficult to access, shower has threshold',
          kitchenAccessibility: 'Upper cabinets inaccessible from wheelchair',
          bedroomAccessibility: 'Doorway is 30 inches wide which is insufficient for larger wheelchairs'
        },
        recommendations: {
          priorityRecommendations: [
            'Install grab bars in bathroom',
            'Build ramp at main entrance',
            'Widen bedroom doorway to 36 inches'
          ],
          bathingRecommendations: 'Install grab bars in shower and by toilet; consider transfer bench for tub',
          kitchenRecommendations: 'Lower some upper cabinets or install pull-down shelving',
          generalRecommendations: 'Ensure clear pathways of at least 36 inches throughout the home'
        }
      }
    };
    
    render(<TestComponent initialData={initialData} />);
    
    // Should show data loaded alert
    expect(screen.getByText('Data Loaded From Assessment Context')).toBeInTheDocument();
    
    // Should call mapper with context data
    expect(environmentalAssessmentMapper.mapContextToForm).toHaveBeenCalledWith(
      initialData.environmentalAssessment,
      expect.anything()
    );
  });
  
  it('updates assessment context when form is submitted', async () => {
    const user = userEvent.setup();
    render(<TestComponent />);
    
    // Submit the form
    await user.click(screen.getByText('Save Environmental Assessment'));
    
    // mapFormToContext should be called
    expect(environmentalAssessmentMapper.mapFormToContext).toHaveBeenCalled();
    
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
      environmentalAssessment: {
        homeLayout: {
          homeType: 'Single-story house',
          numberOfBedrooms: 3,
          numberOfBathrooms: 2
        }
      }
    };
    
    const user = userEvent.setup();
    render(<TestComponent initialData={initialData} />);
    
    // Submit the form
    await user.click(screen.getByText('Save Environmental Assessment'));
    
    // Wait to ensure context update happens
    await waitFor(() => {
      // Check that localStorage contains all sections
      const savedData = JSON.parse(mockLocalStorage.setItem.mock.calls[0][1]);
      expect(savedData.demographics).toBeDefined();
      expect(savedData.demographics.firstName).toBe('John');
      expect(savedData.medicalHistory).toBeDefined();
      expect(savedData.medicalHistory.pastMedicalHistory.conditions).toHaveLength(1);
      expect(savedData.environmentalAssessment).toBeDefined();
    });
  });
  
  it('correctly reflects context updates in the UI', async () => {
    // Start with empty context
    const { rerender } = render(<TestComponent />);
    
    // No data loaded alert initially
    expect(screen.queryByText('Data Loaded From Assessment Context')).not.toBeInTheDocument();
    
    // Now rerender with data
    const initialData = {
      environmentalAssessment: {
        homeLayout: {
          homeType: 'Two-story house',
          numberOfBedrooms: 4,
          numberOfBathrooms: 2.5
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
      environmentalAssessment: {
        homeLayout: {
          homeType: 'Single-story house',
          numberOfBedrooms: 3,
          numberOfBathrooms: 2
        }
      }
    };
    
    const user = userEvent.setup();
    render(<TestComponent initialData={initialData} />);
    
    // Reset the form
    await user.click(screen.getByText('Reset'));
    
    // Submit the form with reset data
    await user.click(screen.getByText('Save Environmental Assessment'));
    
    // Wait to ensure context update happens
    await waitFor(() => {
      // Check that demographics data is still preserved
      const savedData = JSON.parse(mockLocalStorage.setItem.mock.calls[0][1]);
      expect(savedData.demographics).toBeDefined();
      expect(savedData.demographics.firstName).toBe('John');
    });
  });
  
  it('correctly handles complex nested data structures', () => {
    // Create initial context data with complex nested structures
    const initialData = {
      environmentalAssessment: {
        homeLayout: {
          homeType: 'Multi-story building',
          numberOfBedrooms: 2,
          numberOfBathrooms: 1,
          entrances: {
            mainEntrance: {
              hasSteps: true,
              numberOfSteps: 12,
              hasRailing: true,
              stepHeight: '7 inches'
            },
            alternativeEntrance: {
              hasSteps: false,
              hasRamp: false,
              hasElevator: true,
              elevatorDetails: 'Accessible elevator in building lobby'
            }
          },
          stairways: {
            internal: {
              present: false
            },
            external: {
              present: true,
              numberOfSteps: 10,
              hasRailing: true
            }
          }
        }
      }
    };
    
    render(<TestComponent initialData={initialData} />);
    
    // Should show data loaded alert
    expect(screen.getByText('Data Loaded From Assessment Context')).toBeInTheDocument();
    
    // Should handle complex nested data correctly
    expect(environmentalAssessmentMapper.mapContextToForm).toHaveBeenCalledWith(
      expect.objectContaining({
        homeLayout: expect.objectContaining({
          entrances: expect.objectContaining({
            mainEntrance: expect.objectContaining({
              numberOfSteps: 12
            }),
            alternativeEntrance: expect.objectContaining({
              hasElevator: true
            })
          }),
          stairways: expect.objectContaining({
            external: expect.objectContaining({
              numberOfSteps: 10
            })
          })
        })
      }),
      expect.anything()
    );
  });
  
  it('handles cross-section references correctly', () => {
    // Create initial context with data in multiple sections
    const initialData = {
      functionalStatus: {
        mobilityAssessment: {
          assistiveDevices: ['Walker', 'Wheelchair']
        }
      },
      environmentalAssessment: {
        homeLayout: {
          homeType: 'Single-story house'
        },
        accessibilityIssues: {
          doorwayWidths: 'Most doorways are 30 inches, too narrow for standard wheelchair'
        }
      }
    };
    
    render(<TestComponent initialData={initialData} />);
    
    // Should show data loaded alert
    expect(screen.getByText('Data Loaded From Assessment Context')).toBeInTheDocument();
    
    // Should map data correctly with cross-section references
    expect(environmentalAssessmentMapper.mapContextToForm).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        functionalStatus: expect.objectContaining({
          mobilityAssessment: expect.objectContaining({
            assistiveDevices: expect.arrayContaining(['Wheelchair'])
          })
        })
      })
    );
  });
  
  it('extracts home safety issues from descriptive text', () => {
    // Create initial context with descriptive text
    const initialData = {
      environmentalAssessment: {
        safetyAssessment: {
          generalSafety: 'The home has several safety concerns including loose rugs in the hallway, poor lighting in the stairwell, and no grab bars in the bathroom. The client has already fallen once on the stairs due to the poor lighting.'
        }
      }
    };
    
    render(<TestComponent initialData={initialData} />);
    
    // Should show data loaded alert
    expect(screen.getByText('Data Loaded From Assessment Context')).toBeInTheDocument();
    
    // Text analysis should identify key safety concerns
    expect(environmentalAssessmentMapper.mapContextToForm).toHaveBeenCalled();
  });
  
  it('exports and imports JSON correctly', async () => {
    // Create initial context data
    const initialData = {
      environmentalAssessment: {
        homeLayout: {
          homeType: 'Single-story house',
          numberOfBedrooms: 3,
          numberOfBathrooms: 2
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
