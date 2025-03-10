'use client';

import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showBanner, setShowBanner] = useState(false);
  
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Show the banner briefly when coming back online
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 5000);
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setShowBanner(true);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check initial state
    if (!navigator.onLine) {
      setShowBanner(true);
    }
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  if (!showBanner) return null;
  
  return (
    <div
      style={{
        position: 'fixed',
        top: isOnline ? '20px' : '0',
        left: '0',
        right: '0',
        padding: '12px',
        backgroundColor: isOnline ? '#d4edda' : '#fff3cd',
        color: isOnline ? '#155724' : '#856404',
        textAlign: 'center',
        zIndex: 1001,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        transition: 'all 0.3s ease',
      }}
    >
      {isOnline ? (
        <>
          <Wifi size={16} />
          Connection restored. Data will be synchronized.
        </>
      ) : (
        <>
          <WifiOff size={16} />
          You are offline. Changes will be saved locally.
        </>
      )}
      
      <button
        onClick={() => setShowBanner(false)}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          marginLeft: '10px',
          fontSize: '16px',
          fontWeight: 'bold',
        }}
      >
        ×
      </button>
    </div>
  );
}

export default OfflineIndicator;