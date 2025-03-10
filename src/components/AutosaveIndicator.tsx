'use client';

import React, { useState, useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';
import { Save, Clock, CheckCircle, XCircle, WifiOff } from 'lucide-react';
import { getFieldTestConfig } from '@/services/field-test-service';

type SaveStatus = 'idle' | 'saving' | 'success' | 'error';

export function AutosaveIndicator() {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showTimestamp, setShowTimestamp] = useState(false);

  const { loading, hasUnsavedChanges } = useAppSelector(state => state.assessments);
  
  // Check if field test autosave is enabled
  const [autosaveEnabled, setAutosaveEnabled] = useState(false);
  
  useEffect(() => {
    const config = getFieldTestConfig();
    setAutosaveEnabled(config.autosaveEnabled);
    
    // Update status when loading state changes
    if (loading.save === 'loading') {
      setSaveStatus('saving');
    } else if (loading.save === 'succeeded') {
      setSaveStatus('success');
      setLastSaved(new Date());
      setTimeout(() => setSaveStatus('idle'), 2000);
    } else if (loading.save === 'failed') {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
    
    // Handle online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [loading.save]);
  
  // Format the last saved time
  const getFormattedTime = () => {
    if (!lastSaved) return 'Never';
    
    const now = new Date();
    const diffMs = now.getTime() - lastSaved.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    
    if (diffSec < 60) return 'Just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)} min ago`;
    
    return lastSaved.toLocaleTimeString();
  };
  
  const getStatusText = () => {
    if (!isOnline) return 'Offline - Changes saved locally';
    if (saveStatus === 'saving') return 'Saving...';
    if (saveStatus === 'success') return 'Saved successfully';
    if (saveStatus === 'error') return 'Save failed';
    
    if (autosaveEnabled) {
      return hasUnsavedChanges ? 'Autosave pending' : 'Autosave enabled';
    }
    
    return hasUnsavedChanges ? 'Unsaved changes' : 'No changes';
  };
  
  return (
    <div 
      className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-md transition-colors"
      onMouseEnter={() => setShowTimestamp(true)}
      onMouseLeave={() => setShowTimestamp(false)}
      style={{
        backgroundColor: !isOnline ? '#fff3cd' : 
                        saveStatus === 'error' ? '#f8d7da' :
                        saveStatus === 'success' ? '#d4edda' :
                        hasUnsavedChanges ? '#e2e8f0' : '#f8f9fa'
      }}
    >
      {!isOnline && <WifiOff size={16} className="text-amber-500" />}
      {isOnline && saveStatus === 'idle' && <Save size={16} className={hasUnsavedChanges ? "text-blue-500" : "text-gray-400"} />}
      {isOnline && saveStatus === 'saving' && <Clock size={16} className="text-blue-500 animate-spin" />}
      {isOnline && saveStatus === 'success' && <CheckCircle size={16} className="text-green-500" />}
      {isOnline && saveStatus === 'error' && <XCircle size={16} className="text-red-500" />}
      
      <span className={!isOnline ? 'text-amber-700' : 
                      saveStatus === 'error' ? 'text-red-700' :
                      saveStatus === 'success' ? 'text-green-700' :
                      hasUnsavedChanges ? 'text-blue-600' : 'text-gray-600'}>
        {showTimestamp && lastSaved ? getFormattedTime() : getStatusText()}
      </span>
    </div>
  );
}

export default AutosaveIndicator;