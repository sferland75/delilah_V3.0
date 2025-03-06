import { ReportTemplate } from './types';

// Define section metadata for the application
export const sectionMetadata = {
  'demographics': {
    title: 'Demographics',
    description: 'Client personal information and basic details',
    category: 'assessment'
  },
  'purpose-methodology': {
    title: 'Purpose & Methodology',
    description: 'Assessment purpose and methodological approach',
    category: 'assessment'
  },
  'medical-history': {
    title: 'Medical History',
    description: 'Client medical history and conditions',
    category: 'assessment'
  },
  'symptoms-assessment': {
    title: 'Symptoms Assessment',
    description: 'Physical, cognitive, and emotional symptoms',
    category: 'assessment'
  },
  'functional-status': {
    title: 'Functional Status',
    description: 'Current capabilities and limitations',
    category: 'functional'
  },
  'typical-day': {
    title: 'Typical Day',
    description: 'Daily routines and activities',
    category: 'functional'
  },
  'environmental-assessment': {
    title: 'Environmental Assessment',
    description: 'Home and community environment evaluation',
    category: 'functional'
  },
  'activities-daily-living': {
    title: 'Activities of Daily Living',
    description: 'Self-care and daily living activities',
    category: 'functional'
  },
  'attendant-care': {
    title: 'Attendant Care',
    description: 'Required assistance and caregiving needs',
    category: 'functional'
  },
  'executive-summary': {
    title: 'Executive Summary',
    description: 'Overview of key findings and recommendations',
    category: 'report'
  },
  'recommendations': {
    title: 'Recommendations',
    description: 'Recommended interventions, equipment, and follow-up',
    category: 'report'
  },
  'conclusion': {
    title: 'Conclusion',
    description: 'Summary of assessment findings and next steps',
    category: 'report'
  }
};

