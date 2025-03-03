"use client";

/**
 * Edit Tracking Service
 * 
 * Provides methods for persisting and retrieving edit history data.
 * Handles both API calls and local storage fallback mechanisms.
 */

import { v4 as uuidv4 } from 'uuid';
import { EditHistory, EditRecord, EditVersion } from './types';

/**
 * Service class for persisting and retrieving edit history
 */
export class EditTrackingService {
  private readonly API_BASE_URL = '/api/edit-tracking';
  private readonly LOCAL_STORAGE_KEY_PREFIX = 'delilah_edit_history_';

  /**
   * Retrieves edit history for a report
   * @param reportId Report ID
   * @returns Promise resolving to the edit history
   */
  async getEditHistory(reportId: string): Promise<EditHistory> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/${reportId}`);
      
      if (!response.ok) {
        // API call failed, fall back to local storage
        return this.getEditHistoryFromLocalStorage(reportId);
      }
      
      const history = await response.json();
      
      // Update local storage with latest data
      this.saveEditHistoryToLocalStorage(reportId, history);
      
      return history;
    } catch (error) {
      console.error('Error fetching edit history:', error);
      
      // In case of network error, fall back to local storage
      return this.getEditHistoryFromLocalStorage(reportId);
    }
  }

  /**
   * Saves an edit record
   * @param edit Edit record to save
   * @returns Promise resolving to the saved edit record
   */
  async saveEdit(edit: Omit<EditRecord, 'id' | 'timestamp'>): Promise<EditRecord> {
    const newEdit: EditRecord = {
      ...edit,
      id: uuidv4(),
      timestamp: new Date().toISOString()
    };

    try {
      const response = await fetch(`${this.API_BASE_URL}/edit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newEdit)
      });

      if (!response.ok) {
        // API call failed, save to local storage
        await this.saveEditToLocalStorage(newEdit);
        return newEdit;
      }

      const savedEdit = await response.json();
      
      // Update local storage with newest edit
      await this.saveEditToLocalStorage(savedEdit);
      
      return savedEdit;
    } catch (error) {
      console.error('Error saving edit:', error);
      
      // In case of network error, save to local storage
      await this.saveEditToLocalStorage(newEdit);
      return newEdit;
    }
  }

  /**
   * Creates a new version
   * @param version Version data to save
   * @returns Promise resolving to the saved version
   */
  async createVersion(version: Omit<EditVersion, 'id' | 'createdAt'>): Promise<EditVersion> {
    const newVersion: EditVersion = {
      ...version,
      id: uuidv4(),
      createdAt: new Date().toISOString()
    };

    try {
      const response = await fetch(`${this.API_BASE_URL}/version`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newVersion)
      });

      if (!response.ok) {
        // API call failed, save to local storage
        await this.saveVersionToLocalStorage(newVersion);
        return newVersion;
      }

      const savedVersion = await response.json();
      
      // Update local storage
      await this.saveVersionToLocalStorage(savedVersion);
      
      return savedVersion;
    } catch (error) {
      console.error('Error creating version:', error);
      
      // In case of network error, save to local storage
      await this.saveVersionToLocalStorage(newVersion);
      return newVersion;
    }
  }

  /**
   * Retrieves edit history from local storage
   * @param reportId Report ID
   * @returns Edit history from local storage or a new empty history
   */
  private getEditHistoryFromLocalStorage(reportId: string): EditHistory {
    if (typeof window === 'undefined') {
      return this.createEmptyHistory(reportId);
    }

    const storedHistoryJson = localStorage.getItem(`${this.LOCAL_STORAGE_KEY_PREFIX}${reportId}`);
    
    if (!storedHistoryJson) {
      return this.createEmptyHistory(reportId);
    }

    try {
      return JSON.parse(storedHistoryJson);
    } catch (error) {
      console.error('Error parsing stored edit history:', error);
      return this.createEmptyHistory(reportId);
    }
  }

  /**
   * Saves edit history to local storage
   * @param reportId Report ID
   * @param history Edit history to save
   */
  private saveEditHistoryToLocalStorage(reportId: string, history: EditHistory): void {
    if (typeof window === 'undefined') {
      return;
    }

    localStorage.setItem(
      `${this.LOCAL_STORAGE_KEY_PREFIX}${reportId}`, 
      JSON.stringify(history)
    );
  }

  /**
   * Saves an edit record to local storage
   * @param edit Edit record to save
   */
  private async saveEditToLocalStorage(edit: EditRecord): Promise<void> {
    const history = await this.getEditHistoryFromLocalStorage(edit.reportId);
    
    // Add the new edit
    history.edits.push(edit);
    
    // Save the updated history
    this.saveEditHistoryToLocalStorage(edit.reportId, history);
  }

  /**
   * Saves a version to local storage
   * @param version Version to save
   */
  private async saveVersionToLocalStorage(version: EditVersion): Promise<void> {
    const history = await this.getEditHistoryFromLocalStorage(version.reportId);
    
    // Add the new version
    history.versions.push(version);
    
    // Update the current version if this is a higher number
    if (version.versionNumber > history.currentVersion) {
      history.currentVersion = version.versionNumber;
    }
    
    // Save the updated history
    this.saveEditHistoryToLocalStorage(version.reportId, history);
  }

  /**
   * Creates an empty edit history for a report
   * @param reportId Report ID
   * @returns Empty edit history
   */
  private createEmptyHistory(reportId: string): EditHistory {
    return {
      reportId,
      currentVersion: 1,
      versions: [{
        id: uuidv4(),
        reportId,
        versionNumber: 1,
        createdAt: new Date().toISOString(),
        createdBy: 'system',
        createdByName: 'System',
        comment: 'Initial version',
        isPublished: false
      }],
      edits: []
    };
  }
}

export const editTrackingService = new EditTrackingService();
