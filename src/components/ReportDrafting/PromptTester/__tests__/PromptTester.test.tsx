import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PromptTestingUI from '../index';
import PromptGenerator from '../PromptGenerator';
import PromptVisualizer from '../PromptVisualizer';
import PromptTester from '../PromptTester';
import SampleDataViewer from '../SampleDataViewer';

// Mock the prompt-templates module
jest.mock('@/lib/report-drafting/prompt-templates', () => ({
  getPromptTemplate: jest.fn().mockReturnValue('This is a mock prompt template'),
}));

// Mock the sample-data module
jest.mock('@/lib/report-drafting/prompt-testing/sample-data', () => ({
  getSampleData: jest.fn().mockReturnValue({
    clientName: 'John Smith',
    age: 45,
    diagnosis: 'Sample diagnosis',
    assessmentDate: '2025-02-25'
  }),
}));

// Mock the test-runner module
jest.mock('@/lib/report-drafting/prompt-testing/test-runner', () => ({
  testPrompt: jest.fn().mockResolvedValue({
    sectionId: 'initial-assessment',
    detailLevel: 'standard',
    style: 'clinical',
    promptLength: 1000,
    responseLength: 500,
    success: true,
    score: 8,
    issues: [],
    prompt: 'Mock prompt',
    response: 'Mock response'
  }),
}));

// Mock toast notifications
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

describe('Prompt Testing Components', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('PromptTestingUI', () => {
    it('renders the tabs and content', () => {
      render(<PromptTestingUI />);
      
      // Check that all tabs are present
      expect(screen.getByRole('tab', { name: /prompt generator/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /template visualizer/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /test runner/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /sample data/i })).toBeInTheDocument();
    });
    
    it('switches tabs when clicked', () => {
      render(<PromptTestingUI />);
      
      // Default tab should be "generator"
      expect(screen.getByRole('tab', { name: /prompt generator/i })).toHaveAttribute('data-state', 'active');
      
      // Click on "Test Runner" tab
      fireEvent.click(screen.getByRole('tab', { name: /test runner/i }));
      
      // "Test Runner" tab should now be active
      expect(screen.getByRole('tab', { name: /test runner/i })).toHaveAttribute('data-state', 'active');
      expect(screen.getByRole('tab', { name: /prompt generator/i })).toHaveAttribute('data-state', 'inactive');
    });
  });

  describe('PromptGenerator', () => {
    it('generates a prompt on initial render', () => {
      render(<PromptGenerator />);
      
      const { getPromptTemplate } = require('@/lib/report-drafting/prompt-templates');
      const { getSampleData } = require('@/lib/report-drafting/prompt-testing/sample-data');
      
      // Check that the prompt template and sample data functions were called
      expect(getSampleData).toHaveBeenCalled();
      expect(getPromptTemplate).toHaveBeenCalled();
      
      // Check that the generated prompt is displayed
      expect(screen.getByLabelText(/generated prompt/i)).toHaveValue('This is a mock prompt template');
    });
    
    it('regenerates the prompt when parameters change', () => {
      render(<PromptGenerator />);
      
      const { getPromptTemplate } = require('@/lib/report-drafting/prompt-templates');
      
      // Reset mock to track new calls
      getPromptTemplate.mockClear();
      
      // Change the section
      fireEvent.click(screen.getByRole('combobox', { name: /section/i }));
      fireEvent.click(screen.getByRole('option', { name: /medical history/i }));
      
      // Check that getPromptTemplate was called with the new parameters
      expect(getPromptTemplate).toHaveBeenCalledWith(
        'medical-history',
        expect.objectContaining({
          detailLevel: 'standard',
          style: 'clinical'
        })
      );
    });
  });

  describe('PromptVisualizer', () => {
    it('renders with formatted and raw views', () => {
      render(<PromptVisualizer />);
      
      // Check that both view tabs are present
      expect(screen.getByRole('tab', { name: /visual format/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /raw text/i })).toBeInTheDocument();
      
      // Visual format should be the default
      expect(screen.getByRole('tab', { name: /visual format/i })).toHaveAttribute('data-state', 'active');
    });
  });

  describe('PromptTester', () => {
    it('runs a test when the button is clicked', async () => {
      render(<PromptTester />);
      
      const { testPrompt } = require('@/lib/report-drafting/prompt-testing/test-runner');
      
      // Click the "Run Prompt Test" button
      fireEvent.click(screen.getByRole('button', { name: /run prompt test/i }));
      
      // Wait for the test to complete
      await waitFor(() => {
        expect(testPrompt).toHaveBeenCalledWith(
          'initial-assessment',
          'standard',
          'clinical'
        );
      });
      
      // Check that the test results are displayed
      expect(screen.getByText(/test results/i)).toBeInTheDocument();
      expect(screen.getByText(/quality score/i)).toBeInTheDocument();
      expect(screen.getByText(/mock response/i)).toBeInTheDocument();
    });
  });

  describe('SampleDataViewer', () => {
    it('displays sample data for the selected section', () => {
      render(<SampleDataViewer />);
      
      const { getSampleData } = require('@/lib/report-drafting/prompt-testing/sample-data');
      
      // Check that getSampleData was called for the default section
      expect(getSampleData).toHaveBeenCalledWith('initial-assessment');
      
      // Check that both view tabs are present
      expect(screen.getByRole('tab', { name: /formatted view/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /raw json/i })).toBeInTheDocument();
      
      // Sample data should be displayed
      expect(screen.getByText(/john smith/i)).toBeInTheDocument();
      expect(screen.getByText(/sample diagnosis/i)).toBeInTheDocument();
    });
    
    it('updates data when section changes', () => {
      render(<SampleDataViewer />);
      
      const { getSampleData } = require('@/lib/report-drafting/prompt-testing/sample-data');
      
      // Reset mock to track new calls
      getSampleData.mockClear();
      
      // Change the section
      fireEvent.click(screen.getByRole('combobox', { name: /section/i }));
      fireEvent.click(screen.getByRole('option', { name: /functional status/i }));
      
      // Check that getSampleData was called with the new section
      expect(getSampleData).toHaveBeenCalledWith('functional-status');
    });
  });
});
