import { NextResponse } from 'next/server';
import { getAssessmentData } from '@/services/assessment-service';
import { getSectionMetadata } from '@/lib/report-drafting/templates';
import { getDataCompleteness, extractSectionData } from '@/lib/report-drafting/data-mapping';
import { generateReportSections } from '@/lib/report-drafting/anthropic-service';
import { ReportConfiguration, GeneratedReport, ReportSection } from '@/lib/report-drafting/types';

/**
 * POST /api/report-drafting/generate
 * Generates a report based on the provided configuration
 */
export async function POST(request: Request) {
  try {
    const config = await request.json() as ReportConfiguration;
    
    // Validate the request body
    if (!config.templateId || !config.sections || !config.style) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Get the client's assessment data
    const assessmentData = await getAssessmentData();
    const clientInfo = assessmentData?.demographics || {};
    
    // Get data completeness status
    const completeness = getDataCompleteness(assessmentData);
    
    // Prepare sections for generation
    const sectionsToGenerate = config.sections
      .filter(s => s.included)
      .map(sectionConfig => {
        const sectionMeta = getSectionMetadata(sectionConfig.id);
        
        return {
          id: sectionConfig.id,
          detailLevel: sectionConfig.detailLevel,
          title: sectionMeta?.title || sectionConfig.id,
          dataCompleteness: completeness[sectionConfig.id] || { status: 'incomplete', percentage: 0 },
          dataSources: getDataSources(sectionConfig.id)
        };
      });
    
    // Use Anthropic API to generate the section content
    const reportSections = await generateReportSections(
      sectionsToGenerate,
      config.style,
      {
        ...assessmentData,
        firstName: clientInfo.firstName || 'Client',
        lastName: clientInfo.lastName || ''
      }
    );
    
    // Create the report object
    const generatedReport: GeneratedReport = {
      id: `report-${Date.now()}`,
      title: config.name,
      configurationId: config.id || '',
      sections: reportSections,
      metadata: {
        clientName: `${clientInfo.firstName || ''} ${clientInfo.lastName || ''}`.trim() || 'Client',
        clientId: config.clientId || 'current-client-id',
        assessmentDate: new Date(),
        authorName: 'Current User',
        authorId: 'current-user',
        organizationName: 'ABC Rehabilitation',
        organizationId: 'org-123'
      },
      createdAt: new Date(),
      lastModified: new Date(),
      status: 'draft',
      revisionHistory: [{
        timestamp: new Date(),
        userId: 'current-user',
        userName: 'Current User',
        changes: reportSections.map(section => ({
          sectionId: section.id,
          type: 'add',
          newContent: section.content
        }))
      }]
    };
    
    // In a real implementation, this would save to a database
    // For now, just return the generated report
    
    return NextResponse.json(generatedReport);
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}

/**
 * Helper function to get data sources for a section
 */
function getDataSources(sectionId: string): string[] {
  const dataSources: Record<string, string[]> = {
    'initial-assessment': ['Demographics', 'Referral Information', 'Client Profile'],
    'medical-history': ['Medical Conditions', 'Medications', 'Previous Interventions'],
    'symptoms-assessment': ['Symptom Inventory', 'Pain Assessment', 'Fatigue Scale'],
    'functional-status': ['Mobility Assessment', 'Range of Motion', 'Manual Muscle Testing'],
    'typical-day': ['Daily Schedule', 'Activity Log', 'Energy Expenditure'],
    'environmental-assessment': ['Home Assessment', 'Workplace Evaluation', 'Community Access'],
    'activities-daily-living': ['ADL Assessment', 'Self-Care Inventory', 'IADL Evaluation'],
    'attendant-care': ['Care Needs Assessment', 'Caregiver Assessment', 'Service Recommendations']
  };
  
  return dataSources[sectionId] || ['No specific data sources identified'];
}
