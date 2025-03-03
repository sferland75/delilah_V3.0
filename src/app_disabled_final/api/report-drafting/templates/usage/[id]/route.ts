import { NextRequest, NextResponse } from 'next/server';

// Mock database for templates (in a real app, this would be a database)
let recentlyUsedTemplates: {
  templateId: string;
  lastUsed: Date;
  useCount: number;
}[] = [];

/**
 * POST /api/report-drafting/templates/usage/[id]
 * Tracks usage of a template
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const now = new Date();
    
    // Find existing entry
    const existingIndex = recentlyUsedTemplates.findIndex(t => t.templateId === id);
    
    if (existingIndex >= 0) {
      // Update existing entry
      recentlyUsedTemplates[existingIndex] = {
        ...recentlyUsedTemplates[existingIndex],
        lastUsed: now,
        useCount: recentlyUsedTemplates[existingIndex].useCount + 1
      };
    } else {
      // Add new entry
      recentlyUsedTemplates.push({
        templateId: id,
        lastUsed: now,
        useCount: 1
      });
    }
    
    // Sort by most recent usage
    recentlyUsedTemplates.sort((a, b) => 
      new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime()
    );
    
    // Limit to 10 most recent
    if (recentlyUsedTemplates.length > 10) {
      recentlyUsedTemplates = recentlyUsedTemplates.slice(0, 10);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error tracking usage for template ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to track template usage' },
      { status: 500 }
    );
  }
}
