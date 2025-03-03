import { NextResponse } from 'next/server';
import { ReportConfiguration, SectionConfiguration, ReportStyle } from '@/lib/report-drafting/types';

/**
 * POST /api/report-drafting/configurations
 * Creates a new report configuration
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate the request body
    if (!body.templateId || !body.sections || !body.style || !body.title) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create a new configuration
    const configuration: ReportConfiguration = {
      id: `config-${Date.now()}`,
      name: body.title,
      templateId: body.templateId,
      sections: body.sections,
      style: body.style as ReportStyle,
      clientId: body.clientId || 'current-client-id',
      createdBy: 'current-user',
      createdAt: new Date(),
      lastModified: new Date(),
      status: 'draft'
    };
    
    // In a real implementation, this would save to a database
    // For now, just return the created configuration
    
    return NextResponse.json(configuration);
  } catch (error) {
    console.error('Error creating report configuration:', error);
    return NextResponse.json(
      { error: 'Failed to create report configuration' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/report-drafting/configurations
 * Returns all configurations for the current client
 */
export async function GET() {
  try {
    // In a real implementation, this would fetch from a database
    // For now, just return an empty array
    
    return NextResponse.json([]);
  } catch (error) {
    console.error('Error fetching report configurations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch report configurations' },
      { status: 500 }
    );
  }
}
