import { NextRequest, NextResponse } from 'next/server';
import { SavedTemplate } from '@/lib/report-drafting/types';

// Mock database for templates (in a real app, this would be a database)
let savedTemplates: SavedTemplate[] = [];
let favoriteTemplates: string[] = [];
let recentlyUsedTemplates: {
  templateId: string;
  lastUsed: Date;
  useCount: number;
}[] = [];

/**
 * GET /api/report-drafting/templates/library
 * Returns the user's template library
 */
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      userId: 'current-user',
      personalTemplates: savedTemplates,
      favoriteTemplates,
      recentlyUsedTemplates
    });
  } catch (error) {
    console.error('Error getting template library:', error);
    return NextResponse.json(
      { error: 'Failed to get template library' },
      { status: 500 }
    );
  }
}
