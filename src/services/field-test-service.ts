/**
 * Field Test Service
 * Enhances data persistence, offline capabilities, and autosave for field testing.
 */

import { store } from '@/store';
import { saveCurrentAssessmentThunk } from '@/store/slices/assessmentSlice';

// Constants
const FIELD_TEST_CONFIG_KEY = 'delilah_field_test_config';
const OFFLINE_CHANGES_KEY = 'delilah_offline_changes';

// Types
interface FieldTestConfig {
  autosaveEnabled: boolean;
  autosaveInterval: number; // in milliseconds
  syncOnConnect: boolean;
  offlineMode: boolean;
  debugMode: boolean;
  backupEnabled: boolean;
  backupInterval: number; // in milliseconds
}

interface OfflineChange {
  timestamp: string;
  assessmentId: string;
  section: string;
  data: any;
  synced: boolean;
}

// Default configuration
const defaultConfig: FieldTestConfig = {
  autosaveEnabled: true,
  autosaveInterval: 30000, // 30 seconds
  syncOnConnect: true,
  offlineMode: false,
  debugMode: false,
  backupEnabled: true,
  backupInterval: 300000, // 5 minutes
};

let autosaveTimer: NodeJS.Timeout | null = null;
let backupTimer: NodeJS.Timeout | null = null;

/**
 * Initialize the field test service
 */
export function initFieldTestService(): void {
  const config = getFieldTestConfig();
  
  // Set up autosave if enabled
  if (config.autosaveEnabled) {
    startAutosave(config.autosaveInterval);
  }
  
  // Set up backup if enabled
  if (config.backupEnabled) {
    startBackup(config.backupInterval);
  }
  
  // Monitor online/offline status
  if (typeof window !== 'undefined') {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
  }
  
  console.log('Field test service initialized with config:', config);
}

/**
 * Clean up resources used by the field test service
 */
export function cleanupFieldTestService(): void {
  stopAutosave();
  stopBackup();
  if (typeof window !== 'undefined') {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  }
}

/**
 * Get the current field test configuration
 */
export function getFieldTestConfig(): FieldTestConfig {
  try {
    if (typeof window === 'undefined') {
      return defaultConfig;
    }
    
    const storedConfig = localStorage.getItem(FIELD_TEST_CONFIG_KEY);
    return storedConfig ? { ...defaultConfig, ...JSON.parse(storedConfig) } : defaultConfig;
  } catch (error) {
    console.error('Error loading field test config:', error);
    return defaultConfig;
  }
}

/**
 * Update the field test configuration
 */
export function updateFieldTestConfig(config: Partial<FieldTestConfig>): void {
  try {
    const currentConfig = getFieldTestConfig();
    const newConfig = { ...currentConfig, ...config };
    
    // Save to storage
    if (typeof window !== 'undefined') {
      localStorage.setItem(FIELD_TEST_CONFIG_KEY, JSON.stringify(newConfig));
    }
    
    // Update services based on new config
    if (newConfig.autosaveEnabled !== currentConfig.autosaveEnabled ||
        newConfig.autosaveInterval !== currentConfig.autosaveInterval) {
      if (newConfig.autosaveEnabled) {
        startAutosave(newConfig.autosaveInterval);
      } else {
        stopAutosave();
      }
    }
    
    if (newConfig.backupEnabled !== currentConfig.backupEnabled ||
        newConfig.backupInterval !== currentConfig.backupInterval) {
      if (newConfig.backupEnabled) {
        startBackup(newConfig.backupInterval);
      } else {
        stopBackup();
      }
    }
    
    console.log('Field test config updated:', newConfig);
  } catch (error) {
    console.error('Error updating field test config:', error);
  }
}

/**
 * Start autosave timer
 */
function startAutosave(interval: number): void {
  stopAutosave(); // Clear any existing timer
  
  if (typeof window === 'undefined') {
    return;
  }
  
  autosaveTimer = setInterval(() => {
    const state = store.getState();
    
    // Only save if there are unsaved changes
    if (state.assessments.hasUnsavedChanges) {
      console.log('Autosaving assessment...');
      store.dispatch(saveCurrentAssessmentThunk());
    }
  }, interval);
  
  console.log(`Autosave started with interval: ${interval}ms`);
}

/**
 * Stop autosave timer
 */
function stopAutosave(): void {
  if (autosaveTimer) {
    clearInterval(autosaveTimer);
    autosaveTimer = null;
    console.log('Autosave stopped');
  }
}

/**
 * Start backup timer
 */
function startBackup(interval: number): void {
  stopBackup(); // Clear any existing timer
  
  if (typeof window === 'undefined') {
    return;
  }
  
  backupTimer = setInterval(() => {
    const state = store.getState();
    
    // Create a backup of the current assessment
    if (state.assessments.currentId) {
      createBackup(state.assessments.currentId, state.assessments.currentData);
    }
  }, interval);
  
  console.log(`Backup started with interval: ${interval}ms`);
}

/**
 * Stop backup timer
 */
function stopBackup(): void {
  if (backupTimer) {
    clearInterval(backupTimer);
    backupTimer = null;
    console.log('Backup stopped');
  }
}

/**
 * Create a backup of the current assessment
 */
