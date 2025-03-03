/**
 * Tests for the ReportDrafting context provider
 */

import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { ReportDraftingProvider, useReportDraftingContext } from '../ReportDraftingContext';
import * as apiService from '@/lib/report-drafting/api-service';

// Mock the API service
jest.mock('@/lib/report-drafting/api-service', () => ({
  getAvailableTemplates: jest.fn(),
  getTemplate: jest.fn(),
  getDataAvailabilityStatus: jest.fn(),
  createReportConfiguration: jest.fn(),
  generateReport: jest.fn(),
  updateReportSection: jest.fn(),
  exportReport: jest.fn()
}));

// Test component that uses the context
const TestComponent = () => {
  const { 
    templates, 
    selectedTemplate, 
    activeStep,
    isLoading,
    error,
    loadTemplates,
    selectTemplate,
    setActiveStep,
    goToNextStep
  } = useReportDraftingContext();
  
  return (
    <div>
      <div data-testid="loading">{isLoading ? 'Loading' : 'Not Loading'}</div>
      <div data-testid="error">{error || 'No Error'}</div>
      <div data-testid="active-step">{activeStep}</div>
      <div data-testid="templates-count">{templates.length}</div>
      <div data-testid="selected-template">{selectedTemplate ? selectedTemplate.name : 'None'}</div>
      <button data-testid="load-templates" onClick={() => loadTemplates()}>Load Templates</button>
      <button data-testid="select-template" onClick={() => selectTemplate('template-1')}>Select Template</button>
      <button data-testid="next-step" onClick={() => goToNextStep()}>Next Step</button>
      <button data-testid="set-configure" onClick={() => setActiveStep('configure')}>Go to Configure</button>
    </div>
  );
};

describe('ReportDraftingContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementations
    (apiService.getAvailableTemplates as jest.Mock).mockResolvedValue([
      { id: 'template-1', name: 'Template 1' },
      { id: 'template-2', name: 'Template 2' }
    ]);
    
    (apiService.getTemplate as jest.Mock).mockResolvedValue({
      id: 'template-1',
      name: 'Template 1'
    });
  });
  
  test('should initialize with default values', () => {
    render(
      <ReportDraftingProvider>
        <TestComponent />
      </ReportDraftingProvider>
    );
    
    expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
    expect(screen.getByTestId('error')).toHaveTextContent('No Error');
    expect(screen.getByTestId('active-step')).toHaveTextContent('template-selection');
    expect(screen.getByTestId('templates-count')).toHaveTextContent('0');
    expect(screen.getByTestId('selected-template')).toHaveTextContent('None');
  });
  
  test('should load templates', async () => {
    render(
      <ReportDraftingProvider>
        <TestComponent />
      </ReportDraftingProvider>
    );
    
    // Click the button to load templates
    await act(async () => {
      screen.getByTestId('load-templates').click();
    });
    
    // Check that loading state was set
    expect(apiService.getAvailableTemplates).toHaveBeenCalled();
    
    // Wait for templates to load
    await waitFor(() => {
      expect(screen.getByTestId('templates-count')).toHaveTextContent('2');
    });
  });
  
  test('should select a template', async () => {
    render(
      <ReportDraftingProvider>
        <TestComponent />
      </ReportDraftingProvider>
    );
    
    // Click the button to select a template
    await act(async () => {
      screen.getByTestId('select-template').click();
    });
    
    // Check that getTemplate was called
    expect(apiService.getTemplate).toHaveBeenCalledWith('template-1');
    
    // Wait for template to be selected
    await waitFor(() => {
      expect(screen.getByTestId('selected-template')).toHaveTextContent('Template 1');
    });
  });
  
  test('should handle navigation between steps', () => {
    render(
      <ReportDraftingProvider>
        <TestComponent />
      </ReportDraftingProvider>
    );
    
    // Initial state
    expect(screen.getByTestId('active-step')).toHaveTextContent('template-selection');
    
    // Go to configure step directly
    act(() => {
      screen.getByTestId('set-configure').click();
    });
    
    expect(screen.getByTestId('active-step')).toHaveTextContent('configure');
    
    // Go to next step (preview)
    act(() => {
      screen.getByTestId('next-step').click();
    });
    
    expect(screen.getByTestId('active-step')).toHaveTextContent('preview');
  });
  
  test('should handle API errors gracefully', async () => {
    // Mock API error
    (apiService.getAvailableTemplates as jest.Mock).mockRejectedValue(
      new Error('API error')
    );
    
    render(
      <ReportDraftingProvider>
        <TestComponent />
      </ReportDraftingProvider>
    );
    
    // Click the button to load templates (which will fail)
    await act(async () => {
      screen.getByTestId('load-templates').click();
    });
    
    // Check that error state was set
    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Failed to load report templates');
      expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
    });
  });
  
  test('should throw error when used outside provider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = jest.fn();
    
    // This should throw an error
    expect(() => render(<TestComponent />)).toThrow(
      'useReportDraftingContext must be used within a ReportDraftingProvider'
    );
    
    // Restore console.error
    console.error = originalError;
  });
});
