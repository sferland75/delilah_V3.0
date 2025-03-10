/**
 * Field Testing Utilities
 */

// Storage keys
const FIELD_TEST_CONFIG = 'delilah_field_test_config';
const OFFLINE_CHANGES = 'delilah_offline_changes';
const ASSESSMENT_BACKUP = 'delilah_assessment_backup_';

// Default configuration
const defaultConfig = {
  autosaveEnabled: true,
  autosaveInterval: 10000, // 10 seconds for testing
  maxBackups: 5,
  offlineEnabled: true
};

let autosaveTimer = null;
let isInitialized = false;
let currentSaveFunction = null;
let currentGetUnsavedChanges = null;
let currentGetCurrentId = null;
let currentGetCurrentData = null;

export function initFieldTesting(saveFunction, getUnsavedChanges, getCurrentId, getCurrentData) {
  if (typeof window === 'undefined') return;
  
  // Store references to callback functions
  currentSaveFunction = saveFunction;
  currentGetUnsavedChanges = getUnsavedChanges;
  currentGetCurrentId = getCurrentId;
  currentGetCurrentData = getCurrentData;
  
  if (isInitialized) {
    console.log('[FIELD TESTING] Already initialized, updating callbacks');
    return;
  }
  
  isInitialized = true;
  console.log('[FIELD TESTING] Initializing field testing utilities');
  
  // Set up autosave immediately
  startAutosave(defaultConfig.autosaveInterval);
  
  // Create a visible notification element
  createNotificationElement();
  
  // Add event listener to save button 
  setTimeout(enhanceSaveButtons, 2000);
  
  // Create an initial backup
  setTimeout(createInitialBackup, 3000);
  
  return getPublicAPI();
}

function startAutosave(interval) {
  stopAutosave();
  
  console.log(`[FIELD TESTING] Starting autosave with ${interval}ms interval`);
  showNotification(`Autosave enabled (${interval/1000}s interval)`);
  
  autosaveTimer = setInterval(() => {
    if (!currentGetUnsavedChanges || !currentSaveFunction) return;
    
    const hasChanges = currentGetUnsavedChanges();
    
    if (hasChanges) {
      console.log('[FIELD TESTING] Autosaving changes...');
      showNotification('Autosaving...');
      
      currentSaveFunction();
      
      setTimeout(() => {
        try {
          const id = currentGetCurrentId();
          const data = currentGetCurrentData();
          if (id && data) {
            createBackup(id, data);
            showNotification('Autosave complete');
          }
        } catch (error) {
          console.error('[FIELD TESTING] Backup error:', error);
        }
      }, 500);
    }
  }, interval);
}

function stopAutosave() {
  if (autosaveTimer) {
    clearInterval(autosaveTimer);
    autosaveTimer = null;
    console.log('[FIELD TESTING] Autosave stopped');
    showNotification('Autosave disabled');
  }
}

function createNotificationElement() {
  // Create notification element if it doesn't exist
  if (!document.getElementById('field-testing-notification')) {
    const notification = document.createElement('div');
    notification.id = 'field-testing-notification';
    notification.style.position = 'fixed';
    notification.style.bottom = '10px';
    notification.style.right = '10px';
    notification.style.backgroundColor = '#4a4a4a';
    notification.style.color = 'white';
    notification.style.padding = '10px';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '9999';
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s';
    notification.textContent = 'Field Testing Initialized';
    document.body.appendChild(notification);
  }
}

function showNotification(message, duration = 3000) {
  const notification = document.getElementById('field-testing-notification');
  if (notification) {
    notification.textContent = message;
    notification.style.opacity = '1';
    
    setTimeout(() => {
      notification.style.opacity = '0';
    }, duration);
  } else {
    console.log('[FIELD TESTING] ' + message);
  }
}

function enhanceSaveButtons() {
  try {
    const saveButtons = document.querySelectorAll('button');
    saveButtons.forEach(button => {
      if (button.textContent && 
         (button.textContent.includes('Save') || button.textContent.includes('save')) && 
         !button.getAttribute('data-field-testing')) {
        
        const originalClick = button.onclick;
        
        button.onclick = function(e) {
          console.log('[FIELD TESTING] Save button clicked');
          showNotification('Manual save triggered');
          
          if (originalClick) originalClick.call(this, e);
          
          setTimeout(() => {
            const id = currentGetCurrentId();
            const data = currentGetCurrentData();
            if (id && data) {
              createBackup(id, data);
              showNotification('Backup created');
            }
          }, 500);
        };
        
        button.setAttribute('data-field-testing', 'true');
        console.log('[FIELD TESTING] Enhanced save button');
      }
    });
  } catch (error) {
    console.error('[FIELD TESTING] Error enhancing save buttons:', error);
  }
}

