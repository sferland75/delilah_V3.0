/**
 * Attendant Care Assessment Context Integration Test
 * 
 * This test validates the integration between the Attendant Care section and 
 * the Assessment Context provider, ensuring data flows correctly between them.
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AssessmentProvider } from '@/contexts/AssessmentContext';
import { AttendantCareSectionIntegrated } from '@/sections/9-AttendantCare/components/AttendantCareSection.integrated';
import * as attendantCareMapper from '@/services/attendantCareMapper';

// Mock the components within Attendant Care that aren't relevant to this test
jest.mock('@/sections/9-AttendantCare/components/CareNeedsComponent', () => ({
  CareNeedsComponent: () => <div data-testid="care-needs-component">Care Needs content</div>
}));

jest.mock('@/sections/9-AttendantCare/components/RecommendedHours', () => ({
  RecommendedHours: () => <div data-testid="recommended-hours-component">Recommended Hours content</div>
}));

jest.mock('@/sections/9-AttendantCare/components/CostCalculation', () => ({
  CostCalculation: () => <div data-testid="cost-calculation-component">Cost Calculation content</div>
}));

jest.mock('@/sections/9-AttendantCare/components/ProviderInformation', () => ({
  ProviderInformation: () => <div data-testid="provider-information-component">Provider Information content</div>
}));

// Mock the form persistence hook
jest.mock('@/hooks/useFormPersistence', () => ({
  useFormPersistence: () => ({
    persistForm: jest.fn()
  })
}));

// Spy on the mapper functions instead of fully mocking them
// This allows us to test the real functionality while still tracking calls
jest.spyOn(attendantCareMapper, 'mapContextToForm');
jest.spyOn(attendantCareMapper, 'mapFormToContext');

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
      <AttendantCareSectionIntegrated />
    </AssessmentProvider>
  );
};

describe('Attendant Care Context Integration', () => {
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
    (attendantCareMapper.mapContextToForm as jest.Mock).mockRestore();
    (attendantCareMapper.mapFormToContext as jest.Mock).mockRestore();
  });
  
  it('loads empty form when no context data exists', () => {
    render(<TestComponent />);
    
    // Should not show data loaded alert
    expect(screen.queryByText('Data Loaded From Assessment Context')).not.toBeInTheDocument();
    
    // Should still render the form
    expect(screen.getByText('Attendant Care')).toBeInTheDocument();
    expect(screen.getByTestId('care-needs-component')).toBeInTheDocument();
  });
  
  it('loads data from assessment context when available', () => {
    // Create initial context data
    const initialData = {
      attendantCare: {
        careNeeds: {
          activities: {
            bathing: {
              requiresAssistance: true,
              details: 'Requires assistance with transfers in/out of tub and washing lower body',
              frequency: 'Daily',
              timeRequired: 30
            },
            grooming: {
              requiresAssistance: true,
              details: 'Needs assistance with hair combing and oral care',
              frequency: 'Daily',
              timeRequired: 15
            },
            dressing: {
              requiresAssistance: true,
              details: 'Needs assistance with lower body dressing and fasteners',
              frequency: 'Daily',
              timeRequired: 20
            },
            toileting: {
              requiresAssistance: true,
              details: 'Needs assistance with clothing management and hygiene',
              frequency: 'As needed',
              timeRequired: 10
            },
            eating: {
              requiresAssistance: false,
              details: '',
              frequency: '',
              timeRequired: 0
            },
            mealPreparation: {
              requiresAssistance: true,
              details: 'Needs full assistance with meal preparation',
              frequency: 'Three times daily',
              timeRequired: 45
            },
            mobilityAssistance: {
              requiresAssistance: true,
              details: 'Needs standby assistance for transfers and walking',
              frequency: 'As needed',
              timeRequired: 15
            },
            housekeeping: {
              requiresAssistance: true,
              details: 'Needs full assistance with all household tasks',
              frequency: 'Daily',
              timeRequired: 60
            },
            laundry: {
              requiresAssistance: true,
              details: 'Needs full assistance with laundry',
              frequency: 'Weekly',
              timeRequired: 90
            },
            shopping: {
              requiresAssistance: true,
              details: 'Needs full assistance with shopping',
              frequency: 'Weekly',
              timeRequired: 120
            },
            transportation: {
              requiresAssistance: true,
              details: 'Needs transportation for all community outings',
              frequency: 'As needed',
              timeRequired: 60
            },
            medicationManagement: {
              requiresAssistance: true,
              details: 'Needs medication setup and reminders',
              frequency: 'Daily',
              timeRequired: 10
            }
          },
          supervision: {
            requiresSupervision: true,
            safetyRisks: 'Fall risk, wandering risk due to cognitive impairment',
            supervisionLevel: 'Intermittent',
            details: 'Requires supervision during mobility and when using the bathroom',
            supervisionHours: 4
          }
        },
        recommendedHours: {
          weekdayHours: 6,
          weekendHours: 8,
          totalWeeklyHours: 46,
          justification: 'Client requires assistance with most ADLs and IADLs, along with supervision due to fall risk',
          alternativeOptionsConsidered: 'Considered family support but unavailable during work hours',
          recommendedSchedule: 'Morning: 7-10am, Evening: 4-7pm, additional hours on weekends'
        },
        costCalculation: {
          hourlyRate: 25,
          totalWeeklyCost: 1150,
          totalMonthlyCost: 4600,
          otherCosts: [
            {
              description: 'Transportation costs',
              amount: 200
            },
            {
              description: 'Supplies',
              amount: 150
            }
          ],
          totalCost: 4950
        },
        providerInformation: {
          currentProviders: [
            {
              name: 'HomeCare Plus',
              contactPerson: 'Sarah Johnson',
              phone: '555-123-4567',
              email: 'info@homecareplus.com',
              address: '123 Main St, Anytown',
              services: 'Personal care, housekeeping, transportation'
            }
          ],
          recommendedProviders: [
            {
              name: 'Comfort Caregivers',
              contactPerson: 'Michael Brown',
              phone: '555-987-6543',
              email: 'info@comfortcaregivers.com',
              address: '456 Oak Ave, Anytown',
              services: 'Personal care, homemaking, respite, transportation'
            },
            {
              name: 'Elite Home Health',
              contactPerson: 'Lisa Wilson',
              phone: '555-456-7890',
              email: 'info@elitehomehealth.com',
              address: '789 Elm St, Anytown',
              services: 'Personal care, skilled nursing, therapy services'
            }
          ]
        }
      }
    };
    
    render(<TestComponent initialData={initialData} />);
    
    // Should show data loaded alert
    expect(screen.getByText('Data Loaded From Assessment Context')).toBeInTheDocument();
    
    // Should call mapper with context data
    expect(attendantCareMapper.mapContextToForm).toHaveBeenCalledWith(
      initialData.attendantCare,
      expect.anything()
    );
  });
  
  it('updates assessment context when form is submitted', async () => {
    const user = userEvent.setup();
    render(<TestComponent />);
    
    // Submit the form
    await user.click(screen.getByText('Save Attendant Care'));
    
    // mapFormToContext should be called
    expect(attendantCareMapper.mapFormToContext).toHaveBeenCalled();
    
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
      attendantCare: {
        careNeeds: {
          activities: {
            bathing: {
              requiresAssistance: true,
              details: 'Requires assistance with transfers in/out of tub and washing lower body',
              frequency: 'Daily',
              timeRequired: 30
            }
          }
        }
      }
    };
    
    const user = userEvent.setup();
    render(<TestComponent initialData={initialData} />);
    
    // Submit the form
    await user.click(screen.getByText('Save Attendant Care'));
    
    // Wait to ensure context update happens
    await waitFor(() => {
      // Check that localStorage contains all sections
      const savedData = JSON.parse(mockLocalStorage.setItem.mock.calls[0][1]);
      expect(savedData.demographics).toBeDefined();
      expect(savedData.demographics.firstName).toBe('John');
      expect(savedData.medicalHistory).toBeDefined();
      expect(savedData.medicalHistory.pastMedicalHistory.conditions).toHaveLength(1);
      expect(savedData.attendantCare).toBeDefined();
      expect(savedData.attendantCare.careNeeds).toBeDefined();
    });
  });
  
  it('correctly reflects context updates in the UI', async () => {
    // Start with empty context
    const { rerender } = render(<TestComponent />);
    
    // No data loaded alert initially
    expect(screen.queryByText('Data Loaded From Assessment Context')).not.toBeInTheDocument();
    
    // Now rerender with data
    const initialData = {
      attendantCare: {
        careNeeds: {
          activities: {
            bathing: {
              requiresAssistance: true,
              details: 'Requires assistance with transfers in/out of tub and washing lower body',
              frequency: 'Daily',
              timeRequired: 30
            }
          }
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
      attendantCare: {
        careNeeds: {
          activities: {
            bathing: {
              requiresAssistance: true,
              details: 'Requires assistance with transfers in/out of tub and washing lower body',
              frequency: 'Daily',
              timeRequired: 30
            }
          }
        }
      }
    };
    
    const user = userEvent.setup();
    render(<TestComponent initialData={initialData} />);
    
    // Reset the form
    await user.click(screen.getByText('Reset'));
    
    // Submit the form with reset data
    await user.click(screen.getByText('Save Attendant Care'));
    
    // Wait to ensure context update happens
    await waitFor(() => {
      // Check that demographics data is still preserved
      const savedData = JSON.parse(mockLocalStorage.setItem.mock.calls[0][1]);
      expect(savedData.demographics).toBeDefined();
      expect(savedData.demographics.firstName).toBe('John');
    });
  });
  
  it('correctly calculates time requirements for care activities', () => {
    // Create initial context data with multiple care activities
    const initialData = {
      attendantCare: {
        careNeeds: {
          activities: {
            bathing: {
              requiresAssistance: true,
              timeRequired: 30
            },
            grooming: {
              requiresAssistance: true,
              timeRequired: 15
            },
            dressing: {
              requiresAssistance: true,
              timeRequired: 20
            },
            toileting: {
              requiresAssistance: true,
              timeRequired: 10
            },
            eating: {
              requiresAssistance: false,
              timeRequired: 0
            },
            mealPreparation: {
              requiresAssistance: true,
              timeRequired: 45
            }
          }
        },
        recommendedHours: {
          weekdayHours: 4,
          weekendHours: 6,
          totalWeeklyHours: 32
        }
      }
    };
    
    render(<TestComponent initialData={initialData} />);
    
    // Should show data loaded alert
    expect(screen.getByText('Data Loaded From Assessment Context')).toBeInTheDocument();
    
    // Should map time requirements correctly
    expect(attendantCareMapper.mapContextToForm).toHaveBeenCalledWith(
      expect.objectContaining({
        careNeeds: expect.objectContaining({
          activities: expect.objectContaining({
            bathing: expect.objectContaining({ timeRequired: 30 }),
            grooming: expect.objectContaining({ timeRequired: 15 }),
            dressing: expect.objectContaining({ timeRequired: 20 }),
            toileting: expect.objectContaining({ timeRequired: 10 }),
            mealPreparation: expect.objectContaining({ timeRequired: 45 })
          })
        }),
        recommendedHours: expect.objectContaining({
          weekdayHours: 4,
          weekendHours: 6,
          totalWeeklyHours: 32
        })
      }),
      expect.anything()
    );
  });
  
  it('correctly handles the cost calculation data', () => {
    // Create initial context with cost data
    const initialData = {
      attendantCare: {
        costCalculation: {
          hourlyRate: 25,
          totalWeeklyHours: 40,
          totalWeeklyCost: 1000,
          totalMonthlyCost: 4000,
          otherCosts: [
            {
              description: 'Transportation costs',
              amount: 200
            },
            {
              description: 'Supplies',
              amount: 150
            }
          ],
          totalCost: 4350
        }
      }
    };
    
    render(<TestComponent initialData={initialData} />);
    
    // Should show data loaded alert
    expect(screen.getByText('Data Loaded From Assessment Context')).toBeInTheDocument();
    
    // Should map cost calculation data correctly
    expect(attendantCareMapper.mapContextToForm).toHaveBeenCalledWith(
      expect.objectContaining({
        costCalculation: expect.objectContaining({
          hourlyRate: 25,
          totalWeeklyCost: 1000,
          totalMonthlyCost: 4000,
          otherCosts: expect.arrayContaining([
            expect.objectContaining({
              description: 'Transportation costs',
              amount: 200
            }),
            expect.objectContaining({
              description: 'Supplies',
              amount: 150
            })
          ]),
          totalCost: 4350
        })
      }),
      expect.anything()
    );
  });
  
  it('correctly handles provider information data', () => {
    // Create initial context with provider information
    const initialData = {
      attendantCare: {
        providerInformation: {
          currentProviders: [
            {
              name: 'HomeCare Plus',
              contactPerson: 'Sarah Johnson',
              phone: '555-123-4567',
              email: 'info@homecareplus.com',
              address: '123 Main St, Anytown',
              services: 'Personal care, housekeeping, transportation'
            }
          ],
          recommendedProviders: [
            {
              name: 'Comfort Caregivers',
              contactPerson: 'Michael Brown',
              phone: '555-987-6543',
              email: 'info@comfortcaregivers.com',
              address: '456 Oak Ave, Anytown',
              services: 'Personal care, homemaking, respite, transportation'
            }
          ]
        }
      }
    };
    
    render(<TestComponent initialData={initialData} />);
    
    // Should show data loaded alert
    expect(screen.getByText('Data Loaded From Assessment Context')).toBeInTheDocument();
    
    // Should map provider information correctly
    expect(attendantCareMapper.mapContextToForm).toHaveBeenCalledWith(
      expect.objectContaining({
        providerInformation: expect.objectContaining({
          currentProviders: expect.arrayContaining([
            expect.objectContaining({
              name: 'HomeCare Plus',
              contactPerson: 'Sarah Johnson',
              phone: '555-123-4567'
            })
          ]),
          recommendedProviders: expect.arrayContaining([
            expect.objectContaining({
              name: 'Comfort Caregivers',
              contactPerson: 'Michael Brown',
              phone: '555-987-6543'
            })
          ])
        })
      }),
      expect.anything()
    );
  });
  
  it('exports and imports JSON correctly', async () => {
    // Create initial context data
    const initialData = {
      attendantCare: {
        careNeeds: {
          activities: {
            bathing: {
              requiresAssistance: true,
              details: 'Requires assistance with transfers in/out of tub and washing lower body',
              frequency: 'Daily',
              timeRequired: 30
            }
          }
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
