import { NextRequest, NextResponse } from 'next/server';
import { SavedTemplate } from '@/lib/report-drafting/types';

// Mock database for templates (in a real app, this would be a database)
let savedTemplates: SavedTemplate[] = [];

/**
 * POST /api/report-drafting/templates/share/[id]
 * Updates the sharing status of a template
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const isShared = body.isShared;
    
    if (typeof isShared !== 'boolean') {
      return NextResponse.json(
        { error: 'isShared field must be a boolean' },
        { status: 400 }
      );
    }
    
    // Find the template
    const templateIndex = savedTemplates.findIndex(t => t.id === id);
    
    if (templateIndex === -1) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }
    
    // Update the sharing status
    savedTemplates[templateIndex] = {
      ...savedTemplates[templateIndex],
      isShared,
      lastModified: new Date()
    };
    
    return NextResponse.json(savedTemplates[templateIndex]);
  } catch (error) {
    console.error(`Error updating sharing status for template ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update sharing status' },
      { status: 500 }
    );
  }
}
