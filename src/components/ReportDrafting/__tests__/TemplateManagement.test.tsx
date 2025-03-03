import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ReportDraftingProvider } from '@/contexts/ReportDrafting/ReportDraftingContext';
import TemplateManagement from '../TemplateManagement';
import * as templateService from '@/lib/report-drafting/template-service';

// Mock the template service
jest.mock('@/lib/report-drafting/template-service');
const mockTemplateService = templateService as jest.Mocked<typeof templateService>;

// Mock toast notifications
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

describe('TemplateManagement Component', () => {
  // Sample template data for tests
  const sampleTemplateLibrary = {
    userId: 'current-user',
    personalTemplates: [
      {
        id: 'template-1',
        name: 'Test Template 1',
        description: 'This is a test template',
        defaultSections: [],
        defaultTitle: 'Test Report',
        defaultStyle: 'clinical',
        isBuiltIn: false,
        version: 1,
        isShared: false,
        tags: ['test', 'sample'],
        category: 'Test',
        createdBy: 'current-user',
        createdAt: new Date(),
        lastModified: new Date()
      },
      {
        id: 'template-2',
        name: 'Test Template 2',
        description: 'This is a shared test template',
        defaultSections: [],
        defaultTitle: 'Test Report 2',
        defaultStyle: 'conversational',
        isBuiltIn: false,
        version: 1,
        isShared: true,
        tags: ['test', 'shared'],
        category: 'Shared',
        createdBy: 'current-user',
        createdAt: new Date(),
        lastModified: new Date()
      }
    ],
    favoriteTemplates: ['template-1'],
    recentlyUsedTemplates: [
      {
        templateId: 'template-1',
        lastUsed: new Date(),
        useCount: 3
      }
    ]
  };

  beforeEach(() => {
    // Reset all mocks
    jest.resetAllMocks();
    
    // Set up mock implementations
    mockTemplateService.getUserTemplateLibrary.mockResolvedValue(sampleTemplateLibrary);
    mockTemplateService.deleteTemplate.mockResolvedValue(true);
    mockTemplateService.updateTemplate.mockImplementation(
      (id, updates) => Promise.resolve({
        ...sampleTemplateLibrary.personalTemplates.find(t => t.id === id)!,
        ...updates,
        lastModified: new Date()
      })
    );
    mockTemplateService.toggleFavoriteTemplate.mockResolvedValue(true);
    mockTemplateService.toggleTemplateSharing.mockImplementation(
      (id, isShared) => Promise.resolve({
        ...sampleTemplateLibrary.personalTemplates.find(t => t.id === id)!,
        isShared,
        lastModified: new Date()
      })
    );
    mockTemplateService.exportTemplate.mockResolvedValue(new Blob(['test']));
  });

  it('should render the template management UI', async () => {
    render(
      <ReportDraftingProvider>
        <TemplateManagement />
      </ReportDraftingProvider>
    );
    
    // Wait for the template library to load
    await waitFor(() => {
      expect(mockTemplateService.getUserTemplateLibrary).toHaveBeenCalled();
    });
    
    // Check for title
    expect(screen.getByText('Template Library')).toBeInTheDocument();
    
    // Check for tabs
    expect(screen.getByRole('tab', { name: /all templates/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /favorites/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /shared/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /recently used/i })).toBeInTheDocument();
    
    // Check for template cards
    expect(screen.getByText('Test Template 1')).toBeInTheDocument();
    expect(screen.getByText('Test Template 2')).toBeInTheDocument();
  });

  it('should filter templates based on active tab', async () => {
    render(
      <ReportDraftingProvider>
        <TemplateManagement />
      </ReportDraftingProvider>
    );
    
    // Wait for the template library to load
    await waitFor(() => {
      expect(mockTemplateService.getUserTemplateLibrary).toHaveBeenCalled();
    });
    
    // Check for both templates in "All" tab
    expect(screen.getByText('Test Template 1')).toBeInTheDocument();
    expect(screen.getByText('Test Template 2')).toBeInTheDocument();
    
    // Click on Favorites tab
    fireEvent.click(screen.getByRole('tab', { name: /favorites/i }));
    
    // Only Template 1 should be visible
    expect(screen.getByText('Test Template 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Template 2')).not.toBeInTheDocument();
    
    // Click on Shared tab
    fireEvent.click(screen.getByRole('tab', { name: /shared/i }));
    
    // Only Template 2 should be visible
    expect(screen.queryByText('Test Template 1')).not.toBeInTheDocument();
    expect(screen.getByText('Test Template 2')).toBeInTheDocument();
  });

  it('should filter templates based on search query', async () => {
    render(
      <ReportDraftingProvider>
        <TemplateManagement />
      </ReportDraftingProvider>
    );
    
    // Wait for the template library to load
    await waitFor(() => {
      expect(mockTemplateService.getUserTemplateLibrary).toHaveBeenCalled();
    });
    
    // Check for both templates initially
    expect(screen.getByText('Test Template 1')).toBeInTheDocument();
    expect(screen.getByText('Test Template 2')).toBeInTheDocument();
    
    // Enter search query
    const searchInput = screen.getByPlaceholderText('Search templates...');
    fireEvent.change(searchInput, { target: { value: 'shared' } });
    
    // Only Template 2 should be visible
    expect(screen.queryByText('Test Template 1')).not.toBeInTheDocument();
    expect(screen.getByText('Test Template 2')).toBeInTheDocument();
  });

  it('should toggle a template as favorite', async () => {
    render(
      <ReportDraftingProvider>
        <TemplateManagement />
      </ReportDraftingProvider>
    );
    
    // Wait for the template library to load
    await waitFor(() => {
      expect(mockTemplateService.getUserTemplateLibrary).toHaveBeenCalled();
    });
    
    // Find the heart button for Template 1 (already a favorite)
    const favoriteButtons = screen.getAllByRole('button', { name: '' });
    const heartButton = favoriteButtons.find(button => 
      button.className.includes('text-red-500')
    );
    
    // Click the heart button to remove from favorites
    fireEvent.click(heartButton!);
    
    // Wait for the API call
    await waitFor(() => {
      expect(mockTemplateService.toggleFavoriteTemplate).toHaveBeenCalledWith('template-1', false);
    });
  });

  it('should toggle template sharing', async () => {
    render(
      <ReportDraftingProvider>
        <TemplateManagement />
      </ReportDraftingProvider>
    );
    
    // Wait for the template library to load
    await waitFor(() => {
      expect(mockTemplateService.getUserTemplateLibrary).toHaveBeenCalled();
    });
    
    // Find all buttons (we need to find the share button)
    const allButtons = screen.getAllByRole('button');
    
    // Get the button for Template 1 (not shared)
    const shareButton = allButtons.find(button => 
      button.className.includes('text-gray-400') && 
      button.innerHTML.includes('Share2')
    );
    
    // Click the share button to toggle sharing
    fireEvent.click(shareButton!);
    
    // Wait for the API call
    await waitFor(() => {
      expect(mockTemplateService.toggleTemplateSharing).toHaveBeenCalledWith('template-1', true);
    });
  });

  it('should delete a template when delete is confirmed', async () => {
    render(
      <ReportDraftingProvider>
        <TemplateManagement />
      </ReportDraftingProvider>
    );
    
    // Wait for the template library to load
    await waitFor(() => {
      expect(mockTemplateService.getUserTemplateLibrary).toHaveBeenCalled();
    });
    
    // Find all buttons (we need to find the delete button)
    const allButtons = screen.getAllByRole('button');
    
    // Get the delete button for Template 1
    const deleteButton = allButtons.find(button => 
      button.className.includes('text-red-400') &&
      button.innerHTML.includes('Trash2')
    );
    
    // Click the delete button to open the confirmation dialog
    fireEvent.click(deleteButton!);
    
    // Wait for the dialog to open
    await waitFor(() => {
      expect(screen.getByText('Delete Template')).toBeInTheDocument();
    });
    
    // Click the confirm button
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    
    // Wait for the API call
    await waitFor(() => {
      expect(mockTemplateService.deleteTemplate).toHaveBeenCalledWith('template-1');
    });
  });

  it('should export a template', async () => {
    // Mock URL.createObjectURL and createElement
    const mockUrl = 'blob:test';
    global.URL.createObjectURL = jest.fn().mockReturnValue(mockUrl);
    
    const mockAnchor = {
      href: '',
      download: '',
      click: jest.fn(),
      remove: jest.fn()
    };
    document.createElement = jest.fn().mockReturnValue(mockAnchor);
    document.body.appendChild = jest.fn();
    document.body.removeChild = jest.fn();
    
    render(
      <ReportDraftingProvider>
        <TemplateManagement />
      </ReportDraftingProvider>
    );
    
    // Wait for the template library to load
    await waitFor(() => {
      expect(mockTemplateService.getUserTemplateLibrary).toHaveBeenCalled();
    });
    
    // Find all buttons (we need to find the export button)
    const allButtons = screen.getAllByRole('button');
    
    // Get the export button for Template 1
    const exportButton = allButtons.find(button => 
      !button.className.includes('text-red-400') &&
      button.innerHTML.includes('Download')
    );
    
    // Click the export button
    fireEvent.click(exportButton!);
    
    // Wait for the API call
    await waitFor(() => {
      expect(mockTemplateService.exportTemplate).toHaveBeenCalledWith('template-1');
    });
    
    // Check that the download anchor was created
    expect(mockAnchor.click).toHaveBeenCalled();
  });
});
