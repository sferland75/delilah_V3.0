'use client';

import React from 'react';
import { AssessmentProvider } from '@/contexts/AssessmentContext';

// Import directly from components folder to avoid any routing issues
const TypicalDayTest = () => {
  // Dynamically import to avoid any module resolution issues
  const [Component, setComponent] = React.useState<React.ComponentType | null>(null);
  
  React.useEffect(() => {
    // Use dynamic import to get the component
    import('@/sections/6-TypicalDay/components/TypicalDay.integrated')
      .then(module => {
        console.log("Successfully imported TypicalDay component", module);
        setComponent(() => module.default);
      })
      .catch(error => {
        console.error("Failed to import TypicalDay component:", error);
      });
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Simple Typical Day Test</h1>
      
      <AssessmentProvider>
        <div className="bg-white rounded-lg shadow-md p-6">
          {Component ? <Component /> : <p>Loading component...</p>}
        </div>
      </AssessmentProvider>
    </div>
  );
};

export default TypicalDayTest;