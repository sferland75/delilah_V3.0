import { NextResponse } from 'next/server';
import { getAssessmentData } from '@/services/assessment-service';
import { getDataCompleteness } from '@/lib/report-drafting/data-mapping';

/**
 * GET /api/report-drafting/data-availability
 * Returns the completeness status of each report section based on available data
 */
export async function GET() {
  try {
    // Get assessment data for current client
    const assessmentData = await getAssessmentData();
    
    // Calculate completeness for each section
    const completeness = getDataCompleteness(assessmentData);
    
    return NextResponse.json(completeness);
  } catch (error) {
    console.error('Error fetching data availability:', error);
    return NextResponse.json(
      { error: 'Failed to calculate data availability' },
      { status: 500 }
    );
  }
}
