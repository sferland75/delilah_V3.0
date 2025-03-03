'use client';

import React, { useEffect } from 'react';
import { TypicalDayIntegrated } from '@/sections/6-TypicalDay';

const TypicalDayPage = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    
    // Try alternative approach with setTimeout
    const timeoutId = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Typical Day</h2>
        <p className="text-sm text-muted-foreground">Document the client's daily routines and activities before and after the accident</p>
      </div>
      
      <TypicalDayIntegrated />
    </>
  );
};

export default TypicalDayPage;