import { NextRequest } from 'next/server';
import { GET, POST } from '../route';
import { GET as getById, PATCH, DELETE } from '../[id]/route';
import { GET as getLibrary } from '../library/route';
import { POST as addToFavorites, DELETE as removeFromFavorites } from '../favorites/[id]/route';
import { POST as shareTemplate } from '../share/[id]/route';
import { POST as trackUsage } from '../usage/[id]/route';
import { getAllTemplates } from '@/lib/report-drafting/templates';

// Mock the templates module
jest.mock('@/lib/report-drafting/templates', () => ({
  getAllTemplates: jest.fn().mockReturnValue([
    {
      id: 'built-in-1',
      name: 'Built-in Template 1',
      description: 'This is a built-in template',
      defaultSections: [],
      defaultTitle: 'Built-in Report',
      defaultStyle: 'clinical',
      isBuiltIn: true
    }
  ]),
  getTemplateById: jest.fn().mockImplementation((id: string) => {
    if (id === 'built-in-1') {
      return {
        id: 'built-in-1',
        name: 'Built-in Template 1',
        description: 'This is a built-in template',
        defaultSections: [],
        defaultTitle: 'Built-in Report',
        defaultStyle: 'clinical',
        isBuiltIn: true
      };
    }
    return null;
  })
}));

// Helper to create NextRequest
const createRequest = (method: string, body?: any) => {
  const req = new NextRequest(new URL('http://localhost'), {
    method
  });
  
  if (body) {
    req.json = jest.fn().mockResolvedValue(body);
  }
  
  return req;
};

