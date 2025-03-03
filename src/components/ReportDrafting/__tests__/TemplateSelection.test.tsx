/**
 * Tests for the TemplateSelection component
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { ReportDraftingProvider } from '@/contexts/ReportDrafting/ReportDraftingContext';
import TemplateSelection from '../TemplateSelection';
import * as apiService from '@/lib/report-drafting/api-service';

// Mock the API service
jest.mock('@/lib/report-drafting/api-service');
const mockApiService = apiService as jest.Mocked<typeof apiService>;

describe('TemplateSelection Component', () => {
  // Sample data for tests
  const sampleTemplates = [
    {
      id: 'template-1',
      name: 'Comprehensive Assessment',
      description: 'A comprehensive occupational therapy assessment',
      defaultSections: [],
      defaultTitle: 'OT Assessment Report',
      defaultStyle: 'clinical',
      isBuiltIn: true
    },
    {
      id: 'template-2',
      name: 'Brief Assessment',
      description: 'A brief occupational therapy assessment',
      defaultSections: [],
      defaultTitle: 'Brief OT Report',
      defaultStyle: 'conversational',
      isBuiltIn: true
    }
  ];

  beforeEach(() => {
    jest.resetAllMocks();
    
    // Default mock implementations
    mockApiService.getAvailableTemplates.mockResolvedValue(sampleTemplates);
    mockApiService.getTemplate.mockImplementation((id) => 
      Promise.resolve(sampleTemplates.find(t => t.id === id))
    );
  });

  it('should load and display templates', async () => {
    render(
      <ReportDraftingProvider>
        <TemplateSelection />
      </ReportDraftingProvider>
    );
    
    // Check loading state
    expect(screen.getByText('Loading templates...')).toBeInTheDocument();
    
    // Wait for templates to load
    await waitFor(() => {
      expect(mockApiService.getAvailableTemplates).toHaveBeenCalled();
    });
    
    // Check that templates are displayed
    expect(screen.getByText('Comprehensive Assessment')).toBeInTheDocument();
    expect(screen.getByText('Brief Assessment')).toBeInTheDocument();
  });

  it('should handle template selection', async () => {
    render(
      <ReportDraftingProvider>
        <TemplateSelection />
      </ReportDraftingProvider>
    );
    
    // Wait for templates to load
    await waitFor(() => {
      expect(mockApiService.getAvailableTemplates).toHaveBeenCalled();
    });
    
    // Click on a template
    await act(async () => {
      fireEvent.click(screen.getByText('Comprehensive Assessment'));
    });
    
    // Check that the template is selected
    expect(mockApiService.getTemplate).toHaveBeenCalledWith('template-1');
    
    // Check that the Next button is enabled
    const nextButton = screen.getByText('Next: Configure Report');
    expect(nextButton).not.toBeDisabled();
  });

  it('should handle error when loading templates', async () => {
    // Mock error response
    mockApiService.getAvailableTemplates.mockRejectedValue(new Error('API error'));
    
    render(
      <ReportDraftingProvider>
        <TemplateSelection />
      </ReportDraftingProvider>
    );
    
    // Wait for error to be displayed
    await waitFor(() => {
      expect(screen.getByText('Error loading templates')).toBeInTheDocument();
    });
    
    // Check that error message is displayed
    expect(screen.getByText('Try Again')).toBeInTheDocument();
    
    // Click Try Again and mock success
    mockApiService.getAvailableTemplates.mockResolvedValue(sampleTemplates);
    
    // Click try again
    await act(async () => {
      fireEvent.click(screen.getByText('Try Again'));
    });
    
    // Check that templates load
    await waitFor(() => {
      expect(screen.getByText('Comprehensive Assessment')).toBeInTheDocument();
    });
  });

  it('should display message when no templates are available', async () => {
    // Mock empty templates response
    mockApiService.getAvailableTemplates.mockResolvedValue([]);
    
    render(
      <ReportDraftingProvider>
        <TemplateSelection />
      </ReportDraftingProvider>
    );
    
    // Wait for empty state to be displayed
    await waitFor(() => {
      expect(screen.getByText('No templates available')).toBeInTheDocument();
    });
    
    // Check that refresh button is displayed
    expect(screen.getByText('Refresh Templates')).toBeInTheDocument();
    
    // Click Refresh and mock templates
    mockApiService.getAvailableTemplates.mockResolvedValue(sampleTemplates);
    
    // Click refresh
    await act(async () => {
      fireEvent.click(screen.getByText('Refresh Templates'));
    });
    
    // Check that templates load
    await waitFor(() => {
      expect(screen.getByText('Comprehensive Assessment')).toBeInTheDocument();
    });
  });

  it('should disable Next button when no template is selected', async () => {
    render(
      <ReportDraftingProvider>
        <TemplateSelection />
      </ReportDraftingProvider>
    );
    
    // Wait for templates to load
    await waitFor(() => {
      expect(mockApiService.getAvailableTemplates).toHaveBeenCalled();
    });
    
    // Check that Next button is disabled
    const nextButton = screen.getByText('Next: Configure Report');
    expect(nextButton).toBeDisabled();
  });
});