// Define template library
export const templates: ReportTemplate[] = [
  {
    id: 'comprehensive-ot',
    name: 'Comprehensive OT Assessment',
    description: 'Complete occupational therapy assessment report with all sections',
    imageUrl: '/templates/comprehensive.png',
    defaultTitle: 'Comprehensive Occupational Therapy Assessment',
    defaultStyle: 'clinical',
    category: 'clinical',
    isBuiltIn: true,
    defaultSections: [
      { id: 'executive-summary', title: 'Executive Summary', included: true, detailLevel: 'standard' },
      { id: 'demographics', title: 'Demographics', included: true, detailLevel: 'brief' },
      { id: 'purpose-methodology', title: 'Purpose & Methodology', included: true, detailLevel: 'standard' },
      { id: 'medical-history', title: 'Medical History', included: true, detailLevel: 'standard' },
      { id: 'symptoms-assessment', title: 'Symptoms Assessment', included: true, detailLevel: 'comprehensive' },
      { id: 'functional-status', title: 'Functional Status', included: true, detailLevel: 'comprehensive' },
      { id: 'typical-day', title: 'Typical Day', included: true, detailLevel: 'standard' },
      { id: 'environmental-assessment', title: 'Environmental Assessment', included: true, detailLevel: 'standard' },
      { id: 'activities-daily-living', title: 'Activities of Daily Living', included: true, detailLevel: 'comprehensive' },
      { id: 'attendant-care', title: 'Attendant Care', included: true, detailLevel: 'comprehensive' },
      { id: 'recommendations', title: 'Recommendations', included: true, detailLevel: 'comprehensive' },
      { id: 'conclusion', title: 'Conclusion', included: true, detailLevel: 'standard' }
    ]
  },
  {
    id: 'insurance-report',
    name: 'Insurance Assessment Report',
    description: 'Focused report for insurance companies with emphasis on functional impacts',
    imageUrl: '/templates/insurance.png',
    defaultTitle: 'Occupational Therapy Insurance Assessment',
    defaultStyle: 'clinical',
    category: 'insurance',
    isBuiltIn: true,
    defaultSections: [
      { id: 'executive-summary', title: 'Executive Summary', included: true, detailLevel: 'comprehensive' },
      { id: 'demographics', title: 'Demographics', included: true, detailLevel: 'brief' },
      { id: 'purpose-methodology', title: 'Purpose & Methodology', included: true, detailLevel: 'brief' },
      { id: 'medical-history', title: 'Medical History', included: true, detailLevel: 'standard' },
      { id: 'symptoms-assessment', title: 'Symptoms Assessment', included: true, detailLevel: 'standard' },
      { id: 'functional-status', title: 'Functional Status', included: true, detailLevel: 'comprehensive' },
      { id: 'typical-day', title: 'Typical Day', included: true, detailLevel: 'standard' },
      { id: 'activities-daily-living', title: 'Activities of Daily Living', included: true, detailLevel: 'comprehensive' },
      { id: 'attendant-care', title: 'Attendant Care', included: true, detailLevel: 'comprehensive' },
      { id: 'recommendations', title: 'Recommendations', included: true, detailLevel: 'comprehensive' },
      { id: 'conclusion', title: 'Conclusion', included: true, detailLevel: 'brief' }
    ]
  },
  {
    id: 'client-friendly',
    name: 'Client-Friendly Report',
    description: 'Simplified report written in conversational language for clients',
    imageUrl: '/templates/client.png',
    defaultTitle: 'Your Occupational Therapy Assessment',
    defaultStyle: 'conversational',
    category: 'client',
    isBuiltIn: true,
    defaultSections: [
      { id: 'executive-summary', title: 'Summary', included: true, detailLevel: 'brief' },
      { id: 'symptoms-assessment', title: 'Your Symptoms', included: true, detailLevel: 'standard' },
      { id: 'functional-status', title: 'Your Abilities', included: true, detailLevel: 'standard' },
      { id: 'typical-day', title: 'Your Daily Activities', included: true, detailLevel: 'standard' },
      { id: 'environmental-assessment', title: 'Your Environment', included: true, detailLevel: 'brief' },
      { id: 'recommendations', title: 'Recommendations for You', included: true, detailLevel: 'comprehensive' },
      { id: 'conclusion', title: 'Next Steps', included: true, detailLevel: 'brief' }
    ]
  },
  {
    id: 'medical-legal',
    name: 'Medicolegal Report',
    description: 'Detailed report for legal proceedings with comprehensive documentation',
    imageUrl: '/templates/legal.png',
    defaultTitle: 'Occupational Therapy Assessment for Legal Purposes',
    defaultStyle: 'clinical',
    category: 'legal',
    isBuiltIn: true,
    defaultSections: [
      { id: 'executive-summary', title: 'Executive Summary', included: true, detailLevel: 'comprehensive' },
      { id: 'purpose-methodology', title: 'Purpose & Methodology', included: true, detailLevel: 'comprehensive' },
      { id: 'demographics', title: 'Client Information', included: true, detailLevel: 'brief' },
      { id: 'medical-history', title: 'Medical History', included: true, detailLevel: 'comprehensive' },
      { id: 'symptoms-assessment', title: 'Symptoms Assessment', included: true, detailLevel: 'comprehensive' },
      { id: 'functional-status', title: 'Functional Status', included: true, detailLevel: 'comprehensive' },
      { id: 'typical-day', title: 'Typical Day', included: true, detailLevel: 'comprehensive' },
      { id: 'activities-daily-living', title: 'Activities of Daily Living', included: true, detailLevel: 'comprehensive' },
      { id: 'attendant-care', title: 'Attendant Care', included: true, detailLevel: 'comprehensive' },
      { id: 'recommendations', title: 'Recommendations', included: true, detailLevel: 'comprehensive' },
      { id: 'conclusion', title: 'Conclusion', included: true, detailLevel: 'comprehensive' }
    ]
  },
  {
    id: 'progress-report',
    name: 'Progress Report',
    description: 'Follow-up report focusing on changes since last assessment',
    imageUrl: '/templates/progress.png',
    defaultTitle: 'Occupational Therapy Progress Report',
    defaultStyle: 'clinical',
    category: 'clinical',
    isBuiltIn: true,
    defaultSections: [
      { id: 'executive-summary', title: 'Progress Summary', included: true, detailLevel: 'standard' },
      { id: 'demographics', title: 'Client Information', included: true, detailLevel: 'brief' },
      { id: 'purpose-methodology', title: 'Purpose of Follow-up', included: true, detailLevel: 'brief' },
      { id: 'symptoms-assessment', title: 'Changes in Symptoms', included: true, detailLevel: 'standard' },
      { id: 'functional-status', title: 'Functional Progress', included: true, detailLevel: 'comprehensive' },
      { id: 'activities-daily-living', title: 'ADL Progress', included: true, detailLevel: 'standard' },
      { id: 'recommendations', title: 'Updated Recommendations', included: true, detailLevel: 'standard' },
      { id: 'conclusion', title: 'Conclusion', included: true, detailLevel: 'brief' }
    ]
  }
];
