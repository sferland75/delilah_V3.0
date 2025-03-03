import { NextRequest, NextResponse } from 'next/server';
import { getTemplateById } from '@/lib/report-drafting/templates';
import { SavedTemplate } from '@/lib/report-drafting/types';

// Mock database for templates (in a real app, this would be a database)
let savedTemplates: SavedTemplate[] = [];

/**
 * GET /api/report-drafting/templates/export/[id]
 * Exports a template as JSON
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Find the template
    let template = savedTemplates.find(t => t.id === id);
    
    if (!template) {
      // Check built-in templates
      template = getTemplateById(id) as SavedTemplate;
      
      if (!template) {
        return NextResponse.json(
          { error: 'Template not found' },
          { status: 404 }
        );
      }
    }
    
    // Convert template to JSON
    const templateJson = JSON.stringify(template, null, 2);
    
    // Return as JSON file
    return new NextResponse(templateJson, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${template.name.replace(/\s+/g, '_')}_template.json"`
      }
    });
  } catch (error) {
    console.error(`Error exporting template ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to export template' },
      { status: 500 }
    );
  }
}
