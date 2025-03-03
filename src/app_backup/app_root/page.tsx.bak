'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/assessment/initial');
  }, [router]);

  return null;  // No need to render anything as we're redirecting
}