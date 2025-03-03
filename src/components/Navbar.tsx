import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

/**
 * Navigation component for Delilah V3.0
 */
export default function Navbar() {
  const router = useRouter();
  
  // Helper to check if a link is active
  const isActive = (path: string) => {
    return router.pathname.startsWith(path) ? 'bg-blue-600' : 'bg-blue-500 hover:bg-blue-600';
  };
  
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-white font-bold text-xl">Delilah V3.0</Link>
          
          <div className="flex space-x-2">
            <Link 
              href="/full-assessment" 
              className={`px-3 py-2 rounded text-white ${isActive('/full-assessment')}`}
            >
              Full Assessment
            </Link>
            
            <Link 
              href="/assessment" 
              className={`px-3 py-2 rounded text-white ${isActive('/assessment')}`}
            >
              Dashboard
            </Link>
            
            <Link 
              href="/import-pdf" 
              className={`px-3 py-2 rounded text-white ${isActive('/import-pdf')}`}
            >
              Import PDF
            </Link>
            
            <Link 
              href="/report-drafting" 
              className={`px-3 py-2 rounded text-white ${isActive('/report-drafting')}`}
            >
              Reports
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
