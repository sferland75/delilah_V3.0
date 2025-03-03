import { NextRequest, NextResponse } from 'next/server';

// Mock database for templates (in a real app, this would be a database)
let favoriteTemplates: string[] = [];

/**
 * POST /api/report-drafting/templates/favorites/[id]
 * Adds a template to favorites
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Check if already in favorites
    if (!favoriteTemplates.includes(id)) {
      favoriteTemplates.push(id);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error adding template ${params.id} to favorites:`, error);
    return NextResponse.json(
      { error: 'Failed to add template to favorites' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/report-drafting/templates/favorites/[id]
 * Removes a template from favorites
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Remove from favorites
    favoriteTemplates = favoriteTemplates.filter(templateId => templateId !== id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error removing template ${params.id} from favorites:`, error);
    return NextResponse.json(
      { error: 'Failed to remove template from favorites' },
      { status: 500 }
    );
  }
}
