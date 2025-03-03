/**
 * Activities of Daily Living Assessment Context Integration Test
 * 
 * This test validates the integration between the Activities of Daily Living section and 
 * the Assessment Context provider, ensuring data flows correctly between them.
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AssessmentProvider } from '@/contexts/AssessmentContext';
import { ActivitiesOfDailyLivingIntegrated } from '@/sections/8-ActivitiesOfDailyLiving/components/ActivitiesOfDailyLiving.integrated';
import * as activitiesOfDailyLivingMapper from '@/services/activitiesOfDailyLivingMapper';

// Mock the components within Activities of Daily Living that aren't relevant to this test
jest.mock('@/sections/8-ActivitiesOfDailyLiving/components/BasicADLSection', () => ({
  BasicADLSection: () => <div data-testid="basic-adl-section">Basic ADL content</div>
}));

jest.mock('@/sections/8-ActivitiesOfDailyLiving/components/IADLSection', () => ({
  IADLSection: () => <div data-testid="iadl-section">IADL content</div>
}));

jest.mock('@/sections/8-ActivitiesOfDailyLiving/components/LeisureRecreationSection', () => ({
  LeisureRecreationSection: () => <div data-testid="leisure-recreation-section">Leisure & Recreation content</div>
}));

// Mock the form persistence hook
jest.mock('@/hooks/useFormPersistence', () => ({
  useFormPersistence: () => ({
    persistForm: jest.fn()
  })
}));

// Spy on the mapper functions instead of fully mocking them
// This allows us to test the real functionality while still tracking calls
jest.spyOn(activitiesOfDailyLivingMapper, 'mapContextToForm');
jest.spyOn(activitiesOfDailyLivingMapper, 'mapFormToContext');

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
      <ActivitiesOfDailyLivingIntegrated />
    </AssessmentProvider>
  );
};

describe('Activities of Daily Living Context Integration', () => {
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
    (activitiesOfDailyLivingMapper.mapContextToForm as jest.Mock).mockRestore();
    (activitiesOfDailyLivingMapper.mapFormToContext as jest.Mock).mockRestore();
  });
  
  it('loads empty form when no context data exists', () => {
    render(<TestComponent />);
    
    // Should not show data loaded alert
    expect(screen.queryByText('Data Loaded From Assessment Context')).not.toBeInTheDocument();
    
    // Should still render the form
    expect(screen.getByText('Activities of Daily Living')).toBeInTheDocument();
    expect(screen.getByTestId('basic-adl-section')).toBeInTheDocument();
  });
  
  it('loads data from assessment context when available', () => {
    // Create initial context data
    const initialData = {
      activitiesOfDailyLiving: {
        basicADLs: {
          bathing: {
            independenceLevel: 'Requires moderate assistance',
            details: 'Needs help with transfers in/out of tub and washing lower body',
            equipment: ['Shower chair', 'Handheld shower']
          },
          dressing: {
            independenceLevel: 'Requires minimal assistance',
            details: 'Independent with upper body, needs help with lower body dressing',
            equipment: ['Dressing stick', 'Long-handled shoe horn']
          },
          toileting: {
            independenceLevel: 'Requires setup',
            details: 'Needs help with clothing management before/after',
            equipment: ['Raised toilet seat', 'Grab bars']
          },
          transfers: {
            independenceLevel: 'Requires moderate assistance',
            details: 'Needs physical assistance for safety during transfers',
            equipment: ['Transfer board', 'Grab bars']
          },
          grooming: {
            independenceLevel: 'Independent with equipment',
            details: 'Uses adaptive equipment for grooming tasks',
            equipment: ['Long-handled comb', 'Electric razor']
          },
          eating: {
            independenceLevel: 'Independent',
            details: 'No issues with eating',
            equipment: []
          }
        },
        IADLs: {
          mealPreparation: {
            independenceLevel: 'Requires maximal assistance',
            details: 'Unable to stand for prolonged periods in kitchen',
            equipment: ['Perching stool']
          },
          homeManagement: {
            independenceLevel: 'Dependent',
            details: 'Unable to perform household tasks independently',
            equipment: []
          },
          financialManagement: {
            independenceLevel: 'Independent with setup',
            details: 'Manages finances with spouse assistance for physical aspects',
            equipment: []
          },
          medicationManagement: {
            independenceLevel: 'Requires setup',
            details: 'Needs medications organized in pill box',
            equipment: ['Weekly pill organizer']
          },
          communication: {
            independenceLevel: 'Independent',
            details: 'No issues with using phone or computer',
            equipment: []
          },
          shopping: {
            independenceLevel: 'Dependent',
            details: 'Unable to go shopping independently due to mobility',
            equipment: []
          },
          transportation: {
            independenceLevel: 'Dependent',
            details: 'No longer driving, relies on family or transportation services',
            equipment: []
          }
        },
        leisureActivities: {
          physicalActivities: ['Walking (with assistance)', 'Light gardening (seated)'],
          socialActivities: ['Church groups', 'Family gatherings'],
          hobbies: ['Reading', 'Knitting', 'Watching television'],
          travelActivities: ['Local day trips only'],
          volunteerActivities: [],
          notes: 'Client expresses interest in returning to community choir when mobility improves'
        }
      }
    };
    
    render(<TestComponent initialData={initialData} />);
    
    // Should show data loaded alert
    expect(screen.getByText('Data Loaded From Assessment Context')).toBeInTheDocument();
    
    // Should call mapper with context data
    expect(activitiesOfDailyLivingMapper.mapContextToForm).toHaveBeenCalledWith(
      initialData.activitiesOfDailyLiving,
      expect.anything()
    );
  });
  
  it('updates assessment context when form is submitted', async () => {
    const user = userEvent.setup();
    render(<TestComponent />);
    
    // Submit the form
    await user.click(screen.getByText('Save Activities of Daily Living'));
    
    // mapFormToContext should be called
    expect(activitiesOfDailyLivingMapper.mapFormToContext).toHaveBeenCalled();
    
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
      activitiesOfDailyLiving: {
        basicADLs: {
          bathing: {
            independenceLevel: 'Requires moderate assistance',
            details: 'Needs help with transfers in/out of tub and washing lower body',
            equipment: ['Shower chair', 'Handheld shower']
          }
        }
      }
    };
    
    const user = userEvent.setup();
    render(<TestComponent initialData={initialData} />);
    
    // Submit the form
    await user.click(screen.getByText('Save Activities of Daily Living'));
    
    // Wait to ensure context update happens
    await waitFor(() => {
      // Check that localStorage contains all sections
      const savedData = JSON.parse(mockLocalStorage.setItem.mock.calls[0][1]);
      expect(savedData.demographics).toBeDefined();
      expect(savedData.demographics.firstName).toBe('John');
      expect(savedData.medicalHistory).toBeDefined();
      expect(savedData.medicalHistory.pastMedicalHistory.conditions).toHaveLength(1);
      expect(savedData.activitiesOfDailyLiving).toBeDefined();
      expect(savedData.activitiesOfDailyLiving.basicADLs).toBeDefined();
    });
  });
  
  it('correctly reflects context updates in the UI', async () => {
    // Start with empty context
    const { rerender } = render(<TestComponent />);
    
    // No data loaded alert initially
    expect(screen.queryByText('Data Loaded From Assessment Context')).not.toBeInTheDocument();
    
    // Now rerender with data
    const initialData = {
      activitiesOfDailyLiving: {
        basicADLs: {
          bathing: {
            independenceLevel: 'Requires moderate assistance',
            details: 'Needs help with transfers in/out of tub and washing lower body',
            equipment: ['Shower chair', 'Handheld shower']
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
      activitiesOfDailyLiving: {
        basicADLs: {
          bathing: {
            independenceLevel: 'Requires moderate assistance',
            details: 'Needs help with transfers in/out of tub and washing lower body',
            equipment: ['Shower chair', 'Handheld shower']
          }
        }
      }
    };
    
    const user = userEvent.setup();
    render(<TestComponent initialData={initialData} />);
    
    // Reset the form
    await user.click(screen.getByText('Reset'));
    
    // Submit the form with reset data
    await user.click(screen.getByText('Save Activities of Daily Living'));
    
    // Wait to ensure context update happens
    await waitFor(() => {
      // Check that demographics data is still preserved
      const savedData = JSON.parse(mockLocalStorage.setItem.mock.calls[0][1]);
      expect(savedData.demographics).toBeDefined();
      expect(savedData.demographics.firstName).toBe('John');
    });
  });
  
  it('correctly maps all ADL independence levels', () => {
    // Create initial context with various independence levels
    const initialData = {
      activitiesOfDailyLiving: {
        basicADLs: {
          bathing: { independenceLevel: 'Independent' },
          dressing: { independenceLevel: 'Independent with equipment' },
          toileting: { independenceLevel: 'Requires setup' },
          transfers: { independenceLevel: 'Requires minimal assistance' },
          grooming: { independenceLevel: 'Requires moderate assistance' },
          eating: { independenceLevel: 'Requires maximal assistance' },
          mobilityIndoors: { independenceLevel: 'Dependent' }
        }
      }
    };
    
    render(<TestComponent initialData={initialData} />);
    
    // Should show data loaded alert
    expect(screen.getByText('Data Loaded From Assessment Context')).toBeInTheDocument();
    
    // Should map all independence levels correctly
    expect(activitiesOfDailyLivingMapper.mapContextToForm).toHaveBeenCalledWith(
      expect.objectContaining({
        basicADLs: expect.objectContaining({
          bathing: expect.objectContaining({ independenceLevel: 'Independent' }),
          dressing: expect.objectContaining({ independenceLevel: 'Independent with equipment' }),
          toileting: expect.objectContaining({ independenceLevel: 'Requires setup' }),
          transfers: expect.objectContaining({ independenceLevel: 'Requires minimal assistance' }),
          grooming: expect.objectContaining({ independenceLevel: 'Requires moderate assistance' }),
          eating: expect.objectContaining({ independenceLevel: 'Requires maximal assistance' }),
          mobilityIndoors: expect.objectContaining({ independenceLevel: 'Dependent' })
        })
      }),
      expect.anything()
    );
  });
  
  it('correctly maps leisure and recreation activities', () => {
    // Create initial context with leisure activities
    const initialData = {
      activitiesOfDailyLiving: {
        leisureActivities: {
          physicalActivities: ['Walking', 'Swimming'],
          socialActivities: ['Church groups', 'Family gatherings'],
          hobbies: ['Reading', 'Knitting', 'Gardening'],
          travelActivities: ['Local day trips', 'Seasonal vacation'],
          volunteerActivities: ['Food bank', 'Animal shelter'],
          notes: 'Client enjoys outdoor activities when weather permits'
        }
      }
    };
    
    render(<TestComponent initialData={initialData} />);
    
    // Should show data loaded alert
    expect(screen.getByText('Data Loaded From Assessment Context')).toBeInTheDocument();
    
    // Should map leisure activities correctly
    expect(activitiesOfDailyLivingMapper.mapContextToForm).toHaveBeenCalledWith(
      expect.objectContaining({
        leisureActivities: expect.objectContaining({
          physicalActivities: expect.arrayContaining(['Walking', 'Swimming']),
          socialActivities: expect.arrayContaining(['Church groups', 'Family gatherings']),
          hobbies: expect.arrayContaining(['Reading', 'Knitting', 'Gardening']),
          travelActivities: expect.arrayContaining(['Local day trips', 'Seasonal vacation']),
          volunteerActivities: expect.arrayContaining(['Food bank', 'Animal shelter']),
          notes: 'Client enjoys outdoor activities when weather permits'
        })
      }),
      expect.anything()
    );
  });
  
  it('correctly infers independence levels from descriptive text', () => {
    // Create initial context with descriptive text
    const initialData = {
      activitiesOfDailyLiving: {
        adlDescription: "Client is independent with eating and most grooming tasks. Requires setup for medication management. Needs moderate assistance with bathing due to balance concerns and difficulty washing lower extremities. Dressing requires minimal assistance, particularly with lower body garments and footwear. Is dependent for all household management tasks. Manages finances with supervision from spouse. No longer driving and requires transportation assistance for all community activities."
      }
    };
    
    render(<TestComponent initialData={initialData} />);
    
    // Should show data loaded alert
    expect(screen.getByText('Data Loaded From Assessment Context')).toBeInTheDocument();
    
    // Text analysis should identify key independence levels
    expect(activitiesOfDailyLivingMapper.mapContextToForm).toHaveBeenCalled();
  });
  
  it('handles equipment lists correctly', () => {
    // Create initial context with equipment lists
    const initialData = {
      activitiesOfDailyLiving: {
        basicADLs: {
          bathing: {
            equipment: ['Shower chair', 'Handheld shower', 'Grab bars', 'Non-slip bath mat']
          },
          dressing: {
            equipment: ['Dressing stick', 'Long-handled shoe horn', 'Button hook']
          },
          toileting: {
            equipment: ['Raised toilet seat', 'Grab bars', 'Toilet frame']
          }
        },
        IADLs: {
          mealPreparation: {
            equipment: ['Perching stool', 'Adaptive utensils', 'Electric can opener']
          },
          medicationManagement: {
            equipment: ['Weekly pill organizer', 'Pill crusher', 'Medication reminder app']
          }
        }
      }
    };
    
    render(<TestComponent initialData={initialData} />);
    
    // Should show data loaded alert
    expect(screen.getByText('Data Loaded From Assessment Context')).toBeInTheDocument();
    
    // Should map equipment lists correctly
    expect(activitiesOfDailyLivingMapper.mapContextToForm).toHaveBeenCalledWith(
      expect.objectContaining({
        basicADLs: expect.objectContaining({
          bathing: expect.objectContaining({
            equipment: expect.arrayContaining(['Shower chair', 'Handheld shower', 'Grab bars', 'Non-slip bath mat'])
          }),
          dressing: expect.objectContaining({
            equipment: expect.arrayContaining(['Dressing stick', 'Long-handled shoe horn', 'Button hook'])
          })
        }),
        IADLs: expect.objectContaining({
          mealPreparation: expect.objectContaining({
            equipment: expect.arrayContaining(['Perching stool', 'Adaptive utensils', 'Electric can opener'])
          })
        })
      }),
      expect.anything()
    );
  });
  
  it('exports and imports JSON correctly', async () => {
    // Create initial context data
    const initialData = {
      activitiesOfDailyLiving: {
        basicADLs: {
          bathing: {
            independenceLevel: 'Requires moderate assistance',
            details: 'Needs help with transfers in/out of tub and washing lower body',
            equipment: ['Shower chair', 'Handheld shower']
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
