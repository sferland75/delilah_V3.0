/**
 * Simple backup system for field testing
 */

// Create a backup of data in localStorage
export function createBackup(id, data) {
  if (!id || !data) return false;
  
  try {
    const timestamp = new Date().toISOString();
    const key = `delilah_backup_${id}_${timestamp}`;
    
    // Store in localStorage
    localStorage.setItem(key, JSON.stringify({
      id: key,
      assessmentId: id,
      timestamp,
      data
    }));
    
    console.log(`Backup created: ${key}`);
    return true;
  } catch (error) {
    console.error('Error creating backup:', error);
    return false;
  }
}

// Get all backups for an assessment
export function getBackups(id) {
  if (!id) return [];
  
  const backups = [];
  const prefix = `delilah_backup_${id}`;
  
  // Find all backups for this ID
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(prefix)) {
      try {
        const backup = JSON.parse(localStorage.getItem(key));
        backups.push(backup);
      } catch (e) {
        console.error('Error parsing backup:', e);
      }
    }
  }
  
  return backups;
}

// Simple expose to window object
if (typeof window !== 'undefined') {
  window.simpleBackup = {
    create: createBackup,
    getAll: getBackups
  };
}
