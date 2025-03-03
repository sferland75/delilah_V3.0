'use client';

import '../styles/globals.css';
import { IntelligenceProvider } from '../contexts/IntelligenceContext';
import { Toaster } from '../components/ui/sonner';

// This layout is only used for redirection purposes.
// The actual application UI is rendered through the Pages Router.

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <IntelligenceProvider>
          {/* This layout only handles redirects to the Pages Router */}
          {children}
          <Toaster />
        </IntelligenceProvider>
      </body>
    </html>
  );
}
