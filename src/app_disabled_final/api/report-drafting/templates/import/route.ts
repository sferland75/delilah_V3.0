import { NextRequest, NextResponse } from 'next/server';
import { SavedTemplate } from '@/lib/report-drafting/types';

// Mock database for templates (in a real app, this would be a database)
let savedTemplates: SavedTemplate[] = [];

/**
 * POST /api/report-drafting/templates/import
 * Imports a template from a file
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('template') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Validate file type (should be JSON)
    if (!file.name.endsWith('.json')) {
      return NextResponse.json(
        { error: 'File must be a JSON file' },
        { status: 400 }
      );
    }
    
    // Read file content
    const fileContent = await file.text();
    let templateData;
    
    try {
      templateData = JSON.parse(fileContent);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON file' },
        { status: 400 }
      );
    }
    
    // Validate template structure
    if (!templateData.name || !templateData.defaultSections) {
      return NextResponse.json(
        { error: 'Invalid template format' },
        { status: 400 }
      );
    }
    
    // Create new template
    const newTemplate: SavedTemplate = {
      ...templateData,
      id: `template-${Date.now()}`,
      isBuiltIn: false,
      version: 1,
      createdBy: 'current-user',
      createdAt: new Date(),
      lastModified: new Date(),
      isShared: false,
      tags: templateData.tags || [],
      category: templateData.category || 'Imported'
    };
    
    // Add to saved templates
    savedTemplates.push(newTemplate);
    
    return NextResponse.json(newTemplate);
  } catch (error) {
    console.error('Error importing template:', error);
    return NextResponse.json(
      { error: 'Failed to import template' },
      { status: 500 }
    );
  }
}