export function createBackup(id: string, data: any): string {
  try {
    if (typeof window === 'undefined') {
      console.warn('Cannot create backup in server environment');
      return '';
    }
    
    const timestamp = new Date().toISOString();
    const backupKey = `delilah_backup_${id}_${timestamp.replace(/[:.]/g, '-')}`;
    
    localStorage.setItem(backupKey, JSON.stringify({
      key: backupKey,
      id,
      timestamp,
      data
    }));
    
    // Clean up old backups (keep last 5)
    cleanupBackups(id);
    
    console.log(`Backup created: ${backupKey}`);
    return backupKey;
  } catch (error) {
    console.error('Error creating backup:', error);
    return '';
  }
}

/**
 * Clean up old backups, keeping only the most recent ones
 */
function cleanupBackups(id: string, maxBackups: number = 5): void {
  try {
    if (typeof window === 'undefined') {
      return;
    }
    
    // Get all backup keys for this assessment
    const backupPrefix = `delilah_backup_${id}_`;
    const allKeys = Object.keys(localStorage);
    
    const backupKeys = allKeys
      .filter(key => key.startsWith(backupPrefix))
      .sort()
      .reverse(); // Most recent backups first
    
    // Remove old backups
    if (backupKeys.length > maxBackups) {
      const keysToRemove = backupKeys.slice(maxBackups);
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });
      
      console.log(`Cleaned up ${keysToRemove.length} old backups`);
    }
  } catch (error) {
    console.error('Error cleaning up backups:', error);
  }
}

/**
 * Handle coming back online
 */
function handleOnline(): void {
  const config = getFieldTestConfig();
  
  if (config.syncOnConnect) {
    syncOfflineChanges();
  }
  
  if (config.offlineMode) {
    // Update config to disable offline mode
    updateFieldTestConfig({ offlineMode: false });
  }
  
  console.log('Device is online. Sync status: ', config.syncOnConnect ? 'enabled' : 'disabled');
}

/**
 * Handle going offline
 */
function handleOffline(): void {
  // Update config to enable offline mode
  updateFieldTestConfig({ offlineMode: true });
  console.log('Device is offline. Offline mode enabled.');
}

/**
 * Record an offline change
 */
export function recordOfflineChange(assessmentId: string, section: string, data: any): void {
  try {
    if (typeof window === 'undefined') {
      return;
    }
    
    // Get existing changes
    const changesJson = localStorage.getItem(OFFLINE_CHANGES_KEY);
    const changes: OfflineChange[] = changesJson ? JSON.parse(changesJson) : [];
    
    // Add the new change
    changes.push({
      timestamp: new Date().toISOString(),
      assessmentId,
      section,
      data,
      synced: false
    });
    
    // Save back to storage
    localStorage.setItem(OFFLINE_CHANGES_KEY, JSON.stringify(changes));
    
    console.log(`Offline change recorded for ${assessmentId}:${section}`);
  } catch (error) {
    console.error('Error recording offline change:', error);
  }
}

/**
 * Sync offline changes
 */
export function syncOfflineChanges(): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      if (typeof window === 'undefined') {
        resolve(false);
        return;
      }
      
      // Get offline changes
      const changesJson = localStorage.getItem(OFFLINE_CHANGES_KEY);
      
      if (!changesJson) {
        console.log('No offline changes to sync');
        resolve(true);
        return;
      }
      
      const changes: OfflineChange[] = JSON.parse(changesJson);
      const unsyncedChanges = changes.filter(change => !change.synced);
      
      if (unsyncedChanges.length === 0) {
        console.log('All changes already synced');
        resolve(true);
        return;
      }
      
      console.log(`Syncing ${unsyncedChanges.length} offline changes...`);
      
      // In a real implementation, this would send data to a server
      // For this simulation, we'll just mark them as synced
      const updatedChanges = changes.map(change => ({
        ...change,
        synced: true
      }));
      
      // Save updated changes
      localStorage.setItem(OFFLINE_CHANGES_KEY, JSON.stringify(updatedChanges));
      
      console.log('Offline changes synced successfully');
      resolve(true);
    } catch (error) {
      console.error('Error syncing offline changes:', error);
      resolve(false);
    }
  });
}

/**
 * Get all backups for an assessment
 */
export function getBackups(assessmentId: string): any[] {
  try {
    if (typeof window === 'undefined') {
      return [];
    }
    
    const backupPrefix = `delilah_backup_${assessmentId}_`;
    const allKeys = Object.keys(localStorage);
    
    const backupKeys = allKeys.filter(key => key.startsWith(backupPrefix));
    
    return backupKeys.map(key => {
      const data = localStorage.getItem(key);
      if (data) {
        try {
          const parsed = JSON.parse(data);
          return {
            ...parsed,
            key: key // Ensure the key is included
          };
        } catch {
          return null;
        }
      }
      return null;
    }).filter(backup => backup !== null)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (error) {
    console.error('Error getting backups:', error);
    return [];
  }
}

/**
 * Restore from a backup
 */
export function restoreFromBackup(backupKey: string): any | null {
  try {
    if (typeof window === 'undefined') {
      return null;
    }
    
    const backupJson = localStorage.getItem(backupKey);
    
    if (!backupJson) {
      console.error(`Backup not found: ${backupKey}`);
      return null;
    }
    
    const backup = JSON.parse(backupJson);
    return backup.data;
  } catch (error) {
    console.error('Error restoring from backup:', error);
    return null;
  }
}
