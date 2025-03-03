import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

/**
 * Navigation component for Delilah V3.0
 */
export default function Navbar() {
  const router = useRouter();
  
  // Helper to check if a link is active
  const isActive = (path) => {
    return router.pathname.startsWith(path) ? 'bg-blue-600' : 'bg-blue-500 hover:bg-blue-600';
  };
  
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div className="text-white font-bold text-xl">Delilah V3.0</div>
          
          <div className="flex space-x-2">
            <Link 
              href="/assessment" 
              className={`px-3 py-2 rounded text-white ${isActive('/assessment')}`}
            >
              Assessments
            </Link>
            
            <Link 
              href="/import-pdf" 
              className={`px-3 py-2 rounded text-white ${isActive('/import-pdf')}`}
            >
              Import PDF
            </Link>
            
            <Link 
              href="/enhanced-import" 
              className={`px-3 py-2 rounded text-white ${isActive('/enhanced-import')}`}
            >
              Enhanced Import
            </Link>
            
            <Link 
              href="/test-ui" 
              className={`px-3 py-2 rounded text-white ${isActive('/test-ui')}`}
            >
              Test UI
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

// Also export as a named export for compatibility with different import styles
export { Navbar };

// Alias the default export as Navbar to enable both import styles
Navbar.default = Navbar;
