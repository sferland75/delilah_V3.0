/**
 * Types for the Edit Tracking System
 * 
 * Provides type definitions for tracking edits, versioning, and edit history
 * in the report drafting module.
 */

/**
 * Represents a single edit to a section of a report
 */
export interface EditRecord {
  id: string;
  reportId: string;
  sectionId: string;
  timestamp: string;
  userId: string;
  userName: string;
  previousContent: string;
  newContent: string;
  comment?: string;
}

/**
 * Represents a version of a report
 */
export interface EditVersion {
  id: string;
  reportId: string;
  versionNumber: number;
  createdAt: string;
  createdBy: string;
  createdByName: string;
  comment?: string;
  isPublished: boolean;
}

/**
 * Represents the complete edit history for a report
 */
export interface EditHistory {
  reportId: string;
  currentVersion: number;
  versions: EditVersion[];
  edits: EditRecord[];
}

/**
 * Context type for the edit tracking system
 */
export interface EditTrackingContextType {
  history: EditHistory | null;
  isLoading: boolean;
  error: string | null;
  currentVersion: number;
  trackEdit: (sectionId: string, previousContent: string, newContent: string, comment?: string) => Promise<void>;
  createVersion: (comment?: string, publish?: boolean) => Promise<void>;
  revertToVersion: (versionNumber: number) => Promise<void>;
  viewEditsForSection: (sectionId: string) => EditRecord[];
  viewVersions: () => EditVersion[];
  getCurrentVersionContent: (sectionId: string) => string | null;
}
