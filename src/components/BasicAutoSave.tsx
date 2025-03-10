'use client';

import React, { useState, useEffect } from 'react';
import { Save, Clock, CheckCircle, XCircle, WifiOff } from 'lucide-react';

type SaveStatus = 'idle' | 'saving' | 'success' | 'error';

export function BasicAutoSave({ className = '' }) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autosaveEnabled, setAutosaveEnabled] = useState(true);
  
  // Set up autosave timer
  useEffect(() => {
    if (!autosaveEnabled) return;
    
    // Autosave every 30 seconds
    const timer = setInterval(() => {
      if (isOnline) {
        setSaveStatus('saving');
        
        // Simulate save process
        setTimeout(() => {
          setSaveStatus('success');
          setLastSaved(new Date());
          
          // Reset status after 2 seconds
          setTimeout(() => {
            setSaveStatus('idle');
          }, 2000);
        }, 1500);
      }
    }, 30000);
    
    return () => clearInterval(timer);
  }, [autosaveEnabled, isOnline]);
  
  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Format time since last saved
  const getFormattedTime = () => {
    if (!lastSaved) return 'Not yet saved';
    
    const now = new Date();
    const diffMs = now.getTime() - lastSaved.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    
    if (diffSec < 60) return 'Just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)} min ago`;
    
    return lastSaved.toLocaleTimeString();
  };
  
  return (
    <div 
      className={`autosave-indicator ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        borderRadius: '4px',
        fontSize: '14px',
        backgroundColor: !isOnline ? '#fff3cd' : 
                         saveStatus === 'error' ? '#f8d7da' :
                         saveStatus === 'success' ? '#d4edda' :
                         '#f8f9fa',
        color: !isOnline ? '#856404' : 
               saveStatus === 'error' ? '#721c24' :
               saveStatus === 'success' ? '#155724' :
               '#6c757d',
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        border: '1px solid',
        borderColor: !isOnline ? '#ffeeba' : 
                    saveStatus === 'error' ? '#f5c6cb' :
                    saveStatus === 'success' ? '#c3e6cb' :
                    '#e2e3e5',
      }}
    >
      {!isOnline && <WifiOff size={16} />}
      {isOnline && saveStatus === 'idle' && <Save size={16} />}
      {isOnline && saveStatus === 'saving' && (
        <Clock size={16} style={{ animation: 'spin 2s linear infinite' }} />
      )}
      {isOnline && saveStatus === 'success' && <CheckCircle size={16} />}
      {isOnline && saveStatus === 'error' && <XCircle size={16} />}
      
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span>
          {!isOnline ? 'Offline mode' : 
           saveStatus === 'saving' ? 'Autosaving...' :
           saveStatus === 'success' ? 'Saved!' :
           saveStatus === 'error' ? 'Save failed' :
           'Autosave on'}
        </span>
        {lastSaved && (
          <span style={{ fontSize: '12px' }}>
            Last saved: {getFormattedTime()}
          </span>
        )}
      </div>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default BasicAutoSave;