'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      <p className="text-sm text-slate-600">{message}</p>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-1/3 bg-slate-200 rounded" />
      <div className="space-y-4">
        <div className="h-10 bg-slate-200 rounded" />
        <div className="h-10 bg-slate-200 rounded" />
        <div className="h-20 bg-slate-200 rounded" />
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="border rounded-lg p-4 space-y-4 animate-pulse">
      <div className="h-6 w-1/4 bg-slate-200 rounded" />
      <div className="space-y-3">
        <div className="h-4 bg-slate-200 rounded" />
        <div className="h-4 bg-slate-200 rounded" />
        <div className="h-4 w-3/4 bg-slate-200 rounded" />
      </div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="border rounded-lg animate-pulse">
      <div className="border-b p-4 bg-slate-50">
        <div className="h-6 w-1/4 bg-slate-200 rounded" />
      </div>
      <div className="p-4 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="h-4 w-1/4 bg-slate-200 rounded" />
            <div className="h-4 w-1/4 bg-slate-200 rounded" />
            <div className="h-4 w-1/4 bg-slate-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}