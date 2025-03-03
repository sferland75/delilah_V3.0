import { NextRequest, NextResponse } from 'next/server';
import { SavedTemplate } from '@/lib/report-drafting/types';
import { getAllTemplates } from '@/lib/report-drafting/templates';

// Mock database for templates (in a real app, this would be a database)
let savedTemplates: SavedTemplate[] = [];
let favoriteTemplates: string[] = [];
let recentlyUsedTemplates: {
  templateId: string;
  lastUsed: Date;
  useCount: number;
}[] = [];

/**
 * GET /api/report-drafting/templates
 * Returns all available templates (built-in and saved templates)
 */
export async function GET(request: NextRequest) {
  try {
    // Get built-in templates
    const builtInTemplates = getAllTemplates();
    
    // Combine with saved templates (avoiding duplicates)
    const uniqueTemplates = [
      ...builtInTemplates,
      ...savedTemplates.filter(
        savedTemplate => !builtInTemplates.some(
          builtIn => builtIn.id === savedTemplate.id
        )
      )
    ];
    
    return NextResponse.json(uniqueTemplates);
  } catch (error) {
    console.error('Error getting templates:', error);
    return NextResponse.json(
      { error: 'Failed to get templates' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/report-drafting/templates
 * Creates a new template
 */
export async function POST(request: NextRequest) {
  try {
    const template = await request.json();
    
    // Validate required fields
    if (!template.name || !template.defaultSections) {
      return NextResponse.json(
        { error: 'Invalid template data' },
        { status: 400 }
      );
    }
    
    // Add template to saved templates
    const newTemplate: SavedTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      isBuiltIn: false,
      version: 1,
      isShared: false,
      tags: template.tags || [],
      category: template.category || 'Custom',
      createdBy: 'current-user',
      createdAt: new Date(),
      lastModified: new Date()
    };
    
    savedTemplates.push(newTemplate);
    
    return NextResponse.json(newTemplate);
  } catch (error) {
    console.error('Error creating template:', error);
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    );
  }
}
