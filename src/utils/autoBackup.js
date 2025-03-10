/**
 * Ultra Simple Auto Backup System for Field Testing
 * 
 * Provides basic data persistence for field testing without requiring UI changes.
 */

// DOM element ID for the notification
const NOTIFICATION_ID = 'auto-backup-notification';

// Storage keys
const BACKUP_PREFIX = 'delilah_backup_';

// Backup interval in ms (10 seconds for testing)
const BACKUP_INTERVAL = 10000;

/**
 * Initialize the auto backup system
 */
export function initAutoBackup() {
  if (typeof window === 'undefined') return;
  
  // Check if already initialized
  if (window.autoBackupInitialized) return;
  window.autoBackupInitialized = true;
  
  console.log('[AUTO BACKUP] Initializing...');
  
  // Create notification element
  createNotification();
  
  // Setup auto backup interval
  setInterval(backupAllFields, BACKUP_INTERVAL);
  
  // Create window methods for testing
  window.autoBackup = {
    backupNow: backupAllFields,
    getBackups: getAllBackups,
    clearAll: clearAllBackups,
    showUI: () => {
      const notification = document.getElementById(NOTIFICATION_ID);
      if (notification) {
        notification.style.display = 'block';
        notification.style.opacity = '0.9';
        notification.innerHTML = `
          <div style="font-weight: bold;">Auto Backup Active</div>
          <div>Backup Interval: ${BACKUP_INTERVAL/1000}s</div>
          <div>Last Backup: ${new Date().toLocaleTimeString()}</div>
          <button id="manual-backup-btn" style="margin-top: 5px; padding: 3px 8px; background: #4a90e2; color: white; border: none; border-radius: 3px;">Manual Backup</button>
        `;
        
        // Add event listener to button
        document.getElementById('manual-backup-btn').onclick = () => {
          backupAllFields();
          showMessage('Manual backup created');
        };
        
        // Hide after 10 seconds
        setTimeout(() => {
          notification.style.opacity = '0';
          setTimeout(() => {
            notification.style.display = 'none';
          }, 500);
        }, 10000);
      }
    }
  };
  
  // Show initial notification
  showMessage('Auto Backup System Activated');
  
  // Create initial backup
  setTimeout(backupAllFields, 3000);
}

/**
 * Create notification element
 */
function createNotification() {
  if (document.getElementById(NOTIFICATION_ID)) return;
  
  const notification = document.createElement('div');
  notification.id = NOTIFICATION_ID;
  notification.style.cssText = `
    position: fixed;
    bottom: 10px;
    right: 10px;
    background-color: #333;
    color: white;
    padding: 10px;
    border-radius: 5px;
    z-index: 9999;
    opacity: 0;
    transition: opacity 0.3s;
    font-family: Arial, sans-serif;
    font-size: 14px;
    max-width: 300px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    display: none;
  `;
  
  document.body.appendChild(notification);
}

/**
 * Show a notification message
 */
function showMessage(message, duration = 3000) {
  const notification = document.getElementById(NOTIFICATION_ID);
  if (!notification) return;
  
  notification.textContent = message;
  notification.style.display = 'block';
  notification.style.opacity = '0.9';
  
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      notification.style.display = 'none';
    }, 500);
  }, duration);
}

/**
 * Backup all form fields and inputs on the page
 */
function backupAllFields() {
  try {
    // Get all form inputs
    const inputs = document.querySelectorAll('input, select, textarea');
    
    if (inputs.length === 0) {
      console.log('[AUTO BACKUP] No form fields found to backup');
      return;
    }
    
    const data = {};
    let changed = false;
    
    // Collect all input values
    inputs.forEach(input => {
      const id = input.id || input.name || Math.random().toString(36).substr(2, 9);
      
      // Get value based on input type
      if (input.type === 'checkbox' || input.type === 'radio') {
        data[id] = input.checked;
      } else if (input.value !== undefined) {
        data[id] = input.value;
        
        // Check if this is a new or changed value
        const oldValue = window.lastBackupData && window.lastBackupData[id];
        if (oldValue !== input.value) {
          changed = true;
        }
      }
    });
    
    // Check if data has changed
    if (!changed && window.lastBackupData) {
      console.log('[AUTO BACKUP] No changes detected, skipping backup');
      return;
    }
    
    // Store current data for future comparison
    window.lastBackupData = {...data};
    
    // Create backup
    const timestamp = new Date().toISOString();
    const backupId = `backup_${timestamp}`;
    
    // Save to localStorage
    localStorage.setItem(`${BACKUP_PREFIX}${backupId}`, JSON.stringify({
      id: backupId,
      timestamp,
      data
    }));
    
    console.log(`[AUTO BACKUP] Created backup ${backupId} with ${Object.keys(data).length} fields`);
    showMessage('Form data backed up');
    
    // Cleanup old backups (keep last 10)
    const backups = getAllBackups();
    if (backups.length > 10) {
      backups.slice(10).forEach(backup => {
        localStorage.removeItem(`${BACKUP_PREFIX}${backup.id}`);
      });
    }
    
    return backupId;
  } catch (error) {
    console.error('[AUTO BACKUP] Error:', error);
    return null;
  }
}

/**
 * Get all stored backups
 */
function getAllBackups() {
  const backups = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    
    if (key && key.startsWith(BACKUP_PREFIX)) {
      try {
        const backup = JSON.parse(localStorage.getItem(key));
        backups.push(backup);
      } catch (e) {
        console.error('[AUTO BACKUP] Error parsing backup:', e);
      }
    }
  }
  
  return backups.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

/**
 * Clear all backups
 */
function clearAllBackups() {
  let count = 0;
  
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    
    if (key && key.startsWith(BACKUP_PREFIX)) {
      localStorage.removeItem(key);
      count++;
    }
  }
  
  console.log(`[AUTO BACKUP] Cleared ${count} backups`);
  return count;
}
