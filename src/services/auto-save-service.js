// Auto-save service for field testing
// This service handles data persistence without UI components

let autoSaveInterval = null;
let offlineChanges = [];

// Initialize auto-save
export function initAutoSave(saveFunction, interval = 30000, checkUnsavedFn = null) {
  stopAutoSave(); // Clear any existing intervals
  
  console.log(`Auto-save initialized with ${interval}ms interval`);
  
  autoSaveInterval = setInterval(() => {
    // Check if there are unsaved changes if a check function is provided
    const shouldSave = checkUnsavedFn ? checkUnsavedFn() : true;
    
    if (shouldSave) {
      console.log('Auto-saving data...');
      
      try {
        // If we're online, save directly
        if (navigator.onLine) {
          saveFunction();
          console.log('Auto-save completed');
        } else {
          // If offline, queue the save
          const timestamp = new Date().toISOString();
          offlineChanges.push({ timestamp, saved: false });
          localStorage.setItem('delilah_offline_changes', JSON.stringify(offlineChanges));
          console.log('Offline changes stored for later sync');
        }
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    } else {
      console.log('No changes to auto-save');
    }
  }, interval);
  
  // Set up online/offline handlers
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
  return {
    stop: stopAutoSave,
    setInterval: (newInterval) => {
      stopAutoSave();
      initAutoSave(saveFunction, newInterval, checkUnsavedFn);
    }
  };
}

// Stop auto-save
export function stopAutoSave() {
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval);
    autoSaveInterval = null;
    console.log('Auto-save stopped');
  }
  
  // Remove event listeners
  window.removeEventListener('online', handleOnline);
  window.removeEventListener('offline', handleOffline);
}

// Handle coming back online
function handleOnline() {
  console.log('Connection restored - syncing offline changes');
  
  // Process any offline changes
  try {
    const storedChanges = localStorage.getItem('delilah_offline_changes');
    if (storedChanges) {
      offlineChanges = JSON.parse(storedChanges);
      
      // Mark all as synced
      offlineChanges = offlineChanges.map(change => ({ ...change, saved: true }));
      localStorage.setItem('delilah_offline_changes', JSON.stringify(offlineChanges));
      
      console.log(`Synced ${offlineChanges.length} offline changes`);
    }
  } catch (error) {
    console.error('Error syncing offline changes:', error);
  }
}

// Handle going offline
function handleOffline() {
  console.log('Connection lost - offline mode activated');
}

// Get last saved time
export function getLastSavedTime() {
  try {
    const storedChanges = localStorage.getItem('delilah_offline_changes');
    if (storedChanges) {
      const changes = JSON.parse(storedChanges);
      if (changes.length > 0) {
        // Get the most recent saved change
        const mostRecent = changes
          .filter(change => change.saved)
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
          
        if (mostRecent) {
          return new Date(mostRecent.timestamp);
        }
      }
    }
    return null;
  } catch (error) {
    console.error('Error getting last saved time:', error);
    return null;
  }
}
