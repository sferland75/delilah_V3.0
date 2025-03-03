/**
 * PDF Import Integration Tests
 * 
 * Tests for the PDF Import functionality and its integration with the Assessment Context.
 */

import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AssessmentContextProvider } from '../../contexts/AssessmentContext';
import { PdfImportComponent } from '../../components/PdfImportComponent';

// Mock the PDF processing service
jest.mock('../../services/pdfProcessingService', () => ({
  extractStructuredData: jest.fn(),
  calculateConfidenceScores: jest.fn()
}));

// Import the mocked functions after mocking
import {
  extractStructuredData,
  calculateConfidenceScores
} from '../../services/pdfProcessingService';

// Mock the pattern matcher
jest.mock('../../services/patternMatcher', () => ({
  matchPatterns: jest.fn(),
  extractSectionData: jest.fn()
}));

describe('PDF Import Integration', () => {
  // Mock data for testing
  const mockPdfContent = "This is mock PDF content with some structured data";
  
  const mockExtractedData = {
    demographicsData: {
      clientName: 'John Smith',
      dateOfBirth: '1975-05-15',
      address: '123 Main St, Anytown, USA',
      phoneNumber: '(555) 123-4567',
      email: 'john.smith@example.com'
    },
    medicalHistoryData: {
      conditions: [
        { condition: 'Hypertension', diagnosisDate: '2015-03-10' },
        { condition: 'Type 2 Diabetes', diagnosisDate: '2018-11-22' }
      ],
      medications: [
        { name: 'Lisinopril', dosage: '10mg', frequency: 'daily' },
        { name: 'Metformin', dosage: '500mg', frequency: 'twice daily' }
      ]
    },
    functionalStatusData: {
      mobility: {
        status: 'Modified Independent',
        assistiveDevices: ['Walker'],
        limitations: 'Limited endurance for long distances'
      },
      adls: {
        bathing: 'Needs minimal assistance',
        dressing: 'Independent with adaptive equipment',
        toileting: 'Independent'
      }
    }
  };
  
  const mockConfidenceScores = {
    demographics: 0.92,
    medicalHistory: 0.85,
    functionalStatus: 0.78,
    adls: 0.88
  };

  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mock for PDF extraction
    (extractStructuredData as jest.Mock).mockResolvedValue(mockExtractedData);
    
    // Setup mock for confidence scores
    (calculateConfidenceScores as jest.Mock).mockReturnValue(mockConfidenceScores);
    
    // Mock global FileReader
    global.FileReader = class {
      onload: any;
      readAsArrayBuffer(file: Blob) {
        setTimeout(() => {
          this.onload({ target: { result: new ArrayBuffer(8) } });
        }, 50);
      }
    } as any;
  });

  it('should process PDF files and extract structured data', async () => {
    const updateAssessment = jest.fn();
    
    // Setup initial context value
    const initialContextValue = {
      assessment: {},
      updateAssessment
    };

    // Render component with context
    render(
      <AssessmentContextProvider initialValue={initialContextValue}>
        <PdfImportComponent />
      </AssessmentContextProvider>
    );

    // Create a mock file
    const file = new File([mockPdfContent], 'test.pdf', { type: 'application/pdf' });
    
    // Find file input and upload file
    const fileInput = screen.getByLabelText(/select pdf/i);
    await act(async () => {
      await userEvent.upload(fileInput, file);
    });

    // Verify loading state is shown
    expect(screen.getByText(/processing pdf/i)).toBeInTheDocument();
    
    // Wait for processing to complete
    await waitFor(() => {
      expect(extractStructuredData).toHaveBeenCalled();
      expect(calculateConfidenceScores).toHaveBeenCalled();
      expect(screen.getByText(/extracted data/i)).toBeInTheDocument();
    });
    
    // Verify extracted data is displayed with confidence scores
    expect(screen.getByText(/john smith/i)).toBeInTheDocument();
    expect(screen.getByText(/92%/i)).toBeInTheDocument(); // Demographics confidence
    expect(screen.getByText(/hypertension/i)).toBeInTheDocument();
    expect(screen.getByText(/85%/i)).toBeInTheDocument(); // Medical history confidence
  });

  it('should allow user to select which sections to import', async () => {
    const updateAssessment = jest.fn();
    
    // Setup initial context value
    const initialContextValue = {
      assessment: {},
      updateAssessment
    };

    // Render component with context
    render(
      <AssessmentContextProvider initialValue={initialContextValue}>
        <PdfImportComponent />
      </AssessmentContextProvider>
    );

    // Create a mock file
    const file = new File([mockPdfContent], 'test.pdf', { type: 'application/pdf' });
    
    // Find file input and upload file
    const fileInput = screen.getByLabelText(/select pdf/i);
    await act(async () => {
      await userEvent.upload(fileInput, file);
    });

    // Wait for processing to complete
    await waitFor(() => {
      expect(screen.getByText(/extracted data/i)).toBeInTheDocument();
    });
    
    // Select specific sections to import
    const demographicsCheckbox = screen.getByLabelText(/demographics/i);
    const medicalHistoryCheckbox = screen.getByLabelText(/medical history/i);
    
    await act(async () => {
      // Select only demographics and medical history
      await userEvent.click(demographicsCheckbox);
      await userEvent.click(medicalHistoryCheckbox);
      
      // Click import button
      const importButton = screen.getByRole('button', { name: /import selected/i });
      await userEvent.click(importButton);
    });

    // Verify updateAssessment was called with the correct data
    await waitFor(() => {
      expect(updateAssessment).toHaveBeenCalledWith(
        expect.objectContaining({
          demographics: expect.anything(),
          medicalHistory: expect.anything()
        })
      );
      
      // Verify only selected sections were included
      const updateCall = updateAssessment.mock.calls[0][0];
      expect(updateCall).toHaveProperty('demographics');
      expect(updateCall).toHaveProperty('medicalHistory');
      expect(updateCall).not.toHaveProperty('functionalStatus');
    });
  });

  it('should handle errors during PDF processing', async () => {
    // Setup mock to simulate an error
    (extractStructuredData as jest.Mock).mockRejectedValue(new Error('PDF processing failed'));
    
    console.error = jest.fn(); // Mock console.error

    // Setup initial context value
    const initialContextValue = {
      assessment: {},
      updateAssessment: jest.fn()
    };

    // Render component with context
    render(
      <AssessmentContextProvider initialValue={initialContextValue}>
        <PdfImportComponent />
      </AssessmentContextProvider>
    );

    // Create a mock file
    const file = new File([mockPdfContent], 'test.pdf', { type: 'application/pdf' });
    
    // Find file input and upload file
    const fileInput = screen.getByLabelText(/select pdf/i);
    await act(async () => {
      await userEvent.upload(fileInput, file);
    });

    // Verify error is displayed
    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
      expect(screen.getByText(/error processing pdf/i)).toBeInTheDocument();
    });
  });

  it('should display confidence indicators for extracted data', async () => {
    // Setup initial context value
    const initialContextValue = {
      assessment: {},
      updateAssessment: jest.fn()
    };

    // Render component with context
    render(
      <AssessmentContextProvider initialValue={initialContextValue}>
        <PdfImportComponent />
      </AssessmentContextProvider>
    );

    // Create a mock file
    const file = new File([mockPdfContent], 'test.pdf', { type: 'application/pdf' });
    
    // Find file input and upload file
    const fileInput = screen.getByLabelText(/select pdf/i);
    await act(async () => {
      await userEvent.upload(fileInput, file);
    });

    // Wait for processing to complete
    await waitFor(() => {
      expect(screen.getByText(/extracted data/i)).toBeInTheDocument();
    });
    
    // Check for confidence indicators
    const highConfidenceIndicator = screen.getByTestId('confidence-demographics');
    const mediumConfidenceIndicator = screen.getByTestId('confidence-functionalStatus');
    
    expect(highConfidenceIndicator).toHaveClass('bg-green-500'); // High confidence (92%)
    expect(mediumConfidenceIndicator).toHaveClass('bg-yellow-500'); // Medium confidence (78%)
  });

  it('should allow cancellation of the import process', async () => {
    // Setup initial context value
    const initialContextValue = {
      assessment: {},
      updateAssessment: jest.fn()
    };

    // Render component with context
    render(
      <AssessmentContextProvider initialValue={initialContextValue}>
        <PdfImportComponent />
      </AssessmentContextProvider>
    );

    // Create a mock file
    const file = new File([mockPdfContent], 'test.pdf', { type: 'application/pdf' });
    
    // Find file input and upload file
    const fileInput = screen.getByLabelText(/select pdf/i);
    await act(async () => {
      await userEvent.upload(fileInput, file);
    });

    // Wait for processing to complete
    await waitFor(() => {
      expect(screen.getByText(/extracted data/i)).toBeInTheDocument();
    });
    
    // Click cancel button
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await act(async () => {
      await userEvent.click(cancelButton);
    });

    // Verify component is reset to initial state
    await waitFor(() => {
      expect(screen.queryByText(/extracted data/i)).not.toBeInTheDocument();
      expect(screen.getByText(/select a pdf file/i)).toBeInTheDocument();
    });
    
    // Verify updateAssessment was not called
    expect(initialContextValue.updateAssessment).not.toHaveBeenCalled();
  });
});
