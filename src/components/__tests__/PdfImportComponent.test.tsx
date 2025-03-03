/**
 * Tests for the PDF Import Component
 * 
 * These tests verify:
 * 1. Initial component rendering
 * 2. File selection functionality
 * 3. PDF processing flow
 * 4. Data extraction display
 * 5. Section selection and import
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PdfImportComponent from '../PdfImportComponent';
import * as pdfProcessingService from '@/services/pdfProcessingService';
import { AssessmentProvider } from '@/contexts/AssessmentContext';

// Mock the PDF processing service
jest.mock('@/services/pdfProcessingService', () => ({
  processPdf: jest.fn(),
  mapToAssessmentContext: jest.fn()
}));

// Mock toast functionality
jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn()
  })
}));

// Mock AssessmentContext
jest.mock('@/contexts/AssessmentContext', () => ({
  useAssessment: () => ({
    data: {},
    updateSection: jest.fn()
  }),
  AssessmentProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

describe('PdfImportComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mock responses
    (pdfProcessingService.processPdf as jest.Mock).mockResolvedValue({
      demographics: { name: 'John Doe', dob: '01/01/1980' },
      medicalHistory: { conditions: [{ condition: 'Hypertension' }] },
      confidence: {
        demographics: 0.9,
        medicalHistory: 0.7
      },
      originalText: 'Sample text content'
    });
    
    (pdfProcessingService.mapToAssessmentContext as jest.Mock).mockReturnValue({
      demographics: { name: 'John Doe', dob: '01/01/1980' },
      medicalHistory: { conditions: [{ condition: 'Hypertension' }] }
    });
  });
  
  it('renders the initial upload interface', () => {
    render(<PdfImportComponent />);
    
    // Check that the upload interface is displayed
    expect(screen.getByText(/Import Data from PDF/i)).toBeInTheDocument();
    expect(screen.getByText(/Click to select a PDF file/i)).toBeInTheDocument();
    expect(screen.getByText(/Process PDF/i)).toBeInTheDocument();
    
    // Process button should be disabled initially
    expect(screen.getByText(/Process PDF/i).closest('button')).toBeDisabled();
  });
  
  it('allows selecting a file and enables process button', async () => {
    render(<PdfImportComponent />);
    
    // Upload a file
    const fileInput = screen.getByLabelText(/Click to select a PDF file/i);
    
    // Create a mock file and trigger change event
    const file = new File(['mock pdf content'], 'test.pdf', { type: 'application/pdf' });
    
    // Using fireEvent to simulate file upload
    fireEvent.change(fileInput, { 
      target: { 
        files: [file] 
      } 
    });
    
    // Check that the file name is displayed
    expect(screen.getByText(/Selected file: test.pdf/i)).toBeInTheDocument();
    
    // Process button should be enabled
    expect(screen.getByText(/Process PDF/i).closest('button')).not.toBeDisabled();
  });
  
  it('processes PDF and displays extracted sections', async () => {
    render(<PdfImportComponent />);
    
    // Upload a file
    const fileInput = screen.getByLabelText(/Click to select a PDF file/i);
    const file = new File(['mock pdf content'], 'test.pdf', { type: 'application/pdf' });
    
    // Using fireEvent to simulate file upload
    fireEvent.change(fileInput, { 
      target: { 
        files: [file] 
      } 
    });
    
    // Click process button
    const processButton = screen.getByText(/Process PDF/i).closest('button');
    fireEvent.click(processButton!);
    
    // Wait for processing to complete
    await waitFor(() => {
      expect(pdfProcessingService.processPdf).toHaveBeenCalled();
      expect(pdfProcessingService.mapToAssessmentContext).toHaveBeenCalled();
    });
    
    // Check for review interface
    await waitFor(() => {
      expect(screen.getByText(/Review Extracted Data/i)).toBeInTheDocument();
    });
    
    // Check for section checkboxes
    expect(screen.getByLabelText(/Demographics/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Medical History/i)).toBeInTheDocument();
    
    // Sections with data should have confidence badges
    expect(screen.getByText(/90% match/i)).toBeInTheDocument(); // Demographics 0.9 = 90%
    expect(screen.getByText(/70% match/i)).toBeInTheDocument(); // Medical History 0.7 = 70%
    
    // Sections without data should be disabled
    const symptomsSectionText = screen.getByText(/No data detected for this section/i);
    expect(symptomsSectionText).toBeInTheDocument();
  });
  
  it('allows selecting sections and importing data', async () => {
    const updateSectionMock = jest.fn();
    jest.spyOn(require('@/contexts/AssessmentContext'), 'useAssessment').mockReturnValue({
      data: {},
      updateSection: updateSectionMock
    });
    
    render(<PdfImportComponent />);
    
    // Upload and process a file
    const fileInput = screen.getByLabelText(/Click to select a PDF file/i);
    const file = new File(['mock pdf content'], 'test.pdf', { type: 'application/pdf' });
    
    // Using fireEvent to simulate file upload
    fireEvent.change(fileInput, { 
      target: { 
        files: [file] 
      } 
    });
    
    const processButton = screen.getByText(/Process PDF/i).closest('button');
    fireEvent.click(processButton!);
    
    // Wait for processing to complete
    await waitFor(() => {
      expect(screen.getByText(/Review Extracted Data/i)).toBeInTheDocument();
    });
    
    // Sections with high confidence should be pre-selected
    const demographicsCheckbox = screen.getByLabelText(/Demographics/i);
    expect(demographicsCheckbox).toBeChecked();
    
    // Click Import Selected button
    const importButton = screen.getByText(/Import Selected/i).closest('button');
    fireEvent.click(importButton!);
    
    // Verify that updateSection was called with the correct data
    expect(updateSectionMock).toHaveBeenCalledWith('demographics', { name: 'John Doe', dob: '01/01/1980' });
  });
  
  it('handles errors during PDF processing', async () => {
    // Mock an error during processing
    (pdfProcessingService.processPdf as jest.Mock).mockRejectedValue(new Error('Processing failed'));
    
    const toastMock = jest.fn();
    jest.spyOn(require('@/components/ui/use-toast'), 'useToast').mockReturnValue({
      toast: toastMock
    });
    
    render(<PdfImportComponent />);
    
    // Upload a file
    const fileInput = screen.getByLabelText(/Click to select a PDF file/i);
    const file = new File(['mock pdf content'], 'test.pdf', { type: 'application/pdf' });
    
    // Using fireEvent to simulate file upload
    fireEvent.change(fileInput, { 
      target: { 
        files: [file] 
      } 
    });
    
    // Click process button
    const processButton = screen.getByText(/Process PDF/i).closest('button');
    fireEvent.click(processButton!);
    
    // Wait for error handling
    await waitFor(() => {
      expect(pdfProcessingService.processPdf).toHaveBeenCalled();
      expect(toastMock).toHaveBeenCalledWith(expect.objectContaining({
        title: "PDF Processing Failed"
      }));
    });
    
    // Should remain on the upload screen
    expect(screen.getByText(/Click to select a PDF file/i)).toBeInTheDocument();
  });
  
  it('allows canceling the import process after extraction', async () => {
    render(<PdfImportComponent />);
    
    // Upload and process a file
    const fileInput = screen.getByLabelText(/Click to select a PDF file/i);
    const file = new File(['mock pdf content'], 'test.pdf', { type: 'application/pdf' });
    
    // Using fireEvent to simulate file upload
    fireEvent.change(fileInput, { 
      target: { 
        files: [file] 
      } 
    });
    
    const processButton = screen.getByText(/Process PDF/i).closest('button');
    fireEvent.click(processButton!);
    
    // Wait for processing to complete
    await waitFor(() => {
      expect(screen.getByText(/Review Extracted Data/i)).toBeInTheDocument();
    });
    
    // Click Cancel button
    const cancelButton = screen.getByText(/Cancel/i).closest('button');
    fireEvent.click(cancelButton!);
    
    // Should return to the upload screen
    await waitFor(() => {
      expect(screen.getByText(/Click to select a PDF file/i)).toBeInTheDocument();
    });
  });
});
