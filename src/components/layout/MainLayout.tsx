'use client';

import React, { ReactNode } from 'react';
import { Navigation } from '../navigation';
import { Header } from '../header';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 p-4 gap-4">
        <Navigation />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