describe('Template API Routes', () => {
  // Reset saved templates before each test
  beforeEach(() => {
    global.savedTemplates = [];
    global.favoriteTemplates = [];
    global.recentlyUsedTemplates = [];
  });
  
  describe('GET /api/report-drafting/templates', () => {
    it('should return all templates', async () => {
      const req = createRequest('GET');
      const res = await GET(req);
      const data = await res.json();
      
      expect(res.status).toBe(200);
      expect(data).toEqual(expect.arrayContaining([
        expect.objectContaining({
          id: 'built-in-1',
          name: 'Built-in Template 1'
        })
      ]));
      expect(getAllTemplates).toHaveBeenCalled();
    });
  });
  
  describe('POST /api/report-drafting/templates', () => {
    it('should create a new template', async () => {
      const req = createRequest('POST', {
        name: 'New Template',
        description: 'This is a new template',
        defaultSections: [],
        defaultTitle: 'New Report',
        defaultStyle: 'clinical'
      });
      
      const res = await POST(req);
      const data = await res.json();
      
      expect(res.status).toBe(200);
      expect(data).toEqual(expect.objectContaining({
        name: 'New Template',
        description: 'This is a new template',
        isBuiltIn: false,
        version: 1
      }));
      
      // Check that the template was added to savedTemplates
      expect(global.savedTemplates).toHaveLength(1);
      expect(global.savedTemplates[0].name).toBe('New Template');
    });
    
    it('should return 400 for invalid template data', async () => {
      const req = createRequest('POST', {
        // Missing required fields
        description: 'Invalid template'
      });
      
      const res = await POST(req);
      
      expect(res.status).toBe(400);
    });
  });
  
  describe('GET /api/report-drafting/templates/[id]', () => {
    it('should return a built-in template by ID', async () => {
      const req = createRequest('GET');
      const res = await getById(req, { params: { id: 'built-in-1' } });
      const data = await res.json();
      
      expect(res.status).toBe(200);
      expect(data).toEqual(expect.objectContaining({
        id: 'built-in-1',
        name: 'Built-in Template 1'
      }));
    });
    
    it('should return a saved template by ID', async () => {
      // Add a saved template
      global.savedTemplates.push({
        id: 'saved-1',
        name: 'Saved Template 1',
        description: 'This is a saved template',
        defaultSections: [],
        defaultTitle: 'Saved Report',
        defaultStyle: 'clinical',
        isBuiltIn: false,
        version: 1,
        isShared: false,
        tags: [],
        category: 'Custom',
        createdBy: 'current-user',
        createdAt: new Date(),
        lastModified: new Date()
      });
      
      const req = createRequest('GET');
      const res = await getById(req, { params: { id: 'saved-1' } });
      const data = await res.json();
      
      expect(res.status).toBe(200);
      expect(data).toEqual(expect.objectContaining({
        id: 'saved-1',
        name: 'Saved Template 1'
      }));
    });
    
    it('should return 404 for non-existent template', async () => {
      const req = createRequest('GET');
      const res = await getById(req, { params: { id: 'non-existent' } });
      
      expect(res.status).toBe(404);
    });
  });
  
  describe('PATCH /api/report-drafting/templates/[id]', () => {
    it('should update a saved template', async () => {
      // Add a saved template
      global.savedTemplates.push({
        id: 'saved-1',
        name: 'Saved Template 1',
        description: 'This is a saved template',
        defaultSections: [],
        defaultTitle: 'Saved Report',
        defaultStyle: 'clinical',
        isBuiltIn: false,
        version: 1,
        isShared: false,
        tags: [],
        category: 'Custom',
        createdBy: 'current-user',
        createdAt: new Date(),
        lastModified: new Date()
      });
      
      const req = createRequest('PATCH', {
        name: 'Updated Template',
        description: 'This is an updated template'
      });
      
      const res = await PATCH(req, { params: { id: 'saved-1' } });
      const data = await res.json();
      
      expect(res.status).toBe(200);
      expect(data).toEqual(expect.objectContaining({
        id: 'saved-1',
        name: 'Updated Template',
        description: 'This is an updated template',
        version: 2
      }));
      
      // Check that the template was updated in savedTemplates
      expect(global.savedTemplates[0].name).toBe('Updated Template');
      expect(global.savedTemplates[0].version).toBe(2);
    });
    
    it('should return 404 for non-existent template', async () => {
      const req = createRequest('PATCH', {
        name: 'Updated Template'
      });
      
      const res = await PATCH(req, { params: { id: 'non-existent' } });
      
      expect(res.status).toBe(404);
    });
  });
  
  describe('DELETE /api/report-drafting/templates/[id]', () => {
    it('should delete a saved template', async () => {
      // Add a saved template
      global.savedTemplates.push({
        id: 'saved-1',
        name: 'Saved Template 1',
        description: 'This is a saved template',
        defaultSections: [],
        defaultTitle: 'Saved Report',
        defaultStyle: 'clinical',
        isBuiltIn: false,
        version: 1,
        isShared: false,
        tags: [],
        category: 'Custom',
        createdBy: 'current-user',
        createdAt: new Date(),
        lastModified: new Date()
      });
      
      const req = createRequest('DELETE');
      const res = await DELETE(req, { params: { id: 'saved-1' } });
      const data = await res.json();
      
      expect(res.status).toBe(200);
      expect(data).toEqual({ success: true });
      
      // Check that the template was removed from savedTemplates
      expect(global.savedTemplates).toHaveLength(0);
    });
    
    it('should return 404 for non-existent template', async () => {
      const req = createRequest('DELETE');
      const res = await DELETE(req, { params: { id: 'non-existent' } });
      
      expect(res.status).toBe(404);
    });
  });
  
  describe('GET /api/report-drafting/templates/library', () => {
    it('should return the template library', async () => {
      // Add a saved template
      global.savedTemplates.push({
        id: 'saved-1',
        name: 'Saved Template 1',
        description: 'This is a saved template',
        defaultSections: [],
        defaultTitle: 'Saved Report',
        defaultStyle: 'clinical',
        isBuiltIn: false,
        version: 1,
        isShared: false,
        tags: [],
        category: 'Custom',
        createdBy: 'current-user',
        createdAt: new Date(),
        lastModified: new Date()
      });
      
      // Add a favorite template
      global.favoriteTemplates.push('saved-1');
      
      // Add a recently used template
      global.recentlyUsedTemplates.push({
        templateId: 'saved-1',
        lastUsed: new Date(),
        useCount: 1
      });
      
      const req = createRequest('GET');
      const res = await getLibrary(req);
      const data = await res.json();
      
      expect(res.status).toBe(200);
      expect(data).toEqual(expect.objectContaining({
        userId: 'current-user',
        personalTemplates: expect.arrayContaining([
          expect.objectContaining({
            id: 'saved-1',
            name: 'Saved Template 1'
          })
        ]),
        favoriteTemplates: expect.arrayContaining(['saved-1']),
        recentlyUsedTemplates: expect.arrayContaining([
          expect.objectContaining({
            templateId: 'saved-1',
            useCount: 1
          })
        ])
      }));
    });
  });
  
  describe('POST /api/report-drafting/templates/favorites/[id]', () => {
    it('should add a template to favorites', async () => {
      const req = createRequest('POST');
      const res = await addToFavorites(req, { params: { id: 'template-1' } });
      const data = await res.json();
      
      expect(res.status).toBe(200);
      expect(data).toEqual({ success: true });
      
      // Check that the template was added to favoriteTemplates
      expect(global.favoriteTemplates).toHaveLength(1);
      expect(global.favoriteTemplates[0]).toBe('template-1');
    });
  });
  
  describe('DELETE /api/report-drafting/templates/favorites/[id]', () => {
    it('should remove a template from favorites', async () => {
      // Add a favorite template
      global.favoriteTemplates.push('template-1');
      
      const req = createRequest('DELETE');
      const res = await removeFromFavorites(req, { params: { id: 'template-1' } });
      const data = await res.json();
      
      expect(res.status).toBe(200);
      expect(data).toEqual({ success: true });
      
      // Check that the template was removed from favoriteTemplates
      expect(global.favoriteTemplates).toHaveLength(0);
    });
  });
  
  describe('POST /api/report-drafting/templates/share/[id]', () => {
    it('should update the sharing status of a template', async () => {
      // Add a saved template
      global.savedTemplates.push({
        id: 'saved-1',
        name: 'Saved Template 1',
        description: 'This is a saved template',
        defaultSections: [],
        defaultTitle: 'Saved Report',
        defaultStyle: 'clinical',
        isBuiltIn: false,
        version: 1,
        isShared: false,
        tags: [],
        category: 'Custom',
        createdBy: 'current-user',
        createdAt: new Date(),
        lastModified: new Date()
      });
      
      const req = createRequest('POST', { isShared: true });
      const res = await shareTemplate(req, { params: { id: 'saved-1' } });
      const data = await res.json();
      
      expect(res.status).toBe(200);
      expect(data).toEqual(expect.objectContaining({
        id: 'saved-1',
        isShared: true
      }));
      
      // Check that the template's isShared flag was updated
      expect(global.savedTemplates[0].isShared).toBe(true);
    });
    
    it('should return 404 for non-existent template', async () => {
      const req = createRequest('POST', { isShared: true });
      const res = await shareTemplate(req, { params: { id: 'non-existent' } });
      
      expect(res.status).toBe(404);
    });
  });
  
  describe('POST /api/report-drafting/templates/usage/[id]', () => {
    it('should track usage of a template', async () => {
      const req = createRequest('POST');
      const res = await trackUsage(req, { params: { id: 'template-1' } });
      const data = await res.json();
      
      expect(res.status).toBe(200);
      expect(data).toEqual({ success: true });
      
      // Check that the template was added to recentlyUsedTemplates
      expect(global.recentlyUsedTemplates).toHaveLength(1);
      expect(global.recentlyUsedTemplates[0].templateId).toBe('template-1');
      expect(global.recentlyUsedTemplates[0].useCount).toBe(1);
    });
    
    it('should increment usage count for existing template', async () => {
      // Add a recently used template
      global.recentlyUsedTemplates.push({
        templateId: 'template-1',
        lastUsed: new Date(),
        useCount: 1
      });
      
      const req = createRequest('POST');
      const res = await trackUsage(req, { params: { id: 'template-1' } });
      const data = await res.json();
      
      expect(res.status).toBe(200);
      expect(data).toEqual({ success: true });
      
      // Check that the template's usage count was incremented
      expect(global.recentlyUsedTemplates).toHaveLength(1);
      expect(global.recentlyUsedTemplates[0].templateId).toBe('template-1');
      expect(global.recentlyUsedTemplates[0].useCount).toBe(2);
    });
  });
});
