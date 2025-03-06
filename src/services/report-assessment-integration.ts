/**
 * Report-Assessment Integration Service
 * 
 * Connects the assessment data with the report drafting system.
 */

import { loadAssessment } from './assessment-storage-service';
import { ReportTemplate, SectionConfiguration } from '@/lib/report-drafting/types';
import { getTemplate } from '@/lib/report-drafting/api-service';

/**
 * Map assessment data for report drafting
 * @param assessmentId - ID of the assessment to load
 */
export async function mapAssessmentToReportData(assessmentId: string) {
  try {
    // Load assessment data from storage
    const assessment = loadAssessment(assessmentId);
    
    if (!assessment) {
      throw new Error(`Assessment not found: ${assessmentId}`);
    }
    
    // Extract client name
    const firstName = assessment.demographics?.personalInfo?.firstName || '';
    const lastName = assessment.demographics?.personalInfo?.lastName || '';
    const clientName = firstName && lastName ? `${firstName} ${lastName}` : 'Unnamed Client';
    
    // Create report metadata
    const metadata = {
      clientName,
      clientId: assessmentId,
      assessmentDate: assessment.metadata?.lastSaved || new Date().toISOString(),
      customFields: {}
    };
    
    // Map data availability
    const dataAvailability = {
      'initial-assessment': assessment.demographics ? { status: 'complete', percentage: 100 } : { status: 'incomplete', percentage: 0 },
      'purpose-methodology': assessment.purposeAndMethodology ? { status: 'complete', percentage: 100 } : { status: 'incomplete', percentage: 0 },
      'medical-history': assessment.medicalHistory ? { status: 'complete', percentage: 100 } : { status: 'incomplete', percentage: 0 },
      'symptoms-assessment': assessment.symptomsAssessment ? { status: 'complete', percentage: 100 } : { status: 'incomplete', percentage: 0 },
      'functional-status': assessment.functionalStatus ? { status: 'complete', percentage: 100 } : { status: 'incomplete', percentage: 0 },
      'typical-day': assessment.typicalDay ? { status: 'complete', percentage: 100 } : { status: 'incomplete', percentage: 0 },
      'environmental-assessment': assessment.environmentalAssessment ? { status: 'complete', percentage: 100 } : { status: 'incomplete', percentage: 0 },
      'activities-daily-living': assessment.activitiesDailyLiving ? { status: 'complete', percentage: 100 } : { status: 'incomplete', percentage: 0 },
      'attendant-care': assessment.attendantCare ? { status: 'complete', percentage: 100 } : { status: 'incomplete', percentage: 0 }
    };
    
    return {
      assessmentData: assessment,
      metadata,
      dataAvailability
    };
  } catch (error) {
    console.error('Error mapping assessment data for report drafting:', error);
    throw error;
  }
}

/**
 * Create initial report configuration based on assessment data
 * @param assessmentId - ID of the assessment to load
 * @param templateId - ID of the template to use
 */
export async function createReportConfigFromAssessment(
  assessmentId: string,
  templateId: string
) {
  try {
    const { assessmentData, metadata, dataAvailability } = await mapAssessmentToReportData(assessmentId);
    const template = await getTemplate(templateId);
    
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }
    
    // Create report title from client name
    const reportTitle = `Assessment Report: ${metadata.clientName}`;
    
    // Map template sections to configuration sections
    const sections = template.defaultSections.map(section => {
      // Get data availability for this section
      const sectionAvailability = dataAvailability[section.id] || { status: 'incomplete', percentage: 0 };
      
      // Only include section if data is available or if it's required
      const include = sectionAvailability.status !== 'incomplete';
      
      return {
        ...section,
        included: include
      };
    });
    
    // Create configuration
    return {
      templateId,
      assessmentId,
      sections,
      style: template.defaultStyle,
      reportTitle,
      createdBy: 'current-user',
      createdAt: new Date(),
      lastModified: new Date(),
      status: 'draft'
    };
  } catch (error) {
    console.error('Error creating report configuration from assessment:', error);
    throw error;
  }
}

/**
 * Get available section mapping
 * Maps assessment sections to report sections
 */
export function getAssessmentSectionMapping() {
  return {
    'demographics': ['initial-assessment'],
    'medicalHistory': ['medical-history'],
    'symptomsAssessment': ['symptoms-assessment'],
    'functionalStatus': ['functional-status'],
    'typicalDay': ['typical-day'],
    'environmentalAssessment': ['environmental-assessment'],
    'activitiesDailyLiving': ['activities-daily-living'],
    'attendantCare': ['attendant-care'],
    'purposeAndMethodology': ['purpose-methodology']
  };
}
