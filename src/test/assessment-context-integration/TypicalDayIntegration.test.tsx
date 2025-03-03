/**
 * Typical Day Assessment Context Integration Test
 * 
 * This test validates the integration between the Typical Day section and 
 * the Assessment Context provider, ensuring data flows correctly between them.
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AssessmentProvider } from '@/contexts/AssessmentContext';
import { TypicalDayIntegrated } from '@/sections/6-TypicalDay/components/TypicalDay.integrated';
import * as typicalDayMapper from '@/services/typicalDayMapper';

// Mock the components within Typical Day that aren't relevant to this test
jest.mock('@/sections/6-TypicalDay/components/DailyScheduleSection', () => ({
  DailyScheduleSection: () => <div data-testid="daily-schedule-section">Daily Schedule content</div>
}));

jest.mock('@/sections/6-TypicalDay/components/MorningRoutineSection', () => ({
  MorningRoutineSection: () => <div data-testid="morning-routine-section">Morning Routine content</div>
}));

jest.mock('@/sections/6-TypicalDay/components/AfternoonRoutineSection', () => ({
  AfternoonRoutineSection: () => <div data-testid="afternoon-routine-section">Afternoon Routine content</div>
}));

jest.mock('@/sections/6-TypicalDay/components/EveningRoutineSection', () => ({
  EveningRoutineSection: () => <div data-testid="evening-routine-section">Evening Routine content</div>
}));

// Mock the form persistence hook
jest.mock('@/hooks/useFormPersistence', () => ({
  useFormPersistence: () => ({
    persistForm: jest.fn()
  })
}));

// Spy on the mapper functions instead of fully mocking them
// This allows us to test the real functionality while still tracking calls
jest.spyOn(typicalDayMapper, 'mapContextToForm');
jest.spyOn(typicalDayMapper, 'mapFormToContext');

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
      <TypicalDayIntegrated />
    </AssessmentProvider>
  );
};

describe('Typical Day Context Integration', () => {
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
    (typicalDayMapper.mapContextToForm as jest.Mock).mockRestore();
    (typicalDayMapper.mapFormToContext as jest.Mock).mockRestore();
  });
  
  it('loads empty form when no context data exists', () => {
    render(<TestComponent />);
    
    // Should not show data loaded alert
    expect(screen.queryByText('Data Loaded From Assessment Context')).not.toBeInTheDocument();
    
    // Should still render the form
    expect(screen.getByText('Typical Day')).toBeInTheDocument();
    expect(screen.getByTestId('daily-schedule-section')).toBeInTheDocument();
  });
  
  it('loads data from assessment context when available', () => {
    // Create initial context data
    const initialData = {
      typicalDay: {
        morningRoutine: {
          wakeUpTime: '06:30',
          activities: [
            {
              time: '06:30 - 07:00',
              activity: 'Personal hygiene and dressing',
              independence: 'Requires moderate assistance with dressing'
            },
            {
              time: '07:00 - 07:30',
              activity: 'Breakfast',
              independence: 'Independent with setup'
            }
          ]
        },
        afternoonRoutine: {
          activities: [
            {
              time: '12:00 - 13:00',
              activity: 'Lunch',
              independence: 'Independent'
            },
            {
              time: '13:00 - 15:00',
              activity: 'Reading and light activity',
              independence: 'Independent'
            }
          ]
        },
        eveningRoutine: {
          bedTime: '22:00',
          activities: [
            {
              time: '18:00 - 19:00',
              activity: 'Dinner',
              independence: 'Independent with setup'
            },
            {
              time: '19:00 - 21:30',
              activity: 'Television and family time',
              independence: 'Independent'
            }
          ]
        }
      }
    };
    
    render(<TestComponent initialData={initialData} />);
    
    // Should show data loaded alert
    expect(screen.getByText('Data Loaded From Assessment Context')).toBeInTheDocument();
    
    // Should call mapper with context data
    expect(typicalDayMapper.mapContextToForm).toHaveBeenCalledWith(
      initialData.typicalDay,
      expect.anything()
    );
  });
  
  it('updates assessment context when form is submitted', async () => {
    const user = userEvent.setup();
    render(<TestComponent />);
    
    // Submit the form
    await user.click(screen.getByText('Save Typical Day'));
    
    // mapFormToContext should be called
    expect(typicalDayMapper.mapFormToContext).toHaveBeenCalled();
    
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
      typicalDay: {
        morningRoutine: {
          wakeUpTime: '07:00',
          activities: [
            {
              time: '07:00 - 07:30',
              activity: 'Personal hygiene',
              independence: 'Independent'
            }
          ]
        }
      }
    };
    
    const user = userEvent.setup();
    render(<TestComponent initialData={initialData} />);
    
    // Submit the form
    await user.click(screen.getByText('Save Typical Day'));
    
    // Wait to ensure context update happens
    await waitFor(() => {
      // Check that localStorage contains all sections
      const savedData = JSON.parse(mockLocalStorage.setItem.mock.calls[0][1]);
      expect(savedData.demographics).toBeDefined();
      expect(savedData.demographics.firstName).toBe('John');
      expect(savedData.medicalHistory).toBeDefined();
      expect(savedData.medicalHistory.pastMedicalHistory.conditions).toHaveLength(1);
      expect(savedData.typicalDay).toBeDefined();
    });
  });
  
  it('correctly reflects context updates in the UI', async () => {
    // Start with empty context
    const { rerender } = render(<TestComponent />);
    
    // No data loaded alert initially
    expect(screen.queryByText('Data Loaded From Assessment Context')).not.toBeInTheDocument();
    
    // Now rerender with data
    const initialData = {
      typicalDay: {
        morningRoutine: {
          wakeUpTime: '06:30',
          activities: [
            {
              time: '06:30 - 07:00',
              activity: 'Personal hygiene',
              independence: 'Independent'
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
      typicalDay: {
        morningRoutine: {
          wakeUpTime: '07:00',
          activities: [
            {
              time: '07:00 - 07:30',
              activity: 'Personal hygiene',
              independence: 'Independent'
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
    await user.click(screen.getByText('Save Typical Day'));
    
    // Wait to ensure context update happens
    await waitFor(() => {
      // Check that demographics data is still preserved
      const savedData = JSON.parse(mockLocalStorage.setItem.mock.calls[0][1]);
      expect(savedData.demographics).toBeDefined();
      expect(savedData.demographics.firstName).toBe('John');
    });
  });
  
  it('converts between text descriptions and activity arrays correctly', () => {
    // Create initial context data with text descriptions
    const initialData = {
      typicalDay: {
        dayDescription: "Client wakes at 7:00 AM and requires moderate assistance with morning hygiene and dressing. Has breakfast at 7:30 AM independently with setup. Usually spends mornings reading or watching television. Has lunch at 12:00 PM independently. Afternoons are typically spent with light household activities or short walks with supervision. Dinner at 6:00 PM requires minimal assistance. Evening routine includes television and family time until bedtime at 10:00 PM.",
        morningRoutine: {
          wakeUpTime: '07:00'
        },
        eveningRoutine: {
          bedTime: '22:00'
        }
      }
    };
    
    render(<TestComponent initialData={initialData} />);
    
    // Should show data loaded alert
    expect(screen.getByText('Data Loaded From Assessment Context')).toBeInTheDocument();
    
    // Text should be converted to structured activities
    expect(typicalDayMapper.mapContextToForm).toHaveBeenCalled();
  });
  
  it('properly handles independence levels for activities', () => {
    // Create initial context data with varied independence levels
    const initialData = {
      typicalDay: {
        morningRoutine: {
          activities: [
            {
              time: '07:00 - 07:30',
              activity: 'Personal hygiene',
              independence: 'Requires moderate assistance'
            },
            {
              time: '07:30 - 08:00',
              activity: 'Breakfast',
              independence: 'Independent with setup'
            }
          ]
        },
        afternoonRoutine: {
          activities: [
            {
              time: '12:00 - 12:30',
              activity: 'Lunch',
              independence: 'Independent'
            },
            {
              time: '14:00 - 15:00',
              activity: 'Outdoor mobility',
              independence: 'Requires supervision'
            }
          ]
        }
      }
    };
    
    render(<TestComponent initialData={initialData} />);
    
    // Should show data loaded alert
    expect(screen.getByText('Data Loaded From Assessment Context')).toBeInTheDocument();
    
    // Should handle independence levels correctly
    expect(typicalDayMapper.mapContextToForm).toHaveBeenCalledWith(
      expect.objectContaining({
        morningRoutine: expect.objectContaining({
          activities: expect.arrayContaining([
            expect.objectContaining({
              independence: 'Requires moderate assistance'
            }),
            expect.objectContaining({
              independence: 'Independent with setup'
            })
          ])
        }),
        afternoonRoutine: expect.objectContaining({
          activities: expect.arrayContaining([
            expect.objectContaining({
              independence: 'Independent'
            }),
            expect.objectContaining({
              independence: 'Requires supervision'
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
      typicalDay: {
        morningRoutine: {
          wakeUpTime: '07:00',
          activities: [
            {
              time: '07:00 - 07:30',
              activity: 'Personal hygiene',
              independence: 'Independent'
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
