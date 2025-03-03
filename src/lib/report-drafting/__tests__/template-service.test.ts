/**
 * Tests for the Template Management Service
 */

import * as templateService from '../template-service';
import { SavedTemplate } from '../types';

// Mock fetch for API calls
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    getAll: () => store
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Template Service', () => {
  // Sample template for tests
  const sampleTemplate: SavedTemplate = {
    id: 'template-1',
    name: 'Test Template',
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
  };
  
  // Reset all mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();
    localStorageMock.clear();
    
    // Set up fetch mock to reject by default
    (global.fetch as jest.Mock).mockRejectedValue(new Error('API error'));
  });
  
  describe('saveTemplate', () => {
    it('should save a template via API when successful', async () => {
      // Set up the fetch mock to return success
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(sampleTemplate)
      });
      
      const result = await templateService.saveTemplate(sampleTemplate);
      
      // Check that fetch was called correctly
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/report-drafting/templates/save',
        expect.objectContaining({
          method: 'POST',
          body: expect.any(String)
        })
      );
      
      // Check that the result matches the expected template
      expect(result).toEqual(sampleTemplate);
    });
    
    it('should fall back to local storage when API fails', async () => {
      // Mock localStorage to already have some templates
      const existingTemplates = [
        {
          id: 'existing-1',
          name: 'Existing Template',
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString()
        }
      ];
      localStorageMock.setItem('savedTemplates', JSON.stringify(existingTemplates));
      
      const result = await templateService.saveTemplate(sampleTemplate);
      
      // Check that localStorage was used
      expect(localStorageMock.getItem).toHaveBeenCalledWith('savedTemplates');
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'savedTemplates',
        expect.any(String)
      );
      
      // Check that the result is the template with expected properties
      expect(result).toMatchObject({
        id: sampleTemplate.id,
        name: sampleTemplate.name,
        version: sampleTemplate.version
      });
      
      // Verify that the template was added to localStorage
      const storedTemplates = JSON.parse(localStorageMock.getItem('savedTemplates') as string);
      expect(storedTemplates).toHaveLength(2); // existing + new template
      expect(storedTemplates[1].id).toBe(sampleTemplate.id);
    });
  });
  
  describe('updateTemplate', () => {
    it('should update a template via API when successful', async () => {
      // Updated template with new name
      const updatedTemplate = {
        ...sampleTemplate,
        name: 'Updated Template',
        version: 2
      };
      
      // Set up the fetch mock to return success
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(updatedTemplate)
      });
      
      const result = await templateService.updateTemplate('template-1', { name: 'Updated Template' });
      
      // Check that fetch was called correctly
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/report-drafting/templates/template-1',
        expect.objectContaining({
          method: 'PATCH',
          body: expect.stringContaining('Updated Template')
        })
      );
      
      // Check that the result matches the expected template
      expect(result).toEqual(updatedTemplate);
    });
    
    it('should fall back to local storage when API fails', async () => {
      // Mock localStorage to have the template
      const existingTemplates = [
        {
          ...sampleTemplate,
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString()
        }
      ];
      localStorageMock.setItem('savedTemplates', JSON.stringify(existingTemplates));
      
      const result = await templateService.updateTemplate('template-1', { name: 'Updated Template' });
      
      // Check that localStorage was used
      expect(localStorageMock.getItem).toHaveBeenCalledWith('savedTemplates');
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'savedTemplates',
        expect.any(String)
      );
      
      // Check that the result is the template with updated name and incremented version
      expect(result).toMatchObject({
        id: 'template-1',
        name: 'Updated Template',
        version: 2
      });
      
      // Verify that the template was updated in localStorage
      const storedTemplates = JSON.parse(localStorageMock.getItem('savedTemplates') as string);
      expect(storedTemplates[0].name).toBe('Updated Template');
      expect(storedTemplates[0].version).toBe(2);
    });
    
    it('should throw an error when template is not found in local storage', async () => {
      // Mock localStorage to be empty
      localStorageMock.setItem('savedTemplates', JSON.stringify([]));
      
      await expect(
        templateService.updateTemplate('non-existent', { name: 'Updated Template' })
      ).rejects.toThrow('Template with ID non-existent not found locally');
    });
  });
  
  describe('deleteTemplate', () => {
    it('should delete a template via API when successful', async () => {
      // Set up the fetch mock to return success
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true })
      });
      
      const result = await templateService.deleteTemplate('template-1');
      
      // Check that fetch was called correctly
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/report-drafting/templates/template-1',
        { method: 'DELETE' }
      );
      
      // Check that the result is true
      expect(result).toBe(true);
    });
    
    it('should fall back to local storage when API fails', async () => {
      // Mock localStorage to have the template
      const existingTemplates = [
        {
          ...sampleTemplate,
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString()
        }
      ];
      localStorageMock.setItem('savedTemplates', JSON.stringify(existingTemplates));
      
      const result = await templateService.deleteTemplate('template-1');
      
      // Check that localStorage was used
      expect(localStorageMock.getItem).toHaveBeenCalledWith('savedTemplates');
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'savedTemplates',
        expect.any(String)
      );
      
      // Check that the result is true
      expect(result).toBe(true);
      
      // Verify that the template was removed from localStorage
      const storedTemplates = JSON.parse(localStorageMock.getItem('savedTemplates') as string);
      expect(storedTemplates).toHaveLength(0);
    });
    
    it('should throw an error when template is not found in local storage', async () => {
      // Mock localStorage to be empty
      localStorageMock.setItem('savedTemplates', JSON.stringify([]));
      
      await expect(
        templateService.deleteTemplate('non-existent')
      ).rejects.toThrow('Template with ID non-existent not found locally');
    });
  });
  
  describe('getUserTemplateLibrary', () => {
    it('should get the template library via API when successful', async () => {
      const libraryResponse = {
        userId: 'current-user',
        personalTemplates: [sampleTemplate],
        favoriteTemplates: ['template-1'],
        recentlyUsedTemplates: [
          {
            templateId: 'template-1',
            lastUsed: new Date().toISOString(),
            useCount: 1
          }
        ]
      };
      
      // Set up the fetch mock to return success
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(libraryResponse)
      });
      
      const result = await templateService.getUserTemplateLibrary();
      
      // Check that fetch was called correctly
      expect(global.fetch).toHaveBeenCalledWith('/api/report-drafting/templates/library');
      
      // Check that the result matches the expected library
      expect(result).toEqual(expect.objectContaining({
        userId: 'current-user',
        personalTemplates: expect.arrayContaining([
          expect.objectContaining({ id: 'template-1' })
        ]),
        favoriteTemplates: expect.arrayContaining(['template-1']),
        recentlyUsedTemplates: expect.arrayContaining([
          expect.objectContaining({ templateId: 'template-1' })
        ])
      }));
    });
    
    it('should fall back to local storage when API fails', async () => {
      // Mock localStorage with template data
      const existingTemplates = [
        {
          ...sampleTemplate,
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString()
        }
      ];
      localStorageMock.setItem('savedTemplates', JSON.stringify(existingTemplates));
      localStorageMock.setItem('favoriteTemplates', JSON.stringify(['template-1']));
      localStorageMock.setItem('recentTemplates', JSON.stringify([
        {
          templateId: 'template-1',
          lastUsed: new Date().toISOString(),
          useCount: 1
        }
      ]));
      
      const result = await templateService.getUserTemplateLibrary();
      
      // Check that localStorage was used
      expect(localStorageMock.getItem).toHaveBeenCalledWith('savedTemplates');
      expect(localStorageMock.getItem).toHaveBeenCalledWith('favoriteTemplates');
      expect(localStorageMock.getItem).toHaveBeenCalledWith('recentTemplates');
      
      // Check that the result contains expected data
      expect(result).toEqual(expect.objectContaining({
        userId: 'current-user',
        personalTemplates: expect.arrayContaining([
          expect.objectContaining({ id: 'template-1' })
        ]),
        favoriteTemplates: expect.arrayContaining(['template-1']),
        recentlyUsedTemplates: expect.arrayContaining([
          expect.objectContaining({ templateId: 'template-1' })
        ])
      }));
    });
    
    it('should return empty library when no data is found', async () => {
      // Mock localStorage to be empty
      
      const result = await templateService.getUserTemplateLibrary();
      
      // Check that result is an empty library
      expect(result).toEqual({
        userId: 'current-user',
        personalTemplates: [],
        favoriteTemplates: [],
        recentlyUsedTemplates: []
      });
    });
  });
  
  describe('addTemplateToFavorites and removeTemplateFromFavorites', () => {
    it('should add a template to favorites via API when successful', async () => {
      // Set up the fetch mock to return success
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true })
      });
      
      const result = await templateService.addTemplateToFavorites('template-1');
      
      // Check that fetch was called correctly
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/report-drafting/templates/favorites/template-1',
        { method: 'POST' }
      );
      
      // Check that the result is true
      expect(result).toBe(true);
    });
    
    it('should remove a template from favorites via API when successful', async () => {
      // Set up the fetch mock to return success
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true })
      });
      
      const result = await templateService.removeTemplateFromFavorites('template-1');
      
      // Check that fetch was called correctly
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/report-drafting/templates/favorites/template-1',
        { method: 'DELETE' }
      );
      
      // Check that the result is true
      expect(result).toBe(true);
    });
    
    it('should fall back to local storage when add to favorites API fails', async () => {
      // Mock localStorage with some favorites
      localStorageMock.setItem('favoriteTemplates', JSON.stringify(['existing-1']));
      
      const result = await templateService.addTemplateToFavorites('template-1');
      
      // Check that localStorage was used
      expect(localStorageMock.getItem).toHaveBeenCalledWith('favoriteTemplates');
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'favoriteTemplates',
        expect.any(String)
      );
      
      // Check that the result is true
      expect(result).toBe(true);
      
      // Verify that the template was added to favorites in localStorage
      const favorites = JSON.parse(localStorageMock.getItem('favoriteTemplates') as string);
      expect(favorites).toContain('template-1');
      expect(favorites).toHaveLength(2); // existing + new
    });
    
    it('should fall back to local storage when remove from favorites API fails', async () => {
      // Mock localStorage with some favorites
      localStorageMock.setItem('favoriteTemplates', JSON.stringify(['template-1', 'other-1']));
      
      const result = await templateService.removeTemplateFromFavorites('template-1');
      
      // Check that localStorage was used
      expect(localStorageMock.getItem).toHaveBeenCalledWith('favoriteTemplates');
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'favoriteTemplates',
        expect.any(String)
      );
      
      // Check that the result is true
      expect(result).toBe(true);
      
      // Verify that the template was removed from favorites in localStorage
      const favorites = JSON.parse(localStorageMock.getItem('favoriteTemplates') as string);
      expect(favorites).not.toContain('template-1');
      expect(favorites).toHaveLength(1); // only 'other-1' remains
    });
  });
  
  describe('shareTemplate', () => {
    it('should update sharing status via API when successful', async () => {
      // Updated template with sharing enabled
      const updatedTemplate = {
        ...sampleTemplate,
        isShared: true
      };
      
      // Set up the fetch mock to return success
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(updatedTemplate)
      });
      
      const result = await templateService.shareTemplate('template-1', true);
      
      // Check that fetch was called correctly
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/report-drafting/templates/template-1/share',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('true')
        })
      );
      
      // Check that the result matches the expected template
      expect(result).toEqual(updatedTemplate);
    });
    
    it('should fall back to updateTemplate when API fails', async () => {
      // Mock updateTemplate to succeed (we'll test it separately)
      jest.spyOn(templateService, 'updateTemplate').mockResolvedValueOnce({
        ...sampleTemplate,
        isShared: true
      } as SavedTemplate);
      
      const result = await templateService.shareTemplate('template-1', true);
      
      // Check that updateTemplate was called
      expect(templateService.updateTemplate).toHaveBeenCalledWith(
        'template-1',
        { isShared: true }
      );
      
      // Check that the result has isShared set to true
      expect(result.isShared).toBe(true);
    });
  });
  
  describe('trackTemplateUsage', () => {
    it('should track usage via API when successful', async () => {
      // Set up the fetch mock to return success
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true })
      });
      
      await templateService.trackTemplateUsage('template-1');
      
      // Check that fetch was called correctly
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/report-drafting/templates/template-1/usage',
        { method: 'POST' }
      );
    });
    
    it('should fall back to local storage when API fails', async () => {
      await templateService.trackTemplateUsage('template-1');
      
      // Check that localStorage was used
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'recentTemplates',
        expect.any(String)
      );
      
      // Verify that the template was added to recentTemplates in localStorage
      const recent = JSON.parse(localStorageMock.getItem('recentTemplates') as string);
      expect(recent).toHaveLength(1);
      expect(recent[0].templateId).toBe('template-1');
      expect(recent[0].useCount).toBe(1);
    });
    
    it('should increment usage count for existing templates', async () => {
      // Mock localStorage with existing usage
      localStorageMock.setItem('recentTemplates', JSON.stringify([
        {
          templateId: 'template-1',
          lastUsed: new Date().toISOString(),
          useCount: 1
        }
      ]));
      
      await templateService.trackTemplateUsage('template-1');
      
      // Verify that the usage count was incremented
      const recent = JSON.parse(localStorageMock.getItem('recentTemplates') as string);
      expect(recent).toHaveLength(1);
      expect(recent[0].templateId).toBe('template-1');
      expect(recent[0].useCount).toBe(2);
    });
  });
  
  describe('createTemplateFromBase', () => {
    it('should create a new template from a base template', async () => {
      // Mock saveTemplate to succeed (we'll test it separately)
      jest.spyOn(templateService, 'saveTemplate').mockResolvedValueOnce({
        ...sampleTemplate,
        id: 'new-template-id',
        name: 'New Template Name'
      } as SavedTemplate);
      
      // Mock getTemplateById from templates module
      jest.mock('../templates', () => ({
        getTemplateById: jest.fn().mockReturnValue(sampleTemplate)
      }));
      
      const result = await templateService.createTemplateFromBase('template-1', 'New Template Name');
      
      // Check that saveTemplate was called with the expected template
      expect(templateService.saveTemplate).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'New Template Name',
          parentTemplateId: 'template-1'
        })
      );
      
      // Check that the result has the expected properties
      expect(result.name).toBe('New Template Name');
      expect(result.id).toBe('new-template-id');
    });
  });
});
