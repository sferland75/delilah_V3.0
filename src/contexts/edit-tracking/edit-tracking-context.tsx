"use client";

/**
 * Edit Tracking Context
 * 
 * Provides context for tracking changes to report content, maintaining versions,
 * and providing edit history functionality.
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { EditHistory, EditRecord, EditVersion, EditTrackingContextType } from './types';
import { editTrackingService } from './edit-tracking-service';
import { useAuth } from '../auth/auth-context'; // Adjust the import path as needed

// Create context with default values
const EditTrackingContext = createContext<EditTrackingContextType | null>(null);

interface EditTrackingProviderProps {
  children: React.ReactNode;
  reportId: string;
}

/**
 * Provider component for edit tracking functionality
 */
export const EditTrackingProvider: React.FC<EditTrackingProviderProps> = ({ 
  children, 
  reportId 
}) => {
  const [history, setHistory] = useState<EditHistory | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth(); // Get the current user from auth context

  // Load edit history for the report
  useEffect(() => {
    const loadEditHistory = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const editHistory = await editTrackingService.getEditHistory(reportId);
        setHistory(editHistory);
      } catch (err) {
        console.error('Failed to load edit history:', err);
        setError('Failed to load edit history. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (reportId) {
      loadEditHistory();
    }
  }, [reportId]);

  /**
   * Tracks an edit to a section of the report
   */
  const trackEdit = useCallback(async (
    sectionId: string, 
    previousContent: string, 
    newContent: string, 
    comment?: string
  ) => {
    if (!history || !user) {
      throw new Error('Cannot track edit: history or user not available');
    }

    try {
      const edit = await editTrackingService.saveEdit({
        reportId,
        sectionId,
        userId: user.id,
        userName: user.name,
        previousContent,
        newContent,
        comment
      });

      // Update local state with the new edit
      setHistory(prevHistory => {
        if (!prevHistory) return null;
        
        return {
          ...prevHistory,
          edits: [...prevHistory.edits, edit]
        };
      });

      return edit;
    } catch (err) {
      console.error('Failed to track edit:', err);
      throw new Error('Failed to save edit. Please try again.');
    }
  }, [history, reportId, user]);

  /**
   * Creates a new version of the report
   */
  const createVersion = useCallback(async (comment?: string, publish = false) => {
    if (!history || !user) {
      throw new Error('Cannot create version: history or user not available');
    }

    try {
      const newVersionNumber = history.currentVersion + 1;
      
      const version = await editTrackingService.createVersion({
        reportId,
        versionNumber: newVersionNumber,
        createdBy: user.id,
        createdByName: user.name,
        comment,
        isPublished: publish
      });

      // Update local state with the new version
      setHistory(prevHistory => {
        if (!prevHistory) return null;
        
        return {
          ...prevHistory,
          currentVersion: newVersionNumber,
          versions: [...prevHistory.versions, version]
        };
      });

      return version;
    } catch (err) {
      console.error('Failed to create version:', err);
      throw new Error('Failed to create version. Please try again.');
    }
  }, [history, reportId, user]);

  /**
   * Reverts to a specific version of the report
   */
  const revertToVersion = useCallback(async (versionNumber: number) => {
    if (!history) {
      throw new Error('Cannot revert: history not available');
    }

    if (!history.versions.some(v => v.versionNumber === versionNumber)) {
      throw new Error(`Version ${versionNumber} does not exist`);
    }

    try {
      // In a real implementation, we might want to do this via an API call
      // For simplicity, we're just updating the state here
      setHistory(prevHistory => {
        if (!prevHistory) return null;
        
        return {
          ...prevHistory,
          currentVersion: versionNumber
        };
      });

      // Create a new version that indicates this was a revert
      await createVersion(`Reverted to version ${versionNumber}`);
    } catch (err) {
      console.error('Failed to revert to version:', err);
      throw new Error('Failed to revert to version. Please try again.');
    }
  }, [history, createVersion]);

  /**
   * Gets all edits for a specific section
   */
  const viewEditsForSection = useCallback((sectionId: string): EditRecord[] => {
    if (!history) return [];
    
    return history.edits.filter(edit => edit.sectionId === sectionId);
  }, [history]);

  /**
   * Gets all versions of the report
   */
  const viewVersions = useCallback((): EditVersion[] => {
    if (!history) return [];
    
    return [...history.versions].sort((a, b) => b.versionNumber - a.versionNumber);
  }, [history]);

  /**
   * Gets the content for a section at the current version
   */
  const getCurrentVersionContent = useCallback((sectionId: string): string | null => {
    if (!history) return null;

    // Find all edits for this section up to and including the current version
    const relevantEdits = history.edits
      .filter(edit => edit.sectionId === sectionId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    if (relevantEdits.length === 0) {
      return null;
    }

    // For a complete implementation, we would need to reconstruct the content
    // based on the version number, but this is simplified for now
    return relevantEdits[relevantEdits.length - 1].newContent;
  }, [history]);

  // Compile context value
  const contextValue: EditTrackingContextType = {
    history,
    isLoading,
    error,
    currentVersion: history?.currentVersion || 1,
    trackEdit,
    createVersion,
    revertToVersion,
    viewEditsForSection,
    viewVersions,
    getCurrentVersionContent
  };

  return (
    <EditTrackingContext.Provider value={contextValue}>
      {children}
    </EditTrackingContext.Provider>
  );
};

/**
 * Custom hook to use the edit tracking context
 */
export const useEditTracking = (): EditTrackingContextType => {
  const context = useContext(EditTrackingContext);
  
  if (!context) {
    throw new Error('useEditTracking must be used within an EditTrackingProvider');
  }
  
  return context;
};

// Export the service as well for direct use when needed
export { editTrackingService };
