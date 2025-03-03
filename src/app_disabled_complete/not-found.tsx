'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// This provides a friendly error page for App Router routes that don't exist
export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // Instead of automatic redirect, we'll just load once and stay on this page
    console.log('Not found page loaded');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
        <div className="space-y-4">
          <Link href="/" className="text-blue-500 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
