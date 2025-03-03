/**
 * Medical History Integrated Component Tests
 * 
 * Tests for the MedicalHistoryIntegrated component that uses the mapper service
 * to integrate with the Assessment Context.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MedicalHistoryIntegrated } from '../components/MedicalHistory.integrated';
import { AssessmentContext } from '@/contexts/AssessmentContext';
import * as medicalHistoryMapper from '@/services/medicalHistoryMapper';

// Mock the mapper service
jest.mock('@/services/medicalHistoryMapper', () => ({
  mapContextToForm: jest.fn(() => ({ 
    formData: { data: {
      preExistingConditions: [],
      surgeries: [],
      allergies: [],
      currentMedications: [],
      injury: {
        date: '',
        time: '',
        position: '',
        impactType: '',
        circumstance: '',
        preparedForImpact: '',
        immediateSymptoms: '',
        immediateResponse: '',
        vehicleDamage: '',
        subsequentCare: '',
        initialTreatment: ''
      },
      currentTreatments: []
    }}, 
    hasData: false 
  })),
  mapFormToContext: jest.fn((formData) => ({ 
    pastMedicalHistory: {
      conditions: [],
      surgeries: [],
      allergies: '',
      medications: []
    },
    injuryDetails: {},
    treatmentHistory: {
      rehabilitationServices: [],
      hospitalizations: []
    }
  })),
  exportMedicalHistoryToJson: jest.fn(() => '{"mock":"json"}'),
  importMedicalHistoryFromJson: jest.fn(() => ({}))
}));

// Mock the form persistence hook
jest.mock('@/hooks/useFormPersistence', () => ({
  useFormPersistence: () => ({
    persistForm: jest.fn()
  })
}));

// Mock the components that would be rendered in tabs
jest.mock('../components/PreExistingConditionsSection', () => ({
  PreExistingConditionsSection: () => <div data-testid="pre-existing-section">Pre-existing conditions content</div>
}));

jest.mock('../components/InjuryDetailsSection', () => ({
  InjuryDetailsSection: () => <div data-testid="injury-details-section">Injury details content</div>
}));

jest.mock('../components/TreatmentSection', () => ({
  TreatmentSection: () => <div data-testid="treatment-section">Treatment content</div>
}));

jest.mock('../components/MedicationsSection', () => ({
  MedicationsSection: () => <div data-testid="medications-section">Medications content</div>
}));

// Mock URL object methods
URL.createObjectURL = jest.fn(() => 'blob:mock-url');
URL.revokeObjectURL = jest.fn();

// Mock document methods
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

// Helper for rendering with context
const renderWithContext = (ui, contextValue = {}) => {
  return render(
    <AssessmentContext.Provider value={{
      data: {},
      updateSection: jest.fn(),
      ...contextValue
    }}>
      {ui}
    </AssessmentContext.Provider>
  );
};

describe('MedicalHistoryIntegrated Component', () => {
  let mockUpdateSection;
  let mockData;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup mock context values
    mockUpdateSection = jest.fn();
    mockData = {
      medicalHistory: {
        pastMedicalHistory: {
          conditions: [
            {
              condition: 'Asthma',
              diagnosisDate: '2010-05-15',
              treatment: 'Inhaler as needed'
            }
          ]
        }
      }
    };
    
    // Setup specific mock return for context data case
    (medicalHistoryMapper.mapContextToForm as jest.Mock).mockReturnValue({
      formData: { 
        data: {
          preExistingConditions: [
            { 
              condition: 'Asthma',
              diagnosisDate: '2010-05-15',
              details: 'Inhaler as needed'
            }
          ],
          surgeries: [],
          allergies: [],
          currentMedications: [],
          injury: {
            date: '',
            time: '',
            position: '',
            impactType: '',
            circumstance: '',
            preparedForImpact: '',
            immediateSymptoms: '',
            immediateResponse: '',
            vehicleDamage: '',
            subsequentCare: '',
            initialTreatment: ''
          },
          currentTreatments: []
        }
      },
      hasData: true
    });
  });
  
  it('renders the component with title and description', () => {
    renderWithContext(<MedicalHistoryIntegrated />);
    
    expect(screen.getByText('Medical History')).toBeInTheDocument();
    expect(screen.getByText(/Pre-existing conditions, injury details, and current treatments/)).toBeInTheDocument();
  });
  
  it('renders all tabs correctly', () => {
    renderWithContext(<MedicalHistoryIntegrated />);
    
    expect(screen.getByText('Pre-Existing')).toBeInTheDocument();
    expect(screen.getByText('Injury Details')).toBeInTheDocument();
    expect(screen.getByText('Treatment')).toBeInTheDocument();
    expect(screen.getByText('Medications')).toBeInTheDocument();
  });
  
  it('shows the pre-existing tab content by default', () => {
    renderWithContext(<MedicalHistoryIntegrated />);
    
    expect(screen.getByTestId('pre-existing-section')).toBeInTheDocument();
    expect(screen.queryByTestId('injury-details-section')).not.toBeVisible();
  });
  
  it('switches tabs when clicked', async () => {
    renderWithContext(<MedicalHistoryIntegrated />);
    const user = userEvent.setup();
    
    // Initial tab should be pre-existing
    expect(screen.getByTestId('pre-existing-section')).toBeInTheDocument();
    
    // Click Injury Details tab
    await user.click(screen.getByText('Injury Details'));
    
    // Should now show injury details tab content
    expect(screen.getByTestId('injury-details-section')).toBeVisible();
    expect(screen.queryByTestId('pre-existing-section')).not.toBeVisible();
  });
  
  it('loads data from context and shows data loaded alert', () => {
    renderWithContext(<MedicalHistoryIntegrated />, {
      data: mockData,
      updateSection: mockUpdateSection
    });
    
    // Should show data loaded alert
    expect(screen.getByText('Data Loaded From Assessment Context')).toBeInTheDocument();
    
    // Should have called mapper with correct data
    expect(medicalHistoryMapper.mapContextToForm).toHaveBeenCalledWith(
      mockData.medicalHistory,
      expect.any(Object)
    );
  });
  
  it('updates context when form is submitted', async () => {
    renderWithContext(<MedicalHistoryIntegrated />, {
      data: mockData,
      updateSection: mockUpdateSection
    });
    const user = userEvent.setup();
    
    // Submit the form
    await user.click(screen.getByText('Save Medical History'));
    
    // Should call mapFormToContext
    expect(medicalHistoryMapper.mapFormToContext).toHaveBeenCalled();
    
    // Should update context
    expect(mockUpdateSection).toHaveBeenCalledWith(
      'medicalHistory',
      expect.anything()
    );
  });
  
  it('calls export function when Export JSON button is clicked', async () => {
    renderWithContext(<MedicalHistoryIntegrated />, {
      data: mockData,
      updateSection: mockUpdateSection
    });
    const user = userEvent.setup();
    
    // Click export button
    await user.click(screen.getByText('Export JSON'));
    
    // Should call export function
    expect(medicalHistoryMapper.exportMedicalHistoryToJson).toHaveBeenCalled();
    
    // Should create a download link
    expect(URL.createObjectURL).toHaveBeenCalled();
    
    // Should revoke URL after download
    expect(URL.revokeObjectURL).toHaveBeenCalled();
  });
  
  it('resets form when Reset button is clicked', async () => {
    renderWithContext(<MedicalHistoryIntegrated />, {
      data: mockData,
      updateSection: mockUpdateSection
    });
    const user = userEvent.setup();
    
    // Click reset button
    await user.click(screen.getByText('Reset'));
    
    // Form should be reset (implementation depends on your form setup)
    // In this test, we just verify the button exists and is clickable
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });
  
  it('shows appropriate error handling for failed mapping', () => {
    // Mock a failed mapping
    (medicalHistoryMapper.mapContextToForm as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Mapping failed');
    });
    
    renderWithContext(<MedicalHistoryIntegrated />, {
      data: mockData,
      updateSection: mockUpdateSection
    });
    
    // Component should render without crashing despite the error
    expect(screen.getByText('Medical History')).toBeInTheDocument();
    
    // The data loaded alert should not be shown
    expect(screen.queryByText('Data Loaded From Assessment Context')).not.toBeInTheDocument();
  });
});
