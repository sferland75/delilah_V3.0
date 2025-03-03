'use client';

import { redirect } from 'next/navigation';

// This redirects any App Router paths without specific handlers to the Pages Router root
export default function DefaultPage() {
  redirect('/');
}
