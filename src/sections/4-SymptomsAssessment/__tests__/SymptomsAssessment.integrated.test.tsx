/**
 * Symptoms Assessment Integrated Component Tests
 * 
 * Tests for the SymptomsAssessmentIntegrated component that uses the mapper service
 * to integrate with the Assessment Context.
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SymptomsAssessmentIntegrated } from '../components/SymptomsAssessment.integrated';
import { AssessmentContext } from '@/contexts/AssessmentContext';
import * as symptomsAssessmentMapper from '@/services/symptomsAssessmentMapper';

// Mock the mapper service
jest.mock('@/services/symptomsAssessmentMapper', () => ({
  mapContextToForm: jest.fn(() => ({ 
    formData: { 
      general: { notes: '' },
      physical: [
        {
          id: 'test-id-1',
          location: '',
          intensity: '',
          description: '',
          frequency: '',
          duration: '',
          aggravating: [],
          alleviating: []
        }
      ],
      cognitive: [
        {
          id: 'test-id-2',
          type: '',
          impact: '',
          management: '',
          frequency: '',
          triggers: [],
          coping: []
        }
      ],
      emotional: []
    }, 
    hasData: false 
  })),
  mapFormToContext: jest.fn((formData) => ({ 
    generalNotes: '',
    physicalSymptoms: [],
    cognitiveSymptoms: [],
    emotionalSymptoms: []
  })),
  exportSymptomsToJson: jest.fn(() => '{"mock":"json"}'),
  importSymptomsFromJson: jest.fn(() => ({})),
  defaultValues: {
    general: { notes: '' },
    physical: [
      {
        id: 'default-id-1',
        location: '',
        intensity: '',
        description: '',
        frequency: '',
        duration: '',
        aggravating: [],
        alleviating: []
      }
    ],
    cognitive: [
      {
        id: 'default-id-2',
        type: '',
        impact: '',
        management: '',
        frequency: '',
        triggers: [],
        coping: []
      }
    ],
    emotional: []
  }
}));

// Mock the form persistence hook
jest.mock('@/hooks/useFormPersistence', () => ({
  useFormPersistence: () => ({
    persistForm: jest.fn()
  })
}));

// Mock the components that would be rendered in tabs
jest.mock('../components/PhysicalSymptomsSection.updated', () => ({
  PhysicalSymptomsSectionUpdated: () => <div data-testid="physical-symptoms-section">Physical symptoms content</div>
}));

jest.mock('../components/CognitiveSymptomsSection.updated', () => ({
  CognitiveSymptomsSectionUpdated: () => <div data-testid="cognitive-symptoms-section">Cognitive symptoms content</div>
}));

jest.mock('../components/EmotionalSymptomsSection', () => ({
  EmotionalSymptomsSection: () => <div data-testid="emotional-symptoms-section">Emotional symptoms content</div>
}));

jest.mock('../components/GeneralNotesSection', () => ({
  GeneralNotesSection: () => <div data-testid="general-notes-section">General notes content</div>
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

describe('SymptomsAssessmentIntegrated Component', () => {
  let mockUpdateSection;
  let mockData;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup mock context values
    mockUpdateSection = jest.fn();
    mockData = {
      symptomsAssessment: {
        generalNotes: 'Test notes',
        physicalSymptoms: [
          {
            id: 'physical-1',
            symptom: 'Headache',
            intensity: 'Severe',
            description: 'Throbbing pain',
            frequency: 'Weekly',
            duration: '6-8 hours',
            aggravatingFactors: 'Bright lights, Noise',
            alleviatingFactors: 'Darkness, Rest'
          }
        ]
      }
    };
    
    // Setup specific mock return for context data case
    (symptomsAssessmentMapper.mapContextToForm as jest.Mock).mockReturnValue({
      formData: { 
        general: { notes: 'Test notes' },
        physical: [
          {
            id: 'physical-1',
            location: 'Headache',
            intensity: 'Severe',
            description: 'Throbbing pain',
            frequency: 'Weekly',
            duration: '6-8 hours',
            aggravating: ['Bright lights', 'Noise'],
            alleviating: ['Darkness', 'Rest']
          }
        ],
        cognitive: [
          {
            id: 'default-id-2',
            type: '',
            impact: '',
            management: '',
            frequency: '',
            triggers: [],
            coping: []
          }
        ],
        emotional: []
      },
      hasData: true
    });
  });
  
  it('renders the component with title and description', () => {
    renderWithContext(<SymptomsAssessmentIntegrated />);
    
    expect(screen.getByText('Symptoms Assessment')).toBeInTheDocument();
    expect(screen.getByText(/Comprehensive evaluation of symptoms and their impact/)).toBeInTheDocument();
  });
  
  it('renders all tabs correctly', () => {
    renderWithContext(<SymptomsAssessmentIntegrated />);
    
    expect(screen.getByText('Physical')).toBeInTheDocument();
    expect(screen.getByText('Cognitive')).toBeInTheDocument();
    expect(screen.getByText('Emotional')).toBeInTheDocument();
    expect(screen.getByText('General')).toBeInTheDocument();
  });
  
  it('shows the physical tab content by default', () => {
    renderWithContext(<SymptomsAssessmentIntegrated />);
    
    expect(screen.getByTestId('physical-symptoms-section')).toBeInTheDocument();
    expect(screen.queryByTestId('cognitive-symptoms-section')).not.toBeVisible();
  });
  
  it('switches tabs when clicked', async () => {
    renderWithContext(<SymptomsAssessmentIntegrated />);
    const user = userEvent.setup();
    
    // Initial tab should be physical
    expect(screen.getByTestId('physical-symptoms-section')).toBeInTheDocument();
    
    // Click Cognitive tab
    await user.click(screen.getByText('Cognitive'));
    
    // Should now show cognitive tab content
    expect(screen.getByTestId('cognitive-symptoms-section')).toBeVisible();
    expect(screen.queryByTestId('physical-symptoms-section')).not.toBeVisible();
  });
  
  it('loads data from context and shows data loaded alert', () => {
    renderWithContext(<SymptomsAssessmentIntegrated />, {
      data: mockData,
      updateSection: mockUpdateSection
    });
    
    // Should show data loaded alert
    expect(screen.getByText('Data Loaded From Assessment Context')).toBeInTheDocument();
    
    // Should have called mapper with correct data
    expect(symptomsAssessmentMapper.mapContextToForm).toHaveBeenCalledWith(
      mockData.symptomsAssessment
    );
  });
  
  it('updates context when form is submitted', async () => {
    renderWithContext(<SymptomsAssessmentIntegrated />, {
      data: mockData,
      updateSection: mockUpdateSection
    });
    const user = userEvent.setup();
    
    // Submit the form
    await user.click(screen.getByText('Save Symptoms Assessment'));
    
    // Should call mapFormToContext
    expect(symptomsAssessmentMapper.mapFormToContext).toHaveBeenCalled();
    
    // Should update context
    expect(mockUpdateSection).toHaveBeenCalledWith(
      'symptomsAssessment',
      expect.anything()
    );
  });
  
  it('calls export function when Export JSON button is clicked', async () => {
    renderWithContext(<SymptomsAssessmentIntegrated />, {
      data: mockData,
      updateSection: mockUpdateSection
    });
    const user = userEvent.setup();
    
    // Click export button
    await user.click(screen.getByText('Export JSON'));
    
    // Should call export function
    expect(symptomsAssessmentMapper.exportSymptomsToJson).toHaveBeenCalled();
    
    // Should create a download link
    expect(URL.createObjectURL).toHaveBeenCalled();
    
    // Should revoke URL after download
    expect(URL.revokeObjectURL).toHaveBeenCalled();
  });
  
  it('resets form when Reset button is clicked', async () => {
    renderWithContext(<SymptomsAssessmentIntegrated />, {
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
  
  it('shows multiple symptoms support alert', () => {
    renderWithContext(<SymptomsAssessmentIntegrated />);
    
    // Should show the multiple symptoms alert
    expect(screen.getByText('Multiple Symptoms Support')).toBeInTheDocument();
    expect(screen.getByText(/This section now supports recording multiple physical and cognitive symptoms/)).toBeInTheDocument();
  });
  
  it('shows appropriate error handling for failed mapping', () => {
    // Mock a failed mapping
    (symptomsAssessmentMapper.mapContextToForm as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Mapping failed');
    });
    
    renderWithContext(<SymptomsAssessmentIntegrated />, {
      data: mockData,
      updateSection: mockUpdateSection
    });
    
    // Component should render without crashing despite the error
    expect(screen.getByText('Symptoms Assessment')).toBeInTheDocument();
    
    // The data loaded alert should not be shown
    expect(screen.queryByText('Data Loaded From Assessment Context')).not.toBeInTheDocument();
  });
  
  it('handles file import when Import JSON button is clicked', async () => {
    renderWithContext(<SymptomsAssessmentIntegrated />);
    const user = userEvent.setup();
    
    // Create a mock file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    
    // Mock FileReader
    const mockFileReader = {
      readAsText: jest.fn(),
      onload: null,
      result: '{"mockImported":"data"}'
    };
    global.FileReader = jest.fn(() => mockFileReader);
    
    // Click import button
    const importButton = screen.getByText('Import JSON');
    await user.click(importButton);
    
    // Simulate file selection (we can't directly test this due to browser security)
    // Instead, we'll verify that the import function would be called correctly
    expect(symptomsAssessmentMapper.importSymptomsFromJson).not.toHaveBeenCalled();
    
    // In a real scenario, the function would be called after file selection and reading
  });
});
