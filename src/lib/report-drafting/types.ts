/**
 * Report Drafting Module Types
 * 
 * This file contains type definitions for the Report Drafting Module.
 */

// Template Types
export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  defaultSections: SectionConfiguration[];
  defaultTitle: string;
  defaultStyle: ReportStyle;
  isBuiltIn: boolean;
  createdBy?: string;
  createdAt?: Date;
  lastModified?: Date;
}

// Template Management Types
export interface SavedTemplate extends ReportTemplate {
  version: number;
  isShared: boolean;
  parentTemplateId?: string; // Reference to template it was derived from
  tags: string[];
  category: string;
}

export interface TemplateLibrary {
  userId: string;
  personalTemplates: SavedTemplate[];
  favoriteTemplates: string[]; // Template IDs
  recentlyUsedTemplates: RecentTemplate[];
}

export interface RecentTemplate {
  templateId: string;
  lastUsed: Date;
  useCount: number;
}

export interface TemplateVersion {
  templateId: string;
  version: number;
  createdAt: Date;
  createdBy: string;
  template: SavedTemplate;
}

// Section Configuration
export interface SectionConfiguration {
  id: string;
  included: boolean;
  detailLevel: DetailLevel;
  customOrder?: number;
}

// Report Configuration
export interface ReportConfiguration {
  id?: string;
  name: string;
  templateId: string;
  sections: SectionConfiguration[];
  style: ReportStyle;
  clientId?: string;
  createdBy: string;
  createdAt: Date;
  lastModified: Date;
  status: ReportStatus;
}

// Generated Report Content
export interface ReportSection {
  id: string;
  title: string;
  content: string;
  dataCompleteness: DataCompleteness;
  dataSources: string[];
  lastEdited?: Date;
  editedBy?: string;
}

export interface GeneratedReport {
  id: string;
  title: string;
  configurationId: string;
  sections: ReportSection[];
  metadata: ReportMetadata;
  createdAt: Date;
  lastModified: Date;
  status: ReportStatus;
  revisionHistory: RevisionHistoryEntry[];
}

export interface ReportMetadata {
  clientName?: string;
  clientId?: string;
  assessmentDate?: Date;
  authorName?: string;
  authorId?: string;
  organizationName?: string;
  organizationId?: string;
  customFields?: Record<string, string>;
}

export interface RevisionHistoryEntry {
  timestamp: Date;
  userId: string;
  userName: string;
  changes: RevisionChange[];
}

export interface RevisionChange {
  sectionId: string;
  type: 'add' | 'modify' | 'delete';
  previousContent?: string;
  newContent?: string;
}

// Data Completeness
export interface DataCompleteness {
  status: 'complete' | 'partial' | 'incomplete';
  percentage: number;
  missingFields?: string[];
}

// Enums
export type DetailLevel = 'brief' | 'standard' | 'comprehensive';
export type ReportStyle = 'clinical' | 'conversational' | 'simplified';
export type ReportStatus = 'draft' | 'review' | 'approved' | 'finalized';

// Prompt Types
export interface PromptTemplate {
  id: string;
  sectionId: string;
  detailLevel: DetailLevel;
  style: ReportStyle;
  promptText: string;
}

// Export Types
export type ExportFormat = 'pdf' | 'docx' | 'clientRecord';

export interface ExportOptions {
  format: ExportFormat;
  filename?: string;
  includeMetadata: boolean;
  includeHeaders: boolean;
  includeFooters: boolean;
  customHeader?: string;
  customFooter?: string;
}

export interface ExportResult {
  success: boolean;
  message: string;
  url?: string;
  recordId?: string;
}