function createInitialBackup() {
  try {
    const id = currentGetCurrentId();
    const data = currentGetCurrentData();
    if (id && data) {
      createBackup(id, data);
      console.log('[FIELD TESTING] Initial backup created');
      showNotification('Initial backup created');
    }
  } catch (error) {
    console.error('[FIELD TESTING] Error creating initial backup:', error);
  }
}

function createBackup(assessmentId, data) {
  if (!assessmentId || !data) return false;
  
  try {
    const timestamp = new Date().toISOString();
    const backupId = `${assessmentId}_${timestamp}`;
    const backup = {
      id: backupId,
      assessmentId,
      timestamp,
      data
    };
    
    localStorage.setItem(`${ASSESSMENT_BACKUP}${backupId}`, JSON.stringify(backup));
    console.log(`[FIELD TESTING] Backup created: ${backupId}`);
    
    cleanupBackups(assessmentId, defaultConfig.maxBackups);
    
    return backupId;
  } catch (error) {
    console.error('[FIELD TESTING] Error creating backup:', error);
    return false;
  }
}

function getBackups(assessmentId) {
  if (!assessmentId) return [];
  
  try {
    const backups = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      
      if (key && key.startsWith(ASSESSMENT_BACKUP) && key.includes(assessmentId)) {
        try {
          const backup = JSON.parse(localStorage.getItem(key));
          backups.push(backup);
        } catch (e) {
          console.error('[FIELD TESTING] Error parsing backup:', e);
        }
      }
    }
    
    return backups.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  } catch (error) {
    console.error('[FIELD TESTING] Error getting backups:', error);
    return [];
  }
}

function restoreBackup(backupId) {
  try {
    const backup = localStorage.getItem(`${ASSESSMENT_BACKUP}${backupId}`);
    
    if (!backup) {
      console.error('[FIELD TESTING] Backup not found:', backupId);
      return null;
    }
    
    return JSON.parse(backup).data;
  } catch (error) {
    console.error('[FIELD TESTING] Error restoring backup:', error);
    return null;
  }
}

function cleanupBackups(assessmentId, maxBackups = 5) {
  try {
    const backups = getBackups(assessmentId);
    
    if (backups.length > maxBackups) {
      backups.slice(maxBackups).forEach(backup => {
        localStorage.removeItem(`${ASSESSMENT_BACKUP}${backup.id}`);
      });
      
      console.log(`[FIELD TESTING] Cleaned up ${backups.length - maxBackups} old backups`);
    }
  } catch (error) {
    console.error('[FIELD TESTING] Error cleaning up backups:', error);
  }
}

function getPublicAPI() {
  return {
    isEnabled: true,
    toggleAutosave: (enabled) => {
      if (enabled) {
        startAutosave(defaultConfig.autosaveInterval);
      } else {
        stopAutosave();
      }
    },
    createBackup: () => {
      try {
        const id = currentGetCurrentId();
        const data = currentGetCurrentData();
        if (id && data) {
          return createBackup(id, data);
        }
        return false;
      } catch (e) {
        console.error('[FIELD TESTING] Error creating backup:', e);
        return false;
      }
    },
    getBackups: () => {
      try {
        const id = currentGetCurrentId();
        return getBackups(id);
      } catch (e) {
        console.error('[FIELD TESTING] Error getting backups:', e);
        return [];
      }
    }
  };
}

// Add window-level API for debugging
if (typeof window !== 'undefined') {
  window.fieldTesting = {
    getBackups: () => {
      try {
        const id = currentGetCurrentId();
        return getBackups(id);
      } catch (e) {
        console.error('[FIELD TESTING] Error getting backups:', e);
        return [];
      }
    },
    createBackup: () => {
      try {
        const id = currentGetCurrentId();
        const data = currentGetCurrentData();
        if (id && data) {
          showNotification('Manual backup created');
          return createBackup(id, data);
        }
        return false;
      } catch (e) {
        console.error('[FIELD TESTING] Error creating backup:', e);
        return false;
      }
    },
    toggleAutosave: (enabled) => {
      if (enabled === undefined) {
        const isRunning = !!autosaveTimer;
        if (isRunning) {
          stopAutosave();
        } else {
          startAutosave(defaultConfig.autosaveInterval);
        }
        return !isRunning;
      } else {
        if (enabled) {
          startAutosave(defaultConfig.autosaveInterval);
        } else {
          stopAutosave();
        }
        return enabled;
      }
    }
  };
}
