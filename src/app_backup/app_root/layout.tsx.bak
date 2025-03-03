import type { Metadata } from 'next';
import React from 'react';
import { AssessmentProvider } from '@/contexts/AssessmentContext';
import { AuthProvider } from '@/contexts/auth';
import { Toaster } from '@/components/ui/sonner';
import Navbar from '@/components/Navbar';
import './globals.css';
import PdfConfigLoader from '@/components/PdfConfigLoader';

export const metadata: Metadata = {
  title: 'Delilah V3.0 - In-Home Assessment',
  description: 'Core In-Home Assessment System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AssessmentProvider>
            <PdfConfigLoader />
            <Navbar />
            <main className="min-h-screen bg-white">
              {children}
            </main>
            <Toaster />
          </AssessmentProvider>
        </AuthProvider>
      </body>
    </html>
  );
}