"use client";

import { useAuth } from '@/context/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      // If user is not authenticated and not on the auth or landing page, redirect to auth page.
      if (pathname !== '/auth' && pathname !== '/') {
        router.push('/auth');
      }
    }
  }, [user, loading, router, pathname]);

  if (loading || !user) {
    // Return null or a loader, but ensure children (the protected content) are not rendered.
    return null;
  }

  return <>{children}</>;
}
