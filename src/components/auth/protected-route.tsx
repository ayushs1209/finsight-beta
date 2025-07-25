"use client";

import { useAuth } from '@/context/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    // If there's no user, they should only be able to access the landing page or the auth page.
    // Redirect them to the auth page if they try to access anything else.
    if (!user && pathname !== '/' && pathname !== '/auth') {
      router.push('/auth');
    }
  }, [user, loading, router, pathname]);

  // While loading, or if a user is not authenticated and on a protected page,
  // don't render the children. A loading indicator or null is appropriate.
  if (loading || !user) {
    return null;
  }

  return <>{children}</>;
}
