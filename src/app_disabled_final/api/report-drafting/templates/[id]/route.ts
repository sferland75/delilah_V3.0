import { NextRequest, NextResponse } from 'next/server';
import { getTemplateById } from '@/lib/report-drafting/templates';
import { SavedTemplate } from '@/lib/report-drafting/types';

// Mock database for templates (in a real app, this would be a database)
let savedTemplates: SavedTemplate[] = [];

/**
 * GET /api/report-drafting/templates/[id]
 * Returns a template by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // First check saved templates
    const savedTemplate = savedTemplates.find(t => t.id === id);
    
    if (savedTemplate) {
      return NextResponse.json(savedTemplate);
    }
    
    // Then check built-in templates
    const builtInTemplate = getTemplateById(id);
    
    if (builtInTemplate) {
      return NextResponse.json(builtInTemplate);
    }
    
    // Template not found
    return NextResponse.json(
      { error: 'Template not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error(`Error getting template ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to get template' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/report-drafting/templates/[id]
 * Updates a template
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const updates = await request.json();
    
    // Find the template
    const templateIndex = savedTemplates.findIndex(t => t.id === id);
    
    if (templateIndex === -1) {
      // Check if it's a built-in template
      const builtInTemplate = getTemplateById(id);
      
      if (!builtInTemplate) {
        return NextResponse.json(
          { error: 'Template not found' },
          { status: 404 }
        );
      }
      
      // Create a new saved template based on the built-in one
      const newTemplate: SavedTemplate = {
        ...builtInTemplate,
        id: `template-${Date.now()}`,
        ...updates,
        isBuiltIn: false,
        version: 1,
        createdBy: 'current-user',
        createdAt: new Date(),
        lastModified: new Date(),
        parentTemplateId: builtInTemplate.id,
        isShared: false,
        tags: updates.tags || [],
        category: updates.category || 'Custom'
      };
      
      savedTemplates.push(newTemplate);
      
      return NextResponse.json(newTemplate);
    }
    
    // Update the template
    const template = savedTemplates[templateIndex];
    
    // Can't update built-in templates
    if (template.isBuiltIn) {
      return NextResponse.json(
        { error: 'Cannot update built-in templates' },
        { status: 400 }
      );
    }
    
    const updatedTemplate = {
      ...template,
      ...updates,
      lastModified: new Date(),
      version: template.version + 1
    };
    
    savedTemplates[templateIndex] = updatedTemplate;
    
    return NextResponse.json(updatedTemplate);
  } catch (error) {
    console.error(`Error updating template ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update template' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/report-drafting/templates/[id]
 * Deletes a template
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Find the template
    const templateIndex = savedTemplates.findIndex(t => t.id === id);
    
    if (templateIndex === -1) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }
    
    // Can't delete built-in templates
    if (savedTemplates[templateIndex].isBuiltIn) {
      return NextResponse.json(
        { error: 'Cannot delete built-in templates' },
        { status: 400 }
      );
    }
    
    // Remove the template
    savedTemplates.splice(templateIndex, 1);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting template ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete template' },
      { status: 500 }
    );
  }
}
