import { NextResponse } from 'next/server';

interface RouteParams {
  params: {
    id: string;
    sectionId: string;
  };
}

/**
 * PATCH /api/report-drafting/reports/[id]/sections/[sectionId]
 * Updates the content of a specific section in a report
 */
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id: reportId, sectionId } = params;
    const { content } = await request.json();
    
    if (!content) {
      return NextResponse.json(
        { error: 'Missing content field' },
        { status: 400 }
      );
    }
    
    // In a real implementation, this would update the section in the database
    console.log(`Updating section ${sectionId} in report ${reportId}`);
    
    // Return success response
    return NextResponse.json({
      success: true,
      reportId,
      sectionId,
      message: 'Section updated successfully',
      timestamp: new Date()
    });
  } catch (error) {
    console.error(`Error updating section:`, error);
    return NextResponse.json(
      { error: 'Failed to update section' },
      { status: 500 }
    );
  }
}
