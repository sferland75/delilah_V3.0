/**
 * Tests for the Load Assessment Component
 * 
 * These tests verify:
 * 1. Initial component rendering
 * 2. Sample case selection functionality
 * 3. Data loading flow
 * 4. Assessment context integration
 * 5. Error handling
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoadAssessment from '../LoadAssessment';
import { AssessmentProvider } from '@/contexts/AssessmentContext';
import * as AssessmentContext from '@/contexts/AssessmentContext';

// Mock the Assessment Context
jest.mock('@/contexts/AssessmentContext', () => ({
  useAssessmentContext: jest.fn(),
  AssessmentProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

// Mock the toast functionality
jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn()
  })
}));

describe('LoadAssessment Component', () => {
  // Setup mocks for each test
  let mockSetAssessmentData: jest.Mock;
  let mockToast: jest.Mock;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup context mock
    mockSetAssessmentData = jest.fn();
    (AssessmentContext.useAssessmentContext as jest.Mock).mockReturnValue({
      data: {},
      setAssessmentData: mockSetAssessmentData
    });
    
    // Setup toast mock
    mockToast = jest.fn();
    jest.spyOn(require('@/components/ui/use-toast'), 'useToast').mockReturnValue({
      toast: mockToast
    });
  });
  
  it('renders the initial load interface correctly', () => {
    render(<LoadAssessment />);
    
    // Check that the component renders correctly
    expect(screen.getByText(/Load Sample Assessment/i)).toBeInTheDocument();
    expect(screen.getByText(/Select a sample case to populate the assessment form/i)).toBeInTheDocument();
    
    // Check for the case selection dropdown
    expect(screen.getByText(/Choose a sample case/i)).toBeInTheDocument();
    
    // Check for action buttons
    expect(screen.getByText(/Upload Assessment File/i)).toBeInTheDocument();
    expect(screen.getByText(/Load Case/i)).toBeInTheDocument();
    
    // Load button should be disabled initially as no case is selected
    const loadButton = screen.getByText(/Load Case/i).closest('button');
    expect(loadButton).toBeDisabled();
  });
  
  it('enables the load button when a sample case is selected', async () => {
    render(<LoadAssessment />);
    
    // Initially the load button should be disabled
    const loadButton = screen.getByText(/Load Case/i).closest('button');
    expect(loadButton).toBeDisabled();
    
    // Open the select dropdown
    const selectTrigger = screen.getByText(/Choose a sample case/i);
    fireEvent.click(selectTrigger);
    
    // Wait for select options to appear
    await waitFor(() => {
      expect(screen.getByText(/John Smith - 45-year-old male with motor vehicle accident injuries/i)).toBeInTheDocument();
    });
    
    // Select John Smith case
    fireEvent.click(screen.getByText(/John Smith/i));
    
    // Load button should now be enabled
    expect(loadButton).not.toBeDisabled();
  });
  
  it('loads John Smith sample case data when selected and button clicked', async () => {
    render(<LoadAssessment />);
    
    // Open the select dropdown
    const selectTrigger = screen.getByText(/Choose a sample case/i);
    fireEvent.click(selectTrigger);
    
    // Select John Smith case
    await waitFor(() => {
      expect(screen.getByText(/John Smith/i)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText(/John Smith/i));
    
    // Click the load button
    const loadButton = screen.getByText(/Load Case/i).closest('button');
    fireEvent.click(loadButton!);
    
    // Should show loading indicator
    await waitFor(() => {
      expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    });
    
    // Wait for loading to complete
    await waitFor(() => {
      // Check that context was updated with John Smith data
      expect(mockSetAssessmentData).toHaveBeenCalledWith(expect.objectContaining({
        demographics: expect.objectContaining({
          personalInfo: expect.objectContaining({
            firstName: "John",
            lastName: "Smith"
          })
        }),
        medicalHistory: expect.anything(),
        symptomsAssessment: expect.anything(),
        functionalStatus: expect.anything(),
        typicalDay: expect.anything(),
        environmentalAssessment: expect.anything(),
        activitiesDailyLiving: expect.anything(),
        attendantCare: expect.anything()
      }));
      
      // Check that toast was shown
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: "Sample Case Loaded",
        description: expect.stringContaining("John Smith")
      }));
    });
  });
  
  it('loads Maria Garcia sample case data when selected and button clicked', async () => {
    render(<LoadAssessment />);
    
    // Open the select dropdown
    const selectTrigger = screen.getByText(/Choose a sample case/i);
    fireEvent.click(selectTrigger);
    
    // Select Maria Garcia case
    await waitFor(() => {
      expect(screen.getByText(/Maria Garcia/i)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText(/Maria Garcia/i));
    
    // Click the load button
    const loadButton = screen.getByText(/Load Case/i).closest('button');
    fireEvent.click(loadButton!);
    
    // Wait for loading to complete
    await waitFor(() => {
      // Check that context was updated with Maria Garcia data
      expect(mockSetAssessmentData).toHaveBeenCalledWith(expect.objectContaining({
        demographics: expect.objectContaining({
          personalInfo: expect.objectContaining({
            firstName: "Maria",
            lastName: "Garcia"
          })
        }),
        medicalHistory: expect.anything(),
        symptomsAssessment: expect.anything(),
        functionalStatus: expect.anything(),
        environmentalAssessment: expect.anything()
      }));
      
      // Check that toast was shown
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: "Sample Case Loaded",
        description: expect.stringContaining("Maria Garcia")
      }));
    });
  });
  
  it('displays error message if loading fails', async () => {
    // Mock the console.error to prevent log clutter
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock implementation to force an error
    (AssessmentContext.useAssessmentContext as jest.Mock).mockReturnValue({
      data: {},
      setAssessmentData: jest.fn(() => {
        throw new Error('Failed to load assessment data');
      })
    });
    
    render(<LoadAssessment />);
    
    // Open the select dropdown
    const selectTrigger = screen.getByText(/Choose a sample case/i);
    fireEvent.click(selectTrigger);
    
    // Select John Smith case
    await waitFor(() => {
      expect(screen.getByText(/John Smith/i)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText(/John Smith/i));
    
    // Click the load button
    const loadButton = screen.getByText(/Load Case/i).closest('button');
    fireEvent.click(loadButton!);
    
    // Wait for error handling
    await waitFor(() => {
      // Check that error toast was shown
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: "Error Loading Sample Case",
        description: expect.stringContaining("Failed to load assessment data")
      }));
    });
  });
  
  it('enables upload button but not implemented yet', () => {
    render(<LoadAssessment />);
    
    // Upload button should be enabled but clicking does nothing yet
    const uploadButton = screen.getByText(/Upload Assessment File/i).closest('button');
    expect(uploadButton).not.toBeDisabled();
    
    // No file input is currently wired up for this button
    const fileInputs = document.querySelectorAll('input[type="file"]');
    expect(fileInputs.length).toBe(0); // No file input yet
  });
  
  it('validates data structure before sending to context', async () => {
    render(<LoadAssessment />);
    
    // Open the select dropdown
    const selectTrigger = screen.getByText(/Choose a sample case/i);
    fireEvent.click(selectTrigger);
    
    // Select John Smith case
    await waitFor(() => {
      expect(screen.getByText(/John Smith/i)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText(/John Smith/i));
    
    // Click the load button
    const loadButton = screen.getByText(/Load Case/i).closest('button');
    fireEvent.click(loadButton!);
    
    // Wait for loading to complete
    await waitFor(() => {
      // The structure passed to the context should match the expected format
      const expectedData = mockSetAssessmentData.mock.calls[0][0];
      
      // Verify basic structure of each section
      expect(expectedData.demographics).toBeDefined();
      expect(expectedData.demographics.personalInfo).toBeDefined();
      expect(expectedData.medicalHistory).toBeDefined();
      expect(expectedData.medicalHistory.pastMedicalHistory).toBeDefined();
      expect(expectedData.symptomsAssessment).toBeDefined();
      expect(expectedData.symptomsAssessment.physicalSymptoms).toBeDefined();
      expect(expectedData.functionalStatus).toBeDefined();
      expect(expectedData.typicalDay).toBeDefined();
      expect(expectedData.environmentalAssessment).toBeDefined();
      expect(expectedData.activitiesDailyLiving).toBeDefined();
      expect(expectedData.attendantCare).toBeDefined();
      
      // Ensure no double-nesting issues
      expect(expectedData.typicalDay.typicalDay).toBeUndefined();
      expect(expectedData.medicalHistory.medicalHistory).toBeUndefined();
      expect(expectedData.symptomsAssessment.symptomsAssessment).toBeUndefined();
    });
  });
});
