// Report templates
export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  defaultTitle: string;
  defaultStyle: ReportStyle;
  category: string;
  isBuiltIn: boolean;
  defaultSections: SectionConfiguration[];
  createdBy?: string;
  createdAt?: Date;
  lastModified?: Date;
  tags?: string[];
}

// Section configuration
export interface SectionConfiguration {
  id: string;
  title: string;
  included: boolean;
  detailLevel: DetailLevel;
}

// Section data completeness
export interface DataCompleteness {
  status: 'complete' | 'incomplete' | 'missing';
  percentage: number;
}

// Report configuration
export interface ReportConfiguration {
  id: string;
  templateId: string;
  sections: SectionConfiguration[];
  style: ReportStyle;
  reportTitle: string;
  createdAt: Date;
  lastModified: Date;
}

// Generated report
export interface GeneratedReport {
  id: string;
  configId: string;
  title: string;
  style: ReportStyle;
  sections: ReportSection[];
  createdAt: Date;
  lastModified: Date;
  metadata: {
    assessmentId: string;
    templateId: string;
    authorId: string;
    version: number;
  };
}

// Report section
export interface ReportSection {
  id: string;
  title: string;
  content: string;
  detailLevel: DetailLevel;
}

// Export options
export interface ExportOptions {
  format: 'PDF' | 'DOCX' | 'HTML' | 'TXT';
  includeHeader: boolean;
  includeFooter: boolean;
  includePageNumbers: boolean;
  includeTableOfContents: boolean;
  includeAppendices: boolean;
  emailRecipients?: string[];
  emailSubject?: string;
  emailBody?: string;
}

// Export result
export interface ExportResult {
  success: boolean;
  fileName: string;
  downloadUrl: string;
  format: 'PDF' | 'DOCX' | 'HTML' | 'TXT';
  error?: string;
}

// Saved template
export interface SavedTemplate extends ReportTemplate {
  version: number;
  isShared: boolean;
  parentTemplateId?: string;
}

// Template library
export interface TemplateLibrary {
  userTemplates: SavedTemplate[];
  builtInTemplates: SavedTemplate[];
  favoriteTemplates: string[];
  recentlyUsedTemplates: RecentTemplateUsage[];
}

// Recent template usage
export interface RecentTemplateUsage {
  templateId: string;
  lastUsed: Date;
  usageCount: number;
}

// Template version
export interface TemplateVersion {
  id: string;
  templateId: string;
  version: number;
  createdAt: Date;
  createdBy: string;
  changes: string;
}

// Type aliases
export type DetailLevel = 'brief' | 'standard' | 'comprehensive';
export type ReportStyle = 'clinical' | 'conversational' | 'simplified';
